import api from "./api";

// Register user
export const registerUser = async (data) => {
  const res = await api.post("/register/", data);
  return res.data;
};

// Verify OTP
export const verifyOTP = async (data) => {
  const res = await api.post("/verify-otp/", data);
  return res.data;
};

// Login
export const loginUser = async (data) => {
  const res = await api.post("/login/", data);
  return res.data;
};

// Logout
export const logoutUser = async (refresh) => {
  const res = await api.post("/logout/", { refresh });
  return res.data;
};

// Forgot Password
export const forgotPassword = async (email) => {
  const res = await api.post("/forgot-password/", { email });
  return res.data;
};

// Reset Password
export const resetPassword = async (data) => {
  const res = await api.post("/reset-password/", data);
  return res.data;
};