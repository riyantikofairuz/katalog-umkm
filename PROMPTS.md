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
- Berhasil membuat halaman dinamis `app/produk/[id]/page.jsx` menggunakan async params (`const { id } = await params`).
- Mengambil data produk dari database Supabase di sisi server menggunakan helper `buatKlienServer`.
- Menampilkan foto produk, kategori, nama, harga (format rupiah), deskripsi, serta tautan kembali ke katalog.
- Menggunakan `notFound()` Next.js jika produk tidak ditemukan atau ID tidak valid.

**Perbaikan:**
Tidak ada kendala, penanganan not-found dan pengambilan data dinamis berjalan dengan baik.

## US-03 Pesan via WhatsApp
**[Prompt:Baca AGENTS.md dan docs/user-stories.md bagian US-03.
Ubah komponen KartuProduk di app/produk/[id]/page.jsx supaya punya tombol "Pesan via WhatsApp" di bawah harga. Tombol itu harus terbuka di tab baru dan langsung menuju chat ke nomor WhatsApp admin (misalnya 08123456789 atau nomor lain yang kamu pilih). Format pesannya otomatis berupa: "Halo, saya tertarik dengan produk {{nama_produk}}".
Pastikan format tombol tetap rapi dan tidak mengubah layout KartuProduk secara signifikan.]**

**Hasil:**
- Komponen `TombolWhatsApp` terpasang di halaman detail produk `app/produk/[id]/page.jsx`.
- Menggunakan nomor WhatsApp resmi dari `lib/toko.js` yang dinormalisasi (hanya angka tanpa tanda +).
- Pesan otomatis diformat memuat nama produk dan harga dengan `encodeURIComponent`, serta membuka link `https://wa.me/...` di tab baru (`target="_blank"`).
- Berfungsi baik di perangkat mobile maupun desktop.

**Perbaikan:**
Tidak ada kendala, tombol pesan WhatsApp terintegrasi sesuai panduan rancangan teknis.

## US-04 Login admin
**[Prompt:Baca AGENTS.md dan docs/user-stories.md bagian US-04.
Buat halaman app/admin/login/page.jsx.
Tampilkan form login dengan dua input: email dan password, serta tombol "Masuk".
Form harus bisa mengirim data POST ke sebuah endpoint server (misalnya /api/login) yang bisa kamu buat nanti.
Jangan simpan state login pakai useState. Pakai saja komponen <form> bawaan Next.js + action untuk mengirim data ke server.
Pastikan tampilan form sederhana, rapi, dan mudah digunakan.]**

**Hasil:**
- Halaman `app/admin/login/page.jsx` dibuat dengan komponen form dan Server Action `loginAdmin` di `app/admin/actions.js`.
- Menggunakan Supabase Auth (`supabase.auth.signInWithPassword`) yang diproses di server melalui helper `buatKlienAdmin` (`@supabase/ssr`).
- Login berhasil mengarahkan pengguna ke `/admin`, sedangkan login gagal menampilkan pesan error yang informatif di bawah form.
- Tombol "Keluar" (`logoutAdmin`) di `NavAdmin` mengakhiri sesi admin dan mengembalikan pengguna ke `/admin/login`.

**Perbaikan:**
Memastikan kredensial diproses sepenuhnya di server tanpa mengekspos secret key ke client.

## US-05 Ganti password
**[Prompt:Baca AGENTS.md dan docs/user-stories.md bagian US-05.
Buat halaman app/admin/ganti-password/page.jsx.
Tampilkan form ganti password dengan tiga input: email, password baru, dan konfirmasi password baru, plus tombol "Ubah Password".
Form harus mengirim data POST ke /api/ganti-password. Jangan pakai useState, manfaatkan <form> dan action.
Pastikan tampilannya rapi dan mudah dipakai.]**

**Hasil:**
- Halaman `app/admin/password/page.jsx` dibuat dengan form penggantian password melalui Server Action `gantiPassword` di `app/admin/actions.js`.
- Memvalidasi password baru minimal 8 karakter dan memeriksa kecocokan dengan konfirmasi password di sisi server.
- Memperbarui password user yang sedang aktif menggunakan `supabase.auth.updateUser`.
- Menampilkan pesan sukses atau pesan error secara jelas kepada admin.

**Perbaikan:**
Tidak ada kendala, validasi server dan umpan balik form berfungsi dengan tepat.

