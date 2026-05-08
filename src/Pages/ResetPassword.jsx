import React, { useState } from "react";
import "./ResetPassword.css";

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

  const handleSubmit = (e) => {
    e.preventDefault();

    if (newPassword.length < 8 || !/\d/.test(newPassword)) {
      alert("Password must be 8+ characters and include a number");
      return;
    }

    if (newPassword !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    alert("Password reset successfully!");
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