import { useEffect, useState } from "react";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import useAuth from "../hooks/useAuth";
import Loading from "../components/Loading";
import Navbar from "../components/NavBar";
import SideBar from "../components/SideBar";
import { Link } from "react-router-dom";
import { FaMessage } from "react-icons/fa6";

export default function EmployerDashboard() {
  const [jobs, setJobs] = useState<any[]>([]);
  const [selectedJob, setSelectedJob] = useState<string | null>(null);
  const [applications, setApplications] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const api = useAxiosPrivate();
  const { auth, isLoading, setIsLoading } = useAuth();

  useEffect(() => {
    if (!auth?.username) return;
    setIsLoading(true);

    fetchJobs();
    fetchStats();

    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }, [auth]);

  const fetchJobs = async () => {
    if (!auth?.username) return;
    const res = await api.get("/jobs");
    setJobs(res.data.jobs || res.data);
  };

  const fetchStats = async () => {
    try {
      const res = await api.get("/analytics");
      setStats(res.data.summary);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchApplications = async (jobId: string) => {
    setSelectedJob(jobId);

    const res = await api.get(`/applications/job/${jobId}`);
    setApplications(res.data);
  };

  const updateStatus = async (id: string, status: string) => {
    await api.patch(`/applications/${id}/status`, { status });

    // refresh
    const res = await api.get(`/applications/job/${selectedJob}`);
    setApplications(res.data);
  };

  return (
    <>
      <title>Dashboard</title>
      <link rel="icon" type="image/png" href="../../logo.png" />

      {isLoading && <Loading />}
      {!isLoading && (
        <div className="min-h-screen bg-slate-50 text-slate-900">
          {/* Top Bar */}
          <Navbar />

          {/* Sidebar */}
          <SideBar />

          {/* Main */}
          <main className="ml-0 md:ml-60 pt-20 p-6 space-y-6">
            {/* Header */}
            <div>
              <h2 className="text-2xl font-bold">
                Welcome, {auth?.username?.toUpperCase()}
              </h2>
              <p className="text-slate-500">Here's what's happening today.</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white p-4 rounded shadow hover:scale-105 transition-all cursor-pointer duration-300">
                <p className="text-sm text-slate-500">Applicants</p>
                <h3 className="text-xl font-bold">{stats?.totalApplications || 0}</h3>
              </div>
              <div className="bg-white p-4 rounded shadow  hover:scale-105 transition-all cursor-pointer duration-300">
                <p className="text-sm text-slate-500">Jobs</p>
                <h3 className="text-xl font-bold">{jobs.length}</h3>
              </div>
              <div className="bg-white p-4 rounded shadow hover:scale-105 transition-all cursor-pointer duration-300">
                <p className="text-sm text-slate-500">Hire Rate</p>
                <h3 className="text-xl font-bold">{stats?.hireRate || 0}%</h3>
              </div>
              <div className="bg-white p-4 rounded shadow hover:scale-105 transition-all cursor-pointer duration-300">
                <p className="text-sm text-slate-500">Accepted</p>
                <h3 className="text-xl font-bold">{stats?.accepted || 0}</h3>
              </div>
            </div>

            {/* Jobs Table */}
            <div className="bg-white rounded shadow">
              <div className="p-4 border-b font-semibold">
                Active Job Postings
              </div>

              <table className="w-full text-left">
                <thead className="bg-blue-400 text-sm">
                  <tr>
                    <th className="p-3">Title</th>
                    <th className="p-3">Location</th>
                    <th className="p-3">Applicants</th>
                  </tr>
                </thead>
                <tbody>
                  {jobs.map((job, i) => (
                    <tr key={i} className="border-t">
                      <td className="p-3">{job.title}</td>
                      <td className="p-3">{job.location}</td>
                      <td className="p-3">
                        <button
                          className="text-blue-600 text-sm cursor-pointer border p-1 rounded hover:bg-blue-600 hover:text-white"
                          onClick={() => {
                            fetchApplications(job._id);
                          }}
                        >
                          View Applicants
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Candidates */}
            <div className="bg-white rounded shadow p-4">
              <h3 className="font-semibold mb-3">Recent Applications</h3>

              {selectedJob &&
                applications.map((a, i) => (
                  <div
                    key={i}
                    className="flex justify-between items-center py-2 border-b last:border-none"
                  >
                    <div>
                      <p className="font-medium">{a.user.name.toUpperCase()}</p>
                      <p className="hidden md:inline text-slate-500">
                        {a.user.email}
                      </p>
                    </div>
                    <a
                      href={a.cvUrl}
                      target="_blank"
                      className="text-blue-600 text-sm hover:underline"
                    >
                      View CV
                    </a>

                    <p>
                      <span className="hidden md:block">Status: </span>
                      {a.status}
                    </p>
                    <Link to={`/messages/${a.user._id}?jobId=${selectedJob}`}>
                      <FaMessage
                        size={20}
                        className="inline text-blue-500 cursor-pointer"
                        title="send a message"
                      />
                    </Link>
                    <div className="flex gap-3">
                      {a.status !== "accepted" && a.status !== "rejected" && (
                        <>
                          <button
                            className="bg-green-500 text-white px-4 py-2 rounded cursor-pointer hover:bg-green-600 transition"
                            onClick={() => updateStatus(a._id, "accepted")}
                          >
                            Accept
                          </button>
                          <button
                            className="bg-red-500 text-white px-4 py-2 rounded cursor-pointer hover:bg-red-600 transition"
                            onClick={() => updateStatus(a._id, "rejected")}
                          >
                            Reject
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                ))}

              {selectedJob && !applications.length && (
                <p className="text-center">No application available</p>
              )}
            </div>
          </main>
        </div>
      )}
    </>
  );
}
