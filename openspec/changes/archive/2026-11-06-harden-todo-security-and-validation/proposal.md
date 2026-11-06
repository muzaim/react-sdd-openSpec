# Proposal

## Why

Hasil audit keamanan pada aplikasi menunjukkan adanya beberapa celah ketahanan data dan validasi input: tidak adanya batas panjang karakter input (rawan *Client-Side DoS* / *localStorage exhaustion*), fungsi normalisasi `assignee` dan `category` yang belum menggunakan *whitelist* opsi resmi, pembacaan data dari `localStorage` yang masih menyalin properti mentah (`...item`) tanpa memvalidasi tipe `description`, `completed`, dan `createdAt` (yang dapat menyebabkan React *crash* jika penyimpanan lokal dimanipulasi), serta belum adanya *Content Security Policy (CSP)* dasar dan sinkronisasi spesifikasi `category`. Perubahan ini diperlukan untuk memperketat keamanan dan ketahanan aplikasi sesuai standar *Security by Design*.

## What Changes

- Menambahkan batas panjang karakter maksimal pada input teks todo (`title` maks 120 karakter, `location` maks 100 karakter, dan `description` maks 1000 karakter) baik pada validasi formulir UI (Halaman Tambah dan Halaman Detail) maupun pemotongan/normalisasi di level state (`TodoContext`).
- Memperketat fungsi `normalizeAssignee` dan `normalizeCategory` agar memvalidasi nilai terhadap daftar *whitelist* resmi (`ASSIGNEE_OPTIONS` dan `CATEGORY_OPTIONS`), serta mengembalikan `""` jika nilai di luar daftar tersebut.
- Memperketat sanitasi skema objek saat memuat data dari `localStorage` (`loadTodosFromStorage`) dengan mengonstruksi ulang objek todo secara eksplisit (tanpa *raw object spread* `...item`), menormalisasi `description` (string), `completed` (boolean), dan `createdAt` (string tanggal ISO yang valid), serta mengamankan fungsi `formatFullDate` agar tidak mengembalikan nilai non-string yang dapat menyebabkan React *crash*.
- Menambahkan meta tag `Content-Security-Policy` (CSP) dasar pada `index.html` untuk membatasi sumber eksekusi skrip dan aset hanya dari origin aplikasi (`'self'`).
- Menyelaraskan spesifikasi `todo-management` agar mencakup atribut `category` yang sudah ada di implementasi beserta aturan keamanan dan validasi input.

## Capabilities

### New Capabilities
<!-- Tidak ada kapabilitas baru -->

### Modified Capabilities
- `todo-management`: Memperbarui persyaratan persistensi `localStorage`, penambahan todo, pembaruan todo, dan tampilan daftar/detail untuk menerapkan validasi batas panjang karakter, validasi *whitelist* pada `category` dan `assignee`, sanitasi skema data dari `localStorage` yang tahan manipulasi, serta sinkronisasi fitur kategori.

## Impact

- [`src/context/TodoContext.jsx`](file:///Users/syafrisurya/project/belajar/belajar-open-spec/src/context/TodoContext.jsx): Penambahan konstanta batas panjang karakter (`MAX_TITLE_LENGTH`, `MAX_LOCATION_LENGTH`, `MAX_DESCRIPTION_LENGTH`), perbaikan fungsi normalisasi (`normalizeTitle`, `normalizeDescription`, `normalizeLocation`, `normalizeAssignee`, `normalizeCategory`, `normalizeCreatedAt`), dan rekonstruksi objek aman di `loadTodosFromStorage`.
- [`src/pages/AddTodoPage.jsx`](file:///Users/syafrisurya/project/belajar/belajar-open-spec/src/pages/AddTodoPage.jsx): Penambahan atribut `maxLength` dan validasi panjang karakter pada input judul, lokasi, dan deskripsi.
- [`src/pages/TodoDetailPage.jsx`](file:///Users/syafrisurya/project/belajar/belajar-open-spec/src/pages/TodoDetailPage.jsx): Penambahan atribut `maxLength`, validasi panjang karakter saat edit, dan pengamanan `formatFullDate` terhadap nilai tanggal yang tidak valid.
- [`index.html`](file:///Users/syafrisurya/project/belajar/belajar-open-spec/index.html): Penambahan `<meta http-equiv="Content-Security-Policy" ...>`.
