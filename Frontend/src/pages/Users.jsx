import { useEffect, useMemo, useState } from "react";
import { Navigate } from "react-router-dom";
import axiosInstance from "../api/axiosInstance.js";
import { Sidebar } from "../components/Sidebar.jsx";
import { useAuthStore } from "../store/authStore.js";

export const Users = () => {
  const currentUser = useAuthStore((state) => state.currentUser);
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadUsers = async () => {
      if (!currentUser) return;
      setLoading(true);
      setError(null);

      try {
        const response = await axiosInstance.get("/api/admin/users");
        setUsers(response.data.users || []);
      } catch (fetchError) {
        setError(fetchError.response?.data?.message || "Unable to load users");
      } finally {
        setLoading(false);
      }
    };

    loadUsers();
  }, [currentUser]);

  const filteredUsers = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) {
      return users;
    }

    return users.filter((user) =>
      user.name?.toLowerCase().includes(query) || user.email?.toLowerCase().includes(query)
    );
  }, [search, users]);

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  if (currentUser.role !== "admin") {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
      <Sidebar />
      <div className="space-y-8">
        <div className="rounded-[2rem] border border-border bg-[#151B28]/90 p-8 shadow-glow">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-[#8B95AE]">Users</p>
              <h2 className="text-3xl font-semibold text-white">Team members</h2>
            </div>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search users"
              className="w-full max-w-sm rounded-2xl border border-border bg-[#11151F] px-4 py-3 text-sm text-text outline-none focus:border-accent"
            />
          </div>
        </div>

        {error && (
          <div className="rounded-[2rem] border border-danger/20 bg-[#2B1318] p-6 text-sm text-danger">
            {error}
          </div>
        )}

        <div className="overflow-hidden rounded-[2rem] border border-border bg-[#151B28]/90 shadow-glow">
          {loading ? (
            <div className="p-8 text-center text-sm text-[#A3AFC8]">Loading users...</div>
          ) : filteredUsers.length === 0 ? (
            <div className="p-8 text-center text-sm text-[#A3AFC8]">No users found</div>
          ) : (
            <table className="min-w-full border-separate border-spacing-0 text-left text-sm">
              <thead className="bg-[#11151F]">
                <tr>
                  <th className="px-6 py-4 text-[#8B95AE]">Profile</th>
                  <th className="px-6 py-4 text-[#8B95AE]">Name</th>
                  <th className="px-6 py-4 text-[#8B95AE]">Email</th>
                  <th className="px-6 py-4 text-[#8B95AE]">Role</th>
                  <th className="px-6 py-4 text-[#8B95AE]">Created</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user._id} className="border-t border-border hover:bg-[#11151F]">
                    <td className="px-6 py-4 text-text">
                      <div className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#202639] text-sm font-semibold text-white">
                        {user.profileImageUrl ? (
                          <img src={user.profileImageUrl} alt={user.name} className="h-10 w-10 rounded-full object-cover" />
                        ) : (
                          user.name?.charAt(0).toUpperCase() || "U"
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-text">{user.name}</td>
                    <td className="px-6 py-4 text-[#A3AFC8]">{user.email}</td>
                    <td className="px-6 py-4 text-text">{user.role}</td>
                    <td className="px-6 py-4 text-[#A3AFC8]">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};
