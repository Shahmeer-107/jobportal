import React, { useState } from "react";
import { applyJob } from "../../services/applicantApi";
import { useNavigate, useParams } from "react-router-dom";

export default function ApplyJobs() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    full_name: "",
    phone_number: "",
    contact_email: "",
    city: "",
    resume: null,
    profile_photo: null,
    github_url: "",
    status: "pending",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setForm({ ...form, [name]: files ? files[0] : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      await applyJob(id, form);
      alert("Application submitted successfully");
      navigate("/applicant/dashboard/my-applications");
    } catch (err) {
      console.log(err.response?.data);
      alert("Failed to apply");
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full border rounded-2xl px-4 py-3 text-gray-900 outline-none focus:border-[#2bb5a0]";

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-[32px] shadow-xl p-8">
      <h1 className="text-3xl font-extrabold mb-6">Apply for Job</h1>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <input name="full_name" placeholder="Full Name" required onChange={handleChange} className={inputClass} />
        <input name="phone_number" placeholder="Phone Number" required onChange={handleChange} className={inputClass} />
        <input type="email" name="contact_email" placeholder="Contact Email" required onChange={handleChange} className={inputClass} />
        <input name="city" placeholder="City" onChange={handleChange} className={inputClass} />
        <input name="github_url" placeholder="GitHub URL" onChange={handleChange} className={inputClass} />

        <div>
          <label className="text-sm font-bold">Resume</label>
          <input type="file" name="resume" onChange={handleChange} className={inputClass} />
        </div>

        <div>
          <label className="text-sm font-bold">Profile Photo</label>
          <input type="file" name="profile_photo" onChange={handleChange} className={inputClass} />
        </div>

        <button
          disabled={loading}
          className="md:col-span-2 bg-[#2bb5a0] text-white py-4 rounded-2xl font-bold"
        >
          {loading ? "Submitting..." : "Submit Application"}
        </button>
      </form>
    </div>
  );
}