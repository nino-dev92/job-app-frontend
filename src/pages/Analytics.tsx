import { useEffect, useState } from "react";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import useAuth from "../hooks/useAuth";
import Loading from "../components/Loading";
import Navbar from "../components/NavBar";
import SideBar from "../components/SideBar";
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
} from "recharts";
import { FaUsers, FaBriefcase, FaChartLine, FaCheckCircle } from "react-icons/fa";

const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444"];

export default function Analytics() {
  const [analytics, setAnalytics] = useState<any>(null);
  const api = useAxiosPrivate();
  const { auth, isLoading, setIsLoading } = useAuth();

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setIsLoading(true);
        const res = await api.get("/analytics");
        setAnalytics(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setTimeout(() => setIsLoading(false), 800);
      }
    };

    if (auth?.username) {
      fetchAnalytics();
    }
  }, [auth]);

  if (isLoading || !analytics) return <Loading />;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <title>Analytics | Employer Portal</title>
      <Navbar />
      <SideBar />

      <main className="ml-0 md:ml-60 pt-20 p-6 space-y-8">
        {/* Header */}
        <div>
          <h2 className="text-3xl font-bold text-slate-800 tracking-tight">Hiring Analytics</h2>
          <p className="text-slate-500 mt-1">Deep dive into your recruitment performance and trends.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Total Applications"
            value={analytics.summary.totalApplications}
            icon={<FaUsers className="text-blue-500" />}
            trend="+12%"
            description="Across all active jobs"
          />
          <StatCard
            title="Active Job Posts"
            value={analytics.summary.totalJobs}
            icon={<FaBriefcase className="text-emerald-500" />}
            trend="+2"
            description="Live on the platform"
          />
          <StatCard
            title="Hire Rate"
            value={`${analytics.summary.hireRate}%`}
            icon={<FaChartLine className="text-amber-500" />}
            trend="+5%"
            description="Application to acceptance"
          />
          <StatCard
            title="Total Hired"
            value={analytics.summary.accepted}
            icon={<FaCheckCircle className="text-indigo-500" />}
            trend="+3"
            description="Successful placements"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Trend Chart */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <h3 className="text-lg font-semibold mb-6">Application Trends</h3>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={analytics.trends}>
                  <defs>
                    <linearGradient id="colorApps" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1} />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#fff', borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  />
                  <Area
                    type="monotone"
                    dataKey="applications"
                    stroke="#3b82f6"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#colorApps)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Status Distribution */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <h3 className="text-lg font-semibold mb-6">Status Distribution</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 items-center">
              <div className="h-[250px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={analytics.statusDistribution}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {analytics.statusDistribution.map((_entry: any, index: number) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="space-y-4">
                {analytics.statusDistribution.map((item: any, index: number) => (
                  <div key={item.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                      <span className="text-sm font-medium text-slate-600 capitalize">{item.name}</span>
                    </div>
                    <span className="text-sm font-bold text-slate-900">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Recently Posted Jobs Activity (Optional mockup) */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-semibold mb-4">Recruitment Pipeline</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-slate-400 text-sm border-b border-slate-50">
                  <th className="pb-4 font-medium italic">Metric</th>
                  <th className="pb-4 font-medium italic">Current Period</th>
                  <th className="pb-4 font-medium italic">Previous Period</th>
                  <th className="pb-4 font-medium italic">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                <TableRow label="Candidate Conversion" current="24%" previous="18%" status="Rising" statusColor="text-emerald-500" />
                <TableRow label="Avg. Response Time" current="1.2 days" previous="2.4 days" status="Improved" statusColor="text-emerald-500" />
                <TableRow label="Platform Engagement" current="High" previous="Medium" status="Improving" statusColor="text-emerald-500" />
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}

function StatCard({ title, value, icon, trend, description }: any) {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div className="p-3 bg-slate-50 rounded-xl">{icon}</div>
        <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg">
          {trend}
        </span>
      </div>
      <div>
        <h4 className="text-slate-500 text-sm font-medium">{title}</h4>
        <div className="flex items-baseline gap-2 mt-1">
          <span className="text-2xl font-bold text-slate-900">{value}</span>
        </div>
        <p className="text-slate-400 text-xs mt-1">{description}</p>
      </div>
    </div>
  );
}

function TableRow({ label, current, previous, status, statusColor }: any) {
  return (
    <tr>
      <td className="py-4 text-sm font-medium text-slate-700">{label}</td>
      <td className="py-4 text-sm text-slate-600">{current}</td>
      <td className="py-4 text-sm text-slate-600">{previous}</td>
      <td className={`py-4 text-sm font-bold ${statusColor}`}>{status}</td>
    </tr>
  );
}
