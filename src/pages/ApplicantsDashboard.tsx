import { useState, useEffect } from "react";
import useAuth from "../hooks/useAuth";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import Navbar from "../components/NavBar";
import SideBar from "../components/SideBar";

const ApplicantDashboard: React.FC = () => {
  const [applications, setApplications] = useState<any>();
  const [selectedApplication, setSelectedApplication] = useState<any>();
  const { setIsLoading } = useAuth();
  const api = useAxiosPrivate();

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      setIsLoading(true);
      const response = await api.get("/applications/applicants");
      setApplications(response?.data?.applications);
    } catch (error: any) {
      console.log(error.response.message);
    } finally {
      setIsLoading(false);
    }
  };

  const updateStatus = async (id: string, status: string) => {
    await api.patch(`/applications/${id}/status`, { status });

    // refresh
    fetchApplications();
  };

  return (
    <div className="bg-background font-body-md text-on-background">
      <title>Applications</title>

      {/** TopNav */}
      <Navbar />

      {/* Sidebar */}
      <SideBar />

      {/* Main */}
      <main className="ml-0 md:ml-60 pt-20 p-6 space-y-6">
        {/* Header */}
        {applications && (
          <div className="p-8 flex gap-8">
            {/* Table */}
            <div className="flex-1">
              <h1 className="text-3xl font-bold mb-6">Applications</h1>
              <div className="bg-white rounded-2xl border overflow-hidden">
                <table className="w-full">
                  <thead className="bg-slate-50 text-left">
                    <tr>
                      <th className="p-4">Candidate</th>
                      <th className="p-4">Job</th>
                      <th className="p-4">Applied</th>
                      <th className="p-4">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {applications.map((applicant: any, index: any) => (
                      <tr
                        key={index}
                        className="cursor-pointer border-1 hover:border-blue-500 hover:bg-blue-400 hover:text-white"
                        onClick={() => {
                          setSelectedApplication(applicant);
                          console.log(selectedApplication);
                        }}
                      >
                        <td className="p-4 flex items-center gap-3">
                          {applicant.user.name.toUpperCase()}
                        </td>
                        <td className="p-4">{applicant.job.title}</td>
                        <td className="p-4">{applicant.createdAt}</td>
                        <td className="p-4">{applicant.status}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            {/* Sidebar Profile */}
            {selectedApplication && (
              <aside className="w-80 bg-white rounded-2xl border p-6 flex flex-col gap-3">
                <div className="text-center">
                  <p className="text-xl">
                    {selectedApplication.user.name.toUpperCase()}
                  </p>
                  <p className="text-l">{selectedApplication.user.email}</p>
                </div>

                {selectedApplication.status !== "accepted" &&
                  selectedApplication.status !== "rejected" && (
                    <div className="flex gap-3 text-white">
                      <button
                        className="w-full border bg-green-500 hover:bg-green-400 py-3 cursor-pointer rounded-xl active:scale-103"
                        onClick={() => {
                          updateStatus(selectedApplication._id, "accepted");
                          console.log(selectedApplication);
                        }}
                      >
                        Accept
                      </button>
                      <button
                        className="w-full border bg-red-500 hover:bg-red-400 py-3 cursor-pointer rounded-xl active:scale-103"
                        onClick={() =>
                          updateStatus(selectedApplication._id, "rejected")
                        }
                      >
                        Reject
                      </button>
                    </div>
                  )}

                {selectedApplication.status !== "pending" && (
                  <p
                    className={`text-center ${selectedApplication.status == "accepted" ? "text-green-500" : "text-red-500"}`}
                  >
                    {selectedApplication.status.toUpperCase()}
                  </p>
                )}
              </aside>
            )}
          </div>
        )}

        {!applications && (
          <div className="p-8 flex gap-8">
            <div className="flex-1">
              <h1 className="text-3xl font-bold mb-6">Applications</h1>
              <p>You currently have no applicants.</p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default ApplicantDashboard;
