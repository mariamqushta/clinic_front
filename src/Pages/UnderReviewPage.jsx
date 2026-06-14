import { useNavigate } from "react-router-dom";
import "./UnderReviewPage.css";

export default function UnderReviewPage() {
  const navigate = useNavigate();

  return (
    <div className="under-review-page">
      <div className="under-review-card">
        <div className="under-review-icon" aria-hidden="true">
          <svg viewBox="0 0 64 64">
            <rect x="16" y="6" width="32" height="4" rx="2" fill="#0f5d9b" />
            <rect x="16" y="54" width="32" height="4" rx="2" fill="#0f5d9b" />

            <path
              d="M20 10h24c0 9-4.5 14-10 18 5.5 4 10 9 10 18H20c0-9 4.5-14 10-18-5.5-4-10-9-10-18Z"
              fill="#d6ebff"
              stroke="#111"
              strokeWidth="2"
              strokeLinejoin="round"
            />

            <path
              d="M24 16h16c0 5-3 8-8 10-5-2-8-5-8-10Z"
              fill="#f5b700"
              stroke="#111"
              strokeWidth="1.5"
              strokeLinejoin="round"
            />

            <path
              d="M24 48h16c0-5-3-8-8-10-5 2-8 5-8 10Z"
              fill="#f5b700"
              stroke="#111"
              strokeWidth="1.5"
              strokeLinejoin="round"
            />

            <path
              d="M32 28v8"
              stroke="#111"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </div>

        <h1 className="under-review-title">Your Account is Under Review</h1>

        <div className="under-review-text">
          <p>Thank you for registering</p>
          <p>You will be notified once your Account is approved.</p>
        </div>

        <button
          type="button"
          className="under-review-btn"
          onClick={() => navigate("/doctor-signup")}
        >
          Back
        </button>
      </div>
    </div>
  );
}