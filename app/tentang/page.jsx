import Link from "next/link";
import { toko } from "@/lib/toko";

export const metadata = {
  title: `Tentang Kami - ${toko.nama}`,
  description: `Profil dan informasi kontak resmi ${toko.nama}.`,
};

export default function HalamanTentang() {
  const nomorWA = (toko.nomorWhatsApp || "").trim().replace(/[^0-9]/g, "");
  const linkWA = `https://wa.me/${nomorWA}?text=${encodeURIComponent(
    `Halo ${toko.nama}, saya ingin bertanya mengenai toko dan produk Anda.`
  )}`;

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-10 py-10 sm:py-14">
      {/* Header Halaman */}
      <div>
        <Link
          href="/"
          className="text-sm font-semibold text-teks-lembut underline underline-offset-4 hover:text-utama"
        >
          &larr; Kembali ke Katalog
        </Link>
        <h1 className="mt-4 text-3xl font-extrabold sm:text-4xl">Tentang Kami</h1>
        <p className="mt-2 text-lg text-teks-lembut">{toko.tagline}</p>
      </div>

      {/* Profil Toko */}
      <section className="flex flex-col gap-4 rounded-2xl border border-garis bg-latar p-6 sm:p-8">
        <h2 className="text-xl font-bold text-teks">Profil Usaha</h2>
        <p className="leading-relaxed text-teks-lembut">
          Selamat datang di <strong className="text-teks">{toko.nama}</strong>. Kami adalah usaha
          lokal yang berkomitmen menghadirkan produk berkualitas tinggi dengan pelayanan yang ramah
          dan terpercaya untuk seluruh pelanggan kami.
        </p>
        <p className="leading-relaxed text-teks-lembut">
          Setiap produk yang kami tawarkan dipilih dan dikerjakan dengan standar terbaik guna
          memastikan kepuasan Anda dalam berbelanja.
        </p>
      </section>

      {/* Informasi Alamat, Jam Operasional, dan Kontak */}
      <section className="grid gap-6 sm:grid-cols-2">
        <div className="flex flex-col gap-2 rounded-2xl border border-garis bg-latar p-6">
          <div className="flex items-center gap-2 text-utama">
            <span className="text-xl">📍</span>
            <h3 className="font-bold text-teks">Alamat Toko</h3>
          </div>
          <p className="text-sm leading-relaxed text-teks-lembut">{toko.alamat}</p>
        </div>

        <div className="flex flex-col gap-2 rounded-2xl border border-garis bg-latar p-6">
          <div className="flex items-center gap-2 text-utama">
            <span className="text-xl">⏰</span>
            <h3 className="font-bold text-teks">Jam Operasional</h3>
          </div>
          <p className="text-sm leading-relaxed text-teks-lembut">{toko.jamBuka}</p>
        </div>
      </section>

      {/* Kontak WhatsApp Resmi */}
      <section className="flex flex-col items-start justify-between gap-4 rounded-2xl border border-utama/20 bg-utama/5 p-6 sm:flex-row sm:items-center sm:p-8">
        <div>
          <h3 className="text-lg font-bold text-teks">Hubungi Kami Langsung</h3>
          <p className="mt-1 text-sm text-teks-lembut">
            Punya pertanyaan seputar produk atau pesanan khusus? Kami siap membantu melalui WhatsApp.
          </p>
        </div>
        <a
          href={linkWA}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-utama px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-utama-gelap whitespace-nowrap"
        >
          <span>💬</span> Chat WhatsApp
        </a>
      </section>
    </div>
  );
}
