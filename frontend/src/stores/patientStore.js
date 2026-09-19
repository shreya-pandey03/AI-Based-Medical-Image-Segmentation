import { create } from "zustand";
import {
  createPatient,
  getDoctorPatients,
  getPatientById,
  updatePatient,
  deletePatient,
} from "../services/patient.service";

const usePatientStore = create((set) => ({
  patients: [],
  selectedPatient: null,
  patientScans: [],

  isLoading: false,
  isCreating: false,
  isUpdating: false,
  error: null,

  fetchPatients: async (search = "") => {
    set({
      isLoading: true,
      error: null,
    });

    try {
      const data = await getDoctorPatients(search);

      set({
        patients: Array.isArray(data) ? data : [],
        isLoading: false,
      });

      return data;
    } catch (error) {
      set({
        error: error.response?.data?.message || "Failed to fetch patients",
        isLoading: false,
      });

      throw error;
    }
  },

  addPatient: async (patientData) => {
    set({
      isCreating: true,
      error: null,
    });

    try {
      await createPatient(patientData);

      const patients = await getDoctorPatients();

      set({
        patients: Array.isArray(patients) ? patients : [],
        isCreating: false,
      });
    } catch (error) {
      set({
        error: error.response?.data?.message || "Failed to create patient",
        isCreating: false,
      });

      throw error;
    }
  },

  fetchPatient: async (id) => {
    set({
      isLoading: true,
      error: null,
    });

    try {
      const data = await getPatientById(id);

      set({
        selectedPatient: data?.patient ?? null,
        patientScans: data?.scans ?? [],
        isLoading: false,
      });

      return data;
    } catch (error) {
      set({
        error: error.response?.data?.message || "Failed to fetch patient",
        isLoading: false,
      });

      throw error;
    }
  },

  editPatient: async (id, patientData) => {
    set({
      isUpdating: true,
      error: null,
    });

    try {
      const updatedPatient = await updatePatient(id, patientData);

      set((state) => ({
        patients: state.patients.map((patient) =>
          patient._id === id ? updatedPatient : patient,
        ),
        selectedPatient:
          state.selectedPatient?._id === id
            ? updatedPatient
            : state.selectedPatient,
        isUpdating: false,
      }));

      return updatedPatient;
    } catch (error) {
      set({
        error: error.response?.data?.message || "Failed to update patient",
        isUpdating: false,
      });

      throw error;
    }
  },

  removePatient: async (id) => {
    set({
      error: null,
    });

    try {
      await deletePatient(id);

      set((state) => ({
        patients: state.patients.filter((patient) => patient._id !== id),
        selectedPatient:
          state.selectedPatient?._id === id ? null : state.selectedPatient,
      }));
    } catch (error) {
      set({
        error: error.response?.data?.message || "Failed to delete patient",
      });

      throw error;
    }
  },

  clearSelectedPatient: () => {
    set({
      selectedPatient: null,
      patientScans: [],
    });
  },

  clearError: () => {
    set({
      error: null,
    });
  },
}));

export default usePatientStore;
