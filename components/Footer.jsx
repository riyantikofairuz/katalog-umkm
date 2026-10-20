import Link from "next/link";
import { toko } from "@/lib/toko";

export default function Footer() {
  return (
    <footer className="mt-16 border-t border-garis bg-permukaan">
      <div className="mx-auto flex max-w-5xl flex-col gap-6 px-4 py-8 text-sm text-teks-lembut sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="font-bold text-teks">{toko.nama}</p>
          <p>{toko.alamat}</p>
          <p>{toko.jamBuka}</p>
        </div>

        <div className="flex flex-wrap items-center gap-4 text-xs font-semibold sm:text-sm">
          <Link href="/tentang" className="underline underline-offset-4 hover:text-utama">
            Tentang & Kontak
          </Link>
          <span className="text-garis">|</span>
          <Link href="/admin" className="underline underline-offset-4 hover:text-utama">
            Masuk sebagai admin
          </Link>
        </div>
      </div>
    </footer>
  );
}
