import { useNavigate } from "react-router-dom";
import "./RequestAcceptedPage.css";

export default function RequestAcceptedPage() {
  const navigate = useNavigate();

  return (
    <div className="result-page">
      <div className="result-card">
        <div className="result-icon result-icon--success" aria-hidden="true">
          <svg viewBox="0 0 64 64">
            <circle cx="32" cy="32" r="24" fill="#4CAF50" />
            <path
              d="M23 32.5l6.5 6.5L42 26.5"
              fill="none"
              stroke="#fff"
              strokeWidth="6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        <h1 className="result-title">Request Accepted</h1>

        <p className="result-text">
          Your account has been approved successfully
        </p>

        <button
          type="button"
          className="result-btn result-btn--success"
          onClick={() => navigate("/home")}
        >
          Start
        </button>
      </div>
    </div>
  );
}