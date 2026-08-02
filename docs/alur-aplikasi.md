# Alur Aplikasi — VISCERAL.CO (Sistem Konser Terintegrasi)

Dokumen ini berisi panduan alur pemakaian **aplikasi VISCERAL.CO**. Semua alur sudah diperbarui untuk mencerminkan sistem terbaru yang sangat canggih, termasuk integrasi Payment Gateway Otomatis (DOKU), Pemilihan Kursi Real-Time, dan Notifikasi WebSockets.

Gunakan dokumen ini untuk menjelaskan alur sistem kepada Dosen/Penguji.

---

## 1. Alur Customer (Pengguna Aplikasi)

Customer adalah pengguna yang ingin membeli tiket konser. Berikut adalah urutan perjalanan (User Journey) mereka:

1. **Register / Login**
   - Customer membuat akun baru atau login menggunakan email dan password.
2. **Jelajah Event (Katalog Konser)**
   - Customer masuk ke halaman Explore untuk melihat daftar konser dan festival musik.
   - Customer bisa melakukan filter (Buka/Tutup) atau mencari nama artis/konser.
3. **Pilih Event & Kategori Tiket**
   - Di halaman detail, customer melihat deskripsi event dan daftar artis yang tampil.
   - **Logika Tipe Venue:**
     - Jika event adalah **Standing/Festival (is_seated = false)**: Customer langsung memilih jumlah tiket.
     - Jika event adalah **Seated/Stadion (is_seated = true)**: Customer bisa memilih tiket berdasarkan kategori tribun/kursi (Seat Management).
4. **Checkout & Pembayaran Otomatis (DOKU Payment Gateway)**
   - Sistem akan mengunci kuota (Seat) secara sementara (*Booking*). Status order = PENDING.
   - Customer diarahkan langsung ke halaman pembayaran **DOKU** (Bisa memilih Virtual Account, Kartu Kredit, atau QRIS).
   - *Keunggulan Sistem Baru:* Customer **TIDAK PERLU** lagi repot-repot melakukan upload bukti transfer manual.
5. **Konfirmasi Otomatis & Real-Time (WebHooks + Socket.io)**
   - Setelah customer membayar via DOKU, server DOKU akan menembak *Webhook* ke backend kita secara otomatis.
   - Backend memverifikasi *Signature HMAC* DOKU demi keamanan.
   - Jika valid, status order otomatis berubah menjadi PAID.
   - Sistem **Socket.io** langsung menembakkan notifikasi real-time ke layar customer saat itu juga bahwa pembayaran sukses, tanpa perlu me-refresh halaman!
6. **E-Tiket & QR Code Terbit**
   - Customer mendapatkan E-Tiket resmi dengan QR Code unik yang siap di-scan saat hari H konser.

---

## 2. Alur Admin & Superadmin (Manajemen)

Sistem menggunakan kontrol peran (Role-Based Access Control). Admin tidak perlu pusing memverifikasi pembayaran manual lagi karena semuanya sudah di-handle oleh DOKU.

1. **Kelola Event (CRUD)**
   - Admin bisa membuat konser baru.
   - Menentukan apakah konser tersebut berjenis **Seated** (kursi VIP/Tribun) atau **Standing/Gigs** (Festival lapangan terbuka).
   - Menentukan kategori harga tiket dan batas kuota otomatis.
2. **Dashboard & Laporan Penjualan**
   - Admin melihat statistik penjualan tiket secara real-time.
   - Setiap ada transaksi yang lunas dari DOKU, notifikasi real-time muncul di Dashboard Admin tanpa perlu *refresh*.
3. **Kelola Artis**
   - Admin menambahkan daftar artis baru beserta biografinya, lalu menghubungkannya ke konser terkait (*Relasi Many-to-Many*).
4. **Tutup Penjualan Tiket (Sales Closed)**
   - Hanya dengan 1 klik (Toggle), Admin bisa menutup penjualan tiket jika tiket ludes (Sold Out) atau mendekati hari H, mencegah customer baru melakukan checkout.

---

## 3. Alur Sistem Data (State Machine)

Bagian ini menjelaskan apa yang terjadi di balik layar pada database kita.

### 3.1 Status Pesanan (Order Lifecycle)
Sistem kita murni otomatis, tidak ada lagi tombol 'Approve Admin' untuk pembayaran.

BUAT PESANAN ──> PENDING
PENDING ──(Webhook DOKU sukses & divalidasi)──> PAID (Tiket Otomatis Terbit)
PENDING ──(Batas Waktu Bayar DOKU Habis)──> EXPIRED


### 3.2 Status Kuota / Kursi (Seat Management)
Bagaimana kita mencegah *Double Booking* (2 orang beli tiket terakhir secara bersamaan)?

AVAILABLE ──(Customer A klik Checkout)──> LOCKED (Kunci sementara)
LOCKED ──(Order Customer A = PAID)──> SOLD (Terjual permanen)
LOCKED ──(Order Customer A = EXPIRED/CANCEL)──> AVAILABLE (Dikembalikan ke pasar)


### 3.3 Status E-Tiket (Ticket Lifecycle)

DIBUAT (Otomatis dari status PAID) ──> ACTIVE
ACTIVE ──(Admin Scan QR di Pintu Masuk Konser)──> CHECKED_IN


---

## 4. Nilai Jual & Fitur Inovasi (Untuk Dijelaskan ke Dosen)

Jika Dosen/Penguji bertanya *'Apa keunggulan aplikasi ini dibanding aplikasi CRUD biasa?'*, ini poin yang harus dijelaskan:

1. **Fully Automated Payment (DOKU Gateway)**
   - Tidak ada lagi flow kuno 'Upload Bukti Bayar'. Pembayaran divalidasi oleh sistem perbankan nyata secara instan.
2. **Real-time WebSockets (Socket.io)**
   - Menggunakan teknologi *Event-Driven*! Admin dan Customer tidak perlu pencet tombol F5/Refresh. Jika ada tiket terjual, notifikasi muncul di pojok layar secara ajaib.
3. **Smart Ticketing System (Seated vs Standing)**
   - Arsitektur database kita cerdas. Sistem bisa membedakan konser Gigs terbuka (tanpa kursi) dan konser Stadion (dengan pembagian kategori kursi), serta otomatis melakukan pra-generasi *Seat* (kursi) di belakang layar saat event dibuat.
4. **Secure Data Integrity (Database Transactions)**
   - Menggunakan fitur *Transaction* pada Prisma ORM, sehingga proses pemotongan kuota dan pembuatan pesanan dijamin aman, anti-bocor, dan anti-double-booking.
