# ScannerHybrid: Sistem Pengecekan Tiket Pintar (Web & Mobile)

Dokumen ini merangkum rencana pembuatan **ScannerHybrid**. Ini adalah fitur "Kamera Ajaib" untuk mengecek keaslian tiket konser secara instan, menggantikan cara lama yang harus mengetik ID tiket satu per satu. 

Disebut **Hybrid** karena fitur ini akan hidup di dua tempat sekaligus: **Web Dashboard (Laptop/PC)** dan **Aplikasi Mobile (HP)**. Keduanya saling terhubung secara langsung (*real-time*).

---

## 1. Bagaimana Alur Penggunaannya?

Bayangkan suasana di gerbang konser yang sangat ramai. Inilah cara petugas kita bekerja nanti:

- **Bagi Petugas yang Duduk di Meja (Pakai Laptop/Webcam):**
  Petugas cukup membuka *Web Dashboard Admin* di Google Chrome, masuk ke menu **Gate Scanner**. Kamera laptop akan menyala, dan mereka tinggal menaruh tiket penonton di depan kamera laptop.
  
- **Bagi Petugas Lapangan yang Berkeliling (Pakai HP):**
  Petugas membuka Aplikasi Mobile di HP mereka. Sekilas, aplikasi itu terlihat seperti aplikasi khusus penonton biasa. Namun, petugas tahu sebuah trik rahasia: **Mereka mengetuk Logo VISCERAL sebanyak 5 kali berturut-turut.**
  *Boom!* Tiba-tiba muncul halaman rahasia untuk Admin. Kamera HP langsung menyala, dan mereka bisa memindai (scan) tiket penonton sambil berjalan-jalan mengatur antrean.

- **Saling Terhubung (Sinkronisasi Real-Time):**
  Kalau petugas HP (Mobile) berhasil men-scan tiket nomor `001`, detik itu juga tiket dinyatakan "Sudah Dipakai". Jika semenit kemudian ada penipu yang membawa fotokopi tiket `001` ke petugas Laptop (Web), layar laptop akan langsung berkedip **MERAH** dan berbunyi, menolak tiket tersebut. Di saat yang sama, Bos Besar (Superadmin) di ruangan berbeda bisa melihat jumlah penonton yang masuk bertambah secara otomatis di layarnya tanpa perlu me-refresh halaman!

---

## 2. Alat (Library) Apa Saja yang Kita Pakai?

Untuk membuat keajaiban ini, kita menggunakan alat-alat modern:

1. **`@yudiel/react-qr-scanner` (Untuk Web):**
   Alat ini sangat ringan dan pintar memanggil kamera dari *browser* (seperti Google Chrome) untuk membaca kotak hitam putih (QR Code) menjadi teks.
2. **`expo-camera` (Untuk Mobile):**
   Ini adalah alat resmi dari sistem HP. Sangat cepat, stabil, dan bisa menangkap gambar meski pencahayaan konser sedang remang-remang.
3. **`Socket.io` (Untuk Real-Time):**
   Ini adalah alat penghubung tanpa kabel. Begitu tiket sukses di-scan, alat ini langsung berteriak ke seluruh sistem: *"Satu orang masuk!"* sehingga layar *Dashboard* Superadmin langsung ter-update otomatis.
4. **Prisma Transaction (Untuk Keamanan Database):**
   Alat penggembok ganda di *database*. Mencegah terjadinya *error* jika ada 2 petugas men-scan tiket fotokopian yang sama persis di detik yang bersamaan. 

---

## 3. Plus & Minus (Kelebihan dan Kekurangan)

Setiap sistem pasti punya dua sisi. Berikut adalah nilai Plus dan Minus dari **ScannerHybrid**:

