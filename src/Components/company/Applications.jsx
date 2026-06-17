import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { getApplications } from "../../services/companyAPi";
import { Mail, Phone, MapPin, Link2, FileText, Search, Eye, Briefcase } from "lucide-react";

const statusStyles = {
  pending: "bg-amber-50 text-amber-600 border-amber-100",
  reviewed: "bg-blue-50 text-blue-600 border-blue-100",
  shortlisted: "bg-emerald-50 text-emerald-600 border-emerald-100",
  rejected: "bg-red-50 text-red-500 border-red-100",
  hired: "bg-[#f0faf8] text-[#2bb5a0] border-[#2bb5a0]/20",
};

export default function Applications() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [searchParams] = useSearchParams();
  const jobId = searchParams.get("job");

  const fetchApplications = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = {};
      if (jobId) params.job = jobId;
      const data = await getApplications(params);
      setApplications(data.results || data);
    } catch (err) {
      console.error(err);
      setError("Failed to load applications.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, [searchParams.toString()]);

  const filtered = applications.filter((application) => {
    const query = search.toLowerCase();
    return (
      !query ||
      application.full_name?.toLowerCase().includes(query) ||
      application.job_title?.toLowerCase().includes(query) ||
      application.contact_email?.toLowerCase().includes(query)
    );
  });

  return (
    <div className="space-y-5 max-w-6xl mx-auto px-2 sm:px-0">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <div className="w-6 h-0.5 rounded-full bg-[#2bb5a0]" />
          <span className="text-[11px] font-bold uppercase tracking-[0.24em] text-[#2bb5a0]">Candidates</span>
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">Applications</h1>
        <p className="mt-1 text-sm text-slate-500 max-w-2xl">
          Review submissions from your active job postings and manage candidate progress.
        </p>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="grid gap-4 sm:grid-cols-[1fr_auto] sm:items-center">
          <div className="relative">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by candidate, job title, or email…"
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-10 py-3 text-sm text-slate-900 outline-none transition focus:border-[#2bb5a0] focus:ring-2 focus:ring-[#2bb5a0]/10"
            />
          </div>
          <div className="text-sm text-slate-500">
            <span className="font-semibold text-slate-900">{filtered.length}</span> application{filtered.length !== 1 ? "s" : ""}
          </div>
        </div>
        {jobId && (
          <div className="mt-4 flex items-center gap-2 rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
            <Briefcase size={14} className="text-[#2bb5a0]" />
            Filtering by job ID <span className="font-semibold text-slate-900">{jobId}</span>
          </div>
        )}
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex flex-col items-center justify-center rounded-3xl border border-slate-200 bg-white p-12 shadow-sm gap-4">
          <div className="relative w-11 h-11">
            <div className="absolute inset-0 rounded-full border-4 border-slate-200" />
            <div className="absolute inset-0 rounded-full border-4 border-[#2bb5a0] border-t-transparent animate-spin" />
          </div>
          <p className="text-slate-500 text-sm font-medium">Loading applications…</p>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="rounded-3xl border border-red-100 bg-red-50 p-8 text-center shadow-sm">
          <p className="text-red-600 font-semibold mb-4">{error}</p>
          <button
            type="button"
            onClick={fetchApplications}
            className="rounded-2xl border border-red-200 bg-white px-5 py-2.5 text-sm font-semibold text-red-700 transition hover:bg-red-100"
          >
            Retry
          </button>
        </div>
      )}

      {/* Empty */}
      {!loading && !error && filtered.length === 0 && (
        <div className="rounded-3xl border border-slate-200 bg-white p-12 text-center shadow-sm">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-3xl bg-slate-50 text-slate-400">
            <Mail size={22} />
          </div>
          <p className="text-slate-700 text-sm font-semibold">No applications found.</p>
          <p className="mt-2 text-sm text-slate-500">Try clearing your search or checking a different job filter.</p>
        </div>
      )}

      {/* Application cards */}
      {!loading && !error && filtered.length > 0 && (
        <div className="space-y-3">
          {filtered.map((app) => (
            <div key={app.id}
              className="bg-white rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition-all px-5 py-4">

              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div className="flex items-start gap-3.5 min-w-0">
                  {/* Avatar */}
                  <div className="w-11 h-11 rounded-3xl bg-[#f0faf8] flex items-center justify-center shrink-0 overflow-hidden">
                    {app.profile_photo ? (
                      <img src={app.profile_photo} alt={app.full_name} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-[#2bb5a0] font-extrabold text-[15px]">
                        {app.full_name?.[0]?.toUpperCase() || "?"}
                      </span>
                    )}
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-[14px] font-extrabold text-slate-900 truncate">{app.full_name}</h3>
                    <p className="text-[12px] text-[#2bb5a0] font-bold mt-0.5">{app.job_title}</p>
                  </div>
                </div>

                {/* Status select */}
                <div className="flex items-center gap-2">
                  <Link to={`/company/dashboard/applications/${app.id}`}
                    className="w-9 h-9 rounded-xl border border-slate-200 text-slate-500 hover:border-[#2bb5a0] hover:text-[#2bb5a0] flex items-center justify-center transition-all"
                    title="View Application"
                  >
                    <Eye size={14} />
                  </Link>
                  <span className={`text-[12px] font-bold uppercase tracking-wide px-3 py-1.5 rounded-full border ${statusStyles[app.status] || "bg-slate-50 text-slate-500 border-slate-200"}`}>
                    {app.status}
                  </span>
                </div>
              </div>

              <div className="h-px bg-slate-100 my-3.5" />

              <div className="flex items-center gap-5 flex-wrap text-[12px] text-slate-500">
                <span className="flex items-center gap-1.5">
                  <Mail size={12} className="text-[#2bb5a0]" /> {app.contact_email}
                </span>
                <span className="flex items-center gap-1.5">
                  <Phone size={12} className="text-[#2bb5a0]" /> {app.phone_number}
                </span>
                {app.city && (
                  <span className="flex items-center gap-1.5">
                    <MapPin size={12} className="text-[#2bb5a0]" /> {app.city}
                  </span>
                )}
                {app.resume && (
                  <a href={app.resume} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-[#2bb5a0] font-bold hover:underline">
                    <FileText size={12} /> Resume
                  </a>
                )}
                {app.github_url && (
                  <a href={app.github_url} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-[#2bb5a0] font-bold hover:underline">
                    <Link2 size={12} /> GitHub
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}