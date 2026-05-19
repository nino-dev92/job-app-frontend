import { Link, NavLink, useNavigate } from "react-router-dom";
import "../styles/loginNav.css";
import useAuth from "../hooks/useAuth";
import { useState } from "react";
import { FaPowerOff } from "react-icons/fa";
import { CgMenuGridO } from "react-icons/cg";
import { MdFactCheck, MdOutlineAnalytics, MdDashboard } from "react-icons/md";
import { IoIosBriefcase } from "react-icons/io";
import { FaPeopleGroup } from "react-icons/fa6";
import { TbMessages } from "react-icons/tb";

const Navbar = () => {
  const { auth, setAuth } = useAuth();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const showMenu = () => {
    setOpen(!open);
  };

  const handleLogout = () => {
    setAuth(null);
    sessionStorage.removeItem("auth");
    navigate("/login");
  };

  return (
    <>
      {/** Not Logged in Nav */}
      {!auth && (
        <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-slate-200 shadow-sm">
          <div className="flex justify-between items-center h-16 px-6 max-w-7xl mx-auto">
            <div className="text-xl font-bold text-blue-600">
              <Link to="/">TalentHub</Link>
            </div>

            <div className="flex items-center gap-4">
              <NavLink
                to="/login"
                className="text-slate-600 font-semibold hover:text-blue-600 transition"
              >
                Log In
              </NavLink>
              <NavLink
                to="/signup"
                className="text-slate-600 px-6 py-2 font-semibold hover:text-blue-600 transition"
              >
                Sign Up
              </NavLink>
            </div>
          </div>
        </nav>
      )}

      {/** Employer Nav */}
      {auth?.role == "employer" && (
        <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-slate-200 shadow-sm h-16 flex items-center justify-between px-6">
          <div className="flex items-center gap-6 max-w-7xl mx-auto w-full">
            <CgMenuGridO
              size={25}
              className="md:hidden cursor-pointer hover:text-blue-500"
              onClick={showMenu}
            />
            <h1 className="font-bold text-blue-600 text-xl">TalentHub</h1>
            <div className="hidden md:flex text-slate-600 gap-4">
              <Link
                to="/dashboard"
                className="font-normal text-slate-600 text-md active:font-bold"
              >
                Dashboard
              </Link>
              <Link
                to="/messages"
                className="font-normal text-slate-600 text-md hover:text-blue-500 cursor-pointer transition-all active:text-blue-600 active:font-bold"
              >
                Messages
              </Link>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-10">
            <button className="bg-blue-600 text-white px-4 py-2 rounded cursor-pointer hover:bg-blue-500 transition">
              <Link to="/post-job">Post a Job</Link>
            </button>
            <button
              onClick={handleLogout}
              className="text-slate-600 cursor-pointer font-semibold hover:text-blue-600 hover:scale-120 transition-all"
              title="logout"
            >
              <FaPowerOff size={23} />
            </button>
          </div>
        </nav>
      )}

      {/* * Employer MobileNav */}
      {auth?.role == "employer" && (
        <aside
          className={`fixed left-0 top-0 bottom-0 w-[35%] ${open ? "translate-x-0" : "-translate-x-85"} border-r border-slate-200 bg-white flex flex-col items-center py-4 lg:hidden z-10 transition-all duration-500 ease`}
        >
          <div className="fixed top-16 left-0 w-60 h-full bg-white border-r p-4">
            <nav className="space-y-2 flex flex-col gap-3">
              <div className="flex">
                <MdFactCheck size={30} className="inline mr-2 text-blue-600" />
                <p className="font-semibold text-lg mb-5">
                  Employer Portal
                  <span className="block font-normal text-sm">
                    Manage your talent
                  </span>
                </p>
              </div>
              <div className="flex flex-col gap-3">
                <NavLink
                  to="/dashboard"
                  className="flex items-center hover:text-blue-600"
                >
                  <MdDashboard size={30} className="inline mr-2" />
                  <p>Dashboard</p>
                </NavLink>
                <NavLink
                  to="/messages"
                  className="flex items-center hover:text-blue-600"
                >
                  <TbMessages size={30} className="inline mr-2" />
                  Messages
                </NavLink>
              </div>
              <NavLink
                to="/post-job"
                className="flex items-center hover:text-blue-600"
              >
                <IoIosBriefcase size={30} className="inline mr-2" />
                <p className="cursor-pointer">Job postings</p>
              </NavLink>
              <div className="flex items-center hover:text-blue-600">
                <FaPeopleGroup size={30} className="inline mr-2" />
                <NavLink to="/applicant-dashboard" className="cursor-pointer">
                  Applications
                </NavLink>
              </div>
              <NavLink to="/analytics" className="flex items-center hover:text-blue-600">
                <MdOutlineAnalytics size={30} className="inline mr-2" />
                <p className="cursor-pointer">Analytics</p>
              </NavLink>
              <div className="flex items-center hover:text-blue-600">
                <MdFactCheck size={30} className="inline mr-2" />
                <NavLink to="/company-profile" className="cursor-pointer">
                  Company Profile
                </NavLink>
              </div>
              <div className="flex justify-center mt-30">
                <button
                  onClick={handleLogout}
                  className="text-slate-600 cursor-pointer font-semibold hover:text-blue-600 hover:scale-120 transition-all"
                  title="logout"
                >
                  <FaPowerOff size={23} />
                </button>
              </div>
            </nav>
          </div>
        </aside>
      )}

      {/** Jobseeker Nav */}
      {auth?.role == "jobseeker" && (
        <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-slate-200 shadow-sm">
          <div className="flex justify-between items-center h-16 px-6 max-w-7xl mx-auto">
            <CgMenuGridO
              size={25}
              className="md:hidden cursor-pointer hover:text-blue-500"
              onClick={showMenu}
            />
            <div className="text-xl font-bold text-blue-600">
              <Link to="/">TalentHub</Link>
            </div>

            <div className="hidden md:flex items-center gap-10">
              <div className="space-x-4 hidden sm:flex">
                <NavLink
                  to="/jobs"
                  className="text-slate-600 font-semibold hover:text-blue-600 transition-all"
                >
                  Jobs
                </NavLink>
                <NavLink
                  to="/messages"
                  className="text-slate-600 font-semibold hover:text-blue-600 transition-all"
                >
                  Messages
                </NavLink>
                <NavLink
                  to="/applications"
                  className="text-slate-600 font-semibold hover:text-blue-600 transition-all"
                >
                  My Applications
                </NavLink>
              </div>
              <button
                onClick={handleLogout}
                className="text-slate-600 cursor-pointer font-semibold hover:text-blue-600 hover:scale-120 transition-all"
                title="logout"
              >
                <FaPowerOff size={23} />
              </button>
            </div>
          </div>
        </nav>
      )}

      {/** Jobseeker MobileNav */}
      {auth?.role == "jobseeker" && (
        <aside
          className={`fixed left-0 top-0 bottom-0 w-[35%] ${open ? "translate-x-0" : "-translate-x-85"} border-r border-slate-200 bg-white flex flex-col items-center py-4 lg:hidden z-10 transition-all duration-400 ease`}
        >
          <nav className="mt-30">
            <div className="flex flex-col items-center gap-70">
              <div className="space-x-4 flex flex-col gap-10 text-center">
                <NavLink
                  to="/jobs"
                  className="text-slate-600 font-semibold hover:text-blue-600 transition-all"
                >
                  Jobs
                </NavLink>
                <NavLink
                  to="/messages"
                  className="text-slate-600 font-semibold hover:text-blue-600 transition-all"
                >
                  Messages
                </NavLink>
                <NavLink
                  to="/"
                  className="text-slate-600 font-semibold hover:text-blue-600 transition-all"
                >
                  Search Jobs
                </NavLink>
                <NavLink
                  to="/applications"
                  className="text-slate-600 font-semibold hover:text-blue-600 transition-all"
                >
                  My Applications
                </NavLink>
              </div>
              <div className="justify-end">
                <button
                  onClick={handleLogout}
                  className="text-slate-600 cursor-pointer font-semibold hover:text-blue-600 hover:scale-120 transition-all"
                  title="logout"
                >
                  <FaPowerOff size={23} />
                </button>
              </div>
            </div>
          </nav>
        </aside>
      )}
    </>
  );
};

export default Navbar;
