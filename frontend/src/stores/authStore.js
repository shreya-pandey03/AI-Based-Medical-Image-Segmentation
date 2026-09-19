import { create } from "zustand";
import {
  getCurrentUser,
  loginUser,
  logoutUser,
  registerUser,
} from "../services/auth.service";

const useAuthStore = create((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,

  register: async (formData) => {
    const data = await registerUser(formData);

    if (data?.user) {
      set({
        user: data.user,
        isAuthenticated: true,
        isLoading: false,
      });
    }

    return data;
  },

  login: async (credentials) => {
    const data = await loginUser(credentials);

    if (data?.user) {
      set({
        user: data.user,
        isAuthenticated: true,
        isLoading: false,
      });
    }

    return data;
  },

  checkAuth: async () => {
    try {
      const data = await getCurrentUser();
      const user = data?.user ?? data;

      if (user) {
        set({
          user,
          isAuthenticated: true,
          isLoading: false,
        });

        return user;
      }

      set({
        user: null,
        isAuthenticated: false,
        isLoading: false,
      });

      return null;
    } catch {
      set({
        user: null,
        isAuthenticated: false,
        isLoading: false,
      });

      return null;
    }
  },

  logout: async () => {
    try {
      await logoutUser();
    } finally {
      set({
        user: null,
        isAuthenticated: false,
        isLoading: false,
      });
    }
  },
}));

export default useAuthStore;
