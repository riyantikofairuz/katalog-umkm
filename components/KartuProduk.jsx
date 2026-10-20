import Link from "next/link";
import { formatRupiah } from "@/lib/format";

export default function KartuProduk({ produk }) {
  // US-19: Cek status stok (bisa dari kolom status === 'habis' atau stok === 0)
  const isHabis =
    produk.status === "habis" ||
    produk.stok === 0 ||
    produk.stok_tersedia === false;

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
        {/* US-19: Badge Habis */}
        {isHabis && (
          <span className="absolute left-2.5 top-2.5 rounded-md bg-bahaya px-2 py-0.5 text-xs font-bold text-white shadow-sm">
            Habis
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-2 p-3">
        <div className="flex items-center justify-between">
          <p className="text-xs text-teks-lembut">{produk.kategori}</p>
          {isHabis && (
            <span className="text-xs font-semibold text-bahaya">Stok Habis</span>
          )}
        </div>
        <h3 className="font-semibold leading-snug group-hover:text-utama">{produk.nama}</h3>
        <p className="mt-auto self-start rounded-md bg-harga-latar px-2 py-0.5 text-sm font-bold text-harga">
          {formatRupiah(produk.harga)}
        </p>
      </div>
    </Link>
  );
}
