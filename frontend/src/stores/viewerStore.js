import { create } from "zustand";
import {
  getScanForViewer,
  verifyRegion,
} from "../services/viewer.service";

const useViewerStore = create((set) => ({
  scan: null,
  selectedRegion: null,
  isLoading: false,
  error: null,
  zoom: 1,
  showOverlay: true,

  fetchScan: async (id) => {
    set({
      isLoading: true,
      error: null,
    });

    try {
      const scan = await getScanForViewer(id);

      set({
        scan,
        isLoading: false,
      });

      return scan;
    } catch (error) {
      set({
        isLoading: false,
        error:
          error.response?.data?.message ||
          "Failed to load scan",
      });

      throw error;
    }
  },

  selectRegion: (region) => {
    set({
      selectedRegion: region,
    });
  },

  clearSelectedRegion: () => {
    set({
      selectedRegion: null,
    });
  },

  verifySelectedRegion: async (regionId, data) => {
    try {
      const updatedRegion = await verifyRegion(
        regionId,
        data
      );

      set((state) => ({
        scan: state.scan
          ? {
              ...state.scan,
              analysis: state.scan.analysis
                ? {
                    ...state.scan.analysis,
                    detectedRegions:
                      state.scan.analysis.detectedRegions.map(
                        (region) =>
                          region._id ===
                          updatedRegion._id
                            ? updatedRegion
                            : region
                      ),
                  }
                : state.scan.analysis,
            }
          : null,
        selectedRegion: updatedRegion,
      }));

      return updatedRegion;
    } catch (error) {
      set({
        error:
          error.response?.data?.message ||
          "Failed to verify region",
      });

      throw error;
    }
  },

  zoomIn: () => {
    set((state) => ({
      zoom: Math.min(
        Number((state.zoom + 0.25).toFixed(2)),
        4
      ),
    }));
  },

  zoomOut: () => {
    set((state) => ({
      zoom: Math.max(
        Number((state.zoom - 0.25).toFixed(2)),
        0.5
      ),
    }));
  },

  resetZoom: () => {
    set({
      zoom: 1,
    });
  },

  toggleOverlay: () => {
    set((state) => ({
      showOverlay: !state.showOverlay,
    }));
  },

  resetViewer: () => {
    set({
      selectedRegion: null,
      zoom: 1,
      showOverlay: true,
      error: null,
    });
  },
}));

export default useViewerStore;