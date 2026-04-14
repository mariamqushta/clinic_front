import React from 'react'

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
      <button className="text-light rounded-3 cardbutton mx-auto w-75 my-2 p-2"><a>View Details</a></button>
    </div>
  )
}

export default Doctorcard