## US-06 Proteksi halaman admin
**[Prompt:Baca AGENTS.md dan docs/user-stories.md bagian US-06. Baca juga file lib/supabase/server.js agar tahu cara membuat koneksi server yang aman. Implementasikan pemeriksaan hak akses admin:

Halaman app/admin/page.jsx: sebelum menampilkan tabel, cek apakah user sudah login. Kalau belum, redirect ke /admin/login.

Halaman app/admin/login/page.jsx: setelah berhasil login, redirect ke /admin.

Halaman app/admin/ganti-password/page.jsx: sebelum menampilkan form, cek apakah user sudah login. Kalau belum, redirect ke /admin/login.]**

**Hasil:**
- Mengimplementasikan middleware/proxy di `proxy.js` (sesuai spesifikasi Next.js 16) yang memproteksi seluruh rute di bawah `/admin` (kecuali `/admin/login`).
- Menggunakan `createServerClient` dari `@supabase/ssr` untuk memeriksa sesi autentikasi pengguna secara server-side.
- Pengguna yang belum login otomatis dialihkan (redirect) ke `/admin/login`.
- Seluruh aksi server yang mengubah data memverifikasi sesi login admin terlebih dahulu.

**Perbaikan:**
Memastikan pengecualian rute untuk `/admin/login` pada matcher dan logic proxy agar tidak terjadi siklus redirect (infinite redirect loop).

## Debugging dan fitur bonus

Tambahkan bagian baru untuk setiap error yang kamu perbaiki atau fitur bonus yang kamu kerjakan.

## US-07 List Produk
**[Prompt:Sebagai admin, saya ingin produk pada page `/admin` mengambil data dari database.
Bernilai 10 poin.
Kriteria selesai:
- Daftar produk di `/admin` diambil dari database, bukan data contoh. (10 poin)]**

**Hasil:**
- Halaman `app/admin/page.jsx` diubah menjadi Server Component yang mengambil daftar produk langsung dari database Supabase (`produk`).
- Menggunakan koneksi sesi admin `buatKlienAdmin` dari `lib/supabase` dengan pengurutan `created_at` descending.
- Menghapus ketergantungan pada `produkContoh` dari `lib/data-contoh.js`.
- Menambahkan penanganan pesan error jika kueri gagal serta pesan "Belum ada produk" jika tabel kosong.
- Produk ditampilkan dengan komponen `TabelProduk` yang sudah ada.

**Perbaikan:**
Tidak ada kendala, kueri database berjalan normal sesuai hak akses admin dan RLS.

## US-08 Tambah produk
**[Prompt:Sebagai admin, saya ingin menambah produk baru dari halaman admin.
Bernilai 10 poin.
Kriteria selesai:
- Form di `/admin/produk/baru` menyimpan produk ke database. (5 poin)
- Setelah menyimpan, halaman kembali ke `/admin`. (2 poin)
- Aksinya terlindungi login: tanpa login ditolak oleh server. (3 poin)]**

**Hasil:**
- Membuat Server Action `tambahProduk` di `app/admin/actions.js` dengan validasi autentikasi admin di server via `buatKlienAdmin()`.
- Menyimpan data produk (nama, harga, kategori, foto_url, deskripsi) ke tabel `produk` di Supabase.
- Berhasil mengarahkan kembali ke `/admin` setelah produk disimpan via `redirect("/admin")`.
- Menghapus komponen `CatatanBelumAktif` dari `app/admin/produk/baru/page.jsx`.
- Melakukan validasi input di server (nama wajib diisi, harga angka positif) serta menampilkan pesan error jika gagal.

**Perbaikan:**
Menyesuaikan komponen `FormProduk` agar menerima props `action`, `error`, dan `isPending` secara reusable tanpa merusak komponen lain.

## US-09 Ubah produk
**[Prompt:Sebagai admin, saya ingin mengubah data produk.
Bernilai 10 poin.
Kriteria selesai:
- Form di `/admin/produk/[id]/ubah` terisi data lama. (4 poin)
- Perubahan tersimpan ke database. (3 poin)
- Aksinya terlindungi login: tanpa login ditolak oleh server. (3 poin)]**

**Hasil:**
- Halaman `app/admin/produk/[id]/ubah/page.jsx` mengambil data produk lama dari database Supabase berdasarkan id yang diakses (`const { id } = await params`).
- Mengisi nilai awal pada input form (`nama`, `harga`, `kategori`, `foto_url`, `deskripsi`) dari data lama produk.
- Menghapus komponen `CatatanBelumAktif` dan fungsi dummy `cariProdukContoh`.
- Membuat Server Action `ubahProduk` di `app/admin/actions.js` yang memvalidasi sesi login admin, memvalidasi input data produk, dan melakukan update data ke tabel `produk` di Supabase.
- Berhasil mengarahkan kembali ke `/admin` (`redirect("/admin")`) setelah perubahan disimpan.

