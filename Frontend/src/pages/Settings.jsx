import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import axiosInstance from "../api/axiosInstance.js";
import { Sidebar } from "../components/Sidebar.jsx";
import { useAuthStore } from "../store/authStore.js";
import { styles } from "../style.js";

const algorithms = ["fixed-window", "sliding-window", "token-bucket", "leaky-bucket"];

export const Settings = () => {
  const currentUser = useAuthStore((state) => state.currentUser);
  const setCurrentUser = useAuthStore((state) => state.setCurrentUser);
  const [form, setForm] = useState({ algorithm: "fixed-window", maxRequests: 100, windowSize: 60 });
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadSettings = async () => {
      if (!currentUser) return;

      setLoading(true);
      setError(null);

      try {
        if (currentUser.role === "admin") {
          const response = await axiosInstance.get("/api/admin/stats");
          const settings = response.data.stats?.settings;
          if (settings) {
            setForm({
              algorithm: settings.algorithm || "fixed-window",
              maxRequests: settings.maxRequests || 100,
              windowSize: settings.windowSize || 60,
            });
          }
        } else {
          // Regular user: prefill from currentUser or fallback defaults
          setForm({
            algorithm: currentUser.algorithm || "fixed-window",
            maxRequests: currentUser.maxRequests || 100,
            windowSize: currentUser.windowSize || 60,
          });
        }
      } catch (fetchError) {
        setError(fetchError.response?.data?.message || "Unable to load settings");
      } finally {
        setLoading(false);
      }
    };

    loadSettings();
  }, [currentUser]);

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  const handleChange = (e) => {
    const value = e.target.name === "algorithm" ? e.target.value : Number(e.target.value);
    setForm({ ...form, [e.target.name]: value });
  };

  const handleAlgorithm = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      let response = null;
      if (currentUser.role === "admin") {
        response = await axiosInstance.post("/api/admin/algorithm", { algorithm: form.algorithm });
      } else {
        response = await axiosInstance.post("/api/user/algorithm", { algorithm: form.algorithm });
      }
      // If backend returned updated user, refresh local store
      if (response?.data?.user) {
        setCurrentUser(response.data.user);
      }
      setMessage("Algorithm updated successfully.");
    } catch (err) {
      setError(err.response?.data?.message || "Unable to update algorithm");
    }
  };

  const handleLimits = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      let response = null;
      if (currentUser.role === "admin") {
        response = await axiosInstance.post("/api/admin/limits", {
          maxRequests: form.maxRequests,
          windowSize: form.windowSize,
        });
      } else {
        response = await axiosInstance.post("/api/user/limits", {
          maxRequests: form.maxRequests,
          windowSize: form.windowSize,
        });
      }
      if (response?.data?.user) {
        setCurrentUser(response.data.user);
      }
      setMessage("Limits updated successfully.");
    } catch (err) {
      setError(err.response?.data?.message || "Unable to update limits");
    }
  };

  return (
    <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
      <Sidebar />
      <div className="space-y-8">
        <div className="rounded-[2rem] border border-border bg-[#151B28]/90 p-8 shadow-glow">
          <p className="text-sm uppercase tracking-[0.3em] text-[#8B95AE]">Settings</p>
          <h2 className="mt-3 text-3xl font-semibold text-white">Rate limiting configuration</h2>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-[#B7C0D9]">
            Adjust global algorithm behavior and capacity limits for your API infrastructure.
          </p>
        </div>

        {loading ? (
          <div className="rounded-[2rem] border border-border bg-[#151B28]/90 p-6 text-sm text-[#A3AFC8]">Loading settings...</div>
        ) : error ? (
          <div className="rounded-[2rem] border border-danger/20 bg-[#2B1318] p-6 text-sm text-danger">{error}</div>
        ) : (
          <>
            {message && <div className="rounded-3xl border border-success/20 bg-success/10 p-4 text-sm text-success">{message}</div>}

            <div className="grid gap-6 lg:grid-cols-2">
              <form className="rounded-[2rem] border border-border bg-[#151B28]/90 p-8 shadow-glow" onSubmit={handleAlgorithm}>
                <p className="text-sm uppercase tracking-[0.3em] text-[#8B95AE]">Algorithm</p>
                <div className="mt-6 space-y-4">
                  {algorithms.map((option) => (
                    <label key={option} className="flex items-center gap-4 rounded-3xl border border-border bg-[#11151F]/80 p-4">
                      <input
                        type="radio"
                        name="algorithm"
                        value={option}
                        checked={form.algorithm === option}
                        onChange={handleChange}
                        className="accent-accent"
                      />
                      <span className="text-text">{option.replace("-", " ")}</span>
                    </label>
                  ))}
                </div>
                <button className={`${styles.buttonPrimary} mt-6`} type="submit">
                  Save algorithm
                </button>
              </form>

              <form className="rounded-[2rem] border border-border bg-[#151B28]/90 p-8 shadow-glow" onSubmit={handleLimits}>
                <p className="text-sm uppercase tracking-[0.3em] text-[#8B95AE]">Limits</p>
                <div className="mt-6 space-y-6">
                  <div>
                    <label className="mb-2 block text-sm text-[#A3AFC8]">Max requests</label>
                    <input
                      className={styles.input}
                      name="maxRequests"
                      type="number"
                      min={1}
                      value={form.maxRequests}
                      onChange={handleChange}
                    />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm text-[#A3AFC8]">Window size (seconds)</label>
                    <input
                      className={styles.input}
                      name="windowSize"
                      type="number"
                      min={1}
                      value={form.windowSize}
                      onChange={handleChange}
                    />
                  </div>
                </div>
                <button className={`${styles.buttonPrimary} mt-6`} type="submit">
                  Save limits
                </button>
              </form>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
