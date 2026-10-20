# Jurnal Prompt

Catat prompt penting selama membangun aplikasi: apa yang kamu minta, hasilnya, dan perbaikan yang dilakukan. Beri tanda **[SENDIRI]** untuk prompt yang kamu tulis sendiri (bukan dari lembar kerja).

## US-01 Katalog dari database
**[Prompt:Baca AGENTS.md dan docs/user-stories.md bagian US-01.
Ubah app/page.jsx supaya daftar produk diambil dari tabel "produk" di Supabase, di sisi server, memakai SUPABASE_URL dan SUPABASE_SECRET_KEY dari environment variable. Buat koneksi Supabase untuk server di folder lib/supabase.
Tampilkan produk dengan komponen KartuProduk yang sudah ada, tanpa mengubah tampilannya. Kalau gagal mengambil data, tampilkan pesan error yang jelas di halaman. Kalau tabel kosong, tampilkan tulisan "Belum ada produk". Hapus CatatanBelumAktif dari halaman ini.]**

**Hasil:**
- Berhasil membuat koneksi Supabase server di `lib/supabase/server.js` menggunakan SUPABASE_URL dan SUPABASE_SECRET_KEY.
- Halaman `app/page.jsx` berhasil mengambil data produk dari tabel `produk` di Supabase secara server-side.
- Produk ditampilkan menggunakan komponen `KartuProduk` bawaan tanpa mengubah tampilannya.
- Menampilkan tulisan "Belum ada produk" saat data kosong dan menampilkan pesan error jika terjadi kegagalan pengambilan data.
- Menghapus komponen `CatatanBelumAktif`.
- Lolos pengujian build (`npm run build`).

**Perbaikan:**
Tidak ada kendala, implementasi langsung berjalan sesuai kriteria US-01.

## US-02 Detail produk
**[Prompt:Baca AGENTS.md dan docs/user-stories.md bagian US-02.
Buat halaman app/produk/[id]/page.jsx.
Pada halaman itu, tampilkan detail satu produk berdasarkan ID yang ada di URL (gunakan parameter :id).
Ambil data produk dari tabel "produk" di Supabase memakai SUPABASE_URL dan SUPABASE_SECRET_KEY.
Jika produk tidak ditemukan, tampilkan halaman error 404 dengan pesan "Produk tidak ditemukan".
Jika berhasil, tampilkan judul, deskripsi, harga, dan foto produk dalam format yang rapi. Kalau foto produk belum ada (URL null atau kosong), tampilkan tulisan "Belum ada foto".
Beri tombol "Kembali ke halaman utama" yang mengarah ke /.
Pastikan halaman ini bisa diakses langsung melalui URL dan tidak crash kalau ID tidak valid.]**

**Hasil:**

**Perbaikan:**

## US-03 Pesan via WhatsApp
**[Prompt:Baca AGENTS.md dan docs/user-stories.md bagian US-03.
Ubah komponen KartuProduk di app/produk/[id]/page.jsx supaya punya tombol "Pesan via WhatsApp" di bawah harga. Tombol itu harus terbuka di tab baru dan langsung menuju chat ke nomor WhatsApp admin (misalnya 08123456789 atau nomor lain yang kamu pilih). Format pesannya otomatis berupa: "Halo, saya tertarik dengan produk {{nama_produk}}".
Pastikan format tombol tetap rapi dan tidak mengubah layout KartuProduk secara signifikan.]**

**Hasil:**

**Perbaikan:**

## US-04 Login admin
**[Prompt:Baca AGENTS.md dan docs/user-stories.md bagian US-04.
Buat halaman app/admin/login/page.jsx.
Tampilkan form login dengan dua input: email dan password, serta tombol "Masuk".
Form harus bisa mengirim data POST ke sebuah endpoint server (misalnya /api/login) yang bisa kamu buat nanti.
Jangan simpan state login pakai useState. Pakai saja komponen <form> bawaan Next.js + action untuk mengirim data ke server.
Pastikan tampilan form sederhana, rapi, dan mudah digunakan.]**

**Hasil:**

**Perbaikan:**

## US-05 Ganti password
**[Prompt:Baca AGENTS.md dan docs/user-stories.md bagian US-05.
Buat halaman app/admin/ganti-password/page.jsx.
Tampilkan form ganti password dengan tiga input: email, password baru, dan konfirmasi password baru, plus tombol "Ubah Password".
Form harus mengirim data POST ke /api/ganti-password. Jangan pakai useState, manfaatkan <form> dan action.
Pastikan tampilannya rapi dan mudah dipakai.]**

**Hasil:**

**Perbaikan:**

## US-06 Proteksi halaman admin
**[Prompt:Baca AGENTS.md dan docs/user-stories.md bagian US-06. Baca juga file lib/supabase/server.js agar tahu cara membuat koneksi server yang aman. Implementasikan pemeriksaan hak akses admin:

Halaman app/admin/page.jsx: sebelum menampilkan tabel, cek apakah user sudah login. Kalau belum, redirect ke /admin/login.

Halaman app/admin/login/page.jsx: setelah berhasil login, redirect ke /admin.

Halaman app/admin/ganti-password/page.jsx: sebelum menampilkan form, cek apakah user sudah login. Kalau belum, redirect ke /admin/login.]**

**Hasil:**

**Perbaikan:**

## Debugging dan fitur bonus

Tambahkan bagian baru untuk setiap error yang kamu perbaiki atau fitur bonus yang kamu kerjakan.
