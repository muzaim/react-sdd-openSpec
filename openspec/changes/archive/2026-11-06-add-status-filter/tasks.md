# Tasks

## 1. Implementasi Filter Status & Integrasi dengan Filter Priority + Pagination

- [x] 1.1 Tambahkan konstanta `STATUS_FILTER_OPTIONS` (`Semua Status`, `Belum Selesai`, `Selesai`), state `selectedStatus` (default `'all'`), logika penyaringan gabungan (`matchesStatus && matchesPriority`) pada `filteredTodos`, serta reset `currentPage` ke `1` pada `handleStatusFilterChange` di `src/pages/TodoListPage.jsx`, lalu verifikasi logika filter dan reset halaman.
- [x] 1.2 Tambahkan elemen combobox (`<select>`) Filter Status berdampingan dengan Filter Priority serta sesuaikan pesan *empty state* ketika hasil filter gabungan kosong di `src/pages/TodoListPage.jsx`, lalu verifikasi tampilan dan pastikan `npm run build` berjalan sukses tanpa error.
