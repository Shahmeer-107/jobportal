import React, { useEffect, useState } from "react";
import { getMyApplications } from "../../services/applicantApi";

export default function MyApplications() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchApplications = async () => {
    try {
      const data = await getMyApplications();
      setApplications(data);
    } catch (err) {
      console.log(err);
      alert("Failed to load applications");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  return (
    <div>
      <div className="bg-white rounded-[32px] shadow-xl p-8 mb-6">
        <h1 className="text-3xl font-extrabold">My Applications</h1>
        <p className="text-gray-500 mt-2">Track your applied jobs.</p>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : applications.length === 0 ? (
        <div className="bg-white rounded-3xl p-8 text-center text-gray-500">
          You have not applied to any job yet.
        </div>
      ) : (
        <div className="space-y-5">
          {applications.map((app, index) => (
            <div key={index} className="bg-white rounded-[28px] p-6 border">
              <h2 className="text-xl font-extrabold">{app.job_title}</h2>
              <p className="text-gray-500 mt-2">
                Applied at: {new Date(app.applied_at).toLocaleString()}
              </p>
              <span className="inline-block mt-4 px-4 py-2 rounded-full bg-blue-50 text-blue-700 text-xs font-bold">
                {app.status}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}