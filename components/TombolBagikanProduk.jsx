"use client";

import { useState } from "react";

export default function TombolBagikanProduk({ nama, kategori }) {
  const [pesanFeedback, setPesanFeedback] = useState("");

  const handleBagikan = async () => {
    const url = window.location.href;
    const shareData = {
      title: nama,
      text: `Lihat produk ${nama} di katalog ${kategori ? `kategori ${kategori}` : ""}:`,
      url: url,
    };

    // Coba gunakan Web Share API jika didukung browser (terutama di HP)
    if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
      try {
        await navigator.share(shareData);
        setPesanFeedback("Berhasil dibagikan");
        setTimeout(() => setPesanFeedback(""), 3000);
        return;
      } catch (err) {
        if (err.name === "AbortError") {
          return; // Pengguna membatalkan dialog share
        }
      }
    }

    // Fallback: Salin link ke clipboard
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(url);
      } else {
        const input = document.createElement("input");
        input.value = url;
        document.body.appendChild(input);
        input.select();
        document.execCommand("copy");
        document.body.removeChild(input);
      }
      setPesanFeedback("Link tersalin!");
      setTimeout(() => setPesanFeedback(""), 3000);
    } catch {
      setPesanFeedback("Gagal menyalin link");
      setTimeout(() => setPesanFeedback(""), 3000);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={handleBagikan}
        className="inline-flex items-center gap-1.5 rounded-xl border border-garis bg-latar px-3.5 py-1.5 text-xs font-semibold text-teks transition hover:border-utama hover:text-utama"
        aria-label="Bagikan atau salin tautan produk"
      >
        <span className="text-sm">🔗</span>
        <span>Bagikan</span>
      </button>

      {pesanFeedback && (
        <span className="rounded-lg bg-utama/10 px-2.5 py-1 text-xs font-bold text-utama animate-fade-in">
          ✓ {pesanFeedback}
        </span>
      )}
    </div>
  );
}
