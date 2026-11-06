# Proposal

## Why

Proyek ini membutuhkan aplikasi Todo List berbasis web yang ringan, cepat, dan mudah digunakan tanpa ketergantungan pada server atau database eksternal. Pengguna memerlukan alur yang rapi dan terfokus dalam tiga halaman terpisah (Daftar Todo, Tambah Todo, dan Detail Todo) dengan antarmuka minimalis dan elegan, tingkat prioritas tugas (`low`, `medium`, `high`, `critical`), informasi lokasi (`location`) beserta ikon maps, penanggung jawab tugas (`assignee`), serta penyimpanan data lokal di browser (`localStorage`).

## What Changes

- Inisialisasi aplikasi frontend menggunakan **React JS** (Vite), **Tailwind CSS**, dan **React Router**.
- Penambahan lapisan persistensi data di sisi klien menggunakan `localStorage` untuk menyimpan daftar todo (`id`, `title`, `description`, `location`, `assignee`, `priority`, `completed`, `createdAt`).
- Pembuatan **Halaman List (`/`)** untuk menampilkan seluruh daftar todo beserta badge prioritas (`Low`, `Medium`, `High`, `Critical`), nama penanggung jawab (jika dipilih), informasi lokasi dengan **icon maps/pin**, filter berbentuk **combobox (`<select>`)** berdasarkan prioritas (`Semua Priority`, `Low`, `Medium`, `High`, `Critical`), *quick toggle* status selesai melalui checkbox, serta navigasi ke halaman Tambah dan Detail.
- Pembuatan **Halaman Tambah (`/add`)** dengan form input judul (wajib), pilihan tingkat prioritas (`low`, `medium`, `high`, `critical` dengan default `medium`), combobox penanggung jawab (`-- Pilih --` dan 5 nama Indonesia), input teks lokasi (opsional), dan deskripsi/catatan (opsional) untuk membuat todo baru.
- Pembuatan **Halaman Detail (`/todo/:id`)** untuk melihat informasi lengkap todo (termasuk badge status, prioritas, penanggung jawab, dan lokasi beserta icon maps), mengubah status selesai, mengedit judul, penanggung jawab, lokasi, deskripsi, dan tingkat prioritas secara langsung, serta menghapus todo.
- Penerapan sistem desain minimalis dan elegan menggunakan Tailwind CSS (tipografi bersih, palet warna netral dengan aksen lembut, badge prioritas yang jelas, icon maps & user SVG, serta *empty state* yang informatif).

## Capabilities

### New Capabilities
- `todo-management`: Pengelolaan siklus hidup item todo beserta tingkat prioritas, lokasi, dan penanggung jawabnya (melihat daftar dengan icon maps & penanggung jawab serta memfilter prioritas melalui combobox di halaman List, menambah todo dengan prioritas, lokasi, dan combobox penanggung jawab di halaman Tambah, melihat/mengedit/menghapus todo di halaman Detail, serta sinkronisasi data ke `localStorage`).

### Modified Capabilities
<!-- Tidak ada kapabilitas yang dimodifikasi karena proyek ini dimulai dari awal (greenfield). -->

## Impact

- **Kode & Struktur Proyek**: Menambahkan scaffolding aplikasi React + Vite (`package.json`, `vite.config.js`, `index.html`, dan direktori `src/`).
- **Dependensi**: Menambahkan `react`, `react-dom`, `react-router-dom`, dan `tailwindcss` beserta plugin pendukungnya.
- **Penyimpanan Data**: Menggunakan `window.localStorage` dengan key `"todos"` pada browser pengguna tanpa API/database eksternal.
