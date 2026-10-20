import Link from "next/link";
import { toko } from "@/lib/toko";
import TombolKeranjangHeader from "@/components/TombolKeranjangHeader";
import TombolFavoritHeader from "@/components/TombolFavoritHeader";
import TombolModeGelap from "@/components/TombolModeGelap";

export default function Header() {
  return (
    <header className="border-b border-garis bg-latar transition-colors">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4">
        <Link href="/" className="text-lg font-extrabold tracking-tight text-utama">
          {toko.nama}
        </Link>
        <div className="flex items-center gap-2">
          {/* US-25: Tombol Mode Gelap */}
          <TombolModeGelap />
          <TombolFavoritHeader />
          <TombolKeranjangHeader />
        </div>
      </div>
    </header>
  );
}