**Perbaikan:**
Membuat komponen perantara `FormUbahProduk.jsx` untuk mengikat ID produk (`ubahProduk.bind(null, produk.id)`) dengan `useActionState` secara bersih dan modular.

## US-10 Hapus produk
**[Prompt:Sebagai admin, saya ingin menghapus produk.
Bernilai 10 poin.
Kriteria selesai:
- Tombol "Hapus" meminta konfirmasi. (4 poin)
- Produk terhapus dari database. (3 poin)
- Aksinya terlindungi login: tanpa login ditolak oleh server. (3 poin)]**

**Hasil:**
- Membuat komponen client `TombolHapusProduk.jsx` yang memicu dialog konfirmasi (`window.confirm`) dengan pesan konfirmasi yang jelas memuat nama produk sebelum eksekusi penghapusan.
- Membuat Server Action `hapusProduk(id)` di `app/admin/actions.js` yang memverifikasi login admin di server melalui `buatKlienAdmin()`.
- Menghapus baris produk terkait dari tabel `produk` di Supabase dan mengarahkan kembali/me-refresh halaman `/admin`.
- Memperbarui komponen `TabelProduk.jsx` agar menggunakan `TombolHapusProduk`.

**Perbaikan:**
Menggunakan `useTransition` pada tombol konfirmasi hapus agar memberikan feedback status ("Menghapus...") saat penghapusan sedang diproses.

## US-11 Filter kategori atau pencarian
**[Prompt:Sebagai pengunjung, saya ingin menyaring produk berdasarkan kategori atau mencari nama produk.
Bernilai 10 poin.
Kriteria selesai:
- Pengunjung bisa menyaring produk per kategori atau mencari nama produk, dan hasilnya sesuai. (10 poin)]**

**Hasil:**
- Membuat komponen client `FilterCariProduk.jsx` yang menyediakan kolom pencarian teks serta deretan tombol filter kategori dinamis.
- Parameter filter dan pencarian disimpan di URL query (`?kategori=...&q=...`) sehingga tautan dapat dibagikan dan tetap bertahan saat refresh.
- Pada `app/page.jsx`, parameter dibaca via `searchParams` Promise (`await searchParams`), lalu disaring langsung pada query Supabase (`.ilike('nama', ...)` dan `.eq('kategori', ...)`).
- Menampilkan pesan yang jelas jika hasil pencarian atau filter tidak ditemukan.

**Perbaikan:**
Memanfaatkan `useTransition` saat navigasi URL pencarian/kategori agar transisi filter terasa halus dan responsif.

## US-12 Pilih jumlah atau varian
**[Prompt:Sebagai pengunjung, saya ingin memilih jumlah atau varian sebelum memesan, dan pilihan itu ikut tertulis di pesan WhatsApp.
Bernilai 10 poin.
Kriteria selesai:
- Pengunjung bisa memilih jumlah atau varian sebelum memesan. (5 poin)
- Pilihan itu ikut tertulis di pesan WhatsApp. (5 poin)]**

**Hasil:**
- Membuat komponen client `PilihanPesanWhatsApp.jsx` pada halaman detail produk `app/produk/[id]/page.jsx`.
- Menyediakan antarmuka interaktif untuk memilih varian produk ("Reguler", "Spesial", "Hemat / Grosir") dan tombol +/- untuk mengatur kuantitas/jumlah pemesanan.
- Menghitung subtotal harga secara dinamis sesuai jumlah yang dipilih.
- Menyusun format pesan WhatsApp yang memuat nama produk, varian yang dipilih, jumlah barang, dan total harga ke tautan `https://wa.me/...`.

**Perbaikan:**
Memastikan pesan teks WhatsApp di-encode dengan aman menggunakan `encodeURIComponent` dan nomor WhatsApp toko tetap dinormalisasi dari `lib/toko.js`.

## US-13 PWA
**[Prompt:Sebagai pengunjung, saya ingin memasang katalog di layar HP seperti aplikasi. Ikon tersedia di `public/icons`.
Bernilai 10 poin.
Kriteria selesai:
- Ada web app manifest yang ditautkan di halaman. (4 poin)
- Ikon tersedia di `public/icons` dan dirujuk di manifest. (3 poin)
- Katalog bisa di-install ke layar utama HP. (3 poin)]**

