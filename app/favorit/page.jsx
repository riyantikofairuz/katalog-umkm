import Link from "next/link";
import DaftarProdukFavorit from "./DaftarProdukFavorit";
import { buatKlienServer } from "@/lib/supabase";
import { toko } from "@/lib/toko";

export const dynamic = "force-dynamic";

export const metadata = {
  title: `Produk Favorit - ${toko.nama}`,
  description: `Daftar produk favorit tersimpan di ${toko.nama}.`,
};

export default async function HalamanFavorit() {
  let semuaProduk = [];
  let pesanError = null;

  try {
    const supabase = buatKlienServer();
    const { data, error } = await supabase
      .from("produk")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      pesanError = `Gagal memuat produk: ${error.message}`;
    } else {
      semuaProduk = data || [];
    }
  } catch (err) {
    pesanError = `Gagal memuat produk: ${err.message}`;
  }

  return (
    <div className="flex flex-col gap-8 py-8 sm:py-12">
      <div>
        <Link
          href="/"
          className="text-sm font-semibold text-teks-lembut underline underline-offset-4 hover:text-utama"
        >
          &larr; Kembali ke Katalog
        </Link>
        <h1 className="mt-3 text-3xl font-extrabold sm:text-4xl">Produk Favorit</h1>
        <p className="mt-2 text-base text-teks-lembut">
          Koleksi produk pilihan yang Anda simpan di perangkat ini.
        </p>
      </div>

      {pesanError ? (
        <div className="rounded-xl border border-bahaya/20 bg-bahaya/10 p-4 text-sm text-bahaya">
          {pesanError}
        </div>
      ) : (
        <DaftarProdukFavorit semuaProduk={semuaProduk} />
      )}
    </div>
  );
}
