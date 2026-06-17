import React, { useState } from "react";
import "./Chat1PagePatient.css";

import { 
  FaHouse, 
  FaRegCalendar, 
  FaRegCommentDots, 
  FaRobot, 
  FaRegUser, 
  FaPaperclip 
} from "react-icons/fa6";

export default function Chat1PagePatient() {
  const [messages, setMessages] = useState([
    { 
      id: 1, 
      side: "left", 
      text: "Hello 👋 How can we help you?", 
      time: "10:40 AM" 
    }
  ]);
  
  const [input, setInput] = useState("");

  const sendMessage = () => {
    if (!input.trim()) return;
    
    setMessages((prev) => [
      ...prev,
      {
        id: Date.now(),
        side: "right",
        text: input,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
    setInput("");
  };
  return (
    <div className="chatApp">
      <aside className="sidebar">
        <div className="brand">Odonto</div>
        <nav className="nav">
          <a className="nav-item" href="/home"><FaHouse className="icon" /> Home</a>
          <a className="nav-item" href="/appointments"><FaRegCalendar className="icon" /> Appointments</a>
          <a className="nav-item active" href="/chat1-patient"><FaRegCommentDots className="icon" /> Chat</a>
          <a className="nav-item" href="#"><FaRobot className="icon" /> Ai Assistant</a>
          <a className="nav-item" href="/profile"><FaRegUser className="icon" /> Profile</a>
        </nav>
      </aside>

      <main className="chatMain">
        <div className="topAvatars">
          <img src="../../public/chat1-patient/avatar1.jpg" alt="" className="topAvatar" />
          <img src="../../public/chat1-patient/avatar2.jpg" alt="" className="topAvatar" />
          <img src="../../public/chat1-patient/avatar3.jpg" alt="" className="topAvatar" />
        </div>

        <div className="chatHeader">
          <img src="../../public/chat1-patient/avatar1.jpg" alt="Ahmed Mohamed" className="headerAvatar" />
          <div>
            <h2>Ahmed Mohamed</h2>
            <p className="online">Online</p>
          </div>
        </div>

        <div className="messagesArea">
          {messages.map((msg) => (
            <div key={msg.id} className={`message ${msg.side}`}>
              <div className={`bubble ${msg.side}`}>{msg.text}</div>
              <span className="time">{msg.time}</span>
            </div>
          ))}
        </div>

        <div className="inputArea">
          <div className="inputWrapper">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && sendMessage()}
              placeholder="Type your Message...."
            />
            <button className="attach"><FaPaperclip /></button>
          </div>
          <button className="sendBtn" onClick={sendMessage}>Send</button>
        </div>
      </main>
    </div>
  );
}