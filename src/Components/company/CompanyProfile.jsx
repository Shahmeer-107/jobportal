import { useEffect, useState } from "react";
import { getCompanyProfile } from "../../services/companyAPi";
import { Building2, Mail, ShieldCheck } from "lucide-react";

export default function CompanyProfile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true); setError(null);
      try {
        const data = await getCompanyProfile();
        setProfile(data);
      } catch (err) {
        console.error(err);
        setError("Failed to load profile.");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-28 gap-4">
        <div className="relative w-11 h-11">
          <div className="absolute inset-0 rounded-full border-4 border-gray-100" />
          <div className="absolute inset-0 rounded-full border-4 border-[#2bb5a0] border-t-transparent animate-spin" />
        </div>
        <p className="text-gray-400 text-sm font-medium">Loading profile…</p>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="bg-white rounded-2xl border border-red-100 shadow-sm px-6 py-10 text-center max-w-lg">
        <p className="text-red-500 font-semibold text-sm">{error || "Profile not found."}</p>
      </div>
    );
  }

  const initials = (profile.name || "?")
    .split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2);

  return (
    <div className="max-w-3xl">

      <div className="flex items-center gap-2 mb-1">
        <div className="w-6 h-0.5 rounded-full bg-[#2bb5a0]" />
        <span className="text-[11px] font-bold uppercase tracking-[0.24em] text-[#2bb5a0]">Account</span>
      </div>
      <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 mb-6">Company Profile</h1>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">

        {/* Banner */}
        <div className="h-24 bg-gradient-to-r from-[#0f172a] to-[#2bb5a0]" />

        <div className="px-6 pb-6">
          <div className="-mt-10 mb-4">
            <div className="w-20 h-20 rounded-3xl bg-[#0f172a] text-white flex items-center justify-center font-extrabold text-2xl ring-4 ring-white">
              {initials}
            </div>
          </div>

          <h2 className="text-xl font-extrabold text-gray-900">{profile.name}</h2>
          <p className="text-sm text-gray-400 font-medium">{profile.email}</p>

          <div className="h-px bg-gray-50 my-5" />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#f0faf8] flex items-center justify-center flex-shrink-0">
                <Building2 size={15} className="text-[#2bb5a0]" />
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Company Name</p>
                <p className="text-[13px] font-semibold text-gray-800">{profile.name}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#f0faf8] flex items-center justify-center flex-shrink-0">
                <Mail size={15} className="text-[#2bb5a0]" />
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Email</p>
                <p className="text-[13px] font-semibold text-gray-800">{profile.email}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#f0faf8] flex items-center justify-center flex-shrink-0">
                <ShieldCheck size={15} className="text-[#2bb5a0]" />
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Account Type</p>
                <p className="text-[13px] font-semibold text-gray-800 capitalize">{profile.role}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}