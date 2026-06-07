import api from "./api";

// --------------------- COMPANY JOBS ---------------------
export const getAllJobs = async () => {
  const res = await api.get("/jobs/");
  return res.data;
};

export const createJob = async (data) => {
  const res = await api.post("/jobs/", data);
  return res.data;
};

export const getMyJobs = async () => {
  const res = await api.get("/company/jobs/");
  return res.data;
};

export const getJobById = async (id) => {
  const res = await api.get(`/jobs/${id}/`);
  return res.data;
};

export const updateJob = async (id, data) => {
  const res = await api.put(`/jobs/${id}/`, data);
  return res.data;
};

export const deleteJob = async (id) => {
  const res = await api.delete(`/jobs/${id}/`);
  return res.data;
};

// --------------------- APPLICATIONS ---------------------
export const getApplications = async (params = {}) => {
  const res = await api.get("/company/applications/", { params });
  return res.data;
};

export const updateApplication = async (id, data) => {
  const res = await api.patch(`/company/applications/${id}/`, data);
  return res.data;
};

// --------------------- PROFILE ---------------------
export const getCompanyProfile = async () => {
  const res = await api.get("/profile/");
  return res.data;
};