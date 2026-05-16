import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import Navbar from "../components/NavBar";
import Loading from "../components/Loading";

const Applications = () => {
  const [applications, setApplications] = useState<any[]>([]);
  const { auth, isLoading, setIsLoading } = useAuth();
  const api = useAxiosPrivate();
  const navigate = useNavigate();

  useEffect(() => {
    if (!auth?.username) return;

    const loadApplications = async () => {
      try {
        setIsLoading(true);
        await fetchApplications();
      } finally {
        setIsLoading(false);
      }
    };

    loadApplications();
  }, [auth?.username, setIsLoading]);

  const fetchApplications = async () => {
    try {
      const response = await api.get("/applications/me");
      setApplications(response.data);
    } catch (error) {
      console.error("Error fetching applications:", error);
    }
  };

  const handleViewDetails = (jobId: string) => {
    navigate(`/jobs/${jobId}`);
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <>
      <title>Applications</title>
      <link rel="icon" type="image/png" href="../../logo.png" />

      {isLoading && <Loading />}
      {!isLoading && (
        <>
          {/** Top Nav */}
          <Navbar />

          {/** Main Content */}
          <main className="min-h-screen bg-slate-50 text-slate-900 mt-16 p-5">
            <h1 className="text-center text-3xl font-bold">My Applications</h1>

            {applications.length === 0 ? (
              <div>
                <p className="text-center mt-8 text-xl">
                  You have not applied to any jobs yet.
                </p>
                <button
                  className="border-1 p-2 cursor-pointer rounded hover:bg-blue-500 block mx-auto mt-4"
                  onClick={handleGoBack}
                >
                  Go Back
                </button>
              </div>
            ) : (
              <div className="space-y-5 mt-5 flex flex-col items-center">
                {applications.map((app, index) => (
                  <div
                    className="border-1 rounded p-5 flex justify-between min-w-3xl min-h-40 items-center bg-white shadow"
                    key={index}
                  >
                    <div>
                      <p>Title: {app.job.title.toUpperCase()}</p>
                      <p>Location: {app.job.location}</p>
                      <p>Salary: {app.job.salary}</p>
                      <p>Status: {app.status}</p>
                    </div>
                    <div className="mt-5">
                      <button
                        className="bg-blue-600 text-white px-4 py-2 rounded cursor-pointer hover:bg-blue-500 hover:scale-105 duration-300 transition-all"
                        onClick={() => handleViewDetails(app.job._id)}
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </main>
        </>
      )}
    </>
  );
};

export default Applications;
