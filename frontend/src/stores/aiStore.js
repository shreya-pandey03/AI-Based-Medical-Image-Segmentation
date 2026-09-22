import { create } from "zustand";
import {
  getAIAnalysis,
  verifyRegion,
} from "../services/ai.service";

const useAIStore = create((set) => ({
  scan: null,
  selectedRegion: null,
  isLoading: false,
  isVerifying: false,
  error: null,

  fetchAnalysis: async (scanId) => {
    set({
      isLoading: true,
      error: null,
    });

    try {
      const scan = await getAIAnalysis(scanId);

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
          "Failed to load AI analysis",
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

  verifyRegion: async (regionId, data) => {
    set({
      isVerifying: true,
      error: null,
    });

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
        isVerifying: false,
      }));

      return updatedRegion;
    } catch (error) {
      set({
        isVerifying: false,
        error:
          error.response?.data?.message ||
          "Failed to verify region",
      });

      throw error;
    }
  },

  clearError: () => {
    set({
      error: null,
    });
  },

  reset: () => {
    set({
      scan: null,
      selectedRegion: null,
      isLoading: false,
      isVerifying: false,
      error: null,
    });
  },
}));

export default useAIStore;