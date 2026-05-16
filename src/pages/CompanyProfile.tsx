import { useEffect, useState } from "react";
import Navbar from "../components/NavBar";
import SideBar from "../components/SideBar";
import { FaSave, FaEdit } from "react-icons/fa";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import useAuth from "../hooks/useAuth";

const CompanyProfile: React.FC = () => {
  const { setIsLoading } = useAuth();
  const [name, setName] = useState("");
  const [website, setWebsite] = useState("");
  const [description, setDescription] = useState("");
  const [linkedin, setLinkedin] = useState("");
  const [instagram, setInstagram] = useState("");
  const [glassdoor, setGlassdoor] = useState("");
  const [errMsg, setErrMsg] = useState("");
  const [company, setCompany] = useState<any>(null);
  const [hasCompany, setHasCompany] = useState(false);
  const [details, setDetails] = useState<boolean>(false);
  const api = useAxiosPrivate();

  useEffect(() => {
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }, []);

  useEffect(() => {
    const getCompanyProfile = async () => {
      try {
        const response = await api.get(`/company/profile`);
        setCompany(response?.data?.company);
        if (response.data.company) setHasCompany(true);
      } catch (error) {
        console.log(error);
      }
    };

    getCompanyProfile();
  }, [hasCompany, details]);

  useEffect(() => {
    setTimeout(() => {
      setErrMsg("");
    }, 3000);
  }, [errMsg]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await api.post("/company/create", {
        name,
        website,
        description,
        linkedin,
        instagram,
        glassdoor,
      });
      if (response.status === 201) setHasCompany(true);
    } catch (error: any) {
      console.log(error);
      setErrMsg(error.response?.data?.message);
    }
  };

  const handleEdit = async () => {
    setName(company.name);
    setWebsite(company.website);
    setDescription(company.description);
    setLinkedin(company.linkedin);
    setInstagram(company.instagram);
    setGlassdoor(company.glassdoor);
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.put("/company/update", {
        name,
        website,
        description,
        linkedin,
        instagram,
        glassdoor,
      });
      setDetails(false);
    } catch (error: any) {
      console.log(error);
      setErrMsg(error.response.data.message);
    }
  };

  return (
    <div className="bg-background font-body-md text-on-surface">
      {/* TopAppBar */}
      <Navbar />

      <div className="flex pt-16">
        {/* Sidebar */}
        <SideBar />

        {/* Main */}

        {/**Not have Company Profile */}
        {!hasCompany && (
          <main className="flex-1 md:ml-64 p-8">
            <div className="max-w-5xl mx-auto">
              {/* Header */}
              <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                <div>
                  <h1 className="font-headline-lg font-bold text-2xl">
                    Company Profile
                  </h1>
                  <p className="text-on-surface-variant mt-1">
                    Manage how your brand appears to potential candidates.
                  </p>
                </div>
              </div>

              {/* Main Content */}
              <form
                className="flex flex-col gap-6 mb-6"
                onSubmit={handleSubmit}
              >
                <div>
                  <p>{errMsg}</p>
                </div>
                <div className="hidden md:flex gap-3 justify-end">
                  <button className="flex items-center gap-2 px-5 py-2.5 rounded-lg border border-slate-200 hover:border-blue-600 hover:text-blue-500  cursor-pointer">
                    <span>
                      <FaEdit />
                    </span>
                    Edit
                  </button>

                  <button
                    type="submit"
                    className="flex items-center border active:scale-110 border-slate-200 hover:border-blue-600 hover:text-blue-500 gap-2 px-5 py-2.5 rounded-lg cursor-pointer shadow-soft"
                  >
                    <span>
                      <FaSave />
                    </span>
                    Save
                  </button>
                </div>
                <div className="lg:col-span-8 space-y-6">
                  <div className="bg-white p-6 rounded-xl border border-black-200/60 shadow-soft">
                    <h2 className="font-headline-md mb-6">Basic Information</h2>

                    <div className="flex flex-col md:flex-row gap-6 md:gap-5">
                      <div className="flex-grow">
                        <label className="block text-sm mb-3">
                          Company Name
                        </label>
                        <input
                          className="px-4 py-2 border rounded-lg min-w-full"
                          placeholder="Company Name..."
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          required
                        />
                      </div>
                      <div className="flex-grow">
                        <label className="block text-sm mb-3">Website</label>
                        <input
                          className="px-4 py-2 border rounded-lg min-w-full"
                          placeholder="Company website..."
                          value={website}
                          onChange={(e) => setWebsite(e.target.value)}
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <div className="bg-white p-6 rounded-xl border border-black-200/60 shadow-soft">
                    <h2 className="font-headline-md mb-6">About the Company</h2>

                    <textarea
                      className="w-full p-4 border rounded-xl"
                      rows={6}
                      placeholder="Details about your company..."
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      required
                    />
                  </div>

                  {/* Social */}
                  <div className="bg-white p-6 rounded-xl border border-black-200/60 shadow-soft">
                    <h2 className="font-headline-md mb-6">Social Presence</h2>

                    <input
                      className="w-full px-3 py-2 border rounded-lg mb-3"
                      placeholder="Linkedin link"
                      value={linkedin}
                      onChange={(e) => setLinkedin(e.target.value)}
                    />
                    <input
                      className="w-full px-3 py-2 border rounded-lg mb-3"
                      placeholder="Instagram link"
                      value={instagram}
                      onChange={(e) => setInstagram(e.target.value)}
                    />
                    <input
                      className="w-full px-3 py-2 border rounded-lg"
                      placeholder="glassdoor link"
                      value={glassdoor}
                      onChange={(e) => setGlassdoor(e.target.value)}
                    />
                  </div>

                  <div className="flex gap-3 md:hidden justify-end">
                    <button className="flex items-center gap-2 px-5 py-2.5 rounded-lg border border-slate-200 hover:border-blue-600 hover:text-blue-500  cursor-pointer">
                      <span>
                        <FaEdit />
                      </span>
                      Edit
                    </button>

                    <button
                      type="submit"
                      className="flex items-center border  border-slate-200 hover:border-blue-600 hover:text-blue-500 gap-2 px-5 py-2.5 rounded-lg cursor-pointer shadow-soft"
                    >
                      <span>
                        <FaSave />
                      </span>
                      Save
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </main>
        )}

        {/**Has Company Profile */}
        {hasCompany && !details && (
          <main className="flex-1 md:ml-64 p-8 ">
            <div className="max-w-5xl mx-auto">
              {/* Header */}
              <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                <div className="flex justify-between w-full">
                  <h1 className="font-headline-lg font-bold text-2xl">
                    Company Profile
                  </h1>
                  <div className="flex gap-3 ml-8">
                    <button
                      className="flex items-center active:scale-105 gap-2 px-5 py-2.5 rounded-lg border border-slate-200 hover:border-blue-600 hover:text-blue-500  cursor-pointer"
                      onClick={() => {
                        setDetails(true);
                        handleEdit();
                      }}
                    >
                      <span>
                        <FaEdit />
                      </span>
                      Edit
                    </button>
                  </div>
                </div>
              </div>

              {/* Main Content */}
              <div className="flex flex-col gap-6 mb-6">
                <div className="flex flex-col gap-4 p-6 rounded-xl border border-black-200/60 shadow-lg hover:border-blue-500 hover:scale-101 transition-all duration-200">
                  <p className="text-on-surface-variant mt-1">
                    Company Name: {company?.name.toUpperCase()}
                  </p>
                  <p className="text-on-surface-variant mt-1">
                    Company Owner: {company?.user?.name.toUpperCase()}
                  </p>
                  <p className="text-on-surface-variant mt-1">
                    Company Email: {company?.user?.email}
                  </p>
                  <p className="text-on-surface-variant mt-1">
                    Company Website: {company?.website}
                  </p>
                  <p className="text-on-surface-variant mt-1">
                    Company Descrition: {company?.description}
                  </p>
                  <div className="flex gap-4 content-center">
                    <p>Company Socials:</p>
                    <ul className="list-none list-inside">
                      {company?.linkedin && (
                        <li className="text-on-surface-variant mt-1">
                          {company?.linkedin}
                        </li>
                      )}
                      {company?.instagram && (
                        <li className="text-on-surface-variant mt-1">
                          {company?.instagram}
                        </li>
                      )}
                      {company?.glassdoor && (
                        <li className="text-on-surface-variant mt-1">
                          {company?.glassdoor}
                        </li>
                      )}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </main>
        )}

        {/**Edit */}
        {hasCompany && details && (
          <main className="flex-1 md:ml-64 p-8">
            <div className="max-w-5xl mx-auto">
              {/* Header */}
              <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                <div>
                  <h1 className="font-headline-lg font-bold text-2xl">
                    Company Profile
                  </h1>
                  <p className="text-on-surface-variant mt-1">
                    Manage how your brand appears to potential candidates.
                  </p>
                </div>
              </div>

              {/* Main Content */}
              <form
                className="flex flex-col gap-6 mb-6"
                onSubmit={handleUpdate}
              >
                <div>
                  <p className="text-red-500 text-center">{errMsg}</p>
                </div>
                <div className="hidden md:flex gap-3 justify-end">
                  <button
                    type="button"
                    className="flex items-center gap-2 px-5 py-2.5 active:scale-110 rounded-lg border border-slate-200 hover:border-blue-600 hover:text-blue-500  cursor-pointer"
                    onClick={() => setDetails(false)}
                  >
                    <span>
                      <FaEdit />
                    </span>
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="flex items-center border active:scale-110 border-slate-200 hover:border-blue-600 hover:text-blue-500 gap-2 px-5 py-2.5 rounded-lg cursor-pointer shadow-soft"
                  >
                    <span>
                      <FaSave />
                    </span>
                    Save
                  </button>
                </div>
                <div className="lg:col-span-8 space-y-6">
                  <div className="bg-white p-6 rounded-xl border border-black-200/60 shadow-soft">
                    <h2 className="font-headline-md mb-6">Basic Information</h2>

                    <div className="flex flex-col md:flex-row gap-6 md:gap-5">
                      <div className="flex-grow">
                        <label className="block text-sm mb-3">
                          Company Name
                        </label>
                        <input
                          className="px-4 py-2 border rounded-lg min-w-full"
                          placeholder="Company Name..."
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          required
                        />
                      </div>
                      <div className="flex-grow">
                        <label className="block text-sm mb-3">Website</label>
                        <input
                          className="px-4 py-2 border rounded-lg min-w-full"
                          placeholder="Company website..."
                          value={website}
                          onChange={(e) => setWebsite(e.target.value)}
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <div className="bg-white p-6 rounded-xl border border-black-200/60 shadow-soft">
                    <h2 className="font-headline-md mb-6">About the Company</h2>

                    <textarea
                      className="w-full p-4 border rounded-xl"
                      rows={6}
                      placeholder="Details about your company..."
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      required
                    />
                  </div>

                  {/* Social */}
                  <div className="bg-white p-6 rounded-xl border border-black-200/60 shadow-soft">
                    <h2 className="font-headline-md mb-6">Social Presence</h2>

                    <input
                      className="w-full px-3 py-2 border rounded-lg mb-3"
                      placeholder="Linkedin link"
                      value={linkedin}
                      onChange={(e) => setLinkedin(e.target.value)}
                    />
                    <input
                      className="w-full px-3 py-2 border rounded-lg mb-3"
                      placeholder="Instagram link"
                      value={instagram}
                      onChange={(e) => setInstagram(e.target.value)}
                    />
                    <input
                      className="w-full px-3 py-2 border rounded-lg"
                      placeholder="glassdoor link"
                      value={glassdoor}
                      onChange={(e) => setGlassdoor(e.target.value)}
                    />
                  </div>

                  <div className="flex md:hidden gap-3 justify-end">
                    <button
                      type="button"
                      className="flex items-center gap-2 px-5 py-2.5 active:scale-110 rounded-lg border border-slate-200 hover:border-blue-600 hover:text-blue-500  cursor-pointer"
                      onClick={() => setDetails(false)}
                    >
                      <span>
                        <FaEdit />
                      </span>
                      Cancel
                    </button>

                    <button
                      type="submit"
                      className="flex items-center border active:scale-110 border-slate-200 hover:border-blue-600 hover:text-blue-500 gap-2 px-5 py-2.5 rounded-lg cursor-pointer shadow-soft"
                    >
                      <span>
                        <FaSave />
                      </span>
                      Save
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </main>
        )}
      </div>
    </div>
  );
};

export default CompanyProfile;
