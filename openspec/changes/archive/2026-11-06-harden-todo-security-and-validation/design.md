# Design

## Context

Saat ini pengelolaan state dan penyimpanan lokal berada di [`src/context/TodoContext.jsx`](file:///Users/syafrisurya/project/belajar/belajar-open-spec/src/context/TodoContext.jsx), sementara input pengguna ditangani di [`src/pages/AddTodoPage.jsx`](file:///Users/syafrisurya/project/belajar/belajar-open-spec/src/pages/AddTodoPage.jsx) dan [`src/pages/TodoDetailPage.jsx`](file:///Users/syafrisurya/project/belajar/belajar-open-spec/src/pages/TodoDetailPage.jsx). Latar belakang masalah dan motivasi perubahan dijelaskan pada `proposal.md`.

## Goals / Non-Goals

**Goals:**
- Menerapkan validasi batas panjang karakter secara konsisten di lapisan UI dan lapisan state (`TodoContext`).
- Memastikan seluruh atribut pilihan (`priority`, `category`, `assignee`) divalidasi dengan mekanisme *whitelist* ketat.
- Melindungi aplikasi dari *crash* akibat manipulasi skema JSON di `localStorage` (*Client-Side Storage Tampering*).
- Menambahkan lapisan *Content Security Policy (CSP)* pada [`index.html`](file:///Users/syafrisurya/project/belajar/belajar-open-spec/index.html) yang tetap kompatibel dengan Vite dan Tailwind CSS.

**Non-Goals:**
- Tidak menambahkan autentikasi pengguna atau enkripsi data `localStorage` (karena aplikasi berjalan murni di sisi klien tanpa server backend).
- Tidak menambahkan *library* validasi eksternal (seperti Zod atau Yup) agar ukuran *bundle* tetap ringan dan bebas *dependency* baru.

## Decisions

### 1. Validasi Input Berlapis (UI + State Context) dengan Konstanta Terpusat
- **Keputusan:** Mendefinisikan konstanta batas karakter terpusat di [`src/context/TodoContext.jsx`](file:///Users/syafrisurya/project/belajar/belajar-open-spec/src/context/TodoContext.jsx):
  - `MAX_TITLE_LENGTH = 120`
  - `MAX_LOCATION_LENGTH = 100`
  - `MAX_DESCRIPTION_LENGTH = 1000`
  Di lapisan UI ([`AddTodoPage.jsx`](file:///Users/syafrisurya/project/belajar/belajar-open-spec/src/pages/AddTodoPage.jsx) dan [`TodoDetailPage.jsx`](file:///Users/syafrisurya/project/belajar/belajar-open-spec/src/pages/TodoDetailPage.jsx)), elemen `<input>` dan `<textarea>` menggunakan atribut `maxLength` sesuai konstanta tersebut ditambah validasi saat *submit* yang menolak input apabila melebihi batas. Di lapisan state (`TodoContext.jsx`), fungsi `normalizeTitle`, `normalizeLocation`, dan `normalizeDescription` juga memotong (`.slice(0, MAX_...)`) string sebagai pengaman terakhir jika data masuk dari `localStorage`.
- **Alternatif yang Dipertimbangkan:** Hanya memasang atribut `maxLength` di HTML tanpa validasi JS/Context. Ditolak karena atribut HTML mudah di-*bypass* melalui *Inspect Element* atau injeksi langsung ke `localStorage`.

### 2. Validasi Whitelist pada `normalizeAssignee` dan `normalizeCategory`
- **Keputusan:** Mengubah `normalizeAssignee(value)` agar mengecek `ASSIGNEE_OPTIONS.includes(trimmed)` dan `normalizeCategory(value)` agar mengecek `CATEGORY_OPTIONS.includes(trimmed)`. Jika nilai tidak termasuk dalam daftar opsi resmi, fungsi mengembalikan string kosong `""`.
- **Rasional:** Menyamakan standar keamanan dengan `normalizePriority` sehingga tidak ada nilai liar yang bisa masuk ke filter atau tampilan badge.

### 3. Rekonstruksi Eksplisit Skema Objek `localStorage` (Tanpa Raw Spread `...item`)
- **Keputusan:** Pada `loadTodosFromStorage()` di [`src/context/TodoContext.jsx`](file:///Users/syafrisurya/project/belajar/belajar-open-spec/src/context/TodoContext.jsx), setiap item hasil `JSON.parse` akan divalidasi dan dikonstruksi ulang secara eksplisit hanya dengan properti resmi:
  - `id`: `item.id.trim()` (wajib non-kosong setelah di-trim)
  - `title`: `normalizeTitle(item.title)` (wajib non-kosong setelah di-trim)
  - `description`: `normalizeDescription(item.description)` (memastikan bertipe string, di-trim, dan maks 1000 karakter)
  - `priority`: `normalizePriority(item.priority)`
  - `category`: `normalizeCategory(item.category)`
  - `location`: `normalizeLocation(item.location)`
  - `assignee`: `normalizeAssignee(item.assignee)`
  - `completed`: `Boolean(item.completed)`
  - `createdAt`: `normalizeCreatedAt(item.createdAt)` (mengecek apakah `new Date(value)` menghasilkan tanggal valid; jika tidak valid atau bukan string, fallback ke `new Date().toISOString()`)
  Selain itu, fungsi `formatFullDate(isoString)` di [`TodoDetailPage.jsx`](file:///Users/syafrisurya/project/belajar/belajar-open-spec/src/pages/TodoDetailPage.jsx) akan mengembalikan `""` pada blok `catch` atau saat input bukan string/tanggal valid, bukan mengembalikan `isoString` mentah.
- **Rasional:** Menghilangkan `...item` mencegah injeksi properti asing (*mass assignment / prototype pollution*) dan mencegah error `Objects are not valid as a React child` ketika nilai `description` atau `createdAt` di `localStorage` rusak/dimodifikasi menjadi objek.

### 4. Kebijakan Content Security Policy (CSP) di `index.html`
- **Keputusan:** Menambahkan `<meta http-equiv="Content-Security-Policy" content="default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; connect-src 'self' ws: wss:; object-src 'none'; base-uri 'self'; form-action 'self';" />` pada `<head>` di [`index.html`](file:///Users/syafrisurya/project/belajar/belajar-open-spec/index.html).
- **Rasional:** Membatasi eksekusi script hanya dari `'self'` dan memblokir `<object>`/`<embed>`, sambil tetap mengizinkan `'unsafe-inline'` pada `style-src` dan `ws:/wss:` pada `connect-src` agar *Hot Module Replacement (HMR)* Vite dan *style injection* saat pengembangan tidak terblokir.

## Risks / Trade-offs

- **[Risk] Item todo lama di `localStorage` yang memiliki teks sangat panjang (>120 karakter untuk judul atau >1000 karakter untuk deskripsi) akan terpotong otomatis saat dimuat** → **Mitigation:** Batas 120 karakter untuk judul, 100 karakter untuk lokasi, dan 1000 karakter untuk deskripsi sudah sangat longgar untuk penggunaan wajar aplikasi daftar tugas.
- **[Risk] CSP terlalu ketat dapat menghambat koneksi WebSocket Vite saat mode dev** → **Mitigation:** Menyertakan `connect-src 'self' ws: wss:` dan `style-src 'self' 'unsafe-inline'` agar mode pengembangan Vite dan produksi sama-sama berjalan lancar.
