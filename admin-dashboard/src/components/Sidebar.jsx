import {
 FaThLarge,
 FaUserMd,
 FaUsers,
 FaSignOutAlt
} from "react-icons/fa";

function Sidebar() {
 return (
  <div className="sidebar">

   <h1 className="logo">
    Dental <span>Admin</span>
   </h1>

   <ul>

    <li className="active">
      <FaThLarge />
      Dashboard
    </li>

    <li>
      <FaUserMd />
      Doctor Verification
    </li>

    <li>
      <FaUsers />
      Users
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