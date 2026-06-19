import React, { useEffect, useMemo, useState } from "react";
import { getJobs, saveJob } from "../../services/applicantApi";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import {
  Briefcase,
  MapPin,
  Search,
  Bookmark,
  ChevronLeft,
  ChevronRight,
  Building2,
} from "lucide-react";

const JOBS_PER_PAGE = 8;

export default function JobList() {
  const [jobs, setJobs] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const data = await getJobs(search);
      setJobs(data.results || data);
      setCurrentPage(1); // reset to first page on a fresh search/fetch
    } catch (err) {
      console.log(err);
      toast.error("Failed to load jobs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const handleSave = async (id) => {
    try {
      await saveJob(id);
      toast.success("Job saved successfully");
    } catch (err) {
      toast.error("Already saved or failed");
    }
  };

  // ── Client-side pagination ──────────────────────────────────────────────
  const totalPages = Math.max(1, Math.ceil(jobs.length / JOBS_PER_PAGE));

  const paginatedJobs = useMemo(() => {
    const start = (currentPage - 1) * JOBS_PER_PAGE;
    return jobs.slice(start, start + JOBS_PER_PAGE);
  }, [jobs, currentPage]);

  const goToPage = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Build a compact page-number list: 1 … current-1 current current+1 … last
  const pageNumbers = useMemo(() => {
    const pages = [];
    const add = (p) => {
      if (!pages.includes(p)) pages.push(p);
    };
    add(1);
    add(currentPage - 1);
    add(currentPage);
    add(currentPage + 1);
    add(totalPages);
    return pages
      .filter((p) => p >= 1 && p <= totalPages)
      .sort((a, b) => a - b);
  }, [currentPage, totalPages]);

  return (
    /*
      No-scroll shell: h-screen + overflow-hidden on the outer wrapper.
      Header + pagination bar stay fixed (shrink-0); only the job grid
      scrolls internally if content overflows.
    */
    <div className="h-screen overflow-hidden bg-slate-50 flex flex-col">
      <div className="max-w-5xl mx-auto w-full px-4 sm:px-0 flex flex-col flex-1 min-h-0 py-6">
        {/* ── Header / Search card ──────────────────────────────────────── */}
        <div className="shrink-0 bg-white rounded-[28px] border border-slate-200 shadow-sm p-5 sm:p-6 mb-4">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-6 h-0.5 rounded-full bg-[#2bb5a0]" />
            <span className="text-[11px] font-bold uppercase tracking-[0.24em] text-[#2bb5a0]">
              Opportunities
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-slate-900">
            Available Jobs
          </h1>
          <p className="text-slate-500 mt-1 text-sm">Find jobs that match your skills.</p>

          <div className="flex flex-col sm:flex-row gap-3 mt-4">
            <div className="relative flex-1">
              <Search
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                size={18}
              />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && fetchJobs()}
                placeholder="Search jobs..."
                className="w-full border border-slate-200 bg-slate-50 rounded-2xl pl-12 pr-4 py-2.5 text-sm text-slate-900 outline-none transition focus:border-[#2bb5a0] focus:bg-white focus:ring-4 focus:ring-[#2bb5a0]/10"
              />
            </div>

            <button
              onClick={fetchJobs}
              className="bg-[#2bb5a0] text-white px-6 py-2.5 rounded-2xl font-bold text-sm shadow-lg shadow-[#2bb5a0]/20 transition hover:bg-[#229e8b]"
            >
              Search
            </button>
          </div>
        </div>

      {/* ── Loading ──────────────────────────────────────────────────────── */}
      {loading && (
        <div className="shrink-0 flex flex-col items-center justify-center rounded-3xl border border-slate-200 bg-white p-12 shadow-sm gap-4">
          <div className="relative w-11 h-11">
            <div className="absolute inset-0 rounded-full border-4 border-slate-200" />
            <div className="absolute inset-0 rounded-full border-4 border-[#2bb5a0] border-t-transparent animate-spin" />
          </div>
          <p className="text-slate-500 text-sm font-medium">Loading jobs…</p>
        </div>
      )}

      {/* ── Empty ────────────────────────────────────────────────────────── */}
      {!loading && jobs.length === 0 && (
        <div className="shrink-0 bg-white rounded-3xl border border-slate-200 p-12 text-center shadow-sm">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-3xl bg-[#f0faf8] text-[#2bb5a0]">
            <Briefcase size={22} />
          </div>
          <p className="text-slate-700 text-sm font-semibold">No jobs found.</p>
          <p className="mt-2 text-sm text-slate-500">Try a different search term.</p>
        </div>
      )}

      {/* ── Job cards (8 per page, 2-column compact grid) ───────────────── */}
      {!loading && jobs.length > 0 && (
        <div className="flex flex-col flex-1 min-h-0">
          {/* Scrollable grid area — only this scrolls if content overflows */}
          <div className="flex-1 overflow-y-auto pr-1">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {paginatedJobs.map((job) => (
                <div
                  key={job.id}
                  className="bg-white rounded-2xl p-4 border border-slate-200 hover:border-[#2bb5a0]/30 hover:shadow-md transition-all flex flex-col"
                >
                  <div className="min-w-0">
                    <h2 className="text-[15px] font-extrabold text-slate-900 leading-snug truncate">
                      {job.title}
                    </h2>
                    <p className="text-slate-500 text-xs mt-1 flex items-center gap-1.5 truncate">
                      <Building2 size={12} className="text-slate-400 shrink-0" />
                      {job.company_name || job.company_full_name || "Company not specified"}
                    </p>
                  </div>

                  <div className="flex gap-3 text-xs text-slate-500 mt-2.5 flex-wrap">
                    <span className="flex gap-1 items-center">
                      <Briefcase size={12} className="text-[#2bb5a0]" /> {job.job_type || "N/A"}
                    </span>
                    <span className="flex gap-1 items-center">
                      <MapPin size={12} className="text-[#2bb5a0]" /> {job.location || "Remote"}
                    </span>
                  </div>

                  <div className="flex gap-2 mt-3">
                    <button
                      onClick={() => handleSave(job.id)}
                      className="border border-slate-200 px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-700 transition hover:border-[#2bb5a0] hover:text-[#2bb5a0] hover:bg-[#f0faf8]"
                    >
                      <Bookmark size={13} className="inline mr-1 -mt-0.5" />
                      Save
                    </button>

                    <Link
                      to={`/applicant/dashboard/jobs/${job.id}`}
                      className="flex-1 text-center bg-[#2bb5a0] text-white px-3.5 py-2 rounded-xl font-bold text-xs shadow-md shadow-[#2bb5a0]/20 transition hover:bg-[#229e8b]"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ── Pagination controls ──────────────────────────────────────── */}
          {totalPages > 1 && (
            <div className="shrink-0 mt-4 flex flex-col sm:flex-row items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white px-5 py-3.5 shadow-sm">
              <p className="text-sm text-slate-500">
                Showing{" "}
                <span className="font-semibold text-slate-900">
                  {(currentPage - 1) * JOBS_PER_PAGE + 1}–
                  {Math.min(currentPage * JOBS_PER_PAGE, jobs.length)}
                </span>{" "}
                of <span className="font-semibold text-slate-900">{jobs.length}</span> jobs
              </p>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => goToPage(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="h-9 w-9 flex items-center justify-center rounded-xl border border-slate-200 text-slate-500 transition hover:border-[#2bb5a0] hover:text-[#2bb5a0] disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-slate-200 disabled:hover:text-slate-500"
                  aria-label="Previous page"
                >
                  <ChevronLeft size={16} />
                </button>

                {pageNumbers.map((page, idx) => {
                  const prevPage = pageNumbers[idx - 1];
                  const showEllipsis = prevPage !== undefined && page - prevPage > 1;
                  return (
                    <React.Fragment key={page}>
                      {showEllipsis && (
                        <span className="px-1 text-sm text-slate-400">…</span>
                      )}
                      <button
                        onClick={() => goToPage(page)}
                        className={`h-9 w-9 flex items-center justify-center rounded-xl text-sm font-semibold transition ${
                          page === currentPage
                            ? "bg-[#2bb5a0] text-white shadow-lg shadow-[#2bb5a0]/20"
                            : "border border-slate-200 text-slate-600 hover:border-[#2bb5a0] hover:text-[#2bb5a0]"
                        }`}
                      >
                        {page}
                      </button>
                    </React.Fragment>
                  );
                })}

                <button
                  onClick={() => goToPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="h-9 w-9 flex items-center justify-center rounded-xl border border-slate-200 text-slate-500 transition hover:border-[#2bb5a0] hover:text-[#2bb5a0] disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-slate-200 disabled:hover:text-slate-500"
                  aria-label="Next page"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          )}
        </div>
      )}
      </div>
    </div>
  );
}