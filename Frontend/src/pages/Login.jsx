import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axiosInstance from "../api/axiosInstance.js";
import { useAuthStore } from "../store/authStore.js";
import { styles } from "../style.js";

export const Login = () => {
  const navigate = useNavigate();
  const { setToken, setCurrentUser, setError, setLoading, loading, error } = useAuthStore();
  const [form, setForm] = useState({ email: "", password: "" });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await axiosInstance.post("/api/auth/login", form);
      setToken(response.data.token);
      setCurrentUser(response.data.user);
      navigate("/dashboard");
    } catch (errorResponse) {
      setError(errorResponse.response?.data?.message || "Unable to login");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-72px)] items-center justify-center px-4 py-16">
      <div className="w-full max-w-md rounded-[2rem] border border-border bg-surface/90 p-10 shadow-glow backdrop-blur-xl">
        <h1 className="text-3xl font-semibold text-white">Login</h1>
        <p className="mt-3 text-sm text-[#A3AFC8]">Access your dashboard and analytics.</p>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div>
            <label className="mb-2 block text-sm text-[#A3AFC8]">Email</label>
            <input
              className={styles.input}
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label className="mb-2 block text-sm text-[#A3AFC8]">Password</label>
            <input
              className={styles.input}
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              required
            />
          </div>
          <button className={styles.buttonPrimary} type="submit" disabled={loading}>
            {loading ? "Signing in..." : "Login"}
          </button>
          {error && <p className="text-sm text-danger">{error}</p>}
          <p className="text-sm text-[#A3AFC8]">
            Don&apos;t have an account? <Link className="text-accent" to="/register">Register</Link>
          </p>
        </form>
      </div>
    </div>
  );
};
