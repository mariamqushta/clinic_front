import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";
import { getMyAppointments, cancelAppointment } from "../api/appointmentApi";

function Appointments() {
  const [appointments, setAppointments] = useState([]);
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState(
    localStorage.getItem("tab") || "upcoming"
  );

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
          cleanAppDate < today &&
          ["completed", "missed"].includes(app.status)
        );

      case "cancelled":
        return ["cancelled", "cancelled"].includes(app.status);

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
      {filteredAppointments.map((app) => (
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
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default Appointments;