import toast from "react-hot-toast";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { loginDoctor } from "../api/authApi";
import "./LoginPageDr.css";

export default function LoginPage() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("LOGIN CLICKED");

    try {
      const res = await loginDoctor({ email, password });

      console.log("LOGIN RESPONSE:", res);

      const user = res?.data?.user;
      const token = res?.access_token;

      if (!user) {
        console.log("RAW RESPONSE:", res);
        return toast.error("Login failed: user missing");
      }

      if (user.role !== "doctor") {
        return toast.error("This account is not a doctor");
      }

      localStorage.setItem("token", token);
      localStorage.setItem("role", user.role);
      localStorage.setItem("user", JSON.stringify(user));

      localStorage.setItem("doctorId", user._id);

      console.log("DOCTOR ID SAVED:", user._id);

      navigate("/doctor/appointments");

    } catch (err) {
      console.log("ERROR:", err.response?.data || err.message);
      toast.error(err.response?.data?.message || "Login failed");
    }
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
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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

          <button type="submit" className="loginBtnr" >
            Login
          </button>

          <div className="dividerr">
            <span />
            <p>Or Login with</p>
            <span />
          </div>

          <div className="socialRowr">
            <button
              type="button"
              className="socialBtnr googleBtnr w-100"
              style={{ padding: "10px", width: "100%", display: "flex", justifyContent: "center", alignItems: "center", gap: "8px" }}
              onClick={() => {
                window.location.href = "http://localhost:3000/api/v1/oauth/google?role=doctor";
              }}
            >
              <FcGoogle size={24} /> Login with Google
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