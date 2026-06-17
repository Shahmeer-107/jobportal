import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createJob } from "../../services/companyAPi";
import { toast } from "sonner";
import { Briefcase } from "lucide-react";

const initialForm = {
  title: "",
  description: "",
  category: "",
  degree_required: "",
  company_full_name: "",
  job_type: "permanent",
  work_type: "remote",
  experience_level: "junior",
  salary_min: "",
  salary_max: "",
  currency: "PKR",
  skills: "",
  responsibilities: "",
  location: "",
  deadline: "",
  status: "open",
  source: "website",
  external_id: "",
};

/* ─── Reusable field wrapper ─────────────────────────────────────────────── */
function Field({ label, required, children, full }) {
  return (
    <div className={full ? "md:col-span-2" : ""}>
      <label className="block text-sm font-semibold text-gray-700 mb-1.5">
        {label} {required && <span className="text-red-400">*</span>}
      </label>
      {children}
    </div>
  );
}

const inputClass =
  "w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-[14px] text-slate-900 placeholder:text-slate-400 outline-none hover:border-slate-300 focus:border-[#2bb5a0] focus:ring-4 focus:ring-[#2bb5a0]/10 transition-all";
export default function CreateJob() {
  const navigate = useNavigate();
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // basic client-side validation matching spec required fields
    if (!form.title.trim())    { setError("Job title is required."); return; }
    if (!form.deadline)        { setError("Deadline is required."); return; }

    setLoading(true);
    try {
      await createJob({ ...form, source: form.source || "website" });
      toast.success("Job created successfully.");
      setTimeout(() => navigate("/company/dashboard/my-jobs"), 1200);
    } catch (err) {
      const data = err.response?.data;
      const firstError = data && typeof data === "object"
        ? Object.values(data)[0]?.[0] || Object.values(data)[0]
        : null;
      const message = firstError || "Failed to create job. Please check the form and try again.";
      setError(message);
      toast.error(message);
      console.error(data);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mb-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-3">
            <span className="inline-flex items-center gap-2 rounded-full bg-[#ecf7f1] px-3 py-1 text-xs font-semibold uppercase tracking-[0.28em] text-[#2bb5a0]">
              New Posting
            </span>
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">Create Job</h1>
              <p className="mt-2 max-w-2xl text-sm text-slate-500">
                Fill in the details below to publish a new job listing.
              </p>
            </div>
          </div>
        </div>

        {error && (
          <div className="mb-5 rounded-3xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          <div className="grid gap-6 xl:grid-cols-2 px-6 py-6 sm:px-8">
            <div className="space-y-6">
              <Field label="Job Title" required full>
                <input
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  placeholder="e.g. Senior Backend Developer"
                  className={inputClass}
                  maxLength={255}
                  required
                />
              </Field>

              <div className="grid gap-5 sm:grid-cols-2">
                <Field label="Category">
                  <input
                    name="category"
                    value={form.category}
                    onChange={handleChange}
                    placeholder="e.g. Software Development"
                    className={inputClass}
                    maxLength={100}
                  />
                </Field>
                <Field label="Company Full Name">
                  <input
                    name="company_full_name"
                    value={form.company_full_name}
                    onChange={handleChange}
                    placeholder="Your company's full name"
                    className={inputClass}
                    maxLength={255}
                  />
                </Field>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <Field label="Job Type">
                  <select
                    name="job_type"
                    value={form.job_type}
                    onChange={handleChange}
                    className={inputClass}
                  >
                    <option value="permanent">Permanent</option>
                    <option value="internship">Internship</option>
                    <option value="contract">Contract</option>
                  </select>
                </Field>
                <Field label="Work Type">
                  <select
                    name="work_type"
                    value={form.work_type}
                    onChange={handleChange}
                    className={inputClass}
                  >
                    <option value="remote">Remote</option>
                    <option value="full-time">Full-time</option>
                    <option value="part-time">Part-time</option>
                  </select>
                </Field>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <Field label="Experience Level">
                  <select
                    name="experience_level"
                    value={form.experience_level}
                    onChange={handleChange}
                    className={inputClass}
                  >
                    <option value="junior">Junior</option>
                    <option value="mid">Mid</option>
                    <option value="senior">Senior</option>
                  </select>
                </Field>
                <Field label="Degree Required">
                  <input
                    name="degree_required"
                    value={form.degree_required}
                    onChange={handleChange}
                    placeholder="e.g. Bachelor"
                    className={inputClass}
                    maxLength={100}
                  />
                </Field>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <Field label="Location">
                  <input
                    name="location"
                    value={form.location}
                    onChange={handleChange}
                    placeholder="e.g. Karachi, Pakistan"
                    className={inputClass}
                    maxLength={255}
                  />
                </Field>
                <Field label="Currency">
                  <select
                    name="currency"
                    value={form.currency}
                    onChange={handleChange}
                    className={inputClass}
                  >
                    <option value="PKR">PKR</option>
                    <option value="USD">USD</option>
                    <option value="EUR">EUR</option>
                    <option value="GBP">GBP</option>
                  </select>
                </Field>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <Field label="Salary Min">
                  <input
                    type="number"
                    name="salary_min"
                    value={form.salary_min}
                    onChange={handleChange}
                    placeholder="e.g. 50000"
                    className={inputClass}
                    min="0"
                  />
                </Field>
                <Field label="Salary Max">
                  <input
                    type="number"
                    name="salary_max"
                    value={form.salary_max}
                    onChange={handleChange}
                    placeholder="e.g. 90000"
                    className={inputClass}
                    min="0"
                  />
                </Field>
              </div>
            </div>

            <div className="space-y-6">
              <Field label="Deadline" required>
                <input
                  type="date"
                  name="deadline"
                  value={form.deadline}
                  onChange={handleChange}
                  className={inputClass}
                  required
                />
              </Field>

              <Field label="Status">
                <select
                  name="status"
                  value={form.status}
                  onChange={handleChange}
                  className={inputClass}
                >
                  <option value="open">Open</option>
                  <option value="closed">Closed</option>
                </select>
              </Field>

              <Field label="Source">
                <input
                  name="source"
                  value={form.source}
                  onChange={handleChange}
                  placeholder="e.g. website"
                  className={inputClass}
                  maxLength={100}
                />
              </Field>

              <Field label="Skills" full>
                <input
                  name="skills"
                  value={form.skills}
                  onChange={handleChange}
                  placeholder="Comma separated, e.g. React, Node.js, PostgreSQL"
                  className={inputClass}
                />
              </Field>

              <Field label="Description" full>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  placeholder="Detailed job description…"
                  rows={6}
                  className={`${inputClass} resize-none min-h-42.5`}
                />
              </Field>

              <Field label="Responsibilities" full>
                <textarea
                  name="responsibilities"
                  value={form.responsibilities}
                  onChange={handleChange}
                  placeholder="Key responsibilities for this role…"
                  rows={6}
                  className={`${inputClass} resize-none min-h-42.5`}
                />
              </Field>

              <Field label="External ID (Optional)" full>
                <input
                  type="text"
                  name="external_id"
                  value={form.external_id}
                  onChange={handleChange}
                  placeholder="e.g. EXT-12345"
                  className={inputClass}
                  maxLength={255}
                />
              </Field>
            </div>
          </div>

          <div className="sticky bottom-0 z-10 mt-6 border-t border-slate-200 bg-white/95 px-6 py-4 backdrop-blur sm:px-8">
            <div className="flex flex-col gap-3 sm:flex-row sm:justify-end sm:items-center">
              <button
                type="button"
                onClick={() => navigate("/company/dashboard/my-jobs")}
                className="rounded-2xl border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#2bb5a0] px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-[#2bb5a0]/20 transition hover:bg-[#229e8b] disabled:cursor-not-allowed disabled:bg-slate-300"
              >
                {loading ? (
                  <span className="inline-flex items-center gap-2">
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                    Creating…
                  </span>
                ) : (
                  <><Briefcase size={16} /> Create Job</>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}