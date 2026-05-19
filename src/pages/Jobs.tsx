import { useEffect, useState } from "react";
import useAuth from "../hooks/useAuth";
import { CiBoxList } from "react-icons/ci";
import { IoGridOutline } from "react-icons/io5";
import Loading from "../components/Loading";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import Navbar from "../components/NavBar";
import { Link } from "react-router";

export default function Jobs() {
  const [jobs, setJobs] = useState<any[]>([]);
  const [search, setSearch] = useState<string>("");
  const [_listView, setListView] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const { isLoading, setIsLoading } = useAuth();
  const api = useAxiosPrivate();

  useEffect(() => {
    setIsLoading(true);
    fetchJobs();
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }, []);

  const fetchJobs = async () => {
    const res = await api.get("/jobs");
    setJobs(res.data.jobs || res.data);
  };

  useEffect(() => {
    if (search === "") fetchJobs();
  }, [search]);

  const handleSearch = (searchTerm?: string) => {
    const term = searchTerm ?? search;
    const filteredJobs = jobs.filter(
      (job) =>
        job.title.toLowerCase().includes(term.toLowerCase()) ||
        job.location.toLowerCase().includes(term.toLowerCase()),
    );
    setJobs(filteredJobs);
  };

  return (
    <>
      {isLoading && <Loading />}

      {!isLoading && (
        <div className="bg-[#faf8ff] text-[#131b2e]">
          {/* NAVBAR */}
          <Navbar />

          <div className="pt-16 flex min-h-screen">
            {/* SIDEBAR */}
            <aside className="hidden lg:flex flex-col w-72 p-6 bg-slate-50 border-r">
              <form className="flex flex-col">
                <h2 className="text-xl font-bold mb-4">Filters</h2>
                <label>
                  <input type="checkbox" defaultChecked /> Full-time
                </label>
                <label>
                  <input type="checkbox" /> Contract
                </label>
                <button className="bg-blue-600 text-white px-4 py-2 rounded mt-4">
                  Apply Filters
                </button>
              </form>
            </aside>

            {/* MAIN */}
            <main className="flex-1 p-6 max-w-[1280px] mx-auto">
              {/* SEARCH */}
              <div className="flex justify-self-center gap-4 min-w-[70%] bg-white p-3 rounded-xl shadow mb-6">
                <input
                  className="flex-1"
                  placeholder="Search jobs by name or location..."
                  value={search}
                  onChange={(e) => {
                    const newSearch = e.target.value;
                    setSearch(newSearch);
                    handleSearch(newSearch);
                  }}
                />
                <button
                  className="bg-blue-600 text-white px-6 rounded-lg cursor-pointer hover:bg-blue-500 hover:shadow duration-300 transition-all"
                  onClick={() => handleSearch(search)}
                >
                  Search
                </button>
              </div>

              {/* HEADER */}
              <div className="flex justify-between mb-6">
                <h1 className="text-2xl font-bold">
                  {jobs.length} {jobs.length >= 2 ? "Jobs" : "Job"} Found
                </h1>
                <div className="hidden sm:flex gap-2">
                  <button
                    className={`p-2 rounded cursor-pointer transition ${
                      _listView
                        ? "bg-blue-600 text-white shadow-md"
                        : "text-slate-500 hover:bg-blue-50"
                    }`}
                    onClick={() => setListView(true)}
                  >
                    <CiBoxList size={25} />
                  </button>
                  <button
                    className={`p-2 rounded cursor-pointer transition ${
                      !_listView
                        ? "bg-blue-600 text-white shadow-md"
                        : "text-slate-500 hover:bg-blue-50"
                    }`}
                    onClick={() => setListView(false)}
                  >
                    <IoGridOutline size={25} />
                  </button>
                </div>
              </div>

              {/* JOBS */}
              <div
                className={`grid gap-6 ${!_listView ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" : "grid-cols-1"}`}
              >
                {jobs.map((job) => (
                  <div
                    key={job._id}
                    className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
                  >
                    <div>
                      <div className="flex justify-between items-start mb-3">
                        <h3 className="font-bold text-xl text-slate-800 group-hover:text-blue-600 transition-colors">
                          {job.title}
                        </h3>
                        <span className="bg-green-100 text-green-700 text-xs font-bold px-3 py-1 rounded-full whitespace-nowrap ml-3">
                          {job.salary}
                        </span>
                      </div>
                      <p className="text-slate-600 font-medium mb-1">
                        {job.company?.name || "Unknown Company"}
                      </p>
                      <p className="text-sm text-slate-500 mb-4 flex items-center gap-1">
                        📍 {job.location}
                      </p>
                      <p className="text-sm text-slate-600 line-clamp-3 mb-4">
                        {job.description}
                      </p>
                    </div>

                    <div className="mt-auto pt-4 border-t border-slate-100">
                      <Link to={`/jobs/${job._id}`} className="block">
                        <button className="w-full bg-slate-50 text-blue-600 font-semibold px-4 py-2.5 rounded-xl cursor-pointer hover:bg-blue-600 hover:text-white transition-all duration-300">
                          View Details
                        </button>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>

              {/* PAGINATION */}
              <div className="flex justify-center mt-8 gap-2">
                <button
                  className="cursor-pointer hover:underline p-1 rounded transition-all"
                  onClick={() => setCurrentPage(currentPage - 1)}
                >
                  Prev
                </button>
                <span className="m-2">{currentPage}</span>
                <button
                  className="cursor-pointer hover:underline p-1 rounded transition-all"
                  onClick={() => setCurrentPage(currentPage + 1)}
                >
                  Next
                </button>
              </div>
            </main>
          </div>
        </div>
      )}
    </>
  );
}
