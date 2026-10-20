import KartuProduk from "@/components/KartuProduk";
import FilterCariProduk from "@/components/FilterCariProduk";
import Paginasi from "@/components/Paginasi";
import { toko } from "@/lib/toko";
import { buatKlienServer } from "@/lib/supabase";

export const dynamic = "force-dynamic";

const JUMLAH_PER_HALAMAN = 6;

export default async function HalamanKatalog({ searchParams }) {
  const { kategori, q, urutan = "terbaru", halaman = "1" } = (await searchParams) || {};
  const nomorHalaman = Math.max(1, parseInt(halaman, 10) || 1);

  let daftarProduk = [];
  let semuaKategori = [];
  let totalData = 0;
  let totalHalaman = 1;
  let pesanError = null;

  try {
    const supabase = buatKlienServer();

    // Ambil daftar unik kategori dari tabel produk
    const { data: produkKategori } = await supabase
      .from("produk")
      .select("kategori");

    if (produkKategori) {
      semuaKategori = Array.from(
        new Set(
          produkKategori
            .map((p) => p.kategori)
            .filter((kat) => Boolean(kat && kat.trim()))
        )
      ).sort();
    }

    // Query produk dengan hitungan total (count) dan filter
    let query = supabase
      .from("produk")
      .select("*", { count: "exact" });

    if (kategori && kategori.trim()) {
      query = query.eq("kategori", kategori.trim());
    }

    if (q && q.trim()) {
      query = query.ilike("nama", `%${q.trim()}%`);
    }

    // US-15: Pengurutan diterapkan pada query database
    if (urutan === "termurah") {
      query = query.order("harga", { ascending: true });
    } else if (urutan === "termahal") {
      query = query.order("harga", { ascending: false });
    } else {
      query = query.order("created_at", { ascending: false });
    }

    // US-16: Paginasi diterapkan langsung pada query database menggunakan .range()
    const dari = (nomorHalaman - 1) * JUMLAH_PER_HALAMAN;
    const sampai = dari + JUMLAH_PER_HALAMAN - 1;
    query = query.range(dari, sampai);

    const { data, count, error } = await query;

    if (error) {
      pesanError = `Gagal memuat produk: ${error.message}`;
    } else {
      daftarProduk = data || [];
      totalData = count || 0;
      totalHalaman = Math.ceil(totalData / JUMLAH_PER_HALAMAN) || 1;
    }
  } catch (err) {
    pesanError = `Gagal memuat produk: ${err.message}`;
  }

  const sedangFilter = Boolean(
    (kategori && kategori.trim()) ||
    (q && q.trim()) ||
    (urutan && urutan !== "terbaru")
  );

  return (
    <>
      <section className="py-10 sm:py-14">
        <h1 className="max-w-2xl text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl">
          {toko.nama}
        </h1>
        <p className="mt-3 max-w-xl text-lg text-teks-lembut">{toko.tagline}</p>
        <p className="mt-4 text-sm text-teks-lembut">{toko.jamBuka}</p>
      </section>

      <section aria-labelledby="judul-produk" className="flex flex-col gap-6">
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h2 id="judul-produk" className="text-xl font-bold">
              Produk kami
            </h2>
            {totalData > 0 && (
              <span className="text-xs font-medium text-teks-lembut">
                Total {totalData} produk (halaman {nomorHalaman} dari {totalHalaman})
              </span>
            )}
          </div>
          <FilterCariProduk
            kategoriList={semuaKategori}
            kategoriTerpilih={kategori || ""}
            kataKunci={q || ""}
            urutanTerpilih={urutan || "terbaru"}
          />
        </div>

        {pesanError ? (
          <div className="rounded-xl border border-bahaya/20 bg-bahaya/10 p-4 text-sm text-bahaya">
            {pesanError}
          </div>
        ) : daftarProduk.length === 0 ? (
          <div className="py-12 text-center text-teks-lembut">
            <p className="text-base font-medium">
              {sedangFilter
                ? "Tidak ada produk yang cocok dengan pencarian atau filter Anda."
                : "Belum ada produk"}
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
              {daftarProduk.map((produk) => (
                <KartuProduk key={produk.id} produk={produk} />
              ))}
            </div>

            {/* Komponen Paginasi */}
            <Paginasi
              halamanSaatIni={nomorHalaman}
              totalHalaman={totalHalaman}
              kategori={kategori || ""}
              q={q || ""}
              urutan={urutan || ""}
            />
          </>
        )}
      </section>
    </>
  );
}
