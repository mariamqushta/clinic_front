import "./Profile.css";
import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";
import {
  FaTachometerAlt,
  FaCalendarAlt,
  FaComments,
  FaUserCircle,
  FaSignOutAlt,
  FaPen,
} from "react-icons/fa";

function Profile() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [editing, setEditing] = useState(false);
  const [backupUser, setBackupUser] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get("/auth/profile");
        setUser(res.data.data.user);
      } catch (err) {
        console.log(err);
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setUser((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // ✅ avatar upload (SAFE)
  const handleImageUpload = (file) => {
    if (!file) return;

    const reader = new FileReader();

    reader.onloadend = async () => {
      const base64 = reader.result;

      try {
        const res = await api.patch(`/users/${user._id}`, {
            avatarUrl: base64,
          });

        setUser(res.data.data.user);
      } catch (err) {
        console.log(err);
        alert("Upload failed");
      }
    };

    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    if (!editing) {
      setBackupUser(user);
      setEditing(true);
      return;
    }

    try {
      const res = await api.patch(`/users/${user._id}`, {
          name: user.name,
          phone: user.phone,
          avatarUrl: user.avatarUrl,
        });

      setUser(res.data.data.user);
      setEditing(false);

      alert("Profile updated!");
    } catch (err) {
      console.log(err);

      // rollback
      if (backupUser) setUser(backupUser);

      alert("Update failed");
    }
  };

  if (!user) return <p>Loading...</p>;

  return (
    <div className="layout">

      {/* SIDEBAR */}
      <div className="sidebar">
        <h1 className="logo">Odonto</h1>

        <ul>
          <li onClick={() => navigate("/home")} style={{ cursor: "pointer" }}>
            <FaTachometerAlt /> Dashboard
          </li>

          <li onClick={() => navigate("/appointments")} style={{ cursor: "pointer" }}>
            <FaCalendarAlt /> Appointments
          </li>

          <li onClick={() => navigate("/chat")} style={{ cursor: "pointer" }}>
            <FaComments /> Chats
          </li>

          <li className="active" onClick={() => navigate("/profile")} style={{ cursor: "pointer" }}>
            <FaUserCircle /> Profile
          </li>

          <li
            className="logout"
            onClick={() => {
              localStorage.clear();
              navigate("/login");
            }}
            style={{ cursor: "pointer" }}
          >
            <FaSignOutAlt /> Log out
          </li>
        </ul>
      </div>

      {/* CONTENT */}
      <div className="content">

        <div className="profile-card">

          <div className="doctor-image">

            {user.avatarUrl ? (
              <img
                src={user.avatarUrl}
                alt="user"
                onClick={() => fileInputRef.current?.click()}
                style={{
                  width: "100px",
                  height: "100px",
                  borderRadius: "50%",
                  cursor: "pointer"
                }}
              />
            ) : (
              <FaUserCircle
                className="doctor-icon"
                onClick={() => fileInputRef.current?.click()}
                style={{ cursor: "pointer" }}
              />
            )}

            <input
              type="file"
              ref={fileInputRef}
              style={{ display: "none" }}
              accept="image/*"
              onChange={(e) => handleImageUpload(e.target.files[0])}
            />
          </div>

          <div className="doctor-info">

            <div className="top-row">
              <h3>{user.name}</h3>

              <FaPen
                className="edit-icon"
                onClick={() => {
                  setBackupUser(user);
                  setEditing(true);
                }}
                style={{ cursor: "pointer" }}
              />
            </div>

            <h4>{user.role}</h4>
          </div>

        </div>

        {/* FORM */}
        <div className="form">

          <label>Name</label>
          <input
            name="name"
            value={user.name || ""}
            onChange={handleChange}
            disabled={!editing}
          />

          <label>Email</label>
          <input value={user.email || ""} disabled />

          <label>Phone</label>
          <input
            name="phone"
            value={user.phone || ""}
            onChange={handleChange}
            disabled={!editing}
          />

          <button className="save-btn" onClick={handleSave}>
            {editing ? "Save Changes" : "Edit Profile"}
          </button>

        </div>

      </div>
    </div>
  );
}

export default Profile;