import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";
import { getMyAppointments, cancelAppointment } from "../api/appointmentApi";
import { addReview } from "../api/reviewApi";
import toast from "react-hot-toast";

function Appointments() {
  const [appointments, setAppointments] = useState([]);
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState(
    localStorage.getItem("tab") || "upcoming"
  );

  // Review Modal State
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewDoctorId, setReviewDoctorId] = useState(null);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);

  // load appointments
  useEffect(() => {
    const load = async () => {
      try {
        const data = await getMyAppointments();
        setAppointments(data || []);
      } catch (err) {
        console.log(err);
      }
    };

    load();
  }, []);

  const statusStyles = {
    pending: { backgroundColor: "#FFF6D4", color: "#C5A457" },
    confirmed: { backgroundColor: "#D8FFE0", color: "#46B270" },
    completed: { backgroundColor: "#D8FFE0", color: "#46B270" },
    missed: { backgroundColor: "#FFDDDD", color: "#F14538" },
    cancelled: { backgroundColor: "#DEE1E4", color: "#000" },
  };

  // FIX DATE BUG (safe ISO handling)
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const filteredAppointments = appointments.filter((app) => {
    const appDate = new Date(app.date);

    const cleanAppDate = new Date(
      appDate.getFullYear(),
      appDate.getMonth(),
      appDate.getDate()
    );

    switch (activeTab) {
      case "upcoming":
        return (
          cleanAppDate >= today &&
          ["pending", "confirmed"].includes(app.status)
        );

      case "past":
        return (
          ["completed", "missed"].includes(app.status) ||
          (cleanAppDate < today && ["pending", "confirmed"].includes(app.status))
        );

      case "cancelled":
        return app.status === "cancelled";

      default:
        return false;
    }
  });

const handleCancel = async (id) => {
  const confirmCancel = window.confirm(
    "Are you sure you want to cancel this appointment?"
  );

  if (!confirmCancel) return;

  try {
    await cancelAppointment(id);

    setAppointments((prev) =>
      prev.map((app) =>
        app._id === id
          ? { ...app, status: "cancelled" }
          : app
      )
    );
  } catch (err) {
    console.log(err);
  }
};

const handleReschedule = (app) => {
  navigate(`/book/${app.doctorId?._id || app.doctorId}`, {
    state: { appointment: app },
  });
};

const handleOpenReview = (doctorId) => {
  setReviewDoctorId(doctorId);
  setReviewRating(5);
  setReviewComment("");
  setShowReviewModal(true);
};

const handleSubmitReview = async () => {
  if (!reviewComment.trim()) {
    return toast.error("Please enter a comment");
  }
  setSubmittingReview(true);
  try {
    await addReview(reviewDoctorId, reviewRating, reviewComment);
    toast.success("Review submitted successfully!");
    setShowReviewModal(false);
  } catch (err) {
    toast.error(err.response?.data?.message || "Failed to submit review");
  } finally {
    setSubmittingReview(false);
  }
};
  console.log(appointments);
