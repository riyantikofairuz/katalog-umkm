import KartuProduk from "@/components/KartuProduk";
import FilterCariProduk from "@/components/FilterCariProduk";
import { toko } from "@/lib/toko";
import { buatKlienServer } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export default async function HalamanKatalog({ searchParams }) {
  const { kategori, q } = (await searchParams) || {};
  let daftarProduk = [];
  let semuaKategori = [];
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

    // Query produk dengan filter kategori dan pencarian nama
    let query = supabase.from("produk").select("*");

    if (kategori && kategori.trim()) {
      query = query.eq("kategori", kategori.trim());
    }

    if (q && q.trim()) {
      query = query.ilike("nama", `%${q.trim()}%`);
    }

    const { data, error } = await query.order("created_at", { ascending: false });

    if (error) {
      pesanError = `Gagal memuat produk: ${error.message}`;
    } else {
      daftarProduk = data || [];
    }
  } catch (err) {
    pesanError = `Gagal memuat produk: ${err.message}`;
  }

  const sedangFilter = Boolean((kategori && kategori.trim()) || (q && q.trim()));

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
          <h2 id="judul-produk" className="text-xl font-bold">
            Produk kami
          </h2>
          <FilterCariProduk
            kategoriList={semuaKategori}
            kategoriTerpilih={kategori || ""}
            kataKunci={q || ""}
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
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
            {daftarProduk.map((produk) => (
              <KartuProduk key={produk.id} produk={produk} />
            ))}
          </div>
        )}
      </section>
    </>
  );
}