**Hasil:**
- Membuat file `public/manifest.json` yang mendefinisikan properti web app (nama toko, display standalone, start_url, theme_color, background_color).
- Merujuk ikon PWA yang ada di `public/icons/icon-192.png` dan `public/icons/icon-512.png` ke dalam manifest.
- Menautkan `manifest.json`, icon metadata, serta konfigurasi viewport themeColor di `app/layout.jsx`.
- Katalog kini memenuhi standar Progressive Web App (PWA) sehingga dapat dipasang (install) langsung ke layar utama HP maupun desktop.

**Perbaikan:**
Menyesuaikan nama toko dan tagline secara otomatis pada manifest dengan identitas toko, serta memisahkan `themeColor` ke export `viewport` sesuai spesifikasi Next.js App Router.

## US-14 Deskripsi produk dibuat AI
**[Prompt:Sebagai admin, saya ingin membuat deskripsi produk secara otomatis dengan AI (Gemini API) dari nama dan kategori produk.
Bernilai 10 poin.
Kriteria selesai:
- Admin bisa membuat deskripsi otomatis dari nama dan kategori produk. (4 poin)
- Gemini API dipanggil dari server, kunci tidak ada di browser. (3 poin)
- Hasilnya mengisi kolom deskripsi sebelum produk disimpan. (3 poin)]**

**Hasil:**
- Membuat Server Action `buatDeskripsiAI(nama, kategori)` di `app/admin/actions.js` yang memverifikasi login admin dan memanggil Gemini API dari server tanpa mengekspos API key ke browser.
- Menambahkan tombol "✨ Buat dengan AI" di komponen `FormProduk.jsx` tepat di atas input deskripsi.
- Hasil dari AI langsung mengisi state kolom `deskripsi` pada form sebelum admin menyimpannya ke database.
- Dilengkapi fallback deskripsi kontekstual berkualitas bila `GEMINI_API_KEY` belum disetel.

**Perbaikan:**
Menggunakan `useTransition` pada pembuatan deskripsi AI agar memberikan umpan balik visual ("Sedang membuatkan...") dan menonaktifkan tombol selama proses berlangsung.

## US-15 Urutkan produk
**[Prompt:Sebagai pengunjung, saya ingin mengurutkan produk, supaya cepat menemukan yang murah atau yang terbaru.
Bernilai 5 poin.
Kriteria selesai:
- Ada pilihan urutan: termurah, termahal, terbaru. (3 poin)
- Urutan diterapkan saat mengambil data (query), bukan hanya di tampilan. (2 poin)]**

**Hasil:**
- Menambahkan dropdown pilihan urutan ("Terbaru", "Termurah", "Termahal") pada komponen `FilterCariProduk.jsx`.
- Pilihan urutan disimpan ke URL query string (`?urutan=termurah` / `?urutan=termahal`).
- Pada `app/page.jsx`, parameter `urutan` diterapkan langsung ke query Supabase:
  - `termurah`: `.order('harga', { ascending: true })`
  - `termahal`: `.order('harga', { ascending: false })`
  - `terbaru`: `.order('created_at', { ascending: false })`
- Menjamin data diurutkan dari database sebelum dikirim ke tampilan.

**Perbaikan:**
Menyatukan perubahan urutan dengan pencarian dan filter kategori agar semua parameter pencarian saling bersinergi secara mulus.

## US-16 Paginasi atau muat lebih banyak
**[Prompt:Sebagai pengunjung, saya ingin daftar produk tidak terlalu panjang, supaya halaman cepat dibuka.
Bernilai 10 poin.
Kriteria selesai:
- Daftar produk dipecah per halaman atau ada tombol "muat lebih banyak". (4 poin)
- Pembatasan jumlah dilakukan di query database, bukan hanya disembunyikan. (3 poin)
- Navigasi antar halaman berfungsi dan jumlah halaman benar. (3 poin)]**

**Hasil:**
- Menerapkan pembatasan data produk per halaman (6 produk/halaman) menggunakan fungsi `.range(dari, sampai)` dan opsi `{ count: "exact" }` langsung di query Supabase pada `app/page.jsx`.
- Membuat komponen `Paginasi.jsx` yang menampilkan nomor halaman, tombol Sebelumnya, dan Berikutnya.
- Navigasi halaman mempertahankan parameter pencarian (`q`), filter kategori (`kategori`), dan urutan (`urutan`).
- Menghitung total data dan total halaman secara akurat dari database.

