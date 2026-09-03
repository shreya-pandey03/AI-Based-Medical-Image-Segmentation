import { create } from "zustand";

export const useViewerStore = create((set) => ({
  currentSlice: 0,
  totalSlices: 0,
  zoom: 1,
  opacity: 1,
  windowWidth: 400,
  windowCenter: 40,

  setCurrentSlice: (currentSlice) => set({ currentSlice }),
  setTotalSlices: (totalSlices) => set({ totalSlices }),
  setZoom: (zoom) => set({ zoom }),
  setOpacity: (opacity) => set({ opacity }),
  setWindowWidth: (windowWidth) => set({ windowWidth }),
  setWindowCenter: (windowCenter) => set({ windowCenter }),
}));