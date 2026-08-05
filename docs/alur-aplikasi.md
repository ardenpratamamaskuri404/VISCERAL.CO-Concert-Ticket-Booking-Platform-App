# Alur Aplikasi — VISCERAL.CO (Sistem Konser Terintegrasi)

Dokumen ini berisi panduan alur pemakaian **aplikasi VISCERAL.CO**. Semua alur sudah diperbarui untuk mencerminkan sistem terbaru yang sudah dikembangkan, termasuk integrasi Payment Gateway Otomatis (DOKU), Pemilihan Kursi Real-Time, Notifikasi WebSockets, dan pemisahan tegas platform Web (Admin) dan Mobile (Customer).

Gunakan dokumen ini untuk menjelaskan alur sistem kepada Dosen/Penguji.

---

## 1. Alur Customer (Aplikasi Mobile & Web Frontend)

Customer adalah pengguna yang ingin membeli tiket konser. Aplikasi **Mobile** secara murni DEDIKASIKAN HANYA untuk Customer (tidak ada lagi fitur login Staff/Admin di Mobile).

1. **Register / Login (Mobile/Web)**
   - Customer membuat akun baru atau login menggunakan email dan password.
   - *Splash Screen & Onboarding* di Mobile menggunakan identitas visual resmi (Logo SVG VISCERAL.CO) dengan tema Obsidian & Gold.
2. **Jelajah Event (Katalog Konser)**
   - Customer masuk ke halaman Explore untuk melihat daftar konser dan festival musik.
   - Di web, halaman ini dilengkapi dengan animasi *Framer Motion* yang dinamis dan modern (efek scroll-reveal).
   - Customer bisa melakukan pencarian konser.
3. **Pilih Event & Kategori Tiket**
   - Customer melihat deskripsi event dan daftar artis yang tampil.
   - **Logika Tipe Venue:**
     - Jika event adalah **Standing/Festival (is_seated = false)**: Customer langsung memilih jumlah tiket.
     - Jika event adalah **Seated/Stadion (is_seated = true)**: Customer bisa memilih tiket berdasarkan kategori tribun/kursi (Seat Management).
4. **Checkout & Pembayaran (DOKU Virtual Account)**
   - Sistem akan mengunci kuota (Seat) secara sementara. Status order = PENDING.
   - Customer memilih metode pembayaran Virtual Account (BCA/BNI/Mandiri) yang disimulasikan melalui DOKU.
   - Customer mendapatkan instruksi pembayaran lengkap (Nomor VA, batas waktu, cara bayar).
5. **Konfirmasi Otomatis & Real-Time (Socket.io)**
   - Setelah customer melakukan simulasi pembayaran, backend memverifikasi pembayaran.
   - Status order otomatis berubah menjadi PAID.
   - Sistem **Socket.io** langsung menembakkan notifikasi real-time ke layar customer bahwa pembayaran sukses. Customer diarahkan ke halaman sukses beranimasi *Lottie Confetti*.
6. **E-Tiket & QR Code Terbit**
   - Customer mendapatkan E-Tiket resmi dengan QR Code unik yang siap di-scan saat hari H konser (Tersedia di tab "My Tickets" pada aplikasi Mobile).

---

## 2. Alur Admin & Superadmin (Eksklusif Web Dashboard)

Manajemen sistem difokuskan 100% pada **Web Dashboard** untuk Admin/Superadmin.

1. **Dashboard Penjualan & Okupansi**
   - Admin melihat statistik penjualan tiket secara real-time.
   - Tabel pesanan langsung ter-update (Socket.io) ketika ada transaksi DOKU yang lunas.
2. **Kelola Event & Tiket (CRUD)**
   - Admin membuat konser baru, menentukan banner, dan jenis venue (Seated vs Standing).
   - Menentukan kategori harga tiket dan mengalokasikan kuota/kursi secara massal.
3. **Kelola Artis**
   - Admin menambahkan daftar artis baru beserta biografinya, lalu menghubungkannya ke konser terkait (*Relasi Many-to-Many*).
4. **Gate Scanner (Check-in Tiket)**
   - Admin/Staff menggunakan fitur *Scanner Gate Admin* di Web Dashboard.
   - Staff mengetik/melakukan scan *Ticket Code* dari customer.
   - Sistem akan memvalidasi keabsahan tiket (menolak tiket kadaluarsa atau tiket yang sudah di-scan sebelumnya) dan menandai status tiket menjadi `CHECKED_IN`.
5. **Tutup Penjualan Tiket (Sales Closed)**
   - Admin dapat menutup penjualan tiket secara manual untuk event yang sudah mendekati hari H atau tiket ludes (Sold Out).

---

## 3. Alur Sistem Data (State Machine)

Bagian ini menjelaskan siklus hidup data di balik layar pada database kita.

### 3.1 Status Pesanan (Order Lifecycle)

BUAT PESANAN ──> PENDING
PENDING ──(Simulasi Bayar DOKU sukses)──> PAID (Tiket Otomatis Terbit)
PENDING ──(Batas Waktu Bayar Habis)──> EXPIRED

### 3.2 Status Kuota / Kursi (Seat Management)

Mencegah *Double Booking* secara *Real-Time*:

AVAILABLE ──(Customer klik Checkout)──> LOCKED (Kunci sementara)
LOCKED ──(Order = PAID)──> SOLD (Terjual permanen)
LOCKED ──(Order = EXPIRED/CANCEL)──> AVAILABLE (Dikembalikan ke pasar)

### 3.3 Status E-Tiket (Ticket Lifecycle)

DIBUAT (Otomatis dari status PAID) ──> ACTIVE
ACTIVE ──(Admin Scan via Web Gate Scanner)──> CHECKED_IN


## Status Perbaikan & Pengembangan Terkini (Agustus 2026)

1. **Dokumentasi Canva**: Telah ditambahkan folder docs/canva/ berisi proposal-presentasi.md yang merangkum keseluruhan proyek (Latar Belakang, Tujuan, Fitur, Workflow UML/DFD, UI/UX) untuk pembuatan PPT/Proposal Canva.
2. **Penyempurnaan Fitur Scanner (Web & Mobile)**: Scanner kini menampilkan data riwayat secara komprehensif, mencakup Nama Penonton, Kategori, Nomor Kursi, Tanggal Acara, serta Jam Open Gate secara realtime.
3. **Modernisasi UI/UX Mobile**: Pembaruan sistem navigasi menggunakan gaya *Floating Pill Tab Bar* eksklusif yang menyesuaikan *theme* Visceral (Gold & Obsidian).
4. **Real-time Chat & WebSockets**: Kesalahan rute API HTTP POST pada fitur chat mobile telah dialihkan sepenuhnya menggunakan protokol Socket.IO untuk menjamin obrolan instan dua arah.
5. **Pembersihan Bug & Code Quality**: Berhasil menyelesaikan ratusan issue/error TypeScript (terutama pada *middleware* otentikasi Hono c.get('user') dan validasi tipe) di direktori web/backend/src/routes/ hingga tercapai *0 errors*.