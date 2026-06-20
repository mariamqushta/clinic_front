import { useState, useEffect, useRef } from "react";
import { NavLink } from "react-router-dom";
import "./Chat1PageDoctor.css";
import { io } from "socket.io-client";
import api from "../api/api";
import toast from "react-hot-toast";
import { FaEllipsisV, FaEdit, FaTrash } from "react-icons/fa";

function Avatar({ src, status, active = false, alt = "avatar" }) {
  return (
    <div className={`doctor-chat1-avatar ${active ? "is-active" : ""}`}>
      <img className="doctor-chat1-avatar__img" src={src} alt={alt} style={{ objectFit: "cover" }} />
      {status && <span className={`doctor-chat1-avatar__dot ${status}`}></span>}
    </div>
  );
}

export default function Chat1PageDoctor() {
  const [chats, setChats] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
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
      if (activeChatRef.current) {
        socketRef.current.emit("joinChat", activeChatRef.current._id);
      }
    });

    socketRef.current.on("newMessage", (msg) => {
      setMessages((prev) => [...prev, msg]);
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
      socketRef.current.emit("joinChat", activeChat._id);
    }

    return () => {
      if (socketRef.current) {
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

  const handleSend = async (e) => {
    e.preventDefault();
    if ((!message.trim() && !file) || !activeChat) return;

    try {
      if (editingMessageId) {
        await api.patch(`/messages/${editingMessageId}`, { content: message });
        setEditingMessageId(null);
        setMessage("");
      } else {
        await api.post("/messages", {
          chatId: activeChat._id,
          content: message,
          ...(file && file),
        });
        setMessage("");
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
    setMessage(msg.content);
    setOpenMenuId(null);
    setFile(null);
  };

  return (
    <div className="doctor-chat1-page">
      <aside className="doctor-chat1-sidebar">
        <div className="doctor-chat1-brand">Odonto</div>

        <nav className="doctor-chat1-nav">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `doctor-chat1-navItem ${isActive ? "is-active" : ""}`
            }
          >
            <span className="doctor-chat1-navIcon">📊</span>
            <span>Dashboard</span>
          </NavLink>

          <NavLink
            to="/appointments"
            className={({ isActive }) =>
              `doctor-chat1-navItem ${isActive ? "is-active" : ""}`
            }
          >
            <span className="doctor-chat1-navIcon">📅</span>
            <span>Appointments</span>
          </NavLink>

          <NavLink
            to="/chat"
            className={({ isActive }) =>
              `doctor-chat1-navItem ${isActive ? "is-active" : ""}`
            }
          >
            <span className="doctor-chat1-navIcon">💬</span>
            <span>Chats</span>
          </NavLink>

          <NavLink
            to="/dr-profile"
            className={({ isActive }) =>
              `doctor-chat1-navItem ${isActive ? "is-active" : ""}`
            }
          >
            <span className="doctor-chat1-navIcon">👤</span>
            <span>Profile</span>
          </NavLink>

          <NavLink
            to="/LoginDr"
            className="doctor-chat1-navItem doctor-chat1-navItem--logout"
          >
            <span className="doctor-chat1-navIcon">⎋</span>
            <span>Log out</span>
          </NavLink>
        </nav>
      </aside>

      <main className="doctor-chat1-main">
        {chats.length === 0 ? (
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%" }}>
            <h3>No active chats found.</h3>
          </div>
        ) : (
          <>
            <header className="doctor-chat1-topBar">
              <div className="doctor-chat1-topContacts">
                {chats.map((chat) => (
                  <button
                    key={chat._id}
                    className="doctor-chat1-topContact"
                    type="button"
                    onClick={() => setActiveChat(chat)}
                  >
                    <Avatar
                      src={chat.patientId?.avatarUrl || `https://ui-avatars.com/api/?name=${chat.patientId?.name || "User"}&background=random`}
                      active={activeChat?._id === chat._id}
                      alt={chat.patientId?.name}
                    />
                  </button>
                ))}
              </div>
            </header>

            {activeChat && (
              <>
                <section className="doctor-chat1-chatHeader">
                  <Avatar
                    src={activeChat.patientId?.avatarUrl || `https://ui-avatars.com/api/?name=${activeChat.patientId?.name || "User"}&background=random`}
                    status="online"
                    active
                    alt={activeChat.patientId?.name}
                  />
                  <div className="doctor-chat1-chatHeaderText">
                    <h2>{activeChat.patientId?.name}</h2>
                    <span>Online</span>
                  </div>
                </section>

                <section className="doctor-chat1-messages" onClick={() => setOpenMenuId(null)}>
                  {messages.map((msg) => {
                    const isDoctor = msg.senderRole === "doctor";
                    return (
                      <div
                        key={msg._id}
                        className={`doctor-chat1-messageRow ${
                          isDoctor
                            ? "doctor-chat1-messageRow--doctor"
                            : "doctor-chat1-messageRow--patient"
                        }`}
                      >
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                          {!isDoctor && (
                            <div className={`doctor-chat1-bubble ${
                              isDoctor
                                ? "doctor-chat1-bubble--doctor"
                                : "doctor-chat1-bubble--patient"
                            }`}>
                              {msg.fileData && (
                                <div className="mb-2">
                                  {msg.fileType?.startsWith("image/") ? (
                                    <img src={msg.fileData} alt="attachment" style={{ maxWidth: '200px', borderRadius: '8px' }} />
                                  ) : (
                                    <a href={msg.fileData} download={msg.fileName} target="_blank" rel="noreferrer" style={{ color: isDoctor ? '#fff' : '#0d6efd', textDecoration: 'underline' }}>
                                      📎 {msg.fileName}
                                    </a>
                                  )}
                                </div>
                              )}
                              {msg.content}
                            </div>
                          )}

                          {isDoctor && (
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

                          {isDoctor && (
                            <div className={`doctor-chat1-bubble ${
                              isDoctor
                                ? "doctor-chat1-bubble--doctor"
                                : "doctor-chat1-bubble--patient"
                            }`}>
                              {msg.fileData && (
                                <div className="mb-2">
                                  {msg.fileType?.startsWith("image/") ? (
                                    <img src={msg.fileData} alt="attachment" style={{ maxWidth: '200px', borderRadius: '8px' }} />
                                  ) : (
                                    <a href={msg.fileData} download={msg.fileName} target="_blank" rel="noreferrer" style={{ color: isDoctor ? '#fff' : '#0d6efd', textDecoration: 'underline' }}>
                                      📎 {msg.fileName}
                                    </a>
                                  )}
                                </div>
                              )}
                              {msg.content}
                            </div>
                          )}
                        </div>

                        <div className="doctor-chat1-time">
                          {new Date(msg.createdAt).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                          {msg.isEdited && <span className="ms-1" style={{ fontSize: '0.8em', fontStyle: 'italic' }}>(edited)</span>}
                        </div>
                      </div>
                    );
                  })}
                  <div ref={messagesEndRef} />
                </section>

                <form className="doctor-chat1-composer position-relative" onSubmit={handleSend}>
                  {file && (
                    <div className="position-absolute" style={{ top: '-40px', left: '10px', background: '#f0f0f0', padding: '5px 10px', borderRadius: '5px', display: 'flex', alignItems: 'center' }}>
                      <span className="me-2" style={{ maxWidth: '150px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>📎 {file.fileName}</span>
                      <button type="button" className="btn-close btn-sm" onClick={() => setFile(null)}></button>
                    </div>
                  )}
                  {editingMessageId && (
                    <div className="position-absolute" style={{ top: '-40px', left: '10px', background: '#fff3cd', padding: '5px 10px', borderRadius: '5px', display: 'flex', alignItems: 'center', color: '#856404' }}>
                      <span className="me-2 fw-bold">Editing message...</span>
                      <button type="button" className="btn-close btn-sm" onClick={() => { setEditingMessageId(null); setMessage(""); }}></button>
                    </div>
                  )}

                  <div className="doctor-chat1-inputWrap">
                    <input
                      type="text"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder={editingMessageId ? "Edit your message..." : "Type your Message...."}
                    />
                    <input 
                      type="file" 
                      ref={fileInputRef} 
                      style={{ display: 'none' }} 
                      onChange={handleFileChange} 
                    />
                    <button
                      type="button"
                      className="doctor-chat1-attachBtn"
                      aria-label="Attach file"
                      onClick={() => !editingMessageId && fileInputRef.current.click()}
                      disabled={!!editingMessageId}
                    >
                      📎
                    </button>
                  </div>

                  <button type="submit" className="doctor-chat1-sendBtn">
                    {editingMessageId ? "Update" : "Send"}
                  </button>
                </form>
              </>
            )}
          </>
        )}
      </main>
    </div>
  );
}