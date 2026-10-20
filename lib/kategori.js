import { buatKlienServer } from "@/lib/supabase";

/**
 * Mengambil daftar seluruh nama kategori unik yang tersedia
 */
export async function ambilDaftarKategori() {
  const supabase = buatKlienServer();

  // 1. Cek tabel kategori jika ada di skema
  try {
    const { data: catData, error: catError } = await supabase
      .from("kategori")
      .select("nama")
      .order("nama", { ascending: true });

    if (!catError && catData && catData.length > 0) {
      return catData.map((c) => c.nama).filter(Boolean);
    }
  } catch {
    // Tabel kategori belum ada di database
  }

  // 2. Ambil dari kategori yang ada di tabel produk
  const { data: produkData } = await supabase
    .from("produk")
    .select("kategori");

  if (!produkData) return [];

  const kategoriUnik = Array.from(
    new Set(
      produkData
        .map((p) => p.kategori?.trim())
        .filter(Boolean)
    )
  ).sort();

  return kategoriUnik;
}
