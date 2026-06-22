import axios from "axios";

const api = axios.create({
  baseURL: "https://api-job-portal-evh0hdcrh3bbb4d6.centralus-01.azurewebsites.net/api",
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access_token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export default api;