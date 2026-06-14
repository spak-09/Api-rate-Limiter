import { useEffect, useMemo, useState } from "react";
import { Navigate } from "react-router-dom";
import axiosInstance from "../api/axiosInstance.js";
import { Sidebar } from "../components/Sidebar.jsx";
import { StatCard } from "../components/StatCard.jsx";
import { JsonViewer } from "../components/JsonViewer.jsx";
import { useAuthStore } from "../store/authStore.js";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
} from "recharts";

const apiOptions = [
  { label: "Products API", value: "products", path: "/api/data/products" },
  { label: "Posts API", value: "posts", path: "/api/data/posts" },
  { label: "News API", value: "news", path: "/api/data/news" },
];

const requestOptions = [1, 5, 10, 25, 50, 100];
const rateOptions = [10, 20, 30, 60, 120, 240];

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const Dashboard = () => {
  const currentUser = useAuthStore((state) => state.currentUser);
  const [usage, setUsage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedEndpoint, setSelectedEndpoint] = useState(apiOptions[0]);
  const [selectedRequests, setSelectedRequests] = useState(5);
  const [selectedRate, setSelectedRate] = useState(60);
  const [simulatorStatus, setSimulatorStatus] = useState(null);
  const [simulatorLoading, setSimulatorLoading] = useState(false);
  const [selectedEndpointUrl, setSelectedEndpointUrl] = useState(null);

  const loadUsage = async () => {
    if (!currentUser) return;
    setLoading(true);
    setError(null);

    try {
      const response = await axiosInstance.get("/api/user/usage");
      setUsage(response.data.usage || null);
    } catch (fetchError) {
      setError(fetchError.response?.data?.message || "Unable to load dashboard usage");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsage();
  }, [currentUser]);

  const chartData = useMemo(() => {
    if (!usage?.recentRequests?.length) {
      return [];
    }

    const counts = usage.recentRequests.reduce((acc, request) => {
      const date = new Date(request.timestamp).toLocaleDateString();
      if (!acc[date]) {
        acc[date] = { date, products: 0, posts: 0, news: 0 };
      }

      if (request.path.includes("/api/data/products")) {
        acc[date].products += 1;
      } else if (request.path.includes("/api/data/posts")) {
        acc[date].posts += 1;
      } else if (request.path.includes("/api/data/news")) {
        acc[date].news += 1;
      }

      return acc;
    }, {});

    return Object.values(counts).sort((a, b) => new Date(a.date) - new Date(b.date));
  }, [usage]);

  const handleSendRequests = async () => {
    setSimulatorStatus(null);
    setSimulatorLoading(true);

    try {
      const endpointUrl = selectedEndpoint.path;
      setSelectedEndpointUrl(`${axiosInstance.defaults.baseURL}${endpointUrl}`);
      const intervalMs = Math.max(100, Math.round(60000 / selectedRate));
      let successCount = 0;
      let blockedCount = 0;

      for (let i = 0; i < selectedRequests; i += 1) {
        try {
          await axiosInstance.get(endpointUrl);
          successCount += 1;
        } catch (err) {
          blockedCount += 1;
        }

        if (i < selectedRequests - 1) {
          await sleep(intervalMs);
        }
      }

      setSimulatorStatus(`Sent ${selectedRequests} request${selectedRequests === 1 ? "" : "s"} to ${selectedEndpoint.label} at ${selectedRate} requests/min. ${successCount} succeeded, ${blockedCount} blocked.`);
    } catch (sendError) {
      setSimulatorStatus("Unable to complete requests. Try again later.");
    } finally {
      setSimulatorLoading(false);
      await loadUsage();
    }
  };

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  if (currentUser.role === "admin") {
    return <Navigate to="/admin" replace />;
  }

  const stats = [
    {
      title: "Requests Used",
      value: usage?.totalRequests ?? "0",
      label: "Total requests",
      accent: true,
    },
    {
      title: "Remaining Requests",
      value: usage?.remainingRequests ?? "Unavailable",
      label: "Current quota",
      accent: false,
    },
    {
      title: "Blocked Requests",
      value: usage?.blockedRequests ?? "0",
      label: "Protected traffic",
      accent: false,
    },
    {
      title: "Current Algorithm",
      value: usage?.currentAlgorithm ?? "Unavailable",
      label: "Policy status",
      accent: false,
    },
  ];

  return (
    <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
      <Sidebar />
      <div className="space-y-8">
        {error && (
          <div className="rounded-[2rem] border border-danger/20 bg-[#2B1318] p-6 text-sm text-danger">
            {error}
          </div>
        )}

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {stats.map((item) => (
            <StatCard key={item.title} {...item} />
          ))}
        </div>

        <div className="grid gap-6 xl:grid-cols-[1.3fr_0.7fr]">
          <div className="rounded-[2rem] border border-border bg-[#151B28]/90 p-6 shadow-glow">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.3em] text-[#8B95AE]">Request Simulator</p>
                <p className="mt-2 text-sm text-[#A3AFC8]">Generate real traffic against your protected data APIs.</p>
              </div>
                      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                <label className="block text-sm text-[#A3AFC8]">
                  API Endpoint
                  <select
                    value={selectedEndpoint.value}
                    onChange={(event) => {
                      const option = apiOptions.find((item) => item.value === event.target.value);
                      setSelectedEndpoint(option || apiOptions[0]);
                    }}
                    className="mt-2 w-full rounded-3xl border border-border bg-[#11151F] px-4 py-3 text-sm text-white outline-none"
                  >
                    {apiOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="block text-sm text-[#A3AFC8]">
                  Request Count
                  <select
                    value={selectedRequests}
                    onChange={(event) => setSelectedRequests(Number(event.target.value))}
                    className="mt-2 w-full rounded-3xl border border-border bg-[#11151F] px-4 py-3 text-sm text-white outline-none"
                  >
                    {requestOptions.map((count) => (
                      <option key={count} value={count}>
                        {count}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="block text-sm text-[#A3AFC8]">
                  Requests / min
                  <select
                    value={selectedRate}
                    onChange={(event) => setSelectedRate(Number(event.target.value))}
                    className="mt-2 w-full rounded-3xl border border-border bg-[#11151F] px-4 py-3 text-sm text-white outline-none"
                  >
                    {rateOptions.map((rate) => (
                      <option key={rate} value={rate}>
                        {rate}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
            </div>

            <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-[#A3AFC8]">Selected endpoint:</p>
                <p className="mt-1 text-lg font-semibold text-white">{selectedEndpoint.label}</p>
              </div>
              <button
                type="button"
                onClick={handleSendRequests}
                disabled={simulatorLoading}
                className="inline-flex items-center justify-center rounded-3xl bg-accent px-6 py-3 text-sm font-semibold text-black transition hover:bg-accent/90 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {simulatorLoading ? "Sending..." : "Send Requests"}
              </button>
            </div>

            {simulatorStatus && (
              <div className="mt-4 text-sm text-[#A3AFC8]">
                <p>{simulatorStatus}</p>
                {selectedEndpointUrl && (
                  <p className="mt-2">
                    <a href={selectedEndpointUrl} target="_blank" rel="noreferrer" className="text-accent">
                      GET {selectedEndpointUrl}
                    </a>
                  </p>
                )}
              </div>
            )}
          </div>

          <div className="rounded-[2rem] border border-border bg-[#151B28]/90 p-6 shadow-glow">
            <p className="text-sm uppercase tracking-[0.3em] text-[#8B95AE]">Status</p>
            <div className="mt-6 space-y-4">
              <div className="rounded-3xl border border-border bg-[#11151F]/80 p-4">
                <p className="text-sm text-[#A3AFC8]">Selected API</p>
                <p className="mt-2 text-lg font-semibold text-white">{selectedEndpoint.label}</p>
              </div>
              <div className="rounded-3xl border border-border bg-[#11151F]/80 p-4">
                <p className="text-sm text-[#A3AFC8]">Request batch</p>
                <p className="mt-2 text-lg font-semibold text-white">{selectedRequests}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-6 xl:grid-cols-[1.4fr_0.6fr]">
          <div className="rounded-[2rem] border border-border bg-[#151B28]/90 p-6 shadow-glow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.3em] text-[#8B95AE]">Request trend</p>
                <p className="mt-2 text-sm text-[#A3AFC8]">Daily traffic for each data API.</p>
              </div>
            </div>
            <div className="mt-6 h-72">
              {loading ? (
                <div className="flex h-full items-center justify-center text-sm text-[#A3AFC8]">Loading request trends...</div>
              ) : chartData.length ? (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
                    <CartesianGrid stroke="#222" strokeDasharray="3 3" />
                    <XAxis dataKey="date" tick={{ fill: "#A3AFC8", fontSize: 12 }} />
                    <YAxis tick={{ fill: "#A3AFC8", fontSize: 12 }} />
                    <Tooltip contentStyle={{ background: "#11151F", border: "1px solid #2A2F3A", color: "#D6DCE5" }} />
                    <Legend formatter={(value) => <span className="text-sm text-white">{value}</span>} />
                    <Area type="monotone" dataKey="products" name="Products" stroke="#6366F1" fill="#6366F1" fillOpacity={0.25} />
                    <Area type="monotone" dataKey="posts" name="Posts" stroke="#10B981" fill="#10B981" fillOpacity={0.25} />
                    <Area type="monotone" dataKey="news" name="News" stroke="#F97316" fill="#F97316" fillOpacity={0.25} />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex h-full items-center justify-center text-sm text-[#A3AFC8]">No API requests made yet</div>
              )}
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-[2rem] border border-border bg-[#151B28]/90 p-6 shadow-glow">
              <p className="text-sm uppercase tracking-[0.3em] text-[#8B95AE]">Recent Activity</p>
              <div className="mt-6 space-y-4">
                {loading ? (
                  <p className="text-sm text-[#A3AFC8]">Loading activity...</p>
                ) : usage?.recentRequests?.length ? (
                  usage.recentRequests.map((request) => (
                    <div key={request._id || request.timestamp} className="rounded-3xl border border-border bg-[#11151F]/80 p-4">
                      <div className="flex items-center justify-between text-sm text-[#A3AFC8]">
                        <span className="font-medium">{request.method} {request.path}</span>
                        <span>{new Date(request.timestamp).toLocaleTimeString()}</span>
                      </div>
                      <div className="mt-2 text-sm text-text">
                        <p className="mb-2">Response:</p>
                        <JsonViewer data={request.responseData} collapsedByDefault={true} />
                        <p className="mt-2 text-xs text-[#A3AFC8]">Endpoint:</p>
                        <a href={`${axiosInstance.defaults.baseURL}${request.path}`} target="_blank" rel="noreferrer" className="text-accent text-sm">
                          GET {axiosInstance.defaults.baseURL}{request.path}
                        </a>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-[#A3AFC8]">No API requests made yet</p>
                )}
              </div>
            </div>
            <div className="rounded-[2rem] border border-border bg-[#151B28]/90 p-6 shadow-glow">
              <p className="text-sm uppercase tracking-[0.3em] text-[#8B95AE]">Request state</p>
              <div className="mt-6 h-3 rounded-full bg-[#11151F]">
                <div className="h-full w-3/4 rounded-full bg-accent" />
              </div>
              <p className="mt-4 text-sm text-[#A3AFC8]">Real usage flows are shown as they arrive.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
