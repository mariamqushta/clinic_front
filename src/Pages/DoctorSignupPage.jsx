import toast from "react-hot-toast";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signupPatient } from "../api/authApi";
import "./DoctorSignupPage.css";

export default function DoctorSignupPage() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    specialty: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [licenseFile, setLicenseFile] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    setLicenseFile(e.target.files?.[0] || null);
  };



const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const res = await signupPatient({
      name: `${formData.firstName} ${formData.lastName}`,
      email: formData.email,
      password: formData.password,
      role: "doctor",
    });

    console.log("Doctor created:", res);

    localStorage.setItem("role", "doctor");

    navigate("/request-accepted");
  } catch (err) {
    console.log("ERROR:", err.response?.data || err.message);
    toast.error(err.response?.data?.message || "Doctor signup failed");
  }
};
  return (
    <div className="doctor-signup-page">
      <section className="doctor-signup-left">
        <div className="doctor-signup-left__content">
          <h1>
            Sign up to <strong>Odonto</strong>
          </h1>
        </div>
      </section>

      <section className="doctor-signup-right">
        <form className="doctor-signup-form" onSubmit={handleSubmit}>
          <h2 className="doctor-signup-mobile-title">
            Sign up to <span>Odonto</span>
          </h2>

          <div className="doctor-signup-grid">
            <div className="field">
              <label htmlFor="firstName">First Name</label>
              <input
                id="firstName"
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                placeholder="Enter the FirstName"
                required
              />
            </div>

            <div className="field">
              <label htmlFor="lastName">Last Name</label>
              <input
                id="lastName"
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                placeholder="Enter the Last Name"
                required
              />
            </div>

            <div className="field field--full">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter the Email"
                required
              />
            </div>

            <div className="field field--full">
              <label htmlFor="specialty">Select specialty</label>
              <div className="select-wrapper">
                <select
                  id="specialty"
                  name="specialty"
                  value={formData.specialty}
                  onChange={handleChange}
                  required
                >
                  <option value="" disabled hidden></option>
                  <option value="Orthodontics">Orthodontics</option>
                  <option value="Cosmetic Dentistry">Cosmetic Dentistry</option>
                  <option value="Oral Surgery">Oral Surgery</option>
                </select>
              </div>
            </div>

            <div className="field field--full">
              <label htmlFor="password">Password</label>

              <div className="password-wrap">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="***************"
                  autoComplete="new-password"
                  required
                />

                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword((prev) => !prev)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {!showPassword ? (
                    <svg viewBox="0 0 24 24" aria-hidden="true">
                      <path
                        d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6-10-6-10-6Z"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.7"
                        strokeLinejoin="round"
                      />
                      <circle
                        cx="12"
                        cy="12"
                        r="3.2"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.7"
                      />
                    </svg>
                  ) : (
                    <svg viewBox="0 0 24 24" aria-hidden="true">
                      <path
                        d="M3 3l18 18"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.7"
                        strokeLinecap="round"
                      />
                      <path
                        d="M2 12s3.5-6 10-6c1.2 0 2.3.2 3.3.6m4.7 2.8c1.2 1 2 2.2 2 2.6 0 0-3.5 6-10 6-1.3 0-2.5-.2-3.6-.6"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.7"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M9.5 9.6A3.2 3.2 0 0012 15.2"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.7"
                        strokeLinecap="round"
                      />
                    </svg>
                  )}
                </button>
              </div>

              <p className="hint">Must be 8+ characters and include a number</p>
            </div>

            <div className="field field--full">
              <label className="upload-box">
                <input
                  type="file"
                  accept=".pdf,.png,.jpg,.jpeg"
                  onChange={handleFileChange}
                />
                <div className="upload-box__content">
                  <span className="upload-icon">📄</span>
                  <span>Upload Medical ID / License</span>
                </div>
              </label>

              {licenseFile && (
                <p className="file-name">Selected file: {licenseFile.name}</p>
              )}
            </div>

            <button type="submit" className="submit-btn field--full">
              Sign up
            </button>

            <p className="review-note field--full">
              Your account will be reviewed by admin before activation ⏳
            </p>
          </div>
        </form>
      </section>
    </div>
  );
}