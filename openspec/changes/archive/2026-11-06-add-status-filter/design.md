# Design

## Context

Saat ini `src/pages/TodoListPage.jsx` memiliki satu combobox (`<select>`) untuk menyaring `todos` berdasarkan `selectedPriority` (`all`, `low`, `medium`, `high`, `critical`). Lihat `proposal.md` bagian *Why* untuk motivasi penambahan filter status penyelesaian.

## Goals / Non-Goals

**Goals:**
- Menambahkan combobox (`<select>`) Filter Status (`Semua Status`, `Belum Selesai`, `Selesai`) berdampingan secara responsif (2 kolom pada layar `sm:grid-cols-2`) dengan combobox Filter Priority di Halaman List (`/`).
- Menyaring `todos` berdasarkan kombinasi (`AND`) antara `selectedStatus` dan `selectedPriority` sebelum dipotong oleh pagination 5 item per halaman.
- Mereset `currentPage` ke `1` setiap kali pengguna mengubah Filter Status atau Filter Priority.

**Non-Goals:**
- Mengubah struktur penyimpanan `localStorage` atau halaman lain (`/add`, `/todo/:id`).

## Decisions

1. **Representasi Opsi Filter Status (`STATUS_FILTER_OPTIONS`)**
   - **Keputusan**: Mendefinisikan opsi combobox status di `src/pages/TodoListPage.jsx`:
     - `{ value: 'all', label: 'Semua Status' }`
     - `{ value: 'incomplete', label: 'Belum Selesai' }`
     - `{ value: 'completed', label: 'Selesai' }`
   - **Alasan**: Nilai string eksplisit mudah dibaca, konsisten dengan pola `PRIORITY_OPTIONS`, dan langsung memetakan ke boolean `todo.completed`.
   - **Alternatif yang dipertimbangkan**: Menggunakan tab tombol — tidak dipilih karena pengguna memilih Opsi 2 (dua combobox `<select>` berdampingan).

2. **Tata Letak Dua Combobox Berdampingan**
   - **Keputusan**: Menempatkan kedua combobox (Filter Status dan Filter Priority) dalam container `grid grid-cols-1 gap-3 sm:grid-cols-2` dengan label di atas masing-masing `<select>`.
   - **Alasan**: Menjaga keseimbangan visual dan keterbacaan label pada layar mobile maupun desktop.

3. **Kombinasi Penyaringan & Reset Halaman**
   - **Keputusan**:
     - `matchesStatus`: bernilai `true` jika `selectedStatus === 'all'`, `!todo.completed` jika `'incomplete'`, dan `Boolean(todo.completed)` jika `'completed'`.
     - `matchesPriority`: bernilai `true` jika `selectedPriority === 'all'`, atau `normalizePriority(todo.priority) === selectedPriority`.
     - `filteredTodos = todos.filter((todo) => matchesStatus && matchesPriority)`.
     - Handler perubahan status (`handleStatusFilterChange`) memanggil `setSelectedStatus(value)` dan `setCurrentPage(1)`.
   - **Alasan**: Menjamin hasil filter dan halaman pagination selalu konsisten.

## Risks / Trade-offs

- **[Risk] Pesan *empty state* kurang spesifik ketika kedua filter aktif** → **Mitigation**: Menyusun pesan *empty state* dinamis yang menyebutkan filter status dan/atau prioritas yang sedang dipilih serta menyarankan mengatur ulang filter ke "Semua Status" / "Semua Priority".
