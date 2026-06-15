import { useEffect, useMemo, useState } from "react";
import { Navigate } from "react-router-dom";
import axiosInstance from "../api/axiosInstance.js";
import { Sidebar } from "../components/Sidebar.jsx";
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

export const Dashboard = () => {
  const currentUser = useAuthStore((state) => state.currentUser);
  const [usage, setUsage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedEndpoint, setSelectedEndpoint] = useState(apiOptions[0]);
  const [responseData, setResponseData] = useState(null);
  const [dataLoading, setDataLoading] = useState(false);
  const [dataError, setDataError] = useState(null);

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

  const handleGetData = async () => {
    setResponseData(null);
    setDataLoading(true);
    setDataError(null);

    try {
      const endpointUrl = selectedEndpoint.path;
      const response = await axiosInstance.get(endpointUrl);
      setResponseData({
        method: "GET",
        path: endpointUrl,
        data: response.data.data || [],
        timestamp: new Date().toLocaleTimeString(),
        url: `${axiosInstance.defaults.baseURL}${endpointUrl}`,
      });
      await loadUsage();
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message;
      if (err.response?.status === 429) {
        setDataError("Rate limit exceeded. You have reached your request quota for this period.");
      } else {
        setDataError(`Unable to fetch data: ${errorMessage}`);
      }
    } finally {
      setDataLoading(false);
    }
  };

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  if (currentUser.role === "admin") {
    return <Navigate to="/admin" replace />;
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
      <Sidebar />
      <div className="space-y-8">
        {error && (
          <div className="rounded-[2rem] border border-danger/20 bg-[#2B1318] p-6 text-sm text-danger">
            {error}
          </div>
        )}

        <div className="grid gap-6 xl:grid-cols-[1.3fr_0.7fr]">
          <div className="rounded-[2rem] border border-border bg-[#151B28]/90 p-6 shadow-glow">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.3em] text-[#8B95AE]">API Testing Tool</p>
                <p className="mt-2 text-sm text-[#A3AFC8]">Select an API endpoint and fetch data.</p>
              </div>
              <div className="w-full md:w-auto">
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
              </div>
            </div>

            <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-[#A3AFC8]">Selected API:</p>
                <p className="mt-1 text-lg font-semibold text-white">{selectedEndpoint.label}</p>
              </div>
              <button
                type="button"
                onClick={handleGetData}
                disabled={dataLoading}
                className="inline-flex items-center justify-center rounded-3xl bg-accent px-6 py-3 text-sm font-semibold text-black transition hover:bg-accent/90 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {dataLoading ? "Fetching..." : "Get Data"}
              </button>
            </div>

            {dataError && (
              <div className="mt-4 rounded-2xl border border-danger/20 bg-[#2B1318] p-4 text-sm text-danger">
                {dataError}
              </div>
            )}
          </div>

          <div className="rounded-[2rem] border border-border bg-[#151B28]/90 p-6 shadow-glow">
            <p className="text-sm uppercase tracking-[0.3em] text-[#8B95AE]">Selected API</p>
            <div className="mt-6">
              <div className="rounded-3xl border border-border bg-[#11151F]/80 p-4">
                <p className="text-sm text-[#A3AFC8]">Current Selection</p>
                <p className="mt-2 text-lg font-semibold text-white">{selectedEndpoint.label}</p>
              </div>
            </div>
          </div>
        </div>

        {responseData && (
          <div className="rounded-[2rem] border border-border bg-[#151B28]/90 p-6 shadow-glow">
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="text-sm uppercase tracking-[0.3em] text-[#8B95AE]">API Response</p>
                <p className="mt-2 text-sm text-[#A3AFC8]">Data retrieved from {selectedEndpoint.label}</p>
              </div>
              <span className="text-xs text-[#A3AFC8]">{responseData.timestamp}</span>
            </div>
            <p className="text-xs text-[#A3AFC8] mb-4">Endpoint: <a href={responseData.url} target="_blank" rel="noreferrer" className="text-accent">GET {responseData.url}</a></p>
            
            {responseData.data && responseData.data.length > 0 ? (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {responseData.data.map((item, index) => (
                  <div key={item._id || index} className="rounded-2xl border border-border bg-[#11151F]/80 p-4 hover:border-accent/50 transition">
                    <div className="space-y-3">
                      <div>
                        <p className="text-xs text-[#8B95AE] uppercase tracking-wide">
                          {selectedEndpoint.value === "products" ? "Product Name" : "Title"}
                        </p>
                        <p className="mt-1 text-base font-semibold text-white line-clamp-2">
                          {item.name || item.title}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-[#8B95AE] uppercase tracking-wide">Details</p>
                        <p className="mt-1 text-sm text-[#A3AFC8] line-clamp-3">
                          {item.description || item.content}
                        </p>
                      </div>
                      {item._id && (
                        <p className="text-xs text-[#5A6471] pt-2 border-t border-border/50">
                          ID: {item._id.substring(0, 8)}...
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-2xl border border-border bg-[#11151F]/80 p-6 text-center">
                <p className="text-sm text-[#A3AFC8]">No data available</p>
              </div>
            )}
          </div>
        )}

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
