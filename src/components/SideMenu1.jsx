import React from "react";
import { Link, useLocation } from "react-router-dom";
import "../App.css";
import {
  FaTachometerAlt,
  FaCalendarAlt,
  FaComments,
  FaUserCircle,
  FaSignOutAlt,
  FaPen,
} from "react-icons/fa";

function Side_Menu() {
  const location = useLocation();

  return (
    <div className="col-2 bg-white border-end vh-100 p-3">
      <a className="navbar-brand headerstyle fst-italic fs-1" href="#">
        Odonto
      </a>

      <div className="d-flex flex-column gap-2">

        <Link
          to="/appointments"
          className={`side-link ${
            location.pathname === "/Dashboard" ? "active" : ""
          }`}
        >
          <FaTachometerAlt /> Dashboard
        </Link>

        <Link
          to="/appointments"
          className={`side-link ${
            location.pathname === "/AppointmentsDr" ? "active" : ""
          }`}
        >
          <FaCalendarAlt /> Appointments
        </Link>

        <Link
          to="/book/1"
          className={`side-link ${
            location.pathname.includes("/Chats") ? "active" : ""
          }`}
        >
          <FaComments /> Chats
        </Link>

        <Link
          to="/profile"
          className={`side-link ${
            location.pathname === "/profile" ? "active" : ""
          }`}
        >
          <FaUserCircle /> Profile
        </Link>

        <Link
          to="/profile"
          className={`side-link ${
            location.pathname === "/Logout" ? "active" : ""
          }`}
        >
          <FaSignOutAlt /> Log out
        </Link>
      </div>
    </div>
  );
}

export default Side_Menu;