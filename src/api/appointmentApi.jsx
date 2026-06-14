import api from "./api";

// ======================
// PATIENT
// ======================

// Create appointment
export const createAppointment = async (data) => {
  const res = await api.post("/appointments", data);
  return res.data;
};

// Get my appointments (PATIENT)
export const getMyAppointments = async () => {
  const res = await api.get("/appointments/me");
  return res.data.data.appointments;
};

// Cancel / Update appointment
export const updateAppointment = async (id, data) => {
  const res = await api.patch(`/appointments/${id}`, data);
  return res.data;
};

// ======================
// DOCTOR
// ======================

// Get doctor appointments
export const getDoctorAppointments = async (doctorId) => {
  const res = await api.get(`/appointments/doctor/${doctorId}`);
  return res.data.data.appointments;
};

// Accept appointment
export const acceptAppointment = async (id) => {
  const res = await api.patch(`/appointments/${id}`, {
    status: "confirmed",
  });

  return res.data;
};

// Reject / Cancel appointment
export const rejectAppointment = async (id) => {
  const res = await api.patch(`/appointments/${id}`, {
    status: "cancelled",
  });

  return res.data;
};

// Complete appointment
export const completeAppointment = async (id) => {
  const res = await api.patch(`/appointments/${id}`, {
    status: "completed",
  });

  return res.data;
};
export const cancelAppointment = async (id) => {
  const res = await api.patch(`/appointments/${id}/cancel`);
  return res.data.data.appointment;
};