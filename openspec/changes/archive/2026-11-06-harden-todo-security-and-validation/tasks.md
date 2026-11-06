# Tasks

## 1. Hardening State & Sanitasi `localStorage` (`TodoContext`)

- [x] 1.1 Tambahkan konstanta `MAX_TITLE_LENGTH` (120), `MAX_LOCATION_LENGTH` (100), dan `MAX_DESCRIPTION_LENGTH` (1000) serta fungsi normalisasi `normalizeTitle`, `normalizeDescription`, dan `normalizeCreatedAt` di `src/context/TodoContext.jsx`, lalu verifikasi tidak ada error kompilasi dengan `npm run build`
- [x] 1.2 Perbarui `normalizeAssignee` dan `normalizeCategory` di `src/context/TodoContext.jsx` agar memvalidasi nilai terhadap `ASSIGNEE_OPTIONS` dan `CATEGORY_OPTIONS` (whitelist), lalu verifikasi nilai di luar opsi resmi dikembalikan menjadi `""`
- [x] 1.3 Perbarui `loadTodosFromStorage`, `addTodo`, dan `updateTodo` di `src/context/TodoContext.jsx` agar merekonstruksi objek todo secara eksplisit tanpa `...item` mentah dan menerapkan seluruh fungsi normalisasi, lalu verifikasi aplikasi tetap berjalan tanpa crash saat `localStorage` berisi properti asing atau tipe `description`/`createdAt` non-string

## 2. Validasi Batas Panjang Input & Keamanan Render di UI

- [x] 2.1 Tambahkan atribut `maxLength` dan validasi panjang karakter untuk judul (maks 120), lokasi (maks 100), dan deskripsi (maks 1000) pada `src/pages/AddTodoPage.jsx`, lalu verifikasi formulir menampilkan pesan validasi dan menolak penyimpanan jika batas dilampaui
- [x] 2.2 Tambahkan atribut `maxLength`, validasi panjang karakter saat mengedit, serta pengamanan fallback string kosong pada `formatFullDate` di `src/pages/TodoDetailPage.jsx`, lalu verifikasi form edit dan tampilan tanggal di Halaman Detail berjalan aman tanpa error

## 3. Proteksi Content Security Policy (CSP) & Verifikasi Akhir

- [x] 3.1 Tambahkan meta tag `Content-Security-Policy` pada `<head>` di `index.html`, lalu verifikasi `npm run build` berhasil dan aplikasi berjalan tanpa pelanggaran CSP di browser
