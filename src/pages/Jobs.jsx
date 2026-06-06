import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getAllJobs } from "../services/companyApi";
import {
  Briefcase, Clock, DollarSign, MapPin, Search,
  Bookmark, ChevronDown, ChevronRight, SlidersHorizontal,
} from "lucide-react";

/* ─── Helpers ────────────────────────────────────────────────────────────── */
function timeAgo(dateStr) {
  if (!dateStr) return "Recently";
  const diff = Math.floor((Date.now() - new Date(dateStr)) / 1000);
  if (diff < 60)    return `${diff}s ago`;
  if (diff < 3600)  return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

function formatSalary(min, max, currency = "USD") {
  if (!min && !max) return "Not specified";
  const sym = currency === "USD" ? "$" : currency;
  if (min && max) return `${sym}${Number(min).toLocaleString()}–${sym}${Number(max).toLocaleString()}`;
  if (min) return `From ${sym}${Number(min).toLocaleString()}`;
  return `Up to ${sym}${Number(max).toLocaleString()}`;
}

function formatJobType(job_type, work_type) {
  const type = job_type ? job_type.charAt(0).toUpperCase() + job_type.slice(1) : "";
  const work = work_type ? work_type.charAt(0).toUpperCase() + work_type.slice(1) : "";
  return [type, work].filter(Boolean).join(" · ") || "—";
}

/* ─── Company logo ───────────────────────────────────────────────────────── */
function CompanyLogo({ id, size = 48 }) {
  const palettes = [
    ["#f97316","#facc15","#4ade80","#3b82f6"],
    ["#fb923c","#f43f5e","#a855f7","#38bdf8"],
    ["#34d399","#3b82f6","#a78bfa","#fb923c"],
    ["#06b6d4","#6366f1","#ec4899","#f97316"],
    ["#f59e0b","#ef4444","#8b5cf6","#10b981"],
    ["#f43f5e","#e5e7eb","#fb923c","#facc15"],
  ];
  const [c1,c2,c3,c4] = palettes[(id - 1) % palettes.length];
  const r = size / 2;
  return (
    <svg viewBox={`0 0 ${size} ${size}`} width={size} height={size} className="rounded-xl flex-shrink-0 shadow-sm">
      <path d={`M${r} ${r} L0 ${r} A${r} ${r} 0 0 1 ${r} 0 Z`}             fill={c1}/>
      <path d={`M${r} ${r} L${r} 0 A${r} ${r} 0 0 1 ${size} ${r} Z`}       fill={c2}/>
      <path d={`M${r} ${r} L${size} ${r} A${r} ${r} 0 0 1 ${r} ${size} Z`} fill={c3}/>
      <path d={`M${r} ${r} L${r} ${size} A${r} ${r} 0 0 1 0 ${r} Z`}       fill={c4}/>
    </svg>
  );
}

/* ─── Sidebar section wrapper ────────────────────────────────────────────── */
function FilterSection({ title, children }) {
  return (
    <div className="pb-5 mb-5 border-b border-gray-100 last:border-0 last:mb-0 last:pb-0">
      <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-3">{title}</p>
      {children}
    </div>
  );
}

/* ─── Checkbox row ───────────────────────────────────────────────────────── */
function CheckboxRow({ label, count, checked, onChange }) {
  return (
    <label className="flex items-center justify-between cursor-pointer group">
      <div className="flex items-center gap-2.5">
        <div className={`w-4 h-4 rounded flex items-center justify-center border transition-all flex-shrink-0
          ${checked ? "bg-[#2bb5a0] border-[#2bb5a0]" : "border-gray-300 group-hover:border-[#2bb5a0]"}`}>
          {checked && (
            <svg width="9" height="7" viewBox="0 0 9 7" fill="none">
              <path d="M1 3.5L3.5 6L8 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          )}
          <input type="checkbox" checked={checked} onChange={onChange} className="sr-only" />
        </div>
        <span className={`text-[13px] leading-none transition-colors
          ${checked ? "text-gray-900 font-semibold" : "text-gray-500 group-hover:text-gray-700"}`}>
          {label}
        </span>
      </div>
      {count !== "" && (
        <span className={`text-[11px] px-1.5 py-0.5 rounded-md font-semibold transition-colors
          ${checked ? "bg-[#e6f7f5] text-[#2bb5a0]" : "text-gray-400 bg-gray-100"}`}>
          {count}
        </span>
      )}
    </label>
  );
}

/* ─── Meta chip ──────────────────────────────────────────────────────────── */
function MetaChip({ icon, label }) {
  return (
    <span className="flex items-center gap-1.5 text-[12px] text-gray-500">
      <span className="text-[#2bb5a0] flex items-center">{icon}</span>
      <span>{label}</span>
    </span>
  );
}

/* ─── Pagination button ──────────────────────────────────────────────────── */
function PagBtn({ children, active, wide, onClick }) {
  return (
    <button onClick={onClick} className={`flex items-center justify-center gap-1.5 rounded-xl text-[13px] font-semibold transition-all
      ${wide ? "px-5 h-10" : "w-10 h-10"}
      ${active
        ? "bg-[#2bb5a0] text-white shadow-md shadow-[#2bb5a0]/30"
        : "bg-white border border-gray-200 text-gray-500 hover:border-[#2bb5a0] hover:text-[#2bb5a0] hover:shadow-sm"
      }`}>
      {children}
    </button>
  );
}

/* ══════════════════════════════════════════════════════════════════════════
   MAIN
══════════════════════════════════════════════════════════════════════════ */
export default function JobsPage() {
  const [jobs, setJobs]               = useState([]);
  const [loading, setLoading]         = useState(true);
  const [error, setError]             = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const jobsPerPage = 6;

  const [salary, setSalary]     = useState(100000);
  const [search, setSearch]     = useState("");
  const [selCats, setSelCats]   = useState([]);
  const [selTypes, setSelTypes] = useState([]);
  const [selExp, setSelExp]     = useState([]);
  const [selDate, setSelDate]   = useState([]);
  const [selTags, setSelTags]   = useState([]);
  const [sortBy, setSortBy]     = useState("latest");

  const toggle = (list, set, val) =>
    set((p) => (p.includes(val) ? p.filter((x) => x !== val) : [...p, val]));

  useEffect(() => {
    const fetchJobs = async () => {
      setLoading(true); setError(null);
      try {
        const data = await getAllJobs();
        setJobs(data.results || data);
      } catch (err) {
        console.error(err);
        setError("Failed to load jobs.");
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

  const cats  = [...new Set(jobs.map((j) => j.category).filter(Boolean))];
  const types = [...new Set(jobs.map((j) => j.job_type).filter(Boolean))];
  const exps  = [...new Set(jobs.map((j) => j.experience_level).filter(Boolean))];
  const dates = ["All", "Last Hour", "Last 24 Hours", "Last 7 Days", "Last 30 Days"];
  const tags  = [...new Set(jobs.flatMap((j) => (j.skills || "").split(",").map((s) => s.trim()).filter(Boolean)))].slice(0, 10);

  const filtered = jobs
    .filter((j) => {
      const q = search.toLowerCase();
      const matchSearch = !q || (j.title||"").toLowerCase().includes(q) || (j.company_name||"").toLowerCase().includes(q) || (j.company_full_name||"").toLowerCase().includes(q);
      const matchCat    = selCats.length  === 0 || selCats.includes(j.category);
      const matchType   = selTypes.length === 0 || selTypes.includes(j.job_type);
      const matchExp    = selExp.length   === 0 || selExp.includes(j.experience_level);
      const matchSal    = !j.salary_max || Number(j.salary_max) <= salary;
      const matchTags   = selTags.length  === 0 || selTags.some((t) => (j.skills||"").toLowerCase().includes(t.toLowerCase()));
      return matchSearch && matchCat && matchType && matchExp && matchSal && matchTags;
    })
    .sort((a, b) => {
      if (sortBy === "salary") return Number(b.salary_max||0) - Number(a.salary_max||0);
      return new Date(b.created_at) - new Date(a.created_at);
    });

  const totalPages = Math.ceil(filtered.length / jobsPerPage);
  const paginated  = filtered.slice((currentPage - 1) * jobsPerPage, currentPage * jobsPerPage);
  const activeFiltersCount = selCats.length + selTypes.length + selExp.length + selTags.length;

  return (
    <div className="min-h-screen bg-[#f4f7f7] font-sans">

      {/* ── Hero ── */}
      <section className="relative bg-gray-950 pt-14 pb-16 text-center overflow-hidden">
        <div className="absolute inset-0 opacity-[0.04]"
          style={{ backgroundImage: "linear-gradient(#fff 1px,transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px)", backgroundSize: "40px 40px" }} />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[500px] h-36 pointer-events-none"
          style={{ background: "radial-gradient(ellipse,rgba(43,181,160,0.2) 0%,transparent 70%)", filter: "blur(24px)" }} />
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-4 py-1.5 mb-5">
            <div className="w-1.5 h-1.5 rounded-full bg-[#2bb5a0] animate-pulse" />
            <span className="text-[11px] font-bold text-white/50 uppercase tracking-widest">Live Jobs Board</span>
          </div>
          <h1 className="text-5xl font-extrabold text-white tracking-tight">
            Find Your Next <span className="text-[#2bb5a0]">Opportunity</span>
          </h1>
          <p className="text-gray-500 text-sm mt-3 font-medium">
            {jobs.length > 0 ? `${jobs.length} positions available` : "Loading opportunities…"}
          </p>
        </div>
      </section>

      {/* ── Main layout ── */}
      <div className="max-w-[1280px] mx-auto flex gap-6 px-5 py-7 items-start">

        {/* ════ SIDEBAR ════ */}
        <aside className="w-[260px] flex-shrink-0 flex flex-col gap-4 sticky top-5">

          {/* Filter card */}
          <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">

            {/* Header */}
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                <SlidersHorizontal size={14} className="text-[#2bb5a0]" />
                <span className="text-[13px] font-bold text-gray-900">Filters</span>
              </div>
              {activeFiltersCount > 0 && (
                <button
                  onClick={() => { setSelCats([]); setSelTypes([]); setSelExp([]); setSelTags([]); setCurrentPage(1); }}
                  className="text-[11px] font-bold text-[#2bb5a0] hover:underline">
                  Clear ({activeFiltersCount})
                </button>
              )}
            </div>

            {/* Search */}
            <FilterSection title="Search">
              <div className="flex items-center gap-2.5 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 focus-within:border-[#2bb5a0] focus-within:ring-2 focus-within:ring-[#2bb5a0]/10 transition-all">
                <Search size={13} className="text-gray-400 flex-shrink-0" />
                <input type="text" value={search}
                  onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
                  placeholder="Job title or company"
                  className="text-[13px] text-gray-700 outline-none w-full bg-transparent placeholder-gray-400" />
              </div>
            </FilterSection>

            {/* Location */}
            <FilterSection title="Location">
              <div className="flex items-center gap-2.5 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5">
                <MapPin size={13} className="text-gray-400 flex-shrink-0" />
                <select className="text-[13px] text-gray-600 outline-none w-full bg-transparent cursor-pointer">
                  <option>Choose city</option>
                  {[...new Set(jobs.map((j) => j.location).filter(Boolean))].map((loc) => (
                    <option key={loc}>{loc}</option>
                  ))}
                </select>
              </div>
            </FilterSection>

            {cats.length > 0 && (
              <FilterSection title="Category">
                <div className="flex flex-col gap-3">
                  {cats.slice(0, 5).map((c) => (
                    <CheckboxRow key={c} label={c} count={jobs.filter((j) => j.category === c).length}
                      checked={selCats.includes(c)} onChange={() => { toggle(selCats, setSelCats, c); setCurrentPage(1); }} />
                  ))}
                </div>
              </FilterSection>
            )}

            {types.length > 0 && (
              <FilterSection title="Job Type">
                <div className="flex flex-col gap-3">
                  {types.map((t) => (
                    <CheckboxRow key={t} label={t.charAt(0).toUpperCase() + t.slice(1)}
                      count={jobs.filter((j) => j.job_type === t).length}
                      checked={selTypes.includes(t)} onChange={() => { toggle(selTypes, setSelTypes, t); setCurrentPage(1); }} />
                  ))}
                </div>
              </FilterSection>
            )}

            {exps.length > 0 && (
              <FilterSection title="Experience Level">
                <div className="flex flex-col gap-3">
                  {exps.map((e) => (
                    <CheckboxRow key={e} label={e.charAt(0).toUpperCase() + e.slice(1)}
                      count={jobs.filter((j) => j.experience_level === e).length}
                      checked={selExp.includes(e)} onChange={() => { toggle(selExp, setSelExp, e); setCurrentPage(1); }} />
                  ))}
                </div>
              </FilterSection>
            )}

            <FilterSection title="Date Posted">
              <div className="flex flex-col gap-3">
                {dates.map((d) => (
                  <CheckboxRow key={d} label={d} count=""
                    checked={selDate.includes(d)} onChange={() => { toggle(selDate, setSelDate, d); setCurrentPage(1); }} />
                ))}
              </div>
            </FilterSection>

            <FilterSection title="Salary Range">
              <div className="mt-1">
                <input type="range" min={0} max={200000} step={1000} value={salary}
                  onChange={(e) => { setSalary(Number(e.target.value)); setCurrentPage(1); }}
                  className="w-full accent-[#2bb5a0] cursor-pointer" />
                <div className="flex items-center justify-between mt-3">
                  <div className="bg-gray-50 border border-gray-200 rounded-lg px-2.5 py-1.5">
                    <span className="text-[11px] font-bold text-gray-600">$0 – ${salary.toLocaleString()}</span>
                  </div>
                  <button className="bg-[#2bb5a0] hover:bg-[#26a090] text-white text-[11px] font-bold px-3 py-1.5 rounded-lg transition-colors">
                    Apply
                  </button>
                </div>
              </div>
            </FilterSection>

            {tags.length > 0 && (
              <FilterSection title="Tags">
                <div className="flex flex-wrap gap-1.5">
                  {tags.map((tag) => {
                    const active = selTags.includes(tag);
                    return (
                      <button key={tag} onClick={() => { toggle(selTags, setSelTags, tag); setCurrentPage(1); }}
                        className={`text-[11px] font-semibold px-3 py-1.5 rounded-full border transition-all ${
                          active
                            ? "bg-[#2bb5a0] text-white border-[#2bb5a0] shadow-sm"
                            : "text-gray-500 border-gray-200 hover:border-[#2bb5a0] hover:text-[#2bb5a0] bg-white"
                        }`}>
                        {tag}
                      </button>
                    );
                  })}
                </div>
              </FilterSection>
            )}
          </div>

          {/* WE ARE HIRING banner */}
          <div className="rounded-2xl overflow-hidden relative h-32 flex items-end p-5"
            style={{ background: "linear-gradient(140deg,#1a6b5e 0%,#0e3d35 55%,#060f0d 100%)" }}>
            <div className="absolute top-4 right-4 w-14 h-14 rounded-full border border-white/10" />
            <div className="absolute top-7 right-7 w-7 h-7 rounded-full border border-white/10" />
            <div className="absolute inset-0 pointer-events-none"
              style={{ background: "radial-gradient(circle at 80% 20%, rgba(43,181,160,0.3) 0%, transparent 60%)" }} />
            <div className="relative z-10">
              <p className="text-white font-extrabold text-lg leading-tight tracking-tight">WE ARE HIRING</p>
              <p className="text-[#6ee7d4] text-[12px] mt-0.5 font-semibold">Apply Today!</p>
            </div>
          </div>
        </aside>

        {/* ════ MAIN CONTENT ════ */}
        <div className="flex-1 flex flex-col gap-4 min-w-0">

          {/* Top bar */}
          <div className="flex items-center justify-between">
            <span className="text-[13px] font-medium text-gray-500">
              {!loading && (
                <>
                  Showing{" "}
                  <span className="text-gray-900 font-bold">
                    {Math.min((currentPage - 1) * jobsPerPage + 1, filtered.length)}–{Math.min(currentPage * jobsPerPage, filtered.length)}
                  </span>{" "}
                  of <span className="text-gray-900 font-bold">{filtered.length}</span> results
                </>
              )}
            </span>
            <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-3.5 py-2.5 shadow-sm">
              <select value={sortBy}
                onChange={(e) => { setSortBy(e.target.value); setCurrentPage(1); }}
                className="text-[13px] font-semibold text-gray-700 outline-none bg-transparent cursor-pointer pr-1">
                <option value="latest">Latest first</option>
                <option value="salary">Highest salary</option>
              </select>
              <ChevronDown size={13} className="text-gray-400 flex-shrink-0" />
            </div>
          </div>

          {/* Loading */}
          {loading && (
            <div className="flex flex-col items-center justify-center py-28 gap-4">
              <div className="relative w-12 h-12">
                <div className="absolute inset-0 rounded-full border-4 border-gray-100" />
                <div className="absolute inset-0 rounded-full border-4 border-[#2bb5a0] border-t-transparent animate-spin" />
              </div>
              <p className="text-gray-400 text-sm font-medium">Loading opportunities…</p>
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="flex items-center justify-center py-20">
              <div className="text-center bg-white rounded-2xl p-8 border border-red-100 shadow-sm max-w-sm w-full">
                <p className="text-red-500 font-semibold text-sm">{error}</p>
              </div>
            </div>
          )}

          {/* Job cards */}
          {!loading && !error && (
            <>
              {paginated.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-24 bg-white rounded-2xl border border-gray-100 shadow-sm gap-3">
                  <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center">
                    <Search size={22} className="text-gray-300" />
                  </div>
                  <p className="text-gray-600 font-bold text-sm">No jobs match your filters</p>
                  <p className="text-gray-400 text-xs">Try adjusting your search criteria</p>
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  {paginated.map((job) => (
                    <div key={job.id}
                      className="group bg-white rounded-2xl px-5 py-4 border border-gray-100 shadow-sm hover:shadow-md hover:border-[#2bb5a0]/25 transition-all duration-200">

                      {/* Top row */}
                      <div className="flex items-center justify-between mb-3.5">
                        <div className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-[#2bb5a0]" />
                          <span className="text-[11px] font-bold text-[#2bb5a0] uppercase tracking-wide">
                            {timeAgo(job.created_at)}
                          </span>
                          {job.work_type === "remote" && (
                            <span className="text-[10px] font-bold bg-emerald-50 text-emerald-600 border border-emerald-100 px-2 py-0.5 rounded-full uppercase tracking-wide">
                              Remote
                            </span>
                          )}
                          {job.status === "open" && (
                            <span className="text-[10px] font-bold bg-blue-50 text-blue-500 border border-blue-100 px-2 py-0.5 rounded-full uppercase tracking-wide">
                              Hiring
                            </span>
                          )}
                        </div>
                        <Bookmark size={16}
                          className="text-gray-200 cursor-pointer hover:text-[#2bb5a0] transition-colors"
                          strokeWidth={1.5} />
                      </div>

                      {/* Company + Title */}
                      <div className="flex items-center gap-3.5 mb-4">
                        <CompanyLogo id={job.id} size={48} />
                        <div className="min-w-0">
                          <h3 className="text-[15px] font-extrabold text-gray-900 leading-tight truncate group-hover:text-[#2bb5a0] transition-colors">
                            {job.title}
                          </h3>
                          <p className="text-[12px] text-gray-400 mt-0.5 font-medium">
                            {job.company_full_name || job.company_name}
                          </p>
                        </div>
                      </div>

                      {/* Hairline divider */}
                      <div className="h-px bg-gray-50 mb-3.5" />

                      {/* Meta + CTA */}
                      <div className="flex items-center justify-between flex-wrap gap-3">
                        <div className="flex items-center flex-wrap gap-x-4 gap-y-2">
                          <MetaChip icon={<Briefcase size={12}/>}  label={job.category || "—"} />
                          <MetaChip icon={<Clock size={12}/>}      label={formatJobType(job.job_type, job.work_type)} />
                          <MetaChip icon={<DollarSign size={12}/>} label={formatSalary(job.salary_min, job.salary_max, job.currency)} />
                          <MetaChip icon={<MapPin size={12}/>}     label={job.location || "—"} />
                        </div>
                        <Link to={`/jobs/${job.id}`}
                          className="bg-[#2bb5a0] hover:bg-[#229e8b] text-white text-[12px] font-bold px-5 py-2 rounded-xl transition-all shadow-sm shadow-[#2bb5a0]/20 hover:shadow-md hover:shadow-[#2bb5a0]/30 whitespace-nowrap">
                          View Details →
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 pt-2 pb-4">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <PagBtn key={page} active={currentPage === page} onClick={() => setCurrentPage(page)}>
                      {page}
                    </PagBtn>
                  ))}
                  {currentPage < totalPages && (
                    <PagBtn wide onClick={() => setCurrentPage((p) => p + 1)}>
                      Next <ChevronRight size={13}/>
                    </PagBtn>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}