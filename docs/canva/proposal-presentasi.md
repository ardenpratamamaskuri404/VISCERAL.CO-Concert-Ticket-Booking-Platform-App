# Dokumentasi Project: VISCERAL.CO (Sistem Konser & Ticketing App)

**Outline Presentasi Proposal (Canva Structure)**

## 1. Latar Belakang
- Tingginya minat masyarakat terhadap acara hiburan dan konser musik *live*.
- Permasalahan sistem pemesanan tiket konvensional yang sering mengalami antrean panjang, *server down*, dan calo tiket.
- Kebutuhan akan platform digital yang modern, aman, dan terintegrasi langsung antara *customer* (pembeli tiket) dan pihak penyelenggara (promotor/admin).
- VISCERAL.CO hadir sebagai solusi platform *ticketing* premium yang eksklusif, cepat, dan *real-time*.

## 2. Tujuan
- Menyediakan platform pembelian tiket konser yang mudah digunakan (*user-friendly*) melalui aplikasi *mobile* dan *website*.
- Menjamin keamanan transaksi tiket dengan integrasi *payment gateway* (DOKU) secara *real-time*.
- Mengurangi resiko tiket palsu dengan sistem *barcode/QR code scanner* mandiri untuk *check-in* pengunjung di lokasi acara (Gate Scanner).
- Membangun ekosistem komunikasi dua arah antara admin dan pelanggan melalui fitur *Live Chat*.

## 3. User (Pengguna)
1. **Customer (Pelanggan)**
   - Menggunakan Aplikasi *Mobile* (Mobile App).
   - Aktivitas: Mencari konser, memilih kursi (Seat Map), membeli tiket, mengunduh e-tiket (QR Code), dan menghubungi *customer support* via chat.
2. **Admin / Promotor**
   - Menggunakan Dashboard *Website* (Web App) dan Aplikasi *Mobile* khusus.
   - Aktivitas Web: Manajemen event, artis, kuota tiket, monitoring laporan penjualan, *broadcast* notifikasi, dan membalas *chat* pelanggan.
   - Aktivitas Mobile (Scanner): Bertugas di gerbang masuk (*gate*) untuk men-*scan* QR code penonton menggunakan kamera HP untuk *check-in* secara *real-time*.
3. **Superadmin**
   - Hak akses penuh atas sistem, manajemen peran admin, dan konfigurasi master.

## 4. Fitur
- **Manajemen Event & Kategori Tiket:** Pembuatan konser, harga, dan peta kursi dinamis.
- **Sistem Pembayaran Terintegrasi (Payment Gateway):** Mendukung VA, e-Wallet via DOKU.
- **Real-time E-Ticket & QR Code:** Tiket digital instan berstatus *live* (Menunggu Pembayaran -> Lunas -> Terpakai).
- **Scanner Gate (Real-time Check-in):** Validasi tiket di lapangan tanpa delay dengan integrasi WebSocket.
- **Live Chat Support (Real-time):** Komunikasi langsung pengguna dan tim bantuan via Socket.IO.
- **Push Notification:** Pemberitahuan otomatis untuk transaksi sukses, pengumuman, dan *chat* masuk.

## 5. Workflow (Flow / UML / DFD)
*(Visualisasi di Canva disarankan menggunakan diagram sederhana berikut:)*

### A. UML Use Case & Diagram Activity
- **Use Case Customer:** Register/Login -> Pilih Konser -> Pilih Kursi -> Checkout -> Bayar -> Lihat E-Ticket QR -> (Bantuan via Chat).
- **Use Case Admin:** Login -> Kelola Data Konser -> Balas Chat -> Scan Tiket di Lokasi.
- **Activity Diagram Pembelian Tiket:**
  `Mulai -> Pilih Event -> Input Data & Kursi -> Sistem Tahan Kursi (Locked) -> Generate Tagihan DOKU -> User Bayar -> Sistem Validasi Otomatis (Webhook) -> Terbitkan E-Ticket -> Selesai.`
- **Activity Diagram Scanning:**
  `Admin Buka Menu Scanner -> Arahkan Kamera ke QR User -> Request ke Server -> Server Validasi Status Tiket -> Update Status menjadi "Terpakai" -> Kembalikan Respon "Akses Diterima" -> Selesai.`

### B. DFD (Data Flow Diagram) -> Diagram Zero (Context Diagram)
- **Entitas:** Customer, Admin, Payment Gateway (DOKU).
- **Sistem Utama:** Sistem Ticketing VISCERAL.CO.
- **Aliran Data:** 
  - Customer -> (Data Pesanan, Pesan Chat) -> Sistem.
  - Sistem -> (E-Ticket QR, Tagihan Pembayaran, Balasan Chat) -> Customer.
  - Payment Gateway <-> (Request Pembayaran, Notifikasi Status/Webhook) <-> Sistem.
  - Admin -> (Data Event, Validasi Scan Tiket) -> Sistem.
  - Sistem -> (Laporan Penjualan, Notifikasi Scan Masuk) -> Admin.

## 6. UI / UX
- **Konsep Desain:** Premium, Eksklusif, dan Modern.
- **Skema Warna:** Obsidian (Hitam/Gelap), Gold (Emas aksen mewah), Oxblood (Merah Tua elegan).
- **Pendekatan UX:**
  - Navigasi *Mobile* kapsul (*Floating Pill Bar*) yang kekinian.
  - *Micro-interactions* (getaran/vibrasi saat tiket berhasil di-scan).
  - *Dark Mode Default* agar tidak menyilaukan mata saat berada di area konser/lapangan yang gelap.
  - Proses *checkout* yang mengalir cepat (kurang dari 4 step).

## 7. Langkah Pengerjaan
1. **Analisa & Desain Sistem:** Merancang *database* (Prisma ORM), arsitektur REST API, dan *mockup* UI/UX.
2. **Setup Lingkungan Backend:** Membangun *server* Node.js, Hono.js, dan Socket.IO untuk komunikasi *real-time*.
3. **Pengembangan Frontend Web (Dashboard):** Membangun UI admin menggunakan React, Vite, TailwindCSS.
4. **Pengembangan Mobile App:** Membuat aplikasi pengguna dan *scanner gate* admin menggunakan React Native (Expo).
5. **Integrasi Payment Gateway:** Menyambungkan sistem dengan DOKU untuk *virtual account*.
6. **Testing & Fixing (Status Saat Ini):** Pembersihan *bug* TypeScript, perbaikan sinkronisasi *real-time socket*, penyesuaian navigasi UI, dan perbaikan kelengkapan data *scanner*.
7. **Deployment & Rilis:** Hosting *server* ke *cloud*, merilis web, dan men- *generate* APK aplikasi.

## 8. Aplikasi Web & Mobile
*(Slide ini untuk menampilkan screenshot/mockup final di Canva)*
- **Web Dashboard:** *Interface* luas dengan grafik penjualan, tabel manajemen *event*, daftar transaksi *real-time*, dan fitur *broadcast notification*.
- **Mobile App (Customer View):** Beranda *event* elegan, fitur pemilihan kursi (Seat Map), detail *e-ticket* dengan QR Code besar yang mudah di-scan, dan menu *Chat Support*.
- **Mobile App (Admin Scanner):** Fitur kamera QR terintegrasi (*hardware/software scanner support*), dengan *feedback* warna cerah (Hijau/Merah) dan getaran untuk memastikan kecepatan *check-in* saat antrean konser panjang. Menampilkan lengkap data nama penonton, kategori, kursi, tanggal acara, dan jam Open Gate.
