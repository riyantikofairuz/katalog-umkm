import { buatKlienServer } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export default async function sitemap() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 
    (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : "") ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "https://katalog-umkm-ecru.vercel.app");

  // Rute statis publik
  const ruteStatis = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/tentang`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/favorit`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.5,
    },
  ];

  try {
    const supabase = buatKlienServer();
    const { data: daftarProduk } = await supabase
      .from("produk")
      .select("id, created_at");

    const ruteProduk = (daftarProduk || []).map((produk) => ({
      url: `${baseUrl}/produk/${produk.id}`,
      lastModified: produk.created_at ? new Date(produk.created_at) : new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    }));

    return [...ruteStatis, ...ruteProduk];
  } catch (err) {
    console.error("Gagal membuat sitemap produk:", err);
    return ruteStatis;
  }
}