console.log(filteredAppointments);
  return (
    <div>
      <Navbar />

      <div className="container my-4 d-flex justify-content-between">
        <h2 className="bagemaincolor">MY Appointments</h2>

        <button
          className="cardbutton p-2 text-light rounded"
          onClick={() => navigate("/home")}
        >
          + Book New Appointments
        </button>
      </div>

      {/* Tabs */}
      <div className="container d-flex justify-content-start gap-5 my-5">
        <button
          className={`appbtn ${activeTab === "upcoming" ? "active" : ""}`}
          onClick={() => setActiveTab("upcoming")}
        >
          Upcoming
        </button>

        <button
          className={`appbtn ${activeTab === "past" ? "active" : ""}`}
          onClick={() => setActiveTab("past")}
        >
          Past
        </button>

        <button
          className={`appbtn ${activeTab === "cancelled" ? "active" : ""}`}
          onClick={() => setActiveTab("cancelled")}
        >
          cancelled
        </button>
      </div>

      {/* Appointments */}
      {filteredAppointments.length === 0 ? (
        <div className="text-center my-5 py-5 text-muted">
          <h4>No appointments found for {activeTab}</h4>
          <p>You have no {activeTab} appointments at this time.</p>
        </div>
      ) : 
        filteredAppointments.map((app) => (
          <div
            key={app._id}
          className="container divappointent rounded rounded-4 card p-1 my-3"
        >
          <div className="d-flex justify-content-between p-3">
            <div>
              <p>
                <span className="fw-semibold">Dr:</span>{" "}
                {app.doctorId?.name}
              </p>

              <p>
                <span className="fw-semibold">service:</span>{" "}
                {app.doctorId?.specialization}
              </p>

              <p>
                <span className="fw-semibold">Date:</span>{" "}
                  {new Date(app.date).toLocaleDateString()} -{" "}
                  {new Date(app.date).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
              </p>

              <span
                className="px-4 py-3 rounded rounded-3 my-3 text-capitalize fw-semibold"
                style={statusStyles[app.status]}
              >
                {app.status}
              </span>
            </div>

            <div>
              {activeTab === "upcoming" &&
                app.status === "pending" && (
                  <button
                    className="px-4 py-3 rounded rounded-3 my-3 fw-semibold Reschedule"
                    onClick={() => handleReschedule(app)}
                  >
                    Reschedule
                  </button>
                )}

              {activeTab === "upcoming" &&
                app.status === "confirmed" && (
                  <>
                    <button
                      className="px-4 py-3 rounded rounded-3 my-3 fw-semibold mx-2 Reschedule"
                      onClick={() => handleReschedule(app)}
                    >
                      Reschedule
                    </button>

                    <button
                      className="px-4 py-3 rounded rounded-3 my-3 fw-semibold mx-2 Cancel"
                      onClick={() => handleCancel(app._id)}
                    >
                      Cancel
                    </button>
                  </>
                )}

              {activeTab === "past" && app.status === "completed" && (
                <button
                  className="px-4 py-3 rounded rounded-3 my-3 fw-semibold text-light"
                  style={{ backgroundColor: "#0f4a80", border: "none" }}
                  onClick={() => handleOpenReview(app.doctorId?._id || app.doctorId)}
                >
                  Write Review
                </button>
              )}
            </div>
          </div>
        </div>
      ))}

      {/* Review Modal */}
      {showReviewModal && (
        <div style={modalOverlayStyle}>
          <div style={modalContentStyle}>
            <h3 className="mb-4">Write a Review</h3>
            
            <div className="mb-3">
              <label className="fw-semibold mb-2">Rating (1 to 5 stars)</label>
              <select 
                className="form-select" 
                value={reviewRating} 
                onChange={(e) => setReviewRating(Number(e.target.value))}
              >
                <option value={5}>⭐⭐⭐⭐⭐ (5) Excellent</option>
                <option value={4}>⭐⭐⭐⭐ (4) Very Good</option>
                <option value={3}>⭐⭐⭐ (3) Good</option>
                <option value={2}>⭐⭐ (2) Fair</option>
                <option value={1}>⭐ (1) Poor</option>
              </select>
            </div>

            <div className="mb-4">
              <label className="fw-semibold mb-2">Comment</label>
              <textarea 
                className="form-control" 
                rows="4" 
                placeholder="Share your experience with this doctor..."
                value={reviewComment}
                onChange={(e) => setReviewComment(e.target.value)}
              ></textarea>
            </div>

            <div className="d-flex justify-content-end gap-3">
              <button 
                className="btn btn-secondary px-4" 
                onClick={() => setShowReviewModal(false)}
                disabled={submittingReview}
              >
                Cancel
              </button>
              <button 
                className="btn text-light px-4" 
                style={{ backgroundColor: "#135492" }}
                onClick={handleSubmitReview}
                disabled={submittingReview}
              >
                {submittingReview ? "Submitting..." : "Submit Review"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const modalOverlayStyle = {
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: "rgba(0, 0, 0, 0.6)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 1000,
};

const modalContentStyle = {
  backgroundColor: "#fff",
  padding: "30px",
  borderRadius: "10px",
  width: "90%",
  maxWidth: "500px",
  boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
};

export default Appointments;