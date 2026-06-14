import {
  FaChartBar,
  FaCalendarAlt,
  FaComments,
  FaUser,
  FaSignOutAlt
} from "react-icons/fa";

function Sidebar() {
  return (
    <div className="sidebar">

      <h1 className="logo">
        Odonto
      </h1>

      <ul>

        <li className="active">
          <FaChartBar />
          Dashboard
        </li>

        <li>
          <FaCalendarAlt />
          Appointments
        </li>

        <li>
          <FaComments />
          Chats
        </li>

        <li>
          <FaUser />
          Profile
        </li>

        <li className="logout">
          <FaSignOutAlt />
          Log out
        </li>

      </ul>

    </div>
  );
}

export default Sidebar;