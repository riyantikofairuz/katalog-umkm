"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useTransition } from "react";

export default function PencarianAdmin({ nilaiAwal = "" }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [kataKunci, setKataKunci] = useState(nilaiAwal);
  const [isPending, startTransition] = useTransition();

  const handleCari = (e) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams.toString());
    const query = kataKunci.trim();

    if (query) {
      params.set("q", query);
    } else {
      params.delete("q");
    }

    // Reset ke halaman 1 saat pencarian baru
    params.delete("halaman");

    startTransition(() => {
      const str = params.toString();
      router.push(str ? `/admin?${str}` : "/admin");
    });
  };

  const handleReset = () => {
    setKataKunci("");
    const params = new URLSearchParams(searchParams.toString());
    params.delete("q");
    params.delete("halaman");
    startTransition(() => {
      const str = params.toString();
      router.push(str ? `/admin?${str}` : "/admin");
    });
  };

  return (
    <form onSubmit={handleCari} className="flex flex-1 items-center gap-2 max-w-md">
      <div className="relative w-full">
        <input
          type="text"
          value={kataKunci}
          onChange={(e) => setKataKunci(e.target.value)}
          placeholder="Cari produk di admin..."
          className="w-full rounded-lg border border-garis bg-latar px-3 py-2 text-sm text-teks placeholder:text-teks-lembut focus:border-utama focus:outline-none"
        />
        {kataKunci && (
          <button
            type="button"
            onClick={handleReset}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-teks-lembut hover:text-teks"
            title="Hapus pencarian"
          >
            ✕
          </button>
        )}
      </div>
      <button
        type="submit"
        disabled={isPending}
        className="rounded-lg bg-utama px-4 py-2 text-xs font-semibold text-white hover:bg-utama/90 transition disabled:opacity-50"
      >
        {isPending ? "Mencari..." : "Cari"}
      </button>
    </form>
  );
}
