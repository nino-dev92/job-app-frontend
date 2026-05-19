import { MdFactCheck, MdOutlineAnalytics } from "react-icons/md";
import { IoIosBriefcase } from "react-icons/io";
import { FaPeopleGroup } from "react-icons/fa6";
import { NavLink } from "react-router-dom";

const SideBar = () => {
  return (
    <aside className="hidden md:flex fixed top-16 left-0 w-60 min-h-screen bg-white border-r p-4">
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
      </nav>
    </aside>
  );
};

export default SideBar;
