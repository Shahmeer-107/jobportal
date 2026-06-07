import React, { useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { resetPassword } from "../../services/accountapi";
import { Mail, Lock, KeyRound, Eye, EyeOff, ArrowLeft } from "lucide-react";

export default function ResetPassword() {
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState(location?.state?.email || "");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      await resetPassword({
        email,
        otp,
        new_password: newPassword,
      });

      setSuccess("Password reset successful!");
      setTimeout(() => navigate("/login"), 1200);
    } catch (err) {
      setError(err.response?.data?.detail || "Reset failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f4fbfa] flex items-center justify-center px-4 py-10 font-sans">
      <div className="w-full max-w-md bg-white rounded-[28px] shadow-2xl border border-gray-100 p-8 animate-[fadeIn_0.5s_ease-out]">

        <Link
          to="/login"
          className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-[#2bb5a0] mb-6 transition"
        >
          <ArrowLeft size={16} />
          Back to Login
        </Link>

        <div className="w-16 h-16 bg-[#eef7f5] rounded-2xl flex items-center justify-center mb-6 shadow-sm">
          <KeyRound size={30} className="text-[#2bb5a0]" />
        </div>

        <h2 className="text-3xl font-extrabold text-gray-900 mb-2">
          Reset Password
        </h2>

        <p className="text-sm text-gray-500 leading-relaxed mb-8">
          Enter your OTP and create a new secure password for your account.
        </p>

        {error && (
          <div className="mb-5 bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl animate-[shake_0.25s_ease-in-out]">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-5 bg-green-50 border border-green-200 text-green-600 text-sm px-4 py-3 rounded-xl">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="group relative">
            <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#2bb5a0] transition" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email Address"
              required
              className="w-full bg-white border border-gray-200 rounded-2xl pl-12 pr-4 py-3.5 text-[15px] text-gray-900 placeholder:text-gray-400 outline-none transition-all duration-200 hover:border-gray-300 focus:border-[#2bb5a0] focus:ring-4 focus:ring-[#2bb5a0]/15 shadow-sm focus:shadow-md"
            />
          </div>

          <div className="group relative">
            <KeyRound size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#2bb5a0] transition" />
            <input
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="Enter OTP"
              required
              className="w-full bg-white border border-gray-200 rounded-2xl pl-12 pr-4 py-3.5 text-[15px] text-gray-900 placeholder:text-gray-400 outline-none transition-all duration-200 hover:border-gray-300 focus:border-[#2bb5a0] focus:ring-4 focus:ring-[#2bb5a0]/15 shadow-sm focus:shadow-md"
            />
          </div>

          <div className="group relative">
            <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#2bb5a0] transition" />
            <input
              type={showPassword ? "text" : "password"}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="New Password"
              required
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

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#2bb5a0] hover:bg-[#239985] active:scale-[0.98] disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-bold py-3.5 rounded-2xl transition-all duration-200 shadow-lg shadow-[#2bb5a0]/25 hover:shadow-xl"
          >
            {loading ? "Resetting Password..." : "Reset Password"}
          </button>
        </form>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(18px) scale(0.98); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-4px); }
          75% { transform: translateX(4px); }
        }
      `}</style>
    </div>
  );
}