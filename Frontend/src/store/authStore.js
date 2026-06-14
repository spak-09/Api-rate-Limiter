import { create } from "zustand";

const storedUser = (() => {
  try {
    return JSON.parse(localStorage.getItem("rateshield_user") || "null");
  } catch {
    return null;
  }
})();

export const useAuthStore = create((set) => ({
  currentUser: storedUser,
  token: localStorage.getItem("rateshield_token") || null,
  loading: false,
  error: null,
  setCurrentUser: (user) => {
    localStorage.setItem("rateshield_user", JSON.stringify(user));
    set({ currentUser: user });
  },
  setToken: (token) => {
    localStorage.setItem("rateshield_token", token);
    set({ token });
  },
  clearAuth: () => {
    localStorage.removeItem("rateshield_token");
    localStorage.removeItem("rateshield_user");
    set({ currentUser: null, token: null });
  },
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
}));