**Perbaikan:**
Memberikan indikator visual disabled pada tombol Sebelumnya dan Berikutnya bila pengguna sudah berada di halaman pertama atau terakhir.

## US-17 Produk terkait di halaman detail
**[Prompt:Sebagai pengunjung, saya ingin melihat produk lain yang mirip, supaya saya punya pilihan lain.
Bernilai 5 poin.
Kriteria selesai:
- Halaman detail menampilkan beberapa produk lain dari kategori yang sama. (3 poin)
- Produk yang sedang dibuka tidak ikut ditampilkan, dan data diambil dari database. (2 poin)]**

**Hasil:**
- Pada `app/produk/[id]/page.jsx`, menambahkan kueri ke Supabase untuk mengambil produk terkait dengan kategori yang sama (`.eq('kategori', produk.kategori)`).
- Mengecualikan produk yang sedang aktif (`.neq('id', id)`) agar tidak muncul berulang.
- Menampilkan produk terkait menggunakan komponen `KartuProduk` dalam grid yang rapi di bawah detail produk.
- Menangani kondisi jika tidak ada produk terkait (bagian produk terkait tidak akan dirender).

**Perbaikan:**
Membatasi jumlah produk terkait maksimal 3 item (`.limit(3)`) agar layout halaman detail tetap proporsional dan cepat dimuat.

## US-18 Galeri beberapa foto produk
**[Prompt:Sebagai pengunjung, saya ingin melihat beberapa foto satu produk, supaya saya tahu bentuk produknya dari berbagai sisi.
Bernilai 10 poin.
Kriteria selesai:
- Satu produk bisa punya lebih dari satu foto. (4 poin)
- Halaman detail menampilkan galeri dengan foto utama dan gambar kecil. (3 poin)
- Pengunjung bisa berganti foto, dan produk dengan satu foto tetap tampil normal. (3 poin)]**

**Hasil:**
- Membuat komponen client `GaleriFotoProduk.jsx` yang mendukung produk dengan satu foto maupun beberapa foto (multi-foto).
- Menampilkan foto utama besar dan deretan gambar kecil (thumbnail) yang dapat diklik pengunjung untuk berganti foto secara instan.
- Produk dengan hanya satu foto tetap tampil bersih dan normal tanpa deretan thumbnail kosong.
- Mengintegrasikan `GaleriFotoProduk` ke dalam `app/produk/[id]/page.jsx`.

**Perbaikan:**
Menambahkan fleksibilitas parser foto sehingga mendukung format string link jamak (dipisah koma/baris baru) maupun kolom array `foto_lainnya`.

## US-19 Status stok
**[Prompt:Sebagai pengunjung, saya ingin tahu produk yang habis, supaya saya tidak memesan produk yang tidak ada.
Bernilai 5 poin.
Kriteria selesai:
- Produk punya status atau jumlah stok di database. (2 poin)
- Produk yang habis diberi penanda "Habis" dan tombol pesan WhatsApp dinonaktifkan atau disembunyikan. (3 poin)]**

**Hasil:**
- Membaca status ketersediaan stok produk dari database (`status === 'habis'` atau `stok === 0`).
- Pada `KartuProduk.jsx`, produk yang habis diberi penanda/badge "Habis" dan gambar dibuat sedikit pudar/grayscale untuk membedakan visual.
- Pada `PilihanPesanWhatsApp.jsx` di halaman detail produk, tombol "Pesan via WhatsApp" dinonaktifkan dengan label "Stok Habis (Tidak Dapat Dipesan)", input jumlah di-disable, serta ditampilkan banner penanda stok habis.

**Perbaikan:**
Mendukung pengecekan stok yang fleksibel (baik dari kolom teks `status` maupun angka `stok`) agar kompatibel dengan data yang ada di database.

## US-20 Harga coret dan badge
**[Prompt:Sebagai pengunjung, saya ingin melihat harga diskon dan label produk, supaya saya tahu mana yang sedang promo atau baru.
Bernilai 5 poin.
Kriteria selesai:
- Produk bisa punya harga diskon, dan harga normal tampil dicoret di kartu dan halaman detail. (3 poin)
- Badge "Baru" atau "Terlaris" tampil berdasarkan data produk. (2 poin)]**

