import React, { useEffect, useState } from "react";
import { getJobById, saveJob } from "../../services/applicantApi";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import DOMPurify from "dompurify";
import {
  ArrowLeft,
  Briefcase,
  MapPin,
  Bookmark,
  Building2,
  GraduationCap,
  Wallet,
  CalendarClock,
  Laptop,
  BarChart3,
  Tag,
  CalendarCheck,
} from "lucide-react";

/* ─── Safe HTML renderer ──────────────────────────────────────────────────
   Job fields like `description` / `responsibilities` sometimes arrive as
   raw HTML (e.g. pasted from Notion/CMS exports with <p>, <a>, <ul> tags).
   We sanitize with DOMPurify before injecting, so tags render as real
   formatting instead of literal text, while blocking any malicious script.
   If the field is plain text (no tags), it renders exactly as before.
*/
function SafeHtml({ html, fallback, className }) {
  if (!html) {
    return <p className={className}>{fallback}</p>;
  }
  const clean = DOMPurify.sanitize(html, {
    ALLOWED_TAGS: [
      "p", "br", "strong", "b", "em", "i", "u", "a", "ul", "ol", "li",
      "h1", "h2", "h3", "h4", "span", "div", "code", "blockquote", "img",
    ],
    ALLOWED_ATTR: ["href", "target", "rel", "src", "alt"],
  });
  return (
    <div
      className={`${className} job-rich-text`}
      dangerouslySetInnerHTML={{ __html: clean }}
    />
  );
}

function formatDate(dateString) {
  if (!dateString) return null;
  const date = new Date(dateString);
  return isNaN(date.getTime())
    ? dateString
    : date.toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" });
}

/* ─── Small presentational helpers ────────────────────────────────────────── */
function StatPill({ icon: Icon, label, value }) {
  if (!value) return null;
  return (
    <div className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3.5">
      <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#ecf7f1] text-[#2bb5a0]">
        <Icon size={17} />
      </span>
      <div className="min-w-0">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">{label}</p>
        <p className="mt-0.5 truncate text-sm font-semibold text-slate-900 capitalize">{value}</p>
      </div>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div className="mb-7">
      <h2 className="text-base font-bold text-slate-900 mb-3">{title}</h2>
      {children}
    </div>
  );
}

const statusStyles = {
  open: "bg-[#ecf7f1] text-[#2bb5a0] ring-[#2bb5a0]/20",
  closed: "bg-red-50 text-red-600 ring-red-100",
};

