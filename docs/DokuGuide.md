# Panduan Setup Dashboard Doku Sandbox

Untuk memastikan semua transaksi tercatat dengan baik di Dashboard Doku dan status di website kita otomatis berubah menjadi **PAID**, Anda perlu mengatur 3 hal utama di Dashboard Doku Sandbox Anda.

## 1. Mendapatkan Client ID & Secret Key
Kunci ini digunakan agar aplikasi kita diizinkan untuk membuat tagihan (checkout) di sistem Doku.

1. Login ke **[Dashboard Jokul Doku Sandbox](https://sandbox.doku.com/)**.
2. Perhatikan menu di sebelah kiri, klik **Integration** > **API Keys**.
3. Di layar tersebut, Anda akan melihat kotak berisi **Client ID** dan **Secret Key**.
4. Salin (*copy*) kedua kunci tersebut.
5. Buka file `web/backend/.env` di VS Code, dan tempel (*paste*) kuncinya:
   ```env
   DOKU_CLIENT_ID="KODE_CLIENT_ID_ANDA"
   DOKU_SECRET_KEY="KODE_SECRET_KEY_ANDA"
   ```

## 2. Mengatur URL Webhook (Notification URL)
Webhook adalah cara Doku memberi tahu aplikasi kita bahwa pelanggan sudah sukses membayar.

1. Di Dashboard Doku Sandbox, klik menu **Integration** > **Integration Settings**.
2. Cari bagian **Notification URL** atau **Webhook URL**.
3. Masukkan URL Smee Anda yang diteruskan ke port `3005`:
   ```text
   https://smee.io/DVZXb4y8903V0qMo
   ```
4. Klik **Save** / **Update**.
*(Jangan lupa, saat presentasi, Anda harus membiarkan terminal yang menjalankan Smee atau `npm run dev` backend tetap menyala)*.

## 3. Mengaktifkan Metode Pembayaran (Payment Channels)
Agar pelanggan (atau Dosen Anda) bisa memilih berbagai metode pembayaran saat *checkout*.

1. Di Dashboard Doku, klik menu **Accept Payments** > **Payment Channels**.
2. Anda akan melihat banyak metode pembayaran (BCA VA, Mandiri VA, OVO, ShopeePay, Credit Card).
3. Pastikan tombol/saklar di sebelah kanannya berwarna **Hijau (Aktif)**.
4. **💡 Tips Presentasi:** Pastikan **Credit Card (Kartu Kredit)** aktif. Saat demo ke Dosen, pilih Credit Card lalu masukkan nomor kartu sakti `4111 1111 1111 1111` (CVV bebas). Transaksi akan instan sukses dan data 100% masuk ke Dashboard!

## 4. Cara Melihat Data Transaksi Masuk
Untuk membuktikan kepada Dosen bahwa uang/data benar-benar masuk ke akun Anda:

1. Di Dashboard Doku, klik menu **Transactions** > **Orders** (atau **Overview**).
2. Di sana Anda akan melihat daftar semua orang yang memesan tiket. 
3. Transaksi yang sukses via Credit Card tadi akan berstatus **SETTLED** (Sukses), dan yang belum dibayar akan berstatus **PENDING**.
