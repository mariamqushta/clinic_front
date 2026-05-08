import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./ForgotPassword.css";
import forgotImage from "../assets/forgot-password.png";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Reset link sent to: ${email}`);
  };

  return (
    <div className="forgot-page">
      <div className="forgot-card">
        <div className="forgot-illustration-wrap">
          <img
            src={forgotImage}
            alt="Forgot Password Illustration"
            className="forgot-illustration"
          />
        </div>

        <h1>Forgot Password?</h1>
        <p className="forgot-subtitle">
          Enter your email and we will send you a reset link
        </p>

        <form onSubmit={handleSubmit} className="forgot-form">
          <input
            type="email"
            placeholder="Enter Your Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="forgot-input"
            required
          />

          <button type="submit" className="forgot-btn">
            Send
          </button>
        </form>

        <div className="forgot-back">
          Back to <Link to="/LoginDr">Login</Link>
        </div>
      </div>
    </div>
  );
}