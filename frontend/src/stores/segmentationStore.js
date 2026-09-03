import { create } from "zustand";

export const useSegmentationStore = create((set) => ({
  status: "idle",
  progress: 0,
  maskUrl: null,

  setStatus: (status) => set({ status }),
  setProgress: (progress) => set({ progress }),
  setMaskUrl: (maskUrl) => set({ maskUrl }),
}));