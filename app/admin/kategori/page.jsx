import NavAdmin from "@/components/NavAdmin";
import KelolaKategoriClient from "./KelolaKategoriClient";
import { buatKlienAdmin } from "@/lib/supabase";
import { ambilDaftarKategori } from "@/lib/kategori";

export const dynamic = "force-dynamic";

export default async function HalamanKelolaKategori() {
  const supabase = await buatKlienAdmin();
  const kategoriList = await ambilDaftarKategori();

  // Hitung jumlah produk untuk tiap kategori
  const { data: daftarProduk = [] } = await supabase
    .from("produk")
    .select("kategori, deskripsi");

  const jumlahProdukMap = (daftarProduk || []).reduce((acc, p) => {
    // Jangan hitung jika merupakan placeholder kategori sistem
    if (p.deskripsi === "__KATEGORI_SYS__") return acc;
    const kat = p.kategori?.trim();
    if (kat) {
      acc[kat] = (acc[kat] || 0) + 1;
    }
    return acc;
  }, {});

  return (
    <div className="flex flex-col gap-6 py-8">
      <NavAdmin />
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold text-teks">Kelola Kategori</h1>
          <p className="text-xs text-teks-lembut mt-1">
            Atur dan kelompokkan produk katalog tokomu dengan kategori yang rapi.
          </p>
        </div>
      </div>

      <KelolaKategoriClient
        kategoriList={kategoriList}
        jumlahProdukMap={jumlahProdukMap}
      />
    </div>
  );
}
