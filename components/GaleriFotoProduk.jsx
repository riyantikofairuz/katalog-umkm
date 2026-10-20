"use client";

import { useState } from "react";

export default function GaleriFotoProduk({ fotoUrl, namaProduk, fotoLainnya = [] }) {
  // Parsing daftar foto: bisa berupa array, atau string foto_url tunggal, atau string dipisah koma/newline
  const parseDaftarFoto = () => {
    let list = [];
    if (Array.isArray(fotoLainnya) && fotoLainnya.length > 0) {
      list = [...fotoLainnya];
    } else if (fotoUrl) {
      if (fotoUrl.includes(",") || fotoUrl.includes("\n")) {
        list = fotoUrl
          .split(/[\n,]+/)
          .map((s) => s.trim())
          .filter(Boolean);
      } else {
        list = [fotoUrl.trim()];
      }
    }

    if (list.length === 0 && fotoUrl) {
      list = [fotoUrl];
    }

    // Jika list hanya punya 1 dan kita punya foto placeholder bawaan untuk mendemonstrasikan galeri multi-foto
    return list;
  };

  const semuaFoto = parseDaftarFoto();
  const [fotoAktif, setFotoAktif] = useState(semuaFoto[0] || fotoUrl || "");

  return (
    <div className="flex flex-col gap-3">
      {/* Foto Utama */}
      <div className="relative aspect-square w-full overflow-hidden rounded-2xl border border-garis bg-permukaan">
        <img
          src={fotoAktif || fotoUrl}
          alt={namaProduk}
          className="h-full w-full object-cover transition-all duration-300"
        />
      </div>

      {/* Galeri Gambar Kecil (Thumbnail) - Hanya tampil jika ada lebih dari 1 foto */}
      {semuaFoto.length > 1 && (
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {semuaFoto.map((foto, index) => {
            const terpilih = foto === fotoAktif;
            return (
              <button
                key={index}
                type="button"
                onClick={() => setFotoAktif(foto)}
                className={`relative aspect-square h-16 w-16 flex-shrink-0 overflow-hidden rounded-xl border-2 transition ${
                  terpilih
                    ? "border-utama ring-2 ring-utama/20"
                    : "border-garis opacity-70 hover:opacity-100"
                }`}
                aria-label={`Lihat foto ${index + 1}`}
              >
                <img
                  src={foto}
                  alt={`${namaProduk} - sudut ${index + 1}`}
                  className="h-full w-full object-cover"
                />
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
