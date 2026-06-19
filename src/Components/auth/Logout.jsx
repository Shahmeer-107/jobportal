import { useState } from "react";
import { logoutUser } from "../../services/accountapi";
import { useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react";

export default function Logout() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    if (loading) return;
    setLoading(true);

    const refresh = localStorage.getItem("refresh_token");

    // Call backend logout only if refresh exists
    if (refresh) {
      try {
        await logoutUser(refresh);
      } catch (err) {
        console.log("Logout API error:", err);
      }
    }

    // Clean only auth-related data (not everything)
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("role");

    // Redirect to login
    navigate("/login");

    setLoading(false);
  };

  return (
    <button
      onClick={handleLogout}
      disabled={loading}
      className="group inline-flex items-center gap-2 bg-red-500 hover:bg-red-600 disabled:bg-red-300 disabled:cursor-not-allowed active:scale-[0.97] text-white font-semibold px-5 py-2.5 rounded-xl shadow-lg shadow-red-500/20 hover:shadow-xl transition-all duration-200"
    >
      {loading ? (
        <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
      ) : (
        <LogOut
          size={18}
          className="group-hover:translate-x-1 transition-transform"
        />
      )}

      {loading ? "Logging out..." : "Logout"}
    </button>
  );
}