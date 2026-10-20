"use client";

import { useActionState, useState } from "react";
import Tombol from "@/components/Tombol";
import Input from "@/components/Input";
import { tambahKategori, ubahKategori, hapusKategori } from "@/app/admin/actions";

export default function KelolaKategoriClient({ kategoriList = [], jumlahProdukMap = {} }) {
  const [stateTambah, actionTambah, isPendingTambah] = useActionState(tambahKategori, null);
  const [kategoriSedangDiubah, setKategoriSedangDiubah] = useState(null);
  const [pesanHapus, setPesanHapus] = useState(null);

  const handleHapus = async (nama) => {
    const jumlah = jumlahProdukMap[nama] || 0;
    if (jumlah > 0) {
      setPesanHapus(`Kategori "${nama}" tidak bisa dihapus karena masih digunakan oleh ${jumlah} produk.`);
      return;
    }

    if (!confirm(`Apakah Anda yakin ingin menghapus kategori "${nama}"?`)) {
      return;
    }

    setPesanHapus(null);
    const res = await hapusKategori(nama);
    if (res?.error) {
      setPesanHapus(res.error);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Pesan Kesalahan Hapus */}
      {pesanHapus && (
        <div className="rounded-xl border border-bahaya/20 bg-bahaya/10 p-4 text-sm text-bahaya">
          {pesanHapus}
        </div>
      )}

      {/* Form Tambah Kategori */}
      <div className="rounded-xl border border-garis/60 bg-permukaan p-5 shadow-xs">
        <h2 className="text-base font-bold text-teks mb-3">Tambah Kategori Baru</h2>
        {stateTambah?.error && (
          <p className="mb-3 text-xs text-bahaya">{stateTambah.error}</p>
        )}
        <form action={actionTambah} className="flex flex-col sm:flex-row items-center gap-3">
          <div className="w-full sm:w-80">
            <input
              name="nama"
              placeholder="Contoh: Aksesoris, Kosmetik..."
              required
              className="w-full rounded-lg border border-garis bg-latar px-3 py-2 text-sm text-teks placeholder:text-teks-lembut focus:border-utama focus:outline-none"
            />
          </div>
          <Tombol type="submit" disabled={isPendingTambah}>
            {isPendingTambah ? "Menyimpan..." : "Tambah Kategori"}
          </Tombol>
        </form>
      </div>

      {/* Modal / Baris Ubah Kategori */}
      {kategoriSedangDiubah && (
        <FormUbahKategoriModal
          namaLama={kategoriSedangDiubah}
          onTutup={() => setKategoriSedangDiubah(null)}
        />
      )}

      {/* Daftar Kategori */}
      <div className="rounded-xl border border-garis/60 bg-permukaan overflow-hidden shadow-xs">
        <div className="border-b border-garis/60 bg-latar/50 px-4 py-3">
          <h2 className="text-sm font-bold text-teks">Daftar Kategori ({kategoriList.length})</h2>
        </div>

        {kategoriList.length === 0 ? (
          <p className="p-6 text-center text-sm text-teks-lembut">Belum ada kategori yang terdaftar.</p>
        ) : (
          <div className="divide-y divide-garis/40">
            {kategoriList.map((kat) => {
              const jumlah = jumlahProdukMap[kat] || 0;
              return (
                <div
                  key={kat}
                  className="flex flex-wrap items-center justify-between gap-3 p-4 hover:bg-latar/40 transition"
                >
                  <div className="flex items-center gap-3">
                    <span className="font-semibold text-teks">{kat}</span>
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${
                        jumlah > 0
                          ? "bg-utama/15 text-utama"
                          : "bg-garis/50 text-teks-lembut"
                      }`}
                    >
                      {jumlah} produk
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setKategoriSedangDiubah(kat)}
                      className="rounded-lg border border-garis px-3 py-1.5 text-xs font-semibold text-teks hover:border-utama hover:text-utama transition"
                    >
                      Ubah
                    </button>
                    <button
                      type="button"
                      onClick={() => handleHapus(kat)}
                      className="rounded-lg border border-bahaya/30 bg-bahaya/5 px-3 py-1.5 text-xs font-semibold text-bahaya hover:bg-bahaya/15 transition"
                    >
                      Hapus
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

function FormUbahKategoriModal({ namaLama, onTutup }) {
  const ubahDenganNama = ubahKategori.bind(null, namaLama);
  const [state, formAction, isPending] = useActionState(ubahDenganNama, null);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
      <div className="w-full max-w-md rounded-2xl border border-garis bg-permukaan p-6 shadow-xl">
        <h3 className="text-lg font-bold text-teks mb-2">Ubah Nama Kategori</h3>
        <p className="text-xs text-teks-lembut mb-4">
          Mengubah nama kategori &ldquo;{namaLama}&rdquo; akan otomatis memperbarui kategori seluruh produk terkait.
        </p>

        {state?.error && (
          <div className="mb-4 rounded-lg bg-bahaya/10 p-3 text-xs text-bahaya border border-bahaya/20">
            {state.error}
          </div>
        )}

        <form action={formAction} className="flex flex-col gap-4">
          <Input
            label="Nama Kategori Baru"
            name="nama"
            defaultValue={namaLama}
            required
            autoFocus
          />

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onTutup}
              className="rounded-lg border border-garis px-4 py-2 text-sm font-semibold text-teks hover:bg-latar transition"
            >
              Batal
            </button>
            <Tombol type="submit" disabled={isPending}>
              {isPending ? "Menyimpan..." : "Simpan Perubahan"}
            </Tombol>
          </div>
        </form>
      </div>
    </div>
  );
}
