import { FaUser } from "react-icons/fa";
import { useState } from "react";
import "./App.css";

function App() {
  const [role, setRole] = useState("");

  return (
    <div className="container">
      <h1>Welcome to <span>Odonto!</span></h1>
      <p>Select your role to continue</p>

      <div className="cards">
        <div
          className={`card ${role === "patient" ? "active" : ""}`}
          onClick={() => setRole("patient")}
        >
          <FaUser className="icon" />
          <h2>Patient</h2>
        </div>

        <div
          className={`card ${role === "doctor" ? "active" : ""}`}
          onClick={() => setRole("doctor")}
        >
          <div className="icon">🦷</div>
          <h2>Doctor</h2>
        </div>
      </div>

      <button className="btn">Continue</button>
    </div>
  );
}

export default App;