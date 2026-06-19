import React, { useState } from "react";
import { loginUser } from "../../services/accountapi";
import { useNavigate, Link } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff, Briefcase, UserCircle, UserRound, User2Icon } from "lucide-react";

export default function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      console.log("FORM DATA:", form);

      const res = await loginUser(form);

      console.log("LOGIN RESPONSE:", res);


      localStorage.setItem("access_token", res.access);
      localStorage.setItem("refresh_token", res.refresh);
      localStorage.setItem("role", res.role);

      if (res.role === "applicant") navigate("/applicant/dashboard");
      else if (res.role === "company") navigate("/company/dashboard");
      else if (res.role === "admin") navigate("/admin/dashboard");
      else navigate("/");
    } catch (err) {
      setError("Invalid email or password. Please check your credentials.");
      console.error("LOGIN ERROR:", err);

    } finally {
      setLoading(false);
    }
  };

  return (

    
    <div className="min-h-screen bg-[#f4fbfa] flex items-center justify-center px-4 py-10 font-sans">
      <div className="w-full max-w-5xl bg-white rounded-[28px] shadow-2xl border border-gray-100 overflow-hidden grid grid-cols-1 lg:grid-cols-2 animate-[fadeIn_0.5s_ease-out]">
        
        {/* Left Side */}

       
        <div className="hidden lg:flex relative bg-gradient-to-br from-[#0f172a] via-[#12332f] to-[#2bb5a0] p-10 flex-col justify-between text-white overflow-hidden">
          <div className="absolute -top-20 -right-20 w-60 h-60 bg-white/10 rounded-full blur-2xl" />
          <div className="absolute bottom-10 -left-16 w-52 h-52 bg-[#2bb5a0]/30 rounded-full blur-2xl" />

           
          <div className="relative z-10">
            <div className="w-14 h-14 bg-white/15 backdrop-blur rounded-2xl flex items-center justify-center mb-8">
              <Briefcase size={28} />
            </div>

            <h1 className="text-4xl font-extrabold leading-tight mb-4">
              Find Better Jobs. <br />
              Build Better Careers.
            </h1>

            <p className="text-white/75 text-sm leading-relaxed max-w-sm">
              Login to access your dashboard, manage applications, connect with
              companies, and continue your career journey.
            </p>
          </div>

          <div className="relative z-10 grid grid-cols-3 gap-4">
            <div className="bg-white/10 backdrop-blur rounded-2xl p-4">
              <p className="text-2xl font-bold">25k+</p>
              <p className="text-xs text-white/70">Jobs</p>
            </div>
            <div className="bg-white/10 backdrop-blur rounded-2xl p-4">
              <p className="text-2xl font-bold">10k+</p>
              <p className="text-xs text-white/70">Candidates</p>
            </div>
            <div className="bg-white/10 backdrop-blur rounded-2xl p-4">
              <p className="text-2xl font-bold">18k+</p>
              <p className="text-xs text-white/70">Companies</p>
            </div>
          </div>
        </div>
        

        {/* Right Side */}
        <div className="p-7 sm:p-10 lg:p-12 relative">
          <div className="flex items-center justify-between mb-6">
            <div className="w-14 h-14 bg-[#eef7f5] rounded-2xl flex items-center justify-center shadow-sm">
              <UserRound size={26} className="text-[#2bb5a0]" />
            </div>
            <Link
              to="/"
              className="text-sm font-semibold text-[#2bb5a0] border border-[#2bb5a0] px-4 py-2 rounded-2xl hover:bg-[#effdfb] transition"
            >
              Back to Home
            </Link>
          </div>
          <div className="mb-2">
            

            

            <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">
              Welcome Back
            </h2>

            <p className="text-sm text-gray-500 mt-2">
              Please enter your details to sign in to your account.
            </p>
          </div>

          {error && (
            <div className="mb-5 bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl animate-[shake_0.25s_ease-in-out]">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="group">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Email Address
              </label>

              <div className="relative">
                <Mail
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#2bb5a0] transition"
                />

                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="Enter your email address"
                  required
                  autoComplete="email"
                  className="w-full bg-white border border-gray-200 rounded-2xl pl-12 pr-4 py-3.5 text-[15px] text-gray-900 placeholder:text-gray-400 outline-none transition-all duration-200 hover:border-gray-300 focus:border-[#2bb5a0] focus:ring-4 focus:ring-[#2bb5a0]/15 shadow-sm focus:shadow-md"
                />
              </div>
            </div>

            <div className="group">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Password
              </label>

              <div className="relative">
                <Lock
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#2bb5a0] transition"
                />

                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  required
                  autoComplete="current-password"
                  className="w-full bg-white border border-gray-200 rounded-2xl pl-12 pr-12 py-3.5 text-[15px] text-gray-900 placeholder:text-gray-400 outline-none transition-all duration-200 hover:border-gray-300 focus:border-[#2bb5a0] focus:ring-4 focus:ring-[#2bb5a0]/15 shadow-sm focus:shadow-md"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#2bb5a0] transition"
                >
                  {showPassword ? <EyeOff size={19} /> : <Eye size={19} />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-sm text-gray-500 cursor-pointer">
                <input
                  type="checkbox"
                  className="w-4 h-4 accent-[#2bb5a0] rounded"
                />
                Remember me
              </label>

              <Link
                to="/forgot-password"
                className="text-sm font-semibold text-[#2bb5a0] hover:text-[#239985] hover:underline transition"
              >
                Forgot Password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#2bb5a0] hover:bg-[#239985] active:scale-[0.98] disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-bold py-3.5 rounded-2xl transition-all duration-200 shadow-lg shadow-[#2bb5a0]/25 hover:shadow-xl hover:shadow-[#2bb5a0]/30"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  Logging in...
                </span>
              ) : (
                "Login"
              )}
            </button>
          </form>

          <div className="mt-7 text-center">
            <p className="text-sm text-gray-500">
              Don&apos;t have an account?{" "}
              <Link
                to="/register"
                className="font-bold text-[#2bb5a0] hover:text-[#239985] hover:underline transition"
              >
                Create Account
              </Link>
            </p>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(18px) scale(0.98);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @keyframes shake {
          0%, 100% {
            transform: translateX(0);
          }
          25% {
            transform: translateX(-4px);
          }
          75% {
            transform: translateX(4px);
          }
        }
      `}</style>
    </div>
  );
}