import React, { useEffect, useState } from "react";
import { getSavedJobs } from "../../services/applicantApi";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { Bookmark, Clock, ArrowRight } from "lucide-react";

export default function SavedJobs() {
  const [savedJobs, setSavedJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchSavedJobs = async () => {
    try {
      const data = await getSavedJobs();
      setSavedJobs(data.results || data);
    } catch (err) {
      console.log(err);
      toast.error("Failed to load saved jobs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSavedJobs();
  }, []);

  return (
    <div className="max-w-5xl mx-auto">
      {/* ── Header card ──────────────────────────────────────────────────── */}
      <div className="bg-white rounded-[32px] border border-slate-200 shadow-sm p-6 sm:p-8 mb-6">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-6 h-0.5 rounded-full bg-[#2bb5a0]" />
          <span className="text-[11px] font-bold uppercase tracking-[0.24em] text-[#2bb5a0]">
            Bookmarked
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
          Saved Jobs
        </h1>
        <p className="text-slate-500 mt-2 text-sm">Jobs you saved for later.</p>
      </div>

      {/* ── Loading ──────────────────────────────────────────────────────── */}
      {loading && (
        <div className="flex flex-col items-center justify-center rounded-3xl border border-slate-200 bg-white p-12 shadow-sm gap-4">
          <div className="relative w-11 h-11">
            <div className="absolute inset-0 rounded-full border-4 border-slate-200" />
            <div className="absolute inset-0 rounded-full border-4 border-[#2bb5a0] border-t-transparent animate-spin" />
          </div>
          <p className="text-slate-500 text-sm font-medium">Loading saved jobs…</p>
        </div>
      )}

      {/* ── Empty ────────────────────────────────────────────────────────── */}
      {!loading && savedJobs.length === 0 && (
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center shadow-sm">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-3xl bg-[#ecf7f1] text-[#2bb5a0]">
            <Bookmark size={22} />
          </div>
          <p className="text-slate-700 text-sm font-semibold">No saved jobs found.</p>
          <p className="mt-2 text-sm text-slate-500">
            Bookmark jobs you're interested in and they'll show up here.
          </p>
        </div>
      )}

      {/* ── Saved job cards ──────────────────────────────────────────────── */}
      {!loading && savedJobs.length > 0 && (
        <div className="space-y-3.5">
          {savedJobs.map((item) => {
            const jobId = typeof item.job === "object" ? item.job.id : item.job;
            const title = item.job?.title || item.job_title || `Job ID: #${jobId}`;

            return (
              <div
                key={item.id}
                className="bg-white rounded-[24px] p-5 sm:p-6 border border-slate-200 hover:border-[#2bb5a0]/30 hover:shadow-md transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="flex items-start gap-3.5 min-w-0">
                  <span className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[#ecf7f1] text-[#2bb5a0]">
                    <Bookmark size={17} />
                  </span>
                  <div className="min-w-0">
                    <h2 className="text-base sm:text-lg font-extrabold text-slate-900 truncate">
                      {title}
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-500 mt-1 flex items-center gap-1.5">
                      <Clock size={13} className="text-slate-400 shrink-0" />
                      Saved {item.saved_at ? new Date(item.saved_at).toLocaleString() : "N/A"}
                    </p>
                  </div>
                </div>

                <Link
                  to={`/applicant/dashboard/jobs/${jobId}`}
                  className="shrink-0 inline-flex items-center justify-center gap-1.5 bg-[#2bb5a0] text-white px-5 py-2.5 rounded-2xl font-bold text-sm shadow-lg shadow-[#2bb5a0]/20 transition hover:bg-[#229e8b]"
                >
                  View Job <ArrowRight size={14} />
                </Link>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}