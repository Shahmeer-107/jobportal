import React, { useEffect, useState } from "react";
import { getSavedJobs } from "../../services/applicantApi";
import { Link } from "react-router-dom";

export default function SavedJobs() {
  const [savedJobs, setSavedJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchSavedJobs = async () => {
    try {
      const data = await getSavedJobs();
      setSavedJobs(data.results || data);
    } catch (err) {
      console.log(err);
      alert("Failed to load saved jobs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSavedJobs();
  }, []);

  return (
    <div>
      <div className="bg-white rounded-[32px] shadow-xl p-8 mb-6">
        <h1 className="text-3xl font-extrabold">Saved Jobs</h1>
        <p className="text-gray-500 mt-2">Jobs you saved for later.</p>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : savedJobs.length === 0 ? (
        <div className="bg-white rounded-3xl p-8 text-center text-gray-500">No saved jobs found.</div>
      ) : (
        <div className="space-y-5">
          {savedJobs.map((item) => {
            const jobId = typeof item.job === "object" ? item.job.id : item.job;
            const title = item.job?.title || item.job_title || `Job ID: #${jobId}`;

            return (
              <div key={item.id} className="bg-white rounded-[28px] p-6 border flex justify-between">
                <div>
                  <h2 className="text-xl font-extrabold">{title}</h2>
                  <p className="text-sm text-gray-500">
                    Saved at: {item.saved_at ? new Date(item.saved_at).toLocaleString() : "N/A"}
                  </p>
                </div>

                <Link
                  to={`/applicant/dashboard/jobs/${jobId}`}
                  className="bg-[#2bb5a0] text-white px-5 py-2 rounded-2xl font-bold"
                >
                  View Job
                </Link>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}