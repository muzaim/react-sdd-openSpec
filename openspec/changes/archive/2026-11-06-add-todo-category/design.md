# Design

## Context

Setiap item todo di `src/context/TodoContext.jsx` saat ini menyimpan atribut `id`, `title`, `description`, `location`, `assignee`, `priority`, `completed`, dan `createdAt`. Di `src/pages/TodoListPage.jsx`, daftar tugas difilter menggunakan dua combobox (`Filter Status` dan `Filter Priority`) dengan pagination 5 item per halaman. Lihat `proposal.md` bagian *Why* untuk latar belakang penambahan fitur Kategori.

## Goals / Non-Goals

**Goals:**
- Menambahkan field `category` bertipe string (default `""`) dengan 5 pilihan kategori berbahasa Indonesia (`Pekerjaan`, `Pribadi`, `Belajar`, `Belanja`, `Kesehatan`).
- Menyediakan combobox (`<select>`) Kategori dengan opsi awal `-- Pilih --` (`""`) di Halaman Tambah (`/add`) dan Mode Edit Halaman Detail (`/todo/:id`).
- Menampilkan kategori beserta icon tag SVG pada kartu item di Halaman List (`/`) dan Mode Lihat di Halaman Detail (`/todo/:id`) apabila `category` tidak kosong.
- Menambahkan combobox (`<select>`) Filter Kategori (`Semua Kategori` + 5 pilihan kategori) di Halaman List (`/`) berdampingan dengan Filter Status dan Filter Priority (`sm:grid-cols-3`).

**Non-Goals:**
- Mengizinkan pembuatan kategori kustom di luar 5 opsi yang ditentukan.

## Decisions

1. **Konstanta `CATEGORY_OPTIONS` & `normalizeCategory` di `TodoContext.jsx`**
   - **Keputusan**: Mengekspor `export const CATEGORY_OPTIONS = ['Pekerjaan', 'Pribadi', 'Belajar', 'Belanja', 'Kesehatan']` dan `export function normalizeCategory(value)` yang mengembalikan string hasil `trim()` atau `""` jika bukan string.
   - **Alasan**: Mengikuti pola yang sama persis dengan `ASSIGNEE_OPTIONS` dan `normalizeAssignee`, menjaga kompatibilitas mundur terhadap data lama di `localStorage`.

2. **Combobox Kategori pada Formulir Tambah & Edit**
   - **Keputusan**: Menggunakan elemen `<select>` native dengan `<option value="">-- Pilih --</option>` diikuti pemetaan `CATEGORY_OPTIONS`.
   - **Alasan**: Sesuai konfirmasi pengguna bahwa nilai default adalah `-- Pilih --` (`""`).

3. **Tiga Combobox Filter Berdampingan di Halaman List (`/`)**
   - **Keputusan**: Mengubah grid container filter di `src/pages/TodoListPage.jsx` menjadi `grid grid-cols-1 gap-3 sm:grid-cols-3` yang memuat:
     1. Filter berdasarkan Status (`Semua Status`, `Belum Selesai`, `Selesai`)
     2. Filter berdasarkan Priority (`Semua Priority`, `Low`, `Medium`, `High`, `Critical`)
     3. Filter berdasarkan Kategori (`Semua Kategori` + 5 opsi `CATEGORY_OPTIONS`)
   - **Alasan**: Menjaga konsistensi visual ketiga dropdown dalam satu baris responsif dan mengintegrasikan `matchesCategory` ke dalam `filteredTodos` serta mereset `currentPage` ke `1` pada `handleCategoryFilterChange`.

## Risks / Trade-offs

- **[Risk] Tata letak form di Halaman Tambah/Edit menjadi terlalu panjang** → **Mitigation**: Menempatkan input Kategori dalam layout grid bersama Priority dan Penanggung Jawab sehingga tinggi form tetap ringkas.
