# Panduan Simulasi Pembayaran Virtual Account (Doku Sandbox)

Jika tombol "Simulasi Pembayaran" tidak muncul di halaman tagihan Doku, Anda harus melakukan simulasi pembayaran secara manual melalui **Virtual Terminal** di Dashboard Doku Anda. 

Berikut adalah panduan lengkap selangkah demi selangkah:

## 1. Dapatkan Nomor Virtual Account
1. Lakukan *Checkout* di aplikasi web Sistem Konser kita.
2. Pilih metode pembayaran **BCA Virtual Account** (atau Mandiri/BRI/BNI).
3. Anda akan diarahkan ke halaman invoice Doku. 
4. Di halaman tersebut, Anda akan melihat **Nomor Virtual Account** (biasanya 16 digit angka, contoh: `1900800000314500`).
5. **Blok dan Copy (Salin)** nomor tersebut.

## 2. Buka Virtual Terminal Doku
1. Buka tab baru di browser Anda dan login ke **[Dashboard Doku Sandbox](https://sandbox.doku.com/)**.
2. Perhatikan menu di sebelah kiri layar.
3. *Scroll* ke bawah dan cari bagian **Accept Payments**.
4. Klik menu **Virtual Terminal**.

## 3. Eksekusi Pembayaran
1. Setelah halaman Virtual Terminal terbuka, pastikan Anda berada di tab **Virtual Account**.
2. Pada kolom pencarian atau input nomor VA, **Paste (Tempel)** nomor Virtual Account yang tadi Anda *copy* dari halaman tagihan.
3. Klik tombol **Check** atau **Inquiry**.
4. Sistem Doku akan memunculkan rincian tagihan Anda (Nama Event, Total Harga, dll).
5. Pastikan datanya sudah benar, lalu klik tombol **Pay** (Bayar).

## 4. Cek Hasilnya!
1. Jika berhasil, sistem Doku akan memunculkan notifikasi sukses di layar.
2. Webhook Doku akan otomatis mengirimkan sinyal ke Smee, lalu diteruskan ke aplikasi *backend* kita.
3. Silakan kembali ke tab aplikasi web Sistem Konser Anda.
4. Voila! Halaman tersebut akan otomatis *refresh* atau berubah statusnya menjadi **PAID**, tiket QR Code terbit, dan lonceng notifikasi admin akan menyala!

---
**💡 Tips Presentasi:**
Buka dua jendela browser bersebelahan (kiri: Web Sistem Konser, kanan: Dashboard Doku Virtual Terminal). Saat Anda klik "Pay" di jendela kanan, Dosen Anda bisa melihat layar sebelah kiri otomatis berubah menjadi lunas secara magis tanpa perlu me-refresh halaman (berkat teknologi Webhook Smee dan Websocket Socket.io yang Anda gunakan)!
