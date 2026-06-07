import { BrowserRouter, Routes, Route } from "react-router-dom";

import PublicLayout from "../layouts/PublicLayout";

import Home from "../pages/Home";
import Jobs from "../pages/Jobs";
import About from "../pages/About";
import Contact from "../pages/Contact";
import NotFound from "../pages/NotFound";
import Jobdetail from "../pages/Jobdetails";

// import Register from "../Components/auth/Register";
// import RegisterApplicant from "../Components/auth/RegisterApplicant";
// import RegisterCompany from "../Components/auth/RegisterCompany";
// import VerifyOtp from "../Components/auth/VerifyOtp";
// import Login from "../Components/auth/Login";
// import ForgotPassword from "../Components/auth/ForgotPassword";
// import ResetPassword from "../Components/auth/ResetPassword";

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/jobs" element={<Jobs />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="jobs/:id" element={<Jobdetail />} />
        </Route>

         {/* <Route path="/register" element={<Register />} />
          <Route path="/register/applicant" element={<RegisterApplicant />} />
          <Route path="/register/company" element={<RegisterCompany />} />
          <Route path="/verify-otp" element={<VerifyOtp />} />
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
           */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;