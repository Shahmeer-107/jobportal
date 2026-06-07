import { Outlet, Link } from "react-router-dom";
import Logout from "../auth/Logout";

export default function CompanyDashboard() {
  return (
    <div className="min-h-screen flex">
      <aside className="w-72 bg-slate-900 text-white p-5 flex flex-col">
        <h2 className="text-2xl font-bold mb-8">
          Company Panel
        </h2>

        <nav className="space-y-3">
          <Link to="/company/dashboard">Dashboard</Link>

          <Link to="/company/dashboard/create-job">
            Create Job
          </Link>

          <Link to="/company/dashboard/my-jobs">
            My Jobs
          </Link>

          <Link to="/company/dashboard/applications">
            Applications
          </Link>

          <Link to="/company/dashboard/profile">
            Profile
          </Link>
        </nav>

        <div className="mt-auto">
          <Logout />
        </div>
      </aside>

      <main className="flex-1 p-6">
        <Outlet />
      </main>
    </div>
  );
}