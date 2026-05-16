import useAuth from "../hooks/useAuth";
import { Outlet, Navigate } from "react-router-dom";
import Loading from "../components/Loading";

const RequireJobseekerAuth = () => {
  const { auth, isLoading } = useAuth();

  return (
    <>
      {isLoading && <Loading />}

      {auth?.role === "jobseeker" ? (
        <Outlet />
      ) : (
        <Navigate to="/login" state={{ replace: true }} />
      )}
    </>
  );
};

export default RequireJobseekerAuth;
