import { useEffect, useState } from "react";
import useAuth from "../hooks/useAuth";
import { CiBoxList } from "react-icons/ci";
import { IoGridOutline } from "react-icons/io5";
import Loading from "../components/Loading";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import Navbar from "../components/NavBar";
import { FiSearch, FiMapPin } from "react-icons/fi";
import { Link, useSearchParams } from "react-router-dom";

export default function Jobs() {
  const [searchParams, setSearchParams] = useSearchParams();
  const searchParam = searchParams.get("search") || "";
  const locationParam = searchParams.get("location") || "";
  const [jobs, setJobs] = useState<any[]>([]);
  const [search, setSearch] = useState<string>(searchParam);
  const [location, setLocation] = useState<string>(locationParam);
  const [_listView, setListView] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const { isLoading, setIsLoading } = useAuth();
  const api = useAxiosPrivate();

  useEffect(() => {
    fetchJobs();
  }, [currentPage, searchParam, locationParam]);

  const fetchJobs = async () => {
    try {
      setIsLoading(true);
      const res = await api.get("/jobs", {
        params: {
          search: searchParam,
          location: locationParam,
          page: currentPage,
          limit: 6
        }
      });
      setJobs(res.data.jobs || []);
      setTotalPages(res.data.pages || 1);
    } catch (err) {
      console.error(err);
    } finally {
      setTimeout(() => setIsLoading(false), 500);
    }
  };

  const handleSearch = () => {
    const newParams = new URLSearchParams();
    if (search) newParams.set("search", search);
    if (location) newParams.set("location", location);
    setSearchParams(newParams);
    setCurrentPage(1);
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
              <div className="flex flex-col lg:flex-row justify-self-center gap-4 w-full bg-white p-3 rounded-xl shadow-lg mb-8 border border-slate-100">
                <div className="flex-1 flex items-center px-4 py-2 border-b lg:border-b-0 lg:border-r border-slate-50">
                  <FiSearch className="text-slate-400 mr-3" />
                  <input
                    className="w-full outline-none text-slate-700 font-medium"
                    placeholder="Search title, skills..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>
                <div className="flex-1 flex items-center px-4 py-2">
                  <FiMapPin className="text-slate-400 mr-3" />
                  <input
                    className="w-full outline-none text-slate-700 font-medium"
                    placeholder="Location..."
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                  />
                </div>
                <button
                  className="bg-blue-600 text-white px-8 py-3 rounded-lg font-bold cursor-pointer hover:bg-blue-700 hover:shadow-lg transition-all duration-300"
                  onClick={handleSearch}
                >
                  Find Jobs
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
              {totalPages > 1 && (
                <div className="flex justify-center mt-12 gap-3 items-center">
                  <button
                    disabled={currentPage === 1}
                    className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-slate-600 font-semibold disabled:opacity-50 hover:bg-slate-50 transition-colors cursor-pointer"
                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  >
                    Previous
                  </button>
                  <div className="flex gap-2">
                    {[...Array(totalPages)].map((_, i) => (
                      <button
                        key={i}
                        className={`w-10 h-10 rounded-lg font-bold transition-all ${
                          currentPage === i + 1
                            ? "bg-blue-600 text-white"
                            : "bg-white text-slate-600 border border-slate-200 hover:border-blue-300"
                        }`}
                        onClick={() => setCurrentPage(i + 1)}
                      >
                        {i + 1}
                      </button>
                    ))}
                  </div>
                  <button
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-slate-600 font-semibold disabled:opacity-50 hover:bg-slate-50 transition-colors cursor-pointer"
                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                  >
                    Next
                  </button>
                </div>
              )}
            </main>
          </div>
        </div>
      )}
    </>
  );
}