export default function Jobdetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchJob = async () => {
    try {
      const data = await getJobById(id);
      setJob(data);
    } catch (err) {
      console.log(err);
      toast.error("Failed to load job detail");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJob();
  }, [id]);

  const handleSave = async () => {
    try {
      await saveJob(id);
      toast.success("Job saved successfully");
    } catch {
      toast.error("Already saved or failed");
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-3">
          <span className="h-8 w-8 animate-spin rounded-full border-2 border-slate-200 border-t-[#2bb5a0]" />
          <p className="text-sm font-medium text-slate-500">Loading job…</p>
        </div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 p-6">
        <div className="w-full max-w-sm rounded-3xl border border-slate-200 bg-white px-8 py-10 text-center shadow-sm">
          <p className="font-semibold text-slate-700">Job not found.</p>
          <button
            onClick={() => navigate(-1)}
            className="mt-5 w-full rounded-2xl bg-[#2bb5a0] px-6 py-2.5 text-sm font-bold text-white transition hover:bg-[#229e8b]"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const salaryText =
    job.salary_min || job.salary_max
      ? `${job.salary_min || "—"}–${job.salary_max || "—"} ${job.currency || ""}`.trim()
      : null;

  const deadlineText = formatDate(job.deadline);
  const isDeadlinePassed = job.deadline ? new Date(job.deadline) < new Date() : false;

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

        <div className="rounded-[32px] border border-slate-200 bg-white shadow-sm overflow-hidden">
          {/* ── Header band ──────────────────────────────────────────────── */}
          <div className="bg-[#0f172a] text-white p-6 sm:p-8">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-[#2bb5a0]">
                Job Opening
              </span>
              {job.status && (
                <span
                  className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wide ring-1 capitalize ${
                    statusStyles[job.status] || "bg-white/10 text-white/70 ring-white/20"
                  }`}
                >
                  <span
                    className={`h-1.5 w-1.5 rounded-full ${
                      job.status === "open" ? "bg-[#2bb5a0]" : "bg-red-500"
                    }`}
                  />
                  {job.status}
                </span>
              )}
            </div>
            <h1 className="mt-3 text-2xl sm:text-3xl font-extrabold leading-tight">{job.title}</h1>
            <p className="text-white/60 mt-2 flex items-center gap-1.5 text-sm">
              <Building2 size={14} />
              {job.company_full_name || job.company_name || "Company not specified"}
            </p>
          </div>

          <div className="p-6 sm:p-8">
            {/* ── Deadline warning banner (only if passed) ─────────────── */}
            {isDeadlinePassed && (
              <div className="mb-6 flex items-center gap-2.5 rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-semibold text-red-600">
                <CalendarCheck size={16} className="shrink-0" />
                The application deadline for this job has passed.
              </div>
            )}

            {/* ── Quick stats ───────────────────────────────────────────── */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-8">
              <StatPill icon={Briefcase} label="Job Type" value={job.job_type} />
              <StatPill icon={Laptop} label="Work Type" value={job.work_type} />
              <StatPill icon={MapPin} label="Location" value={job.location || "Remote"} />
              <StatPill icon={BarChart3} label="Experience" value={job.experience_level} />
              <StatPill icon={GraduationCap} label="Degree Required" value={job.degree_required} />
              <StatPill icon={Wallet} label="Salary" value={salaryText} />
              <StatPill icon={Tag} label="Category" value={job.category} />
              <StatPill
                icon={CalendarCheck}
                label="Deadline"
                value={deadlineText}
              />
              <StatPill icon={CalendarClock} label="Posted" value={formatDate(job.created_at)} />
            </div>

            {/* ── Description ───────────────────────────────────────────── */}
            <Section title="Job Description">
              <SafeHtml
                html={job.description}
                fallback="No description provided."
                className="text-[15px] leading-relaxed text-slate-600"
              />
            </Section>

            {/* ── Skills ─────────────────────────────────────────────────── */}
            <Section title="Skills">
              <SafeHtml
                html={job.skills}
                fallback="Not specified"
                className="text-[15px] leading-relaxed text-slate-600"
              />
            </Section>

            {/* ── Responsibilities ──────────────────────────────────────── */}
            <Section title="Responsibilities">
              <SafeHtml
                html={job.responsibilities}
                fallback="Not specified"
                className="text-[15px] leading-relaxed text-slate-600"
              />
            </Section>

            {/* ── Actions ───────────────────────────────────────────────── */}
            <div className="flex flex-wrap gap-3 pt-2">
              <Link
                to={`/applicant/dashboard/jobs/${job.id}/apply`}
                className={`px-6 py-3 rounded-2xl font-bold text-sm transition ${
                  isDeadlinePassed
                    ? "bg-slate-200 text-slate-400 cursor-not-allowed pointer-events-none"
                    : "bg-[#2bb5a0] text-white shadow-lg shadow-[#2bb5a0]/20 hover:bg-[#229e8b]"
                }`}
                aria-disabled={isDeadlinePassed}
              >
                {isDeadlinePassed ? "Applications Closed" : "Apply Now"}
              </Link>

              <button
                onClick={handleSave}
                className="border border-slate-200 px-6 py-3 rounded-2xl font-bold text-sm text-slate-700 transition hover:border-[#2bb5a0] hover:text-[#2bb5a0] hover:bg-[#ecf7f1]"
              >
                <Bookmark size={16} className="inline mr-1.5 -mt-0.5" />
                Save Job
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ── Minimal styling for sanitized rich text from job postings ─── */}
      <style>{`
        .job-rich-text p { margin-bottom: 1rem; }
        .job-rich-text p:last-child { margin-bottom: 0; }
        .job-rich-text a { color: #2bb5a0; text-decoration: underline; font-weight: 600; }
        .job-rich-text ul, .job-rich-text ol { margin: 0.75rem 0 1rem 1.25rem; }
        .job-rich-text ul { list-style-type: disc; }
        .job-rich-text ol { list-style-type: decimal; }
        .job-rich-text li { margin-bottom: 0.4rem; }
        .job-rich-text h1, .job-rich-text h2, .job-rich-text h3 {
          font-weight: 700; color: #0f172a; margin: 1.25rem 0 0.5rem;
        }
        .job-rich-text strong, .job-rich-text b { font-weight: 700; color: #0f172a; }
        .job-rich-text code {
          background: #f1f5f9; padding: 0.15rem 0.4rem; border-radius: 0.375rem;
          font-size: 0.875em; color: #0f172a;
        }
        .job-rich-text img { max-width: 100%; border-radius: 0.75rem; margin: 0.5rem 0; }
      `}</style>
    </div>
  );
}