import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/api";
import '../App.css';

function Navbar() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await api.get("/auth/profile");
        setUser(res.data.data.user);
      } catch (err) {
        console.log(err);
      }
    };

    fetchUser();
  }, []);

  return (
    <nav className="navbar navbar-expand-lg mt-3">
      <div className="container">

        <Link className="navbar-brand headerstyle fst-italic h1 fs-2" to="/home">
          Odonto
        </Link>

        <div className="collapse navbar-collapse">

          <ul className="navbar-nav m-auto mb-2 pb-3 mb-lg-0">

            <li className="nav-item">
              <Link className="nav-link active navbarli1" to="/home">Home</Link>
            </li>

            <li className="nav-item">
              <Link className="nav-link navbarli1 text-black" to="/Appointments">Appointments</Link>
            </li>

            <li className="nav-item">
              <Link className="nav-link navbarli1 text-black" to="/Chat">Chat</Link>
            </li>

            <li className="nav-item">
              <a className="nav-link navbarli1 text-black" href="#">AI Assistant</a>
            </li>

          </ul>

          {/* USER SECTION */}
          <div
            style={{ cursor: "pointer", display: "flex", alignItems: "center", gap: "10px" }}
            onClick={() => navigate("/profile")}
          >

            <span className="navbar-text">
              {user?.name || "Loading..."}
            </span>

            <img
              src={
                user?.avatarUrl ||
                `https://ui-avatars.com/api/?name=${user?.name || "User"}&background=random`
              }
              className="rounded-circle navimg"
              alt="profile"
              style={{ width: "40px", height: "40px", objectFit: "cover" }}
            />

          </div>

        </div>
      </div>
    </nav>
  );
}

export default Navbar;