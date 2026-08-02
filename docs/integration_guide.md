# Panduan Integrasi Fonnte, Doku, dan Database (QR Code)

Dokumen ini berisi panduan teknis dan alur integrasi sistem aplikasi VISCERAL.CO dengan layanan eksternal yaitu Fonnte (untuk WhatsApp OTP/Notifikasi) dan Doku (untuk Payment Gateway), serta panduan struktur database untuk QR Code tiket.

---

## 1. Integrasi Doku (Payment Gateway)

Doku digunakan untuk menangani pembayaran tiket secara otomatis (Virtual Account, Credit Card, E-Wallet, dll).

### Alur Pembayaran Doku
1. **Checkout**: Pelanggan memilih tiket dan menekan tombol pembayaran di frontend.
2. **Hit API**: Backend menerima request checkout dan membuat *Invoice/Payment Link* ke API Doku.
3. **Response Doku**: Doku mengembalikan URL Pembayaran atau kode Virtual Account.
4. **Display**: Frontend menampilkan halaman/link pembayaran Doku kepada pelanggan.
5. **Webhook/Callback**: Setelah pelanggan membayar, Doku akan mengirimkan Webhook ke server backend VISCERAL.CO (contoh: `POST /api/payments/doku-webhook`).
6. **Update Status**: Backend memverifikasi *Signature* dari Doku, lalu mengupdate status Order menjadi `PAID` di database dan men-generate e-ticket (QR Code).

### Endpoint Doku yang Digunakan (Referensi API Doku)
- **Create Payment/Checkout**: `POST https://api.doku.com/checkout/v1/payment`
- **Webhook Endpoint (di Backend Anda)**: `POST /api/payments/callback`
  *Header wajib: `Client-Id`, `Request-Id`, `Request-Timestamp`, `Signature`.*

### Panduan Setup Doku Sandbox (Untuk Development)
Untuk melakukan testing pembayaran tanpa menggunakan uang asli, Anda harus menggunakan lingkungan Sandbox dari Doku.

