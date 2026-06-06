import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { getJobById, getAllJobs } from "../services/companyApi";
import {
  Briefcase, Clock, DollarSign, MapPin, Bookmark,
  Check, Facebook, Twitter, Linkedin, Send, ArrowLeft,
  CalendarDays, GraduationCap, Building2,
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

function parseSkills(skills) {
  if (!skills) return [];
  if (Array.isArray(skills)) return skills;
  return skills.split(",").map((s) => s.trim()).filter(Boolean);
}

/* ─── Company logo ───────────────────────────────────────────────────────── */
function CompanyLogo({ id, size = 52 }) {
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
    <svg viewBox={`0 0 ${size} ${size}`} width={size} height={size} className="rounded-2xl flex-shrink-0 shadow-md">
      <path d={`M${r} ${r} L0 ${r} A${r} ${r} 0 0 1 ${r} 0 Z`}             fill={c1}/>
      <path d={`M${r} ${r} L${r} 0 A${r} ${r} 0 0 1 ${size} ${r} Z`}       fill={c2}/>
      <path d={`M${r} ${r} L${size} ${r} A${r} ${r} 0 0 1 ${r} ${size} Z`} fill={c3}/>
      <path d={`M${r} ${r} L${r} ${size} A${r} ${r} 0 0 1 0 ${r} Z`}       fill={c4}/>
    </svg>
  );
}

/* ─── Overview item ──────────────────────────────────────────────────────── */
function OverviewItem({ icon, label, value }) {
  return (
    <div className="flex items-center gap-3 py-3 border-b border-gray-50 last:border-0">
      <div className="w-8 h-8 rounded-xl bg-[#f0faf8] flex items-center justify-center flex-shrink-0">
        <span className="text-[#2bb5a0]">{icon}</span>
      </div>
      <div>
        <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 leading-none mb-0.5">{label}</p>
        <p className="text-[13px] font-semibold text-gray-800">{value || "—"}</p>
      </div>
    </div>
  );
}

