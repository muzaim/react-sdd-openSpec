# Design

## Context

Aplikasi yang dibangun adalah Single Page Application (SPA) berbasis React JS dan Tailwind CSS tanpa backend atau database eksternal (lihat `proposal.md` - Why). Seluruh state persisten disimpan di `window.localStorage` dan diakses dari tiga halaman berbeda: List (`/`), Tambah (`/add`), dan Detail (`/todo/:id`). Setiap tugas memiliki tingkat prioritas (`low`, `medium`, `high`, `critical`) yang ditampilkan sebagai badge dan dapat difilter melalui combobox di Halaman List, serta atribut lokasi (`location`: string) yang ditampilkan bersama icon maps/pin di Halaman List dan Detail.

## Goals / Non-Goals

**Goals:**
- Menyediakan arsitektur frontend yang ringan, modular, dan mudah dipelihara untuk 3 rute halaman.
- Menjaga sinkronisasi state React dengan `localStorage` secara konsisten dan tahan terhadap data korup (`JSON.parse` error handling) maupun data lama yang belum memiliki atribut `priority` atau `location`.
- Menghadirkan antarmuka minimalis dan elegan dengan hierarki tipografi yang jelas, badge prioritas yang mudah dipindai, icon maps pada informasi lokasi, combobox filter yang ringkas, dan responsif di layar mobile maupun desktop.

**Non-Goals:**
- Autentikasi pengguna atau sinkronisasi lintas perangkat (cloud/backend).
- Integrasi SDK peta interaktif berat (seperti Google Maps JS SDK / Mapbox) karena kebutuhan lokasi cukup berupa teks string dengan icon maps.
- State management library eksternal yang berat (seperti Redux).

## Decisions

### 1. Build Tool & Routing: Vite + React Router (`react-router-dom`)
- **Keputusan**: Menggunakan Vite (`@vitejs/plugin-react`) sebagai bundler dan `react-router-dom` untuk navigasi 3 halaman (`/`, `/add`, `/todo/:id`).
- **Alasan**: Vite memiliki waktu inisialisasi dan HMR yang sangat cepat. React Router memungkinkan setiap halaman memiliki URL tersendiri (termasuk parameter `:id` pada halaman Detail) sehingga pengguna dapat menggunakan tombol Back/Forward browser secara alami.

### 2. Manajemen State & Persistensi: Custom Hook / Context di atas `localStorage`
- **Keputusan**: Membuat modul/context terpusat (`TodoContext` atau custom hook `useTodos`) yang membaca data awal dari `localStorage.getItem('todos')` melalui *lazy initializer* `useState` dan menyinkronkan setiap operasi (`addTodo`, `updateTodo`, `toggleTodo`, `deleteTodo`) kembali ke `localStorage`.
- **Skema Data Todo**:
  ```json
  {
    "id": "string (crypto.randomUUID() / timestamp)",
    "title": "string",
    "description": "string",
    "location": "string",
    "priority": "low | medium | high | critical",
    "completed": false,
    "createdAt": "string (ISO-8601)"
  }
  ```
- **Kompatibilitas Data Lama**: Saat memuat dari `localStorage`, jika `priority` tidak termasuk dalam `['low', 'medium', 'high', 'critical']`, sistem menormalisasinya menjadi `'medium'`; jika `location` bukan string, sistem menormalisasinya menjadi `''`.

### 3. Filter Combobox, Informasi Lokasi dengan Icon Maps, & Alur Halaman Detail
- **Keputusan**:
  - **Halaman List (`/`)**: Menampilkan seluruh item todo secara default dengan kontrol **combobox (`<select>`)** untuk memfilter daftar berdasarkan tingkat prioritas (`Semua Priority`, `Low`, `Medium`, `High`, `Critical`). Setiap item todo yang memiliki nilai `location` menampilkan **icon maps/pin SVG** di samping teks lokasinya.
  - **Halaman Detail (`/todo/:id`)**: Menampilkan informasi todo secara bersih (Mode Lihat) lengkap dengan badge status selesai, badge prioritas, serta lokasi (dilengkapi icon maps), disertai aksi cepat untuk toggle status selesai, tombol Edit, dan tombol Hapus. Saat tombol Edit ditekan, tampilan beralih ke Mode Edit pada halaman yang sama (form input judul, pilihan prioritas, input lokasi, textarea deskripsi, dan toggle status).

### 4. Sistem Desain Minimalis & Elegan (Tailwind CSS)
- **Keputusan**:
  - **Layout**: Container terpusat (`max-w-xl mx-auto px-4 py-10`) agar fokus baca optimal di desktop maupun mobile.
  - **Palet Warna & Badge Priority**:
    - `low`: `bg-slate-100 text-slate-600 ring-slate-200` (netral lembut)
    - `medium`: `bg-sky-50 text-sky-700 ring-sky-200` (biru tenang)
    - `high`: `bg-amber-50 text-amber-700 ring-amber-200` (oranye hangat)
    - `critical`: `bg-rose-50 text-rose-700 ring-rose-200` (merah tegas)
  - **Icon Maps**: Menggunakan inline SVG *map-pin* minimalis (`w-3.5 h-3.5`) dengan `aria-hidden="true"` berdampingan dengan teks lokasi agar ringan tanpa dependensi paket ikon tambahan.
  - **Permukaan & Elevasi**: Kartu putih (`bg-white`) di atas latar `bg-slate-50` dengan border tipis (`border-slate-200/80`) dan bayangan sangat halus (`shadow-xs`/`shadow-sm`).

## Risks / Trade-offs

- **[Risk] Data `localStorage` rusak atau berasal dari versi sebelum adanya field `priority` dan `location`** → **Mitigation**: Bungkus `JSON.parse` di dalam blok `try/catch` dan berikan nilai default `priority: "medium"` serta `location: ""` untuk item yang belum memiliki field tersebut.
- **[Risk] Kapasitas `localStorage` terbatas (~5MB)** → **Mitigation**: Karena hanya menyimpan teks judul, lokasi, deskripsi, dan string prioritas, batas ini sangat mencukupi untuk ribuan item todo teks.
- **[Risk] Pengguna mengakses `/todo/:id` yang sudah dihapus atau tidak valid** → **Mitigation**: Tampilkan tampilan *Not Found* yang rapi di Halaman Detail beserta tombol kembali ke Halaman List (`/`).
