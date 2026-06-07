import React from "react";
import { Link } from "react-router-dom";
import { BriefcaseBusiness, PlusCircle, FileText, UserRound } from "lucide-react";

export default function CompanyHome() {
  const cards = [
    {
      title: "Create Job",
      desc: "Post a new job opportunity for applicants.",
      icon: <PlusCircle size={26} />,
      link: "/company/dashboard/create-job",
    },
    {
      title: "My Jobs",
      desc: "Manage your posted jobs and update details.",
      icon: <BriefcaseBusiness size={26} />,
      link: "/company/dashboard/my-jobs",
    },
    {
      title: "Applications",
      desc: "Review applicants and update application status.",
      icon: <FileText size={26} />,
      link: "/company/dashboard/applications",
    },
    {
      title: "Company Profile",
      desc: "View your company account information.",
      icon: <UserRound size={26} />,
      link: "/company/dashboard/profile",
    },
  ];

  return (
    <div>
      <div className="bg-white rounded-[32px] shadow-xl border border-gray-100 p-8 mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900">
          Welcome Company 👋
        </h1>

        <p className="text-gray-500 mt-2">
          Manage job posts, review applications, and organize your hiring process.
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