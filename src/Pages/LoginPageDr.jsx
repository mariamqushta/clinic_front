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
    <div className="odontoPager">
      <div className="odontoLeftr">
        <h1 className="odontoTitler">
          Welcome to <span>Odonto!</span>
        </h1>

        <form className="odontoFormr" onSubmit={handleSubmit}>
          <label className="odontoLabelr" htmlFor="email">
            Email
          </label>
          <input
            id="email"
            type="email"
            className="odontoInputr"
            placeholder="Enter your Email"
          />

          <label className="odontoLabelr" htmlFor="password">
            Password
          </label>
          <div className="passwordWrapr">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              className="odontoInputr passwordInputr"
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

          <div className="forgotRowr">
            <button
                type="button"
                className="forgotBtnr"
                onClick={() => navigate("/forgot-password")}>
                           Forget password?
            </button>
          </div>

          <button type="submit" className="loginBtnr">
            Login
          </button>

          <div className="dividerr">
            <span />
            <p>Or Login with</p>
            <span />
          </div>

          <div className="socialRowr">
            <button type="button" className="socialBtnr facebookBtnr">
              <FaFacebookF />
            </button>
            <button type="button" className="socialBtnr googleBtnr">
              <FcGoogle />
            </button>
          </div>
        </form>
      </div>

      <div className="odontoRightr">
        <div className="odontoShaper" />
        <div className="odontoPortalr">
          <h2>Doctor Portal</h2>
          <button
            type="button"
            className="signupBtnr"
            onClick={() => navigate("/doctor-signup")}
          >
            Sign up
          </button>
        </div>
      </div>
    </div>
  );
}