import { useEffect, useMemo, useState } from "react";
import { Navigate } from "react-router-dom";
import axiosInstance from "../api/axiosInstance.js";
import { Sidebar } from "../components/Sidebar.jsx";
import { ChartCard } from "../components/ChartCard.jsx";
import { StatCard } from "../components/StatCard.jsx";
import { useAuthStore } from "../store/authStore.js";

export const Analytics = () => {
  const currentUser = useAuthStore((state) => state.currentUser);
  const [overview, setOverview] = useState(null);
  const [topUsers, setTopUsers] = useState([]);
  const [usage, setUsage] = useState(null);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadAnalytics = async () => {
      if (!currentUser) return;
      setLoading(true);
      setError(null);

      try {
        if (currentUser.role === "admin") {
          const [overviewResponse, topUsersResponse, requestsResponse] = await Promise.all([
            axiosInstance.get("/api/analytics/overview"),
            axiosInstance.get("/api/admin/top-users"),
            axiosInstance.get("/api/analytics/requests"),
          ]);
          setOverview(overviewResponse.data.overview || null);
          setTopUsers(topUsersResponse.data.topUsers || []);
          setRequests(requestsResponse.data.requests || []);
        } else {
          const response = await axiosInstance.get("/api/user/usage");
          setUsage(response.data.usage || null);
          setRequests(response.data.usage?.recentRequests || []);
        }
      } catch (fetchError) {
        setError(fetchError.response?.data?.message || "Unable to load analytics");
      } finally {
        setLoading(false);
      }
    };

    loadAnalytics();
  }, [currentUser]);

  const chartData = useMemo(() => {
    if (!requests?.length) {
      return [];
    }

    const counts = requests.reduce((acc, request) => {
      const date = new Date(request.timestamp).toLocaleDateString();
      acc[date] = (acc[date] || 0) + 1;
      return acc;
    }, {});

    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [requests]);

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  const summaryCards = currentUser.role === "admin"
    ? [
        { title: "Total Requests", value: overview?.totalRequests ?? "-", label: "system total", accent: true },
        { title: "Blocked", value: overview?.totalBlocked ?? "-", label: "security events" },
        { title: "Algorithm", value: overview?.settings?.algorithm ?? "-", label: "active policy" },
        { title: "Window size", value: overview?.settings?.windowSize ?? "-", label: "seconds" },
      ]
    : [
        { title: "Request count", value: usage?.totalRequests ?? "-", label: "user requests", accent: true },
        { title: "Blocked", value: usage?.blockedRequests ?? "-", label: "protected calls" },
        { title: "Recent entries", value: usage?.recentRequests?.length ?? 0, label: "log records" },
        { title: "Algorithm", value: usage?.currentAlgorithm ?? "Unavailable", label: "policy" },
      ];

  return (
    <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
      <Sidebar />
      <div className="space-y-8">
        {error && <div className="rounded-[2rem] border border-danger/20 bg-[#2B1318] p-6 text-sm text-danger">{error}</div>}

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {summaryCards.map((item) => (
            <StatCard key={item.title} {...item} />
          ))}
        </div>

        {loading ? (
          <div className="rounded-[2rem] border border-border bg-[#151B28]/90 p-8 text-sm text-[#A3AFC8]">Loading analytics...</div>
        ) : chartData.length ? (
          <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
            <ChartCard title="Request trends" data={chartData} type="area" />
            <div className="rounded-[2rem] border border-border bg-[#151B28]/90 p-6 shadow-glow">
              <p className="text-sm uppercase tracking-[0.3em] text-[#8B95AE]">Request distribution</p>
              <p className="mt-6 text-sm text-[#A3AFC8]">Showing real request volume from the backend.</p>
            </div>
          </div>
        ) : (
          <div className="rounded-[2rem] border border-border bg-[#151B28]/90 p-8 text-sm text-[#A3AFC8]">No analytics available</div>
        )}

        {currentUser.role === "admin" && !loading && (
          <div className="rounded-[2rem] border border-border bg-[#151B28]/90 p-6 shadow-glow">
            <p className="text-sm uppercase tracking-[0.3em] text-[#8B95AE]">Top users</p>
            {topUsers.length ? (
              <div className="mt-6 grid gap-4">
                {topUsers.map((user) => (
                  <div key={user.userId || user.userName || user.email} className="rounded-3xl border border-border bg-[#11151F]/70 p-4">
                    <p className="text-sm text-white">{user.userName || user.email || "Unknown"}</p>
                    <p className="mt-1 text-sm text-[#A3AFC8]">{user.requestCount ?? user.requests} requests</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="mt-6 text-sm text-[#A3AFC8]">No users found</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
