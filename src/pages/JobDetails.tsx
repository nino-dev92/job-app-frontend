import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import useAuth from "../hooks/useAuth";
import Loading from "../components/Loading";
import Navbar from "../components/NavBar";

const JobDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState<any>(null);
  const [file, setFile] = useState<File | null>(null);
  const [message, setMessage] = useState("");
  const [hasApplied, setHasApplied] = useState(false);
  const { auth, isLoading, setIsLoading } = useAuth();
  const api = useAxiosPrivate();

  useEffect(() => {
    const fetchJob = async () => {
      try {
        setIsLoading(true);
        const res = await api.get(`/jobs/${id}`);
        setJob(res.data);

        // 👇 check if user already applied
        const applicationResponse = await api.get("/applications/me");
        const applied = applicationResponse.data.some(
          (app: any) => app.job._id === id,
        );
        setHasApplied(applied);
      } catch (err) {
        console.error("Error fetching job:", err);
        setJob(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchJob();
  }, [id, api, setIsLoading]);

  const handleApply = async () => {
    if (!file) {
      setMessage("Please upload your CV");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("cv", file);

      const res = await api.post(`/jobs/apply/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setHasApplied(true);
      setMessage(res.data.message);
    } catch (err: any) {
      setMessage(err.response?.data?.message || "Error applying");
    }
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  return isLoading ? (
    <Loading />
  ) : job ? (
    <main className="bg-slate-50 text-slate-900 flex items-center justify-center min-h-screen">
      {/** Navbar */}
      <Navbar />

      {/** Main */}

      <div className="place-items-center flex flex-col gap-3 border border-blue-600 bg-white mt-16 p-6 min-w-2xl mx-auto rounded-lg shadow">
        <h1>Job Title: {job.title}</h1>
        <p>Company: {job.company.name}</p>
        <p>Location: {job.location}</p>
        <p className="max-w-xl text-center">Description: {job.description}</p>
        <p>Salary: {job.salary}</p>

        {/* Only show apply for jobseekers */}
        {auth?.role === "jobseeker" && (
          <div className="p-2 text-center mt-4">
            {hasApplied ? (
              <>
                "✅ You have already applied"
                <div>
                  <button
                    className="border-1 p-2 cursor-pointer rounded hover:bg-blue-500 block mx-auto mt-4"
                    onClick={handleGoBack}
                  >
                    Go Back
                  </button>
                </div>
              </>
            ) : (
              <>
                <p className="mb-2">Upload your CV to apply:</p>
                <input
                  type="file"
                  className="border-1 cursor-pointer p-2"
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                />
                <button
                  className="border-1 p-2 cursor-pointer rounded hover:bg-green-500"
                  onClick={handleApply}
                >
                  Apply
                </button>
              </>
            )}
          </div>
        )}

        {message && <p>{message}</p>}
      </div>
    </main>
  ) : (
    <div className="mt-20">
      <Navbar />
      <p className="text-center">Job not found</p>
      <div>
        <button
          className="border-1 p-2 cursor-pointer rounded hover:bg-blue-500 block mx-auto mt-4"
          onClick={handleGoBack}
        >
          Go Back
        </button>
      </div>
    </div>
  );
};

export default JobDetails;
