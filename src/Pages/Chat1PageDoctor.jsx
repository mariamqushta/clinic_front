import { useState } from "react";
import { NavLink } from "react-router-dom";
import "./Chat1PageDoctor.css";

import avatarOnline from "../assets/chat1-doctor/avatar-online.png";
import avatarAway from "../assets/chat1-doctor/avatar-away.png";
import avatarBusy from "../assets/chat1-doctor/avatar-busy.png";

const initialMessages = [
  {
    id: 2,
    text: "Hello 👋 How can we help you?",
    time: "10:40 AM",
    sender: "doctor",
  },
];

const contacts = [
  { id: 1, name: "Ahmed Mohamed", status: "online", avatar: avatarOnline },
  { id: 2, name: "Mona Ali", status: "away", avatar: avatarAway },
  { id: 3, name: "Youssef Adel", status: "busy", avatar: avatarBusy },
];

function Avatar({ src, status, active = false, alt = "avatar" }) {
  return (
    <div className={`doctor-chat1-avatar ${active ? "is-active" : ""}`}>
      <img className="doctor-chat1-avatar__img" src={src} alt={alt} />
      <span className={`doctor-chat1-avatar__dot ${status}`}></span>
    </div>
  );
}

export default function Chat1PageDoctor() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState(initialMessages);

  const handleSend = (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    const newMessage = {
      id: Date.now(),
      text: message.trim(),
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      sender: "doctor",
    };

    setMessages((prev) => [...prev, newMessage]);
    setMessage("");
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
            to="/doctor-chat-1"
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
        <header className="doctor-chat1-topBar">
          <div className="doctor-chat1-topContacts">
            {contacts.map((contact, index) => (
              <button
                key={contact.id}
                className="doctor-chat1-topContact"
                type="button"
              >
                <Avatar
                  src={contact.avatar}
                  status={contact.status}
                  active={index === 0}
                  alt={contact.name}
                />
              </button>
            ))}
          </div>
        </header>

        <section className="doctor-chat1-chatHeader">
          <Avatar
            src={avatarOnline}
            status="online"
            active
            alt="Ahmed Mohamed"
          />
          <div className="doctor-chat1-chatHeaderText">
            <h2>Ahmed Mohamed</h2>
            <span>Online</span>
          </div>
        </section>

        <section className="doctor-chat1-messages">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`doctor-chat1-messageRow ${
                msg.sender === "doctor"
                  ? "doctor-chat1-messageRow--doctor"
                  : "doctor-chat1-messageRow--patient"
              }`}
            >
              <div
                className={`doctor-chat1-bubble ${
                  msg.sender === "doctor"
                    ? "doctor-chat1-bubble--doctor"
                    : "doctor-chat1-bubble--patient"
                }`}
              >
                {msg.text}
              </div>

              <div className="doctor-chat1-time">{msg.time}</div>
            </div>
          ))}
        </section>

        <form className="doctor-chat1-composer" onSubmit={handleSend}>
          <div className="doctor-chat1-inputWrap">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type your Message...."
            />
            <button
              type="button"
              className="doctor-chat1-attachBtn"
              aria-label="Attach file"
            >
              📎
            </button>
          </div>

          <button type="submit" className="doctor-chat1-sendBtn">
            Send
          </button>
        </form>
      </main>
    </div>
  );
}