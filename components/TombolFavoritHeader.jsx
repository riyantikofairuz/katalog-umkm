"use client";

import Link from "next/link";
import { useFavorit } from "@/lib/FavoritContext";

export default function TombolFavoritHeader() {
  const { totalFavorit } = useFavorit();

  return (
    <Link
      href="/favorit"
      className="relative flex items-center gap-1.5 rounded-xl border border-garis bg-latar px-3.5 py-2 text-xs font-semibold text-teks transition hover:border-utama hover:text-utama"
      aria-label="Lihat produk favorit"
    >
      <span className="text-rose-500">❤️</span>
      <span className="hidden sm:inline">Favorit</span>
      {totalFavorit > 0 && (
        <span className="flex h-5 min-w-[20px] items-center justify-center rounded-full bg-rose-500 px-1 text-[10px] font-bold text-white">
          {totalFavorit}
        </span>
      )}
    </Link>
  );
}
