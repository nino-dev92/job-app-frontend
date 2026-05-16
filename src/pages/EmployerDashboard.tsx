import { useEffect, useState } from "react";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import useAuth from "../hooks/useAuth";
import Loading from "../components/Loading";
import Navbar from "../components/NavBar";
import SideBar from "../components/SideBar";

export default function EmployerDashboard() {
  const [jobs, setJobs] = useState<any[]>([]);
  const [selectedJob, setSelectedJob] = useState<string | null>(null);
  const [applications, setApplications] = useState<any[]>([]);
  const api = useAxiosPrivate();
  const { auth, isLoading, setIsLoading } = useAuth();

  useEffect(() => {
    if (!auth?.username) return;
    setIsLoading(true);

    fetchJobs();

    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }, [auth]);

  const fetchJobs = async () => {
    if (!auth?.username) return;
    const res = await api.get("/jobs");
    setJobs(res.data.jobs || res.data);
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
                Good Morning, {auth?.username?.toUpperCase()}
              </h2>
              <p className="text-slate-500">Here's what's happening today.</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white p-4 rounded shadow hover:scale-105 transition-all cursor-pointer duration-300">
                <p className="text-sm text-slate-500">Applicants</p>
                <h3 className="text-xl font-bold">1,284</h3>
              </div>
              <div className="bg-white p-4 rounded shadow  hover:scale-105 transition-all cursor-pointer duration-300">
                <p className="text-sm text-slate-500">Jobs</p>
                <h3 className="text-xl font-bold">{jobs.length}</h3>
              </div>
              <div className="bg-white p-4 rounded shadow hover:scale-105 transition-all cursor-pointer duration-300">
                <p className="text-sm text-slate-500">Interviews</p>
                <h3 className="text-xl font-bold">12</h3>
              </div>
              <div className="bg-white p-4 rounded shadow hover:scale-105 transition-all cursor-pointer duration-300">
                <p className="text-sm text-slate-500">Messages</p>
                <h3 className="text-xl font-bold">48</h3>
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
                          className="text-blue-600 text-sm cursor-pointer border-1 p-1 rounded hover:bg-blue-600 hover:text-white"
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

              {applications.map((a, i) => (
                <div
                  key={i}
                  className="flex justify-between items-center py-2 border-b last:border-none"
                >
                  <div>
                    <p className="font-medium">{a.user.name.toUpperCase()}</p>
                    <p className="text-sm text-slate-500">{a.user.email}</p>
                  </div>
                  <a
                    href={a.cvUrl}
                    target="_blank"
                    className="text-blue-600 text-sm hover:underline"
                  >
                    View CV
                  </a>

                  <p>Status: {a.status}</p>
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
            </div>
          </main>
        </div>
      )}
    </>
  );
}
