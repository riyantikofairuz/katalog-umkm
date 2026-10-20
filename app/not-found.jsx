import Tombol from "@/components/Tombol";

export default function TidakDitemukan() {
  return (
    <div className="flex flex-col items-center justify-center text-center py-20 px-4 min-h-[50vh]">
      <div className="w-20 h-20 rounded-full bg-merah-terang/10 text-merah flex items-center justify-center text-3xl font-extrabold mb-4 shadow-inner">
        404
      </div>
      <h1 className="text-3xl font-extrabold text-teks mb-2">Halaman Tidak Ditemukan</h1>
      <p className="text-teks-lembut max-w-md mb-8 leading-relaxed">
        Maaf, halaman atau produk yang kamu tuju tidak tersedia, telah dipindahkan, atau tautan yang kamu buka salah.
      </p>
      <div className="flex flex-wrap items-center justify-center gap-3">
        <Tombol href="/">Kembali ke Katalog Utama</Tombol>
        <Tombol href="/tentang" varian="sekunder">Hubungi Kami</Tombol>
      </div>
    </div>
  );
}
