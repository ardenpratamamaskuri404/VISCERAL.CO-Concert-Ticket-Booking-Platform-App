# 🚀 Panduan Lengkap Setup Project VISCERAL.CO

Panduan ini dibuat agar kamu bisa menjalankan *project* VISCERAL.CO (Sistem Konser & Ticketing App) di komputermu sendiri dari nol.

## 📌 Prasyarat (Pastikan sudah ter-install)
1. **Node.js** (versi 18 ke atas disarankan)
2. **MySQL / XAMPP / Laragon** (untuk database)
3. **MySQL Workbench** (opsional, disarankan untuk *import* database)
4. **Aplikasi Expo Go** (di HP Android/iOS untuk *testing* aplikasi *mobile*)

---

## 🛠 Langkah 1: Clone Repository
Buka terminal/CMD di folder tempat kamu ingin menyimpan *project*, lalu jalankan:
```bash
git clone <URL_GITHUB_REPO_KAMI>
cd sistem-konser-app
```
*(Catatan: Ganti `<URL_GITHUB_REPO_KAMI>` dengan link repo GitHub yang sebenarnya)*

---

## 🗄 Langkah 2: Setup Database MySQL
Kita sudah menyediakan *dump* database lengkap beserta isi datanya di folder `docs`.
1. Buka **MySQL Workbench** (atau phpMyAdmin).
2. Buat database baru dengan menjalankan *query* ini:
   ```sql
   CREATE DATABASE visceral_co;
   USE visceral_co;
   ```
3. Buka file `docs/schema.sql` (lewat menu *File* ➡️ *Open SQL Script...* di MySQL Workbench).
4. Klik tombol **Petir ⚡** (Execute) untuk menjalankan semua *script*.
5. Selesai! Semua tabel, data konser, dan akun otomatis masuk.

---

## ⚙️ Langkah 3: Menjalankan Backend (Server & API)
Backend kita menggunakan Node.js dan Express, dan wajib berjalan agar Frontend & Mobile bisa menarik data.

1. Buka terminal baru dan masuk ke folder *backend*:
   ```bash
   cd web/backend
   ```
2. Install semua *dependencies*:
   ```bash
   npm install
   ```
3. Jalankan *server* backend:
   ```bash
   npm run dev
   ```
*(Pastikan terminal ini tetap terbuka dan berjalan di port 3005)*

---

## 💻 Langkah 4: Menjalankan Frontend Web (React / Vite)
Frontend ini berisi tampilan untuk Customer (Beli Tiket) dan Dashboard Admin.

1. Buka terminal baru (biarkan terminal backend tetap hidup) dan masuk ke folder *frontend*:
   ```bash
   cd web/frontend
   ```
2. Install *dependencies*:
   ```bash
   npm install
   ```
3. Jalankan *website*:
   ```bash
   npm run dev
   ```
*(Buka link URL localhost yang muncul di terminal, biasanya `http://localhost:5173`)*

---

## 📱 Langkah 5: Menjalankan Aplikasi Mobile (React Native / Expo)
Aplikasi *mobile* ini digunakan khusus oleh Admin/Scanner untuk melakukan *scan* tiket QR Code di lapangan.

1. Buka terminal baru lagi dan masuk ke folder *mobile*:
   ```bash
   cd mobile
   ```
2. Install *dependencies*:
   ```bash
   npm install
   ```
3. Jalankan *bundler* Expo:
   ```bash
   npm start
   ```
4. Sebuah QR Code akan muncul di terminal.
5. **Cara Test:** 
   - Buka aplikasi **Expo Go** di HP kamu.
   - Scan QR Code tersebut (pengguna iPhone bisa pakai kamera bawaan).
   - Pastikan HP dan laptop terhubung ke jaringan WiFi/Internet yang sama!

---

### 💡 Catatan Penting
- Saat menjalankan project, **Backend wajib dinyalakan lebih dulu**, baru kemudian Frontend atau Mobile.
- Jika ada masalah tidak bisa *login* atau data tidak muncul, periksa konfigurasi URL di file `.env` (biasanya mengarah ke `http://localhost:3005`).

**Selamat Ngoding!** 🎸🔥
