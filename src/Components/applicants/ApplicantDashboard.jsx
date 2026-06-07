import React from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import Logout from "../auth/Logout";
import {
  LayoutDashboard,
  Briefcase,
  Bookmark,
  FileCheck,
  UserRound,
} from "lucide-react";

export default function ApplicantDashboard() {
  const location = useLocation();

  const menuItems = [
    {
      label: "Dashboard",
      path: "/applicant/dashboard",
      icon: <LayoutDashboard size={18} />,
    },
    {
      label: "View Jobs",
      path: "/applicant/dashboard/jobs",
      icon: <Briefcase size={18} />,
    },
    {
      label: "Saved Jobs",
      path: "/applicant/dashboard/saved-jobs",
      icon: <Bookmark size={18} />,
    },
    {
      label: "My Applications",
      path: "/applicant/dashboard/my-applications",
      icon: <FileCheck size={18} />,
    },
    {
      label: "Profile",
      path: "/applicant/dashboard/profile",
      icon: <UserRound size={18} />,
    },

  ];

  const isActive = (path) => location.pathname === path;

  return (
    <div className="min-h-screen bg-[#f4fbfa] flex">
      <aside className="w-72 bg-[#0f172a] text-white p-5 hidden md:flex flex-col">
        <h2 className="text-2xl font-extrabold mb-8">Applicant Panel</h2>

        <nav className="space-y-2">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold transition ${
                isActive(item.path)
                  ? "bg-[#2bb5a0] text-white"
                  : "text-white/70 hover:bg-white/10 hover:text-white"
              }`}
            >
              {item.icon}
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="mt-auto">
         <Logout />
        </div>
      </aside>

      <main className="flex-1 p-4 md:p-8">
        <Outlet />
      </main>
    
    </div>
  );
}