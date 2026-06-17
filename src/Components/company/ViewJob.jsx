import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Pencil, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getJobById } from "@/services/companyAPi";

function formatDate(dateString) {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  return isNaN(date.getTime()) ? dateString : date.toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" });
}

export default function ViewJob() {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchJob = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getJobById(jobId);
        setJob(data);
      } catch (err) {
        console.error(err);
        setError("Failed to load job details.");
      } finally {
        setLoading(false);
      }
    };

    if (jobId) fetchJob();
  }, [jobId]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-lg text-gray-600">Loading job details…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center p-6">
        <div className="bg-white rounded-2xl border border-red-100 shadow-sm px-8 py-10 text-center">
          <p className="text-red-600 font-semibold mb-4">{error}</p>
          <Button onClick={() => navigate("/company/dashboard/my-jobs")}>Back to My Jobs</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 p-6">
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-[#2bb5a0]">Company Job</p>
            <h1 className="text-3xl font-extrabold text-gray-900">{job.title || "Untitled Job"}</h1>
            <p className="mt-2 text-sm text-gray-500">{job.category || "No category"}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" onClick={() => navigate("/company/dashboard/my-jobs")}> 
              <ArrowLeft size={16} className="mr-2" /> Back
            </Button>
            <Link to={`/company/dashboard/edit-job/${job.id}`}>
              <Button>
                <Pencil size={16} className="mr-2" /> Edit
              </Button>
            </Link>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Job Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <p className="text-sm font-semibold text-gray-600">Company</p>
                <p className="mt-1 text-gray-900">{job.company_full_name || "Not provided"}</p>
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-600">Location</p>
                <p className="mt-1 text-gray-900">{job.location || "Not specified"}</p>
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-600">Work Type</p>
                <p className="mt-1 text-gray-900">{job.work_type || "Not specified"}</p>
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-600">Job Type</p>
                <p className="mt-1 text-gray-900">{job.job_type || "Not specified"}</p>
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-600">Experience Level</p>
                <p className="mt-1 text-gray-900">{job.experience_level || "Not specified"}</p>
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-600">Status</p>
                <p className="mt-1 text-gray-900">{job.status || "Not specified"}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <p className="text-sm font-semibold text-gray-600">Description</p>
              <p className="mt-2 text-gray-900 whitespace-pre-line">{job.description || "No description provided."}</p>
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-600">Responsibilities</p>
              <p className="mt-2 text-gray-900 whitespace-pre-line">{job.responsibilities || "No responsibilities provided."}</p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <p className="text-sm font-semibold text-gray-600">Skills</p>
                <p className="mt-1 text-gray-900">{job.skills || "No skills specified."}</p>
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-600">Degree Required</p>
                <p className="mt-1 text-gray-900">{job.degree_required || "Not specified."}</p>
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-600">Salary</p>
                <p className="mt-1 text-gray-900">{job.salary_min || job.salary_max ? `${job.salary_min || "-"} - ${job.salary_max || "-"} ${job.currency || ""}` : "Not specified."}</p>
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-600">Deadline</p>
                <p className="mt-1 text-gray-900">{formatDate(job.deadline)}</p>
              </div>
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-600">Source</p>
              <p className="mt-1 text-gray-900">{job.source || "Not provided."}</p>
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-600">External ID</p>
              <p className="mt-1 text-gray-900">{job.external_id || "Not provided."}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
