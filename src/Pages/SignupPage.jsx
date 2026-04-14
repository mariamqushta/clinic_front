import React, { useMemo, useState } from "react";
import { FaFacebookF, FaEye, FaEyeSlash } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import "./SignupPage.css";

function EyeIcon({ open }) {
  return open ? (
    // eye open (outline)
    <svg width="26" height="18" viewBox="0 0 26 18" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M1.5 9.00002C3.7 4.60002 7.3 2.40002 13 2.40002C18.7 2.40002 22.3 4.60002 24.5 9.00002C22.3 13.4 18.7 15.6 13 15.6C7.3 15.6 3.7 13.4 1.5 9.00002Z"
        stroke="#b7b7b7"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <circle cx="13" cy="9.00002" r="3.3" stroke="#b7b7b7" strokeWidth="2" />
    </svg>
  ) : (
    // eye closed/slash
    <svg width="26" height="18" viewBox="0 0 26 18" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M1.5 9.00002C3.7 4.60002 7.3 2.40002 13 2.40002C16.2 2.40002 19 3.4 21 5.1"
        stroke="#b7b7b7"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M24.5 9.00002C22.3 13.4 18.7 15.6 13 15.6C9.6 15.6 7 14.6 5 13"
        stroke="#b7b7b7"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path d="M4 14L22 4" stroke="#b7b7b7" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function FacebookMark() {
  return (
    <svg width="54" height="54" viewBox="0 0 54 54" xmlns="http://www.w3.org/2000/svg">
      <circle cx="27" cy="27" r="27" fill="#1877F2" />
      <path
        d="M31 20.6H27.8C27.3 20.6 27 20.9 27 21.4V24.3H31L30.4 28H27V40H23V28H19.7V24.3H23V21C23 18.7 24.6 17 26.9 17H31V20.6Z"
        fill="white"
      />
    </svg>
  );
}

function GoogleMark() {
  return (
    <svg width="54" height="54" viewBox="0 0 54 54" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <clipPath id="gClip">
          <circle cx="27" cy="27" r="27" />
        </clipPath>
      </defs>
      <circle cx="27" cy="27" r="27" fill="white" />
      <g clipPath="url(#gClip)">
        {/* Google G (approx) */}
        <path
          d="M27 14.5c3.9 0 6.7 1.6 8.2 3.0l5.3-5.2C37.2 9 32.6 7 27 7 18.9 7 12 11.7 8.9 18.8l6.2 4.8C16.8 17.7 21.6 14.5 27 14.5Z"
          fill="#4285F4"
        />
        <path
          d="M44.5 27.5c0-1.4-.1-2.5-.4-3.6H27v7h9.7c-.4 2.3-1.8 4.2-3.8 5.5l5.9 4.6c3.4-3.1 5.7-7.8 5.7-13.5Z"
          fill="#34A853"
        />
        <path
          d="M15 32.1c-1-2.9-1-6 0-8.9l-6.2-4.8C6.1 22.9 6.1 31.1 8.8 38l6.2-5.9Z"
          fill="#FBBC05"
        />
        <path
          d="M27 44.3c5.6 0 10.2-1.9 13.6-5.2l-5.9-4.6c-1.6 1.1-3.7 1.9-7.7 1.9-5.4 0-10.2-3.2-11.9-7.8l-6.2 5.9c3.1 7.1 10 11.8 19.1 11.8Z"
          fill="#EA4335"
        />
      </g>
      <circle cx="27" cy="27" r="27" fill="transparent" />
    </svg>
  );
}

export default function SignupPage() {
  const [submitted, setSubmitted] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    agree: false,
  });

  const passwordOk = useMemo(() => {
    return /^(?=.*\d).{8,}$/.test(form.password);
  }, [form.password]);

  const errors = useMemo(() => {
    const firstLastMissing = !form.firstName.trim() || !form.lastName.trim();
    const emailMissing = !form.email.trim();
    const passwordMissing = !form.password.trim();
    const passwordError = submitted && (!passwordOk || passwordMissing);

    // screenshot behavior: "Not matching" appears only when user types confirm and it mismatches
    const confirmMismatch =
      submitted &&
      form.confirmPassword.trim().length > 0 &&
      form.password.trim().length > 0 &&
      form.confirmPassword !== form.password;

    return {
      firstLastMissing: submitted && firstLastMissing,
      emailMissing: submitted && emailMissing,
      passwordError,
      confirmMismatch,
      termsMissing: submitted && !form.agree,
    };
  }, [form, submitted, passwordOk]);

  const handleChange = (key) => (e) => {
    const val = key === "agree" ? e.target.checked : e.target.value;
    setForm((s) => ({ ...s, [key]: val }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="signup-page">
      <div className="signup-overlay" />

      <div className="signup-container">
        <div className="signup-card">
          <h1 className="signup-title">
            Sign up to <span>Odonto</span>
          </h1>

          <form className="signup-form" onSubmit={handleSubmit}>
            {/* First + Last */}
            <div className="row2">
              <div className="field">
                <label className="field-label">First Name</label>
                <input
                  className={`field-input ${errors.firstLastMissing ? "error" : ""}`}
                  placeholder="Enter the FirstName"
                  value={form.firstName}
                  onChange={handleChange("firstName")}
                  type="text"
                />
              </div>

              <div className="field">
                <label className="field-label">Last Name</label>
                <input
                  className={`field-input ${errors.firstLastMissing ? "error" : ""}`}
                  placeholder="Enter the Last Name"
                  value={form.lastName}
                  onChange={handleChange("lastName")}
                  type="text"
                />
                {errors.firstLastMissing && (
                  <div className="error-right-text">These fields are required</div>
                )}
              </div>
            </div>

            {/* Email */}
            <div className="field email-field">
              <label className="field-label">Email</label>
              <input
                className={`field-input ${errors.emailMissing ? "error" : ""}`}
                placeholder="Enter the Email"
                value={form.email}
                onChange={handleChange("email")}
                type="email"
              />
              {errors.emailMissing && (
                <div className="error-right-text">This field is required</div>
              )}
            </div>

            {/* Password */}
            <div className="field">
              <label className="field-label">Password</label>
              <div className="password-wrap">
                <input
                  className={`field-input password-input ${errors.passwordError ? "error" : ""}`}
                  placeholder="********************"
                  value={form.password}
                  onChange={handleChange("password")}
                  type={showPassword ? "text" : "password"}
                />
                <button
                  type="button"
                  className="eye-btn"
                  onClick={() => setShowPassword((p) => !p)}
                >
                  <EyeIcon open={showPassword} />
                </button>
              </div>
              <div className={`password-hint ${errors.passwordError ? "hint-error" : ""}`}>
                Must be 8+ characters and include a number
              </div>
            </div>

            {/* Confirm */}
            <div className="field">
              <label className="field-label">Confirm Password</label>
              <div className="password-wrap">
                <input
                  className={`field-input password-input ${errors.confirmMismatch ? "error" : ""}`}
                  placeholder="********************"
                  value={form.confirmPassword}
                  onChange={handleChange("confirmPassword")}
                  type={showConfirmPassword ? "text" : "password"}
                />
                <button
                  type="button"
                  className="eye-btn"
                  onClick={() => setShowConfirmPassword((p) => !p)}
                >
                  <EyeIcon open={showConfirmPassword} />
                </button>
              </div>
              {errors.confirmMismatch ? (
                <div className="error-right-text not-matching">Not matching</div>
              ) : (
                <div className="confirm-spacer" />
              )}
            </div>

            {/* Terms */}
            <div className="terms-row">
              <input
                type="checkbox"
                id="terms"
                className={`terms-checkbox ${errors.termsMissing ? "error-checkbox" : ""}`}
                checked={form.agree}
                onChange={handleChange("agree")}
              />
              <label htmlFor="terms" className="terms-text">
                I agree all statements in <a href="#">terms of service</a>
              </label>
            </div>

            {/* Submit */}
            <button type="submit" className="submit-btn">
              Sign up
            </button>

            {/* Divider */}
            <div className="divider">
              <span>Or Sign up with</span>
            </div>

            {/* Social */}
            <div className="socials">
              <button type="button" className="social-btn facebook"
                 aria-label="Facebook">
                 <FaFacebookF />
            </button>


            <button
              type="button"
              className="social-btn google-btn"
              aria-label="Google"
            >
              <FcGoogle />
            </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
