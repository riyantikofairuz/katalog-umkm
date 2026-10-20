import Link from "next/link";
import { formatRupiah } from "@/lib/format";

export default function KartuProduk({ produk }) {
  // US-19: Cek status stok
  const isHabis =
    produk.status === "habis" ||
    produk.stok === 0 ||
    produk.stok_tersedia === false;

  // US-20: Cek diskon dan label badge
  const adaDiskon =
    produk.harga_diskon &&
    produk.harga_diskon > 0 &&
    produk.harga_diskon < produk.harga;

  const hargaFinal = adaDiskon ? produk.harga_diskon : produk.harga;
  const hargaCoret = adaDiskon ? produk.harga : null;

  // Badge "Baru" atau "Terlaris"
  const badge =
    produk.badge ||
    (produk.is_terlaris ? "Terlaris" : null) ||
    (produk.is_baru ? "Baru" : null);

  return (
    <Link
      href={`/produk/${produk.id}`}
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-garis bg-latar"
    >
      <div className="relative aspect-square w-full overflow-hidden bg-permukaan">
        <img
          src={produk.foto_url}
          alt={produk.nama}
          className={`h-full w-full object-cover transition ${
            isHabis ? "opacity-60 grayscale" : ""
          }`}
        />

        {/* Badge status / promo */}
        <div className="absolute left-2.5 top-2.5 flex flex-col gap-1">
          {isHabis ? (
            <span className="rounded-md bg-bahaya px-2 py-0.5 text-xs font-bold text-white shadow-sm">
              Habis
            </span>
          ) : (
            <>
              {badge && (
                <span
                  className={`rounded-md px-2 py-0.5 text-xs font-bold text-white shadow-sm ${
                    badge.toLowerCase().includes("laris")
                      ? "bg-amber-600"
                      : "bg-utama"
                  }`}
                >
                  {badge}
                </span>
              )}
              {adaDiskon && (
                <span className="rounded-md bg-rose-600 px-2 py-0.5 text-xs font-bold text-white shadow-sm">
                  Diskon
                </span>
              )}
            </>
          )}
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-2 p-3">
        <div className="flex items-center justify-between">
          <p className="text-xs text-teks-lembut">{produk.kategori}</p>
          {isHabis && (
            <span className="text-xs font-semibold text-bahaya">Stok Habis</span>
          )}
        </div>
        <h3 className="font-semibold leading-snug group-hover:text-utama">{produk.nama}</h3>

        {/* US-20: Harga Diskon dan Harga Coret */}
        <div className="mt-auto flex flex-wrap items-baseline gap-2">
          <p className="rounded-md bg-harga-latar px-2 py-0.5 text-sm font-bold text-harga">
            {formatRupiah(hargaFinal)}
          </p>
          {hargaCoret && (
            <span className="text-xs text-teks-lembut line-through">
              {formatRupiah(hargaCoret)}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
