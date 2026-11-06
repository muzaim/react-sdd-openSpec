# Tasks

## 1. Implementasi State & Logika Pagination di Halaman List

- [x] 1.1 Tambahkan konstanta `ITEMS_PER_PAGE = 5`, state `currentPage`, perhitungan `totalPages` dan `safeCurrentPage`, pemotongan `paginatedTodos` dari `filteredTodos`, serta reset `currentPage` ke `1` saat combobox filter Priority berubah di `src/pages/TodoListPage.jsx`, lalu verifikasi daftar me-render maksimal 5 item per halaman.
- [x] 1.2 Tambahkan komponen UI navigasi pagination berformat `Prev - Angka Halaman - Next` di bawah daftar tugas pada `src/pages/TodoListPage.jsx` yang tetap tampil selama `filteredTodos.length > 0` (dengan tombol `Prev`/`Next` *disabled* pada batas halaman pertama/terakhir dan highlight halaman aktif), lalu verifikasi tampilan pagination serta `npm run build` berjalan sukses tanpa error.
