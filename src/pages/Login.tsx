import { Link } from "react-router-dom";
import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { Toaster, toast } from "sonner";
import useAuth from "../hooks/useAuth";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";
import api from "../api/axios";

const Login = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
   const navigate = useNavigate();
  const { setAuth, setIsLoggeedIn } = useAuth();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const response = await api.post("/auth/login", { email: email.trim().toLowerCase(), password });
      const accessToken = response?.data?.accessToken;
      const role = response?.data?.role;
      const id = response?.data?.id;
      const username = response?.data?.name;
      setAuth({ accessToken, role, id, username, isLoggedIn: true });
      if (response.status == 200) {
        setIsLoggeedIn(true);
        if (role == "employer") {
          navigate("/dashboard");
        } else navigate("/jobs");
      }
     if (response.status == 401) toast.error("Invalid Credentials");
    } catch (error: any) {
      // setMessage(error?.response?.message);
      toast.error("Invalid Credentials");
    }
  };

  return (
    <div
      className="min-h-screen flex flex-col bg-background text-on-background font-body-md"
      onSubmit={handleSubmit}
    >
      <Toaster position="top-right" richColors />

      {/* Top Navbar */}
      <NavBar />

      {/* Main */}
      <main className="flex-grow pt-24 pb-16 px-6 flex items-center justify-center relative overflow-hidden">
        {/* Background blobs */}
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-blue-200/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-cyan-200/20 rounded-full blur-3xl" />

        <div className="w-full max-w-6xl grid lg:grid-cols-12 gap-12 relative z-10">
          {/* Left Side */}
          <div className="hidden lg:block lg:col-span-7 space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-100 text-cyan-800 text-sm font-semibold">
              🚀 Future-Forward Professional
            </div>

            <h1 className="text-5xl font-bold leading-tight">
              Your professional <span className="text-blue-600">momentum</span>{" "}
              starts here.
            </h1>

            <p className="text-lg text-slate-600 max-w-lg">
              Access high-stakes career growth opportunities with a modern
              recruitment experience.
            </p>

            <div className="grid grid-cols-2 gap-4 max-w-md">
              <div className="p-4 bg-white rounded-xl border shadow-sm">
                <div className="text-2xl font-bold text-blue-600">12k+</div>
                <div className="text-xs text-slate-500">Verified Employers</div>
              </div>

              <div className="p-4 bg-white rounded-xl border shadow-sm">
                <div className="text-2xl font-bold text-cyan-600">45%</div>
                <div className="text-xs text-slate-500">
                  Avg Salary Increase
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Form */}
          <div className="lg:col-span-5 w-full">
            <div className="bg-white/80 backdrop-blur-xl border border-slate-200 rounded-3xl shadow-xl p-8 md:p-10">
              <div className="mb-8 text-center lg:text-left">

                <h2 className="text-3xl font-bold">Welcome Back</h2>
                <p className="text-slate-500">
                  Sign in to continue your journey
                </p>
              </div>

              <form className="space-y-6">
                {/* Email */}
                <div>
                  <label className="text-sm font-semibold">Email Address</label>
                  <div className="relative mt-2">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                      📧
                    </span>
                    <input
                      type="email"
                      placeholder="name@company.com"
                      className="w-full pl-10 pr-4 py-3 border rounded-xl outline-none focus:ring-2 focus:ring-blue-200"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <div className="flex justify-between">
                    <label className="text-sm font-semibold">Password</label>
                    <a className="text-sm text-blue-600 hover:underline">
                      Forgot?
                    </a>
                  </div>

                  <div className="relative mt-2">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                      🔒
                    </span>
                    <input
                      type="password"
                      placeholder="••••••••"
                      className="w-full pl-10 pr-10 py-3 border rounded-xl outline-none focus:ring-2 focus:ring-blue-200"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                </div>

                {/* Remember */}
                <div className="flex items-center gap-2">
                  <input type="checkbox" />
                  <label className="text-sm text-slate-600">
                    Keep me signed in
                  </label>
                </div>

                {/* Button */}
                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white py-4 rounded-xl font-semibold hover:opacity-90 active:scale-95 transition flex justify-center items-center gap-2 cursor-pointer"
                >
                  Sign In ➜
                </button>

                {/* Divider */}
                <div className="flex items-center gap-4">
                  <div className="flex-1 h-px bg-slate-200" />
                  <span className="text-xs text-slate-400">OR</span>
                  <div className="flex-1 h-px bg-slate-200" />
                </div>
              </form>

              <p className="mt-6 text-center text-sm text-slate-500">
                New here?{" "}
                <Link
                  to="/signup"
                  className="text-blue-600 font-semibold hover:underline"
                >
                  Create account
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

export default Login;
