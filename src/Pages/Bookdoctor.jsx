import React from "react";
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";
import { FaLocationArrow } from "react-icons/fa";
import Navbar from "../components/Navbar";
import doctors from "../models/doctorele";

function Book1() {
  const location = useLocation();
  const editAppointment = location.state?.appointment;

  const [selectedTime, setSelectedTime] = useState(null);
  const [date, setDate] = useState(new Date());
  const navigate = useNavigate();
  const [confirmed, setConfirmed] = useState(false);

  const { id } = useParams();

  // ✅ FIX: unified doctor resolving (NEW + EDIT)
  const doctorId = editAppointment?.doctorId || Number(id);
  const doctor = doctors.find((d) => d.id === doctorId);

  // ✅ prefill when editing
  useEffect(() => {
    if (editAppointment) {
      if (editAppointment.date) {
        setDate(new Date(editAppointment.date));
      }
      if (editAppointment.time) {
        setSelectedTime(editAppointment.time);
      }
    }
  }, [editAppointment]);

  const handleBooking = () => {
    if (!date || !selectedTime) {
      alert("Please select date and time");
      return;
    }

    const stored =
      JSON.parse(localStorage.getItem("appointments")) || [];

    if (editAppointment) {
      // ✅ UPDATE EXISTING APPOINTMENT
      const updated = stored.map((app) =>
        app.id === editAppointment.id
          ? {
              ...app,
              date: date.toISOString().split("T")[0],
              time: selectedTime,
              status: "pending",
            }
          : app
      );

      localStorage.setItem(
        "appointments",
        JSON.stringify(updated)
      );
    } else {
      // ✅ CREATE NEW APPOINTMENT
      const newAppointment = {
        id: Date.now(),
        doctorId: doctor?.id,
        doctorName: doctor?.name,
        service: doctor?.department,
        date: date.toISOString().split("T")[0],
        time: selectedTime,
        status: "pending",
      };

      localStorage.setItem(
        "appointments",
        JSON.stringify([...stored, newAppointment])
      );
    }

    setConfirmed(true);
  };

  // ❗ SAFE GUARD (fix "doctor not found")
  if (!doctor) {
    return (
      <div>
        <Navbar />
        <h2>Doctor not found</h2>
      </div>
    );
  }

  if (confirmed) {
    return (
      <div>
        <Navbar />
        <div className="mt-5 w-75 m-auto">
          <div className="confirm-page text-center w-50 m-auto py-5 rounded rounded-2">
            <div className="confirm-card">
              <h2 className="confirm-title my-3 bagemaincolor fs-2">
                Booking Confirmed 🎉
              </h2>

              <div className="confirm-details mt-5 fs-5">
                <p className="my-2">
                  <strong>Service:</strong>{" "}
                  {doctor?.department}
                </p>
                <p className="my-2">
                  <strong>Date:</strong>{" "}
                  {date.toDateString()}
                </p>
                <p className="my-2">
                  <strong>Time:</strong> {selectedTime}
                </p>
              </div>

              <div className="confirm-actions justify-align-content-between fs-5">
                <button
                  className="btn-main p-2 mx-5 book-btn"
                  onClick={() =>
                    navigate("/Appointments")
                  }
                >
                  View Appointments
                </button>

                <button
                  className="btn-outline p-2 mx-5"
                  onClick={() => setConfirmed(false)}
                >
                  Go back
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Navbar />

      <div className="container mt-4">
        <div className="card p-3 shadow-sm">
          <div className="d-flex align-items-between">
            <div className="d-flex gap-4 align-items-center flex-wrap">
              <img
                src={doctor.image}
                alt={doctor.name}
                style={{
                  width: "200px",
                  height: "200px",
                  objectFit: "cover",
                  borderRadius: "10px",
                }}
              />
              <div>
                <h5 className="fw-bold">{doctor.name}</h5>
                <h5 className="fw-bold my-3 bagemaincolor">
                  {doctor.department}
                </h5>
                <p>{doctor.description}</p>
              </div>
            </div>

            <div className="ms-auto me-5 mt-4">
              <Link to="/chat">
                <div className="arrow-wrapper p-4">
                  <FaLocationArrow className="arrow dark" />
                  <FaLocationArrow className="arrow light" />
                </div>
              </Link>
            </div>
          </div>
        </div>

        {/* Calendar + Time */}
        <div className="d-flex mt-4 gap-3">
          <div className="w-50 p-2">
            <div className="calendar-box">
              <DatePicker
                selected={date}
                onChange={(date) => setDate(date)}
                inline
              />
            </div>
          </div>

          <div className="w-50">
            <h3 className="text-center my-3">
              Select Time
            </h3>

            <div className="container-fluid m-auto row mt-4">
              {[
                "09:00 AM",
                "10:00 AM",
                "11:00 AM",
                "12:00 PM",
                "01:00 PM",
                "02:00 PM",
                "03:00 PM",
                "04:00 PM",
                "05:00 PM",
              ].map((time, index) => (
                <div
                  key={index}
                  className="col-4 mb-3"
                  onClick={() => setSelectedTime(time)}
                >
                  <div
                    className={`time-slot ${
                      selectedTime === time
                        ? "active"
                        : ""
                    }`}
                  >
                    {time}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="d-flex justify-content-center mt-4">
          <button
            className="book-btn fs-5"
            onClick={handleBooking}
          >
            Book
          </button>
        </div>
      </div>
    </div>
  );
}

export default Book1;