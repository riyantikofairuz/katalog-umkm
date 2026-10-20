"use client";

import { useState, useTransition } from "react";
import Input from "@/components/Input";
import Tombol from "@/components/Tombol";
import { buatDeskripsiAI } from "@/app/admin/actions";

// Dipakai untuk tambah produk (US-08), ubah produk (US-09), AI generator (US-14), dan validasi server per field (US-34)
export default function FormProduk({
  produk = {},
  labelTombol,
  action,
  error,
  fieldErrors = {},
  values,
  isPending = false,
}) {
  const [nama, setNama] = useState(values?.nama ?? produk.nama ?? "");
  const [harga, setHarga] = useState(values?.harga ?? produk.harga ?? "");
  const [kategori, setKategori] = useState(values?.kategori ?? produk.kategori ?? "");
  const [fotoUrl, setFotoUrl] = useState(values?.foto_url ?? produk.foto_url ?? "");
  const [deskripsi, setDeskripsi] = useState(values?.deskripsi ?? produk.deskripsi ?? "");
  const [pesanAI, setPesanAI] = useState(null);
  const [isAiLoading, startAiTransition] = useTransition();

  // Sinkronkan state jika values baru diterima setelah validasi server
  const [prevValues, setPrevValues] = useState(values);
  if (values !== prevValues) {
    setPrevValues(values);
    if (values?.nama !== undefined) setNama(values.nama);
    if (values?.harga !== undefined) setHarga(values.harga);
    if (values?.kategori !== undefined) setKategori(values.kategori);
    if (values?.foto_url !== undefined) setFotoUrl(values.foto_url);
    if (values?.deskripsi !== undefined) setDeskripsi(values.deskripsi);
  }

  const handleBuatDeskripsiAI = () => {
    if (!nama.trim()) {
      setPesanAI({ tipe: "error", teks: "Isi nama produk terlebih dahulu." });
      return;
    }

    setPesanAI(null);
    startAiTransition(async () => {
      const res = await buatDeskripsiAI(nama, kategori);
      if (res?.error) {
        setPesanAI({ tipe: "error", teks: res.error });
      } else if (res?.deskripsi) {
        setDeskripsi(res.deskripsi);
        setPesanAI({ tipe: "sukses", teks: "Deskripsi berhasil dibuat dengan AI!" });
      }
    });
  };

  return (
    <form action={action} className="flex max-w-xl flex-col gap-4">
      {error && (
        <div className="rounded-lg border border-bahaya/20 bg-bahaya/10 p-3 text-sm text-bahaya">
          {error}
        </div>
      )}

      {/* Input Nama Produk dengan Error Per Field (US-34) */}
      <Input
        label="Nama produk"
        name="nama"
        value={nama}
        onChange={(e) => setNama(e.target.value)}
        error={fieldErrors?.nama}
        required
      />

      {/* Input Harga dengan Error Per Field (US-34) */}
      <Input
        label="Harga (Rp)"
        name="harga"
        type="number"
        min="0"
        value={harga}
        onChange={(e) => setHarga(e.target.value)}
        error={fieldErrors?.harga}
        required
      />

      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-semibold text-teks">Kategori</label>
        <div className="flex flex-col gap-2">
          <input
            list="list-kategori"
            name="kategori"
            value={kategori}
            onChange={(e) => setKategori(e.target.value)}
            placeholder="Pilih atau ketik kategori baru..."
            className="w-full rounded-lg border border-garis bg-latar px-3 py-2.5 text-base text-teks placeholder:text-teks-lembut focus:border-utama focus:outline-none"
          />
          <datalist id="list-kategori">
            {(produk.daftarKategori || []).map((kat) => (
              <option key={kat} value={kat} />
            ))}
          </datalist>
          {(produk.daftarKategori || []).length > 0 && (
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-xs text-teks-lembut">Pilihan cepat:</span>
              {(produk.daftarKategori || []).map((kat) => (
                <button
                  key={kat}
                  type="button"
                  onClick={() => setKategori(kat)}
                  className={`rounded-md px-2 py-0.5 text-xs font-medium transition ${
                    kategori === kat
                      ? "bg-utama text-white"
                      : "border border-garis/60 bg-permukaan text-teks hover:border-utama hover:text-utama"
                  }`}
                >
                  {kat}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-2 rounded-xl border border-garis/60 bg-permukaan/50 p-4">
        <label className="text-sm font-semibold text-teks">
          Foto Produk (Upload Komputer atau Link)
        </label>

        {/* Input File Foto (US-29) */}
        <div className="flex flex-col gap-1.5">
          <span className="text-xs text-teks-lembut">
            Unggah foto dari perangkat (Maks 2 MB: JPG, PNG, WebP, SVG):
          </span>
          <input
            type="file"
            name="file_foto"
            accept="image/*"
            className="w-full rounded-lg border border-garis bg-latar px-3 py-2 text-sm text-teks file:mr-3 file:rounded-md file:border-0 file:bg-utama/15 file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-utama hover:file:bg-utama/25 cursor-pointer focus:outline-none"
          />
        </div>

        <div className="relative flex py-1 items-center">
          <div className="flex-grow border-t border-garis/60"></div>
          <span className="flex-shrink mx-2 text-[11px] text-teks-lembut uppercase tracking-wider">
            atau gunakan tautan
          </span>
          <div className="flex-grow border-t border-garis/60"></div>
        </div>

        <Input
          label="Link foto manual"
          name="foto_url"
          placeholder="https://... atau /produk/nama-file.svg"
          value={fotoUrl}
          onChange={(e) => setFotoUrl(e.target.value)}
          error={fieldErrors?.foto_url}
        />

        {produk.foto_url && (
          <div className="mt-2 flex items-center gap-3">
            <span className="text-xs text-teks-lembut">Foto saat ini:</span>
            <img
              src={produk.foto_url}
              alt={produk.nama || "Preview foto"}
              className="h-12 w-12 rounded-lg object-cover border border-garis shadow-xs"
            />
          </div>
        )}
      </div>

      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between">
          <label className="text-sm font-semibold">Deskripsi</label>
          <button
            type="button"
            onClick={handleBuatDeskripsiAI}
            disabled={isAiLoading}
            className="inline-flex items-center gap-1 rounded-lg border border-utama/30 bg-utama/10 px-2.5 py-1 text-xs font-semibold text-utama transition hover:bg-utama hover:text-white disabled:opacity-50"
          >
            {isAiLoading ? "Sedang membuatkan..." : "✨ Buat dengan AI"}
          </button>
        </div>

        {pesanAI && (
          <p
            className={`text-xs ${
              pesanAI.tipe === "sukses" ? "text-utama font-medium" : "text-bahaya"
            }`}
          >
            {pesanAI.teks}
          </p>
        )}

        <textarea
          name="deskripsi"
          rows={4}
          value={deskripsi}
          onChange={(e) => setDeskripsi(e.target.value)}
          placeholder="Deskripsi produk atau tekan 'Buat dengan AI'..."
          className="w-full rounded-lg border border-garis bg-latar px-3 py-2.5 text-base text-teks placeholder:text-teks-lembut focus:border-utama focus:outline-none"
        />
      </div>

      <div className="flex gap-3 pt-2">
        <Tombol type="submit" disabled={isPending}>
          {isPending ? "Menyimpan..." : labelTombol}
        </Tombol>
        <Tombol href="/admin" varian="garis">
          Batal
        </Tombol>
      </div>
    </form>
  );
}
