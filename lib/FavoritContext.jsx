"use client";

import { createContext, useContext, useEffect, useState } from "react";

const FavoritContext = createContext();

export function FavoritProvider({ children }) {
  const [favoritIds, setFavoritIds] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Muat dari localStorage saat awal mount
  useEffect(() => {
    try {
      const data = localStorage.getItem("katalog_umkm_favorit");
      if (data) {
        setFavoritIds(JSON.parse(data));
      }
    } catch {
      // Abaikan
    }
    setIsLoaded(true);
  }, []);

  // Simpan ke localStorage setiap ada perubahan
  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem("katalog_umkm_favorit", JSON.stringify(favoritIds));
      } catch {
        // Abaikan
      }
    }
  }, [favoritIds, isLoaded]);

  const toggleFavorit = (id) => {
    const strId = String(id);
    setFavoritIds((prev) =>
      prev.includes(strId) ? prev.filter((i) => i !== strId) : [...prev, strId]
    );
  };

  const isFavorit = (id) => favoritIds.includes(String(id));

  return (
    <FavoritContext.Provider
      value={{
        favoritIds,
        toggleFavorit,
        isFavorit,
        totalFavorit: favoritIds.length,
      }}
    >
      {children}
    </FavoritContext.Provider>
  );
}

export function useFavorit() {
  const ctx = useContext(FavoritContext);
  if (!ctx) {
    throw new Error("useFavorit harus dipakai di dalam FavoritProvider");
  }
  return ctx;
}
