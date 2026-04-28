import {React,useState,useEffect} from 'react'
import Navbar from '../components/Navbar'
import { useNavigate } from "react-router-dom";
import demoAppointments from '../models/Appointmentele';

function Appointments() {
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState(
    localStorage.getItem("tab") || "upcoming"
  );

  const [appointments, setAppointments] = useState([]);

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

        const handleCancel = (id) => {
        const confirmCancel = window.confirm(
            "Are you sure you want to cancel this appointment?"
        );

        if (!confirmCancel) return;

        const updated = appointments.map((app) =>
            app.id === id ? { ...app, status: "canceled" } : app
        );

        setAppointments(updated);

        const stored = JSON.parse(localStorage.getItem("appointments")) || [];

        const merged = stored.map((app) =>
            app.id === id ? { ...app, status: "canceled" } : app
        );

        localStorage.setItem("appointments", JSON.stringify(merged));
        };
      


        const handleReschedule = (app) => {
            navigate(`/book/${app.doctorId}`, {
                state: { appointment: app }
            });
            };
  return (
    <div>
        <Navbar/>

        <div className='container my-4 d-flex justify-content-between'>
           <h2 className='bagemaincolor '>MY Appointments</h2>
           <button className='cardbutton p-2 text-light rounded'
           onClick={() => navigate("/")}>
           + Book New Appointments</button>
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



     {filteredAppointments.map((app) => (
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
      <button className='px-4 py-3 rounded rounded-3 my-3 text-capitalize fw-semibold Reschedule'
      onClick={() => handleReschedule(app)}>Reschedule</button>

      <button className='px-4 py-3 rounded rounded-3 my-3 text-capitalize fw-semibold mx-2 Cancel'
        onClick={() => handleCancel(app.id)}>Cancel</button>
        </>
    )}

    {activeTab === "upcoming" && app.status === "confirmed" && (
      <>
        <button className='px-4 py-3 rounded rounded-3 my-3 text-capitalize fw-semibold mx-2 Reschedule'
        onClick={() => handleReschedule(app)} >Reschedule</button>
        <button className='px-4 py-3 rounded rounded-3 my-3 text-capitalize fw-semibold mx-2 Cancel'
        onClick={() => handleCancel(app.id)}>Cancel</button>
      </>
    )}
    </div>
    </div>
  </div>
))}



    </div>
  )
}

export default Appointments 