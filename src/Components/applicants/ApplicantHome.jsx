import React from "react";
import { Link } from "react-router-dom";
import { Briefcase, Bookmark, FileCheck, UserRound } from "lucide-react";

export default function ApplicantHome() {
  const cards = [
    {
      title: "Browse Jobs",
      desc: "Explore latest job opportunities.",
      icon: <Briefcase size={26} />,
      link: "/applicant/dashboard/jobs",
    },
    {
      title: "Saved Jobs",
      desc: "View jobs you saved for later.",
      icon: <Bookmark size={26} />,
      link: "/applicant/dashboard/saved-jobs",
    },
    {
      title: "My Applications",
      desc: "Track your applied jobs and status.",
      icon: <FileCheck size={26} />,
      link: "/applicant/dashboard/my-applications",
    },
    {
      title: "Profile",
      desc: "View your account information.",
      icon: <UserRound size={26} />,
      link: "/applicant/dashboard/profile",
    },
  
  ];

  return (
    <div>
      <div className="bg-white rounded-[32px] shadow-xl border border-gray-100 p-8 mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900">
          Welcome Applicant 👋
        </h1>

        <p className="text-gray-500 mt-2">
          Manage your jobs, saved opportunities, applications, and profile.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {cards.map((card) => (
          <Link
            key={card.title}
            to={card.link}
            className="bg-white rounded-[28px] border border-gray-100 p-6 hover:shadow-2xl hover:-translate-y-1 transition-all"
          >
            <div className="w-14 h-14 rounded-2xl bg-[#eef7f5] text-[#2bb5a0] flex items-center justify-center mb-4">
              {card.icon}
            </div>

            <h3 className="text-xl font-extrabold text-gray-900">
              {card.title}
            </h3>

            <p className="text-sm text-gray-500 mt-1">{card.desc}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}