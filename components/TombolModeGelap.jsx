"use client";

import { useEffect, useState } from "react";

export default function TombolModeGelap() {
  const [tema, setTema] = useState("terang");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Ambil preferensi dari localStorage atau preferensi sistem
    try {
      const tersimpan = localStorage.getItem("katalog_umkm_tema");
      if (tersimpan === "dark" || (!tersimpan && window.matchMedia("(prefers-color-scheme: dark)").matches)) {
        setTema("gelap");
        document.documentElement.classList.add("dark");
      } else {
        setTema("terang");
        document.documentElement.classList.remove("dark");
      }
    } catch {
      // Abaikan
    }
    setMounted(true);
  }, []);

  const gantiTema = () => {
    const temaBaru = tema === "terang" ? "gelap" : "terang";
    setTema(temaBaru);

    if (temaBaru === "gelap") {
      document.documentElement.classList.add("dark");
      try {
        localStorage.setItem("katalog_umkm_tema", "dark");
      } catch {}
    } else {
      document.documentElement.classList.remove("dark");
      try {
        localStorage.setItem("katalog_umkm_tema", "light");
      } catch {}
    }
  };

  if (!mounted) {
    return (
      <button
        type="button"
        className="flex h-9 w-9 items-center justify-center rounded-xl border border-garis bg-latar text-sm text-teks-lembut opacity-50"
        aria-label="Memuat tombol tema"
      >
        🌓
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={gantiTema}
      className="flex h-9 w-9 items-center justify-center rounded-xl border border-garis bg-latar text-base text-teks transition hover:border-utama hover:text-utama"
      aria-label={tema === "gelap" ? "Beralih ke mode terang" : "Beralih ke mode gelap"}
      title={tema === "gelap" ? "Mode Terang" : "Mode Gelap"}
    >
      <span>{tema === "gelap" ? "☀️" : "🌙"}</span>
    </button>
  );
}
