# todo-management Specification

## Purpose
Menyediakan kapabilitas pengelolaan daftar tugas (todo) beserta tingkat prioritas, informasi lokasi, dan penanggung jawabnya melalui tiga halaman utama (List, Tambah, dan Detail) dengan penyimpanan persisten di penyimpanan lokal browser.

## Requirements

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

### Requirement: Menampilkan dan memfilter daftar todo di Halaman List
Sistem SHALL menampilkan daftar todo maksimal 5 item per halaman beserta badge prioritas (`Low`, `Medium`, `High`, `Critical`), kategori, penanggung jawab, dan lokasi dengan icon maps pada rute `/`, menyediakan combobox (`<select>`) filter status, filter prioritas, dan filter kategori (`Semua Kategori` beserta 5 kategori), serta navigasi ke halaman Tambah dan Detail.

#### Scenario: Menampilkan seluruh daftar todo beserta lokasi dan penanggung jawab
- **WHEN** pengguna membuka Halaman List dengan pilihan combobox filter pada "Semua Status", "Semua Priority", dan "Semua Kategori"
- **THEN** sistem menampilkan maksimal 5 item todo pada halaman aktif beserta badge prioritas, menampilkan kategori (jika dipilih), nama penanggung jawab (jika dipilih), dan icon maps di samping teks lokasi untuk setiap item yang memiliki informasi lokasi

#### Scenario: Memfilter daftar berdasarkan status penyelesaian melalui combobox
- **WHEN** pengguna memilih status penyelesaian (`Belum Selesai` atau `Selesai`) pada combobox filter status di Halaman List
- **THEN** sistem hanya menampilkan item todo yang memiliki status penyelesaian (`completed: false` untuk `Belum Selesai`, atau `completed: true` untuk `Selesai`) sesuai dengan pilihan combobox tersebut dengan batas 5 item per halaman

#### Scenario: Memfilter daftar berdasarkan prioritas melalui combobox
- **WHEN** pengguna memilih salah satu tingkat prioritas (`Low`, `Medium`, `High`, atau `Critical`) pada combobox filter di Halaman List
- **THEN** sistem hanya menampilkan item todo yang memiliki nilai `priority` sesuai dengan pilihan combobox tersebut dengan batas 5 item per halaman

#### Scenario: Memfilter daftar berdasarkan kategori melalui combobox
- **WHEN** pengguna memilih salah satu kategori (`Pekerjaan`, `Pribadi`, `Belajar`, `Belanja`, atau `Kesehatan`) pada combobox filter kategori di Halaman List
- **THEN** sistem hanya menampilkan item todo yang memiliki nilai `category` sesuai dengan pilihan combobox tersebut dengan batas 5 item per halaman

#### Scenario: Memfilter daftar berdasarkan kombinasi status dan prioritas
- **WHEN** pengguna memilih kombinasi filter status, filter prioritas, dan/atau filter kategori pada combobox di Halaman List
- **THEN** sistem hanya menampilkan item todo yang memenuhi seluruh kriteria filter yang dipilih dengan batas 5 item per halaman

#### Scenario: Mengubah status selesai secara cepat dari Halaman List
- **WHEN** pengguna menekan checkbox pada salah satu item todo di Halaman List
- **THEN** sistem memperbarui status `completed` item tersebut di `localStorage` tanpa berpindah ke Halaman Detail

#### Scenario: Membuka Halaman Detail dari daftar
- **WHEN** pengguna mengklik judul atau area kartu item todo di Halaman List
- **THEN** sistem mengarahkan pengguna ke Halaman Detail (`/todo/:id`) untuk item tersebut

### Requirement: Menavigasi daftar todo menggunakan pagination
Sistem SHALL menyediakan kontrol pagination berformat `Prev - Angka Halaman - Next` di Halaman List (`/`) dengan batas default 5 item per halaman, yang tetap ditampilkan selama terdapat minimal 1 item todo hasil filter dan otomatis kembali ke halaman 1 ketika filter status, filter prioritas, atau filter kategori berubah.

#### Scenario: Menampilkan pagination saat jumlah data belum lebih dari 5 item
- **WHEN** pengguna membuka Halaman List dan jumlah item todo hasil filter antara 1 hingga 5 item
- **THEN** sistem tetap menampilkan kontrol pagination `Prev - 1 - Next` dengan angka halaman `1` aktif serta tombol `Prev` dan `Next` dalam keadaan nonaktif (*disabled*)

#### Scenario: Berpindah halaman saat jumlah data lebih dari 5 item
- **WHEN** terdapat lebih dari 5 item todo hasil filter dan pengguna menekan tombol angka halaman, `Next`, atau `Prev`
- **THEN** sistem menampilkan 5 item todo yang sesuai dengan halaman aktif, menonaktifkan tombol `Prev` di halaman pertama, serta menonaktifkan tombol `Next` di halaman terakhir

#### Scenario: Mereset halaman ke halaman pertama saat filter prioritas diubah
- **WHEN** pengguna sedang berada di halaman selain halaman 1 lalu mengubah pilihan combobox filter status, filter prioritas, atau filter kategori
- **THEN** sistem mengatur ulang halaman aktif kembali ke halaman `1` untuk daftar hasil filter yang baru

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

### Requirement: Menghapus todo dari Halaman Detail
Sistem SHALL mengizinkan pengguna menghapus item todo secara permanen dari Halaman Detail.

#### Scenario: Menghapus todo dan kembali ke Halaman List
- **WHEN** pengguna menekan tombol hapus pada Halaman Detail
- **THEN** sistem menghapus item todo tersebut dari `localStorage` dan mengarahkan pengguna kembali ke Halaman List (`/`)

### Requirement: Proteksi Content Security Policy pada dokumen aplikasi
Sistem SHALL menerapkan kebijakan Content Security Policy (CSP) pada dokumen HTML utama yang membatasi sumber eksekusi skrip hanya dari origin aplikasi sendiri (`'self'`) dan melarang pemuatan objek berbahaya (`object-src 'none'`).

#### Scenario: Memuat halaman aplikasi dengan proteksi CSP aktif
- **WHEN** browser memuat halaman aplikasi
- **THEN** dokumen HTML menyertakan deklarasi `Content-Security-Policy` yang mengizinkan skrip dari `'self'` dan memblokir objek eksternal (`object-src 'none'`)
