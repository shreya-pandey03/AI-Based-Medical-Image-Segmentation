import { create } from "zustand";
import {
  uploadAndAnalyzeScan,
  getScanById,
  verifyDetectedRegion,
  deleteScan,
} from "../services/scan.service";

const useScanStore = create((set) => ({
  scans: [],
  selectedScan: null,

  isLoading: false,
  isUploading: false,
  error: null,

  uploadScan: async (formData) => {
    set({
      isUploading: true,
      error: null,
    });

    try {
      const scan = await uploadAndAnalyzeScan(formData);

      set((state) => ({
        scans: [scan, ...state.scans],
        selectedScan: scan,
        isUploading: false,
      }));

      return scan;
    } catch (error) {
      set({
        error:
          error.response?.data?.message ||
          "Failed to upload and analyze scan",
        isUploading: false,
      });

      throw error;
    }
  },

  fetchScan: async (id) => {
    set({
      isLoading: true,
      error: null,
    });

    try {
      const scan = await getScanById(id);

      set({
        selectedScan: scan,
        isLoading: false,
      });

      return scan;
    } catch (error) {
      set({
        error:
          error.response?.data?.message ||
          "Failed to fetch scan",
        isLoading: false,
      });

      throw error;
    }
  },

  verifyRegion: async (regionId, data) => {
    try {
      const region = await verifyDetectedRegion(
        regionId,
        data
      );

      set((state) => {
        if (!state.selectedScan?.analysis) {
          return state;
        }

        return {
          selectedScan: {
            ...state.selectedScan,
            analysis: {
              ...state.selectedScan.analysis,
              detectedRegions:
                state.selectedScan.analysis.detectedRegions.map(
                  (item) =>
                    item._id === region._id
                      ? region
                      : item
                ),
            },
          },
        };
      });

      return region;
    } catch (error) {
      set({
        error:
          error.response?.data?.message ||
          "Failed to verify detected region",
      });

      throw error;
    }
  },

  removeScan: async (id) => {
    try {
      await deleteScan(id);

      set((state) => ({
        scans: state.scans.filter(
          (scan) => scan._id !== id
        ),
        selectedScan:
          state.selectedScan?._id === id
            ? null
            : state.selectedScan,
      }));
    } catch (error) {
      set({
        error:
          error.response?.data?.message ||
          "Failed to delete scan",
      });

      throw error;
    }
  },

  clearSelectedScan: () => {
    set({
      selectedScan: null,
    });
  },

  clearError: () => {
    set({
      error: null,
    });
  },
}));

export default useScanStore;