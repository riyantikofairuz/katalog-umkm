"use server";

import { redirect } from "next/navigation";
import { buatKlienAdmin, buatKlienServer } from "@/lib/supabase";

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

// US-29: Fungsi upload gambar ke Supabase Storage
async function unggahFotoStorage(file) {
  if (!file || typeof file !== "object" || file.size === 0) {
    return { url: null };
  }

  // Validasi tipe file gambar
  const validMimeTypes = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/svg+xml"];
  if (!validMimeTypes.includes(file.type)) {
    return { error: "File harus berupa gambar (JPG, PNG, WebP, GIF, atau SVG)." };
  }

  // Validasi ukuran maksimal (maks 2MB)
  const maxUkuran = 2 * 1024 * 1024; // 2MB
  if (file.size > maxUkuran) {
    return { error: "Ukuran foto maksimal adalah 2 MB." };
  }

  try {
    // Gunakan buatKlienServer dengan SUPABASE_SECRET_KEY untuk mengunggah ke storage
    const supabase = buatKlienServer();
    const ekstensi = file.name ? file.name.split(".").pop() : "jpg";
    const namaUnik = `produk_${Date.now()}_${Math.random().toString(36).substring(2, 9)}.${ekstensi}`;
    const buffer = Buffer.from(await file.arrayBuffer());

    // Coba upload ke bucket 'produk'
    const { error: uploadError } = await supabase.storage
      .from("produk")
      .upload(namaUnik, buffer, {
        contentType: file.type,
        upsert: false,
      });

    if (uploadError) {
      return { error: `Gagal mengunggah foto ke storage: ${uploadError.message}` };
    }

    const { data: publicUrlData } = supabase.storage
      .from("produk")
      .getPublicUrl(namaUnik);

    return { url: publicUrlData?.publicUrl || null };
  } catch (err) {
    return { error: `Terjadi kesalahan saat memproses file foto: ${err.message}` };
  }
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

  const nama = formData.get("nama")?.toString().trim() || "";
  const hargaRaw = formData.get("harga")?.toString().trim() || "";
  const kategori = formData.get("kategori")?.toString().trim() || "";
  let foto_url = formData.get("foto_url")?.toString().trim() || "";
  const deskripsi = formData.get("deskripsi")?.toString().trim() || "";
  const fileFoto = formData.get("file_foto");

  // US-34: Validasi per field di sisi server
  const fieldErrors = {};
  if (!nama) {
    fieldErrors.nama = "Nama produk wajib diisi.";
  }

  const harga = parseInt(hargaRaw, 10);
  if (!hargaRaw) {
    fieldErrors.harga = "Harga produk wajib diisi.";
  } else if (isNaN(harga) || harga < 0) {
    fieldErrors.harga = "Harga produk harus berupa angka positif.";
  }

  // Jika ada error validasi per field, kembalikan fieldErrors dan values agar nilai tidak hilang
  if (Object.keys(fieldErrors).length > 0) {
    return {
      fieldErrors,
      values: { nama, harga: hargaRaw, kategori, foto_url, deskripsi },
    };
  }

  // Jika admin mengunggah file foto baru
  if (fileFoto && typeof fileFoto === "object" && fileFoto.size > 0) {
    const uploadRes = await unggahFotoStorage(fileFoto);
    if (uploadRes.error) {
      return {
        fieldErrors: { foto_url: uploadRes.error },
        values: { nama, harga: hargaRaw, kategori, foto_url, deskripsi },
      };
    }
    if (uploadRes.url) {
      foto_url = uploadRes.url;
    }
  }

  const { error } = await supabase.from("produk").insert({
    nama,
    harga,
    kategori: kategori || null,
    foto_url: foto_url || null,
    deskripsi: deskripsi || null,
  });

  if (error) {
    return {
      error: `Gagal menambah produk: ${error.message}`,
      values: { nama, harga: hargaRaw, kategori, foto_url, deskripsi },
    };
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

  const nama = formData.get("nama")?.toString().trim() || "";
  const hargaRaw = formData.get("harga")?.toString().trim() || "";
  const kategori = formData.get("kategori")?.toString().trim() || "";
  let foto_url = formData.get("foto_url")?.toString().trim() || "";
  const deskripsi = formData.get("deskripsi")?.toString().trim() || "";
  const fileFoto = formData.get("file_foto");

  // US-34: Validasi per field di sisi server
  const fieldErrors = {};
  if (!nama) {
    fieldErrors.nama = "Nama produk wajib diisi.";
  }

  const harga = parseInt(hargaRaw, 10);
  if (!hargaRaw) {
    fieldErrors.harga = "Harga produk wajib diisi.";
  } else if (isNaN(harga) || harga < 0) {
    fieldErrors.harga = "Harga produk harus berupa angka positif.";
  }

  // Jika ada error validasi per field, kembalikan fieldErrors dan values agar nilai tidak hilang
  if (Object.keys(fieldErrors).length > 0) {
    return {
      fieldErrors,
      values: { nama, harga: hargaRaw, kategori, foto_url, deskripsi },
    };
  }

  // Jika admin mengunggah file foto baru
  if (fileFoto && typeof fileFoto === "object" && fileFoto.size > 0) {
    const uploadRes = await unggahFotoStorage(fileFoto);
    if (uploadRes.error) {
      return {
        fieldErrors: { foto_url: uploadRes.error },
        values: { nama, harga: hargaRaw, kategori, foto_url, deskripsi },
      };
    }
    if (uploadRes.url) {
      foto_url = uploadRes.url;
    }
  }

  const { error } = await supabase
    .from("produk")
    .update({
      nama,
      harga,
      kategori: kategori || null,
      foto_url: foto_url || null,
      deskripsi: deskripsi || null,
    })
    .eq("id", id);

  if (error) {
    return {
      error: `Gagal memperbarui produk: ${error.message}`,
      values: { nama, harga: hargaRaw, kategori, foto_url, deskripsi },
    };
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

// US-32: Server Action untuk Mengaktifkan / Menonaktifkan Produk
export async function beralihStatusProduk(id, statusSaatIni) {
  const supabase = await buatKlienAdmin();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return { error: "Aksi ditolak: Anda harus login sebagai admin." };
  }

  // Ambil data produk saat ini
  const { data: produk, error: fetchError } = await supabase
    .from("produk")
    .select("nama, deskripsi")
    .eq("id", id)
    .single();

  if (fetchError || !produk) {
    return { error: "Produk tidak ditemukan." };
  }

  let namaBaru = produk.nama;
  const isCurrentlyNonaktif = produk.nama.startsWith("[NONAKTIF] ");

  if (isCurrentlyNonaktif) {
    // Aktifkan kembali: buang prefix '[NONAKTIF] '
    namaBaru = produk.nama.replace(/^\[NONAKTIF\]\s*/, "");
  } else {
    // Nonaktifkan produk: tambahkan prefix '[NONAKTIF] '
    namaBaru = `[NONAKTIF] ${produk.nama}`;
  }

  const { error: updateError } = await supabase
    .from("produk")
    .update({ nama: namaBaru })
    .eq("id", id);

  if (updateError) {
    return { error: `Gagal memperbarui status produk: ${updateError.message}` };
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

// US-31: Server Actions untuk Kelola Kategori
export async function tambahKategori(prevState, formData) {
  const supabase = await buatKlienAdmin();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return { error: "Aksi ditolak: Anda harus login sebagai admin." };
  }

  const namaKategori = formData.get("nama")?.toString().trim();
  if (!namaKategori) {
    return { error: "Nama kategori tidak boleh kosong." };
  }

  // Coba insert ke tabel kategori jika ada
  const { error: insertCatError } = await supabase
    .from("kategori")
    .insert({ nama: namaKategori });

  if (insertCatError) {
    // Jika tabel kategori tidak ada (status 404/PGRST205),
    // simpan entitas master kategori menggunakan record khusus di tabel produk
    const { error: insertProdError } = await supabase.from("produk").insert({
      nama: `[KATEGORI] ${namaKategori}`,
      harga: 0,
      kategori: namaKategori,
      deskripsi: "__KATEGORI_SYS__",
    });

    if (insertProdError) {
      return { error: `Gagal menambah kategori: ${insertProdError.message}` };
    }
  }

  redirect("/admin/kategori");
}

export async function ubahKategori(namaLama, prevState, formData) {
  const supabase = await buatKlienAdmin();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return { error: "Aksi ditolak: Anda harus login sebagai admin." };
  }

  const namaBaru = formData.get("nama")?.toString().trim();
  if (!namaBaru) {
    return { error: "Nama kategori baru tidak boleh kosong." };
  }

  if (namaBaru === namaLama) {
    return { error: "Nama kategori baru tidak boleh sama dengan nama lama." };
  }

  // Update seluruh produk yang menggunakan kategori ini
  const { error: updateProdukError } = await supabase
    .from("produk")
    .update({ kategori: namaBaru })
    .eq("kategori", namaLama);

  if (updateProdukError) {
    return { error: `Gagal memperbarui kategori pada produk: ${updateProdukError.message}` };
  }

  // Update juga nama placeholder jika ada
  await supabase
    .from("produk")
    .update({ nama: `[KATEGORI] ${namaBaru}` })
    .eq("deskripsi", "__KATEGORI_SYS__")
    .eq("kategori", namaBaru);

  // Coba update juga di tabel kategori jika tabel tersebut tersedia
  await supabase
    .from("kategori")
    .update({ nama: namaBaru })
    .eq("nama", namaLama);

  redirect("/admin/kategori");
}

export async function hapusKategori(namaKategori) {
  const supabase = await buatKlienAdmin();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return { error: "Aksi ditolak: Anda harus login sebagai admin." };
  }

  // Validasi: Cek apakah kategori masih dipakai oleh produk reguler (bukan placeholder)
  const { count, error: countError } = await supabase
    .from("produk")
    .select("id", { count: "exact", head: true })
    .eq("kategori", namaKategori)
    .neq("deskripsi", "__KATEGORI_SYS__");

  if (countError) {
    return { error: `Gagal memeriksa pemakaian kategori: ${countError.message}` };
  }

  if (count && count > 0) {
    return {
      error: `Kategori "${namaKategori}" tidak bisa dihapus karena masih digunakan oleh ${count} produk. Silakan ubah atau pindahkan kategori produk tersebut terlebih dahulu.`,
    };
  }

  // Hapus dari tabel kategori jika ada
  await supabase
    .from("kategori")
    .delete()
    .eq("nama", namaKategori);

  // Hapus juga placeholder record jika ada
  await supabase
    .from("produk")
    .delete()
    .eq("kategori", namaKategori)
    .eq("deskripsi", "__KATEGORI_SYS__");

  redirect("/admin/kategori");
}




