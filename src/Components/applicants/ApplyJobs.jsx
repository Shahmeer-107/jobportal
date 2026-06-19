import React, { useState } from "react";
import { applyJob } from "../../services/applicantApi";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { ArrowLeft, Upload, Send, User, Phone, Mail, MapPin,Link} from "lucide-react";

/* ─── Extract a human-readable message from a DRF-style error response ────
   Backend errors usually look like:
     { "deadline": ["This job's deadline has passed."] }
     { "detail": "Some message" }
     { "non_field_errors": ["..."] }
   We walk the object and pull out the first usable string so the toast
   shows the REAL reason instead of a generic fallback.
*/
function extractErrorMessage(err, fallback) {
  const data = err?.response?.data;
  if (!data) return fallback;

  if (typeof data === "string") return data;
  if (data.detail) return data.detail;

  // Walk all fields (deadline, non_field_errors, status, etc.)
  for (const key of Object.keys(data)) {
    const value = data[key];
    if (Array.isArray(value) && value.length > 0) {
      return typeof value[0] === "string" ? value[0] : fallback;
    }
    if (typeof value === "string") return value;
  }

  return fallback;
}

function Field({ label, required, icon: Icon, children }) {
  return (
    <div>
      <label className="block text-sm font-semibold text-slate-700 mb-1.5">
        {label} {required && <span className="text-red-400">*</span>}
      </label>
      <div className="relative">
        {Icon && (
          <Icon size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
        )}
        {children}
      </div>
    </div>
  );
}

export default function ApplyJobs() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    full_name: "",
    phone_number: "",
    contact_email: "",
    city: "",
    resume: null,
    profile_photo: null,
    github_url: "",
    status: "pending",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setForm({ ...form, [name]: files ? files[0] : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      await applyJob(id, form);
      toast.success("Application submitted successfully");
      navigate("/applicant/dashboard/my-applications");
    } catch (err) {
      console.log(err.response?.data);
      const message = extractErrorMessage(err, "Failed to submit your application. Please try again.");
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full border border-slate-200 rounded-2xl px-4 py-3 pl-11 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-[#2bb5a0] focus:ring-4 focus:ring-[#2bb5a0]/10";

  const fileInputClass =
    "w-full border border-dashed border-slate-300 rounded-2xl px-4 py-3 text-sm text-slate-500 outline-none transition cursor-pointer file:mr-3 file:rounded-xl file:border-0 file:bg-[#ecf7f1] file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-[#2bb5a0] hover:border-[#2bb5a0]/40 focus:border-[#2bb5a0] focus:ring-4 focus:ring-[#2bb5a0]/10";

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <button
          onClick={() => navigate(-1)}
          className="mb-5 flex items-center gap-2 text-sm font-semibold text-slate-500 transition hover:text-[#2bb5a0]"
        >
          <ArrowLeft size={16} />
          Back
        </button>

        <div className="rounded-[32px] border border-slate-200 bg-white shadow-sm p-6 sm:p-8">
          <div className="mb-6">
            <span className="inline-flex items-center gap-2 rounded-full bg-[#ecf7f1] px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-[#2bb5a0]">
              Application Form
            </span>
            <h1 className="mt-3 text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
              Apply for Job
            </h1>
            <p className="mt-1.5 text-sm text-slate-500">
              Fill in your details below to submit your application.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <Field label="Full Name" required icon={User}>
              <input
                name="full_name"
                placeholder="Your full name"
                required
                minLength={1}
                maxLength={100}
                value={form.full_name}
                onChange={handleChange}
                className={inputClass}
              />
            </Field>

            <Field label="Phone Number" required icon={Phone}>
              <input
                name="phone_number"
                placeholder="e.g. +92 300 1234567"
                required
                minLength={1}
                maxLength={20}
                value={form.phone_number}
                onChange={handleChange}
                className={inputClass}
              />
            </Field>

            <Field label="Contact Email" required icon={Mail}>
              <input
                type="email"
                name="contact_email"
                placeholder="you@example.com"
                required
                minLength={1}
                maxLength={254}
                value={form.contact_email}
                onChange={handleChange}
                className={inputClass}
              />
            </Field>

            <Field label="City" icon={MapPin}>
              <input
                name="city"
                placeholder="e.g. Karachi"
                maxLength={50}
                value={form.city}
                onChange={handleChange}
                className={inputClass}
              />
            </Field>

            <Field label="GitHub URL" icon={Link}>
              <input
                name="github_url"
                type="url"
                placeholder="https://github.com/username"
                maxLength={200}
                value={form.github_url}
                onChange={handleChange}
                className={inputClass}
              />
            </Field>

            <input type="hidden" name="status" value={form.status} />

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Resume</label>
              <input
                type="file"
                name="resume"
                accept=".pdf,.doc,.docx"
                onChange={handleChange}
                className={fileInputClass}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                Profile Photo
              </label>
              <input
                type="file"
                name="profile_photo"
                accept="image/*"
                onChange={handleChange}
                className={fileInputClass}
              />
            </div>

            <button
              disabled={loading}
              className="md:col-span-2 inline-flex items-center justify-center gap-2 bg-[#2bb5a0] text-white py-3.5 rounded-2xl font-bold text-sm shadow-lg shadow-[#2bb5a0]/20 transition hover:bg-[#229e8b] disabled:cursor-not-allowed disabled:bg-slate-300"
            >
              {loading ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                  Submitting…
                </>
              ) : (
                <>
                  <Send size={16} /> Submit Application
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}