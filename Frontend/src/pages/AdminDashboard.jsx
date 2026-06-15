import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import axiosInstance from "../api/axiosInstance.js";
import { Sidebar } from "../components/Sidebar.jsx";
import { StatCard } from "../components/StatCard.jsx";
import { useAuthStore } from "../store/authStore.js";

export const AdminDashboard = () => {
  const currentUser = useAuthStore((state) => state.currentUser);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadStats = async () => {
      if (!currentUser) return;
      if (currentUser.role !== "admin") return;

      setLoading(true);
      setError(null);

      try {
        const statsResponse = await axiosInstance.get("/api/admin/stats");

        setStats(statsResponse.data.stats || null);
      } catch (fetchError) {
        setError(fetchError.response?.data?.message || "Unable to load admin dashboard");
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, [currentUser]);

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  if (currentUser.role !== "admin") {
    return <Navigate to="/dashboard" replace />;
  }

  const globalAlgorithm = stats?.settings?.algorithm || "N/A";
  const limitCards = [
    {
      title: "Total Requests",
      value: stats?.requestCount != null ? stats.requestCount : "-",
      label: "system wide",
      accent: true,
    },
    {
      title: "Blocked Requests",
      value: stats?.blockedCount != null ? stats.blockedCount : "-",
      label: "attack mitigation",
    },
    {
      title: "Users",
      value: stats?.userCount != null ? stats.userCount : "-",
      label: "active accounts",
    },
    {
      title: "Current Algorithm",
      value: globalAlgorithm,
      label: "rate limiter",
    },
  ];

  return (
    <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
      <Sidebar />
      <div className="space-y-8">
        {error && <div className="rounded-[2rem] border border-danger/20 bg-[#2B1318] p-6 text-sm text-danger">{error}</div>}
        {loading ? (
          <div className="rounded-[2rem] border border-border bg-[#151B28]/90 p-6 text-sm text-[#A3AFC8]">Loading admin dashboard...</div>
        ) : (
          <>
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
              {limitCards.map((item) => (
                <StatCard key={item.title} {...item} />
              ))}
            </div>

            <div className="rounded-[2rem] border border-border bg-[#151B28]/90 p-6 shadow-glow">
              <p className="text-sm uppercase tracking-[0.3em] text-[#8B95AE]">Current limits</p>
              <div className="mt-6 space-y-4 text-sm text-[#A3AFC8]">
                <div className="rounded-3xl border border-border bg-[#11151F]/70 p-4">
                  <p>Max requests</p>
                  <p className="mt-2 text-white">{stats?.settings?.maxRequests ?? "-"}</p>
                </div>
                <div className="rounded-3xl border border-border bg-[#11151F]/70 p-4">
                  <p>Window size</p>
                  <p className="mt-2 text-white">{stats?.settings?.windowSize ?? "-"} seconds</p>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
