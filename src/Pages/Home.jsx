import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Doctorcard from "../components/Doctorcard";
import api from "../api/api";
import "../App.css";

function Home() {
  const [search, setSearch] = useState("");
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const res = await api.get("/doctors");
setDoctors(res.data.data.doctors || []);
      } catch (err) {
        console.log("Error fetching doctors:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
  }, []);

  const filteredDoctors = doctors.filter((doc) =>
    doc.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <Navbar />

      <div className="container my-3">
        <input
          type="text"
          className="form-control rounded-3"
          placeholder="Search doctor..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="container">
        {loading ? (
          <p>Loading doctors...</p>
        ) : (
          <div className="row justify-align-content-around">
            {filteredDoctors.map((doc) => (
              <div className="col-lg-4 col-md-6 col-sm-12" key={doc._id}>
                <Doctorcard doctor={doc} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Home;