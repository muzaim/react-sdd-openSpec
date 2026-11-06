# Spec Delta

## MODIFIED Requirements

### Requirement: Menampilkan dan memfilter daftar todo di Halaman List
Sistem SHALL menampilkan daftar todo maksimal 5 item per halaman beserta badge prioritas (`Low`, `Medium`, `High`, `Critical`), penanggung jawab, dan lokasi dengan icon maps pada rute `/`, menyediakan combobox (`<select>`) filter status (`Semua Status`, `Belum Selesai`, `Selesai`) dan filter prioritas (`Semua Priority`, `Low`, `Medium`, `High`, `Critical`), serta navigasi ke halaman Tambah dan Detail.

#### Scenario: Menampilkan seluruh daftar todo beserta lokasi dan penanggung jawab
- **WHEN** pengguna membuka Halaman List dengan pilihan combobox filter pada "Semua Status" dan "Semua Priority"
- **THEN** sistem menampilkan maksimal 5 item todo pada halaman aktif beserta badge prioritas, menampilkan nama penanggung jawab (jika dipilih), dan menampilkan icon maps di samping teks lokasi untuk setiap item yang memiliki informasi lokasi

#### Scenario: Memfilter daftar berdasarkan status penyelesaian melalui combobox
- **WHEN** pengguna memilih status penyelesaian (`Belum Selesai` atau `Selesai`) pada combobox filter status di Halaman List
- **THEN** sistem hanya menampilkan item todo yang memiliki status penyelesaian (`completed: false` untuk `Belum Selesai`, atau `completed: true` untuk `Selesai`) sesuai dengan pilihan combobox tersebut dengan batas 5 item per halaman

#### Scenario: Memfilter daftar berdasarkan prioritas melalui combobox
- **WHEN** pengguna memilih salah satu tingkat prioritas (`Low`, `Medium`, `High`, atau `Critical`) pada combobox filter di Halaman List
- **THEN** sistem hanya menampilkan item todo yang memiliki nilai `priority` sesuai dengan pilihan combobox tersebut dengan batas 5 item per halaman

#### Scenario: Memfilter daftar berdasarkan kombinasi status dan prioritas
- **WHEN** pengguna memilih filter status tertentu sekaligus filter prioritas tertentu pada kedua combobox di Halaman List
- **THEN** sistem hanya menampilkan item todo yang memenuhi kedua kriteria status dan prioritas tersebut dengan batas 5 item per halaman

#### Scenario: Mengubah status selesai secara cepat dari Halaman List
- **WHEN** pengguna menekan checkbox pada salah satu item todo di Halaman List
- **THEN** sistem memperbarui status `completed` item tersebut di `localStorage` tanpa berpindah ke Halaman Detail

#### Scenario: Membuka Halaman Detail dari daftar
- **WHEN** pengguna mengklik judul atau area kartu item todo di Halaman List
- **THEN** sistem mengarahkan pengguna ke Halaman Detail (`/todo/:id`) untuk item tersebut

### Requirement: Menavigasi daftar todo menggunakan pagination
Sistem SHALL menyediakan kontrol pagination berformat `Prev - Angka Halaman - Next` di Halaman List (`/`) dengan batas default 5 item per halaman, yang tetap ditampilkan selama terdapat minimal 1 item todo hasil filter dan otomatis kembali ke halaman 1 ketika filter status atau filter prioritas berubah.

#### Scenario: Menampilkan pagination saat jumlah data belum lebih dari 5 item
- **WHEN** pengguna membuka Halaman List dan jumlah item todo hasil filter antara 1 hingga 5 item
- **THEN** sistem tetap menampilkan kontrol pagination `Prev - 1 - Next` dengan angka halaman `1` aktif serta tombol `Prev` dan `Next` dalam keadaan nonaktif (*disabled*)

#### Scenario: Berpindah halaman saat jumlah data lebih dari 5 item
- **WHEN** terdapat lebih dari 5 item todo hasil filter dan pengguna menekan tombol angka halaman, `Next`, atau `Prev`
- **THEN** sistem menampilkan 5 item todo yang sesuai dengan halaman aktif, menonaktifkan tombol `Prev` di halaman pertama, serta menonaktifkan tombol `Next` di halaman terakhir

#### Scenario: Mereset halaman ke halaman pertama saat filter prioritas diubah
- **WHEN** pengguna sedang berada di halaman selain halaman 1 lalu mengubah pilihan combobox filter status atau combobox filter prioritas
- **THEN** sistem mengatur ulang halaman aktif kembali ke halaman `1` untuk daftar hasil filter yang baru
