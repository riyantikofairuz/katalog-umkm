"use client";

import { useEffect, useState } from "react";
import KartuProduk from "@/components/KartuProduk";

const KEY_STORAGE = "katalog_umkm_terakhir_dilihat";

export default function TerakhirDilihat() {
  const [daftarProduk, setDaftarProduk] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY_STORAGE);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setDaftarProduk(parsed);
        }
      }
    } catch {
      // Abaikan jika error membaca localStorage
    }
    setIsLoaded(true);
  }, []);

  // Tidak muncul bila masih kosong atau belum dimuat di client
  if (!isLoaded || daftarProduk.length === 0) {
    return null;
  }

  return (
    <section aria-labelledby="judul-terakhir-dilihat" className="flex flex-col gap-4 border-t border-garis pt-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 id="judul-terakhir-dilihat" className="text-lg font-bold text-teks">
            Terakhir Dilihat
          </h2>
          <p className="text-xs text-teks-lembut">
            Produk yang baru-baru ini kamu buka di tokomu
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            localStorage.removeItem(KEY_STORAGE);
            setDaftarProduk([]);
          }}
          className="text-xs text-teks-lembut hover:text-bahaya underline underline-offset-2 transition"
        >
          Hapus riwayat
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
        {daftarProduk.map((produk) => (
          <KartuProduk key={produk.id} produk={produk} />
        ))}
      </div>
    </section>
  );
}
