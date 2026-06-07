import { logoutUser } from "../../services/accountapi";
import { useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react";

export default function Logout() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    const refresh = localStorage.getItem("refresh_token");

    try {
      await logoutUser(refresh);
    } catch (err) {
      console.log(err);
    }

    localStorage.clear();
    navigate("/login");
  };

  return (
    <button
      onClick={handleLogout}
      className="group inline-flex items-center gap-2 bg-red-500 hover:bg-red-600 active:scale-[0.97] text-white font-semibold px-5 py-2.5 rounded-xl shadow-lg shadow-red-500/20 hover:shadow-xl transition-all duration-200"
    >
      <LogOut
        size={18}
        className="group-hover:translate-x-1 transition-transform"
      />
      Logout
    </button>
  );
}