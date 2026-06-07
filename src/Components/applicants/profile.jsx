import React, { useEffect, useState } from "react";
import { getApplicantProfile } from "../../services/applicantApi";

export default function ApplicantProfile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async () => {
    try {
      const data = await getApplicantProfile();
      setProfile(data);
    } catch (err) {
      console.log(err);
      alert("Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  if (loading) return <p>Loading profile...</p>;

  return (
    <div className="bg-white rounded-[32px] shadow-xl overflow-hidden max-w-4xl">
      <div className="h-40 bg-[#0f172a]" />

      <div className="p-8 -mt-14">
        <div className="w-28 h-28 rounded-full bg-[#2bb5a0] text-white flex items-center justify-center text-3xl font-extrabold ring-4 ring-white mb-5">
          {profile?.name?.slice(0, 2).toUpperCase() || "U"}
        </div>

        <h1 className="text-3xl font-extrabold">{profile?.name}</h1>
        <p className="text-gray-500 mt-1">{profile?.email}</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-8">
          <Info label="Account ID" value={`#${profile?.id}`} />
          <Info label="Full Name" value={profile?.name} />
          <Info label="Role" value={profile?.role} />
        </div>
      </div>
    </div>
  );
}

function Info({ label, value }) {
  return (
    <div className="bg-[#f4fbfa] rounded-2xl p-5 border">
      <p className="text-xs text-gray-400 uppercase font-bold">{label}</p>
      <p className="text-sm font-semibold text-gray-900 mt-1">{value}</p>
    </div>
  );
}