import NavAdmin from "@/components/NavAdmin";
import FormTambahProdukClient from "./FormTambahProdukClient";
import { ambilDaftarKategori } from "@/lib/kategori";

export const dynamic = "force-dynamic";

export default async function HalamanTambahProduk() {
  const daftarKategori = await ambilDaftarKategori();

  return (
    <div className="flex flex-col gap-6 py-8">
      <NavAdmin />
      <h1 className="text-2xl font-extrabold">Tambah produk</h1>
      <FormTambahProdukClient daftarKategori={daftarKategori} />
    </div>
  );
}
