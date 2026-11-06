# Spec Delta

## Purpose

Menyediakan kapabilitas pengelolaan daftar tugas (todo) beserta tingkat prioritas, informasi lokasi, dan penanggung jawabnya melalui tiga halaman utama (List, Tambah, dan Detail) dengan penyimpanan persisten di penyimpanan lokal browser.

## ADDED Requirements

### Requirement: Persistensi data todo di penyimpanan lokal
Sistem SHALL menyimpan dan memuat seluruh daftar todo beserta tingkat prioritas (`low`, `medium`, `high`, `critical`), lokasi (`location` bertipe string), dan penanggung jawab (`assignee` bertipe string) dari penyimpanan lokal browser (`localStorage`) sehingga data tetap tersimpan meskipun halaman dimuat ulang.

#### Scenario: Memuat daftar todo saat aplikasi dibuka
- **WHEN** pengguna membuka aplikasi dan sudah terdapat data todo tersimpan di `localStorage`
- **THEN** sistem menampilkan seluruh item todo yang tersimpan sesuai urutan waktu pembuatannya

#### Scenario: Menangani penyimpanan lokal yang masih kosong
- **WHEN** pengguna membuka aplikasi untuk pertama kali dan belum ada data di `localStorage`
- **THEN** sistem menginisialisasi daftar todo kosong dan menampilkan tampilan *empty state*

#### Scenario: Menangani item todo lama tanpa atribut prioritas, lokasi, atau penanggung jawab
- **WHEN** sistem memuat item todo dari `localStorage` yang belum memiliki atribut `priority`, `location`, atau `assignee`
- **THEN** sistem menetapkan nilai fallback `priority` menjadi `"medium"`, `location` menjadi `""`, dan membiarkan `assignee` bernilai `""` (kosong) untuk item tersebut

### Requirement: Menampilkan dan memfilter daftar todo di Halaman List
Sistem SHALL menampilkan seluruh daftar todo beserta badge prioritas (`Low`, `Medium`, `High`, `Critical`), nama penanggung jawab (jika ada), dan informasi lokasi dengan icon maps pada rute `/`, menyediakan filter berbentuk combobox (`<select>`) berdasarkan prioritas (`Semua Priority`, `Low`, `Medium`, `High`, dan `Critical`), serta navigasi menuju halaman Tambah dan halaman Detail.

#### Scenario: Menampilkan seluruh daftar todo beserta lokasi dan penanggung jawab
- **WHEN** pengguna membuka Halaman List dengan pilihan combobox filter pada "Semua Priority"
- **THEN** sistem menampilkan seluruh item todo beserta badge prioritas, menampilkan nama penanggung jawab (jika dipilih), dan menampilkan icon maps di samping teks lokasi untuk setiap item yang memiliki informasi lokasi

#### Scenario: Memfilter daftar berdasarkan prioritas melalui combobox
- **WHEN** pengguna memilih salah satu tingkat prioritas (`Low`, `Medium`, `High`, atau `Critical`) pada combobox filter di Halaman List
- **THEN** sistem hanya menampilkan item todo yang memiliki nilai `priority` sesuai dengan pilihan combobox tersebut

#### Scenario: Mengubah status selesai secara cepat dari Halaman List
- **WHEN** pengguna menekan checkbox pada salah satu item todo di Halaman List
- **THEN** sistem memperbarui status `completed` item tersebut di `localStorage` tanpa berpindah ke Halaman Detail

#### Scenario: Membuka Halaman Detail dari daftar
- **WHEN** pengguna mengklik judul atau area kartu item todo di Halaman List
- **THEN** sistem mengarahkan pengguna ke Halaman Detail (`/todo/:id`) untuk item tersebut

### Requirement: Menambahkan todo baru di Halaman Tambah
Sistem SHALL menyediakan formulir pada rute `/add` untuk membuat item todo baru dengan judul wajib, pilihan tingkat prioritas (`low`, `medium`, `high`, `critical` dengan nilai awal `medium`), combobox penanggung jawab dengan opsi awal kosong (`-- Pilih --`) beserta 5 pilihan nama Indonesia, input lokasi bertipe string (opsional), dan deskripsi opsional.

#### Scenario: Berhasil menyimpan todo baru beserta prioritas, lokasi, dan penanggung jawab
- **WHEN** pengguna mengisi judul, memilih tingkat prioritas, serta memilih penanggung jawab, lokasi, dan deskripsi (opsional) lalu mengirimkan formulir di Halaman Tambah
- **THEN** sistem membuat item todo baru dengan `id` unik, `priority` terpilih, `assignee` terpilih (atau `""` jika tidak dipilih), `location` berupa string, `completed: false`, dan `createdAt` saat ini, menyimpannya ke `localStorage`, serta mengarahkan pengguna kembali ke Halaman List (`/`)

#### Scenario: Mencegah penyimpanan todo dengan judul kosong
- **WHEN** pengguna mencoba menyimpan todo di Halaman Tambah dengan judul kosong atau hanya berisi spasi
- **THEN** sistem menolak penyimpanan dan menampilkan umpan balik validasi pada input judul

### Requirement: Melihat dan memperbarui todo di Halaman Detail
Sistem SHALL menampilkan detail lengkap sebuah todo pada rute `/todo/:id` (judul, penanggung jawab, lokasi beserta icon maps, deskripsi, tingkat prioritas, status selesai, dan waktu pembuatan) serta mengizinkan pengguna mengedit seluruh informasi tersebut.

#### Scenario: Menampilkan informasi lengkap todo beserta prioritas, lokasi, dan penanggung jawab
- **WHEN** pengguna membuka `/todo/:id` dengan `id` yang valid
- **THEN** sistem menampilkan judul, nama penanggung jawab (jika ada), informasi lokasi dengan icon maps, deskripsi lengkap, badge tingkat prioritas, status selesai, dan tanggal pembuatan todo tersebut

#### Scenario: Mengedit judul, penanggung jawab, lokasi, deskripsi, prioritas, dan status di Halaman Detail
- **WHEN** pengguna mengubah judul, penanggung jawab melalui combobox, lokasi, deskripsi, tingkat prioritas, atau status selesai pada Halaman Detail lalu menyimpan perubahan
- **THEN** sistem memperbarui data item tersebut di `localStorage` dan menampilkan data terbaru

#### Scenario: Menangani ID todo yang tidak ditemukan
- **WHEN** pengguna mengakses `/todo/:id` dengan `id` yang tidak ada di `localStorage`
- **THEN** sistem menampilkan pesan bahwa todo tidak ditemukan beserta tautan untuk kembali ke Halaman List (`/`)

### Requirement: Menghapus todo dari Halaman Detail
Sistem SHALL mengizinkan pengguna menghapus item todo secara permanen dari Halaman Detail.

#### Scenario: Menghapus todo dan kembali ke Halaman List
- **WHEN** pengguna menekan tombol hapus pada Halaman Detail
- **THEN** sistem menghapus item todo tersebut dari `localStorage` dan mengarahkan pengguna kembali ke Halaman List (`/`)
