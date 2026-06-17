import api from "./api";

// ── Jobs ──────────────────────────────────────────────────────────────────
export const getAllJobs = async () => {
  const res = await api.get("/jobs/");
  return res.data;
};

export const createJob = async (data) => {
  const res = await api.post("/jobs/", data);
  return res.data;
};

// ✅ FIXED: spec says GET /jobs/my_jobs/ — not /company/jobs/
export const getMyJobs = async (search = "", page = 1, pageSize = 8) => {
  const params = {
    page,
    page_size: pageSize,
    ...(search ? { search } : {}),
  };
  const res = await api.get("/jobs/my_jobs/", { params });
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

export const partialUpdateJob = async (id, data) => {
  const res = await api.patch(`/jobs/${id}/`, data);
  return res.data;
};

export const deleteJob = async (id) => {
  const res = await api.delete(`/jobs/${id}/`);
  return res.data;
};

// ── Applications ──────────────────────────────────────────────────────────
// pass {} for all applications, or { job: jobId } to filter by job
export const getApplications = async (params = {}) => {
  const res = await api.get("/company/applications/", { params });
  return res.data;
};

export const getApplicationById = async (id) => {
  const res = await api.get(`/company/applications/${id}/`);
  return res.data;
};

// ✅ FIXED: spec only has PATCH /company/applications/{id}/ with full Application body
// (full_name, phone_number, contact_email, job are required by spec, so we merge them in)
export const updateApplication = async (id, data) => {
  const res = await api.patch(`/company/applications/${id}/`, data);
  return res.data;
};

// ── Profile ───────────────────────────────────────────────────────────────
export const getCompanyProfile = async () => {
  const res = await api.get("/profile/");
  return res.data;
};