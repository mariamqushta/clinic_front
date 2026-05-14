import "./Profile.css";
import { useEffect, useState, useRef } from "react";
import Side_Menu from "../components/SideMenu1";
import api from "../api/api";
import { FaUserCircle, FaPen } from "react-icons/fa";

function DrProfile() {
  const [doctor, setDoctor] = useState(null);
  const [editing, setEditing] = useState(false);
  const fileInputRef = useRef(null);

  // backup for rollback
  const [backupDoctor, setBackupDoctor] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get("/auth/profile");
        setDoctor(res.data.data.user);
      } catch (err) {
        console.log(err);
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setDoctor((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageUpload = (file) => {
    if (!file) return;

    const reader = new FileReader();

    reader.onloadend = async () => {
      const base64 = reader.result;

      try {
        if (!doctor?._id) return;

        setDoctor((prev) => ({
          ...prev,
          avatarUrl: base64,
        }));

        const res = await api.patch(`/users/${doctor._id}`, {
          avatarUrl: base64,
        });

        setDoctor(res.data.data.user);
      } catch (err) {
        console.log(err);
        alert("Upload failed");
      }
    };

    reader.readAsDataURL(file);
  };

  if (!doctor) return <p>Loading...</p>;

  return (
    <div className="">
      <div className="row">
        <Side_Menu />

        <div className="col-10">
          <div className="content">
            <div className="profile-card">
              <div className="doctor-image">
                {doctor.avatarUrl ? (
                  <img
                    src={doctor.avatarUrl}
                    style={{ width: "100px", height: "100px" }}
                    alt="doctor"
                  />
                ) : (
                  <FaUserCircle className="doctor-icon" />
                )}

                <input
                  type="file"
                  ref={fileInputRef}
                  style={{ display: "none" }}
                  accept="image/*"
                  onChange={(e) => handleImageUpload(e.target.files[0])}
                />
              </div>

              <div className="doctor-info">
                <div className="top-row">
                  <h3>Dr. {doctor.name}</h3>

                  <FaPen
                    className="edit-icon"
                    style={{ cursor: "pointer" }}
                    onClick={() => fileInputRef.current?.click()}
                  />
                </div>

                <h4>{doctor.specialization || "No specialty yet"}</h4>
                <p>{doctor.bio || "No bio yet"}</p>
              </div>
            </div>

            {/* FORM */}
            <div className="form">
              <label>Name</label>
              <input
                name="name"
                value={doctor.name || ""}
                onChange={handleChange}
                disabled={!editing}
              />

              <label>Email</label>
              <input
                name="email"
                value={doctor.email || ""}
                disabled
              />

              <label>Phone</label>
              <input
                name="phone"
                value={doctor.phone || ""}
                onChange={handleChange}
                disabled={!editing}
              />

              <label>specialization</label>
              <input
                name="specialization"
                value={doctor.specialization || ""}
                onChange={handleChange}
                disabled={!editing}
              />

              <label>bio</label>
              <textarea
                name="bio"
                value={doctor.bio || ""}
                onChange={handleChange}
                disabled={!editing}
              />

              <button
                className="save-btn"
                onClick={async () => {
                  if (!editing) {
                    setBackupDoctor(doctor);
                    setEditing(true);
                    return;
                  }

                  try {
                    if (!doctor?._id) return;

                    const res = await api.patch(
                      `/users/${doctor._id}`,
                      {
                        name: doctor.name,
                        phone: doctor.phone,
                        specialization: doctor.specialization,
                        bio: doctor.bio,
                        avatarUrl: doctor.avatarUrl,
                      }
                    );

                    setDoctor(res.data.data.user);
                    setEditing(false);

                    alert("Profile updated!");
                  } catch (err) {
                    console.log(err);

                    // rollback if fail
                    if (backupDoctor) setDoctor(backupDoctor);

                    alert("Update failed");
                  }
                }}
              >
                {editing ? "Save Changes" : "Edit Profile"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DrProfile;