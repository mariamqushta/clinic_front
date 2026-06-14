import api from "./api";

// Register
export const signupPatient = async (data) => {
  const response = await api.post("/auth/register", data);
  return response.data;
};

// Login
export const loginPatient = async (data) => {
  const response = await api.post("/auth/login", data);
  return response.data;
};
export const loginDoctor = async (data) => {
  const response = await api.post("/auth/login", data);
  return response.data; // always return backend data directly
};

// Logout
export const logoutPatient = async () => {
  const response = await api.post("/auth/logout");
  return response.data;
};

// Get Profile
export const getProfile = async () => {
  const response = await api.get("/auth/profile");
  return response.data;
};

// Forgot Password
export const forgotPassword = async (email) => {
  const response = await api.post("/auth/forgot-password", {
    email,
  });

  return response.data;
};

// Verify OTP
export const verifyOTP = async (email, otp) => {
  const response = await api.post("/auth/verify-otp", {
    email,
    otp,
  });
  return response.data;
};

// Reset Password
export const resetPassword = async (token, password) => {
  const response = await api.patch(`/auth/reset-password/${token}`, {
    password,
  });
  return response.data;
};