import { FaUser } from "react-icons/fa";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Select.css";

function SelectRole() {
  const [role, setRole] = useState("");
  const navigate = useNavigate();

const handleContinue = () => {
  if (!role) return alert("Select role");

  localStorage.setItem("role", role);

if (role === "patient") {
  navigate("/login");
} else {
  navigate("/LoginDr");
}
};

  return (
    <div className="container container1">
      <h1>
        Welcome to <span>Odonto!</span>
      </h1>
      <p>Select your role to continue</p>

      <div className="cards cards1">
        <div
          className={`card card1 ${role === "patient" ? "active" : ""}`}
          onClick={() => setRole("patient")}
        >
          <FaUser className="icon icon1" />
          <h2>Patient</h2>
        </div>

        <div
          className={`card card1 ${role === "doctor" ? "active" : ""}`}
          onClick={() => setRole("doctor")}
        >
          <div className="icon icon1">🦷</div>
          <h2>Doctor</h2>
        </div>
      </div>

      <button className="btn btn1" onClick={handleContinue}>
        Continue
      </button>
    </div>
  );
}

export default SelectRole;