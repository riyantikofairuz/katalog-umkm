"use client";

import { useTransition } from "react";
import { beralihStatusProduk } from "@/app/admin/actions";

export default function TombolStatusProduk({ id, isAktif }) {
  const [isPending, startTransition] = useTransition();

  const handleToggle = () => {
    startTransition(async () => {
      await beralihStatusProduk(id, isAktif);
    });
  };

  return (
    <button
      type="button"
      onClick={handleToggle}
      disabled={isPending}
      title={isAktif ? "Klik untuk menonaktifkan produk" : "Klik untuk mengaktifkan produk"}
      className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-semibold transition disabled:opacity-50 ${
        isAktif
          ? "border border-utama/30 bg-utama/10 text-utama hover:bg-utama hover:text-white"
          : "border border-garis/80 bg-permukaan text-teks-lembut hover:border-teks hover:text-teks"
      }`}
    >
      <span
        className={`h-2 w-2 rounded-full ${
          isAktif ? "bg-utama animate-pulse" : "bg-teks-lembut"
        }`}
      />
      {isPending
        ? "Memproses..."
        : isAktif
        ? "Aktif"
        : "Nonaktif"}
    </button>
  );
}
