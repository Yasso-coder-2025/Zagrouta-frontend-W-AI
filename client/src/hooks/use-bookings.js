import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export const useBookings = create(
  persist(
    (set) => ({
      bookings: [],
      isCartOpen: false,
      setCartOpen: (open) => set({ isCartOpen: open }),
      addBooking: (booking) => set((state) => {
        // Prevent duplicate services in cart (or allow if different dates? Let's check: users typically don't book the exact same service twice, but we can check if it exists or just add it. Let's check if the service is already in the cart, and if so, update its date/guests instead of duplicating, or just add a new item. Let's check by serviceId)
        const exists = state.bookings.some(b => b.serviceId === booking.serviceId);
        if (exists) {
          return {
            bookings: state.bookings.map(b => b.serviceId === booking.serviceId ? { ...b, ...booking } : b)
          };
        }
        return {
          bookings: [...state.bookings, { id: Date.now().toString(), ...booking }]
        };
      }),
      removeBooking: (id) => set((state) => ({
        bookings: state.bookings.filter(b => b.id !== id)
      })),
      updateBooking: (id, updatedFields) => set((state) => ({
        bookings: state.bookings.map(b => b.id === id ? { ...b, ...updatedFields } : b)
      })),
      clearBookings: () => set({ bookings: [] }),
    }),
    {
      name: 'bookings-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ bookings: state.bookings }),
    }
  )
);
