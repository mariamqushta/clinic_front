import toast from "react-hot-toast";
import "./Profile.css";
import { useEffect, useState, useRef } from "react";
import Side_Menu from "../components/SideMenu1";
import api from "../api/api";
import { getDoctorReviews } from "../api/reviewApi";
import { FaUserCircle, FaPen, FaStar } from "react-icons/fa";

function DrProfile() {
  const [doctor, setDoctor] = useState(null);
  const [editing, setEditing] = useState(false);
  const [reviewsData, setReviewsData] = useState({ averageRating: 0, reviews: [] });
  const fileInputRef = useRef(null);

  // backup for rollback
  const [backupDoctor, setBackupDoctor] = useState(null);

  useEffect(() => {
    const fetchProfileAndReviews = async () => {
      try {
        const res = await api.get("/auth/profile");
        const doc = res.data.data.user;
        setDoctor(doc);

        if (doc?._id) {
          const revData = await getDoctorReviews(doc._id).catch(() => null);
          if (revData) setReviewsData(revData);
        }
      } catch (err) {
        console.log(err);
      }
    };

    fetchProfileAndReviews();
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
        toast.error("Upload failed");
      }
    };

    reader.readAsDataURL(file);
  };

  if (!doctor) return <p>Loading...</p>;

  return (
    <div className="">
      <div className="row">
        <Side_Menu />

        <div className="col-10" style={{ height: "100vh", overflowY: "auto", paddingBottom: "50px" }}>
          <div className="content">
            <div className="profile-card mb-4">
              <div className="doctor-image">
                {doctor.avatarUrl ? (
                  <img
                    src={doctor.avatarUrl}
                    style={{ width: "100px", height: "100px", objectFit: "cover" }}
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
                <div className="d-flex align-items-center mb-2 mt-2">
                  <FaStar color="#FFD700" size={18} className="me-2" />
                  <span className="fw-bold fs-5">{reviewsData.averageRating || "New"}</span>
                  <span className="text-muted ms-2">({reviewsData.reviews.length} reviews)</span>
                </div>
                <p>{doctor.bio || "No bio yet"}</p>
              </div>
            </div>

            {/* FORM */}
            <div className="form mb-5">
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

                    toast.success("Profile updated!");
                  } catch (err) {
                    console.log(err);

                    // rollback if fail
                    if (backupDoctor) setDoctor(backupDoctor);

                    toast.error("Update failed");
                  }
                }}
              >
                {editing ? "Save Changes" : "Edit Profile"}
              </button>
            </div>

            {/* Reviews Section */}
            <div className="card p-4 shadow-sm mb-5">
              <h3 className="fw-bold mb-4">My Reviews</h3>
              
              {reviewsData.reviews.length === 0 ? (
                <p className="text-muted text-center py-4">No reviews yet.</p>
              ) : (
                <div className="d-flex flex-column gap-3">
                  {reviewsData.reviews.map((rev) => (
                    <div key={rev._id} className="p-3 border rounded bg-light">
                      <div className="d-flex align-items-center mb-2">
                        <img 
                          src={rev.patientId?.avatarUrl || "https://cdn-icons-png.flaticon.com/512/149/149071.png"} 
                          alt="patient" 
                          style={{ width: "40px", height: "40px", borderRadius: "50%", objectFit: "cover" }} 
                          className="me-3"
                        />
                        <div>
                          <h6 className="mb-0 fw-bold">{rev.patientId?.name || "Anonymous Patient"}</h6>
                          <div className="text-warning mt-1">
                            {[...Array(5)].map((_, i) => (
                              <FaStar key={i} color={i < rev.rating ? "#FFD700" : "#e4e5e9"} size={14} />
                            ))}
                          </div>
                        </div>
                        <small className="ms-auto text-muted">
                          {new Date(rev.createdAt).toLocaleDateString()}
                        </small>
                      </div>
                      <p className="mb-0 mt-2 ms-5 text-secondary" style={{ fontSize: "15px" }}>{rev.comment}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

export default DrProfile;