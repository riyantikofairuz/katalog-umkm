"use client";

import { useKeranjang } from "@/lib/KeranjangContext";
import { toko } from "@/lib/toko";
import { formatRupiah } from "@/lib/format";

export default function ModalKeranjang() {
  const {
    items,
    totalItem,
    totalHarga,
    ubahJumlah,
    hapusItem,
    isBuka,
    setIsBuka,
  } = useKeranjang();

  if (!isBuka) return null;

  const kirimSemuaWhatsApp = () => {
    if (items.length === 0) return;

    const nomor = (toko.nomorWhatsApp || "").trim().replace(/[^0-9]/g, "");
    const daftarText = items
      .map(
        (it, idx) =>
          `${idx + 1}. ${it.nama} (${it.varian}) x ${it.jumlah} = ${formatRupiah(
            it.harga * it.jumlah
          )}`
      )
      .join("\n");

    const pesan = `Halo ${toko.nama}, saya ingin memesan produk dari keranjang belanja:

${daftarText}

*Total Pembayaran: ${formatRupiah(totalHarga)}*

Mohon konfirmasi ketersediaan dan total ongkos kirimnya ya. Terima kasih!`;

    const url = `https://wa.me/${nomor}?text=${encodeURIComponent(pesan)}`;
    window.open(url, "_blank");
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-xs transition-opacity">
      <div className="flex h-full w-full max-w-md flex-col bg-latar shadow-2xl">
        {/* Header Modal */}
        <div className="flex items-center justify-between border-b border-garis p-4">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold">Keranjang Belanja</h2>
            <span className="rounded-full bg-utama/10 px-2.5 py-0.5 text-xs font-bold text-utama">
              {totalItem}
            </span>
          </div>
          <button
            type="button"
            onClick={() => setIsBuka(false)}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-teks-lembut hover:bg-permukaan hover:text-teks"
            aria-label="Tutup keranjang"
          >
            ✕
          </button>
        </div>

        {/* Isi Daftar Barang */}
        <div className="flex-1 overflow-y-auto p-4">
          {items.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center text-center text-teks-lembut">
              <span className="text-4xl">🛒</span>
              <p className="mt-3 text-sm font-semibold">Keranjang Anda masih kosong</p>
              <p className="mt-1 text-xs text-teks-lembut">Pilih produk dan masukkan ke keranjang belanja</p>
            </div>
          ) : (
            <div className="flex flex-col divide-y divide-garis">
              {items.map((item) => (
                <div key={item.key} className="flex gap-3 py-3">
                  <img
                    src={item.foto_url}
                    alt={item.nama}
                    className="h-16 w-16 rounded-xl border border-garis object-cover"
                  />
                  <div className="flex flex-1 flex-col justify-between">
                    <div>
                      <h4 className="text-sm font-semibold leading-tight">{item.nama}</h4>
                      <p className="text-xs text-teks-lembut">Varian: {item.varian}</p>
                      <p className="text-xs font-bold text-harga">{formatRupiah(item.harga)}</p>
                    </div>

                    <div className="flex items-center justify-between pt-2">
                      <div className="flex items-center rounded-lg border border-garis bg-permukaan/60">
                        <button
                          type="button"
                          onClick={() => ubahJumlah(item.key, -1)}
                          className="flex h-7 w-7 items-center justify-center text-xs font-bold hover:bg-garis"
                        >
                          -
                        </button>
                        <span className="w-8 text-center text-xs font-semibold">
                          {item.jumlah}
                        </span>
                        <button
                          type="button"
                          onClick={() => ubahJumlah(item.key, 1)}
                          className="flex h-7 w-7 items-center justify-center text-xs font-bold hover:bg-garis"
                        >
                          +
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={() => hapusItem(item.key)}
                        className="text-xs font-semibold text-bahaya hover:underline"
                      >
                        Hapus
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer & Tombol Checkout WhatsApp */}
        {items.length > 0 && (
          <div className="border-t border-garis bg-permukaan/30 p-4">
            <div className="mb-3 flex items-center justify-between text-base">
              <span className="font-semibold text-teks-lembut">Total Tagihan:</span>
              <span className="text-lg font-extrabold text-harga">
                {formatRupiah(totalHarga)}
              </span>
            </div>

            <button
              type="button"
              onClick={kirimSemuaWhatsApp}
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-utama py-3.5 text-sm font-semibold text-white shadow-md transition hover:bg-utama-gelap"
            >
              <span>Pesan Semua via WhatsApp</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
