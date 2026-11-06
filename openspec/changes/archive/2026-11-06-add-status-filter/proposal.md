# Proposal

## Why

Saat ini Halaman List (`/`) hanya menyediakan filter berdasarkan tingkat prioritas (`Priority`), sehingga pengguna belum dapat menyaring daftar tugas berdasarkan status penyelesaiannya (`Belum Selesai` atau `Selesai`). Menambahkan filter status penyelesaian memudahkan pengguna fokus pada tugas yang masih aktif maupun meninjau tugas yang sudah tuntas.

## What Changes

- Menambahkan combobox (`<select>`) **Filter Status** di Halaman List (`/`) berdampingan dengan combobox **Filter Priority**, dengan opsi:
  - `Semua Status` (`all` — default)
  - `Belum Selesai` (`incomplete`)
  - `Selesai` (`completed`)
- Memperbarui logika penyaringan daftar todo (`filteredTodos`) agar mengombinasikan filter Status (`all` / `incomplete` / `completed`) dan filter Priority (`all` / `low` / `medium` / `high` / `critical`) secara bersamaan (`AND`).
- Mengatur ulang halaman pagination (`currentPage`) kembali ke halaman `1` setiap kali pengguna mengubah combobox Filter Status maupun Filter Priority.
- Memperbarui pesan *empty state* ketika kombinasi filter tidak menghasilkan item todo yang cocok.

## Capabilities

### New Capabilities
<!-- Tidak ada kapabilitas baru -->

### Modified Capabilities
- `todo-management`: Memperbarui perilaku penyaringan di Halaman List (`/`) dan reset halaman pagination agar mendukung filter berdasarkan status penyelesaian (`Semua Status`, `Belum Selesai`, `Selesai`) berdampingan dengan filter prioritas.

## Impact

- **`src/pages/TodoListPage.jsx`**: Menambahkan state `selectedStatus` (default `'all'`), elemen `<select>` combobox untuk Filter Status berdampingan dengan Filter Priority, logika filter gabungan pada `filteredTodos`, reset `currentPage` ke `1`, serta penyesuaian pesan *empty state*.
- Tidak ada perubahan skema data di `localStorage` dan tidak ada penambahan dependensi baru.
