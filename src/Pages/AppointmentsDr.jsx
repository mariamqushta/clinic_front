import { useEffect, useState } from "react";
import {
  getDoctorAppointments,
  acceptAppointment,
  rejectAppointment,
  completeAppointment,
} from "../api/appointmentApi";
import Side_Menu from "../components/SideMenu1";

function AppointmentsDr() {
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState(
    localStorage.getItem("tab") || "upcoming"
  );
  const [appointments, setAppointments] = useState([]);

useEffect(() => {
  const load = async () => {
    try {
      const doctorId = localStorage.getItem("doctorId");

      if (!doctorId) {
        console.log("NO DOCTOR ID");
        return;
      }

      const data = await getDoctorAppointments(doctorId);
      setAppointments(data);
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
    canceled: { backgroundColor: "#DEE1E4", color: "#000" },
  };

  // ✅ FIX DATE BUG
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const filteredAppointments = appointments.filter((app) => {
   const appDate = new Date(app.date);
   appDate.setHours(0, 0, 0, 0);

    switch (activeTab) {
      case "upcoming":
        return (
          appDate >= today &&
          ["pending", "confirmed"].includes(app.status)
        );

      case "past":
        return (
          ["completed", "missed"].includes(app.status) ||
          (appDate < today && ["pending", "confirmed"].includes(app.status))
        );

      case "canceled":
       return app.status === "cancelled";

      default:
        return false;
    }
  });

const searchedAppointments = filteredAppointments.filter((app) => {
  const searchLower = search.toLowerCase();

  const getSearchDate = (date) => {
    const d = new Date(date);
    return {
      full: d.toDateString().toLowerCase(),
      month: d.toLocaleString("en-US", { month: "long" }).toLowerCase(),
      day: d.toLocaleString("en-US", { weekday: "long" }).toLowerCase(),
    };
  };

  const searchDate = getSearchDate(app.date);

  return (
    app.doctorName?.toLowerCase().includes(searchLower) ||
    app.time?.toLowerCase().includes(searchLower) ||
    searchDate.full.includes(searchLower) ||
    searchDate.month.includes(searchLower) ||
    searchDate.day.includes(searchLower)
  );
});



const totalAppointments = appointments.length;

const pendingCount = appointments.filter(
  (app) => app.status === "pending"
).length;

const confirmedCount = appointments.filter(
  (app) => app.status === "confirmed"
).length;

const doneCount = appointments.filter(
  (app) => app.status === "completed"
).length;


const handleAccept = async (id) => {
  try {
    await acceptAppointment(id);

    setAppointments((prev) =>
      prev.map((app) =>
        app._id === id
          ? { ...app, status: "confirmed" }
          : app
      )
    );
  } catch (err) {
    console.log(err);
  }
};

const handleReject = async (id) => {
  try {
    await rejectAppointment(id);

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

const handleComplete = async (id) => {
  try {
    await completeAppointment(id);

    setAppointments((prev) =>
      prev.map((app) =>
        app._id === id
          ? { ...app, status: "completed" }
          : app
      )
    );
  } catch (err) {
    console.log(err);
  }
};
  return (
      <div className="container-fluid">
    <div className="row">

   
      <Side_Menu />

    
      <div className="col-10">

        <div className='container my-4 d-flex justify-content-between'>
           <h2 className='bagemaincolor '>MY Appointments</h2>
            <input
                type="text"
                className="form-control w-50"
                placeholder="Search by patient or time..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                />
        </div>


<div className="container my-5">
  <div className="row text-center g-5">

    {/* Total */}
    <div className="col-12 col-md-3 text-light">
      <div className="p-2 py-5 border rounded rounded-4" style={{ background: "#104D87" }}>
        <h5>Total</h5>
        <h3>{totalAppointments}</h3>
      </div>
    </div>

    {/* Pending */}
    <div className="col-12 col-md-3 text-light">
      <div className="p-2 py-5 border rounded rounded-4" style={{ background: "#104D87" }}>
        <h5>Pending</h5>
        <h3 >{pendingCount}</h3>
      </div>
    </div>

    {/* Confirmed */}
    <div className="col-12 col-md-3 text-light">
      <div className="p-2 py-5 border rounded rounded-4" style={{ background: "#104D87" }}>
        <h5>Confirmed</h5>
        <h3 >{confirmedCount}</h3>
      </div>
    </div>

    {/* Done */}
    <div className="col-12 col-md-3 text-light">
      <div className="p-2 py-5 border rounded rounded-4" style={{ background: "#104D87" }}>
        <h5>Done</h5>
        <h3 >{doneCount}</h3>
      </div>
    </div>

  </div>
</div>



 <div className='container d-flex justify-content-start gap-5 my-5'>

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
                className={`appbtn ${activeTab === "canceled" ? "active" : ""}`}
                onClick={() => setActiveTab("canceled")}
                >
                Canceled
                </button>

       </div>

      {searchedAppointments.length === 0 ? (
        <div className="text-center my-5 py-5 text-muted">
          <h4>No appointments found for {activeTab}</h4>
          <p>You have no {activeTab} appointments at this time.</p>
        </div>
      ) : 
        searchedAppointments.map((app) => (
          <div
            key={app._id}
    className="container divappointent rounded rounded-4 card p-1 my-3"
  >
    <div className="d-flex justify-content-between p-3">
      <div>
        <p>
          <span className="fw-semibold">Patient:</span>{" "}
          {app.patientId?.name}
        </p>

        <p>
          <span className="fw-semibold">Email:</span>{" "}
          {app.patientId?.email}
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

        {app.notes && (
          <div className="mt-3 p-2 bg-light border rounded" style={{maxWidth: "400px"}}>
            <span className="fw-semibold">Patient Notes:</span> {app.notes}
          </div>
        )}
      </div>

      <div>
        {activeTab === "upcoming" && app.status === "pending" && (
          <>
            <button
              className="px-4 py-3 rounded rounded-3 my-3 text-capitalize fw-semibold Accept"
              onClick={() => handleAccept(app._id)}
            >
              Accept
            </button>

            <button
              className="px-4 py-3 rounded rounded-3 my-3 text-capitalize fw-semibold mx-2 Reject"
              onClick={() => handleReject(app._id)}
            >
              Reject
            </button>
          </>
        )}

        {app.status === "confirmed" && (
          <button
            className="px-4 py-3 rounded rounded-3 my-3 text-capitalize fw-semibold text-light"
            style={{ backgroundColor: "#46B270", border: "none" }}
            onClick={() => handleComplete(app._id)}
          >
            Mark as Completed
          </button>
        )}
      </div>
    </div>
  </div>
))}




    </div></div></div>
  )
}

export default AppointmentsDr