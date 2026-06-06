import { Link, NavLink } from "react-router-dom";
import { BriefcaseBusiness, Menu, X } from "lucide-react";
import { useState } from "react";

function Navbar() {
  const [open, setOpen] = useState(false);

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Jobs", path: "/jobs" },
    { name: "About", path: "/about" },
    { name: "Contact", path: "/contact" },
  ];

  return (
    <nav className="fixed left-0 top-0 z-50 w-full border-b border-white/10 bg-[#0a0f1e]/95 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link to="/" className="flex items-center gap-2 text-white">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#2bb5a0]/15 text-[#2bb5a0]">
            <BriefcaseBusiness size={24} />
          </div>
          <span className="text-xl font-bold tracking-tight">Job Portal</span>
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              className={({ isActive }) =>
                isActive
                  ? "text-sm font-semibold text-[#2bb5a0]"
                  : "text-sm font-medium text-white/75 transition hover:text-[#2bb5a0]"
              }
            >
              {link.name}
            </NavLink>
          ))}
        </div>

        <div className="hidden items-center gap-4 md:flex">
          <Link
            to="/login"
            className="text-sm font-medium text-white/75 transition hover:text-[#2bb5a0]"
          >
            Login
          </Link>

          <Link
            to="/register"
            className="rounded-xl bg-[#2bb5a0] px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-[#2bb5a0]/20 transition hover:bg-[#229e8b]"
          >
            Register
          </Link>
        </div>

        <button
          onClick={() => setOpen(!open)}
          className="text-white md:hidden"
        >
          {open ? <X size={26} /> : <Menu size={26} />}
        </button>
      </div>

      {open && (
        <div className="border-t border-white/10 bg-[#0a0f1e] px-6 py-5 md:hidden">
          <div className="flex flex-col gap-4">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setOpen(false)}
                className="text-white/80 hover:text-[#2bb5a0]"
              >
                {link.name}
              </Link>
            ))}

            <Link
              to="/login"
              onClick={() => setOpen(false)}
              className="text-white/80 hover:text-[#2bb5a0]"
            >
              Login
            </Link>

            <Link
              to="/register"
              onClick={() => setOpen(false)}
              className="rounded-xl bg-[#2bb5a0] px-5 py-2.5 text-center font-semibold text-white"
            >
              Register
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;