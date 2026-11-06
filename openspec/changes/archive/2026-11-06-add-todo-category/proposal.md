# Proposal

## Why

Saat ini setiap item todo belum memiliki pengelompokan kategori topik (seperti Pekerjaan, Pribadi, Belajar, Belanja, atau Kesehatan), sehingga pengguna belum dapat mengelompokkan dan memfilter tugas berdasarkan jenis aktivitasnya. Menambahkan atribut kategori beserta combobox pemilihan dan filter kategori di Halaman List membantu pengguna mengorganisasi tugas secara lebih terstruktur.

## What Changes

- Menambahkan atribut `category` (bertipe string, default `""` untuk belum dipilih dan fallback `""` pada data lama) ke setiap item todo di `localStorage`.
- Menyediakan konstanta `CATEGORY_OPTIONS` berisi 5 pilihan kategori berbahasa Indonesia: `Pekerjaan`, `Pribadi`, `Belajar`, `Belanja`, dan `Kesehatan`.
- Menambahkan combobox (`<select>`) **Kategori** dengan opsi awal `-- Pilih --` (`""`) diikuti 5 pilihan kategori pada formulir Halaman Tambah (`/add`) dan Mode Edit Halaman Detail (`/todo/:id`).
- Menampilkan nama kategori dilengkapi icon tag SVG pada kartu item di Halaman List (`/`) dan Mode Lihat di Halaman Detail (`/todo/:id`) apabila kategori dipilih.
- Menambahkan combobox (`<select>`) **Filter berdasarkan Kategori** (`Semua Kategori` + 5 pilihan kategori) di Halaman List (`/`) berdampingan dengan Filter Status dan Filter Priority, yang menyaring daftar secara kombinasi (`AND`) dan otomatis mereset halaman pagination ke `1` saat diubah.

## Capabilities

### New Capabilities
<!-- Tidak ada kapabilitas baru -->

### Modified Capabilities
- `todo-management`: Memperbarui persistensi data, formulir Tambah, tampilan/edit Detail, penyaringan daftar di Halaman List, dan reset pagination untuk mendukung atribut `category` (5 pilihan kategori dengan default `-- Pilih --` / `""`) beserta combobox filter kategori.

## Impact

- **`src/context/TodoContext.jsx`**: Menambahkan `CATEGORY_OPTIONS`, `normalizeCategory`, serta penyimpanan dan pembaruan atribut `category` di `localStorage`.
- **`src/pages/AddTodoPage.jsx`**: Menambahkan state `category` (default `""`) dan combobox (`<select>`) Kategori dengan opsi awal `-- Pilih --`.
- **`src/pages/TodoDetailPage.jsx`**: Menampilkan kategori dengan icon tag SVG pada Mode Lihat serta menambahkan combobox (`<select>`) Kategori pada Mode Edit.
- **`src/pages/TodoListPage.jsx`**: Menampilkan kategori dengan icon tag SVG pada kartu todo, menambahkan combobox Filter Kategori (`Semua Kategori` + 5 kategori), menggabungkan logika filter (`Status AND Priority AND Category`), dan mereset `currentPage` ke `1` saat filter kategori berubah.
