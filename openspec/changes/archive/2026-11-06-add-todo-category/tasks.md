# Tasks

## 1. Persistensi Data & Konfigurasi Kategori (`TodoContext`)

- [x] 1.1 Tambahkan `CATEGORY_OPTIONS` (`Pekerjaan`, `Pribadi`, `Belajar`, `Belanja`, `Kesehatan`), fungsi `normalizeCategory`, serta dukungan penyimpanan dan pembaruan field `category` (default `""` untuk belum dipilih dan fallback `""` untuk data lama di `localStorage`) di `src/context/TodoContext.jsx`, lalu verifikasi data kategori tersimpan dengan benar.

## 2. Implementasi UI Kategori di Halaman Tambah, Detail, & List

- [x] 2.1 Perbarui Halaman Tambah (`src/pages/AddTodoPage.jsx`) dan Halaman Detail (`src/pages/TodoDetailPage.jsx`) untuk menambahkan combobox (`<select>`) Kategori dengan opsi awal `-- Pilih --` (`""`) diikuti 5 pilihan `CATEGORY_OPTIONS`, serta menampilkan kategori beserta icon tag SVG di Mode Lihat Halaman Detail.
- [x] 2.2 Perbarui Halaman List (`src/pages/TodoListPage.jsx`) untuk menampilkan kategori beserta icon tag SVG pada kartu item todo, menambahkan combobox Filter Kategori (`Semua Kategori` + 5 pilihan kategori) berdampingan dengan Filter Status dan Filter Priority (`sm:grid-cols-3`), serta mengintegrasikan `matchesCategory` dan reset halaman ke `1`, lalu verifikasi `npm run build` berjalan sukses tanpa error.