/* ─── Related job card ───────────────────────────────────────────────────── */
function RelatedJobCard({ job }) {
  return (
    <div className="group bg-white rounded-2xl px-5 py-4 border border-gray-100 shadow-sm hover:shadow-md hover:border-[#2bb5a0]/25 transition-all duration-200">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-[#2bb5a0]" />
          <span className="text-[11px] font-bold text-[#2bb5a0] uppercase tracking-wide">{timeAgo(job.created_at)}</span>
        </div>
        <Bookmark size={14} className="text-gray-200" strokeWidth={1.5} />
      </div>
      <div className="flex items-center gap-3 mb-3.5">
        <CompanyLogo id={job.id} size={38} />
        <div className="min-w-0">
          <p className="text-[13px] font-extrabold text-gray-900 leading-tight truncate group-hover:text-[#2bb5a0] transition-colors">
            {job.title}
          </p>
          <p className="text-[11px] text-gray-400 mt-0.5 font-medium">{job.company_full_name || job.company_name}</p>
        </div>
      </div>
      <div className="h-px bg-gray-50 mb-3.5" />
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex flex-wrap gap-3">
          {[
            { icon:<Briefcase size={11}/>, label: job.category },
            { icon:<Clock size={11}/>,     label: formatJobType(job.job_type, job.work_type) },
            { icon:<DollarSign size={11}/>,label: formatSalary(job.salary_min, job.salary_max, job.currency) },
            { icon:<MapPin size={11}/>,    label: job.location },
          ].map(({ icon, label }) => (
            <span key={label} className="flex items-center gap-1 text-[11px] text-gray-500">
              <span className="text-[#2bb5a0]">{icon}</span>{label || "—"}
            </span>
          ))}
        </div>
        <Link to={`/jobs/${job.id}`}
          className="text-[11px] font-bold text-white bg-[#2bb5a0] hover:bg-[#229e8b] px-4 py-1.5 rounded-xl transition-colors shadow-sm shadow-[#2bb5a0]/20">
          View Details →
        </Link>
      </div>
    </div>
  );
}

/* ── Section heading ─────────────────────────────────────────────────────── */
function SectionHeading({ children }) {
  return (
    <div className="flex items-center gap-3 mb-4">
      <h3 className="text-[15px] font-extrabold text-gray-900">{children}</h3>
      <div className="flex-1 h-px bg-gray-100" />
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════════════
   MAIN COMPONENT
══════════════════════════════════════════════════════════════════════════ */
export default function JobDetailPage() {
  const { id } = useParams();

  const [job, setJob]         = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);

  const [cf, setCf]      = useState({ name:"", email:"", phone:"", message:"" });
  const handleCfChange   = (e) => setCf((p) => ({ ...p, [e.target.name]: e.target.value }));
  const handleCfSubmit   = (e) => { e.preventDefault(); console.log("Contact:", cf); };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true); setError(null);
      try {
        const [jobData, allData] = await Promise.all([getJobById(id), getAllJobs()]);
        setJob(jobData);
        const all = allData.results || allData;
        const rel = all.filter((j) => j.id !== jobData.id && j.category === jobData.category).slice(0, 3);
        setRelated(rel.length > 0 ? rel : all.filter((j) => j.id !== jobData.id).slice(0, 3));
      } catch (err) {
        console.error(err);
        setError("Failed to load job details.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  /* ── Loading ── */
  if (loading) {
    return (
      <div className="min-h-screen bg-[#f4f7f7] font-sans">
        <section className="relative bg-gray-950 pt-14 pb-16 text-center overflow-hidden">
          <div className="absolute inset-0 opacity-[0.04]"
            style={{ backgroundImage: "linear-gradient(#fff 1px,transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px)", backgroundSize: "40px 40px" }} />
          <h1 className="relative z-10 text-5xl font-extrabold text-white tracking-tight">Job Details</h1>
        </section>
        <div className="flex flex-col items-center justify-center py-32 gap-4">
          <div className="relative w-12 h-12">
            <div className="absolute inset-0 rounded-full border-4 border-gray-100" />
            <div className="absolute inset-0 rounded-full border-4 border-[#2bb5a0] border-t-transparent animate-spin" />
          </div>
          <p className="text-gray-400 text-sm font-medium">Loading job details…</p>
        </div>
      </div>
    );
  }

  /* ── Error ── */
  if (error || !job) {
    return (
      <div className="min-h-screen bg-[#f4f7f7] font-sans">
        <section className="relative bg-gray-950 pt-14 pb-16 text-center overflow-hidden">
          <div className="absolute inset-0 opacity-[0.04]"
            style={{ backgroundImage: "linear-gradient(#fff 1px,transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px)", backgroundSize: "40px 40px" }} />
          <h1 className="relative z-10 text-5xl font-extrabold text-white tracking-tight">Job Details</h1>
        </section>
        <div className="text-center py-32">
          <p className="text-red-500 font-semibold mb-4">{error || "Job not found."}</p>
          <Link to="/jobs" className="inline-flex items-center gap-1.5 text-[#2bb5a0] font-semibold text-sm hover:underline">
            <ArrowLeft size={14}/> Back to Jobs
          </Link>
        </div>
      </div>
    );
  }

  const skills = parseSkills(job.skills);

  return (
    <div className="min-h-screen bg-[#f4f7f7] font-sans">

      {/* ── Hero ── */}
      <section className="relative bg-gray-950 pt-14 pb-16 text-center overflow-hidden">
        <div className="absolute inset-0 opacity-[0.04]"
          style={{ backgroundImage: "linear-gradient(#fff 1px,transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px)", backgroundSize: "40px 40px" }} />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-96 h-32 pointer-events-none"
          style={{ background: "radial-gradient(ellipse,rgba(43,181,160,0.2) 0%,transparent 70%)", filter: "blur(24px)" }} />
        <div className="relative z-10">
          <Link to="/jobs"
            className="inline-flex items-center gap-1.5 text-white/40 hover:text-white/70 text-[12px] font-semibold mb-4 transition-colors">
            <ArrowLeft size={12}/> Back to Jobs
          </Link>
          <h1 className="text-5xl font-extrabold text-white tracking-tight">Job Details</h1>
        </div>
      </section>

      {/* ── Body ── */}
      <div className="max-w-5xl mx-auto px-6 py-8 flex gap-6 items-start">

        {/* ════ LEFT ════ */}
        <div className="flex-1 min-w-0 flex flex-col gap-5">

          {/* Job header card */}
          <div className="bg-white rounded-2xl px-6 py-5 border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-[#2bb5a0]" />
                <span className="text-[11px] font-bold text-[#2bb5a0] uppercase tracking-wide">{timeAgo(job.created_at)}</span>
                {job.work_type === "remote" && (
                  <span className="text-[10px] font-bold bg-emerald-50 text-emerald-600 border border-emerald-100 px-2 py-0.5 rounded-full uppercase tracking-wide">
                    Remote
                  </span>
                )}
                {job.status === "open" && (
                  <span className="text-[10px] font-bold bg-blue-50 text-blue-500 border border-blue-100 px-2 py-0.5 rounded-full uppercase tracking-wide">
                    Actively Hiring
                  </span>
                )}
              </div>
              <Bookmark size={16} className="text-gray-200 hover:text-[#2bb5a0] cursor-pointer transition-colors" strokeWidth={1.5} />
            </div>

            <div className="flex items-start gap-4 mb-5">
              <CompanyLogo id={job.id} size={56} />
              <div>
                <h2 className="text-2xl font-extrabold text-gray-900 leading-tight">{job.title}</h2>
                <p className="text-[13px] text-gray-400 mt-1 font-medium">
                  {job.company_full_name || job.company_name}
                </p>
              </div>
            </div>

            <div className="h-px bg-gray-50 mb-4" />

            <div className="flex items-center flex-wrap gap-5">
              {[
                { icon:<Briefcase size={13}/>, label: job.category },
                { icon:<Clock size={13}/>,     label: formatJobType(job.job_type, job.work_type) },
                { icon:<DollarSign size={13}/>,label: formatSalary(job.salary_min, job.salary_max, job.currency) },
                { icon:<MapPin size={13}/>,    label: job.location },
              ].map(({ icon, label }) => (
                <span key={label} className="flex items-center gap-1.5 text-[13px] text-gray-600">
                  <span className="text-[#2bb5a0]">{icon}</span>{label || "—"}
                </span>
              ))}
            </div>
          </div>

          {/* Description + Responsibilities + Skills */}
          <div className="bg-white rounded-2xl px-6 py-6 border border-gray-100 shadow-sm">

            <SectionHeading>Job Description</SectionHeading>
            <div
              className="text-[13px] text-gray-500 leading-[1.9]"
              dangerouslySetInnerHTML={{ __html: job.description }}
            />

            {job.responsibilities && job.responsibilities !== job.description && (
              <div className="mt-7">
                <SectionHeading>Key Responsibilities</SectionHeading>
                <div
                  className="text-[13px] text-gray-500 leading-[1.9]"
                  dangerouslySetInnerHTML={{ __html: job.responsibilities }}
                />
              </div>
            )}

            {skills.length > 0 && (
              <div className="mt-7">
                <SectionHeading>Professional Skills</SectionHeading>
                <ul className="flex flex-col gap-2.5">
                  {skills.map((s, i) => (
                    <li key={i} className="flex items-start gap-3 text-[13px] text-gray-600 leading-relaxed">
                      <div className="w-5 h-5 rounded-lg bg-[#f0faf8] flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Check size={11} className="text-[#2bb5a0]" strokeWidth={2.5} />
                      </div>
                      {s}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {skills.length > 0 && (
              <div className="mt-7">
                <p className="text-[12px] font-bold uppercase tracking-widest text-gray-400 mb-3">Tags</p>
                <div className="flex flex-wrap gap-2">
                  {skills.map((tag) => (
                    <span key={tag}
                      className="text-[12px] font-semibold text-gray-600 border border-gray-200 rounded-full px-3.5 py-1.5 bg-gray-50 hover:border-[#2bb5a0] hover:text-[#2bb5a0] transition-colors cursor-pointer">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-7 pt-5 border-t border-gray-50 flex items-center gap-3">
              <p className="text-[12px] font-bold uppercase tracking-widest text-gray-400">Share:</p>
              {[
                { icon:<Facebook size={13}/>, label:"Facebook" },
                { icon:<Twitter size={13}/>, label:"Twitter" },
                { icon:<Linkedin size={13}/>, label:"LinkedIn" },
              ].map(({ icon, label }) => (
                <a key={label} href="#" title={label}
                  className="w-8 h-8 rounded-xl border border-gray-200 bg-gray-50 flex items-center justify-center text-gray-400 hover:text-[#2bb5a0] hover:border-[#2bb5a0] hover:bg-[#f0faf8] transition-all">
                  {icon}
                </a>
              ))}
            </div>
          </div>

          {/* Related Jobs */}
          {related.length > 0 && (
            <div>
              <div className="flex items-center gap-3 mb-4">
                <h3 className="text-lg font-extrabold text-gray-900">Related Jobs</h3>
                <div className="flex-1 h-px bg-gray-200" />
                <span className="text-[11px] text-gray-400 font-semibold">{related.length} jobs</span>
              </div>
              <div className="flex flex-col gap-3">
                {related.map((j) => <RelatedJobCard key={j.id} job={j} />)}
              </div>
            </div>
          )}
        </div>

        {/* ════ RIGHT COLUMN ════ */}
        <div className="w-[292px] flex-shrink-0 flex flex-col gap-4">

          {/* Apply CTA */}
          <Link to={`/jobs/${job.id}/apply`}
            className="w-full bg-[#2bb5a0] hover:bg-[#229e8b] text-white font-extrabold text-sm py-3.5 rounded-2xl transition-all shadow-lg shadow-[#2bb5a0]/25 hover:shadow-xl hover:shadow-[#2bb5a0]/30 text-center block tracking-wide">
            Apply Now →
          </Link>

          {/* Deadline notice */}
          {job.deadline && (
            <div className="bg-amber-50 border border-amber-100 rounded-2xl px-4 py-3 flex items-center gap-3">
              <CalendarDays size={15} className="text-amber-500 flex-shrink-0" />
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-amber-500">Application Deadline</p>
                <p className="text-[13px] font-bold text-amber-700">{new Date(job.deadline).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</p>
              </div>
            </div>
          )}

          {/* Job Overview */}
          <div className="bg-white rounded-2xl px-5 py-5 border border-gray-100 shadow-sm">
            <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">Job Overview</p>
            <OverviewItem icon={<Briefcase size={14}/>}     label="Job Title"      value={job.title} />
            <OverviewItem icon={<Building2 size={14}/>}     label="Category"       value={job.category} />
            <OverviewItem icon={<Clock size={14}/>}         label="Experience"     value={job.experience_level} />
            <OverviewItem icon={<GraduationCap size={14}/>} label="Degree"         value={job.degree_required} />
            <OverviewItem icon={<Briefcase size={14}/>}     label="Job Type"       value={formatJobType(job.job_type, job.work_type)} />
            <OverviewItem icon={<DollarSign size={14}/>}    label="Offered Salary" value={formatSalary(job.salary_min, job.salary_max, job.currency)} />
            <OverviewItem icon={<MapPin size={14}/>}        label="Location"       value={job.location} />

            {/* Mini map */}
            <div className="mt-4 rounded-xl overflow-hidden h-[120px] border border-gray-100">
              <iframe
                title="Job Location"
                src="https://www.openstreetmap.org/export/embed.html?bbox=-74.0060%2C40.7128%2C-73.9352%2C40.7580&layer=mapnik"
                width="100%" height="100%"
                className="border-0 block" loading="lazy"
              />
            </div>
          </div>

          {/* Send Us Message */}
          <div className="bg-white rounded-2xl px-5 py-5 border border-gray-100 shadow-sm">
            <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-4">Send a Message</p>
            <form onSubmit={handleCfSubmit} className="flex flex-col gap-3">
              {[
                { name:"name",  placeholder:"Your full name",   type:"text"  },
                { name:"email", placeholder:"Email address",    type:"email" },
                { name:"phone", placeholder:"Phone number",     type:"tel"   },
              ].map(({ name, placeholder, type }) => (
                <input key={name} type={type} name={name} value={cf[name]} onChange={handleCfChange}
                  placeholder={placeholder}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-[13px] text-gray-700 placeholder-gray-400 outline-none focus:border-[#2bb5a0] focus:ring-2 focus:ring-[#2bb5a0]/10 transition-all"
                />
              ))}
              <textarea name="message" value={cf.message} onChange={handleCfChange}
                placeholder="Your message…" rows={4}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-[13px] text-gray-700 placeholder-gray-400 outline-none focus:border-[#2bb5a0] focus:ring-2 focus:ring-[#2bb5a0]/10 resize-none transition-all"
              />
              <button type="submit"
                className="w-full bg-gray-900 hover:bg-[#2bb5a0] text-white text-[13px] font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2 shadow-sm">
                <Send size={13}/>Send Message
              </button>
            </form>
          </div>

        </div>
      </div>
    </div>
  );
}