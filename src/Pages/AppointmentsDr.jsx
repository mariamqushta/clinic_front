import {React,useState,useEffect} from 'react'
import Navbar from '../components/Navbar'
import Side_Menu from '../components/SideMenu1';
import demoAppointments from '../models/Appointmentele';

function AppointmentsDr() {

const [search, setSearch] = useState("");
const [appointments, setAppointments] = useState([]);
const [activeTab, setActiveTab] = useState(
    localStorage.getItem("tab") || "upcoming"
  );

  useEffect(() => {
    localStorage.setItem("tab", activeTab);
  }, [activeTab]);

  useEffect(() => {
    const loadData = () => {
      const stored =
        JSON.parse(localStorage.getItem("appointments")) || [];

   const mergedMap = new Map();

// add demo first
    demoAppointments.forEach((app) => {
    mergedMap.set(app.id, app);
    });

    // override with stored (IMPORTANT)
    stored.forEach((app) => {
    mergedMap.set(app.id, app);
    });

    setAppointments(Array.from(mergedMap.values()));
        };

    loadData();
    window.addEventListener("focus", loadData);

    return () => window.removeEventListener("focus", loadData);
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
   const [year, month, day] = app.date.split("-");
   const appDate = new Date(year, month - 1, day);

    switch (activeTab) {
      case "upcoming":
        return (
          appDate >= today &&
          ["pending", "confirmed"].includes(app.status)
        );

      case "past":
        return (
          appDate < today &&
          ["completed", "missed"].includes(app.status)
        );

      case "canceled":
        return app.status === "canceled";

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


const handleAccept = (id) => {
  const updated = appointments.map((app) =>
    app.id === id ? { ...app, status: "confirmed" } : app
  );

  setAppointments(updated);
  localStorage.setItem("appointments", JSON.stringify(updated));
};

const handleReject = (id) => {
  const updated = appointments.map((app) =>
    app.id === id ? { ...app, status: "rejected" } : app
  );

  setAppointments(updated);
  localStorage.setItem("appointments", JSON.stringify(updated));
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



     {searchedAppointments.map((app) => (
  <div key={app.id} className="container divappointent rounded rounded-4 card p-1 my-3">
  <div className='d-flex justify-content-between p-3' >
  <div>
    <p> <span className='fw-semibold'>Dr:</span> {app.doctorName}</p>
    <p> <span className='fw-semibold '>service:</span> {app.service}</p>
    <p className='' ><span className=' fw-semibold'> Date:</span> {new Date(app.date).toDateString()} - {app.time}</p>
       <span
        className="px-4 py-3 rounded rounded-3 my-3 text-capitalize fw-semibold"
        style={statusStyles[app.status]}
        >
        {app.status}
        </span>
        </div>
   <div>
{activeTab === "upcoming" && app.status === "pending" && (
  <>
    <button
      className="px-4 py-3 rounded rounded-3 my-3 text-capitalize fw-semibold Accept"
      onClick={() => handleAccept(app.id)}
    >
      Accept
    </button>

    <button
      className="px-4 py-3 rounded rounded-3 my-3 text-capitalize fw-semibold mx-2 Reject"
      onClick={() => handleReject(app.id)}
    >
      Reject
    </button>
  </>
)}

    </div>
    </div>
  </div>
))}




    </div></div></div>
  )
}

export default AppointmentsDr