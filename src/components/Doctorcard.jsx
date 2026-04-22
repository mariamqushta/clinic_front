import React from 'react';
import { Link } from "react-router-dom";

function Doctorcard({ doctor }) {
  return (
    <div className="card border border-2  rounded-4 text-center p-3 m-5">
      <img
        src={doctor.image}
        className="card-img-top w-50 mx-auto"
        alt={doctor.name}
      />
      <div className="card-body">
        <h5 className="card-title">{doctor.name}</h5>
        <p className="card-text">{doctor.department}</p>
      </div>
      <Link
        to={`/book/${doctor.id}`}
        className="text-light rounded-3 cardbutton mx-auto w-75 my-2 p-2 text-decoration-none text-center"
      >
        View Details
      </Link>
    </div>
  )
}

export default Doctorcard