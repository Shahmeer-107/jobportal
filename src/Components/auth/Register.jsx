import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Briefcase,
  UserRound,
  Building2,
  ArrowRight,
  CheckCircle,
} from "lucide-react";

export default function Register() {
  const navigate = useNavigate();

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
              Start Your Journey <br />
              With The Right Platform.
            </h1>

            <p className="text-white/75 text-sm leading-relaxed max-w-sm">
              Create your account to explore job opportunities, connect with
              top companies, and manage your career or hiring process easily.
            </p>
          </div>

          <div className="relative z-10 space-y-4">
            <div className="flex items-center gap-3 text-sm text-white/85">
              <CheckCircle size={18} className="text-white" />
              Apply for jobs and manage your applications
            </div>

            <div className="flex items-center gap-3 text-sm text-white/85">
              <CheckCircle size={18} className="text-white" />
              Connect with skilled candidates and employers
            </div>

            <div className="flex items-center gap-3 text-sm text-white/85">
              <CheckCircle size={18} className="text-white" />
              Build a professional career or hiring profile
            </div>
          </div>
        </div>

        {/* Right Side */}
        <div className="p-7 sm:p-10 lg:p-12">
          <div className="mb-8">
            <div className="w-14 h-14 bg-[#eef7f5] rounded-2xl flex items-center justify-center mb-5 shadow-sm">
              <UserRound size={26} className="text-[#2bb5a0]" />
            </div>

            <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">
              Create Account
            </h2>

            <p className="text-sm text-gray-500 mt-2">
              Choose your account type to continue registration.
            </p>
          </div>

          <div className="space-y-5">
            <button
              onClick={() => navigate("/register/applicant")}
              className="group w-full text-left bg-white border border-gray-200 hover:border-[#2bb5a0] hover:bg-[#f0faf8] rounded-2xl p-5 transition-all duration-200 shadow-sm hover:shadow-md active:scale-[0.98]"
            >
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-[#eef7f5] group-hover:bg-[#2bb5a0] flex items-center justify-center transition-colors">
                    <UserRound
                      size={23}
                      className="text-[#2bb5a0] group-hover:text-white transition-colors"
                    />
                  </div>

                  <div>
                    <h3 className="text-base font-bold text-gray-900">
                      Candidate Registration
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">
                      Create a profile, upload your CV, and apply for jobs.
                    </p>
                  </div>
                </div>

                <ArrowRight
                  size={20}
                  className="text-gray-300 group-hover:text-[#2bb5a0] group-hover:translate-x-1 transition-all"
                />
              </div>
            </button>

            <button
              onClick={() => navigate("/register/company")}
              className="group w-full text-left bg-white border border-gray-200 hover:border-[#2bb5a0] hover:bg-[#f0faf8] rounded-2xl p-5 transition-all duration-200 shadow-sm hover:shadow-md active:scale-[0.98]"
            >
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-[#eef7f5] group-hover:bg-[#2bb5a0] flex items-center justify-center transition-colors">
                    <Building2
                      size={23}
                      className="text-[#2bb5a0] group-hover:text-white transition-colors"
                    />
                  </div>

                  <div>
                    <h3 className="text-base font-bold text-gray-900">
                      Company Registration
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">
                      Register your company, post jobs, and hire talent.
                    </p>
                  </div>
                </div>

                <ArrowRight
                  size={20}
                  className="text-gray-300 group-hover:text-[#2bb5a0] group-hover:translate-x-1 transition-all"
                />
              </div>
            </button>
          </div>

          <div className="mt-8 text-center">
            <p className="text-sm text-gray-500">
              Already have an account?{" "}
              <button
                onClick={() => navigate("/login")}
                className="font-bold text-[#2bb5a0] hover:text-[#239985] hover:underline transition"
              >
                Login here
              </button>
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
      `}</style>
    </div>
  );
}