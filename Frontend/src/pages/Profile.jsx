import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { Sidebar } from "../components/Sidebar.jsx";
import { useAuthStore } from "../store/authStore.js";
import { styles } from "../style.js";

export const Profile = () => {
  const currentUser = useAuthStore((state) => state.currentUser);
  const [form, setForm] = useState({ name: "", email: "", role: "", createdAt: "" });

  useEffect(() => {
    if (currentUser) {
      setForm({
        name: currentUser.name,
        email: currentUser.email,
        role: currentUser.role || "user",
        createdAt: new Date(currentUser.createdAt || Date.now()).toLocaleDateString(),
      });
    }
  }, [currentUser]);

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  return (
    <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
      <Sidebar />
      <div className="space-y-8">
        <div className="rounded-[2rem] border border-border bg-[#151B28]/90 p-8 shadow-glow">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-[#8B95AE]">Profile</p>
              <h2 className="text-3xl font-semibold text-white">Account overview</h2>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-[#B7C0D9]">
                Review and update your profile details securely.
              </p>
            </div>
            <div className="rounded-3xl border border-border bg-[#11151F]/90 p-4 text-center">
              <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-[#202639] text-2xl text-white">
                {currentUser?.name?.charAt(0) || "U"}
              </div>
              <p className="text-sm text-[#A3AFC8]">Profile image</p>
            </div>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-[2rem] border border-border bg-[#151B28]/90 p-8 shadow-glow">
            <form className="space-y-6">
              <div>
                <label className="mb-2 block text-sm text-[#A3AFC8]">Name</label>
                <input className={styles.input} name="name" value={form.name} onChange={handleChange} />
              </div>
              <div>
                <label className="mb-2 block text-sm text-[#A3AFC8]">Email</label>
                <input className={styles.input} name="email" value={form.email} onChange={handleChange} />
              </div>
              <button className={styles.buttonPrimary} type="button">
                Save changes
              </button>
            </form>
          </div>

          <div className="rounded-[2rem] border border-border bg-[#151B28]/90 p-8 shadow-glow">
            <p className="text-sm uppercase tracking-[0.3em] text-[#8B95AE]">Account details</p>
            <div className="mt-6 space-y-4 text-sm text-[#A3AFC8]">
              <div className="flex items-center justify-between rounded-3xl border border-border bg-[#11151F]/70 p-4">
                <span>Name</span>
                <span className="text-white">{form.name}</span>
              </div>
              <div className="flex items-center justify-between rounded-3xl border border-border bg-[#11151F]/70 p-4">
                <span>Email</span>
                <span className="text-white">{form.email}</span>
              </div>
              <div className="flex items-center justify-between rounded-3xl border border-border bg-[#11151F]/70 p-4">
                <span>Role</span>
                <span className="text-white">{form.role}</span>
              </div>
              <div className="flex items-center justify-between rounded-3xl border border-border bg-[#11151F]/70 p-4">
                <span>Created</span>
                <span className="text-white">{form.createdAt}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
