import { useState } from "react";
import {
  UserPlus,
  FileText,
  Search,
  CheckSquare,
  Play,
  ChevronDown,
  ChevronUp,
  Star,
  BookOpen,
  Building2,
  Users,
} from "lucide-react";

/* ─── FAQ Item ────────────────────────────────────────────────────────────── */
function FaqItem({ number, question, answer, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div
      className={`rounded-xl border transition-all duration-200 ${
        open ? "border-[#2bb5a0] bg-[#f0faf8]" : "border-gray-200 bg-white"
      }`}
    >
      <button
        onClick={() => setOpen((p) => !p)}
        className="w-full flex items-center justify-between px-5 py-4 text-left gap-4"
      >
        <div className="flex items-center gap-4 flex-1 min-w-0">
          <span className="text-[12px] text-gray-400 font-medium flex-shrink-0 w-6 text-right">
            {String(number).padStart(2, "0")}.
          </span>

          <span
            className={`text-[13px] font-semibold leading-snug ${
              open ? "text-[#2bb5a0]" : "text-gray-800"
            }`}
          >
            {question}
          </span>
        </div>

        <div className="flex-shrink-0">
          {open ? (
            <div className="w-6 h-6 rounded-full bg-[#2bb5a0] flex items-center justify-center">
              <ChevronUp size={12} className="text-white" />
            </div>
          ) : (
            <div className="w-6 h-6 rounded-full border border-gray-300 flex items-center justify-center">
              <ChevronDown size={12} className="text-gray-500" />
            </div>
          )}
        </div>
      </button>

      {open && (
        <div className="px-5 pb-5" style={{ paddingLeft: "3.25rem" }}>
          <p className="text-[12px] text-gray-500 leading-relaxed">
            {answer}
          </p>
        </div>
      )}
    </div>
  );
}

/* ─── How It Works Step ───────────────────────────────────────────────────── */
function HowStep({ icon, title, desc }) {
  return (
    <div className="flex flex-col items-center text-center gap-2.5">
      <div className="w-12 h-12 rounded-xl bg-[#eef7f5] border border-[#d1f0eb] flex items-center justify-center text-[#2bb5a0] mb-1">
        {icon}
      </div>

      <p className="text-[13px] font-bold text-gray-900">{title}</p>

      <p className="text-[11px] text-gray-400 leading-relaxed max-w-[130px]">
        {desc}
      </p>
    </div>
  );
}

