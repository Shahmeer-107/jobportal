import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Mail, Phone, MapPin, FileText, Link2, User, Briefcase, Hash, Clock } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { getApplicationById, updateApplication } from "@/services/companyAPi";

function formatDate(dateString) {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  return isNaN(date.getTime()) ? dateString : date.toLocaleString();
}

const statusStyles = {
  pending: "bg-amber-50 text-amber-600 ring-amber-100",
  reviewed: "bg-blue-50 text-blue-600 ring-blue-100",
  shortlisted: "bg-emerald-50 text-emerald-600 ring-emerald-100",
  rejected: "bg-red-50 text-red-500 ring-red-100",
  hired: "bg-[#f0faf8] text-[#2bb5a0] ring-[#2bb5a0]/20",
};

const statusDot = {
  pending: "bg-amber-500",
  reviewed: "bg-blue-500",
  shortlisted: "bg-emerald-500",
  rejected: "bg-red-500",
  hired: "bg-[#2bb5a0]",
};

/* ─── Small presentational helpers ────────────────────────────────────────── */
function StatPill({ icon: Icon, label, value }) {
  return (
    <div className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3.5">
      <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#f0faf8] text-[#2bb5a0]">
        <Icon size={17} />
      </span>
      <div className="min-w-0">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">{label}</p>
        <p className="mt-0.5 truncate text-sm font-semibold text-slate-900">{value}</p>
      </div>
    </div>
  );
}

function Section({ icon: Icon, title, children }) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
      <div className="mb-5 flex items-center gap-2.5">
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#f0faf8] text-[#2bb5a0]">
          <Icon size={16} />
        </span>
        <h2 className="text-base font-bold text-slate-900">{title}</h2>
      </div>
      {children}
    </div>
  );
}

