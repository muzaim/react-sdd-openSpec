# Spec Delta

## MODIFIED Requirements

### Requirement: Persistensi data todo di penyimpanan lokal
Sistem SHALL menyimpan dan memuat seluruh daftar todo beserta tingkat prioritas (`low`, `medium`, `high`, `critical`), kategori (`category` tervalidasi whitelist), lokasi (`location` bertipe string maks 100 karakter), dan penanggung jawab (`assignee` tervalidasi whitelist) dari `localStorage` dengan sanitasi skema penuh sehingga data tetap tersimpan dan aplikasi tidak crash meskipun data lokal dimanipulasi.

#### Scenario: Memuat daftar todo saat aplikasi dibuka
- **WHEN** pengguna membuka aplikasi dan sudah terdapat data todo tersimpan di `localStorage`
- **THEN** sistem menampilkan seluruh item todo yang tersimpan sesuai urutan waktu pembuatannya

#### Scenario: Menangani penyimpanan lokal yang masih kosong
- **WHEN** pengguna membuka aplikasi untuk pertama kali dan belum ada data di `localStorage`
- **THEN** sistem menginisialisasi daftar todo kosong dan menampilkan tampilan *empty state*

#### Scenario: Menangani item todo lama tanpa atribut prioritas, lokasi, atau penanggung jawab
- **WHEN** sistem memuat item todo dari `localStorage` yang belum memiliki atribut `priority`, `category`, `location`, atau `assignee`
- **THEN** sistem menetapkan nilai fallback `priority` menjadi `"medium"`, `category` menjadi `""`, `location` menjadi `""`, dan membiarkan `assignee` bernilai `""` (kosong) untuk item tersebut

#### Scenario: Menangani manipulasi nilai kategori atau penanggung jawab di luar whitelist pada localStorage
- **WHEN** sistem memuat item todo dari `localStorage` yang memiliki nilai `category` di luar 5 opsi kategori resmi atau `assignee` di luar 5 nama penanggung jawab resmi
- **THEN** sistem menormalisasi nilai `category` dan/atau `assignee` yang tidak valid tersebut menjadi `""` (kosong)

#### Scenario: Menangani manipulasi tipe data dan properti liar pada localStorage
- **WHEN** sistem memuat item todo dari `localStorage` dengan `description` atau `createdAt` bertipe non-string (seperti objek/angka), teks yang melebihi batas karakter maksimal, atau properti asing di luar skema todo
- **THEN** sistem membuang properti asing, menormalisasi `description` menjadi string aman (maks 1000 karakter), memotong `title` (maks 120 karakter) dan `location` (maks 100 karakter), serta menormalisasi `createdAt` dan `completed` tanpa menyebabkan aplikasi crash

### Requirement: Menambahkan todo baru di Halaman Tambah
Sistem SHALL menyediakan formulir pada rute `/add` untuk membuat item todo baru dengan judul wajib (maks 120 karakter), pilihan tingkat prioritas (`low`, `medium`, `high`, `critical` dengan nilai awal `medium`), combobox kategori (`-- Pilih --` beserta 5 pilihan kategori), combobox penanggung jawab (`-- Pilih --` beserta 5 nama Indonesia), input lokasi opsional (maks 100 karakter), dan deskripsi opsional (maks 1000 karakter).

#### Scenario: Berhasil menyimpan todo baru beserta prioritas, lokasi, dan penanggung jawab
- **WHEN** pengguna mengisi judul, memilih tingkat prioritas, serta memilih kategori, penanggung jawab, lokasi, dan deskripsi (opsional) sesuai batas panjang karakter lalu mengirimkan formulir di Halaman Tambah
- **THEN** sistem membuat item todo baru dengan `id` unik, `priority` terpilih, `category` terpilih (atau `""` jika tidak dipilih), `assignee` terpilih (atau `""` jika tidak dipilih), `location` berupa string, `completed: false`, dan `createdAt` saat ini, menyimpannya ke `localStorage`, serta mengarahkan pengguna kembali ke Halaman List (`/`)

#### Scenario: Mencegah penyimpanan todo dengan judul kosong
- **WHEN** pengguna mencoba menyimpan todo di Halaman Tambah dengan judul kosong atau hanya berisi spasi
- **THEN** sistem menolak penyimpanan dan menampilkan umpan balik validasi pada input judul

#### Scenario: Mencegah penyimpanan todo yang melebihi batas panjang karakter di Halaman Tambah
- **WHEN** pengguna mengisi input pada Halaman Tambah dengan judul lebih dari 120 karakter, lokasi lebih dari 100 karakter, atau deskripsi lebih dari 1000 karakter
- **THEN** sistem membatasi panjang input melalui atribut `maxLength` dan menolak penyimpanan jika batas panjang karakter dilampaui dengan menampilkan pesan validasi

### Requirement: Melihat dan memperbarui todo di Halaman Detail
Sistem SHALL menampilkan detail lengkap sebuah todo pada rute `/todo/:id` (judul, kategori, penanggung jawab, lokasi beserta icon maps, deskripsi, tingkat prioritas, status selesai, dan waktu pembuatan yang terformat aman) serta mengizinkan pengguna mengedit seluruh informasi tersebut sesuai batas panjang karakter dan whitelist opsi.

#### Scenario: Menampilkan informasi lengkap todo beserta prioritas, lokasi, dan penanggung jawab
- **WHEN** pengguna membuka `/todo/:id` dengan `id` yang valid
- **THEN** sistem menampilkan judul, kategori (jika ada), nama penanggung jawab (jika ada), informasi lokasi dengan icon maps, deskripsi lengkap, badge tingkat prioritas, status selesai, dan tanggal pembuatan todo tersebut

#### Scenario: Mengedit judul, penanggung jawab, lokasi, deskripsi, prioritas, dan status di Halaman Detail
- **WHEN** pengguna mengubah judul (maks 120 karakter), kategori melalui combobox, penanggung jawab melalui combobox, lokasi (maks 100 karakter), deskripsi (maks 1000 karakter), tingkat prioritas, atau status selesai pada Halaman Detail lalu menyimpan perubahan
- **THEN** sistem memperbarui data item tersebut di `localStorage` dan menampilkan data terbaru

#### Scenario: Mencegah penyimpanan edit todo yang tidak valid atau melebihi batas karakter di Halaman Detail
- **WHEN** pengguna mengosongkan judul atau memasukkan judul lebih dari 120 karakter, lokasi lebih dari 100 karakter, atau deskripsi lebih dari 1000 karakter saat mengedit di Halaman Detail
- **THEN** sistem menolak penyimpanan perubahan dan menampilkan pesan umpan balik validasi

#### Scenario: Menangani ID todo yang tidak ditemukan
- **WHEN** pengguna mengakses `/todo/:id` dengan `id` yang tidak ada di `localStorage`
- **THEN** sistem menampilkan pesan bahwa todo tidak ditemukan beserta tautan untuk kembali ke Halaman List (`/`)

## ADDED Requirements

### Requirement: Proteksi Content Security Policy pada dokumen aplikasi
Sistem SHALL menerapkan kebijakan Content Security Policy (CSP) pada dokumen HTML utama yang membatasi sumber eksekusi skrip hanya dari origin aplikasi sendiri (`'self'`) dan melarang pemuatan objek berbahaya (`object-src 'none'`).

#### Scenario: Memuat halaman aplikasi dengan proteksi CSP aktif
- **WHEN** browser memuat halaman aplikasi
- **THEN** dokumen HTML menyertakan deklarasi `Content-Security-Policy` yang mengizinkan skrip dari `'self'` dan memblokir objek eksternal (`object-src 'none'`)
