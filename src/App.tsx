import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import SignUp from "./pages/SignUp";
import Login from "./pages/Login";
import RequireAuth from "./require-auth/RequireAuth";
import RequireJobseekerAuth from "./require-auth/RequireJobseekerAuth";
import Jobs from "./pages/Jobs";
import Error from "./pages/Error";
import JobDetails from "./pages/JobDetails";
import EmployerDashboard from "./pages/EmployerDashboard";
import PostJob from "./pages/PostJob";
import Applications from "./pages/Applications";
import CompanyProfile from "./pages/CompanyProfile";
import ApplicantDashboard from "./pages/ApplicantsDashboard";
import Loading from "./components/Loading";
import ScrollTop from "./utility/scrollTop";

function App() {
  return (
    <>
      <ScrollTop />
      <Routes>
        <Route path="/">
          <Route path="/" element={<Home />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/login" element={<Login />} />
          <Route path="/loading" element={<Loading />} />
        </Route>

        {/**Employer Routes */}
        <Route element={<RequireAuth />}>
          <Route path="/dashboard" element={<EmployerDashboard />} />
          <Route path="/post-job" element={<PostJob />} />
          <Route path="/company-profile" element={<CompanyProfile />} />
          <Route path="/applicant-dashboard" element={<ApplicantDashboard />} />
        </Route>

        {/**Jobseeker Routes */}
        <Route element={<RequireJobseekerAuth />}>
          <Route path="/jobs" element={<Jobs />} />
          <Route path="/jobs/:id" element={<JobDetails />} />
          <Route path="/applications" element={<Applications />} />
        </Route>

        <Route path="*" element={<Error />} />
      </Routes>
    </>
  );
}

export default App;
