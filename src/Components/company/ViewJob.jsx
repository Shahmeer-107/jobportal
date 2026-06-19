import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Pencil,
  Building2,
  MapPin,
  Briefcase,
  Laptop,
  GraduationCap,
  BarChart3,
  Wallet,
  CalendarClock,
  Globe,
  Hash,
  ListChecks,
  FileText,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { getJobById } from "@/services/companyAPi";

function formatDate(dateString) {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  return isNaN(date.getTime())
    ? dateString
    : date.toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" });
}

/* ─── Small presentational helpers ────────────────────────────────────────── */
function StatPill({ icon: Icon, label, value }) {
  return (
    <div className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3.5">
      <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#ecf7f1] text-[#2bb5a0]">
        <Icon size={17} />
      </span>
      <div className="min-w-0">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
          {label}
        </p>
        <p className="mt-0.5 truncate text-sm font-semibold text-slate-900">
          {value}
        </p>
      </div>
    </div>
  );
}

function StatusBadge({ status }) {
  const isOpen = status?.toLowerCase() === "open";
  const isClosed = status?.toLowerCase() === "closed";
  const styles = isOpen
    ? "bg-[#ecf7f1] text-[#2bb5a0] ring-1 ring-[#2bb5a0]/20"
    : isClosed
    ? "bg-red-50 text-red-600 ring-1 ring-red-100"
    : "bg-slate-100 text-slate-500 ring-1 ring-slate-200";
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold capitalize ${styles}`}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${
          isOpen ? "bg-[#2bb5a0]" : isClosed ? "bg-red-500" : "bg-slate-400"
        }`}
      />
      {status || "Unknown"}
    </span>
  );
}

function Section({ icon: Icon, title, children }) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
      <div className="mb-5 flex items-center gap-2.5">
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#ecf7f1] text-[#2bb5a0]">
          <Icon size={16} />
        </span>
        <h2 className="text-base font-bold text-slate-900">{title}</h2>
      </div>
      {children}
    </div>
  );
}

function InfoBlock({ label, value, mono }) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
        {label}
      </p>
      <p className={`mt-1.5 text-sm text-slate-800 ${mono ? "font-mono" : ""}`}>
        {value}
      </p>
    </div>
  );
}

export default function ViewJob() {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchJob = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getJobById(jobId);
        setJob(data);
      } catch (err) {
        console.error(err);
        setError("Failed to load job details.");
      } finally {
        setLoading(false);
      }
    };

    if (jobId) fetchJob();
  }, [jobId]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-3">
          <span className="h-8 w-8 animate-spin rounded-full border-2 border-slate-200 border-t-[#2bb5a0]" />
          <p className="text-sm font-medium text-slate-500">Loading job details…</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 p-6">
        <div className="w-full max-w-sm rounded-3xl border border-red-100 bg-white px-8 py-10 text-center shadow-sm">
          <p className="mb-5 font-semibold text-red-600">{error}</p>
          <Button
            onClick={() => navigate("/company/dashboard/my-jobs")}
            className="w-full rounded-2xl bg-[#2bb5a0] hover:bg-[#229e8b]"
          >
            Back to My Jobs
          </Button>
        </div>
      </div>
    );
  }

  const salaryText =
    job.salary_min || job.salary_max
      ? `${job.salary_min || "—"} – ${job.salary_max || "—"} ${job.currency || ""}`.trim()
      : "Not specified";

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        {/* ── Header card ─────────────────────────────────────────────── */}
        <div className="mb-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
            <div className="min-w-0">
              <span className="inline-flex items-center gap-2 rounded-full bg-[#ecf7f1] px-3 py-1 text-xs font-semibold uppercase tracking-[0.28em] text-[#2bb5a0]">
                Company Job
              </span>
              <h1 className="mt-3 text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
                {job.title || "Untitled Job"}
              </h1>
              <div className="mt-2 flex flex-wrap items-center gap-3">
                <span className="text-sm text-slate-500">
                  {job.category || "No category"}
                </span>
                <span className="h-1 w-1 rounded-full bg-slate-300" />
                <StatusBadge status={job.status} />
              </div>
            </div>

            <div className="flex shrink-0 gap-2.5">
              <Button
                variant="outline"
                onClick={() => navigate("/company/dashboard/my-jobs")}
                className="rounded-2xl border-slate-200 text-slate-700 hover:bg-slate-50"
              >
                <ArrowLeft size={16} className="mr-2" /> Back
              </Button>
              <Link to={`/company/dashboard/edit-job/${job.id}`}>
                <Button className="rounded-2xl bg-[#2bb5a0] shadow-lg shadow-[#2bb5a0]/20 hover:bg-[#229e8b]">
                  <Pencil size={16} className="mr-2" /> Edit
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* ── Quick stats grid ────────────────────────────────────────── */}
        <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
          <StatPill icon={Building2} label="Company" value={job.company_full_name || "Not provided"} />
          <StatPill icon={MapPin} label="Location" value={job.location || "Not specified"} />
          <StatPill icon={Laptop} label="Work Type" value={job.work_type || "Not specified"} />
          <StatPill icon={Briefcase} label="Job Type" value={job.job_type || "Not specified"} />
          <StatPill icon={BarChart3} label="Experience" value={job.experience_level || "Not specified"} />
          <StatPill icon={Wallet} label="Salary" value={salaryText} />
        </div>

        {/* ── Description & Responsibilities ──────────────────────────── */}
        <div className="mb-6 grid gap-6 lg:grid-cols-2">
          <Section icon={FileText} title="Description">
            <p className="whitespace-pre-line text-sm leading-relaxed text-slate-700">
              {job.description || "No description provided."}
            </p>
          </Section>
          <Section icon={ListChecks} title="Responsibilities">
            <p className="whitespace-pre-line text-sm leading-relaxed text-slate-700">
              {job.responsibilities || "No responsibilities provided."}
            </p>
          </Section>
        </div>

        {/* ── Additional details ──────────────────────────────────────── */}
        <Section icon={Sparkles} title="Additional Details">
          <div className="grid gap-6 sm:grid-cols-2">
            <InfoBlock label="Skills" value={job.skills || "No skills specified."} />
            <InfoBlock
              label="Degree Required"
              value={
                <span className="inline-flex items-center gap-1.5">
                  <GraduationCap size={14} className="text-slate-400" />
                  {job.degree_required || "Not specified."}
                </span>
              }
            />
            <InfoBlock
              label="Deadline"
              value={
                <span className="inline-flex items-center gap-1.5">
                  <CalendarClock size={14} className="text-slate-400" />
                  {formatDate(job.deadline)}
                </span>
              }
            />
            <InfoBlock
              label="Source"
              value={
                <span className="inline-flex items-center gap-1.5">
                  <Globe size={14} className="text-slate-400" />
                  {job.source || "Not provided."}
                </span>
              }
            />
            <InfoBlock
              label="External ID"
              value={
                <span className="inline-flex items-center gap-1.5">
                  <Hash size={14} className="text-slate-400" />
                  {job.external_id || "Not provided."}
                </span>
              }
              mono={!!job.external_id}
            />
          </div>
        </Section>
      </div>
    </div>
  );
}