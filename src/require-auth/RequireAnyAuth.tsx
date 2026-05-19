import useAuth from "../hooks/useAuth";
import { Outlet, Navigate } from "react-router-dom";
import Loading from "../components/Loading";

const RequireAnyAuth = () => {
  const { auth, isLoading } = useAuth();

  return (
    <>
      {isLoading && <Loading />}

      {auth?.role === "jobseeker" || auth?.role === "employer" ? (
        <Outlet />
      ) : (
        <Navigate to="/login" state={{ replace: true }} />
      )}
    </>
  );
};

export default RequireAnyAuth;
