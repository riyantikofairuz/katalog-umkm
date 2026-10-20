"use server";

import { redirect } from "next/navigation";
import { buatKlienAdmin } from "@/lib/supabase";

export async function loginAdmin(prevState, formData) {
  const email = formData.get("email");
  const password = formData.get("password");

  if (!email || !password) {
    return { error: "Email dan password wajib diisi." };
  }

  const supabase = await buatKlienAdmin();
  const { error } = await supabase.auth.signInWithPassword({
    email: email.toString(),
    password: password.toString(),
  });

  if (error) {
    return { error: "Email atau password salah. Silakan coba lagi." };
  }

  redirect("/admin");
}

export async function logoutAdmin() {
  const supabase = await buatKlienAdmin();
  await supabase.auth.signOut();
  redirect("/admin/login");
}

export async function gantiPassword(prevState, formData) {
  const passwordBaru = formData.get("password_baru");
  const konfirmasiPassword = formData.get("konfirmasi_password");

  if (!passwordBaru || !konfirmasiPassword) {
    return { error: "Semua kolom password wajib diisi." };
  }

  const strPasswordBaru = passwordBaru.toString();
  const strKonfirmasi = konfirmasiPassword.toString();

  if (strPasswordBaru.length < 8) {
    return { error: "Password baru minimal 8 karakter." };
  }

  if (strPasswordBaru !== strKonfirmasi) {
    return { error: "Konfirmasi password tidak cocok dengan password baru." };
  }

  const supabase = await buatKlienAdmin();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return { error: "Sesi tidak valid atau Anda belum login. Silakan login kembali." };
  }

  const { error } = await supabase.auth.updateUser({
    password: strPasswordBaru,
  });

  if (error) {
    return { error: `Gagal mengganti password: ${error.message}` };
  }

  return { success: "Password berhasil diperbarui." };
}

export async function tambahProduk(prevState, formData) {
  const supabase = await buatKlienAdmin();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return { error: "Aksi ditolak: Anda harus login sebagai admin." };
  }

  const nama = formData.get("nama")?.toString().trim();
  const hargaRaw = formData.get("harga")?.toString().trim();
  const kategori = formData.get("kategori")?.toString().trim() || null;
  const foto_url = formData.get("foto_url")?.toString().trim() || null;
  const deskripsi = formData.get("deskripsi")?.toString().trim() || null;

  if (!nama) {
    return { error: "Nama produk wajib diisi." };
  }

  const harga = parseInt(hargaRaw, 10);
  if (isNaN(harga) || harga < 0) {
    return { error: "Harga produk harus berupa angka positif." };
  }

  const { error } = await supabase.from("produk").insert({
    nama,
    harga,
    kategori,
    foto_url,
    deskripsi,
  });

  if (error) {
    return { error: `Gagal menambah produk: ${error.message}` };
  }

  redirect("/admin");
}

export async function ubahProduk(id, prevState, formData) {
  const supabase = await buatKlienAdmin();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return { error: "Aksi ditolak: Anda harus login sebagai admin." };
  }

  const nama = formData.get("nama")?.toString().trim();
  const hargaRaw = formData.get("harga")?.toString().trim();
  const kategori = formData.get("kategori")?.toString().trim() || null;
  const foto_url = formData.get("foto_url")?.toString().trim() || null;
  const deskripsi = formData.get("deskripsi")?.toString().trim() || null;

  if (!nama) {
    return { error: "Nama produk wajib diisi." };
  }

  const harga = parseInt(hargaRaw, 10);
  if (isNaN(harga) || harga < 0) {
    return { error: "Harga produk harus berupa angka positif." };
  }

  const { error } = await supabase
    .from("produk")
    .update({
      nama,
      harga,
      kategori,
      foto_url,
      deskripsi,
    })
    .eq("id", id);

  if (error) {
    return { error: `Gagal memperbarui produk: ${error.message}` };
  }

  redirect("/admin");
}

export async function hapusProduk(id) {
  const supabase = await buatKlienAdmin();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return { error: "Aksi ditolak: Anda harus login sebagai admin." };
  }

  const { error } = await supabase.from("produk").delete().eq("id", id);

  if (error) {
    return { error: `Gagal menghapus produk: ${error.message}` };
  }

  redirect("/admin");
}

export async function buatDeskripsiAI(nama, kategori) {
  const supabase = await buatKlienAdmin();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return { error: "Aksi ditolak: Anda harus login sebagai admin." };
  }

  if (!nama || !nama.trim()) {
    return { error: "Nama produk harus diisi terlebih dahulu untuk membuat deskripsi AI." };
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    // Fallback deskripsi berkualitas jika API key belum diisi di environment
    const deskripsiFallback = `${nama.trim()}${
      kategori ? ` dalam kategori ${kategori.trim()}` : ""
    } berkualitas tinggi, dibuat dengan bahan pilihan dan standar terbaik untuk kepuasan pelanggan.`;
    return { deskripsi: deskripsiFallback };
  }

  try {
    const prompt = `Buatkan deskripsi produk yang menarik, ramah, dan menjual untuk toko UMKM Indonesia.
Nama produk: ${nama.trim()}
Kategori: ${kategori?.trim() || "Umum"}

Ketentuan:
- Bahasa Indonesia yang santun dan menarik pembeli
- Panjang 2-3 kalimat ringkas (sekitar 30-50 kata)
- Jangan gunakan format markdown judul (tanpa # atau *)
- Hanya keluarkan teks deskripsi saja`;

    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
        }),
      }
    );

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      return {
        error: `Gagal memanggil Gemini API (${res.status}): ${
          errData?.error?.message || "Terjadi kesalahan"
        }`,
      };
    }

    const data = await res.json();
    const deskripsiHasil =
      data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || "";

    if (!deskripsiHasil) {
      return { error: "Gemini tidak menghasilkan deskripsi. Silakan coba lagi." };
    }

    return { deskripsi: deskripsiHasil };
  } catch (err) {
    return { error: `Gagal menghubungi layanan AI: ${err.message}` };
  }
}



