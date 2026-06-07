import api from "./api";

// --------------------- JOBS ---------------------
export const getJobs = async (search = "") => {
  const res = await api.get(search ? `/jobs/?search=${search}` : "/jobs/");
  return res.data;
};

export const getJobById = async (id) => {
  const res = await api.get(`/jobs/${id}/`);
  return res.data;
};

// Apply to a job
export const applyJob = async (jobId, data) => {
  const formData = new FormData();

  Object.keys(data).forEach((key) => {
    if (data[key] !== null && data[key] !== "") {
      formData.append(key, data[key]);
    }
  });

  formData.append("job", Number(jobId));

  const res = await api.post(`/jobs/${jobId}/apply/`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  return res.data;
};

// --------------------- PROFILE ---------------------
export const getApplicantProfile = async () => {
  const res = await api.get("/profile/");
  return res.data;
};

// --------------------- APPLICATIONS ---------------------
export const getMyApplications = async () => {
  const res = await api.get("/profile/");
  return res.data.applications || [];
};

// --------------------- SAVED JOBS ---------------------
export const saveJob = async (jobId) => {
  const res = await api.post("/save-job/", { job: Number(jobId) });
  return res.data;
};

export const getSavedJobs = async () => {
  const res = await api.get("/saved-jobs/");
  return res.data;
};