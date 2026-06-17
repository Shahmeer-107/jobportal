import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getMyJobs, deleteJob } from "../../services/companyAPi";
import { Briefcase, MapPin, Users, PlusCircle, Pencil, Trash2, Search, Eye, ChevronLeft, ChevronRight } from "lucide-react";
import { toast } from "sonner";

const PAGE_SIZE = 8;

const statusStyles = {
  open:       "bg-emerald-50 text-emerald-700 border border-emerald-100",
  closed:     "bg-slate-100 text-slate-700 border border-slate-200",
  draft:      "bg-amber-50 text-amber-700 border border-amber-100",
};

export default function MyJobs() {
  const [jobs, setJobs]         = useState([]);
  const [search, setSearch]     = useState("");
  const [page, setPage]         = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [count, setCount]       = useState(0);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const fetchJobs = async (q = "", pageNumber = 1) => {
    setLoading(true);
    setError(null);

    try {
      const data = await getMyJobs(q, pageNumber, PAGE_SIZE);
      const rawResults = data.results ?? data;
      const totalCount = data.count ?? rawResults.length;
      const paginatedJobs = Array.isArray(rawResults) && !data.results
        ? rawResults.slice((pageNumber - 1) * PAGE_SIZE, pageNumber * PAGE_SIZE)
        : rawResults;

      setJobs(paginatedJobs);
      setCount(totalCount);
      setTotalPages(Math.max(1, Math.ceil(totalCount / PAGE_SIZE)));
    } catch (err) {
      console.error(err);
      setError("Failed to load your jobs.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchJobs(search, page); }, [page]);

  const handleSearch = () => {
    setPage(1);
    fetchJobs(search, 1);
  };

  const handleKeyDown = (e) => { if (e.key === "Enter") handleSearch(); };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to remove this job posting?")) return;
    setDeletingId(id);

    try {
      await deleteJob(id);
      toast.success("Job removed successfully.");
      fetchJobs(search, page);
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete job. Please try again.");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-5">

      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-6 h-0.5 bg-[#2bb5a0] rounded-full" />
            <span className="text-[11px] font-bold uppercase tracking-widest text-[#2bb5a0]">Your Postings</span>
          </div>
          <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">My Jobs</h1>
        </div>
        <Link to="/company/dashboard/create-job"
          className="inline-flex items-center gap-2 bg-[#2bb5a0] hover:bg-[#229e8b] text-white text-sm font-bold px-5 py-2.5 rounded-xl transition-all shadow-sm shadow-[#2bb5a0]/20 hover:shadow-md">
          <PlusCircle size={16} /> Post a Job
        </Link>
      </div>

      {/* Search */}
      <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-400">My Jobs</p>
              <h2 className="mt-2 text-3xl font-extrabold text-slate-900">Active Listings</h2>
            </div>
            <div className="rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-700">
              {count} total jobs
            </div>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Current page</p>
              <p className="mt-2 text-2xl font-bold text-slate-900">{page}</p>
            </div>
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Jobs per page</p>
              <p className="mt-2 text-2xl font-bold text-slate-900">{PAGE_SIZE}</p>
            </div>
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="relative">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Search jobs by title..."
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3 pl-12 pr-4 text-sm text-slate-900 outline-none transition-all focus:border-[#2bb5a0] focus:bg-white"
            />
          </div>
          <button
            onClick={handleSearch}
            className="mt-4 w-full rounded-2xl bg-[#2bb5a0] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#249683]"
          >
            Search Jobs
          </button>
        </div>
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-24 bg-white rounded-2xl border border-gray-100 shadow-sm gap-4">
          <div className="relative w-11 h-11">
            <div className="absolute inset-0 rounded-full border-4 border-gray-100" />
            <div className="absolute inset-0 rounded-full border-4 border-[#2bb5a0] border-t-transparent animate-spin" />
          </div>
          <p className="text-gray-400 text-sm font-medium">Loading your jobs…</p>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="bg-white rounded-2xl border border-red-100 shadow-sm px-6 py-8 text-center">
          <p className="text-red-500 font-semibold text-sm mb-3">{error}</p>
          <button onClick={() => fetchJobs(search)}
            className="text-[#2bb5a0] text-[13px] font-bold border border-[#2bb5a0]/30 px-5 py-2 rounded-xl hover:bg-[#2bb5a0] hover:text-white transition-all">
            Try Again
          </button>
        </div>
      )}

      {/* Empty */}
      {!loading && !error && jobs.length === 0 && (
        <div className="flex flex-col items-center justify-center py-24 bg-white rounded-2xl border border-gray-100 shadow-sm gap-3">
          <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center">
            <Briefcase size={22} className="text-gray-300" />
          </div>
          <p className="text-gray-700 font-bold text-sm">You haven't posted any jobs yet</p>
          <Link to="/company/dashboard/create-job" className="text-[#2bb5a0] text-sm font-bold hover:underline">
            Create your first job posting →
          </Link>
        </div>
      )}

      {/* Job list */}
      {!loading && !error && jobs.length > 0 && (
        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200 text-sm text-slate-700">
              <thead className="bg-slate-50 text-left text-[12px] uppercase tracking-[0.18em] text-slate-500">
                <tr>
                  <th className="px-6 py-4">Job Title</th>
                  <th className="px-6 py-4">Location</th>
                  <th className="px-6 py-4">Applicants</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 bg-white">
                {jobs.map((job) => (
                  <tr key={job.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-5">
                      <div className="font-semibold text-slate-900">{job.title}</div>
                      <div className="mt-1 text-xs text-slate-500">{job.company_full_name || "Company"}</div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="inline-flex items-center gap-2 text-slate-500">
                        <MapPin size={14} className="text-[#2bb5a0]" /> {job.location || "Remote"}
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="inline-flex items-center gap-2 text-slate-700">
                        <Users size={14} className="text-[#2bb5a0]" /> {job.applicants_count || 0}
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <span className={`inline-flex rounded-full px-3 py-1 text-[11px] font-semibold ${statusStyles[job.status] || "bg-slate-100 text-slate-700 border border-slate-200"}`}>
                        {job.status}
                      </span>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex flex-wrap items-center gap-2">
                        <Link
                          to={`/company/dashboard/applications?job=${job.id}`}
                          className="rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-700 transition hover:border-[#2bb5a0] hover:bg-[#effdf9] hover:text-[#2bb5a0]"
                        >
                          Applicants
                        </Link>
                        <Link
                          to={`/company/dashboard/view-job/${job.id}`}
                          className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-slate-200 bg-slate-50 text-slate-600 transition hover:border-[#2bb5a0] hover:bg-[#ecfdfa] hover:text-[#2bb5a0]"
                          title="View Job"
                        >
                          <Eye size={16} />
                        </Link>
                        <Link
                          to={`/company/dashboard/edit-job/${job.id}`}
                          className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-slate-200 bg-slate-50 text-slate-600 transition hover:border-[#2bb5a0] hover:bg-[#effdf9] hover:text-[#2bb5a0]"
                          title="Edit Job"
                        >
                          <Pencil size={16} />
                        </Link>
                        <button
                          onClick={() => handleDelete(job.id)}
                          disabled={deletingId === job.id}
                          className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-red-200 bg-red-50 text-red-600 transition hover:border-red-300 hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50"
                          title="Delete Job"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {!loading && !error && totalPages > 1 && (
        <div className="flex flex-col gap-4 rounded-3xl border border-slate-200 bg-white p-5 text-sm text-slate-600 shadow-sm sm:flex-row sm:items-center sm:justify-between">
          <div>
            Showing {jobs.length} of {count} jobs
          </div>
          <div className="inline-flex flex-wrap items-center gap-2">
            <button
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
              className="inline-flex h-10 items-center justify-center rounded-2xl border border-slate-200 bg-white px-4 text-slate-600 transition hover:border-[#2bb5a0] hover:text-[#2bb5a0] disabled:cursor-not-allowed disabled:opacity-50"
            >
              <ChevronLeft size={16} /> Previous
            </button>
            {Array.from({ length: totalPages }, (_, index) => index + 1).map((pageNumber) => (
              <button
                key={pageNumber}
                onClick={() => setPage(pageNumber)}
                className={`inline-flex h-10 min-w-10 items-center justify-center rounded-2xl border px-3 text-sm font-semibold transition ${pageNumber === page ? "border-[#2bb5a0] bg-[#2bb5a0] text-white" : "border-slate-200 bg-white text-slate-700 hover:border-[#2bb5a0] hover:text-[#2bb5a0]"}`}
              >
                {pageNumber}
              </button>
            ))}
            <button
              disabled={page === totalPages}
              onClick={() => setPage(page + 1)}
              className="inline-flex h-10 items-center justify-center rounded-2xl border border-slate-200 bg-white px-4 text-slate-600 transition hover:border-[#2bb5a0] hover:text-[#2bb5a0] disabled:cursor-not-allowed disabled:opacity-50"
            >
              Next <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}