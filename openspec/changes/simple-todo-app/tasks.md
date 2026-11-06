# Tasks

## 1. Setup Proyek & Konfigurasi Dasar

- [x] 1.1 Inisialisasi proyek React menggunakan Vite beserta dependensi `react-router-dom` dan Tailwind CSS, lalu verifikasi `npm install` dan `npm run build` berjalan sukses tanpa error.
- [x] 1.2 Konfigurasi layout utama minimalis (container terpusat, tipografi bersih, latar netral) dan routing 3 halaman (`/`, `/add`, `/todo/:id`) di `src/App.jsx`, lalu verifikasi ketiga rute dapat diakses tanpa error di console.

## 2. Persistensi Data & State Management (`localStorage`)

- [x] 2.1 Buat modul penyimpanan dan context/hook `TodoContext` (`src/context/TodoContext.jsx`) untuk memuat, menambah, memperbarui, mengubah status selesai, dan menghapus todo di `localStorage` (dengan fallback aman `try/catch` saat parsing JSON), lalu verifikasi operasi CRUD menyimpan dan memuat ulang data dengan benar di `localStorage` key `"todos"`.

## 3. Implementasi Halaman List & Halaman Tambah

- [x] 3.1 Buat Halaman List (`src/pages/TodoListPage.jsx`) dengan header ringkas, tombol navigasi ke `/add`, tab filter (`Semua`, `Belum Selesai`, `Selesai`), *quick toggle* checkbox status selesai, navigasi klik item ke `/todo/:id`, serta tampilan *empty state*, lalu verifikasi filter dan checkbox memperbarui daftar serta `localStorage` secara langsung.
- [x] 3.2 Buat Halaman Tambah (`src/pages/AddTodoPage.jsx`) dengan form input judul (wajib) dan deskripsi (opsional), validasi input judul tidak boleh kosong/spasi saja, serta tombol Batal dan Simpan, lalu verifikasi penyimpanan todo baru mengarahkan kembali ke `/` dan menampilkan item baru di daftar.

## 4. Implementasi Halaman Detail (Lihat, Edit, & Hapus)

- [x] 4.1 Buat Halaman Detail (`src/pages/TodoDetailPage.jsx`) yang menampilkan informasi lengkap todo (judul, deskripsi, badge status selesai, waktu dibuat) dan menangani kondisi ID tidak ditemukan (*not found state*), lalu verifikasi halaman menampilkan detail yang sesuai atau pesan tidak ditemukan untuk ID tidak valid.
- [x] 4.2 Tambahkan fitur Mode Edit (ubah judul, deskripsi, dan status selesai) serta aksi Hapus di Halaman Detail, lalu verifikasi perubahan tersimpan ke `localStorage` dan aksi hapus menghapus item serta mengarahkan pengguna kembali ke `/`.

## 5. Verifikasi Integrasi Akhir

- [x] 5.1 Jalankan pemeriksaan build produksi (`npm run build`) dan uji alur penuh 3 halaman (Tambah -> List & Filter -> Detail & Edit -> Hapus -> Reload halaman) untuk memverifikasi seluruh skenario spesifikasi terpenuhi.

## 6. Penambahan Fitur Priority & Combobox Filter

- [x] 6.1 Perbarui `TodoContext` (`src/context/TodoContext.jsx`) untuk mendukung field `priority` (`low`, `medium`, `high`, `critical`) saat membuat dan memperbarui todo serta menormalisasi data lama di `localStorage` dengan fallback `"medium"`, lalu verifikasi data prioritas tersimpan dengan benar.
- [x] 6.2 Perbarui Halaman Tambah (`src/pages/AddTodoPage.jsx`) dan Halaman Detail (`src/pages/TodoDetailPage.jsx`) untuk menampilkan badge prioritas serta input pemilihan prioritas (`Low`, `Medium`, `High`, `Critical`), lalu verifikasi penambahan dan pengeditan prioritas berhasil.
- [x] 6.3 Perbarui Halaman List (`src/pages/TodoListPage.jsx`) dengan menghapus tab filter status, menampilkan seluruh daftar todo beserta badge prioritas, dan menambahkan combobox (`<select>`) filter berdasarkan prioritas (`Semua Priority`, `Low`, `Medium`, `High`, `Critical`), lalu verifikasi filter combobox dan `npm run build` berjalan sukses tanpa error.

## 7. Penambahan Fitur Lokasi & Icon Maps

- [x] 7.1 Perbarui `TodoContext` (`src/context/TodoContext.jsx`) untuk menyimpan dan memperbarui field `location` (string) dengan fallback `""` pada data lama di `localStorage`, lalu verifikasi data lokasi tersimpan dengan benar.
- [x] 7.2 Perbarui Halaman Tambah (`src/pages/AddTodoPage.jsx`) dan Halaman Detail (`src/pages/TodoDetailPage.jsx`) untuk menambahkan input teks lokasi serta menampilkan lokasi dilengkapi icon maps di Halaman Detail, lalu verifikasi penambahan dan pengeditan lokasi berhasil.
- [x] 7.3 Perbarui Halaman List (`src/pages/TodoListPage.jsx`) untuk menampilkan informasi lokasi beserta icon maps/pin SVG pada setiap kartu item todo, lalu verifikasi tampilan dan `npm run build` berjalan sukses tanpa error.
