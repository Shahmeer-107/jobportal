import axios from "axios";

const api = axios.create({
  baseURL: "http://127.0.0.1:8000/api",
});

api.interceptors.request.use(
  (config) => {
    const publicUrls = [
      "/login/",
      "/register/",
      "/verify-otp/",
      "/forgot-password/",
      "/reset-password/",
    ];

    const isPublicUrl = publicUrls.some((url) => config.url.includes(url));

    if (!isPublicUrl) {
      const token = localStorage.getItem("access_token");

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export default api;