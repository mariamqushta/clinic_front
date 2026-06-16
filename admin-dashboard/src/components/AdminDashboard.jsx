import StatsCards from "./StatsCards";
import RecentActivities from "./RecentActivities";
import PendingCard from "./PendingCard";

function AdminDashboard() {
 return (
  <div className="dashboard">

   <div className="header">

    <div></div>

    <div className="user-info">
      🔔 👨‍⚕️ Ali Amr
    </div>

   </div>

   <StatsCards />

   <div className="content">

    <RecentActivities />

    <PendingCard />

   </div>

  </div>
 );
}

export default AdminDashboard;