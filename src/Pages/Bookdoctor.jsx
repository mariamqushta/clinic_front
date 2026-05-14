import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Navbar from "../components/Navbar";
import { createAppointment ,updateAppointment} from "../api/appointmentApi";
import { getDoctorById } from "../api/doctorApi";
import { FaLocationArrow } from "react-icons/fa";
import { Link } from "react-router-dom";

function Book1() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const editAppointment = location.state?.appointment;
  const [doctor, setDoctor] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [date, setDate] = useState(new Date());
  const [confirmed, setConfirmed] = useState(false);
  const isEditable =
  editAppointment &&
  ["pending", "confirmed"].includes(editAppointment.status);



  // Load doctor from backend
  useEffect(() => {
    const fetchDoctor = async () => {
      try {
        const data = await getDoctorById(id);
        setDoctor(data);
      } catch (err) {
        console.log(err);
      }
    };

    fetchDoctor();
  }, [id]);

  // Prefill edit
  useEffect(() => {
    if (editAppointment) {
      setDate(new Date(editAppointment.date));
      setSelectedTime(editAppointment.time);
    }
  }, [editAppointment]);

const handleBooking = async () => {
  if (!date || !selectedTime) {
    return alert("Select date & time");
  }
  if (!doctor?._id) {
  alert("Doctor not loaded yet");
  return;
  }

  try {
    const [time, modifier] = selectedTime.split(" ");
    let [hours, minutes] = time.split(":").map(Number);

    if (modifier === "PM" && hours !== 12) {
      hours += 12;
    }

    if (modifier === "AM" && hours === 12) {
      hours = 0;
    }

    const bookingDate = new Date(date);
    bookingDate.setHours(hours, minutes, 0, 0);

if (editAppointment && isEditable) {
  await updateAppointment(editAppointment._id, {
    date: bookingDate.toISOString(),
    duration: 30,
  });
} else if (!editAppointment) {
    await createAppointment({
    doctorId: id,
    date: bookingDate.toISOString(),
    duration: 30,
    status: "pending",
  });
} else {
  alert("This appointment cannot be rescheduled anymore.");
  return;
}
   console.log("DOCTOR OBJECT:", doctor);
console.log("DOCTOR ID:", doctor?._id);
   

    setConfirmed(true);
  } catch (err) {
    console.log("BOOK ERROR:", err.response?.data || err);
    alert("Booking failed");
  }
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
                src={doctor.avatarUrl}
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
                  {doctor.specialization}
                </h5>
                <p>{doctor.bio}</p>
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