import api from "./api";

// Submit a new review
export const addReview = async (doctorId, rating, comment) => {
  const response = await api.post("/reviews", {
    doctorId,
    rating,
    comment,
  });
  return response.data;
};

// Get reviews for a specific doctor
export const getDoctorReviews = async (doctorId) => {
  const response = await api.get(`/reviews/doctor/${doctorId}`);
  return response.data.data;
};
