import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import useAuth from "../hooks/useAuth";
import Loading from "../components/Loading";
import Navbar from "../components/NavBar";
import { Toaster, toast } from "sonner";

const JobDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState<any>(null);
  const [file, setFile] = useState<File | null>(null);
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
      toast.error("Please upload your CV");
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
      toast.success(res.data.message);
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Error applying");
    }
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  return isLoading ? (
    <Loading />
  ) : job ? (
    <main className="bg-slate-50 text-slate-900 min-h-screen pb-20">
      {/** Navbar */}
      <Navbar />

      {/** Toaster */}
      <Toaster position="top-right" richColors />

      {/** Main */}
      <div className="max-w-4xl mx-auto mt-24 px-4">
        {/* Header Banner */}
        <div className="bg-blue-600 rounded-t-2xl p-8 text-white shadow-lg relative overflow-hidden">
          {/* Decorative background element */}
          <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-white opacity-10"></div>
          
          <h1 className="text-3xl md:text-4xl font-bold mb-2 relative z-10">{job.title}</h1>
          <p className="text-blue-100 text-lg relative z-10">{job.company?.name || "Unknown Company"}</p>
          <div className="flex flex-wrap gap-3 mt-6 relative z-10">
            <span className="bg-white/20 px-4 py-1.5 rounded-full text-sm font-medium backdrop-blur-md border border-white/30">
              📍 {job.location}
            </span>
            <span className="bg-green-500 text-white px-4 py-1.5 rounded-full text-sm font-bold shadow-md">
              {job.salary}
            </span>
          </div>
        </div>

        <div className="bg-white rounded-b-2xl p-6 md:p-10 shadow-lg border border-slate-100">
          <h2 className="text-2xl font-bold text-slate-800 mb-4">Job Description</h2>
          <p className="text-slate-600 whitespace-pre-wrap leading-relaxed text-lg">{job.description}</p>

          {/* Only show apply for jobseekers */}
          {auth?.role === "jobseeker" && (
            <div className="mt-10 p-6 bg-slate-50 rounded-2xl border border-slate-200">
              {hasApplied ? (
                <div className="text-center">
                  <div className="inline-block bg-green-100 text-green-700 font-bold px-4 py-2 rounded-full mb-6">
                    ✅ You have already applied
                  </div>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <button
                      className="bg-white border border-slate-300 text-slate-700 px-6 py-2.5 rounded-xl hover:bg-slate-100 transition-colors font-medium shadow-sm"
                      onClick={handleGoBack}
                    >
                      🔙 Go Back
                    </button>
                    <Link to={`/messages/${job.createdBy}?jobId=${job._id}`}>
                      <button className="w-full sm:w-auto bg-blue-600 text-white px-6 py-2.5 rounded-xl hover:bg-blue-700 transition-colors font-medium shadow-md">
                        💬 Send Message
                      </button>
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center">
                  <h3 className="font-semibold text-lg mb-4 text-slate-800">Ready to apply?</h3>
                  <div className="flex flex-col sm:flex-row w-full max-w-lg gap-4 items-center">
                    <input
                      type="file"
                      className="flex-1 w-full border border-slate-300 bg-white rounded-xl p-2.5 text-sm file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 transition"
                      onChange={(e) => setFile(e.target.files?.[0] || null)}
                    />
                    <button
                      className="w-full sm:w-auto bg-green-500 text-white px-8 py-3 rounded-xl cursor-pointer hover:bg-green-600 shadow-md transition-all font-bold"
                      onClick={handleApply}
                    >
                      Apply Now
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </main>
  ) : (
    <div className="mt-20">
      <Navbar />
      <p className="text-center">Job not found</p>
      <div>
        <button
          className="border p-2 cursor-pointer rounded hover:bg-blue-500 block mx-auto mt-4"
          onClick={handleGoBack}
        >
          Go Back
        </button>
      </div>
    </div>
  );
};

export default JobDetails;
