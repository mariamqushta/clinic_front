import api from "./api";

// GET doctor by ID
export const getDoctorById = async (id) => {
  const res = await api.get(`/doctors/${id}`);
  return res.data.data.doctor;
};

// GET all doctors (optional)
export const getAllDoctors = async () => {
  const res = await api.get("/doctors");
  return res.data.data.doctors;
};

// GET doctor availability
export const getDoctorAvailability = async (id, date) => {
  const res = await api.get(`/doctors/${id}/availability?date=${date}`);
  return res.data.data;
};