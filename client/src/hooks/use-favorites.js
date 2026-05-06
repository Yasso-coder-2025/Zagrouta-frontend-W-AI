import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export const useFavorites = create(
  persist(
    (set) => ({
      favorites: [],
      toggleFavorite: (id) => set((state) => {
        if (state.favorites.includes(id)) {
          return { favorites: state.favorites.filter(favId => favId !== id) };
        } else {
          return { favorites: [...state.favorites, id] };
        }
      }),
    }),
    {
      name: 'favorites-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
