import { create } from "zustand";

export const useUserStore = create((set) => ({
  profile: null,
  stats: null,
  recentActivity: [],
  setProfile: (profile) => set({ profile }),
  setStats: (stats) => set({ stats }),
  setRecentActivity: (activity) => set({ recentActivity: activity }),
}));
