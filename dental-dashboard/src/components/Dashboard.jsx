import Stats from "./Stats";
import RecentAppointments from "./RecentAppointments";
import ChartSection from "./ChartSection";

function Dashboard() {
  return (
    <div className="dashboard">

      <div className="topBar">
        <span>🔔</span>
        <span>🛡️</span>
        <span>Ali Amr</span>
      </div>

      <Stats />

      <RecentAppointments />

      <ChartSection />

    </div>
  );
}

export default Dashboard;