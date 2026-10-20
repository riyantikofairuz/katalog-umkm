"use client";

import { useFavorit } from "@/lib/FavoritContext";

export default function TombolFavorit({ id, nama, className = "" }) {
  const { isFavorit, toggleFavorit } = useFavorit();
  const aktif = isFavorit(id);

  const handleClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorit(id);
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className={`flex h-8 w-8 items-center justify-center rounded-full bg-latar/80 backdrop-blur-xs text-base transition shadow-sm hover:scale-110 ${className}`}
      aria-label={aktif ? `Hapus ${nama} dari favorit` : `Tambahkan ${nama} ke favorit`}
      title={aktif ? "Hapus dari favorit" : "Tambah ke favorit"}
    >
      <span className={aktif ? "text-rose-500 scale-110 transition-transform" : "text-teks-lembut"}>
        {aktif ? "❤️" : "🤍"}
      </span>
    </button>
  );
}
