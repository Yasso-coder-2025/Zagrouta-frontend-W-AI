import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export const useAuth = create(
  persist(
    (set) => ({
      user: null, // null means not logged in. Example logged in user: { email: "test@x.com", fullName: "Test User", role: "CUSTOMER" }
      login: (userData) => set({ user: userData }),
      logout: () => set({ user: null }),
    }),
    {
      name: 'auth-storage', // name of the item in the storage (must be unique)
      storage: createJSONStorage(() => localStorage), // (optional) by default, 'localStorage' is used
    }
  )
);
