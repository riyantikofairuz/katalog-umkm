import NavAdmin from "@/components/NavAdmin";
import TabelProduk from "@/components/TabelProduk";
import Tombol from "@/components/Tombol";
import PencarianAdmin from "@/components/PencarianAdmin";
import PaginasiAdmin from "@/components/PaginasiAdmin";
import { buatKlienAdmin } from "@/lib/supabase";

export const dynamic = "force-dynamic";

const JUMLAH_PER_HALAMAN = 10;

export default async function HalamanAdmin({ searchParams }) {
  const { q = "", halaman = "1" } = (await searchParams) || {};
  const nomorHalaman = Math.max(1, parseInt(halaman, 10) || 1);

  const supabase = await buatKlienAdmin();

  // US-30: Ringkasan statistik (seluruh produk tanpa filter)
  const { data: semuaDataRingkasan = [] } = await supabase
    .from("produk")
    .select("kategori, deskripsi")
    .neq("deskripsi", "__KATEGORI_SYS__");

  const totalProdukRingkasan = semuaDataRingkasan.length;
  const produkPerKategori = semuaDataRingkasan.reduce((acc, p) => {
    const kat = p.kategori?.trim() || "Tanpa Kategori";
    acc[kat] = (acc[kat] || 0) + 1;
    return acc;
  }, {});

  // US-33: Query produk dengan pencarian database dan paginasi
  let query = supabase
    .from("produk")
    .select("*", { count: "exact" })
    .neq("deskripsi", "__KATEGORI_SYS__");

  if (q && q.trim()) {
    query = query.ilike("nama", `%${q.trim()}%`);
  }

  // Pengurutan terbaru
  query = query.order("created_at", { ascending: false });

  // Paginasi query database
  const dari = (nomorHalaman - 1) * JUMLAH_PER_HALAMAN;
  const sampai = dari + JUMLAH_PER_HALAMAN - 1;
  query = query.range(dari, sampai);

  const { data: daftarProduk = [], count: totalItem = 0, error } = await query;
  const totalHalaman = Math.ceil((totalItem || 0) / JUMLAH_PER_HALAMAN);

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
            <span className="text-3xl font-black text-teks">{totalProdukRingkasan}</span>
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

      {/* Header Kelola Produk, Ekspor CSV, & Tambah Produk */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
        <h1 className="text-2xl font-extrabold">Kelola Produk</h1>
        <div className="flex items-center gap-2.5">
          {/* US-35: Tombol Ekspor CSV */}
          <a
            href="/admin/produk/ekspor"
            download
            className="inline-flex items-center gap-1.5 rounded-lg border border-garis/80 bg-permukaan px-3.5 py-2 text-xs font-semibold text-teks hover:border-utama hover:text-utama shadow-2xs transition"
          >
            <span>📥</span> Ekspor CSV
          </a>
          {/* US-08: Tambah produk */}
          <Tombol href="/admin/produk/baru">Tambah produk</Tombol>
        </div>
      </div>

      {/* US-33: Bar Pencarian dan Info Hasil */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-permukaan p-3 rounded-xl border border-garis/60">
        <PencarianAdmin nilaiAwal={q} />
        <span className="text-xs text-teks-lembut self-center sm:self-auto">
          Menampilkan {daftarProduk.length} dari {totalItem} produk
          {q && (
            <span>
              {" "}
              untuk kata kunci &ldquo;<strong className="text-teks">{q}</strong>&rdquo;
            </span>
          )}
        </span>
      </div>

      {error ? (
        <div className="rounded-xl border border-bahaya/20 bg-bahaya/10 p-4 text-sm text-bahaya">
          Gagal memuat produk: {error.message}
        </div>
      ) : daftarProduk.length === 0 ? (
        <p className="py-8 text-center text-teks-lembut">
          {q ? `Tidak ada produk yang cocok dengan "${q}"` : "Belum ada produk"}
        </p>
      ) : (
        <>
          <TabelProduk daftarProduk={daftarProduk} />
          {/* US-33: Paginasi Hasil List Admin */}
          <PaginasiAdmin
            halamanSaatIni={nomorHalaman}
            totalHalaman={totalHalaman}
            q={q}
          />
        </>
      )}
    </div>
  );
}


