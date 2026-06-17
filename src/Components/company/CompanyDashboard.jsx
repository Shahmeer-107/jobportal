import { Outlet, NavLink } from "react-router-dom";
import Logout from "../auth/Logout";
import { LayoutDashboard, PlusCircle, Briefcase, Users, Building2 } from "lucide-react";

const navItems = [
  { to: "/company/dashboard",              label: "Dashboard",    icon: LayoutDashboard, end: true },
  { to: "/company/dashboard/create-job",   label: "Create Job",   icon: PlusCircle },
  { to: "/company/dashboard/my-jobs",      label: "My Jobs",      icon: Briefcase },
  { to: "/company/dashboard/applications", label: "Applications", icon: Users },
  { to: "/company/dashboard/profile",      label: "Profile",      icon: Building2 },
];

export default function CompanyDashboard() {
  return (
    <div className="min-h-screen flex bg-[#f4f7f7] font-sans">

      {/* ── Sidebar ── */}
      <aside className="w-72 flex-shrink-0 text-white p-6 flex flex-col"
        style={{ background: "linear-gradient(180deg, #0f172a 0%, #0a0f1e 100%)" }}>

        <div className="flex items-center gap-3 mb-10 px-2">
          <div className="w-10 h-10 bg-[#2bb5a0] rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg shadow-[#2bb5a0]/30">
            <Briefcase size={18} className="text-white" />
          </div>
          <div>
            <p className="font-extrabold text-white text-[15px] leading-tight">Company Panel</p>
            <p className="text-white/40 text-[11px] font-medium">Manage your hiring</p>
          </div>
        </div>

        <nav className="space-y-1.5 flex-1">
          {navItems.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                  isActive
                    ? "bg-[#2bb5a0] text-white shadow-md shadow-[#2bb5a0]/25"
                    : "text-white/60 hover:text-white hover:bg-white/5"
                }`
              }
            >
              <Icon size={17} />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="pt-4 border-t border-white/10">
          <Logout />
        </div>
      </aside>

      {/* ── Main content ── */}
      <main className="flex-1 p-8 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}