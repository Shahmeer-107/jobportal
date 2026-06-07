import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import PublicLayout from "../layouts/PublicLayout";

import Home from "../pages/Home";
import Jobs from "../pages/Jobs";
import About from "../pages/About";
import Contact from "../pages/Contact";
import NotFound from "../pages/NotFound";
// import Jobdetail from "../pages/Jobdetails";

import Register from "../Components/auth/Register";
import RegisterApplicant from "../Components/auth/RegisterApplicant";
import RegisterCompany from "../Components/auth/RegisterCompany";
import VerifyOtp from "../Components/auth/VerifyOtp";
import Login from "../Components/auth/Login";
import ForgotPassword from "../Components/auth/ForgotPassword";
import ResetPassword from "../Components/auth/ResetPassword";

import ApplicantDashboard from "../Components/applicants/ApplicantDashboard";
import ApplicantHome from "../Components/applicants/ApplicantHome";
import JobList from "../Components/applicants/jobList";
import ApplicantJobDetail from "../Components/applicants/Jobdetail";
import ApplyJobs from "../Components/applicants/ApplyJobs";
import SavedJobs from "../Components/applicants/SavedJobs";
import MyApplications from "../Components/applicants/MyApplications";
import ApplicantProfile from "../Components/applicants/profile";

import CompanyDashboard from "../Components/company/CompanyDashboard";
import CompanyHome from "../Components/company/CompanyHome";
import CreateJob from "../Components/company/CreateJob";
import MyJobs from "../Components/company/MyJobs";
import Applications from "../Components/company/Applications";
import CompanyProfile from "../Components/company/CompanyProfile";


function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/jobs" element={<Jobs />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          {/* <Route path="jobs/:id" element={<Jobdetail />} /> */}
        </Route>

         <Route path="/register" element={<Register />} />
          <Route path="/register/applicant" element={<RegisterApplicant />} />
          <Route path="/register/company" element={<RegisterCompany />} />
          <Route path="/verify-otp" element={<VerifyOtp />} />
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />



          <Route path="/applicant/dashboard/*" element={<ApplicantDashboard />}>
            <Route index element={<ApplicantHome />} />
            <Route path="jobs" element={<JobList />} />
            <Route path="jobs/:id" element={<ApplicantJobDetail />} />
            <Route path="jobs/:id/apply" element={<ApplyJobs />} />
            <Route path="saved-jobs" element={<SavedJobs />} />
            <Route path="my-applications" element={<MyApplications />} />
            <Route path="profile" element={<ApplicantProfile />} />
          </Route>


          <Route
            path="/company/dashboard/*"
            element={
              <ProtectedRoute allowedRole="company">
                <CompanyDashboard />
              </ProtectedRoute>
            }
          >
            <Route index element={<CompanyHome />} />
            <Route path="create-job" element={<CreateJob />} />
            <Route path="my-jobs" element={<MyJobs />} />
            <Route path="applications" element={<Applications />} />
            <Route path="profile" element={<CompanyProfile />} />
          </Route>


        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;