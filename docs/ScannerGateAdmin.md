# Fitur Scanner Gate Admin (Check-in Tiket)

Fitur **Scanner Gate** adalah penjaga gawang utama saat hari-H konser. Fitur ini memastikan bahwa setiap QR Code yang dibawa oleh penonton adalah **Asli**, **Sah**, dan **Belum Pernah Digunakan**.

## 🚀 Alur Kerja Terintegrasi (3 Role)

### 1. Customer (Penonton)
- Customer membuka halaman **Tiket Saya** di HP mereka saat antre di depan gerbang masuk (Gate) stadion.
- Layar HP mereka menampilkan **QR Code** unik (misal: `QR-VSC-20260730-3268`).
- Customer hanya tinggal menempelkan layar HP-nya ke alat *scanner* milik Admin.

### 2. Admin (Petugas Gate/Scanner)
- Admin login ke web VISCERAL dan membuka menu baru: **Scanner Gate**.
- Admin men-scan QR Code customer (di web ini, kita akan membuat kolom ketik/tempel kode sebagai simulasi alat *scanner* sungguhan).
- **Sistem akan langsung mendeteksi:**
  - ✅ **Lolos (Hijau):** Jika tiket berstatus `ACTIVE`. Sistem akan menyambut "Selamat Datang" dan tiket otomatis berubah menjadi `CHECKED_IN` (Sudah Masuk).
  - ❌ **Ditolak (Merah - Tiket Hangus):** Jika ada orang nakal yang mem-fotokopi/screenshot QR code temannya. Sistem akan teriak: *"GAGAL! Tiket ini sudah di-scan pada jam 19:05"*.
  - ❌ **Ditolak (Merah - Palsu):** Jika QR Code tersebut adalah hasil editan photoshop (kodenya tidak ada di database).

### 3. Superadmin (Pemantau/Manajer)
- Duduk tenang di ruangan ber-AC melihat **Dashboard Monitoring**.
- Setiap kali ada Admin yang sukses men-scan tiket, angka "Live Check-in Count" di dashboard Superadmin akan bertambah secara *real-time*.
- Superadmin bisa melihat histori (Audit Log) detail: *"Admin A baru saja men-scan tiket milik Dandi pada jam 19:10"*.

---

## 🛠️ Rencana Eksekusi (Yang Akan Saya Buat)
1. **Membuat Halaman `AdminScannerPage.jsx`**: Layar khusus berdesain gelap-emas dengan input kode tiket yang super responsif (bisa diketik atau ditempel).
2. **Menambahkan Menu Sidebar**: Menaruh tombol "Scanner Gate" di sidebar sebelah kiri Admin.
3. **Membuat API Backend `/checkin`**: Sistem cerdas di database yang bertugas mengecek keaslian tiket dan mencegah tiket ganda (double-scan).
4. **Update Status Real-time**: Mengubah status tiket di HP customer dari `ACTIVE` menjadi `CHECKED_IN` seketika.
