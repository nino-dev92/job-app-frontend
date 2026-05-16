import { useState, useEffect, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/axios";
import Footer from "../components/Footer";
import NavBar from "../components/NavBar";

const Signup = () => {
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [role, setRole] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const navigate = useNavigate();

  useEffect(() => {
    setTimeout(() => {
      setMessage("");
    }, 3000);
  }, [message]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (role == "") return setMessage("Please Select a Role");
    try {
      const response = await api.post("/auth/register", {
        name,
        email,
        role,
        password,
      });
      console.log(name, email, role, password);
      setMessage("Signup Successful");
      if (response.status == 201) navigate("/login");
    } catch (error: any) {
      setMessage(error?.response?.message);
    }
  };
  return (
    <div
      className="min-h-screen flex flex-col bg-background text-on-background font-body-md"
      onSubmit={handleSubmit}
    >
      {/* Top Nav */}
      <NavBar />

      {/* Main */}
      <main className="flex-grow pt-16 flex items-center justify-center relative overflow-hidden">
        {/* Background blur blobs */}
        <div className="absolute inset-0 -z-10 opacity-30">
          <div className="absolute -top-24 -left-24 w-96 h-96 bg-blue-200/30 rounded-full blur-3xl" />
          <div className="absolute top-1/2 -right-24 w-80 h-80 bg-cyan-200/30 rounded-full blur-3xl" />
        </div>

        <div className="w-full max-w-6xl px-6 grid md:grid-cols-2 gap-12 py-12">
          {/* Left Side */}
          <div className="hidden md:block space-y-8">
            <h1 className="text-5xl font-bold leading-tight">
              Your next <span className="text-blue-600">career milestone</span>{" "}
              starts here.
            </h1>

            <p className="text-lg text-slate-600 max-w-md">
              Join thousands of professionals and unlock tailored opportunities.
            </p>

            <div className="space-y-4">
              <div className="flex gap-4 p-4 bg-white border rounded-xl shadow-sm">
                <div className="w-10 h-10 flex items-center justify-center bg-cyan-100 rounded-lg">
                  ✔
                </div>
                <div>
                  <p className="font-semibold">Verified Employers</p>
                  <p className="text-sm text-slate-500">Top global companies</p>
                </div>
              </div>

              <div className="flex gap-4 p-4 bg-white border rounded-xl shadow-sm">
                <div className="w-10 h-10 flex items-center justify-center bg-purple-100 rounded-lg">
                  ⚡
                </div>
                <div>
                  <p className="font-semibold">Smart Matching</p>
                  <p className="text-sm text-slate-500">
                    AI-powered job suggestions
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Form */}
          <div className="w-full max-w-md mx-auto">
            <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-xl">
              <div>
                <p className="text-black-500 bg-red-500 text-center">
                  {message}
                </p>
              </div>
              <h2 className="text-2xl font-bold mb-1">Create Account</h2>
              <p className="text-slate-500 mb-6">Start your journey today</p>

              <form className="space-y-5">
                {/* Name */}
                <input
                  className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-200 outline-none"
                  placeholder="Full Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />

                {/* Email */}
                <input
                  className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-200 outline-none"
                  placeholder="Email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />

                {/* Password */}
                <input
                  className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-200 outline-none"
                  placeholder="Password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />

                {/** Role */}
                <div className="border-1 rounded p-2 flex justify-center gap-5">
                  <div className="flex gap-1">
                    <label>Employer</label>
                    <input
                      type="radio"
                      name="role"
                      value="employer"
                      onChange={(e) => setRole(e.target.value)}
                    />
                  </div>
                  <div className="flex gap-1">
                    <label>Jobseeker</label>
                    <input
                      type="radio"
                      name="role"
                      value="jobseeker"
                      onChange={(e) => setRole(e.target.value)}
                    />
                  </div>
                </div>

                {/* Terms */}
                <label className="flex items-start gap-2 text-sm text-slate-500">
                  <input type="checkbox" />I agree to the Terms & Privacy Policy
                </label>

                {/* Submit */}
                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white py-4 rounded-lg font-semibold hover:opacity-90 active:scale-95 transition cursor-pointer"
                >
                  Create Account
                </button>
              </form>

              <p className="text-center text-sm text-slate-500 mt-6">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="text-blue-600 font-semibold cursor-pointer"
                >
                  Log in
                </Link>
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Signup;
