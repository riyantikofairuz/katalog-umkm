import { toko } from "@/lib/toko";
import { formatRupiah } from "@/lib/format";

export default function TombolWhatsApp({ produk }) {
  const nomor = (toko.nomorWhatsApp || "").trim().replace(/[^0-9]/g, "");
  const pesan = `Halo ${toko.nama}, saya ingin memesan ${produk.nama} seharga ${formatRupiah(produk.harga)}. Apakah masih tersedia?`;
  const urlWhatsApp = `https://wa.me/${nomor}?text=${encodeURIComponent(pesan)}`;

  return (
    <a
      href={urlWhatsApp}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex w-full items-center justify-center rounded-lg bg-utama px-5 py-3 font-semibold text-white hover:bg-utama-gelap sm:w-auto"
    >
      Pesan via WhatsApp
    </a>
  );
}
