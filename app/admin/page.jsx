import NavAdmin from "@/components/NavAdmin";
import TabelProduk from "@/components/TabelProduk";
import Tombol from "@/components/Tombol";
import { buatKlienAdmin } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export default async function HalamanAdmin() {
  const supabase = await buatKlienAdmin();
  const { data: semuaData = [], error } = await supabase
    .from("produk")
    .select("*")
    .order("created_at", { ascending: false });

  // Saring record produk reguler (bukan placeholder kategori sistem)
  const daftarProduk = (semuaData || []).filter(
    (p) => p.deskripsi !== "__KATEGORI_SYS__"
  );

  // US-30: Hitung ringkasan produk dan jumlah produk per kategori
  const totalProduk = daftarProduk.length;
  const produkPerKategori = daftarProduk.reduce((acc, p) => {
    const kat = p.kategori?.trim() || "Tanpa Kategori";
    acc[kat] = (acc[kat] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="flex flex-col gap-6 py-8">
      <NavAdmin />

      {/* US-30: Dashboard Ringkasan Admin */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Total Produk */}
        <div className="rounded-xl border border-garis/60 bg-permukaan p-5 shadow-xs">
          <p className="text-xs font-semibold text-teks-lembut uppercase tracking-wider">
            Total Produk
          </p>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-black text-teks">{totalProduk}</span>
            <span className="text-xs text-teks-lembut">item terdaftar</span>
          </div>
        </div>

        {/* Total Kategori */}
        <div className="rounded-xl border border-garis/60 bg-permukaan p-5 shadow-xs">
          <p className="text-xs font-semibold text-teks-lembut uppercase tracking-wider">
            Total Kategori
          </p>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-black text-utama">
              {Object.keys(produkPerKategori).length}
            </span>
            <span className="text-xs text-teks-lembut">kategori aktif</span>
          </div>
        </div>

        {/* Rincian Produk per Kategori */}
        <div className="sm:col-span-3 rounded-xl border border-garis/60 bg-permukaan p-5 shadow-xs">
          <p className="text-xs font-semibold text-teks-lembut uppercase tracking-wider mb-3">
            Jumlah Produk per Kategori
          </p>
          {Object.keys(produkPerKategori).length === 0 ? (
            <p className="text-xs text-teks-lembut">Belum ada data kategori.</p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {Object.entries(produkPerKategori).map(([kategori, jumlah]) => (
                <div
                  key={kategori}
                  className="flex items-center gap-2 rounded-lg border border-garis/70 bg-latar px-3 py-1.5 text-xs font-medium"
                >
                  <span className="text-teks">{kategori}</span>
                  <span className="rounded-full bg-utama/15 px-2 py-0.5 font-bold text-utama">
                    {jumlah}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
        <h1 className="text-2xl font-extrabold">Kelola Produk</h1>
        {/* US-08: tambah produk */}
        <Tombol href="/admin/produk/baru">Tambah produk</Tombol>
      </div>

      {error ? (
        <div className="rounded-xl border border-bahaya/20 bg-bahaya/10 p-4 text-sm text-bahaya">
          Gagal memuat produk: {error.message}
        </div>
      ) : daftarProduk.length === 0 ? (
        <p className="py-8 text-center text-teks-lembut">Belum ada produk</p>
      ) : (
        <TabelProduk daftarProduk={daftarProduk} />
      )}
    </div>
  );
}

