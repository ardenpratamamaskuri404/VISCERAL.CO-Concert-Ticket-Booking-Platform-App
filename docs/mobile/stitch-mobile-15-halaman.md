# Stitch AI Brief — VISCERAL.CO (MOBILE, 15 Halaman)
Brief siap-pakai untuk generate desain di **Stitch AI**, khusus platform **Mobile** (React Native + Expo). Terpisah dari brief Web (`stitch-web-20-halaman.md`). Fokus mobile ini: **customer journey lengkap** dari splash sampai tiket, dengan 1 layar tambahan untuk sisi staff/admin (scanner gate check-in) — bukan dashboard admin penuh, karena dashboard/analytics tetap di Web sesuai `design.md`.

---

## 0. Rujukan Wajib Sebelum Generate — Konsistensi Logo & Brand

Logo final (`visceral_co_logo_icon.png`): badge lingkaran **obsidian**, monogram **V** dari dua blade emas bertemu di tengah bawah, titik emas kecil di ujung atas tiap blade, garis **pulse/heartbeat oxblood** memotong horizontal di tengah monogram.

Di layar sekecil mobile, logo ini paling sering muncul dalam ukuran kecil (header, splash) — pastikan versi yang dipakai tetap jelas terbaca:
- **Splash Screen & App Icon**: pakai versi **monokrom emas+obsidian** (tanpa garis pulse oxblood) supaya tetap jelas di ukuran kecil — sesuai catatan `design.md` Bagian 1
- **Header layar penuh (mis. dalam card tiket)**: boleh pakai versi lengkap dengan garis pulse
- Garis pulse oxblood boleh jadi elemen dekoratif tipis berulang (misal divider halus antar section di Home), jangan cuma dipakai 1x di logo saja

### Token Warna (sama persis dengan Web — wajib konsisten lintas platform)
| Token | Hex | Pemakaian |
|---|---|---|
| Obsidian | `#14110F` | header dark mode, bottom nav aktif, splash bg |
| Gold | `#C89B3C` (gradasi `#F0CE7A` → `#9C7A2E`) | CTA utama, badge VIP, harga |
| Oxblood | `#7A2E2E` | badge urgent/live, aksen dekoratif tipis |
| Base putih | `#FFFFFF` | background utama |
| Teks utama | `#211D1A` | bukan hitam pekat |
| Dark mode bg | `#0D0B0A` | surface card `#1A1613`, teks `#F3EFE9` |

### Prinsip Layout Mobile
- Bottom tab navigation untuk customer (bukan sidebar/pill navbar seperti web) — tab utama: Home, My Tickets, Profil
- Rounded-2xl konsisten di semua card/button, shadow lembut, whitespace lega meski layar kecil
- Dark mode wajib didesain untuk tiap layar, bukan cuma light
- **Bahasa**: seluruh copy/label/tombol/pesan di UI pakai **Bahasa Indonesia saja** — tidak ada language switcher
- **Animasi**: Moti (setara Framer Motion) untuk transisi antar layar & micro-interaction; Lottie opsional untuk ilustrasi di Splash/Onboarding — jangan pakai efek scroll 3D berat ala GSAP web, mobile tetap ringan & cepat

---

## 1. Splash Screen *(Semua role)*
- Full-screen obsidian (`#14110F` atau dark mode `#0D0B0A`)
- Logo versi monokrom di tengah, sedikit animasi fade-in/scale halus (Moti) sebelum pindah ke Onboarding/Home
- Tanpa teks tambahan, biarkan logo jadi fokus penuh

## 2. Onboarding (3 Slide) *(Customer)*
- 3 slide swipe horizontal, tiap slide: ilustrasi vector simpel (tone gold/obsidian, bukan foto orang), headline singkat, deskripsi 1 kalimat
- Dot indicator progress di bawah (pakai aksen titik emas kecil, echo dari 2 titik di logo)
- Tombol "Lewati" pojok atas, CTA "Mulai" di slide terakhir → ke Register/Login

## 3. Register *(Customer)*
- Field: nama, email, no HP, password, konfirmasi password
- Indikator kekuatan password (gradasi gold, bukan warna di luar palet)
- Checkbox syarat & ketentuan, CTA gold besar "Daftar"
- Link kecil "Sudah punya akun? Login" di bawah

