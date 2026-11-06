# Proposal

## Why

Seiring bertambahnya jumlah tugas (todo) di Halaman List (`/`), menampilkan seluruh item sekaligus dalam satu daftar panjang membuat halaman menjadi kurang ringkas dan lebih sulit dipindai. Menambahkan fitur pagination dengan batas default 5 data per halaman menjaga tampilan tetap minimalis, rapi, dan mudah dinavigasi.

## What Changes

- Membatasi jumlah item todo yang ditampilkan di Halaman List (`/`) menjadi maksimal **5 item per halaman** secara default.
- Menambahkan komponen navigasi pagination berformat **`Prev` - Angka Halaman (`1`, `2`, `3`, ...) - `Next`** di bagian bawah daftar tugas.
- Tetap menampilkan komponen pagination selama terdapat minimal 1 item todo pada daftar hasil filter (termasuk saat jumlah data masih 1–5 item, di mana tombol `Prev` dan `Next` berstatus *disabled* dan halaman `1` aktif).
- Mengintegrasikan pagination dengan combobox filter Priority sehingga perubahan filter otomatis mengembalikan halaman aktif ke halaman `1`.

## Capabilities

### New Capabilities
<!-- Tidak ada kapabilitas baru -->

### Modified Capabilities
- `todo-management`: Memperbarui perilaku Halaman List (`/`) untuk membatasi tampilan daftar menjadi 5 item per halaman serta menambahkan navigasi pagination `Prev - Angka - Next` yang terintegrasi dengan filter prioritas dan tetap tampil selama ada data.

## Impact

- **`src/pages/TodoListPage.jsx`**: Menambahkan state `currentPage`, konstanta `ITEMS_PER_PAGE = 5`, pemotongan data `filteredTodos` per halaman, reset halaman saat filter berubah atau item berkurang, serta UI kontrol pagination `Prev - Angka - Next`.
- Tidak ada perubahan skema data di `localStorage` dan tidak ada penambahan dependensi eksternal.
