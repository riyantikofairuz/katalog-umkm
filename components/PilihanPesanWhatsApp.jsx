"use client";

import { useState } from "react";
import { toko } from "@/lib/toko";
import { formatRupiah } from "@/lib/format";
import { useKeranjang } from "@/lib/KeranjangContext";

export default function PilihanPesanWhatsApp({ produk }) {
  const [jumlah, setJumlah] = useState(1);
  const { tambahItem } = useKeranjang();

  // US-19: Cek status ketersediaan stok
  const isHabis =
    produk.status === "habis" ||
    produk.stok === 0 ||
    produk.stok_tersedia === false;

  // Tentukan varian bawaan jika kategori atau produk relevan, atau opsi paket standar
  const daftarVarian = ["Reguler", "Spesial", "Hemat / Grosir"];
  const [varian, setVarian] = useState(daftarVarian[0]);

  const nomor = (toko.nomorWhatsApp || "").trim().replace(/[^0-9]/g, "");
  const totalHarga = produk.harga * jumlah;

  const pesan = `Halo ${toko.nama}, saya ingin memesan:
- Produk: ${produk.nama}
- Varian: ${varian}
- Jumlah: ${jumlah} pcs
- Total: ${formatRupiah(totalHarga)}

Apakah produk ini masih tersedia?`;

  const urlWhatsApp = `https://wa.me/${nomor}?text=${encodeURIComponent(pesan)}`;

  const handleTambahKeranjang = () => {
    tambahItem(produk, jumlah, varian);
  };

  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-garis bg-permukaan/50 p-4 sm:p-5">
      {/* Penanda Status Stok (US-19) */}
      {isHabis ? (
        <div className="flex items-center gap-2 rounded-xl border border-bahaya/30 bg-bahaya/10 p-3 text-sm font-semibold text-bahaya">
          <span className="flex h-2.5 w-2.5 rounded-full bg-bahaya"></span>
          Produk ini sedang habis
        </div>
      ) : (
        <div className="flex items-center gap-2 text-xs font-semibold text-utama">
          <span className="flex h-2 w-2 rounded-full bg-utama"></span>
          Stok tersedia
        </div>
      )}

      {/* Pilihan Varian */}
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-semibold uppercase tracking-wider text-teks-lembut">
          Pilih Varian
        </label>
        <div className="flex flex-wrap gap-2">
          {daftarVarian.map((item) => (
            <button
              key={item}
              type="button"
              disabled={isHabis}
              onClick={() => setVarian(item)}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                isHabis
                  ? "opacity-50 cursor-not-allowed border border-garis bg-latar text-teks-lembut"
                  : varian === item
                  ? "bg-utama text-white"
                  : "border border-garis bg-latar text-teks hover:border-utama"
              }`}
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      {/* Pilihan Jumlah */}
      <div className="flex items-center justify-between gap-4">
        <label className="text-xs font-semibold uppercase tracking-wider text-teks-lembut">
          Jumlah
        </label>
        <div className="flex items-center rounded-lg border border-garis bg-latar">
          <button
            type="button"
            onClick={() => setJumlah((prev) => Math.max(1, prev - 1))}
            disabled={isHabis || jumlah <= 1}
            className="flex h-9 w-9 items-center justify-center font-bold text-teks hover:bg-permukaan disabled:opacity-30"
            aria-label="Kurangi jumlah"
          >
            -
          </button>
          <span className="w-10 text-center text-sm font-semibold text-teks">
            {jumlah}
          </span>
          <button
            type="button"
            onClick={() => setJumlah((prev) => prev + 1)}
            disabled={isHabis}
            className="flex h-9 w-9 items-center justify-center font-bold text-teks hover:bg-permukaan disabled:opacity-30"
            aria-label="Tambah jumlah"
          >
            +
          </button>
        </div>
      </div>

      {/* Ringkasan Subtotal */}
      <div className="flex items-center justify-between border-t border-garis pt-3 text-sm">
        <span className="text-teks-lembut">Total ({jumlah} barang):</span>
        <span className="font-bold text-harga">{formatRupiah(totalHarga)}</span>
      </div>

      {/* Aksi: Tambah ke Keranjang (US-21) & Pesan WhatsApp Langsung */}
      {isHabis ? (
        <button
          type="button"
          disabled
          className="inline-flex w-full cursor-not-allowed items-center justify-center rounded-xl bg-garis px-5 py-3.5 font-semibold text-teks-lembut opacity-70"
        >
          Stok Habis (Tidak Dapat Dipesan)
        </button>
      ) : (
        <div className="flex flex-col gap-2 sm:flex-row">
          <button
            type="button"
            onClick={handleTambahKeranjang}
            className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-xl border-2 border-utama bg-latar px-4 py-3 font-semibold text-utama transition hover:bg-utama/10"
          >
            <span>🛒</span> Tambah ke keranjang
          </button>
          <a
            href={urlWhatsApp}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex flex-1 items-center justify-center rounded-xl bg-utama px-4 py-3 font-semibold text-white transition hover:bg-utama-gelap"
          >
            Pesan sekarang
          </a>
        </div>
      )}
    </div>
  );
}