### 🌟 Plus (Kelebihan Utama)
1. **Super Praktis untuk Presentasi (Testing Lokal):** Karena kita menyelipkan scanner ini di dalam Aplikasi Mobile (*Native*), kamera HP dipastikan 100% langsung menyala lewat WiFi kampus/lokal. Tidak perlu pusing mengurus masalah keamanan *HTTPS* yang biasa memblokir kamera di *browser* HP.
2. **Estetika Aplikasi Customer Terjaga:** Pintu masuk untuk Admin sengaja "disembunyikan" (Easter Egg). Penonton yang menggunakan aplikasi tidak akan melihat tombol aneh bertuliskan "Menu Admin".
3. **Anti-Spam (Auto Jeda):** Jika tiket ditahan di depan kamera, kamera akan otomatis **berhenti sejenak** setelah membacanya 1 kali, agar komputer pusat tidak pusing (mencegah *jebol/hang*). Setelah petugas melihat hasilnya, kamera otomatis menyala lagi untuk orang berikutnya.
4. **Indikator Jelas (Warna & Suara):** Layar akan berubah Hijau (Sukses) atau Merah (Gagal) dengan sangat besar, disertai efek suara pendek (*beep* / *buzzer*). Petugas tidak perlu lelah membaca teks kecil.
5. **Anti-Calo (Keamanan):** Isi dari QR Code bukanlah tulisan mudah seperti `TIKET_001`, melainkan kode sandi rumit (contoh: `f47ac10b-58cc-4372-a567-0e02b2c3d479`). Sangat mustahil bagi calo untuk menebak kode tiket orang lain.

### ⚠️ Minus (Kekurangan yang Bisa Diatasi)
1. **Harus Diberitahukan Secara Lisan:** Karena tombol admin di HP itu tersembunyi (harus ketuk logo 5 kali), Anda harus melatih/memberitahu staf baru secara langsung. (Tapi karena ini project internal/tidak di-*deploy* ke toko aplikasi publik, hal ini justru sangat mudah dikendalikan).
2. **Ketergantungan Kualitas Kamera HP:** Jika HP staf memiliki kamera yang sangat buram atau kotor, scan bisa agak lama. 
   - *Solusi/Cadangan:* Kita tetap menyediakan sebuah kolom kecil untuk mengetik nomor tiket secara manual (berjaga-jaga jika QR Code pelanggan rusak atau kamera blur).

---

## 4. Alur Sistem di Balik Layar (Sistematika Data)

Bagaimana urutan perubahan data di sistem pusat kita?
1. Tiket yang baru dibeli penonton akan berstatus **`ACTIVE`**.
2. Tiket diarahkan ke kamera ScannerHybrid.
3. Scanner mengambil kode tiket dan mengirimkannya ke Backend.
4. Backend mengecek status tiket tersebut:
   - Jika `ACTIVE`: Ubah status menjadi **`CHECKED_IN`**. Kirim balasan Sukses (Layar Hijau) + Simpan nama Admin yang nge-scan.
   - Jika `CHECKED_IN`: Kirim balasan Gagal (Layar Merah, Peringatan "Tiket sudah digunakan pada pukul 19:00").
   - Jika kode tidak ada di database: Kirim balasan Gagal (Layar Merah, "Tiket Palsu!").

---

## 5. Langkah-Langkah Pengerjaan Nanti (Eksekusi)

Jika kita sudah sepakat, ini adalah urutan kerja yang akan saya lakukan selanjutnya:

1. **Tahap 1: Backend (Otak Sistem)**
   Saya akan membuat jalur penghubung (API Endpoint) baru bernama `POST /api/tickets/scan`. Di sini saya akan memasang kunci keamanan agar hanya Admin yang bisa mengaksesnya, lalu membuat logika perubahan status `ACTIVE` menjadi `CHECKED_IN`.
   
2. **Tahap 2: Frontend Web (Untuk Laptop)**
   Saya akan meng-install `@yudiel/react-qr-scanner`, lalu membuat satu halaman *Scanner Gate* di dalam *Web Dashboard*. Saya akan merapikan tampilannya agar bisa berkedip Hijau/Merah dengan jelas.

3. **Tahap 3: Frontend Mobile (Pintu Rahasia HP)**
   Saya akan memasang logika klik 5x di Logo VISCERAL pada halaman awal aplikasi mobile. Jika berhasil, akan melompat ke halaman login khusus Admin, lalu masuk ke halaman kamera `expo-camera` yang sudah dilengkapi dengan efek warna dan suara penanda. 

Sistem **ScannerHybrid** ini akan menjadi fitur *Showcase* (Andalan) yang dijamin membuat kagum siapa saja yang melihatnya beraksi!
