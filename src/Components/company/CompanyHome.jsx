import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getMyJobs, getApplications } from "../../services/companyAPi";
import { Briefcase, Users, TrendingUp, PlusCircle, ArrowRight, Clock } from "lucide-react";

/* ─── Stat Card ───────────────────────────────────────────────────────────── */
function StatCard({ icon, label, value, accent }) {
  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 flex items-start justify-between">
      <div>
        <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400 mb-2">{label}</p>
        <p className="text-3xl font-extrabold text-slate-900 tracking-tight">{value}</p>
      </div>
      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 ${accent}`}>
        {icon}
      </div>
    </div>
  );
}

export default function CompanyHome() {
  const [jobs, setJobs]               = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading]         = useState(true);
  const [error, setError]             = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true); setError(null);
      try {
        const [jobsData, appsData] = await Promise.all([getMyJobs(), getApplications()]);
        setJobs(jobsData.results || jobsData);
        setApplications(appsData.results || appsData);
      } catch (err) {
        console.error(err);
        setError("Failed to load dashboard data.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const activeJobs = jobs.filter((j) => j.status === "open").length;
  const recentJobs = [...jobs]
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    .slice(0, 5);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-28 gap-4">
        <div className="relative w-11 h-11">
          <div className="absolute inset-0 rounded-full border-4 border-gray-100" />
          <div className="absolute inset-0 rounded-full border-4 border-[#2bb5a0] border-t-transparent animate-spin" />
        </div>
        <p className="text-gray-400 text-sm font-medium">Loading dashboard…</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="w-6 h-0.5 rounded-full bg-[#2bb5a0]" />
            <span className="text-[11px] font-bold uppercase tracking-[0.24em] text-[#2bb5a0]">Overview</span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">Company Dashboard</h1>
          <p className="mt-2 text-sm text-slate-500 max-w-2xl">
            Track open roles, review new applications, and keep your hiring pipeline moving.
          </p>
        </div>
        <Link
          to="/company/dashboard/create-job"
          className="inline-flex items-center gap-2 rounded-2xl bg-[#2bb5a0] px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-[#2bb5a0]/20 transition hover:bg-[#229e8b]"
        >
          <PlusCircle size={16} /> Post a Job
        </Link>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-100 text-red-500 text-sm font-semibold px-4 py-3 rounded-xl">
          {error}
        </div>
      )}

      {/* Stats */}
      <div className="grid gap-5 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          <StatCard
            icon={<Briefcase size={20} className="text-[#2bb5a0]" />}
            label="Total jobs"
            value={jobs.length}
            accent="bg-[#f0faf8]"
          />
          <StatCard
            icon={<Users size={20} className="text-blue-500" />}
            label="Applications"
            value={applications.length}
            accent="bg-blue-50"
          />
          <StatCard
            icon={<TrendingUp size={20} className="text-amber-500" />}
            label="Open roles"
            value={activeJobs}
            accent="bg-amber-50"
          />
        </div>
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-5">
            <div>
              <p className="text-sm uppercase tracking-[0.24em] text-slate-400">Company health</p>
              <h2 className="mt-2 text-2xl font-extrabold text-slate-900">Weekly snapshot</h2>
            </div>
            <div className="rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-700">Updated just now</div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
              <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Active roles</p>
              <p className="mt-3 text-3xl font-bold text-slate-900">{activeJobs}</p>
            </div>
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
              <p className="text-xs uppercase tracking-[0.24em] text-slate-500">New applications</p>
              <p className="mt-3 text-3xl font-bold text-slate-900">{applications.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent jobs */}
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-5">
          <div>
            <h2 className="text-xl font-extrabold text-slate-900">Recent Job Posts</h2>
            <p className="mt-1 text-sm text-slate-500">Your most recent open or recently updated roles.</p>
          </div>
          <Link to="/company/dashboard/my-jobs" className="text-sm font-semibold text-[#2bb5a0] hover:text-[#1f8e7a]">
            View all jobs →
          </Link>
        </div>

        {recentJobs.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-slate-200 bg-slate-50 px-6 py-10 text-center text-slate-500">
            <p className="text-sm font-medium">No job postings found.</p>
            <Link to="/company/dashboard/create-job" className="mt-3 inline-block text-sm font-semibold text-[#2bb5a0] hover:underline">
              Create a job posting
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {recentJobs.map((job) => (
              <div key={job.id} className="flex flex-col gap-3 rounded-3xl border border-slate-100 bg-slate-50 p-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-slate-900 truncate">{job.title}</p>
                  <p className="mt-1 text-sm text-slate-500 flex flex-wrap items-center gap-2">
                    <span>{job.location || "Remote"}</span>
                    <span>·</span>
                    <span>{job.applicants_count || 0} applicants</span>
                  </p>
                </div>
                <span className={`rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] ${
                  job.status === "open"
                    ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
                    : "bg-slate-100 text-slate-500 border border-slate-200"
                }`}>
                  {job.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}