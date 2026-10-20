import Link from "next/link";
import { notFound } from "next/navigation";
import PilihanPesanWhatsApp from "@/components/PilihanPesanWhatsApp";
import KartuProduk from "@/components/KartuProduk";
import GaleriFotoProduk from "@/components/GaleriFotoProduk";
import { formatRupiah } from "@/lib/format";
import { buatKlienServer } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export default async function HalamanDetailProduk({ params }) {
  const { id } = await params;
  const supabase = buatKlienServer();

  // Ambil detail produk saat ini
  const { data: produk, error } = await supabase
    .from("produk")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error || !produk) {
    notFound();
  }

  // US-17: Ambil produk terkait dari kategori yang sama dari database (kecuali produk yang sedang dibuka)
  let produkTerkait = [];
  if (produk.kategori) {
    const { data: dataTerkait } = await supabase
      .from("produk")
      .select("*")
      .eq("kategori", produk.kategori)
      .neq("id", id)
      .limit(3);

    produkTerkait = dataTerkait || [];
  }

  return (
    <div className="flex flex-col gap-12 py-8 md:py-12">
      <article className="grid gap-8 md:grid-cols-2">
        {/* US-18: Galeri Foto Produk */}
        <GaleriFotoProduk
          fotoUrl={produk.foto_url}
          namaProduk={produk.nama}
          fotoLainnya={produk.foto_lainnya || []}
        />

        <div className="flex flex-col gap-4">
          <Link href="/" className="text-sm text-teks-lembut underline underline-offset-4 hover:text-utama">
            Kembali ke katalog
          </Link>
          <p className="text-sm text-teks-lembut">{produk.kategori}</p>
          <h1 className="text-3xl font-extrabold leading-tight tracking-tight">{produk.nama}</h1>
          <p className="self-start rounded-md bg-harga-latar px-3 py-1 text-xl font-bold text-harga">
            {formatRupiah(produk.harga)}
          </p>
          <p className="max-w-prose leading-relaxed text-teks-lembut">{produk.deskripsi}</p>
          <PilihanPesanWhatsApp produk={produk} />
        </div>
      </article>

      {/* US-17: Bagian Produk Terkait */}
      {produkTerkait.length > 0 && (
        <section aria-labelledby="judul-produk-terkait" className="flex flex-col gap-5 border-t border-garis pt-8">
          <div className="flex items-center justify-between">
            <h2 id="judul-produk-terkait" className="text-xl font-bold">
              Produk Terkait
            </h2>
            <span className="text-xs text-teks-lembut">Kategori: {produk.kategori}</span>
          </div>

          <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
            {produkTerkait.map((item) => (
              <KartuProduk key={item.id} produk={item} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
