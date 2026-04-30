import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaFacebookF, FaEye, FaEyeSlash } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import "./LoginPageDr.css";

export default function LoginPage() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // هنا حط API login لو عندك backend
  };

  return (
    <div className="odontoPage">
      <div className="odontoLeft">
        <h1 className="odontoTitle">
          Welcome to <span>Odonto!</span>
        </h1>

        <form className="odontoForm" onSubmit={handleSubmit}>
          <label className="odontoLabel" htmlFor="email">
            Email
          </label>
          <input
            id="email"
            type="email"
            className="odontoInput"
            placeholder="Enter your Email"
          />

          <label className="odontoLabel" htmlFor="password">
            Password
          </label>
          <div className="passwordWrap">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              className="odontoInput passwordInput"
              placeholder="********************"
            />
            <button
              type="button"
              className="eyeBtn"
              onClick={() => setShowPassword((prev) => !prev)}
              aria-label="Toggle password visibility"
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>

          <div className="forgotRow">
            <button type="button" className="forgotBtn">
              Forget password?
            </button>
          </div>

          <button type="submit" className="loginBtn">
            Login
          </button>

          <div className="divider">
            <span />
            <p>Or Login with</p>
            <span />
          </div>

          <div className="socialRow">
            <button type="button" className="socialBtn facebookBtn">
              <FaFacebookF />
            </button>
            <button type="button" className="socialBtn googleBtn">
              <FcGoogle />
            </button>
          </div>
        </form>
      </div>

      <div className="odontoRight">
        <div className="odontoShape" />
        <div className="odontoPortal">
          <h2>Doctor Portal</h2>
          <button
            type="button"
            className="signupBtn"
            onClick={() => navigate("/signup")}
          >
            Sign up
          </button>
        </div>
      </div>
    </div>
  );
}