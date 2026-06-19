import React, { useEffect, useState } from "react";
import { getMyApplications } from "../../services/applicantApi";
import { toast } from "sonner";
import { Briefcase, Clock } from "lucide-react";

const statusStyles = {
  pending: "bg-amber-50 text-amber-600 border-amber-100",
  reviewed: "bg-blue-50 text-blue-600 border-blue-100",
  shortlisted: "bg-emerald-50 text-emerald-600 border-emerald-100",
  rejected: "bg-red-50 text-red-500 border-red-100",
  hired: "bg-[#ecf7f1] text-[#2bb5a0] border-[#2bb5a0]/20",
};

const statusDot = {
  pending: "bg-amber-500",
  reviewed: "bg-blue-500",
  shortlisted: "bg-emerald-500",
  rejected: "bg-red-500",
  hired: "bg-[#2bb5a0]",
};

export default function MyApplications() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchApplications = async () => {
    try {
      const data = await getMyApplications();
      setApplications(data);
    } catch (err) {
      console.log(err);
      toast.error("Failed to load applications");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  return (
    <div className="max-w-5xl mx-auto">
      {/* ── Header card ──────────────────────────────────────────────────── */}
      <div className="bg-white rounded-[32px] border border-slate-200 shadow-sm p-6 sm:p-8 mb-6">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-6 h-0.5 rounded-full bg-[#2bb5a0]" />
          <span className="text-[11px] font-bold uppercase tracking-[0.24em] text-[#2bb5a0]">
            Track Progress
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
          My Applications
        </h1>
        <p className="text-slate-500 mt-2 text-sm">Track your applied jobs.</p>
      </div>

      {/* ── Loading ──────────────────────────────────────────────────────── */}
      {loading && (
        <div className="flex flex-col items-center justify-center rounded-3xl border border-slate-200 bg-white p-12 shadow-sm gap-4">
          <div className="relative w-11 h-11">
            <div className="absolute inset-0 rounded-full border-4 border-slate-200" />
            <div className="absolute inset-0 rounded-full border-4 border-[#2bb5a0] border-t-transparent animate-spin" />
          </div>
          <p className="text-slate-500 text-sm font-medium">Loading applications…</p>
        </div>
      )}

      {/* ── Empty ────────────────────────────────────────────────────────── */}
      {!loading && applications.length === 0 && (
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center shadow-sm">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-3xl bg-[#ecf7f1] text-[#2bb5a0]">
            <Briefcase size={22} />
          </div>
          <p className="text-slate-700 text-sm font-semibold">You have not applied to any job yet.</p>
          <p className="mt-2 text-sm text-slate-500">
            Browse open roles and submit your first application.
          </p>
        </div>
      )}

      {/* ── Application cards ────────────────────────────────────────────── */}
      {!loading && applications.length > 0 && (
        <div className="space-y-3.5">
          {applications.map((app, index) => (
            <div
              key={index}
              className="bg-white rounded-[24px] p-5 sm:p-6 border border-slate-200 hover:border-[#2bb5a0]/30 hover:shadow-md transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="flex items-start gap-3.5 min-w-0">
                <span className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[#ecf7f1] text-[#2bb5a0]">
                  <Briefcase size={17} />
                </span>
                <div className="min-w-0">
                  <h2 className="text-base sm:text-lg font-extrabold text-slate-900 truncate">
                    {app.job_title}
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-500 mt-1 flex items-center gap-1.5">
                    <Clock size={13} className="text-slate-400 shrink-0" />
                    Applied {app.applied_at ? new Date(app.applied_at).toLocaleString() : "N/A"}
                  </p>
                </div>
              </div>

              <span
                className={`shrink-0 inline-flex items-center gap-1.5 self-start sm:self-center rounded-full border px-4 py-1.5 text-xs font-bold uppercase tracking-wide ${
                  statusStyles[app.status] || "bg-slate-50 text-slate-500 border-slate-200"
                }`}
              >
                <span className={`h-1.5 w-1.5 rounded-full ${statusDot[app.status] || "bg-slate-400"}`} />
                {app.status}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}