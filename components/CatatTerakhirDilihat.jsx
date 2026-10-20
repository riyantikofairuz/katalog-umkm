"use client";

import { useEffect } from "react";

const KEY_STORAGE = "katalog_umkm_terakhir_dilihat";
const MAX_ITEM = 6;

export default function CatatTerakhirDilihat({ produk }) {
  useEffect(() => {
    if (!produk || !produk.id) return;

    try {
      const raw = localStorage.getItem(KEY_STORAGE);
      const list = raw ? JSON.parse(raw) : [];

      // Filter item yang sudah ada agar tidak duplikat
      const filtered = list.filter((item) => String(item.id) !== String(produk.id));

      // Tambahkan item terbaru di awal
      const itemBaru = {
        id: produk.id,
        nama: produk.nama,
        harga: produk.harga,
        harga_diskon: produk.harga_diskon || null,
        kategori: produk.kategori || "",
        foto_url: produk.foto_url || "",
        stok: produk.stok !== undefined ? produk.stok : null,
        badge: produk.badge || null,
        dilihatPada: Date.now(),
      };

      const updated = [itemBaru, ...filtered].slice(0, MAX_ITEM);
      localStorage.setItem(KEY_STORAGE, JSON.stringify(updated));
    } catch {
      // Abaikan jika localStorage tidak tersedia
    }
  }, [produk]);

  return null;
}
