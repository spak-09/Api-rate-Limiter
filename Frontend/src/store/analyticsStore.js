import { create } from "zustand";

export const useAnalyticsStore = create((set) => ({
  requestTrend: [],
  blockedTrend: [],
  algorithmDistribution: [],
  topUsers: [],
  setRequestTrend: (data) => set({ requestTrend: data }),
  setBlockedTrend: (data) => set({ blockedTrend: data }),
  setAlgorithmDistribution: (data) => set({ algorithmDistribution: data }),
  setTopUsers: (data) => set({ topUsers: data }),
}));