**Langkah 1: Registrasi Akun Sandbox**
1. Buka halaman [DOKU Sandbox Dashboard](https://sandbox.doku.com/bo/).
2. Daftar akun baru atau login jika sudah punya.
3. Setelah masuk, lengkapi profil bisnis (dummy) hingga Anda mendapatkan akses penuh ke Dashboard.

**Langkah 2: Dapatkan Client ID dan Secret Key**
1. Karena antarmuka DOKU kadang diperbarui, cari menu **Settings / Pengaturan** (biasanya dengan mengklik profil nama Anda di pojok kiri bawah "Arden..." yang memiliki titik tiga, atau di bagian pojok kanan atas).
2. Temukan bagian **API Credentials** atau **Key Management**.
3. Generate/Buat kredensial baru, lalu Anda akan melihat **Client ID** dan **Secret Key**.
3. *Copy* kedua kredensial tersebut dan masukkan ke dalam file `.env` di folder `web/backend/`:
```env
DOKU_CLIENT_ID="ISI_DENGAN_CLIENT_ID_ANDA"
DOKU_SECRET_KEY="ISI_DENGAN_SECRET_KEY_ANDA"
```

**Langkah 3: Setup Webhook untuk Notifikasi Pembayaran (Localhost)**
Karena API Doku perlu memanggil *backend* Anda saat ada pembayaran yang berhasil, *backend* (localhost) Anda harus bisa diakses dari internet.
1. Download dan jalankan **Ngrok** di terminal baru:
   ```bash
   ngrok http 3005
   ```
2. Ngrok akan memberikan URL publik (contoh: `https://abcd-123.ngrok-free.app`).
3. Kembali ke **DOKU Sandbox Dashboard**, masuk ke menu **Integration > Notification URL**.
4. Masukkan URL Ngrok Anda ditambah rute *webhook* kita, misalnya:
   `https://abcd-123.ngrok-free.app/api/payments/doku-webhook`
5. Simpan pengaturan. Sekarang Doku bisa memberi tahu aplikasi Anda setiap kali pembayaran Sandbox berhasil!

---

## 2. Integrasi Fonnte (WhatsApp Notifikasi & OTP)

Fonnte digunakan untuk mengirim pesan WhatsApp berisi OTP pendaftaran, notifikasi berhasil bayar, dan pengiriman E-Ticket (QR Code link).

### Alur Fonnte
1. **Trigger OTP/Notifikasi**: Saat user mendaftar atau pesanan berubah status ke `PAID`, backend menyiapkan pesan teks (bisa beserta gambar/link).
2. **Hit API Fonnte**: Backend men-trigger API Fonnte dengan membawa No. HP tujuan (format `08xx` atau `628xx`), token API Fonnte, dan isi pesan.
3. **Pesan Terkirim**: Fonnte meneruskan pesan ke WhatsApp pelanggan.

### Contoh Request ke Fonnte
**Endpoint**: `POST https://api.fonnte.com/send`
**Headers**:
```json
{
  "Authorization": "TOKEN_API_FONNTE_ANDA"
}
```
**Body (Form Data / JSON)**:
```json
{
  "target": "081234567890",
  "message": "Halo Budi! Pembayaran tiket VISCERAL FESTIVAL telah berhasil. Lihat tiket Anda disini: https://visceral.co/tickets/VSC-12345",
  "url": "https://link-ke-gambar-atau-pdf-tiket.com/file.pdf" // Opsional jika ingin kirim file
}
```

---

## 3. Sistem Tiket dan QR Code

QR Code digunakan untuk validasi/check-in tiket secara fisik di venue (menggunakan admin scanner). 

### Alur Pembuatan dan Validasi QR Code
1. **Generate**: Saat status Order berubah menjadi `PAID`, sistem membuat data di tabel `tickets`.
2. **Ticket Code**: Field `ticket_code` pada tabel `tickets` di-generate (contoh: `VSC-TK-VIP-A12` atau UUID unik).
3. **Pembuatan Gambar QR**: Di backend atau frontend, string `ticket_code` di-encode menjadi gambar QR (menggunakan library `qrcode` di Node.js atau `qrcode.react` di frontend).
4. **Distribusi**: QR code (atau URL ke halaman e-ticket) dikirimkan via email dan WhatsApp (Fonnte).
5. **Check-In**: Admin di gate memindai QR code, yang berisi `ticket_code`.
6. **Validasi Backend**: Scanner menembak endpoint `POST /api/tickets/checkin` dengan payload `{ "ticket_code": "..." }`.
7. **Pengecekan**: 
   - Jika status tiket `ACTIVE`, ubah jadi `CHECKED_IN`, kembalikan respon Sukses.
   - Jika status tiket sudah `CHECKED_IN`, tolak karena tiket sudah dipakai.

### Referensi Skema Database Terkait Tiket
Tabel utama untuk ini adalah `tickets`:
```sql
CREATE TABLE tickets (
  id                    VARCHAR(36)  NOT NULL PRIMARY KEY,
  order_id              VARCHAR(36)  NOT NULL,
  seat_id               VARCHAR(36)  NOT NULL UNIQUE,
  ticket_code           VARCHAR(50)  NOT NULL UNIQUE, -- Data string yang diubah jadi QR Code
  status                ENUM('ACTIVE', 'CHECKED_IN', 'CANCELLED') NOT NULL DEFAULT 'ACTIVE',
  checked_in_at         DATETIME(3)  NULL,
  checked_in_by_admin   VARCHAR(36)  NULL,
  created_at            DATETIME(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP(3)
)
```

---
**Kesimpulan**: 
- Gunakan **Doku** untuk otomasi penagihan dan konfirmasi bayar melalui Webhook.
- Setelah Doku mengkonfirmasi bayar, buat record `tickets` dengan `ticket_code` (generate QR code).
- Gunakan **Fonnte** untuk mengirim konfirmasi dan link QR code tiket tersebut ke WhatsApp pembeli secara otomatis.
