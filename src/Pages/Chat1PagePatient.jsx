import React, { useState, useEffect, useRef } from "react";
import "./Chat1PagePatient.css";
import { io } from "socket.io-client";
import api from "../api/api";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

import { 
  FaHouse, 
  FaRegCalendar, 
  FaRegCommentDots, 
  FaRobot, 
  FaRegUser, 
  FaPaperclip
} from "react-icons/fa6";

import {
  FaEllipsisV,
  FaEdit,
  FaTrash
} from "react-icons/fa";

export default function Chat1PagePatient() {
  const [chats, setChats] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [file, setFile] = useState(null);
  const [editingMessageId, setEditingMessageId] = useState(null);
  const [openMenuId, setOpenMenuId] = useState(null);
  const fileInputRef = useRef(null);

  const socketRef = useRef(null);
  const messagesEndRef = useRef(null);
  const activeChatRef = useRef(activeChat);

  useEffect(() => {
    activeChatRef.current = activeChat;
  }, [activeChat]);

  // Fetch all chats
  useEffect(() => {
    const fetchChats = async () => {
      try {
        const res = await api.get("/chats");
        setChats(res.data.data || []);
        if (res.data.data && res.data.data.length > 0) {
          setActiveChat(res.data.data[0]);
        }
      } catch (err) {
        console.log("Error fetching chats:", err);
      }
    };
    fetchChats();
  }, []);

  // Socket Initialization
  useEffect(() => {
    const token = localStorage.getItem("token");
    socketRef.current = io("http://localhost:3000", {
      query: { token },
    });

    socketRef.current.on("connect", () => {
      console.log("Socket connected! ID:", socketRef.current.id);
      if (activeChatRef.current) {
        console.log("Emitting joinChat for activeChatRef:", activeChatRef.current._id);
        socketRef.current.emit("joinChat", activeChatRef.current._id);
      }
    });

    socketRef.current.on("newMessage", (message) => {
      console.log("Received newMessage:", message);
      setMessages((prev) => [...prev, message]);
    });

    socketRef.current.on("messageEdited", (updatedMsg) => {
      setMessages((prev) => prev.map(m => m._id === updatedMsg._id ? updatedMsg : m));
    });

    socketRef.current.on("messageDeleted", (deletedMsgId) => {
      setMessages((prev) => prev.filter(m => m._id !== deletedMsgId));
    });

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, []);

  // Fetching messages and joining room when activeChat changes
  useEffect(() => {
    if (!activeChat) return;
    
    console.log("activeChat changed! New ID:", activeChat._id);

    const fetchMessages = async () => {
      try {
        const res = await api.get(`/messages/${activeChat._id}?limit=30`);
        setMessages(res.data.data.reverse() || []); // newest at bottom
        
        // mark chat as read
        await api.patch(`/chats/${activeChat._id}/markAsRead`);
      } catch (err) {
        console.log("Error fetching messages:", err);
      }
    };

    fetchMessages();

    if (socketRef.current) {
      console.log("Emitting joinChat from activeChat effect:", activeChat._id);
      socketRef.current.emit("joinChat", activeChat._id);
    }

    return () => {
      if (socketRef.current) {
        console.log("Cleaning up activeChat effect, emitting leaveChat:", activeChat._id);
        socketRef.current.emit("leaveChat", activeChat._id);
      }
    };
  }, [activeChat]);



  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const compressImage = (file) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target.result;
        img.onload = () => {
          const canvas = document.createElement("canvas");
          const MAX_WIDTH = 800;
          let width = img.width;
          let height = img.height;

          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext("2d");
          ctx.drawImage(img, 0, 0, width, height);

          // Compress to 70% quality JPEG
          const dataUrl = canvas.toDataURL("image/jpeg", 0.7);
          resolve(dataUrl);
        };
      };
      reader.readAsDataURL(file);
    });
  };

  const handleFileChange = async (e) => {
    const selected = e.target.files[0];
    if (selected) {
      if (selected.type.startsWith("image/")) {
        const compressedDataUrl = await compressImage(selected);
        setFile({
          fileData: compressedDataUrl,
          fileName: selected.name,
          fileType: "image/jpeg",
        });
      } else {
        if (selected.size > 3 * 1024 * 1024) {
          toast.error("Document size must be under 3MB");
          return;
        }
        const reader = new FileReader();
        reader.onloadend = () => {
          setFile({
            fileData: reader.result,
            fileName: selected.name,
            fileType: selected.type,
          });
        };
        reader.readAsDataURL(selected);
      }
    }
  };

  const sendMessage = async () => {
    if ((!input.trim() && !file) || !activeChat) return;

    try {
      if (editingMessageId) {
        await api.patch(`/messages/${editingMessageId}`, { content: input });
        setEditingMessageId(null);
        setInput("");
      } else {
        await api.post("/messages", {
          chatId: activeChat._id,
          content: input,
          ...(file && file),
        });
        setInput("");
        setFile(null);
      }
    } catch (err) {
      toast.error("Failed to send message");
      console.log("Error sending message:", err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this message?")) return;
    try {
      await api.delete(`/messages/${id}`);
      setOpenMenuId(null);
    } catch (err) {
      toast.error("Failed to delete message");
    }
  };

  const handleEdit = (msg) => {
    setEditingMessageId(msg._id);
    setInput(msg.content);
    setOpenMenuId(null);
    setFile(null); // Can't edit files
  };

  return (
    <div className="chatApp">
      <aside className="sidebar">
        <div className="brand">Odonto</div>
        <nav className="nav">
          <Link className="nav-item" to="/home"><FaHouse className="icon" /> Home</Link>
          <Link className="nav-item" to="/appointments"><FaRegCalendar className="icon" /> Appointments</Link>
          <Link className="nav-item active" to="/chat"><FaRegCommentDots className="icon" /> Chat</Link>
          <Link className="nav-item" to="#"><FaRobot className="icon" /> Ai Assistant</Link>
          <Link className="nav-item" to="/profile"><FaRegUser className="icon" /> Profile</Link>
        </nav>
      </aside>

      <main className="chatMain">
        {chats.length === 0 ? (
          <div className="d-flex justify-content-center align-items-center h-100">
            <h3>No active chats found. Please book a doctor to start chatting.</h3>
          </div>
        ) : (
          <>
            <div className="topAvatars">
              {chats.map((chat) => (
                <img 
                  key={chat._id}
                  src={chat.doctorId?.avatarUrl || `https://ui-avatars.com/api/?name=${chat.doctorId?.name || "Dr"}&background=random`} 
                  alt={chat.doctorId?.name} 
                  className={`topAvatar ${activeChat?._id === chat._id ? "border border-primary border-3" : ""}`} 
                  onClick={() => setActiveChat(chat)}
                  style={{ cursor: "pointer", objectFit: "cover" }}
                />
              ))}
            </div>

            {activeChat && (
              <>
                <div className="chatHeader">
                  <img 
                    src={activeChat.doctorId?.avatarUrl || `https://ui-avatars.com/api/?name=${activeChat.doctorId?.name || "Dr"}&background=random`} 
                    alt={activeChat.doctorId?.name} 
                    className="headerAvatar" 
                    style={{ objectFit: "cover" }}
                  />
                  <div>
                    <h2>Dr. {activeChat.doctorId?.name}</h2>
                    <p className="online">Online</p>
                  </div>
                </div>

                <div className="messagesArea" onClick={() => setOpenMenuId(null)}>
                  {messages.map((msg) => {
                    const isPatient = msg.senderRole === "patient";
                    return (
                      <div key={msg._id} className={`message ${isPatient ? "right" : "left"}`}>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: isPatient ? 'flex-end' : 'flex-start' }}>
                          <div style={{ display: 'flex', alignItems: 'center' }}>
                            {isPatient && (
                              <div style={{ position: 'relative', marginRight: '5px' }}>
                                <button className="btn btn-sm text-secondary border-0 bg-transparent" onClick={(e) => { e.stopPropagation(); setOpenMenuId(openMenuId === msg._id ? null : msg._id); }}>
                                  <FaEllipsisV />
                                </button>
                                {openMenuId === msg._id && (
                                  <div style={{ position: 'absolute', right: '100%', top: 0, background: 'white', border: '1px solid #ddd', borderRadius: '5px', zIndex: 10, display: 'flex', flexDirection: 'column' }}>
                                    <button className="btn btn-sm text-primary text-start border-0" onClick={(e) => { e.stopPropagation(); handleEdit(msg); }}><FaEdit className="me-2"/> Edit</button>
                                    <button className="btn btn-sm text-danger text-start border-0" onClick={(e) => { e.stopPropagation(); handleDelete(msg._id); }}><FaTrash className="me-2"/> Delete</button>
                                  </div>
                                )}
                              </div>
                            )}

                            <div className={`bubble ${isPatient ? "right" : "left"}`}>
                              {msg.fileData && (
                                <div className="mb-2">
                                  {msg.fileType?.startsWith("image/") ? (
                                    <img src={msg.fileData} alt="attachment" style={{ maxWidth: '100%', borderRadius: '8px' }} />
                                  ) : (
                                    <a href={msg.fileData} download={msg.fileName} target="_blank" rel="noreferrer" style={{ color: isPatient ? '#fff' : '#0d6efd', textDecoration: 'underline' }}>
                                      📎 {msg.fileName}
                                    </a>
                                  )}
                                </div>
                              )}
                              {msg.content}
                            </div>
                          </div>
                          <span className="time">
                            {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            {msg.isEdited && <span className="ms-1" style={{ fontSize: '0.8em', fontStyle: 'italic' }}>(edited)</span>}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                  <div ref={messagesEndRef} />
                </div>

                <div className="inputArea position-relative">
                  {file && (
                    <div className="position-absolute" style={{ top: '-40px', left: '10px', background: '#f0f0f0', padding: '5px 10px', borderRadius: '5px', display: 'flex', alignItems: 'center' }}>
                      <span className="me-2" style={{ maxWidth: '150px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>📎 {file.fileName}</span>
                      <button className="btn-close btn-sm" onClick={() => setFile(null)}></button>
                    </div>
                  )}
                  {editingMessageId && (
                    <div className="position-absolute" style={{ top: '-40px', left: '10px', background: '#fff3cd', padding: '5px 10px', borderRadius: '5px', display: 'flex', alignItems: 'center', color: '#856404' }}>
                      <span className="me-2 fw-bold">Editing message...</span>
                      <button className="btn-close btn-sm" onClick={() => { setEditingMessageId(null); setInput(""); }}></button>
                    </div>
                  )}
                  <div className="inputWrapper">
                    <input
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyPress={(e) => e.key === "Enter" && sendMessage()}
                      placeholder={editingMessageId ? "Edit your message..." : "Type your Message...."}
                    />
                    <input 
                      type="file" 
                      ref={fileInputRef} 
                      style={{ display: 'none' }} 
                      onChange={handleFileChange} 
                    />
                    <button className="attach" onClick={() => !editingMessageId && fileInputRef.current.click()} disabled={!!editingMessageId}>
                      <FaPaperclip />
                    </button>
                  </div>
                  <button className="sendBtn" onClick={sendMessage}>{editingMessageId ? "Update" : "Send"}</button>
                </div>
              </>
            )}
          </>
        )}
      </main>
    </div>
  );
}