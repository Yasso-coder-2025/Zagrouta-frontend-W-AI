import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export const useBookings = create(
  persist(
    (set) => ({
      bookings: [],
      addBooking: (booking) => set((state) => ({ 
        bookings: [...state.bookings, { id: Date.now().toString(), ...booking }] 
      })),
      removeBooking: (id) => set((state) => ({
        bookings: state.bookings.filter(b => b.id !== id)
      })),
    }),
    {
      name: 'bookings-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
