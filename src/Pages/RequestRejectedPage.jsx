import { useNavigate } from "react-router-dom";
import "./RequestRejectedPage.css";

export default function RequestRejectedPage() {
  const navigate = useNavigate();

  return (
    <div className="result-page">
      <div className="result-card">
        <div className="result-icon result-icon--danger" aria-hidden="true">
          <svg viewBox="0 0 64 64">
            <circle cx="32" cy="32" r="24" fill="#F0444E" />
            <path
              d="M24 24l16 16M40 24L24 40"
              fill="none"
              stroke="#fff"
              strokeWidth="6"
              strokeLinecap="round"
            />
          </svg>
        </div>

        <h1 className="result-title">Request Rejected</h1>

        <p className="result-text">
          Sorry, your registration request has been rejected by the admin.
        </p>

        <button
          type="button"
          className="result-btn result-btn--danger"
          onClick={() => navigate("/doctor-signup")}
        >
          Try Again
        </button>
      </div>
    </div>
  );
}