import "./Profile.css";
import { FaUserCircle } from "react-icons/fa";

function Profile() {
  return (
    <div className="layout">

      {/* Sidebar */}
      <div className="sidebar">
        <h2 className="logo">Odonto</h2>

        <ul>
          <li>🏠 Home</li>
          <li>📅 Appointments</li>
          <li>💬 Chat</li>
          <li>🤖 AI Assistant</li>
          <li className="active">👤 Profile</li>
          <li>🚪 Log out</li>
        </ul>
      </div>

      {/* Content */}
      <div className="content">

        {/* Profile Card */}
        <div className="profile-card">

          <FaUserCircle className="avatar" />

          <div className="info">
            <h3>Yara Ahmed</h3>
            <p>Patient</p>
          </div>

        </div>

        {/* Form */}
        <div className="form">

          <label>Name</label>
          <input type="text" defaultValue="Yara Ahmed Ali AMR" />

          <label>Email</label>
          <input type="email" defaultValue="Ya@gmail.com" />

          <label>Phone</label>
          <input type="text" defaultValue="0102345798" />

          <label>Date of Birth</label>
          <input type="date" />

          <button className="save-btn">Save Changes</button>

        </div>

      </div>

    </div>
  );
}

export default Profile;