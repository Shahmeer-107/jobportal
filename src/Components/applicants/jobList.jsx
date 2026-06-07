import React, { useEffect, useState } from "react";
import { getJobs, saveJob } from "../../services/applicantApi";
import { Link } from "react-router-dom";
import { Briefcase, MapPin, Search, Bookmark } from "lucide-react";

export default function JobList() {
  const [jobs, setJobs] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const data = await getJobs(search);
      setJobs(data.results || data);
    } catch (err) {
      console.log(err);
      alert("Failed to load jobs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const handleSave = async (id) => {
    try {
      await saveJob(id);
      alert("Job saved successfully");
    } catch (err) {
      alert("Already saved or failed");
    }
  };

  return (
    <div>
      <div className="bg-white rounded-[32px] shadow-xl p-8 mb-6">
        <h1 className="text-3xl font-extrabold">Available Jobs</h1>
        <p className="text-gray-500 mt-2">Find jobs that match your skills.</p>

        <div className="flex gap-3 mt-6">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search jobs..."
              className="w-full border rounded-2xl pl-12 pr-4 py-3 text-gray-900 outline-none focus:border-[#2bb5a0]"
            />
          </div>

          <button onClick={fetchJobs} className="bg-[#2bb5a0] text-white px-6 rounded-2xl font-bold">
            Search
          </button>
        </div>
      </div>

      {loading ? (
        <p>Loading jobs...</p>
      ) : jobs.length === 0 ? (
        <div className="bg-white rounded-3xl p-8 text-center text-gray-500">No jobs found.</div>
      ) : (
        <div className="space-y-5">
          {jobs.map((job) => (
            <div key={job.id} className="bg-white rounded-[28px] p-6 border hover:shadow-xl transition">
              <h2 className="text-xl font-extrabold">{job.title}</h2>
              <p className="text-gray-500 text-sm mt-1">{job.company_name || job.company_full_name}</p>

              <div className="flex gap-5 text-sm text-gray-500 mt-4">
                <span className="flex gap-1 items-center">
                  <Briefcase size={15} /> {job.job_type || "N/A"}
                </span>
                <span className="flex gap-1 items-center">
                  <MapPin size={15} /> {job.location || "Remote"}
                </span>
              </div>

              <div className="flex gap-3 mt-5">
                <button
                  onClick={() => handleSave(job.id)}
                  className="border px-5 py-2 rounded-2xl hover:text-[#2bb5a0]"
                >
                  <Bookmark size={16} className="inline mr-1" />
                  Save
                </button>

                <Link
                  to={`/applicant/dashboard/jobs/${job.id}`}
                  className="bg-[#2bb5a0] text-white px-5 py-2 rounded-2xl font-bold"
                >
                  View Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}