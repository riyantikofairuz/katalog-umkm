"use client";

import { useKeranjang } from "@/lib/KeranjangContext";

export default function TombolKeranjangHeader() {
  const { totalItem, setIsBuka } = useKeranjang();

  return (
    <button
      type="button"
      onClick={() => setIsBuka(true)}
      className="relative flex items-center gap-1.5 rounded-xl border border-garis bg-latar px-3.5 py-2 text-xs font-semibold text-teks transition hover:border-utama hover:text-utama"
      aria-label="Buka keranjang belanja"
    >
      <span className="text-base">🛒</span>
      <span className="hidden sm:inline">Keranjang</span>
      {totalItem > 0 && (
        <span className="flex h-5 min-w-[20px] items-center justify-center rounded-full bg-utama px-1 text-[10px] font-bold text-white">
          {totalItem}
        </span>
      )}
    </button>
  );
}