/* ─── Feature Badge ───────────────────────────────────────────────────────── */
function FeatureBadge({ icon, label }) {
  return (
    <div className="flex items-center gap-2.5">
      <div className="w-8 h-8 rounded-lg bg-[#eef7f5] flex items-center justify-center text-[#2bb5a0] flex-shrink-0">
        {icon}
      </div>

      <span className="text-[12px] font-semibold text-gray-700">{label}</span>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════════════
   MAIN
══════════════════════════════════════════════════════════════════════════ */
export default function AboutPage() {
  const faqs = [
    {
      number: 1,
      question: "Can I upload a CV?",
      answer:
        "Yes, you can upload your CV or resume directly to your profile. This helps recruiters discover your skills, experience, and qualifications more efficiently.",
      defaultOpen: true,
    },
    {
      number: 2,
      question: "How long will the recruitment process take?",
      answer:
        "The recruitment process usually depends on the company, job role, and number of applicants. Most hiring processes include screening, interviews, and final selection.",
    },
    {
      number: 3,
      question: "What does the recruitment and selection process involve?",
      answer:
        "The process usually includes application review, resume screening, interviews, skill assessment, and final hiring decision by the company.",
    },
    {
      number: 4,
      question: "Do you recruit for graduates, apprentices and students?",
      answer:
        "Yes, our platform supports opportunities for students, fresh graduates, interns, apprentices, and experienced professionals.",
    },
    {
      number: 5,
      question:
        "Can I receive notifications for future jobs that may interest me?",
      answer:
        "Yes, once you create an account, you can explore relevant job opportunities and track applications from your dashboard.",
    },
  ];

  const blogPosts = [
    {
      badge: "Career",
      badgeBg: "bg-[#2bb5a0]",
      image: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d",
      title: "How To Build A Strong Resume That Gets Recruiters’ Attention",
      video: "https://www.youtube.com/watch?v=Tt08KmFfIYQ",
    },
    {
      badge: "Interview",
      badgeBg: "bg-gray-700",
      image: "https://images.unsplash.com/photo-1552664730-d307ca884978",
      title: "Top Interview Strategies To Help You Land Your Dream Job",
      video: "https://www.youtube.com/watch?v=HG68Ymazo18",
    },
  ];

  return (
    <div className="min-h-screen bg-white font-sans">
      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <section className="bg-black pt-32 pb-12 text-center">
        <h1 className="text-5xl font-extrabold text-white tracking-tight">
          About Us
        </h1>
      </section>

      {/* ── INTRO SPLIT ──────────────────────────────────────────────────── */}
      <section className="bg-white py-16">
        <div className="max-w-5xl mx-auto px-8 md:px-12 grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          <div>
            <h2 className="text-[28px] font-extrabold text-gray-900 leading-snug">
              Connecting Talent With The Right Career Opportunities
            </h2>
          </div>

          <div>
            <p className="text-[13px] text-gray-500 leading-relaxed">
              We help job seekers discover meaningful career opportunities while
              enabling companies to connect with skilled professionals
              efficiently. Our platform simplifies hiring through smart job
              listings, streamlined applications, and a professional recruitment
              experience for both employers and candidates.
            </p>
          </div>
        </div>

        <div className="max-w-5xl mx-auto px-8 md:px-12 mt-10">
          <img
            src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f"
            alt="Professional team working together"
            className="w-full h-56 object-cover rounded-2xl"
          />
        </div>
      </section>

      {/* ── HOW IT WORKS ─────────────────────────────────────────────────── */}
      <section className="bg-white py-14 border-t border-gray-100">
        <div className="max-w-5xl mx-auto px-8 md:px-12 text-center mb-10">
          <h2 className="text-2xl font-extrabold text-gray-900 mb-2">
            How it works
          </h2>

          <p className="text-[13px] text-gray-400 max-w-md mx-auto leading-relaxed">
            Start your career journey in simple steps — create your profile,
            upload your resume, explore opportunities, and apply to jobs that
            match your skills.
          </p>
        </div>

        <div className="max-w-5xl mx-auto px-8 md:px-12 grid grid-cols-2 md:grid-cols-4 gap-6">
          <HowStep
            icon={<UserPlus size={20} />}
            title="Create Account"
            desc="Sign up and build your professional profile in minutes"
          />

          <HowStep
            icon={<FileText size={20} />}
            title="Upload Resume"
            desc="Upload your CV to apply faster and get discovered"
          />

          <HowStep
            icon={<Search size={20} />}
            title="Find Jobs"
            desc="Explore jobs based on your skills and experience"
          />

          <HowStep
            icon={<CheckSquare size={20} />}
            title="Apply Job"
            desc="Submit applications and track your hiring progress"
          />
        </div>
      </section>

      {/* ── VIDEO / GOOD LIFE BANNER ─────────────────────────────────────── */}
      <section className="max-w-5xl mx-auto px-8 md:px-12 py-10">
        <div
          className="relative w-full h-72 rounded-2xl overflow-hidden bg-cover bg-center flex items-center justify-center"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1521737604893-d14cc237f11d')",
          }}
        >
          <div className="absolute inset-0 bg-black/55" />

          <a
            href="https://www.youtube.com/watch?v=Tt08KmFfIYQ"
            target="_blank"
            rel="noreferrer"
            className="relative z-10 w-14 h-14 rounded-full bg-[#2bb5a0] hover:bg-[#26a090] flex items-center justify-center transition-colors shadow-xl"
          >
            <Play size={20} className="text-white ml-1" fill="white" />
          </a>

          <div className="absolute left-0 right-0 bottom-16 z-10 text-center px-6">
            <h3 className="text-white text-2xl font-extrabold leading-snug drop-shadow">
              Build Your Career With Trusted Companies
            </h3>
          </div>

          <div className="absolute bottom-0 left-0 right-0 z-20 bg-black/55 backdrop-blur-sm rounded-b-2xl">
            <div className="grid grid-cols-3 divide-x divide-white/20 py-3 px-4">
              {[
                "Create a professional profile that stands out to recruiters",
                "Discover opportunities from trusted companies",
                "Apply faster and track your career growth easily",
              ].map((text, i) => (
                <div key={i} className="px-4 flex items-start gap-2">
                  <span className="text-[#2bb5a0] font-bold text-sm flex-shrink-0 leading-tight">
                    {i + 1}
                  </span>
                  <p className="text-white text-[10px] leading-relaxed">
                    {text}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── FAQ ──────────────────────────────────────────────────────────── */}
      <section className="bg-white py-14">
        <div className="max-w-5xl mx-auto px-8 md:px-12">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-extrabold text-gray-900 mb-2">
              Frequently Asked Questions
            </h2>

            <p className="text-[13px] text-gray-400">
              Find answers to common questions about applications, recruitment,
              resumes, and job alerts.
            </p>
          </div>

          <div className="flex flex-col gap-3">
            {faqs.map((faq) => (
              <FaqItem
                key={faq.number}
                number={faq.number}
                question={faq.question}
                answer={faq.answer}
                defaultOpen={faq.defaultOpen}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ── WE'RE ONLY WORKING WITH THE BEST ────────────────────────────── */}
      <section className="bg-white py-14 border-t border-gray-100">
        <div className="max-w-5xl mx-auto px-8 md:px-12 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <div className="flex gap-3">
            <div className="flex flex-col gap-3 flex-1">
              <img
                src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3"
                alt="Office team"
                className="h-44 w-full object-cover rounded-2xl"
              />

              <img
                src="https://images.unsplash.com/photo-1521791136064-7986c2920216"
                alt="Hiring process"
                className="h-28 w-full object-cover rounded-2xl"
              />
            </div>

            <img
              src="https://images.unsplash.com/photo-1523240795612-9a054b0db644"
              alt="Professional meeting"
              className="w-[44%] object-cover rounded-2xl self-stretch"
            />
          </div>

          <div>
            <h2 className="text-2xl font-extrabold text-gray-900 leading-snug mb-3">
              We're Only Working With The Best
            </h2>

            <p className="text-[13px] text-gray-500 leading-relaxed mb-6">
              We collaborate with trusted employers and skilled professionals to
              create meaningful hiring experiences. Our platform focuses on
              quality opportunities, efficient recruitment, and long-term career
              growth.
            </p>

            <div className="grid grid-cols-2 gap-4">
              <FeatureBadge icon={<Star size={15} />} label="Quality Jobs" />
              <FeatureBadge icon={<BookOpen size={15} />} label="Resume Builder" />
              <FeatureBadge icon={<Building2 size={15} />} label="Top Companies" />
              <FeatureBadge icon={<Users size={15} />} label="Top Talents" />
            </div>
          </div>
        </div>
      </section>

      {/* ── NEWS AND BLOG ────────────────────────────────────────────────── */}
      <section className="bg-white py-14 border-t border-gray-100">
        <div className="max-w-5xl mx-auto px-8 md:px-12">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-extrabold text-gray-900 mb-2">
              News and Blog
            </h2>

            <p className="text-[13px] text-gray-400">
              Explore career advice, hiring trends, interview tips, and
              workplace insights from industry experts.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {blogPosts.map((post) => (
              <div
                key={post.title}
                className="rounded-2xl overflow-hidden border border-gray-100 bg-white shadow-sm hover:shadow-md transition"
              >
                <div className="h-44 relative">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover"
                  />

                  <span
                    className={`absolute top-3 left-3 ${post.badgeBg} text-white text-[10px] font-bold px-2.5 py-1 rounded-full`}
                  >
                    {post.badge}
                  </span>
                </div>

                <div className="p-5">
                  <p className="text-[10px] text-gray-400 mb-2">
                    JANUARY 2026
                  </p>

                  <h4 className="text-[13px] font-bold text-gray-900 leading-snug mb-3">
                    {post.title}
                  </h4>

                  <a
                    href={post.video}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[#2bb5a0] text-[12px] font-semibold hover:underline"
                  >
                    Watch Video →
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}