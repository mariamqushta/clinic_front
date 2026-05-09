import "./Profile.css";
import {
  FaTachometerAlt,
  FaCalendarAlt,
  FaComments,
  FaUserCircle,
  FaSignOutAlt,
  FaPen,
} from "react-icons/fa";

function Profile() {
  return (
    <div className="layout">

      {/* Sidebar */}
      <div className="sidebar">
        <h1 className="logo">Odonto</h1>

        <ul>
          <li><FaTachometerAlt /> Dashboard</li>
          <li><FaCalendarAlt /> Appointments</li>
          <li><FaComments /> Chats</li>

          <li className="active">
            <FaUserCircle /> Profile
          </li>

          <li className="logout">
            <FaSignOutAlt /> Log out
          </li>
        </ul>
      </div>

      {/* Content */}
      <div className="content">

        {/* Top Card */}
        <div className="profile-card">

          <div className="doctor-image">
            <FaUserCircle className="doctor-icon" />
          </div>

          <div className="doctor-info">
            <div className="top-row">
              <h3>Dr. Ahmed Mohamed</h3>
              <FaPen className="edit-icon" />
            </div>

            <h4>Orthodontics</h4>

            <p>
              10+ years of experience in braces and smile correction.
              Dedicated to providing the best dental care.
            </p>
          </div>

        </div>

        {/* Form */}
        <div className="form">

          <label>Name</label>
          <input type="text" defaultValue="Ahmed Mohamed Ali AMR" />

          <label>Email</label>
          <input type="email" defaultValue="ahm@gmail.com" />

          <label>Phone</label>
          <input type="text" defaultValue="01123456788" />

          <label>specialty</label>
          <input type="text" defaultValue="Orthodontics" />

          <button className="save-btn">
            Save Changes
          </button>

        </div>

      </div>

    </div>
  );
}

export default Profile;