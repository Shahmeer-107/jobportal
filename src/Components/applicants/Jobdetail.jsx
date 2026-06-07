import React, { useEffect, useState } from "react";
import { getJobById, saveJob } from "../../services/applicantApi";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Briefcase, MapPin, Bookmark } from "lucide-react";

export default function Jobdetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchJob = async () => {
    try {
      const data = await getJobById(id);
      setJob(data);
    } catch (err) {
      console.log(err);
      alert("Failed to load job detail");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJob();
  }, [id]);

  const handleSave = async () => {
    try {
      await saveJob(id);
      alert("Job saved successfully");
    } catch {
      alert("Already saved or failed");
    }
  };

  if (loading) return <p>Loading job...</p>;
  if (!job) return <p>Job not found.</p>;

  return (
    <div>
      <button onClick={() => navigate(-1)} className="mb-5 flex items-center gap-2 text-gray-500">
        <ArrowLeft size={16} />
        Back
      </button>

      <div className="bg-white rounded-[32px] shadow-xl overflow-hidden">
        <div className="bg-[#0f172a] text-white p-8">
          <h1 className="text-3xl font-extrabold">{job.title}</h1>
          <p className="text-white/70 mt-2">{job.company_name || job.company_full_name}</p>
        </div>

        <div className="p-8">
          <div className="flex flex-wrap gap-5 text-gray-600 mb-8">
            <span className="flex gap-2 items-center">
              <Briefcase size={17} /> {job.job_type}
            </span>
            <span className="flex gap-2 items-center">
              <MapPin size={17} /> {job.location || "Remote"}
            </span>
          </div>

          <h2 className="text-xl font-bold mb-2">Job Description</h2>
          <p className="text-gray-600 leading-relaxed whitespace-pre-line mb-6">
            {job.description || "No description provided."}
          </p>

          <h2 className="text-xl font-bold mb-2">Skills</h2>
          <p className="text-gray-600 mb-6">{job.skills || "Not specified"}</p>

          <h2 className="text-xl font-bold mb-2">Responsibilities</h2>
          <p className="text-gray-600 leading-relaxed whitespace-pre-line mb-8">
            {job.responsibilities || "Not specified"}
          </p>

          <div className="flex gap-3">
            <Link
              to={`/applicant/dashboard/jobs/${job.id}/apply`}
              className="bg-[#2bb5a0] text-white px-6 py-3 rounded-2xl font-bold"
            >
              Apply Now
            </Link>

            <button onClick={handleSave} className="border px-6 py-3 rounded-2xl font-bold">
              <Bookmark size={17} className="inline mr-1" />
              Save Job
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}