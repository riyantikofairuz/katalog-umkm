import Link from "next/link";

export default function PaginasiAdmin({ halamanSaatIni, totalHalaman, q = "" }) {
  if (totalHalaman <= 1) return null;

  const buatUrl = (halaman) => {
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    if (halaman > 1) params.set("halaman", halaman.toString());
    const str = params.toString();
    return str ? `/admin?${str}` : "/admin";
  };

  const halamanArray = [];
  for (let i = 1; i <= totalHalaman; i++) {
    halamanArray.push(i);
  }

  return (
    <nav aria-label="Navigasi Halaman Admin" className="flex items-center justify-center gap-1.5 pt-4">
      {/* Tombol Sebelumnya */}
      {halamanSaatIni > 1 ? (
        <Link
          href={buatUrl(halamanSaatIni - 1)}
          className="rounded-lg border border-garis bg-latar px-3 py-1.5 text-xs font-semibold text-teks hover:border-utama hover:text-utama"
        >
          &larr; Sebelumnya
        </Link>
      ) : (
        <span className="cursor-not-allowed rounded-lg border border-garis bg-permukaan px-3 py-1.5 text-xs font-semibold text-teks-lembut opacity-50">
          &larr; Sebelumnya
        </span>
      )}

      {/* Nomor Halaman */}
      <div className="flex items-center gap-1">
        {halamanArray.map((hal) => {
          const aktif = hal === halamanSaatIni;
          return (
            <Link
              key={hal}
              href={buatUrl(hal)}
              className={`flex h-8 w-8 items-center justify-center rounded-lg text-xs font-semibold transition ${
                aktif
                  ? "bg-utama text-white"
                  : "border border-garis bg-latar text-teks hover:border-utama hover:text-utama"
              }`}
            >
              {hal}
            </Link>
          );
        })}
      </div>

      {/* Tombol Berikutnya */}
      {halamanSaatIni < totalHalaman ? (
        <Link
          href={buatUrl(halamanSaatIni + 1)}
          className="rounded-lg border border-garis bg-latar px-3 py-1.5 text-xs font-semibold text-teks hover:border-utama hover:text-utama"
        >
          Berikutnya &rarr;
        </Link>
      ) : (
        <span className="cursor-not-allowed rounded-lg border border-garis bg-permukaan px-3 py-1.5 text-xs font-semibold text-teks-lembut opacity-50">
          Berikutnya &rarr;
        </span>
      )}
    </nav>
  );
}
