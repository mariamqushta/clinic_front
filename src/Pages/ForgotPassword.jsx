import toast from "react-hot-toast";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./ForgotPassword.css";
import forgotImage from "../assets/forgot-password.png";
import { forgotPassword, verifyOTP } from "../api/authApi";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState(1); // 1 = Email, 2 = OTP
  const navigate = useNavigate();

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    try {
      await forgotPassword(email);
      toast.success("OTP sent to your email.");
      setStep(2);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to send OTP");
    }
  };

  const handleOTPSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = await verifyOTP(email, otp);
      toast.success("OTP verified successfully.");
      // Navigate to Reset Password page, passing the token
      navigate("/reset-password", { state: { token: data.resetToken } });
    } catch (err) {
      toast.error(err.response?.data?.message || "Invalid OTP");
    }
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

        {step === 1 ? (
          <>
            <h1>Forgot Password?</h1>
            <p className="forgot-subtitle">
              Enter your email and we will send you a 6-digit OTP
            </p>

            <form onSubmit={handleEmailSubmit} className="forgot-form">
              <input
                type="email"
                placeholder="Enter Your Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="forgot-input"
                required
              />

              <button type="submit" className="forgot-btn">
                Send OTP
              </button>
            </form>
          </>
        ) : (
          <>
            <h1>Enter OTP</h1>
            <p className="forgot-subtitle">
              Please enter the 6-digit OTP sent to {email}
            </p>

            <form onSubmit={handleOTPSubmit} className="forgot-form">
              <input
                type="text"
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="forgot-input"
                required
                maxLength="6"
              />

              <button type="submit" className="forgot-btn">
                Verify OTP
              </button>
            </form>
          </>
        )}

        <div className="forgot-back">
          Back to <Link to="/LoginDr">Login</Link>
        </div>
      </div>
    </div>
  );
}