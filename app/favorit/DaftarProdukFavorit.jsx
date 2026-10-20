"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import KartuProduk from "@/components/KartuProduk";
import { useFavorit } from "@/lib/FavoritContext";

export default function DaftarProdukFavorit({ semuaProduk = [] }) {
  const { favoritIds } = useFavorit();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="py-16 text-center text-sm text-teks-lembut">
        Memuat produk favorit Anda...
      </div>
    );
  }

  const produkFavorit = semuaProduk.filter((p) =>
    favoritIds.includes(String(p.id))
  );

  if (produkFavorit.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
        <span className="text-5xl">❤️</span>
        <h2 className="text-lg font-bold text-teks">Belum Ada Produk Favorit</h2>
        <p className="max-w-md text-sm text-teks-lembut">
          Tandai produk yang Anda sukai dengan menekan ikon hati pada kartu produk atau halaman detail.
        </p>
        <Link
          href="/"
          className="mt-2 inline-flex items-center justify-center rounded-xl bg-utama px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-utama-gelap"
        >
          Jelajahi Produk
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <p className="text-sm text-teks-lembut">
          Menampilkan <strong className="text-teks">{produkFavorit.length}</strong> produk favorit tersimpan.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
        {produkFavorit.map((produk) => (
          <KartuProduk key={produk.id} produk={produk} />
        ))}
      </div>
    </div>
  );
}
