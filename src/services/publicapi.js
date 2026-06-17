import api from "./api";

// PUBLIC
export const getAllJobs = async (params = {}) => {
  const res = await api.get("/jobs/", { params });
  return res.data;
};

export const getJobById = async (id) => {
  const res = await api.get(`/jobs/${id}/`);
  return res.data;
};