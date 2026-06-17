import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getJobById, updateJob, partialUpdateJob } from "@/services/companyAPi";

export default function EditJobs() {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [updateMethod, setUpdateMethod] = useState("patch"); // "put" or "patch"

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    degree_required: "",
    company_full_name: "",
    job_type: "",
    work_type: "",
    experience_level: "",
    salary_min: "",
    salary_max: "",
    currency: "",
    skills: "",
    responsibilities: "",
    location: "",
    deadline: "",
    status: "",
    source: "",
    external_id: "",
  });

  const [initialData, setInitialData] = useState(null);

  // Fetch job details on component mount
  useEffect(() => {
    const fetchJobDetails = async () => {
      try {
        setLoading(true);
        const jobData = await getJobById(jobId);
        setFormData({
          title: jobData.title || "",
          description: jobData.description || "",
          category: jobData.category || "",
          degree_required: jobData.degree_required || "",
          company_full_name: jobData.company_full_name || "",
          job_type: jobData.job_type || "",
          work_type: jobData.work_type || "",
          experience_level: jobData.experience_level || "",
          salary_min: jobData.salary_min || "",
          salary_max: jobData.salary_max || "",
          currency: jobData.currency || "",
          skills: jobData.skills || "",
          responsibilities: jobData.responsibilities || "",
          location: jobData.location || "",
          deadline: jobData.deadline || "",
          status: jobData.status || "",
          source: jobData.source || "",
          external_id: jobData.external_id || "",
        });
        setInitialData(jobData);
      } catch (error) {
        toast.error("Failed to load job details");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    if (jobId) {
      fetchJobDetails();
    }
  }, [jobId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle full update (PUT) - replaces all fields
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (updateMethod === "put") {
      await handleFullUpdate();
    } else {
      await handlePartialUpdate();
    }
  };

  const handleFullUpdate = async () => {
    try {
      setSubmitting(true);
      await updateJob(jobId, formData);
      toast.success("Job updated successfully (Full Update - PUT)");
      navigate("/company/dashboard/my-jobs");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update job");
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  };

  // Handle partial update (PATCH) - only updates changed fields
  const handlePartialUpdate = async () => {
    try {
      setSubmitting(true);
      const changedFields = {};
      Object.keys(formData).forEach((key) => {
        if (formData[key] !== initialData?.[key]) {
          changedFields[key] = formData[key];
        }
      });

      if (Object.keys(changedFields).length === 0) {
        toast.info("No changes detected");
        setSubmitting(false);
        return;
      }

      await partialUpdateJob(jobId, changedFields);
      toast.success("Job updated successfully (Partial Update - PATCH)");
      setInitialData(formData);
      navigate("/company/dashboard/my-jobs");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update job");
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate("/company/dashboard/my-jobs");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-lg">Loading job details...</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 p-6">
      <div className="max-w-5xl mx-auto">
        <Card className="overflow-hidden rounded-3xl border border-slate-200 shadow-sm">
          <CardHeader>
            <CardTitle>Edit Job Posting</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Job Title */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Job Title <span className="text-red-500">*</span>
                </label>
                <Input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="e.g., Senior React Developer"
                  maxLength="255"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">Max 255 characters</p>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Job Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Enter detailed job description"
                  className="w-full border rounded-md p-2 min-h-32"
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Category
                </label>
                <Input
                  type="text"
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  placeholder="e.g., Technology, Engineering"
                  maxLength="100"
                />
                <p className="text-xs text-gray-500 mt-1">Max 100 characters</p>
              </div>

              {/* Degree Required */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Degree Required
                </label>
                <Input
                  type="text"
                  name="degree_required"
                  value={formData.degree_required}
                  onChange={handleInputChange}
                  placeholder="e.g., Bachelor's in Computer Science"
                  maxLength="100"
                />
                <p className="text-xs text-gray-500 mt-1">Max 100 characters</p>
              </div>

              {/* Company Full Name */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Company Full Name
                </label>
                <Input
                  type="text"
                  name="company_full_name"
                  value={formData.company_full_name}
                  onChange={handleInputChange}
                  placeholder="e.g., Acme Corporation"
                  maxLength="255"
                />
                <p className="text-xs text-gray-500 mt-1">Max 255 characters</p>
              </div>

              {/* Job Type & Work Type */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Job Type
                  </label>
                  <select
                    name="job_type"
                    value={formData.job_type}
                    onChange={handleInputChange}
                    className="w-full border rounded-md p-2"
                  >
                    <option value="">Select job type</option>
                    <option value="contract">Contract</option>
                    <option value="permanent">Permanent</option>
                    <option value="internship">Internship</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Work Type
                  </label>
                  <select
                    name="work_type"
                    value={formData.work_type}
                    onChange={handleInputChange}
                    className="w-full border rounded-md p-2"
                  >
                    <option value="">Select work type</option>
                    <option value="remote">Remote</option>
                    <option value="full-time">Full-time</option>
                    <option value="part-time">Part-time</option>
                  </select>
                </div>
              </div>

              {/* Experience Level */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Experience Level
                </label>
                <select
                  name="experience_level"
                  value={formData.experience_level}
                  onChange={handleInputChange}
                  className="w-full border rounded-md p-2"
                >
                  <option value="">Select experience level</option>
                  <option value="junior">Junior</option>
                  <option value="mid">Mid</option>
                  <option value="senior">Senior</option>
                </select>
              </div>

              {/* Salary Range & Currency */}
              <div className="grid gap-4 sm:grid-cols-3">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Minimum Salary
                  </label>
                  <Input
                    type="number"
                    step="0.01"
                    name="salary_min"
                    value={formData.salary_min}
                    onChange={handleInputChange}
                    placeholder="e.g., 50000"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Maximum Salary
                  </label>
                  <Input
                    type="number"
                    step="0.01"
                    name="salary_max"
                    value={formData.salary_max}
                    onChange={handleInputChange}
                    placeholder="e.g., 100000"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Currency
                  </label>
                  <Input
                    type="text"
                    name="currency"
                    value={formData.currency}
                    onChange={handleInputChange}
                    placeholder="e.g., USD"
                    maxLength="10"
                  />
                </div>
              </div>

              {/* Skills */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Skills (comma separated)
                </label>
                <textarea
                  name="skills"
                  value={formData.skills}
                  onChange={handleInputChange}
                  placeholder="e.g., React, JavaScript, TypeScript, Node.js"
                  className="w-full border rounded-md p-2 min-h-20"
                />
              </div>

              {/* Responsibilities */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Responsibilities
                </label>
                <textarea
                  name="responsibilities"
                  value={formData.responsibilities}
                  onChange={handleInputChange}
                  placeholder="Enter job responsibilities"
                  className="w-full border rounded-md p-2 min-h-24"
                />
              </div>

              {/* Location */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Location
                </label>
                <Input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  placeholder="e.g., New York, USA"
                  maxLength="255"
                />
                <p className="text-xs text-gray-500 mt-1">Max 255 characters</p>
              </div>

              {/* Deadline */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Application Deadline <span className="text-red-500">*</span>
                </label>
                <Input
                  type="date"
                  name="deadline"
                  value={formData.deadline}
                  onChange={handleInputChange}
                  required
                />
              </div>

              {/* Status */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Job Status
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className="w-full border rounded-md p-2"
                >
                  <option value="">Select status</option>
                  <option value="open">Open</option>
                  <option value="closed">Closed</option>
                </select>
              </div>

              {/* Source */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Source
                </label>
                <Input
                  type="text"
                  name="source"
                  value={formData.source}
                  onChange={handleInputChange}
                  placeholder="e.g., Direct, Job Portal"
                  maxLength="100"
                />
                <p className="text-xs text-gray-500 mt-1">Max 100 characters</p>
              </div>

              {/* External ID */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  External ID (Optional)
                </label>
                <Input
                  type="text"
                  name="external_id"
                  value={formData.external_id}
                  onChange={handleInputChange}
                  placeholder="e.g., EXT-12345"
                  maxLength="255"
                />
                <p className="text-xs text-gray-500 mt-1">Max 255 characters</p>
              </div>

              {/* Update Method Selection */}
              <div className="bg-blue-50 p-4 rounded-md">
                <label className="block text-sm font-medium mb-3">
                  Update Method
                </label>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <input
                      type="radio"
                      id="patch"
                      name="updateMethod"
                      value="patch"
                      checked={updateMethod === "patch"}
                      onChange={(e) => setUpdateMethod(e.target.value)}
                      className="mr-2"
                    />
                    <label htmlFor="patch" className="text-sm">
                      <strong>PATCH:</strong> Update only changed fields
                      (recommended)
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="radio"
                      id="put"
                      name="updateMethod"
                      value="put"
                      checked={updateMethod === "put"}
                      onChange={(e) => setUpdateMethod(e.target.value)}
                      className="mr-2"
                    />
                    <label htmlFor="put" className="text-sm">
                      <strong>PUT:</strong> Full replacement of all fields
                    </label>
                  </div>
                </div>
              </div>

              {/* Buttons */}
              <div className="grid gap-3 sm:grid-cols-2">
                <Button type="submit" disabled={submitting} className="w-full">
                  {submitting ? "Updating..." : "Update Job"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCancel}
                  disabled={submitting}
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
