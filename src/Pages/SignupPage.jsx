import React, { useState } from "react";
import { FaEye, FaEyeSlash, FaFacebookF, FaGoogle } from "react-icons/fa";
import "./SignupPage.css";

export default function SignupPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  return (
    <div className="signup-page d-flex align-items-center justify-content-center py-4">
      <div className="signup-overlay"></div>

      <div className="container position-relative z-1">
        <div className="signup-card mx-auto bg-white bg-opacity-90 shadow-lg rounded-4">
          <h1 className="text-center signup-title mb-4">
            Sign up to <span>Odonto</span>
          </h1>

          <form onSubmit={handleSubmit}>
            <div className="row g-4">
              <div className="col-12 col-md-6">
                <label className="form-label fw-medium">First Name</label>
                <input
                  type="text"
                  className="form-control custom-input"
                  placeholder="Enter the FirstName"
                />
              </div>

              <div className="col-12 col-md-6">
                <label className="form-label fw-medium">Last Name</label>
                <input
                  type="text"
                  className="form-control custom-input"
                  placeholder="Enter the Last Name"
                />
              </div>

              <div className="col-12">
                <label className="form-label fw-medium">Email</label>
                <input
                  type="email"
                  className="form-control custom-input"
                  placeholder="Enter the Email"
                />
              </div>

              <div className="col-12">
                <label className="form-label fw-medium">Password</label>
                <div className="password-wrap">
                  <input
                    type={showPassword ? "text" : "password"}
                    className="form-control custom-input"
                    placeholder="********************"
                  />
                  <button
                    type="button"
                    className="eye-btn"
                    onClick={() => setShowPassword((prev) => !prev)}
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
                <p className="hint">Must be 8+ characters and include a number</p>
              </div>

              <div className="col-12">
                <label className="form-label fw-medium">Confirm Password</label>
                <div className="password-wrap">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    className="form-control custom-input"
                    placeholder="********************"
                  />
                  <button
                    type="button"
                    className="eye-btn"
                    onClick={() => setShowConfirmPassword((prev) => !prev)}
                  >
                    {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>

              <div className="col-12">
                <div className="form-check d-flex align-items-center gap-3 terms-row">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="terms"
                  />
                  <label className="form-check-label" htmlFor="terms">
                    I agree all statements in{" "}
                    <a href="#" className="terms-link">
                      terms of service
                    </a>
                  </label>
                </div>
              </div>

              <div className="col-12">
                <button type="submit" className="btn btn-primary submit-btn rounded-pill w-100">
                  Sign up
                </button>
              </div>

              <div className="col-12">
                <div className="divider">
                  <span>Or Sign up with</span>
                </div>
              </div>

              <div className="col-12">
                <div className="d-flex justify-content-center gap-4 socials">
                  <button type="button" className="social-btn facebook">
                    <FaFacebookF />
                  </button>

                  <button type="button" className="social-btn google">
                    <FaGoogle />
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}