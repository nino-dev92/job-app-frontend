import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import Navbar from "../components/NavBar";
import Loading from "../components/Loading";
import { FaMessage } from "react-icons/fa6";

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
                  className="border p-2 cursor-pointer rounded hover:bg-blue-500 block mx-auto mt-4"
                  onClick={handleGoBack}
                >
                  Go Back
                </button>
              </div>
            ) : (
              <div className="grid gap-6 mt-8 max-w-4xl mx-auto">
                {applications.map((app, index) => {
                  // Determine status badge color
                  let statusColor = "bg-slate-100 text-slate-700 border-slate-200";
                  if (app.status.toLowerCase() === "accepted") {
                    statusColor = "bg-green-100 text-green-700 border-green-200";
                  } else if (app.status.toLowerCase() === "rejected") {
                    statusColor = "bg-red-100 text-red-700 border-red-200";
                  } else if (app.status.toLowerCase() === "pending") {
                    statusColor = "bg-yellow-100 text-yellow-700 border-yellow-200";
                  }

                  return (
                    <div
                      className="border border-slate-200 rounded-2xl p-6 flex flex-col md:flex-row justify-between items-start md:items-center bg-white shadow-sm hover:shadow-md transition-shadow gap-6"
                      key={index}
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-bold text-xl text-slate-800">
                            {app.job.title}
                          </h3>
                          <span className={`px-3 py-1 rounded-full text-xs font-bold border uppercase tracking-wider ${statusColor}`}>
                            {app.status}
                          </span>
                        </div>
                        <p className="text-slate-600 font-medium mb-1">
                          {app.job.company?.name || "Unknown Company"}
                        </p>
                        <div className="flex gap-4 text-sm text-slate-500 mt-3">
                          <span className="flex items-center gap-1">📍 {app.job.location}</span>
                          <span className="flex items-center gap-1">💰 {app.job.salary}</span>
                        </div>
                      </div>
                      
                      <div className="flex flex-row md:flex-col items-center gap-3 w-full md:w-auto">
                        <button
                          className="flex-1 md:w-full bg-blue-50 text-blue-700 font-semibold px-6 py-2.5 rounded-xl hover:bg-blue-100 transition-colors"
                          onClick={() => handleViewDetails(app.job._id)}
                        >
                          View Job
                        </button>
                        <Link to={`/messages/${app.job.createdBy}?jobId=${app.job._id}`} className="flex-1 md:w-full">
                          <button className="w-full flex items-center justify-center gap-2 bg-white border border-slate-300 text-slate-700 font-semibold px-6 py-2.5 rounded-xl hover:bg-slate-50 transition-colors shadow-sm">
                            <FaMessage size={16} className="text-blue-500" />
                            Message
                          </button>
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </main>
        </>
      )}
    </>
  );
};

export default Applications;
