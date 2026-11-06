# Design

## Context

Saat ini `src/pages/TodoListPage.jsx` menyaring `todos` berdasarkan `selectedPriority` menjadi `filteredTodos` dan langsung me-render seluruh elemen `filteredTodos` ke dalam `<ul role="list">`. Lihat `proposal.md` bagian *Why* untuk latar belakang kebutuhan pagination.

## Goals / Non-Goals

**Goals:**
- Membatasi render daftar tugas di Halaman List (`/`) menjadi maksimal 5 item per halaman (`ITEMS_PER_PAGE = 5`).
- Menyediakan navigasi pagination dengan tata letak `Prev - Angka Halaman - Next` yang konsisten dengan estetika minimalis Tailwind CSS (`slate-900` untuk halaman aktif, border lembut untuk halaman lain).
- Memastikan kontrol pagination selalu tampil selama `filteredTodos.length > 0` (termasuk ketika jumlah item 1–5).

**Non-Goals:**
- Mengubah struktur penyimpanan `localStorage` atau menambahkan opsi pengubah ukuran halaman (*page size selector*).
- Menambahkan library pagination pihak ketiga.

## Decisions

1. **Perhitungan Pagination Berbasis `filteredTodos`**
   - **Keputusan**: Menghitung `totalPages = Math.max(1, Math.ceil(filteredTodos.length / ITEMS_PER_PAGE))` dengan `ITEMS_PER_PAGE = 5`, lalu memotong array menggunakan `filteredTodos.slice(startIndex, startIndex + ITEMS_PER_PAGE)`.
   - **Alasan**: Memastikan filter prioritas dan pagination bekerja selaras tanpa state terduplikasi.
   - **Alternatif yang dipertimbangkan**: Menyimpan state terpisah untuk array hasil halaman — ditolak karena derived state dari `filteredTodos` dan `currentPage` lebih sederhana dan bebas bug sinkronisasi.

2. **Penanganan Reset dan Penyesuaian Halaman Aktif (`safeCurrentPage`)**
   - **Keputusan**:
     - Saat pengguna mengubah combobox filter Priority, handler `onChange` langsung memanggil `setCurrentPage(1)`.
     - Menggunakan `const safeCurrentPage = Math.min(currentPage, totalPages)` saat menghitung `startIndex` agar jika item dihapus hingga `totalPages` menyusut, halaman aktif tidak pernah melampaui `totalPages`.
   - **Alasan**: Mencegah tampilan halaman kosong ketika jumlah data berkurang atau filter dipersempit.

3. **Komponen Navigasi `Prev - Angka - Next` Selalu Tampil Saat Ada Data**
   - **Keputusan**: Menampilkan `<nav aria-label="Pagination">` tepat di bawah `<ul role="list">` setiap kali `filteredTodos.length > 0`. Tombol `Prev` dinonaktifkan saat `safeCurrentPage === 1`, tombol `Next` dinonaktifkan saat `safeCurrentPage === totalPages`, dan deretan nomor halaman `1..totalPages` ditampilkan di tengah dengan atribut `aria-current="page"` pada halaman aktif.
   - **Alasan**: Sesuai konfirmasi pengguna agar komponen pagination tetap terlihat meskipun jumlah item masih 5 atau kurang.

## Risks / Trade-offs

- **[Risk] Nomor halaman tidak valid saat filter berubah** → **Mitigation**: Reset `currentPage` ke `1` pada event perubahan filter dan gunakan `Math.min(currentPage, totalPages)` sebagai pengaman.
