import React from 'react';
import { Link } from "react-router-dom";
import { FaStar } from "react-icons/fa";

function Doctorcard({ doctor }) {
  return (
    <div className=" card border border-2  rounded-4 text-center p-3 m-5">
      <img
        src={doctor.avatarUrl || "/default-doctor.png"}
        className="card-img-top w-50  mx-auto doctorImg"
        alt={doctor.name}
      />
      <div className="card-body">
        <h5 className="card-title">{doctor.name}</h5>
        <p className="card-text mb-2">{doctor.specialization}</p>
        <div className="d-flex justify-content-center align-items-center mb-2">
          <FaStar color="#FFD700" size={16} className="me-1" />
          <span className="fw-bold">{doctor.averageRating || "New"}</span>
          <span className="text-muted ms-1" style={{ fontSize: "14px" }}>({doctor.reviewCount || 0})</span>
        </div>
      </div>
      <Link
       to={`/book/${doctor._id}`}
        className="text-light rounded-3 cardbutton mx-auto w-75 my-2 p-2 text-decoration-none text-center"
      >
        View Details
      </Link>
    </div>
  )
}

export default Doctorcard