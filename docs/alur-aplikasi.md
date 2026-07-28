# Alur Aplikasi — VISCERAL.CO
Dokumen ini **beda** dari `workflow.md`:
- `workflow.md` = alur kerja developer/AI saat *membangun* sistem (proses development)
- `alur-aplikasi.md` (dokumen ini) = alur pemakaian **aplikasinya sendiri** — langkah demi langkah yang dilalui customer & admin saat pakai sistem, dipetakan langsung ke FR di `prd.md` supaya tidak ada langkah yang "mengarang" di luar requirement

---

## 1. Alur Customer (Mobile & Web)

Lihat diagram di atas (bagian customer). Urutan lengkap beserta rujukan FR:

1. **Register / Login** — FR-01
2. **Verifikasi OTP WhatsApp (Fonnte)** — sebelum akun aktif penuh (register) atau saat login dari device baru — FR-01 `(Inovasi)`
3. **Jelajah Event** — lihat daftar & detail konser (termasuk artis yang tampil) — FR-03
4. **Pilih Kategori Tiket** — FR-03 (level kursi spesifik = tambahan inovasi)
5. **Checkout** — ringkasan pesanan, pilih metode bayar — FR-04
   - **Jalur A — Transfer Manual** (baseline wajib soal): tampil instruksi rekening → lanjut ke langkah 6
   - **Jalur B — Doku Sandbox** (VA/QRIS/e-wallet, `(Inovasi)`): redirect/WebView ke halaman checkout Doku → customer bayar (data sandbox) → **tidak perlu upload bukti**, status order berubah otomatis lewat webhook (lompat ke langkah 7 "Disetujui" otomatis, tanpa admin manual)
6. **Upload Bukti Bayar** (hanya Jalur A) — FR-04
7. **Verifikasi Pembayaran**:
   - **Jalur A**: Verifikasi Admin manual (di luar kendali customer, tapi bagian dari alur yang sama) — FR-04
   - **Jalur B**: Webhook Doku diverifikasi backend (signature HMAC) — otomatis, real-time via Socket.io ke customer
   - **Disetujui/Sukses** → E-Tiket terbit, QR Code tampil — FR-04
   - **Ditolak/Gagal** → Order dibatalkan, customer bisa lihat status di Riwayat Pesanan — FR-05b

**Titik keputusan penting** (harus eksplisit ditangani di kode, bukan diasumsikan):
- Kalau kuota kategori tiket habis saat customer klik checkout → tolak dengan pesan jelas, jangan biarkan lanjut ke pembayaran (NFR-01)
- Kalau event sudah `salesClosed = true` → tombol pesan tiket disable dari halaman Detail Event, bukan baru ditolak pas checkout (FR-02d)
- Kalau bukti bayar tidak diupload sampai `expiresAt` → order otomatis EXPIRED (berlaku juga untuk Jalur B kalau customer tidak menyelesaikan pembayaran Doku sampai batas waktu)
- Webhook Doku yang datang **tanpa signature valid** harus ditolak/diabaikan — jangan pernah mengubah status order hanya berdasar payload mentah tanpa verifikasi
- Semua perubahan status order (approve/reject/webhook sukses) wajib broadcast lewat Socket.io ke room customer terkait, supaya customer tidak perlu refresh manual

---

## 2. Alur Admin & Superadmin

Lihat diagram di atas (bagian admin). Urutan lengkap beserta rujukan FR:

1. **Login** — FR-01
2. **Kelola Event, Kategori Tiket, Artis** — FR-02, FR-02b, FR-02c (termasuk tutup penjualan tiket, FR-02d)
3. **Lihat Daftar Pesanan** — semua order dari semua customer — FR-04
4. **Verifikasi Pembayaran** — approve/reject per order — FR-04
5. **Dashboard** — jumlah tiket terjual per event/kategori — FR-07

**Catatan role**: kalau pakai versi sederhana (1 role Admin sesuai soal asli), semua langkah di atas dilakukan 1 role yang sama. Kalau pakai versi Superadmin+Admin (inovasi), pembagian aksesnya mengikuti RBAC Matrix di `prd.md` Bagian 4.

---

## 3. Alur Sistem/Data (State Machine)

Ini bagian yang paling gampang "halu" kalau gak digambarkan eksplisit — status apa berubah jadi apa, dan siapa/apa yang men-trigger-nya.

### 3.1 Status Order
```
PENDING ──(Jalur A: customer upload bukti bayar + admin approve)──> PAID
PENDING ──(Jalur B: webhook Doku sukses, signature valid)──> PAID          (Inovasi)
PENDING ──(admin reject / webhook Doku gagal)──> CANCELLED
PENDING ──(lewat expiresAt tanpa bukti bayar / tanpa pembayaran Doku)──> EXPIRED
```
> Baik Jalur A maupun Jalur B **wajib** memanggil fungsi service yang sama (`approveOrder()`) supaya efek sampingnya (generate tiket, decrement kuota, broadcast Socket.io) konsisten — lihat catatan di Bagian 3.3.

### 3.2 Status Kursi/Kuota (Seat)
```
AVAILABLE ──(customer pilih, jika pakai seat-map inovasi)──> LOCKED
LOCKED ──(order terkait jadi PAID)──> SOLD
LOCKED ──(lock expired / order CANCELLED-EXPIRED)──> AVAILABLE (kembali)
```

### 3.3 Status Tiket (Ticket)
```
ACTIVE ──(admin approve order)──> [tiket dibuat, status ACTIVE]
ACTIVE ──(admin scan QR di gate, inovasi)──> CHECKED_IN
ACTIVE ──(refund disetujui, inovasi)──> CANCELLED
```

> Semua transisi di atas **wajib** diimplementasi lewat 1 sumber logic saja (misal service function `approveOrder()`, `rejectOrder()`) — jangan biarkan AI/developer menulis logic pengubah status yang sama di banyak tempat dengan kondisi berbeda-beda, itu salah satu penyebab paling umum sistem jadi tidak konsisten dengan requirement.

---

## 4. Cara Pakai Dokumen Ini Bareng `workflow.md`

Saat mau kerjakan 1 fitur pakai AI assistant:
1. Cek di dokumen ini **di titik mana** fitur itu ada dalam alur (customer/admin/state machine)
2. Cek di `prd.md` FR mana yang jadi rujukannya
3. Baru ikuti langkah-langkah di `workflow.md` (tempelkan potongan dokumen, minta AI konfirmasi paham dulu, generate per potongan kecil, dst)

Dengan begitu AI tahu **fitur itu dari alur langkah keberapa**, bukan cuma tahu "bikin endpoint X" tanpa konteks dia nyambung ke apa.
