import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Mail, Phone, MapPin, FileText, Link2, User } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getApplicationById, updateApplication } from "@/services/companyAPi";

function formatDate(dateString) {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  return isNaN(date.getTime()) ? dateString : date.toLocaleString();
}

export default function ViewApplication() {
  const { applicationId } = useParams();
  const navigate = useNavigate();
  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState("pending");
  const [savingStatus, setSavingStatus] = useState(false);

  useEffect(() => {
    const fetchApplication = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getApplicationById(applicationId);
        setApplication(data);
        setSelectedStatus(data.status || "pending");
      } catch (err) {
        console.error(err);
        setError("Failed to load application details.");
      } finally {
        setLoading(false);
      }
    };

    if (applicationId) fetchApplication();
  }, [applicationId]);

  const handleStatusSave = async (newStatus) => {
    if (!application) return;
    setSavingStatus(true);

    try {
      const payload = {
        full_name: application.full_name,
        phone_number: application.phone_number,
        contact_email: application.contact_email,
        city: application.city,
        github_url: application.github_url,
        job: application.job,
        status: newStatus,
      };

      await updateApplication(application.id, payload);
      setApplication((prev) => prev && { ...prev, status: newStatus });
      setSelectedStatus(newStatus);
    } catch (err) {
      console.error(err);
      toast.error("Failed to update application status. Please try again.");
    } finally {
      setSavingStatus(false);
    }
  };


  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-lg text-gray-600">Loading application details…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center p-6">
        <div className="bg-white rounded-2xl border border-red-100 shadow-sm px-8 py-10 text-center">
          <p className="text-red-600 font-semibold mb-4">{error}</p>
          <Button onClick={() => navigate("/company/dashboard/applications")}>Back to Applications</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-24 h-24 rounded-3xl overflow-hidden bg-gray-100 flex items-center justify-center">
              {application.profile_photo ? (
                <img src={application.profile_photo} alt={application.full_name} className="w-full h-full object-cover" />
              ) : (
                <User size={36} className="text-[#2bb5a0]" />
              )}
            </div>
            <div>
              <p className="text-sm font-semibold uppercase tracking-wide text-[#2bb5a0]">Application Detail</p>
              <h1 className="text-3xl font-extrabold text-gray-900">{application.full_name || "Applicant"}</h1>
              <p className="mt-2 text-sm text-gray-500">Applied for: {application.job_title || "Unknown job"}</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" onClick={() => navigate("/company/dashboard/applications")}> 
              <ArrowLeft size={16} className="mr-2" /> Back
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Candidate Information</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-6 sm:grid-cols-2">
            <div>
              <p className="text-sm font-semibold text-gray-600">Full Name</p>
              <p className="mt-1 text-gray-900">{application.full_name}</p>
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-600">Phone Number</p>
              <p className="mt-1 text-gray-900">{application.phone_number}</p>
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-600">Contact Email</p>
              <p className="mt-1 text-gray-900">{application.contact_email}</p>
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-600">City</p>
              <p className="mt-1 text-gray-900">{application.city || "Not specified"}</p>
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-600">Status</p>
              <div className="mt-1 flex items-center gap-3">
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-[#2bb5a0]"
                >
                  {['pending', 'reviewed', 'shortlisted', 'rejected', 'hired'].map((status) => (
                    <option key={status} value={status}>
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </option>
                  ))}
                </select>
                <Button
                  variant="outline"
                  onClick={() => handleStatusSave(selectedStatus)}
                  disabled={savingStatus}
                >
                  {savingStatus ? 'Saving...' : 'Save'}
                </Button>
              </div>
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-600">Applied At</p>
              <p className="mt-1 text-gray-900">{formatDate(application.applied_at)}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Documents & Links</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <p className="text-sm font-semibold text-gray-600">Resume</p>
                {application.resume ? (
                  <a href={application.resume} target="_blank" rel="noopener noreferrer" className="text-[#2bb5a0] font-bold hover:underline inline-flex items-center gap-2">
                    <FileText size={14} /> View Resume
                  </a>
                ) : (
                  <p className="mt-1 text-gray-900">Not uploaded</p>
                )}
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-600">GitHub URL</p>
                {application.github_url ? (
                  <a href={application.github_url} target="_blank" rel="noopener noreferrer" className="text-[#2bb5a0] font-bold hover:underline inline-flex items-center gap-2">
                    <Link2 size={14} /> View Profile
                  </a>
                ) : (
                  <p className="mt-1 text-gray-900">Not provided</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Job Reference</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <p className="text-sm font-semibold text-gray-600">Job ID</p>
                <p className="mt-1 text-gray-900">{application.job_id}</p>
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-600">Job Title</p>
                <p className="mt-1 text-gray-900">{application.job_title}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <User size={14} /> Applicant ID: {application.applicant}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
