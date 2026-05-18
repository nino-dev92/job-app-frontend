import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import Navbar from "../components/NavBar";
import SideBar from "../components/SideBar";
import type { AxiosInstance } from "axios";

const PostJob = () => {
  const [title, setTitle] = useState<string>("");
  const [location, setLocation] = useState<string>("");
  const [currency, setCurrency] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [_salary, setSalary] = useState<string>("");
  const [minSalary, setMinSalary] = useState<string>("");
  const [maxSalary, setMaxSalary] = useState<string>("");
  const api: AxiosInstance = useAxiosPrivate();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!minSalary || !maxSalary) {
      alert("Please select both min and max salary");
      return;
    }
    const salaryValue = `${currency} ${minSalary} - ${currency} ${maxSalary}`;

    try {
      const response = await api.post("/jobs/create", {
        title,
        location,
        description,
        salary: salaryValue,
      });
      if (response?.status === 201) {
        handleReset();
        navigate("/dashboard"); // Redirect to dashboard after successful job posting
      }
    } catch (error: any) {
      alert(error?.response?.data.message);
      // console.log(error?.response)
      console.log("Error posting job:", error);
    }
  };

  const handleReset = () => {
    setTitle("");
    setLocation("");
    setDescription("");
    setSalary("");
    setMinSalary("");
    setMaxSalary("");
  };
  return (
    <>
      {/* Fonts & Tailwind */}
      <link
        href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Inter:wght@400;500;600&family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
        rel="stylesheet"
      />

      <title>Post a Job</title>
      <link rel="icon" type="image/png" href="../../logo.png" />

      <div className="bg-background text-on-surface font-body-md antialiased">
        {/* TopAppBar */}
        <Navbar />

        {/* Sidebar */}
        <SideBar />

        {/* Main */}
        <main className="ml-0 md:ml-64 pt-24 pb-12 px-12 max-w-7xl mx-auto">
          <div className="flex justify-between items-end mb-8">
            <div>
              <h1 className="font-bold text-on-surface mb-2 text-2xl">
                Create New Job Posting
              </h1>
              <p className="text-on-surface-variant font-body-md">
                Draft a high-quality job listing to attract the best talent.
              </p>
            </div>
          </div>

          {/* FORM CONTENT (UNCHANGED STRUCTURE) */}
          <form onSubmit={handleSubmit}>
            <div className="bg-white rounded-xl border border-slate-200 p-8 shadow-sm max-h-content">
              <h2 className="font-headline-md mb-6 flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">
                  description
                </span>
                Basic Information
              </h2>

              <div className="space-y-6">
                <div className="flex-col md:flex justify-between gap-5">
                  <div className="grow">
                    <label>Job Title</label>
                    <input
                      className="w-full px-4 py-3 bg-surface rounded-lg border border-slate-200"
                      placeholder="Job Title..."
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                    />
                  </div>
                  <div className="grow">
                    <label>Job Location</label>
                    <input
                      className="w-full px-4 py-3 bg-surface rounded-lg border border-slate-200"
                      placeholder="Location..."
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <label>Job Description</label>
                  <textarea
                    className="w-full px-4 py-4 bg-white border border-slate-200 rounded-lg"
                    placeholder="Write about the role and daily responsibilities..."
                    rows={6}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>
                <div className="flex flex-col text-center lg:flex-row lg:justify-between gap-5">
                  <div className="flex flex-col grow">
                    <label>Currency</label>
                    <select
                      value={currency}
                      className="px-4 py-3 bg-surface rounded-lg border"
                      onChange={(e) => setCurrency(e.target.value)}
                    >
                      <option value="-">Select Currency</option>
                      <option value="$">USD</option>
                      <option value="N">NAIRA</option>
                    </select>
                  </div>
                  <div className="flex flex-col grow">
                    <label>Min Salary</label>
                    <select
                      className="px-4 py-3 bg-surface rounded-lg border"
                      value={minSalary}
                      onChange={(e) => setMinSalary(e.target.value)}
                    >
                      <option value="-">Select Min Salary</option>
                      <option value="30,000">30,000 - 50,000</option>
                      <option value="50,000">50,000 - 70,000</option>
                      <option value="70,000">70,000 - 100,000</option>
                      <option value="100,000">100,000 - 200,000</option>
                      <option value="300,000">300,000 - 400,000</option>
                    </select>
                  </div>
                  <div className="flex flex-col grow">
                    <label>Max Salary</label>
                    <select
                      className="px-4 py-3 bg-surface rounded-lg border"
                      value={maxSalary}
                      onChange={(e) => setMaxSalary(e.target.value)}
                    >
                      <option value="-">Select Max Salary </option>
                      <option value="70,000">50,000 - 70,000</option>
                      <option value="100,000">70,000 - 100,000</option>
                      <option value="300,000">100,000 - 300,000</option>
                      <option value="500,000">300,000 - 500,000</option>
                      <option value="700,000">500,000 - 700,000</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 justify-center md:justify-end mt-15">
                <button
                  type="button"
                  onClick={handleReset}
                  className="cursor-pointer px-6 py-2 border border-slate-200 rounded-xl font-label-md hover:bg-red-400 transition-all bg-red-500 text-white"
                >
                  Reset
                </button>
                <button
                  className="cursor-pointer px-6 py-2 bg-blue-600 text-white rounded-xl font-label-md hover:bg-blue-500 transition-all"
                  type="submit"
                >
                  Post Job
                </button>
              </div>
            </div>
          </form>
        </main>
      </div>
    </>
  );
};

export default PostJob;
