import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getJobById, updateJob, partialUpdateJob } from "@/services/companyAPi";
import { Pencil, X } from "lucide-react";

/* ─── Reusable field wrapper (same pattern as CreateJob) ─────────────────── */
function Field({ label, required, hint, children, full }) {
  return (
    <div className={full ? "md:col-span-2" : ""}>
      <label className="block text-sm font-semibold text-gray-700 mb-1.5">
        {label} {required && <span className="text-red-400">*</span>}
      </label>
      {children}
      {hint && <p className="mt-1 text-xs text-slate-400">{hint}</p>}
    </div>
  );
}

const inputClass =
  "w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-[14px] text-slate-900 placeholder:text-slate-400 outline-none hover:border-slate-300 focus:border-[#2bb5a0] focus:ring-4 focus:ring-[#2bb5a0]/10 transition-all";

export default function EditJobs() {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [updateMethod, setUpdateMethod] = useState("patch"); // "put" or "patch"

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    degree_required: "",
    company_full_name: "",
    job_type: "",
    work_type: "",
    experience_level: "",
    salary_min: "",
    salary_max: "",
    currency: "",
    skills: "",
    responsibilities: "",
    location: "",
    deadline: "",
    status: "",
    source: "",
    external_id: "",
  });

  const [initialData, setInitialData] = useState(null);

  // Fetch job details on component mount
  useEffect(() => {
    const fetchJobDetails = async () => {
      try {
        setLoading(true);
        const jobData = await getJobById(jobId);
        setFormData({
          title: jobData.title || "",
          description: jobData.description || "",
          category: jobData.category || "",
          degree_required: jobData.degree_required || "",
          company_full_name: jobData.company_full_name || "",
          job_type: jobData.job_type || "",
          work_type: jobData.work_type || "",
          experience_level: jobData.experience_level || "",
          salary_min: jobData.salary_min || "",
          salary_max: jobData.salary_max || "",
          currency: jobData.currency || "",
          skills: jobData.skills || "",
          responsibilities: jobData.responsibilities || "",
          location: jobData.location || "",
          deadline: jobData.deadline || "",
          status: jobData.status || "",
          source: jobData.source || "",
          external_id: jobData.external_id || "",
        });
        setInitialData(jobData);
      } catch (error) {
        toast.error("Failed to load job details");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    if (jobId) {
      fetchJobDetails();
    }
  }, [jobId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle full update (PUT) - replaces all fields
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (updateMethod === "put") {
      await handleFullUpdate();
    } else {
      await handlePartialUpdate();
    }
  };

  const handleFullUpdate = async () => {
    try {
      setSubmitting(true);
      await updateJob(jobId, formData);
      toast.success("Job updated successfully (Full Update - PUT)");
      navigate("/company/dashboard/my-jobs");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update job");
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  };

  // Handle partial update (PATCH) - only updates changed fields
  const handlePartialUpdate = async () => {
    try {
      setSubmitting(true);
      const changedFields = {};
      Object.keys(formData).forEach((key) => {
        if (formData[key] !== initialData?.[key]) {
          changedFields[key] = formData[key];
        }
      });

      if (Object.keys(changedFields).length === 0) {
        toast.info("No changes detected");
        setSubmitting(false);
        return;
      }

      await partialUpdateJob(jobId, changedFields);
      toast.success("Job updated successfully (Partial Update - PATCH)");
      setInitialData(formData);
      navigate("/company/dashboard/my-jobs");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update job");
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate("/company/dashboard/my-jobs");
  };

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-3">
          <span className="h-8 w-8 animate-spin rounded-full border-2 border-slate-200 border-t-[#2bb5a0]" />
          <p className="text-sm font-medium text-slate-500">Loading job details…</p>
        </div>
      </div>
    );
  }

  return (
    /*
      Same no-scroll shell pattern as CreateJob:
      h-screen + overflow-hidden on the outer wrapper, internal scroll
      only inside the form body, action bar pinned at the bottom of
      the card so the page itself never scrolls.
    */
    <div className="h-screen overflow-hidden bg-slate-50 flex flex-col">
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8 py-6 flex flex-col flex-1 min-h-0">
        {/* Header card */}
        <div className="mb-4 shrink-0 rounded-3xl border border-slate-200 bg-white px-6 py-5 shadow-sm">
          <div className="flex items-center justify-between gap-4">
            <div className="flex flex-col gap-2">
              <span className="inline-flex w-fit items-center gap-2 rounded-full bg-[#ecf7f1] px-3 py-1 text-xs font-semibold uppercase tracking-[0.28em] text-[#2bb5a0]">
                Edit Posting
              </span>
              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
                  Edit Job
                </h1>
                <p className="mt-1 max-w-2xl text-sm text-slate-500">
                  Update the details below and save your changes.
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={handleCancel}
              className="hidden sm:inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 text-slate-400 transition hover:bg-slate-50 hover:text-slate-600"
              aria-label="Close"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Form card — fills remaining height, internal scroll only */}
        <form
          onSubmit={handleSubmit}
          className="flex flex-1 min-h-0 flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm"
        >
          {/* Scrollable body */}
          <div className="flex-1 overflow-y-auto px-6 py-6 sm:px-8">
            <div className="grid gap-x-8 gap-y-6 xl:grid-cols-2">
              {/* ── Left column ────────────────────────────────────── */}
              <div className="space-y-5">
                <Field label="Job Title" required hint="Max 255 characters" full>
                  <Input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder="e.g., Senior React Developer"
                    maxLength="255"
                    required
                    className={inputClass}
                  />
                </Field>

                <div className="grid gap-5 sm:grid-cols-2">
                  <Field label="Category" hint="Max 100 characters">
                    <Input
                      type="text"
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      placeholder="e.g., Technology, Engineering"
                      maxLength="100"
                      className={inputClass}
                    />
                  </Field>
                  <Field label="Company Full Name" hint="Max 255 characters">
                    <Input
                      type="text"
                      name="company_full_name"
                      value={formData.company_full_name}
                      onChange={handleInputChange}
                      placeholder="e.g., Acme Corporation"
                      maxLength="255"
                      className={inputClass}
                    />
                  </Field>
                </div>

                <Field label="Degree Required" hint="Max 100 characters">
                  <Input
                    type="text"
                    name="degree_required"
                    value={formData.degree_required}
                    onChange={handleInputChange}
                    placeholder="e.g., Bachelor's in Computer Science"
                    maxLength="100"
                    className={inputClass}
                  />
                </Field>

                <div className="grid gap-5 sm:grid-cols-2">
                  <Field label="Job Type">
                    <select
                      name="job_type"
                      value={formData.job_type}
                      onChange={handleInputChange}
                      className={inputClass}
                    >
                      <option value="">Select job type</option>
                      <option value="contract">Contract</option>
                      <option value="permanent">Permanent</option>
                      <option value="internship">Internship</option>
                    </select>
                  </Field>
                  <Field label="Work Type">
                    <select
                      name="work_type"
                      value={formData.work_type}
                      onChange={handleInputChange}
                      className={inputClass}
                    >
                      <option value="">Select work type</option>
                      <option value="remote">Remote</option>
                      <option value="full-time">Full-time</option>
                      <option value="part-time">Part-time</option>
                    </select>
                  </Field>
                </div>

                <Field label="Experience Level">
                  <select
                    name="experience_level"
                    value={formData.experience_level}
                    onChange={handleInputChange}
                    className={inputClass}
                  >
                    <option value="">Select experience level</option>
                    <option value="junior">Junior</option>
                    <option value="mid">Mid</option>
                    <option value="senior">Senior</option>
                  </select>
                </Field>

                <div className="grid gap-5 sm:grid-cols-3">
                  <Field label="Minimum Salary">
                    <Input
                      type="number"
                      step="0.01"
                      name="salary_min"
                      value={formData.salary_min}
                      onChange={handleInputChange}
                      placeholder="e.g., 50000"
                      className={inputClass}
                    />
                  </Field>
                  <Field label="Maximum Salary">
                    <Input
                      type="number"
                      step="0.01"
                      name="salary_max"
                      value={formData.salary_max}
                      onChange={handleInputChange}
                      placeholder="e.g., 100000"
                      className={inputClass}
                    />
                  </Field>
                  <Field label="Currency">
                    <Input
                      type="text"
                      name="currency"
                      value={formData.currency}
                      onChange={handleInputChange}
                      placeholder="e.g., USD"
                      maxLength="10"
                      className={inputClass}
                    />
                  </Field>
                </div>

                <Field label="Location" hint="Max 255 characters">
                  <Input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    placeholder="e.g., New York, USA"
                    maxLength="255"
                    className={inputClass}
                  />
                </Field>
              </div>

              {/* ── Right column ───────────────────────────────────── */}
              <div className="space-y-5">
                <Field label="Job Description" full>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Enter detailed job description"
                    rows={3}
                    className={`${inputClass} resize-none`}
                  />
                </Field>

                <Field label="Skills (comma separated)" full>
                  <textarea
                    name="skills"
                    value={formData.skills}
                    onChange={handleInputChange}
                    placeholder="e.g., React, JavaScript, TypeScript, Node.js"
                    rows={2}
                    className={`${inputClass} resize-none`}
                  />
                </Field>

                <Field label="Responsibilities" full>
                  <textarea
                    name="responsibilities"
                    value={formData.responsibilities}
                    onChange={handleInputChange}
                    placeholder="Enter job responsibilities"
                    rows={3}
                    className={`${inputClass} resize-none`}
                  />
                </Field>

                <div className="grid gap-5 sm:grid-cols-2">
                  <Field label="Application Deadline" required>
                    <Input
                      type="date"
                      name="deadline"
                      value={formData.deadline}
                      onChange={handleInputChange}
                      required
                      className={inputClass}
                    />
                  </Field>
                  <Field label="Job Status">
                    <select
                      name="status"
                      value={formData.status}
                      onChange={handleInputChange}
                      className={inputClass}
                    >
                      <option value="">Select status</option>
                      <option value="open">Open</option>
                      <option value="closed">Closed</option>
                    </select>
                  </Field>
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                  <Field label="Source" hint="Max 100 characters">
                    <Input
                      type="text"
                      name="source"
                      value={formData.source}
                      onChange={handleInputChange}
                      placeholder="e.g., Direct, Job Portal"
                      maxLength="100"
                      className={inputClass}
                    />
                  </Field>
                  <Field label="External ID (Optional)" hint="Max 255 characters">
                    <Input
                      type="text"
                      name="external_id"
                      value={formData.external_id}
                      onChange={handleInputChange}
                      placeholder="e.g., EXT-12345"
                      maxLength="255"
                      className={inputClass}
                    />
                  </Field>
                </div>

                {/* Update Method Selection */}
                <div className="rounded-2xl border border-[#2bb5a0]/20 bg-[#ecf7f1] p-4">
                  <label className="block text-sm font-semibold text-slate-700 mb-3">
                    Update Method
                  </label>
                  <div className="space-y-2.5">
                    <label
                      htmlFor="patch"
                      className="flex items-start gap-2.5 cursor-pointer"
                    >
                      <input
                        type="radio"
                        id="patch"
                        name="updateMethod"
                        value="patch"
                        checked={updateMethod === "patch"}
                        onChange={(e) => setUpdateMethod(e.target.value)}
                        className="mt-0.5 accent-[#2bb5a0]"
                      />
                      <span className="text-sm text-slate-700">
                        <strong>PATCH:</strong> Update only changed fields
                        (recommended)
                      </span>
                    </label>
                    <label
                      htmlFor="put"
                      className="flex items-start gap-2.5 cursor-pointer"
                    >
                      <input
                        type="radio"
                        id="put"
                        name="updateMethod"
                        value="put"
                        checked={updateMethod === "put"}
                        onChange={(e) => setUpdateMethod(e.target.value)}
                        className="mt-0.5 accent-[#2bb5a0]"
                      />
                      <span className="text-sm text-slate-700">
                        <strong>PUT:</strong> Full replacement of all fields
                      </span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer action bar — pinned inside the card, page never scrolls */}
          <div className="shrink-0 border-t border-slate-200 bg-white px-6 py-4 sm:px-8">
            <div className="flex flex-col gap-3 sm:flex-row sm:justify-end sm:items-center">
              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
                disabled={submitting}
                className="rounded-2xl border-slate-200 px-6 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={submitting}
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#2bb5a0] px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-[#2bb5a0]/20 hover:bg-[#229e8b] disabled:cursor-not-allowed disabled:bg-slate-300"
              >
                {submitting ? (
                  <span className="inline-flex items-center gap-2">
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                    Updating…
                  </span>
                ) : (
                  <>
                    <Pencil size={16} /> Update Job
                  </>
                )}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}