## 4. Login *(Semua role)*
- Field email/password, link "Lupa password?"
- CTA gold besar "Masuk"
- Tombol kecil di bawah untuk "Login sebagai Staff" (khusus admin, arahkan ke flow scanner — lihat #15) — dibedakan visual (outline, bukan solid gold) supaya jelas ini jalur berbeda

## 5. OTP Verification *(Semua role)*
Sesuai `design.md` Bagian 6, adaptasi mobile:
- 6 kotak input digit, keyboard numerik auto-muncul, auto-focus pindah otomatis
- Border aktif gold + animasi highlight halus (Moti) saat digit terisi
- Teks "Kode dikirim ke WhatsApp +62•••" (Fonnte)
- Countdown "Kirim ulang kode dalam 00:59", tombol resend disable sampai habis

## 6. Forgot Password / Reset Password *(Semua role)*
Gabungan 1 flow 2 step di layar yang sama (step indicator kecil di atas):
- Step 1: input email/no HP → kirim kode
- Step 2: input password baru + konfirmasi → CTA "Simpan"

## 7. Home / Explore Event *(Customer)*
- Header: logo kecil + ikon notifikasi + avatar
- Search/filter bar pill di atas (kategori, tanggal)
- List/carousel event unggulan (card besar dengan banner), lalu grid event lainnya di bawah
- Badge "Sales Closed" (oxblood muted) di card kalau `salesClosed = true`
- Bottom tab nav: Home (aktif, obsidian solid), My Tickets, Profil

## 8. Detail Event *(Customer)*
- Banner event full-width scrollable, judul & venue/tanggal overlay
- Section artis yang tampil (avatar horizontal-scroll, badge "Headliner")
- Deskripsi event (expand/collapse kalau panjang)
- List kategori tiket dengan harga & sisa kuota, tombol pilih per kategori
- Tombol pesan **disable** total kalau `salesClosed = true`, badge jelas di bagian atas
- Peta lokasi kecil di bagian bawah, tap untuk full-screen map

## 9. Checkout *(Customer)*
- Ringkasan: event, kategori/kursi terpilih, total harga
- Pilih metode bayar — 2 card jelas beda: **Transfer Manual** vs **Bayar via Doku (Sandbox)**, badge "Sandbox" kecil di opsi Doku
- Countdown `expiresAt` order (bar/timer jelas terlihat)
- CTA gold besar "Bayar Sekarang" sticky di bawah layar

## 10. Upload Bukti Pembayaran / Pembayaran Doku *(Customer)*
Dua varian (tergantung metode dari #9):
- **Manual**: instruksi rekening (copy-to-clipboard nomor rekening), tombol ambil foto/upload dari galeri, preview setelah upload, status "Menunggu Verifikasi"
- **Doku**: buka **WebView** ke halaman checkout Doku (redirect dari backend), loading state elegan setelah kembali sambil nunggu konfirmasi webhook real-time (Socket.io)

## 11. Order Sukses *(Customer)*
- Ilustrasi/animasi checkmark gold besar (Moti scale+fade), teks "Pesanan Berhasil!"
- Ringkasan singkat + tombol "Lihat E-Tiket"

## 12. My Tickets (List) *(Customer)*
- List card semua order: badge status beda warna (PENDING abu, PAID gold, CANCELLED/EXPIRED oxblood muted)
- Tap → Detail Tiket
- Bottom tab nav aktif di "My Tickets"

## 13. Detail Tiket (QR + Peta) *(Customer)*
- Card besar dark obsidian di tengah, QR code putih besar di dalamnya (kontras jelas untuk scan)
- Info event, kategori/kursi, nomor tiket, badge status (ACTIVE/CHECKED_IN/CANCELLED)
- Peta lokasi venue di bawah card, tombol "Buka di Maps"

## 14. Profil & Pengaturan *(Customer)*
- Foto profil, nama, no HP (edit), ganti password
- Toggle dark mode (UI Bahasa Indonesia saja, tidak perlu switcher bahasa)
- Tombol logout dengan dialog konfirmasi
- Bottom tab nav aktif di "Profil"

## 15. Login Staff → Scanner Gate Check-In *(Admin, Inovasi)*
Gabungan 1 flow untuk sisi staff, cukup 1 layar spec dengan 3 state jelas (bukan halaman terpisah-pisah):
- **State kamera aktif**: viewfinder kamera full-screen, frame target QR di tengah, tombol kecil "Input Manual" di bawah (fallback kalau kamera error)
- **State hasil scan berhasil**: overlay hijau + ikon check besar + info singkat tiket (nama event, kategori) — auto-dismiss balik ke kamera setelah beberapa detik
- **State hasil scan ditolak**: overlay merah/oxblood + ikon silang + alasan singkat (tiket sudah dipakai / tidak valid)
- Layout ini sengaja dibuat minimal & fungsional (bukan premium consumer-app), karena dipakai petugas di lapangan — prioritas kecepatan baca, bukan estetika

---

## Catatan Penutup untuk Stitch AI
- Generate per layar satu per satu untuk review token warna & spacing sebelum lanjut ke layar berikutnya
- Layar #1–#14 harus terasa seperti 1 aplikasi consumer premium yang konsisten; layar #15 (staff) boleh sedikit lebih "utilitarian" karena konteks pemakaiannya beda (dipegang petugas gate, bukan penonton santai browsing)
- Semua ilustrasi custom (Onboarding, Splash) pakai gaya vector simpel bertone gold/obsidian — hindari foto stok generik supaya brand tetap terasa premium & khas
