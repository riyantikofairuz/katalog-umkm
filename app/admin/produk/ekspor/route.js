import { NextResponse } from "next/server";
import { buatKlienAdmin } from "@/lib/supabase";

export const dynamic = "force-dynamic";

function sanitizeCsvField(value) {
  if (value === null || value === undefined) {
    return '""';
  }
  const str = String(value);
  // Gandakan tanda petik dua jika ada di dalam string (standar RFC 4180)
  const escaped = str.replace(/"/g, '""');
  return `"${escaped}"`;
}

export async function GET() {
  const supabase = await buatKlienAdmin();

  // Proteksi endpoint server: Verifikasi login admin
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return new NextResponse(
      JSON.stringify({ error: "Akses ditolak: Anda harus login sebagai admin." }),
      {
        status: 401,
        headers: { "Content-Type": "application/json" },
      }
    );
  }

  // Ambil semua produk dari database (kecuali placeholder sistem)
  const { data: daftarProduk = [], error } = await supabase
    .from("produk")
    .select("id, nama, harga, kategori, deskripsi, foto_url, created_at")
    .neq("deskripsi", "__KATEGORI_SYS__")
    .order("id", { ascending: true });

  if (error) {
    return new NextResponse(
      JSON.stringify({ error: `Gagal mengambil data produk: ${error.message}` }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }

  // Header CSV yang jelas
  const headers = ["ID", "Nama Produk", "Harga (Rp)", "Kategori", "Deskripsi", "URL Foto", "Tanggal Dibuat"];

  // Baris-baris data CSV
  const barisCsv = daftarProduk.map((p) => {
    const isNonaktif = p.nama.startsWith("[NONAKTIF] ");
    const namaTampil = isNonaktif ? p.nama.replace(/^\[NONAKTIF\]\s*/, "") : p.nama;

    return [
      sanitizeCsvField(p.id),
      sanitizeCsvField(namaTampil),
      sanitizeCsvField(p.harga),
      sanitizeCsvField(p.kategori || ""),
      sanitizeCsvField(p.deskripsi || ""),
      sanitizeCsvField(p.foto_url || ""),
      sanitizeCsvField(p.created_at || ""),
    ].join(",");
  });

  // Tambahkan UTF-8 BOM (\uFEFF) agar Microsoft Excel membuka karakter khusus/huruf Indonesia dengan tepat
  const csvContent = "\uFEFF" + [headers.map(sanitizeCsvField).join(","), ...barisCsv].join("\r\n");

  const namaFile = `katalog-produk-${new Date().toISOString().split("T")[0]}.csv`;

  return new NextResponse(csvContent, {
    status: 200,
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${namaFile}"`,
      "Cache-Control": "no-store, max-age=0",
    },
  });
}
