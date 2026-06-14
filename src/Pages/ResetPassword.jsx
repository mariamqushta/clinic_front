import toast from "react-hot-toast";
import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./ResetPassword.css";
import { resetPassword } from "../api/authApi";

function EyeIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="eye-icon"
    >
      <path
        d="M2 12C2 12 5.5 5 12 5C18.5 5 22 12 22 12C22 12 18.5 19 12 19C5.5 19 2 12 2 12Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle
        cx="12"
        cy="12"
        r="3.2"
        stroke="currentColor"
        strokeWidth="1.8"
      />
    </svg>
  );
}

export default function ResetPassword() {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();
  const token = location.state?.token;

  useEffect(() => {
    if (!token) {
      toast.error("No reset token found. Please start the forgot password process again.");
      navigate("/forgot-password");
    }
  }, [token, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (newPassword.length < 8) {
      toast.error("Password must be 8+ characters");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      await resetPassword(token, newPassword);
      toast.success("Password reset successfully! Please log in.");
      navigate("/login");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to reset password.");
    }
  };

  return (
    <div className="reset-page">
      <div className="reset-card">
        <h1>Reset Password?</h1>
        <p className="reset-subtitle">Enter your new password</p>

        <form className="reset-form" onSubmit={handleSubmit}>
          <div className="field-group">
            <div className="input-wrap">
              <input
                type={showNewPassword ? "text" : "password"}
                placeholder="New Password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
              <button
                type="button"
                className="toggle-btn"
                onClick={() => setShowNewPassword((prev) => !prev)}
                aria-label={showNewPassword ? "Hide password" : "Show password"}
              >
                <EyeIcon />
              </button>
            </div>

            <p className="hintp">
              Must be 8+ characters and include a number
            </p>
          </div>

          <div className="field-group">
            <div className="input-wrap">
              <input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              <button
                type="button"
                className="toggle-btn"
                onClick={() => setShowConfirmPassword((prev) => !prev)}
                aria-label={
                  showConfirmPassword ? "Hide password" : "Show password"
                }
              >
                <EyeIcon />
              </button>
            </div>
          </div>

          <button type="submit" className="submit-btnr">
            Reset Password
          </button>
        </form>

        <div className="back-link">
          Back to <a href="/LoginDr">Login</a>
        </div>
      </div>
    </div>
  );
}