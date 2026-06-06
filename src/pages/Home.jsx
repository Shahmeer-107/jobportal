import { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Search, Briefcase, Users, Building2, MapPin, Clock,
  Bookmark, DollarSign, ChevronDown, Tractor, Hammer,
  ShoppingBag, HardHat, Hotel, GraduationCap, Banknote, Truck,
  ArrowRight, TrendingUp,
} from "lucide-react";

/* ─── INFINITE LOGO CAROUSEL ─────────────────────────────────────────────── */
const logos = [
  { name: "Spotify", icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="white"><circle cx="12" cy="12" r="12" fill="white"/><path d="M17.9 10.9C14.7 9 9.35 8.8 6.3 9.75c-.5.15-1-.15-1.15-.6-.15-.5.15-1 .6-1.15 3.55-1.05 9.4-.85 13.1 1.35.45.25.6.85.35 1.3-.25.35-.85.5-1.3.25zm-.1 2.8c-.25.4-.75.5-1.15.25-2.65-1.6-6.65-2.1-9.75-1.15-.4.1-.85-.1-.95-.5-.1-.4.1-.85.5-.95 3.55-1.1 8-.55 11 1.35.4.25.5.75.35 1zm-1.3 2.75c-.2.3-.6.4-.9.2-2.3-1.4-5.2-1.75-8.65-.95-.35.1-.65-.15-.75-.45-.1-.35.15-.65.45-.75 3.75-.85 6.95-.5 9.5 1.1.35.2.4.65.35.85z" fill="black"/></svg> },
  { name: "slack",   icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M5.042 15.165a2.528 2.528 0 0 1-2.52 2.523A2.528 2.528 0 0 1 0 15.165a2.527 2.527 0 0 1 2.522-2.52h2.52v2.52zM6.313 15.165a2.527 2.527 0 0 1 2.521-2.52 2.527 2.527 0 0 1 2.521 2.52v6.313A2.528 2.528 0 0 1 8.834 24a2.528 2.528 0 0 1-2.521-2.522v-6.313zM8.834 5.042a2.528 2.528 0 0 1-2.521-2.52A2.528 2.528 0 0 1 8.834 0a2.528 2.528 0 0 1 2.521 2.522v2.52H8.834zM8.834 6.313a2.528 2.528 0 0 1 2.521 2.521 2.528 2.528 0 0 1-2.521 2.521H2.522A2.528 2.528 0 0 1 0 8.834a2.528 2.528 0 0 1 2.522-2.521h6.312zM18.956 8.834a2.528 2.528 0 0 1 2.522-2.521A2.528 2.528 0 0 1 24 8.834a2.528 2.528 0 0 1-2.522 2.521h-2.522V8.834zM17.688 8.834a2.528 2.528 0 0 1-2.523 2.521 2.527 2.527 0 0 1-2.52-2.521V2.522A2.527 2.527 0 0 1 15.165 0a2.528 2.528 0 0 1 2.523 2.522v6.312zM15.165 18.956a2.528 2.528 0 0 1 2.523 2.522A2.528 2.528 0 0 1 15.165 24a2.527 2.527 0 0 1-2.52-2.522v-2.522h2.52zM15.165 17.688a2.527 2.527 0 0 1-2.52-2.523 2.526 2.526 0 0 1 2.52-2.52h6.313A2.527 2.527 0 0 1 24 15.165a2.528 2.528 0 0 1-2.522 2.523h-6.313z" fill="white"/></svg> },
  { name: "Adobe",   icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="white"><path d="M13.966 22.624l-1.69-4.281H8.122l3.892-9.144 5.662 13.425zM.828 22.624L7.94 5.183h4.528L1.937 22.624zM23.172 22.624h-4.528L11.537 5.183h4.56z"/></svg> },
  { name: "asana",   icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="7.5" r="4" fill="white"/><circle cx="4.5" cy="16.5" r="4" fill="white"/><circle cx="19.5" cy="16.5" r="4" fill="white"/></svg> },
  { name: "Linear",  icon: <svg width="24" height="24" viewBox="0 0 100 100" fill="white"><path d="M1.22541 61.5228c-.1505.3375.0556.7455.4063.8454C33.9282 71.4421 71.4421 33.9282 62.3682 1.63122c-.0999-.35066-.5079-.55674-.8454-.40623C40.4735 10.2474 10.2474 40.4735 1.22541 61.5228Z"/><path d="M.00189135 46.8891c-.01764375.3516.24294865.6522.59461835.6666C19.7465 48.2124 48.2124 19.7465 47.5557.596502c-.0144-.351576-.3149-.612464-.6666-.594614C22.7595 1.40768 1.40768 22.7595.00189135 46.8891Z"/><path d="M5.8565 72.8547c-.2872-.2872-.2629-.7557.0561-.9951C37.7437 47.1204 47.1204 37.7437 71.8596 5.91261c.2394-.31907.7079-.34336.9951-.05617.7452.74519 1.4722 1.50799 2.1786 2.28049.2872.3193.2629.8017-.0665 1.0689C43.8438 35.5013 35.5013 43.8438 9.21079 74.9332c-.2672.3295-.7496.3538-1.0689.0666C7.36449 74.327 6.60169 73.6 5.8565 72.8547Z"/><path d="M53.1115 99.9981c-24.1296 1.4058-45.4815-19.8461-44.0757-43.9757.0178-.3517.3184-.6122.6701-.5945 24.1296 1.4058 45.4815 22.7568 43.9757 43.9757-.0178.3517-.3184.6122-.6701.5945Z"/></svg> },
  { name: "Indeed",  icon: <svg width="22" height="22" viewBox="0 0 22 20" fill="white"><path d="M3 0H21C21.55 0 22 0.45 22 1C22 1.55 21.55 2 21 2H18V18H21C21.55 18 22 18.45 22 19C22 19.55 21.55 20 21 20H3C2.45 20 2 19.55 2 19C2 18.45 2.45 18 3 18H6V2H3C2.45 2 2 1.55 2 1C2 0.45 2.45 0 3 0Z"/></svg> },
  { name: "ZipRecruiter", icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="white"><path d="M23.87 13.69l-2.49-2.49c.09-.29.14-.58.14-.9 0-.96-.49-1.83-1.26-2.36l-.06-.04c.17-.29.27-.63.27-1 0-.83-.33-1.58-.89-2.14-.47-.47-1.07-.73-1.72-.73-.96 0-1.87.45-2.46 1.14l-.06.06-.74-.74c.4-.48.63-1.08.63-1.74 0-1.56-1.26-2.84-2.82-2.84-.71 0-1.38.29-1.87.77-.49-.48-1.17-.77-1.88-.77-.85 0-1.62.37-2.17.95-.56-.59-1.35-.95-2.17-.95-1.56 0-2.82 1.28-2.82 2.84 0 .63.25 1.24.68 1.67-.66.46-1.05 1.17-1.05 1.97 0 1.41 1.16 2.57 2.57 2.57.83 0 1.58-.38 2.05-.97l.03.02-.87.88c-.47-.2-.96-.29-1.45-.29-.88 0-1.72.34-2.35.96l-.08.08c-.53-.65-1.31-1.04-2.14-1.04-1.56 0-2.82 1.26-2.82 2.82 0 1.01.56 1.88 1.38 2.32l.2-.09.74.74c-.07.17-.11.34-.11.52 0 .83.34 1.56.89 2.1.55.54 1.28.86 2.04.86 1.56 0 2.82-1.26 2.82-2.82 0-.71-.27-1.36-.72-1.84.66-.27 1.15-.82 1.44-1.47l.06-.08c.15.08.31.13.47.13 1.56 0 2.82-1.26 2.82-2.82 0-1.09-.57-2.04-1.44-2.58z"/></svg> },
  { name: "Glassdoor", icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="white"><path d="M12 0C5.37 0 0 5.37 0 12s5.37 12 12 12 12-5.37 12-12S18.63 0 12 0zm0 1.8c5.64 0 10.2 4.56 10.2 10.2S17.64 22.2 12 22.2 1.8 17.64 1.8 12 6.36 1.8 12 1.8zm0 5.4c-1.13 0-2.06.93-2.06 2.06S10.87 11.3 12 11.3c1.13 0 2.06-.93 2.06-2.06S13.13 7.2 12 7.2zm4.92 5c.68 0 1.23-.55 1.23-1.23s-.55-1.23-1.23-1.23H7.08c-.68 0-1.23.55-1.23 1.23s.55 1.23 1.23 1.23h9.84zm.99 3.58c.73 0 1.33.6 1.33 1.33 0 .73-.6 1.33-1.33 1.33h-9.84c-.73 0-1.33-.6-1.33-1.33 0-.73.6-1.33 1.33-1.33h9.84z"/></svg> },
  { name: "Monster", icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="white"><path d="M23.81 1.4c-.9-.9-2.4-.9-3.3 0l-7.4 7.4-5.3-5.3c-.9-.9-2.4-.9-3.3 0l-2.3 2.3 8 8-8 8 2.3 2.3c.9.9 2.4.9 3.3 0l5.3-5.3 7.4 7.4c.9.9 2.4.9 3.3 0l.19-.19c.9-.9.9-2.4 0-3.3l-7.4-7.4 7.4-7.4c.9-.9.9-2.4-.19-3.5z"/></svg> },
];

function InfiniteLogoCarousel() {
  const items = [...logos, ...logos, ...logos];
  return (
    <div
      className="overflow-hidden w-full"
      style={{
        maskImage: "linear-gradient(to right,transparent 0%,black 8%,black 92%,transparent 100%)",
        WebkitMaskImage: "linear-gradient(to right,transparent 0%,black 8%,black 92%,transparent 100%)",
      }}
    >
      <div
        className="flex items-center"
        style={{ animation: "logoScroll 32s linear infinite", width: "max-content" }}
      >
        {items.map((logo, i) => (
          <div
            key={i}
            className="flex items-center gap-2.5 select-none flex-shrink-0 opacity-60 hover:opacity-100 transition-opacity"
            style={{ fontSize: 16, paddingLeft: 48, paddingRight: 48, whiteSpace: "nowrap" }}
          >
            <span className="flex-shrink-0">{logo.icon}</span>
            <span className="text-white/70 font-semibold tracking-wide">{logo.name}</span>
          </div>
        ))}
      </div>
      <style>{`
        @keyframes logoScroll {
          0%   { transform: translateX(0); }
          100% { transform: translateX(calc(-100% / 3)); }
        }
      `}</style>
    </div>
  );
}

/* ─── COMPANY LOGO (quarter-circle SVG) ──────────────────────────────────── */
function CompanyLogo({ name, size = 44 }) {
  const palettes = [
    ["#f97316","#facc15","#4ade80","#3b82f6"],
    ["#fb923c","#f43f5e","#a855f7","#38bdf8"],
    ["#34d399","#3b82f6","#a78bfa","#fb923c"],
    ["#06b6d4","#6366f1","#ec4899","#f97316"],
    ["#f59e0b","#ef4444","#8b5cf6","#10b981"],
  ];
  const [c1,c2,c3,c4] = palettes[name.charCodeAt(0) % palettes.length];
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

/* ─── STAT ────────────────────────────────────────────────────────────────── */
function Stat({ icon, value, title }) {
  return (
    <div className="flex items-center gap-3.5">
      {/* icon ring */}
      <div className="w-12 h-12 rounded-full bg-[#2bb5a0]/15 border border-[#2bb5a0]/30 flex items-center justify-center text-[#2bb5a0] flex-shrink-0">
        {icon}
      </div>
      <div>
        <p className="text-[18px] font-extrabold text-white leading-tight tracking-tight">{value}</p>
        <p className="text-[12px] text-white/45 font-medium mt-0.5">{title}</p>
      </div>
    </div>
  );
}

/* ─── JOB CARD ────────────────────────────────────────────────────────────── */
function JobCard({ job }) {
  return (
    <div className="group bg-white rounded-2xl px-6 py-5 border border-gray-100 shadow-sm hover:shadow-md hover:border-[#2bb5a0]/30 transition-all duration-200">
      {/* top row */}
      <div className="flex items-center justify-between mb-3.5">
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-[#2bb5a0]" />
          <span className="text-[11px] font-bold text-[#2bb5a0] uppercase tracking-wide">{job.time}</span>
        </div>
        <Bookmark size={16} className="text-gray-200 hover:text-[#2bb5a0] cursor-pointer transition-colors" strokeWidth={1.5} />
      </div>

      {/* company + title */}
      <div className="flex items-center gap-3.5 mb-4">
        <CompanyLogo name={job.company} size={46} />
        <div className="min-w-0">
          <h3 className="text-[15px] font-extrabold text-gray-900 leading-tight truncate group-hover:text-[#2bb5a0] transition-colors">
            {job.title}
          </h3>
          <p className="text-[12px] text-gray-400 mt-0.5 font-medium">{job.company}</p>
        </div>
      </div>

      {/* hairline */}
      <div className="h-px bg-gray-50 mb-3.5" />

      {/* meta + cta */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center flex-wrap gap-5">
          {[
            { icon: <Briefcase  size={12}/>, label: job.category },
            { icon: <Clock      size={12}/>, label: job.type     },
            { icon: <DollarSign size={12}/>, label: job.salary   },
            { icon: <MapPin     size={12}/>, label: job.location },
          ].map(({ icon, label }) => (
            <span key={label} className="flex items-center gap-1.5 text-[12px] text-gray-500">
              <span className="text-[#2bb5a0]">{icon}</span>{label}
            </span>
          ))}
        </div>
        <Link
          to={`/jobs/${job.id}`}
          className="bg-[#2bb5a0] hover:bg-[#229e8b] text-white text-[12px] font-bold px-5 py-2 rounded-xl transition-all shadow-sm shadow-[#2bb5a0]/20 hover:shadow-md hover:shadow-[#2bb5a0]/30 whitespace-nowrap"
        >
          View Details →
        </Link>
      </div>
    </div>
  );
}

/* ─── DATA ────────────────────────────────────────────────────────────────── */
const jobData = [
  { id:1, time:"10 min ago", title:"Forward Security Director",     company:"Bauch, Schuppe and Schulist Co",  category:"Hotels & Tourism", type:"Full time", salary:"$40000-$42000", location:"New-York, USA"   },
  { id:2, time:"12 min ago", title:"Regional Creative Facilitator", company:"Wisokz - Becker Co",              category:"Media",            type:"Part time", salary:"$28000-$32000", location:"Los-Angeles, USA" },
  { id:3, time:"15 min ago", title:"Internal Integration Planner",  company:"Mraz, Quigley and Feest Inc.",    category:"Construction",     type:"Full time", salary:"$48000-$50000", location:"Texas, USA"       },
  { id:4, time:"24 min ago", title:"District Intranet Director",    company:"VonRueden - Weber Co",            category:"Commerce",         type:"Full time", salary:"$42000-$48000", location:"Florida, USA"     },
  { id:5, time:"26 min ago", title:"Corporate Tactics Facilitator", company:"Cormier, Turner and Flatley Inc", category:"Commerce",         type:"Full time", salary:"$38000-$40000", location:"Boston, USA"      },
];

const categories = [
  { name:"Agriculture",        icon:<Tractor       size={20}/>, count:"8,931"  },
  { name:"Metal Production",   icon:<Hammer        size={20}/>, count:"3,012"  },
  { name:"Commerce",           icon:<ShoppingBag   size={20}/>, count:"12,043" },
  { name:"Construction",       icon:<HardHat       size={20}/>, count:"5,761"  },
  { name:"Hotels & Tourism",   icon:<Hotel         size={20}/>, count:"9,210"  },
  { name:"Education",          icon:<GraduationCap size={20}/>, count:"4,320"  },
  { name:"Financial Services", icon:<Banknote      size={20}/>, count:"6,892"  },
  { name:"Transport",          icon:<Truck         size={20}/>, count:"2,541"  },
];

const testimonials = [
  { title:"Amazing services",    body:"This platform made my job search incredibly easy. I found a great opportunity within just a few days.",     name:"Sarah Wilson",   role:"UX Designer",       stars:5 },
  { title:"Everything simple",   body:"Applying for jobs and managing interviews was smooth and hassle-free. Highly recommended for professionals.", name:"James Kotler",   role:"Product Manager",   stars:5 },
  { title:"Awesome, thank you!", body:"I connected with top companies and secured a position that perfectly matched my experience and skills.",     name:"Zara Monroe",    role:"Frontend Developer", stars:5 },
];

/* ══════════════════════════════════════════════════════════════════════════
   HOME PAGE
══════════════════════════════════════════════════════════════════════════ */
export default function Home() {
  const [search, setSearch]     = useState("");
  const [location, setLocation] = useState("");
  const [category, setCategory] = useState("");
  const navigate = useNavigate();

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (search.trim()) params.set("q", search.trim());
    if (location)      params.set("location", location);
    if (category)      params.set("category", category);
    navigate(`/jobs?${params.toString()}`);
  };

  return (
    <div className="w-full text-white overflow-x-hidden font-sans" style={{ backgroundColor: "#0a0f1e" }}>

      {/* ══ HERO ══════════════════════════════════════════════════════════ */}
      <section className="relative w-full min-h-[520px] flex items-start pt-20 pb-24 overflow-hidden">
        {/* background image */}
        <div className="absolute inset-0 bg-cover bg-center scale-105" style={{ backgroundImage: "url('/hero.jpg')" }} />
        {/* dark overlay — navy-tinted, not pure black */}
        <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, rgba(10,15,30,0.92) 0%, rgba(10,15,30,0.80) 100%)" }} />
        {/* subtle grid texture */}
        <div className="absolute inset-0 opacity-[0.035]"
          style={{ backgroundImage: "linear-gradient(rgba(255,255,255,1) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,1) 1px,transparent 1px)", backgroundSize: "44px 44px" }} />
        {/* bottom teal glow bleed */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 pointer-events-none"
          style={{ width: 600, height: 160, background: "radial-gradient(ellipse, rgba(43,181,160,0.18) 0%, transparent 70%)", filter: "blur(32px)" }} />

        <div className="relative max-w-5xl mx-auto px-6 w-full text-center">
          {/* pill badge */}
          <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-4 py-1.5 mb-6">
            <div className="w-1.5 h-1.5 rounded-full bg-[#2bb5a0] animate-pulse" />
            <span className="text-[11px] font-bold text-white/50 uppercase tracking-widest">Trusted by 18,400+ Companies</span>
          </div>

          <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold leading-[1.08] tracking-tight text-white">
            Find Your Dream<br />
            <span className="text-[#2bb5a0]">Job Today!</span>
          </h1>
          <p className="mt-4 text-white/50 text-sm md:text-[15px] max-w-lg mx-auto leading-relaxed font-medium">
            Connecting Talent with Opportunity: Your Gateway to Career Success
          </p>

          {/* ── Search bar ── */}
          <div className="mt-9 max-w-3xl mx-auto">
            <div className="bg-white rounded-2xl shadow-2xl shadow-black/40 flex items-center overflow-hidden h-[58px] border border-white/10">
              <div className="flex items-center gap-2.5 pl-5 flex-1 min-w-0 h-full">
                <Search size={15} className="text-gray-400 flex-shrink-0" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                  placeholder="Job Title or Company"
                  className="text-gray-800 outline-none flex-1 h-full text-[14px] placeholder-gray-400 bg-transparent min-w-0 font-medium"
                />
              </div>
              <div className="h-7 w-px bg-gray-200 flex-shrink-0" />
              <div className="flex items-center px-3.5 h-full gap-1 flex-shrink-0">
                <MapPin size={13} className="text-gray-400 flex-shrink-0" />
                <select value={location} onChange={(e) => setLocation(e.target.value)}
                  className="h-full text-[13px] text-gray-600 outline-none bg-transparent cursor-pointer max-w-[125px] font-medium">
                  <option value="">Select Location</option>
                  <option>New-York, USA</option>
                  <option>Los-Angeles, USA</option>
                  <option>Texas, USA</option>
                  <option>Florida, USA</option>
                  <option>Boston, USA</option>
                </select>
                <ChevronDown size={11} className="text-gray-400 flex-shrink-0 pointer-events-none" />
              </div>
              <div className="h-7 w-px bg-gray-200 flex-shrink-0" />
              <div className="flex items-center px-3.5 h-full gap-1 flex-shrink-0">
                <Briefcase size={13} className="text-gray-400 flex-shrink-0" />
                <select value={category} onChange={(e) => setCategory(e.target.value)}
                  className="h-full text-[13px] text-gray-600 outline-none bg-transparent cursor-pointer max-w-[125px] font-medium">
                  <option value="">Select Category</option>
                  <option>Hotels &amp; Tourism</option>
                  <option>Media</option>
                  <option>Construction</option>
                  <option>Commerce</option>
                </select>
                <ChevronDown size={11} className="text-gray-400 flex-shrink-0 pointer-events-none" />
              </div>
              <button onClick={handleSearch}
                className="h-full bg-[#2bb5a0] hover:bg-[#229e8b] text-white px-7 flex items-center gap-2 rounded-r-2xl text-[13px] font-bold transition-all flex-shrink-0 shadow-lg shadow-[#2bb5a0]/30">
                <Search size={14} />
                Search Job
              </button>
            </div>
            <p className="mt-3 text-white/30 text-[12px] font-medium">
              Popular: <span className="text-white/50 hover:text-[#2bb5a0] cursor-pointer transition-colors">Software Engineer</span>,{" "}
              <span className="text-white/50 hover:text-[#2bb5a0] cursor-pointer transition-colors">Product Manager</span>,{" "}
              <span className="text-white/50 hover:text-[#2bb5a0] cursor-pointer transition-colors">Data Analyst</span>
            </p>
          </div>

          {/* ── Stats ── */}
          <div className="mt-12 flex justify-center gap-10 md:gap-16 flex-wrap">
            <Stat icon={<Briefcase size={19}/>} value="25,850"  title="Jobs"       />
            <div className="hidden md:block w-px bg-white/10 self-stretch" />
            <Stat icon={<Users     size={19}/>} value="10,250"  title="Candidates" />
            <div className="hidden md:block w-px bg-white/10 self-stretch" />
            <Stat icon={<Building2 size={19}/>} value="18,400"  title="Companies"  />
          </div>
        </div>
      </section>

      {/* ══ LOGO CAROUSEL ═════════════════════════════════════════════════ */}
      <section className="py-8 border-t border-white/[0.06] border-b border-white/[0.06]"
        style={{ backgroundColor: "#060b18" }}>
        <p className="text-center text-[10px] font-bold uppercase tracking-widest text-white/25 mb-6">
          Trusted by leading companies worldwide
        </p>
        <InfiniteLogoCarousel />
      </section>

      {/* gradient bridge: dark → light */}
      <div className="h-16" style={{ background: "linear-gradient(to bottom, #060b18, #f5f7fa)" }} />

      {/* ══ RECENT JOBS ═══════════════════════════════════════════════════ */}
      <section className="py-14" style={{ backgroundColor: "#f5f7fa" }}>
        <div className="max-w-5xl mx-auto px-6">
          <div className="flex items-end justify-between mb-1">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <div className="w-6 h-0.5 bg-[#2bb5a0] rounded-full" />
                <span className="text-[11px] font-bold uppercase tracking-widest text-[#2bb5a0]">Latest Openings</span>
              </div>
              <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">Recent Jobs Available</h2>
              <p className="text-gray-500 text-sm mt-1.5 font-medium">
                Explore the latest job opportunities across various industries and locations
              </p>
            </div>
            <Link to="/jobs"
              className="hidden md:inline-flex items-center gap-1.5 text-[#2bb5a0] text-[13px] font-bold hover:gap-2.5 transition-all">
              View all <ArrowRight size={14}/>
            </Link>
          </div>

          <div className="flex flex-col gap-3.5 mt-7">
            {jobData.map((job) => <JobCard key={job.id} job={job} />)}
          </div>

          <div className="mt-6 flex justify-center md:hidden">
            <Link to="/jobs"
              className="inline-flex items-center gap-1.5 text-[#2bb5a0] text-[13px] font-bold border border-[#2bb5a0]/30 px-5 py-2.5 rounded-xl hover:bg-[#2bb5a0] hover:text-white transition-all">
              View all jobs <ArrowRight size={14}/>
            </Link>
          </div>
        </div>
      </section>

      {/* ══ BROWSE BY CATEGORY ════════════════════════════════════════════ */}
      <section className="py-16 border-t border-gray-100" style={{ backgroundColor: "#f5f7fa" }}>
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-10">
            <div className="flex items-center justify-center gap-2 mb-2">
              <div className="w-6 h-0.5 bg-[#2bb5a0] rounded-full" />
              <span className="text-[11px] font-bold uppercase tracking-widest text-[#2bb5a0]">Explore Industries</span>
              <div className="w-6 h-0.5 bg-[#2bb5a0] rounded-full" />
            </div>
            <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight mb-2">Browse by Category</h2>
            <p className="text-sm text-gray-500 max-w-md mx-auto leading-relaxed font-medium">
              Find jobs based on your skills, interests, and preferred industry categories.
            </p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {categories.map((cat) => (
              <Link key={cat.name} to="/jobs"
                className="bg-white rounded-2xl p-5 flex flex-col items-center text-center gap-3 border border-gray-100 shadow-sm hover:border-[#2bb5a0] hover:shadow-md hover:shadow-[#2bb5a0]/10 transition-all group">
                <div className="w-12 h-12 rounded-2xl bg-[#f0faf8] flex items-center justify-center text-[#2bb5a0] group-hover:bg-[#2bb5a0] group-hover:text-white transition-all shadow-sm">
                  {cat.icon}
                </div>
                <p className="text-[13px] font-bold text-gray-800 leading-tight">{cat.name}</p>
                <span className="text-[11px] font-semibold text-[#2bb5a0] bg-[#f0faf8] px-2.5 py-1 rounded-full">
                  {cat.count} jobs
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* gradient bridge: light → dark */}
      <div className="h-16" style={{ background: "linear-gradient(to bottom, #f5f7fa, #0a0f1e)" }} />

      {/* ══ GOOD LIFE BANNER ══════════════════════════════════════════════ */}
      <section className="py-16" style={{ backgroundColor: "#0a0f1e" }}>
        <div className="max-w-5xl mx-auto px-6 flex flex-col md:flex-row gap-10 items-center">
          {/* image left */}
          <div className="w-full md:w-[300px] h-[220px] rounded-2xl flex-shrink-0 overflow-hidden relative border border-white/5 shadow-2xl"
            style={{ background: "linear-gradient(135deg, #1a2744 0%, #0f1829 60%, #0d1f1a 100%)" }}>
            {/* teal accent glow */}
            <div className="absolute bottom-0 right-0 w-32 h-32 rounded-full pointer-events-none"
              style={{ background: "radial-gradient(circle, rgba(43,181,160,0.35) 0%, transparent 70%)", filter: "blur(20px)" }} />
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
            {/* decorative rings */}
            <div className="absolute top-6 left-6 w-16 h-16 rounded-full border border-white/5" />
            <div className="absolute top-9 left-9 w-8 h-8 rounded-full border border-[#2bb5a0]/20" />
          </div>

          {/* text right */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-6 h-0.5 bg-[#2bb5a0] rounded-full" />
              <span className="text-[11px] font-bold uppercase tracking-widest text-[#2bb5a0]">Career Growth</span>
            </div>
            <h2 className="text-3xl font-extrabold text-white leading-snug mb-3 tracking-tight">
              Good Life Begins With<br />
              <span className="text-[#2bb5a0]">A Good Company</span>
            </h2>
            <p className="text-sm text-gray-400 leading-relaxed mb-7 max-w-sm font-medium">
              Build a successful career with companies that value innovation, growth, and employee satisfaction.
            </p>
            <Link to="/about"
              className="inline-flex items-center gap-2 bg-[#2bb5a0] hover:bg-[#229e8b] text-white text-sm font-bold px-6 py-3 rounded-xl transition-all shadow-lg shadow-[#2bb5a0]/25 hover:shadow-xl hover:shadow-[#2bb5a0]/30">
              Learn more <ArrowRight size={14}/>
            </Link>
          </div>
        </div>
      </section>

      {/* ══ STATS COUNTER ═════════════════════════════════════════════════ */}
      <section className="border-t border-white/[0.06] py-14" style={{ backgroundColor: "#0a0f1e" }}>
        <div className="max-w-5xl mx-auto px-6 grid grid-cols-1 sm:grid-cols-3 gap-8 md:gap-12">
          {[
            { value:"12k+", label:"Clients worldwide", desc:"Trusted by employers and job seekers worldwide for reliable hiring and career opportunities.", growth:"+8%" },
            { value:"20k+", label:"Active résumés",     desc:"Thousands of professionals are actively searching for their next career opportunity on our platform.", growth:"+15%" },
            { value:"18k+", label:"Companies",           desc:"Leading companies use our platform to hire skilled and talented candidates efficiently.", growth:"+12%" },
          ].map((s, i) => (
            <div key={s.label} className="relative pl-5 border-l-2 border-[#2bb5a0]/30">
              <div className="flex items-baseline gap-2.5 mb-1">
                <p className="text-4xl font-extrabold text-[#2bb5a0] tracking-tight">{s.value}</p>
                <span className="text-[11px] font-bold text-emerald-400 bg-emerald-400/10 border border-emerald-400/20 px-2 py-0.5 rounded-full flex items-center gap-1">
                  <TrendingUp size={9}/>{s.growth}
                </span>
              </div>
              <p className="text-[14px] font-bold text-white mb-2">{s.label}</p>
              <p className="text-[12px] text-gray-500 leading-relaxed font-medium">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ══ CTA BANNER ════════════════════════════════════════════════════ */}
      <section className="py-8 px-6" style={{ backgroundColor: "#0a0f1e" }}>
        <div className="max-w-5xl mx-auto">
          <div className="relative rounded-2xl overflow-hidden h-[190px] flex items-center px-10 border border-white/[0.06]"
            style={{ background: "linear-gradient(135deg, #0f1f38 0%, #0d1829 50%, #081510 100%)" }}>
            {/* teal glow right */}
            <div className="absolute right-0 top-0 bottom-0 w-1/2 pointer-events-none"
              style={{ background: "radial-gradient(ellipse at 80% 50%, rgba(43,181,160,0.12) 0%, transparent 65%)" }} />
            <div className="absolute right-0 inset-y-0 w-1/2 opacity-20 bg-cover bg-center bg-[url('/cta-bg.jpg')]" />
            {/* left accent line */}
            <div className="absolute left-0 inset-y-8 w-0.5 bg-gradient-to-b from-transparent via-[#2bb5a0] to-transparent rounded-full" />

            <div className="relative z-10 max-w-sm">
              <p className="text-[11px] font-bold uppercase tracking-widest text-[#2bb5a0] mb-2">Start Today</p>
              <h3 className="text-xl font-extrabold text-white leading-snug mb-2 tracking-tight">
                Create A Better Future<br />For Yourself
              </h3>
              <p className="text-[12px] text-gray-400 leading-relaxed mb-5 font-medium">
                Take the next step in your career journey with opportunities that match your skills and ambitions.
              </p>
              <Link to="/jobs"
                className="inline-flex items-center gap-2 bg-[#2bb5a0] hover:bg-[#229e8b] text-white text-[13px] font-bold px-6 py-2.5 rounded-xl transition-all shadow-lg shadow-[#2bb5a0]/25 hover:shadow-[#2bb5a0]/35">
                Apply Now <ArrowRight size={13}/>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* gradient bridge: dark → white */}
      <div className="h-16" style={{ background: "linear-gradient(to bottom, #0a0f1e, #ffffff)" }} />

      {/* ══ TESTIMONIALS ══════════════════════════════════════════════════ */}
      <section className="bg-white py-16">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-10">
            <div className="flex items-center justify-center gap-2 mb-2">
              <div className="w-6 h-0.5 bg-[#2bb5a0] rounded-full" />
              <span className="text-[11px] font-bold uppercase tracking-widest text-[#2bb5a0]">Success Stories</span>
              <div className="w-6 h-0.5 bg-[#2bb5a0] rounded-full" />
            </div>
            <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight mb-2">
              Testimonials from Our Customers
            </h2>
            <p className="text-sm text-gray-500 max-w-md mx-auto font-medium">
              See how job seekers and employers are achieving success through our platform.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {testimonials.map((t) => (
              <div key={t.name}
                className="border border-gray-100 rounded-2xl p-6 flex flex-col shadow-sm hover:shadow-md hover:border-[#2bb5a0]/20 transition-all group">
                {/* stars */}
                <div className="flex gap-0.5 mb-4">
                  {[...Array(t.stars)].map((_, i) => (
                    <span key={i} className="text-amber-400 text-base leading-none">★</span>
                  ))}
                </div>
                <p className="text-[14px] font-extrabold text-gray-900 mb-2 group-hover:text-[#2bb5a0] transition-colors">{t.title}</p>
                <p className="text-[13px] text-gray-500 leading-relaxed flex-1 font-medium">{t.body}</p>
                <div className="flex items-center gap-3 mt-5 pt-5 border-t border-gray-50">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#2bb5a0]/30 to-[#2bb5a0]/10 flex items-center justify-center flex-shrink-0">
                    <span className="text-[#2bb5a0] text-[13px] font-extrabold">{t.name[0]}</span>
                  </div>
                  <div>
                    <p className="text-[12px] font-bold text-gray-900">{t.name}</p>
                    <p className="text-[11px] text-gray-400 font-medium">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ NEWS AND BLOG ═════════════════════════════════════════════════ */}
      <section className="bg-white border-t border-gray-100 py-16">
        <div className="max-w-5xl mx-auto px-6">
          <div className="flex items-end justify-between mb-1">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <div className="w-6 h-0.5 bg-[#2bb5a0] rounded-full" />
                <span className="text-[11px] font-bold uppercase tracking-widest text-[#2bb5a0]">Insights</span>
              </div>
              <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight">News and Blog</h2>
            </div>
            <Link to="#"
              className="hidden md:inline-flex items-center gap-1.5 text-[#2bb5a0] text-[13px] font-bold hover:gap-2.5 transition-all">
              View All <ArrowRight size={14}/>
            </Link>
          </div>
          <p className="text-sm text-gray-500 mb-8 mt-1.5 font-medium">
            Stay updated with career advice, hiring trends, workplace insights, and interview preparation tips.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { badge:"Board", badgeBg:"bg-[#2bb5a0]", title:"Top Strategies to Improve Employee Engagement and Workplace Productivity", gradient:"from-slate-700 via-slate-600 to-slate-500" },
              { badge:"Blog",  badgeBg:"bg-slate-700",  title:"How To Avoid The Top Six Most Common Job Interview Mistakes",             gradient:"from-gray-200 via-gray-300 to-gray-400" },
            ].map((post) => (
              <div key={post.title}
                className="rounded-2xl overflow-hidden border border-gray-100 bg-white shadow-sm hover:shadow-md hover:border-[#2bb5a0]/20 transition-all group">
                <div className={`h-44 bg-gradient-to-br ${post.gradient} relative`}>
                  <span className={`absolute top-3.5 left-3.5 ${post.badgeBg} text-white text-[10px] font-bold px-3 py-1 rounded-full shadow-sm uppercase tracking-wide`}>
                    {post.badge}
                  </span>
                </div>
                <div className="p-5">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">January 2024</p>
                  <h4 className="text-[14px] font-extrabold text-gray-900 leading-snug mb-4 group-hover:text-[#2bb5a0] transition-colors">
                    {post.title}
                  </h4>
                  <button className="inline-flex items-center gap-1.5 text-[#2bb5a0] text-[12px] font-bold hover:gap-2.5 transition-all">
                    Read more <ArrowRight size={12}/>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}