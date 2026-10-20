import { formatRupiah } from "@/lib/format";
import Tombol from "@/components/Tombol";
import TombolHapusProduk from "@/components/TombolHapusProduk";
import TombolStatusProduk from "@/components/TombolStatusProduk";

export default function TabelProduk({ daftarProduk }) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-garis">
      <table className="w-full min-w-[560px] text-left text-sm">
        <thead className="bg-permukaan text-teks-lembut">
          <tr>
            <th className="px-4 py-3 font-semibold">Produk</th>
            <th className="px-4 py-3 font-semibold">Kategori</th>
            <th className="px-4 py-3 font-semibold">Harga</th>
            <th className="px-4 py-3 font-semibold">Status</th>
            <th className="px-4 py-3 font-semibold">
              <span className="sr-only">Aksi</span>
            </th>
          </tr>
        </thead>
        <tbody>
          {daftarProduk.map((produk) => {
            const isNonaktif = produk.nama.startsWith("[NONAKTIF] ");
            const namaTampil = isNonaktif
              ? produk.nama.replace(/^\[NONAKTIF\]\s*/, "")
              : produk.nama;

            return (
              <tr
                key={produk.id}
                className={`border-t border-garis transition ${
                  isNonaktif ? "bg-latar/50 opacity-75" : ""
                }`}
              >
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={produk.foto_url}
                      alt=""
                      className="h-10 w-10 rounded-md object-cover"
                    />
                    <div className="flex flex-col">
                      <span className="font-semibold">{namaTampil}</span>
                      {isNonaktif && (
                        <span className="text-[10px] font-bold uppercase tracking-wider text-bahaya">
                          Nonaktif (Disembunyikan)
                        </span>
                      )}
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-teks-lembut">{produk.kategori}</td>
                <td className="px-4 py-3">{formatRupiah(produk.harga)}</td>
                <td className="px-4 py-3">
                  <TombolStatusProduk id={produk.id} isAktif={!isNonaktif} />
                </td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-2">
                    <Tombol href={`/admin/produk/${produk.id}/ubah`} varian="garis">
                      Ubah
                    </Tombol>
                    <TombolHapusProduk id={produk.id} nama={namaTampil} />
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