**Hasil:**
- Menambahkan logika harga diskon pada `KartuProduk.jsx` dan `app/produk/[id]/page.jsx`: harga normal ditampilkan dengan format dicoret (`line-through`) dan harga promo menjadi harga utama.
- Menampilkan label badge "Baru", "Terlaris", atau "Diskon" di sudut foto produk kartu maupun di sebelah kategori pada halaman detail.
- Menyesuaikan harga yang dikirim ke pemesanan WhatsApp agar otomatis menggunakan harga final setelah diskon.

**Perbaikan:**
Memberikan palet warna badge yang tegas dan harmonis (`bg-amber-600` untuk Terlaris, `bg-utama` untuk Baru, dan `bg-rose-600` untuk Diskon) sesuai aturan desain.

## US-21 Keranjang, pesan semua via WhatsApp
**[Prompt:Sebagai pengunjung, saya ingin memesan beberapa produk sekaligus, supaya tidak perlu mengirim pesan satu per satu.
Bernilai 15 poin.
Kriteria selesai:
- Ada tombol "Tambah ke keranjang" di kartu atau halaman detail. (4 poin)
- Keranjang bisa mengubah jumlah dan menghapus item, dan total harga benar. (4 poin)
- Isi keranjang bertahan saat pindah halaman. (4 poin)
- Satu tombol mengirim seluruh isi keranjang dalam satu pesan WhatsApp ke nomor di `lib/toko.js`. (3 poin)]**

**Hasil:**
- Membuat `KeranjangContext.jsx` yang menyimpan data keranjang ke `localStorage`, sehingga item tetap bertahan saat navigasi atau refresh halaman.
- Menambahkan tombol "🛒 Tambah ke keranjang" pada komponen `PilihanPesanWhatsApp.jsx` di halaman detail produk.
- Menyediakan komponen `ModalKeranjang.jsx` (drawer slide/modal) yang memungkinkan pengunjung menambah/mengurangi jumlah item, menghapus item, dan melihat total harga belanja secara akurat.
- Menyediakan tombol "Pesan Semua via WhatsApp" di keranjang yang menyusun rekap seluruh daftar belanjaan dan total tagihan ke nomor WhatsApp di `lib/toko.js`.
- Menambahkan tombol ikon keranjang dengan indikator jumlah item di `Header.jsx`.

**Perbaikan:**
Memastikan subtotal dan total harga belanja dihitung otomatis dengan harga diskon jika produk sedang promo.

## US-22 Halaman Tentang dan kontak toko
**[Prompt:Sebagai pengunjung, saya ingin tahu siapa pemilik toko dan cara menghubunginya, supaya saya percaya pada toko ini.
Bernilai 5 poin.
Kriteria selesai:
- Ada halaman (misalnya `/tentang`) berisi profil toko, alamat, jam buka, dan kontak. (3 poin)
- Halaman tertaut dari navigasi atau footer. (2 poin)]**

**Hasil:**
- Membuat halaman baru `app/tentang/page.jsx` yang memuat profil usaha, tagline, alamat toko, jam operasional, serta tombol langsung untuk chat via WhatsApp resmi toko.
- Data toko terintegrasi langsung dari `lib/toko.js`.
- Menautkan halaman `/tentang` pada komponen `Footer.jsx` agar dapat diakses dari seluruh halaman katalog.

**Perbaikan:**
Menyediakan tombol "Kembali ke Katalog" di bagian atas halaman `/tentang` untuk memudahkan alur navigasi pengunjung kembali berbelanja.

## US-23 Bagikan atau salin link produk
**[Prompt:Sebagai pengunjung, saya ingin membagikan produk ke teman, supaya mereka bisa melihatnya.
Bernilai 5 poin.
Kriteria selesai:
- Halaman detail punya tombol bagikan atau salin link (Web Share API atau clipboard). (3 poin)
- Ada umpan balik setelah ditekan, misalnya "Link tersalin". (2 poin)]**

**Hasil:**
- Membuat komponen client `TombolBagikanProduk.jsx` yang memanfaatkan `navigator.share` (Web Share API) untuk perangkat mobile/browser yang mendukung.
- Menyediakan fallback penyalinan otomatis ke clipboard (`navigator.clipboard.writeText`) untuk browser desktop.
- Menampilkan umpan balik visual animasi ("✓ Link tersalin!" / "✓ Berhasil dibagikan") setelah tombol ditekan.
- Memasang tombol bagikan di halaman detail produk `app/produk/[id]/page.jsx`.

**Perbaikan:**
Menangani kasus `AbortError` dengan tenang saat pengguna menutup dialog share bawaan browser tanpa menyalin.
