"use client";

import { createContext, useContext, useEffect, useState } from "react";

const KeranjangContext = createContext();

export function KeranjangProvider({ children }) {
  const [items, setItems] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isBuka, setIsBuka] = useState(false);

  // Muat dari localStorage saat mount
  useEffect(() => {
    try {
      const tersimpan = localStorage.getItem("katalog_umkm_keranjang");
      if (tersimpan) {
        setItems(JSON.parse(tersimpan));
      }
    } catch {
      // Abaikan error localStorage
    }
    setIsLoaded(true);
  }, []);

  // Simpan ke localStorage saat items berubah
  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem("katalog_umkm_keranjang", JSON.stringify(items));
      } catch {
        // Abaikan
      }
    }
  }, [items, isLoaded]);

  const tambahItem = (produk, jumlah = 1, varian = "Reguler") => {
    setItems((prev) => {
      const hargaPakai =
        produk.harga_diskon && produk.harga_diskon > 0
          ? produk.harga_diskon
          : produk.harga;

      const key = `${produk.id}_${varian}`;
      const index = prev.findIndex((item) => item.key === key);

      if (index > -1) {
        const baru = [...prev];
        baru[index].jumlah += jumlah;
        return baru;
      }

      return [
        ...prev,
        {
          key,
          id: produk.id,
          nama: produk.nama,
          harga: hargaPakai,
          foto_url: produk.foto_url,
          kategori: produk.kategori,
          varian,
          jumlah,
        },
      ];
    });
    setIsBuka(true);
  };

  const ubahJumlah = (key, delta) => {
    setItems((prev) =>
      prev
        .map((item) => {
          if (item.key === key) {
            const jmlBaru = item.jumlah + delta;
            return jmlBaru > 0 ? { ...item, jumlah: jmlBaru } : null;
          }
          return item;
        })
        .filter(Boolean)
    );
  };

  const hapusItem = (key) => {
    setItems((prev) => prev.filter((item) => item.key !== key));
  };

  const kosongkanKeranjang = () => {
    setItems([]);
  };

  const totalItem = items.reduce((acc, curr) => acc + curr.jumlah, 0);
  const totalHarga = items.reduce((acc, curr) => acc + curr.harga * curr.jumlah, 0);

  return (
    <KeranjangContext.Provider
      value={{
        items,
        totalItem,
        totalHarga,
        tambahItem,
        ubahJumlah,
        hapusItem,
        kosongkanKeranjang,
        isBuka,
        setIsBuka,
      }}
    >
      {children}
    </KeranjangContext.Provider>
  );
}

export function useKeranjang() {
  const ctx = useContext(KeranjangContext);
  if (!ctx) {
    throw new Error("useKeranjang harus dipakai di dalam KeranjangProvider");
  }
  return ctx;
}