export default function ViewApplication() {
  const { applicationId } = useParams();
  const navigate = useNavigate();
  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState("pending");
  const [savingStatus, setSavingStatus] = useState(false);

  useEffect(() => {
    const fetchApplication = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getApplicationById(applicationId);
        setApplication(data);
        setSelectedStatus(data.status || "pending");
      } catch (err) {
        console.error(err);
        setError("Failed to load application details.");
      } finally {
        setLoading(false);
      }
    };

    if (applicationId) fetchApplication();
  }, [applicationId]);

  const handleStatusSave = async (newStatus) => {
    if (!application) return;
    setSavingStatus(true);

    try {
      const payload = {
        full_name: application.full_name,
        phone_number: application.phone_number,
        contact_email: application.contact_email,
        city: application.city,
        github_url: application.github_url,
        job: application.job,
        status: newStatus,
      };

      await updateApplication(application.id, payload);
      setApplication((prev) => prev && { ...prev, status: newStatus });
      setSelectedStatus(newStatus);
      toast.success("Application status updated.");
    } catch (err) {
      console.error(err);
      toast.error("Failed to update application status. Please try again.");
    } finally {
      setSavingStatus(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-3">
          <span className="h-8 w-8 animate-spin rounded-full border-2 border-slate-200 border-t-[#2bb5a0]" />
          <p className="text-sm font-medium text-slate-500">Loading application details…</p>
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
            onClick={() => navigate("/company/dashboard/applications")}
            className="w-full rounded-2xl bg-[#2bb5a0] hover:bg-[#229e8b]"
          >
            Back to Applications
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        {/* ── Header card ─────────────────────────────────────────────── */}
        <div className="mb-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex items-center gap-4 min-w-0">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-3xl overflow-hidden bg-[#f0faf8] flex items-center justify-center shrink-0 ring-1 ring-[#2bb5a0]/10">
                {application.profile_photo ? (
                  <img
                    src={application.profile_photo}
                    alt={application.full_name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User size={28} className="text-[#2bb5a0]" />
                )}
              </div>
              <div className="min-w-0">
                <span className="inline-flex items-center gap-2 rounded-full bg-[#f0faf8] px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-[#2bb5a0]">
                  Application Detail
                </span>
                <h1 className="mt-2 text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl truncate">
                  {application.full_name || "Applicant"}
                </h1>
                <p className="mt-1 text-sm text-slate-500 truncate">
                  Applied for: {application.job_title || "Unknown job"}
                </p>
              </div>
            </div>

            <Button
              variant="outline"
              onClick={() => navigate("/company/dashboard/applications")}
              className="shrink-0 rounded-2xl border-slate-200 text-slate-700 hover:bg-slate-50"
            >
              <ArrowLeft size={16} className="mr-2" /> Back
            </Button>
          </div>
        </div>

        {/* ── Quick stats grid ────────────────────────────────────────── */}
        <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
          <StatPill icon={Mail} label="Email" value={application.contact_email} />
          <StatPill icon={Phone} label="Phone" value={application.phone_number} />
          <StatPill icon={MapPin} label="City" value={application.city || "Not specified"} />
          <StatPill icon={Clock} label="Applied At" value={formatDate(application.applied_at)} />
          <StatPill icon={Briefcase} label="Job Title" value={application.job_title || "Unknown"} />
          <StatPill icon={Hash} label="Job ID" value={application.job_id || "N/A"} />
        </div>

        {/* ── Status management ───────────────────────────────────────── */}
        <Section icon={User} title="Application Status">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <span
              className={`inline-flex items-center gap-2 self-start rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-wide ring-1 ${
                statusStyles[application.status] || "bg-slate-50 text-slate-500 ring-slate-200"
              }`}
            >
              <span className={`h-1.5 w-1.5 rounded-full ${statusDot[application.status] || "bg-slate-400"}`} />
              Current: {application.status}
            </span>

            <div className="flex items-center gap-3">
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm text-slate-900 outline-none transition focus:border-[#2bb5a0] focus:ring-4 focus:ring-[#2bb5a0]/10"
              >
                {["pending", "reviewed", "shortlisted", "rejected", "hired"].map((status) => (
                  <option key={status} value={status}>
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </option>
                ))}
              </select>
              <Button
                onClick={() => handleStatusSave(selectedStatus)}
                disabled={savingStatus}
                className="rounded-xl bg-[#2bb5a0] px-5 shadow-lg shadow-[#2bb5a0]/20 hover:bg-[#229e8b] disabled:cursor-not-allowed disabled:bg-slate-300"
              >
                {savingStatus ? "Saving…" : "Save"}
              </Button>
            </div>
          </div>
        </Section>

        {/* ── Documents & Links ───────────────────────────────────────── */}
        <div className="mt-6">
          <Section icon={FileText} title="Documents & Links">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Resume</p>
                {application.resume ? (
                  <a
                    href={application.resume}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-1.5 inline-flex items-center gap-2 font-bold text-[#2bb5a0] hover:underline"
                  >
                    <FileText size={14} /> View Resume
                  </a>
                ) : (
                  <p className="mt-1.5 text-sm text-slate-600">Not uploaded</p>
                )}
              </div>
              <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">GitHub URL</p>
                {application.github_url ? (
                  <a
                    href={application.github_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-1.5 inline-flex items-center gap-2 font-bold text-[#2bb5a0] hover:underline"
                  >
                    <Link2 size={14} /> View Profile
                  </a>
                ) : (
                  <p className="mt-1.5 text-sm text-slate-600">Not provided</p>
                )}
              </div>
            </div>
          </Section>
        </div>

        {/* ── Job reference ────────────────────────────────────────────── */}
        <div className="mt-6">
          <Section icon={Briefcase} title="Job Reference">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Job ID</p>
                <p className="mt-1.5 text-sm text-slate-800">{application.job_id}</p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Job Title</p>
                <p className="mt-1.5 text-sm text-slate-800">{application.job_title}</p>
              </div>
            </div>
            <div className="mt-4 flex items-center gap-2 text-sm text-slate-500">
              <User size={14} className="text-slate-400" /> Applicant ID: {application.applicant}
            </div>
          </Section>
        </div>
      </div>
    </div>
  );
}