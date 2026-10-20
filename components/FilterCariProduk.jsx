"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";

export default function FilterCariProduk({ kategoriList = [], kategoriTerpilih = "", kataKunci = "" }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const updateUrl = (kategoriBaru, queryBaru) => {
    const params = new URLSearchParams(searchParams.toString());

    if (kategoriBaru !== undefined) {
      if (kategoriBaru) {
        params.set("kategori", kategoriBaru);
      } else {
        params.delete("kategori");
      }
    }

    if (queryBaru !== undefined) {
      if (queryBaru.trim()) {
        params.set("q", queryBaru.trim());
      } else {
        params.delete("q");
      }
    }

    const queryString = params.toString();
    startTransition(() => {
      router.push(queryString ? `/?${queryString}` : "/");
    });
  };

  const handleCari = (e) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const q = formData.get("q")?.toString() || "";
    updateUrl(undefined, q);
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Form pencarian */}
      <form onSubmit={handleCari} className="flex gap-2">
        <div className="relative flex-1">
          <input
            name="q"
            type="search"
            defaultValue={kataKunci}
            placeholder="Cari nama produk..."
            className="w-full rounded-xl border border-garis bg-latar px-4 py-2.5 text-sm text-teks placeholder:text-teks-lembut focus:border-utama focus:outline-none"
          />
        </div>
        <button
          type="submit"
          disabled={isPending}
          className="inline-flex items-center justify-center rounded-xl bg-utama px-5 py-2.5 text-sm font-semibold text-white hover:bg-utama-gelap disabled:opacity-70"
        >
          {isPending ? "Mencari..." : "Cari"}
        </button>
        {(kataKunci || kategoriTerpilih) && (
          <button
            type="button"
            onClick={() => {
              startTransition(() => router.push("/"));
            }}
            className="rounded-xl border border-garis px-3 py-2.5 text-sm font-medium text-teks-lembut hover:bg-permukaan"
          >
            Reset
          </button>
        )}
      </form>

      {/* Filter Kategori */}
      {kategoriList.length > 0 && (
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => updateUrl("", undefined)}
            className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition ${
              !kategoriTerpilih
                ? "bg-utama text-white"
                : "border border-garis bg-latar text-teks-lembut hover:border-utama hover:text-utama"
            }`}
          >
            Semua
          </button>
          {kategoriList.map((kat) => (
            <button
              key={kat}
              type="button"
              onClick={() => updateUrl(kat === kategoriTerpilih ? "" : kat, undefined)}
              className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition ${
                kat === kategoriTerpilih
                  ? "bg-utama text-white"
                  : "border border-garis bg-latar text-teks-lembut hover:border-utama hover:text-utama"
              }`}
            >
              {kat}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
