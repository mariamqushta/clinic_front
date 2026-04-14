import { useState } from "react";
import { Link } from "react-router-dom";
import { FaFacebookF, FaEye, FaEyeSlash } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import "./LoginPage.css";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function LoginPage() {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [touched, setTouched] = useState({
    email: false,
    password: false,
  });

  const [showPassword, setShowPassword] = useState(false);

  const emailError =
    touched.email && form.email.trim() === ""
      ? "This field is required"
      : touched.email && !emailRegex.test(form.email.trim())
      ? "invalid email address"
      : "";

  const passwordError =
    touched.password && form.password.trim() === ""
      ? "This field is required"
      : touched.password && form.password.length < 6
      ? "Incorrect password"
      : "";

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    setTouched({
      email: true,
      password: true,
    });

    const isEmailValid = emailRegex.test(form.email.trim());
    const isPasswordValid = form.password.trim().length >= 6;

    if (!isEmailValid || !isPasswordValid) return;

    alert("Login successful");
  };

  return (
    <div className="login-page">
      <div className="auth-left">
        <div className="auth-card">
          <h1 className="auth-title">
            Welcome to <span>Odonto!</span>
          </h1>

          <form onSubmit={handleSubmit} noValidate>
            <div className="mb-3">
              <label className="form-label auth-label">Email</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Enter your Email"
                className={`form-control auth-input ${
                  emailError ? "is-invalid-custom" : ""
                }`}
              />
              <div className="field-error">{emailError || "\u00A0"}</div>
            </div>

            <div className="mb-2">
              <label className="form-label auth-label">Password</label>

              <div className="password-wrap">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="********************"
                  className={`form-control auth-input ${
                    passwordError ? "is-invalid-custom" : ""
                  }`}
                />

                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword((prev) => !prev)}
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>

              <div className="field-error">{passwordError || "\u00A0"}</div>
            </div>

            <button
              type="button"
              className="forgot-link-btn"
              onClick={() => alert("Forgot password page not added yet")}
            >
              Forget password?
            </button>

            <button type="submit" className="auth-btn">
              Login
            </button>
          </form>

          <div className="divider">
            <span className="divider-line"></span>
            <span className="divider-text">Or Login with</span>
            <span className="divider-line"></span>
          </div>

          <div className="social-row">
            <button
              type="button"
              className="social-btn facebook"
              aria-label="Facebook"
            >
              <FaFacebookF color="#fff" />
            </button>

            <button
              type="button"
              className="social-btn google-btn"
              aria-label="Google"
            >
              <FcGoogle />
            </button>
          </div>

          <p className="bottom-text">
            Don’t have account? <Link to="/signup">Sign up</Link>
          </p>
        </div>
      </div>

      <div
        className="auth-right"
        style={{ backgroundImage: 'url("/clinic-bg.jpg")' }}
      />
    </div>
  );
}