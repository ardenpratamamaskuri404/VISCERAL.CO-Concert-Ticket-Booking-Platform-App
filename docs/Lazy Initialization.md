# Arsitektur Lazy Initialization Pada Sistem Tiket Visceral

Sistem tiket konser Visceral dapat menggunakan metode *Lazy Initialization* (Pembuatan Kursi Berbasis Permintaan) untuk menangani jutaan kursi tanpa membuat server *down* atau membebani database.

Metode ini dirancang untuk menyelesaikan dua tantangan terbesar sistem tiket: **Kecepatan (Performa Server)** dan **Kapasitas (Ruang Database)**.

---

## 🚀 Cara Kerja (Jika Diterapkan)

### 1. Database 100% Kosong di Awal
Saat Anda membuat konser berskala stadion dengan kapasitas **80.000 kursi**, sistem **TIDAK** menyimpan 80.000 baris data kursi di tabel `seats` database MySQL Anda. Tabel tersebut dibiarkan kosong, sehingga database sangat ringan dan menghemat memori.

### 2. Generasi Kursi Virtual di Layar (Seat Map)
Ketika ratusan pembeli serentak membuka halaman Peta Kursi (Seat Map) di website:
- *Backend API* (`events.routes.ts`) akan melihat berapa batas maksimal kursi dari kolom `total_seats` di tabel `ticket_categories`.
- *Backend* menggunakan CPU Node.js yang super ngebut untuk berhitung dari angka 1 sampai 80.000 dalam waktu kurang dari 1 milidetik.
- Hasil perhitungan tersebut dikirimkan ke layar komputer/HP pembeli sebagai kotak-kotak kursi yang siap diklik. Proses ini tidak melibatkan *harddisk* database sama sekali!

### 3. Hanya Simpan Kursi yang Laku
Ketika ada pembeli yang mengklik kursi **S-150** lalu melakukan pembayaran (Checkout), barulah sistem menembakkan **1 baris data** ke database MySQL dengan status `"SOLD"` atau `"LOCKED"`.
Jika hanya 5.000 tiket yang laku, database Anda hanya akan menelan 5.000 data. Anda baru saja menyelamatkan ruang database dari 75.000 data "kosong" (Tersedia) yang tidak berguna!

---

**Mengapa Ini Mencegah Server Crash (War Tiket)?**
Database (MySQL) sangat lambat dalam mengirimkan puluhan ribu data secara bersamaan karena terbatasnya jalur koneksi. Dengan *Lazy Initialization*, beban pekerjaan dipindahkan dari Database ke CPU Server (Node.js) yang mampu menghitung ratusan ribu angka secara serentak tanpa kehabisan nafas.
