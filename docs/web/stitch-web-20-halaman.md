# Stitch AI Brief — VISCERAL.CO (WEB, 20 Halaman)
Dokumen ini adalah brief siap-pakai untuk generate desain di **Stitch AI**, khusus platform **Web**. Terpisah dari brief Mobile (`stitch-mobile-15-halaman.md`) supaya masing-masing fokus ke constraint layar & pola navigasinya sendiri. Merujuk ke `design.md` untuk detail token warna/logo, dan `prd.md` untuk fitur/FR.

---

## 0. Rujukan Wajib Sebelum Generate — Konsistensi Logo & Brand

Logo yang sudah final (`visceral_co_logo_icon.png`): badge lingkaran **obsidian gelap**, di dalamnya monogram huruf **V** dibentuk dari dua blade emas yang bertemu di tengah bawah, masing-masing ujung atas blade ada **titik emas kecil**, dan garis **pulse/heartbeat oxblood** memotong horizontal di tengah — naik-turun tajam sebelum menyeberangi monogram lalu rata lagi di kedua sisi.

**Setiap halaman yang dibuat Stitch harus terasa seperti berasal dari 1 brand yang sama dengan logo ini** — bukan cuma taruh logo di pojok navbar. Cara paling gampang untuk konsisten:
- Garis pulse oxblood boleh dipakai berulang sebagai elemen dekoratif tipis (bukan cuma di logo) — misal sebagai divider section di Landing Page, atau accent tipis di card premium
- Sudut lancip blade logo (bukan rounded penuh) boleh jadi inspirasi bentuk aksen geometris kecil (bukan bentuk tombol utama, yang tetap rounded-2xl/pill sesuai prinsip desain)
- Dua titik emas di ujung blade bisa jadi inspirasi bullet/indicator dot kecil di UI (status dot, step indicator)

### Token Warna (wajib dipakai persis, jangan improvisasi warna baru)
| Token | Hex | Pemakaian |
|---|---|---|
| Obsidian | `#14110F` | navbar/sidebar aktif, footer, teks logo dark mode bg |
| Gold | `#C89B3C` (gradasi `#F0CE7A` → `#9C7A2E`) | CTA utama, badge VIP, harga, highlight aktif |
| Oxblood | `#7A2E2E` | aksen "visceral" tipis — live indicator, urgent status, garis dekoratif — **jangan dominan** |
| Base putih | `#FFFFFF` | background utama, formal & premium |
| Teks utama | `#211D1A` | bukan hitam pekat |
| Dark mode bg | `#0D0B0A` | surface card dark mode `#1A1613`, teks `#F3EFE9` |

### Tipografi & Prinsip Layout
- Sans-serif modern (Inter/Poppins), heading tebal, body regular
- Whitespace lega, rounded corners besar (pill/rounded-2xl), shadow lembut
- Style dasar: **modern, premium, clean**, sedikit "sangar" di aksen logo/CTA — bukan imut, bukan korporat kaku
- **Bahasa**: seluruh copy/label/tombol/pesan di UI pakai **Bahasa Indonesia saja** — tidak ada language switcher di navbar/sidebar manapun

### Tiga Mode UI di Web Ini — Perbedaan yang Harus Jelas Kelihatan
| Mode | Halaman | Vibe |
|---|---|---|
| **Publik/Landing** | #1 | Marketing, hero video, storytelling brand |
| **Customer (sudah login)** | #7–#15 | Consumer app premium ringan — mirip Traveloka/Tiket.com tapi lebih minimalis, gelap-emas hanya aksen, **navbar pill mengambang**, TIDAK ada dashboard/analytics |
| **Admin & Superadmin** | #16–#20 | Dashboard SaaS profesional (Linear/Notion vibe), **layout sidebar + topbar**, komponen **shadcn/ui**, data-dense tapi rapi |

Navbar pill (customer) vs sidebar (admin) **wajib beda total**, bukan variasi kecil — lihat `design.md` Bagian 4.

---

## 1. Landing Page *(Publik)*
**Tujuan**: konversi visitor jadi register, storytelling brand "Visceral" ke pengunjung baru.
- Navbar pill mengambang: `[Icon+Logo] | Home Explore Tentang Kontak | [Dark Mode] | Login | Register`
- Hero section: video/gambar konser full-bleed, headline besar, CTA gold "Jelajahi Event" — garis pulse oxblood sebagai elemen dekoratif tipis melintas di bawah headline (echo dari logo)
- Section list event unggulan: card horizontal-scroll atau grid, tiap card ada badge kategori/harga mulai dari
- Section "Kenapa Visceral.Co" — 3 kolom fitur singkat (real-time, e-tiket QR, verifikasi cepat)
- Footer obsidian solid, logo monokrom emas+obsidian
- **Animasi**: GSAP ScrollTrigger — reveal-on-scroll tiap section, parallax ringan di hero, efek 3D tilt halus di card event unggulan saat hover (mouse-based rotateX/rotateY tipis)

## 2. Login *(Semua role)*
- Card putih mengambang di tengah, shadow lembut, background sedikit gradient obsidian samar di tepi
- Field email/password, link "Lupa password?", tombol utama gold solid rounded-2xl
- Tab kecil di atas card kalau perlu bedakan "Login Customer" vs "Login Staff" (opsional, tergantung final flow admin)
- Ilustrasi vector kecil di sisi card (bukan foto orang generik) — tone gold/obsidian
- **Animasi**: Framer Motion — fade+slight scale saat card muncul

## 3. Register *(Customer)*
- Sama struktur card seperti Login, field: nama, email, no HP, password, konfirmasi password
- Indikator kekuatan password (bar kecil, warna oxblood→gold→hijau tipis sesuai kekuatan, jangan pakai warna di luar palet kalau bisa diakali dengan tone gold gradasi)
- Checkbox syarat & ketentuan
- CTA "Daftar" → lanjut ke halaman OTP

## 4. OTP Verification *(Semua role)*
Sesuai `design.md` Bagian 6 — ini halaman premium yang jadi salah satu penentu kesan pertama:
- Layout tengah, card putih shadow lembut mengambang
- 6 kotak input digit terpisah, auto-focus pindah otomatis, border aktif **gold**, animasi highlight halus saat digit terisi
- Teks kecil "Kode dikirim ke WhatsApp +62•••" (Fonnte) — beri konteks nomor mana yang dikirimi
- Countdown timer "Kirim ulang kode dalam 00:59", tombol resend disable sampai habis
- Ilustrasi vector kecil di atas card, senada brand
- **Animasi**: Framer Motion pada transisi digit terisi (scale pop halus)

## 5. Forgot Password *(Semua role)*
- Card sederhana, 1 field (email atau no HP), CTA "Kirim Kode Reset"
- Konsisten visual dengan Login/Register (card style sama)

## 6. Reset Password *(Semua role)*
- Card dengan field password baru + konfirmasi, indikator kekuatan password sama seperti Register
- CTA "Simpan Password Baru" → redirect ke Login dengan toast sukses

## 7. Explore/List Event *(Customer, sudah login)*
- Navbar pill versi login: `[Icon+Logo] | Explore Event My Tickets | [Dark Mode] | 🔔 | Avatar+Nama`
- Filter/search bar di atas (kategori, tanggal, lokasi) — pill style, bukan dropdown kaku
- Grid card event: banner, judul, tanggal, venue, harga mulai dari, badge "Sales Closed" kalau `salesClosed = true` (badge oxblood)
- **Tidak ada** elemen dashboard/analytics di sisi ini

## 8. Detail Event *(Customer)*
- Hero banner event full-width, judul & info venue/tanggal overlay
- Section daftar artis yang tampil (avatar bulat + nama, badge "Headliner" untuk artis utama)
- Section deskripsi event
- List kategori tiket (VIP/CAT1/CAT2 dst) dengan harga & sisa kuota, tombol "Pilih Tiket" per kategori
- Kalau `salesClosed = true` → tombol pesan **disable** dari sini, bukan baru gagal di checkout (badge jelas "Penjualan Ditutup")
- Peta lokasi venue kecil di bagian bawah (Leaflet/OSM)

## 9. Seat Map Selection *(Customer, Inovasi)*
- Visualisasi denah kursi per kategori — kursi `AVAILABLE` (netral), `LOCKED` (abu redup + timer kecil), `SOLD` (obsidian solid/disabled)
- Update real-time (Socket.io) — kalau ada kursi baru ke-lock/terjual, harus reflect tanpa refresh
- Panel ringkasan di samping/bawah: kursi terpilih + harga total, countdown lock 10 menit muncul jelas begitu kursi dipilih
- CTA "Lanjut Checkout"

## 10. Checkout & Ringkasan Order *(Customer)*
- Ringkasan: event, kategori/kursi, harga, total
- **Pilih metode bayar** — 2 opsi jelas dibedakan secara visual:
  - Transfer Manual (icon bank) — lanjut ke instruksi rekening + upload bukti
  - Bayar via Doku (Sandbox) — icon VA/QRIS/e-wallet, badge kecil "Sandbox" supaya jelas ini bukan transaksi asli
- Countdown `expiresAt` order ditampilkan jelas (bar/timer)
- CTA gold besar "Bayar Sekarang"

## 11. Upload Bukti Pembayaran / Pembayaran Doku *(Customer)*
Dua varian tampilan di 1 halaman (tergantung metode yang dipilih di #10):
- **Varian Manual**: instruksi rekening, drag-and-drop upload bukti transfer, preview gambar setelah upload, status "Menunggu Verifikasi"
- **Varian Doku**: embed/redirect ke halaman checkout Doku (iframe atau full redirect), setelah selesai kembali otomatis dengan status real-time (loading state elegan sambil nunggu webhook)

## 12. Order Sukses / Tiket Terbit *(Customer)*
- Ilustrasi/animasi sukses (checkmark gold besar, confetti tipis opsional)
- Ringkasan tiket + tombol "Lihat E-Tiket"
- **Animasi**: Framer Motion — animasi masuk checkmark (scale+fade)

## 13. My Tickets (List) *(Customer)*
- List/grid semua order: status badge jelas beda warna (PENDING abu, PAID gold, CANCELLED/EXPIRED oxblood muted)
- Tap/klik → Detail Tiket

## 14. Detail Tiket (QR + Peta Lokasi) *(Customer)*
- QR Code besar di tengah card premium (dark card obsidian dengan QR putih supaya scan jelas)
- Info event, kategori/kursi, nomor tiket
- Peta lokasi venue (Leaflet/OSM) di bawah QR
- Status tiket (ACTIVE/CHECKED_IN/CANCELLED) sebagai badge

## 15. Profil & Pengaturan Customer *(Customer)*
- Form edit profil (nama, no HP, foto), ganti password
- Toggle dark mode (UI Bahasa Indonesia saja, tidak perlu pilihan bahasa)
- Tombol logout dengan konfirmasi dialog

---

## 16. Dashboard Monitoring *(Admin & Superadmin)*
Mulai dari sini layout **berubah total ke sidebar + topbar**, komponen **shadcn/ui**:
- Sidebar kiri fixed collapsible: logo di atas, menu (Dashboard, Kelola Event, Verifikasi Pembayaran, Refund, Laporan, khusus Superadmin: Kelola User & Audit Log), bagian bawah sidebar foto profil+nama+role
- Topbar: search bar, dark mode toggle, notifikasi
- Grid card metrik (`shadcn/ui card`): total tiket terjual, revenue, okupansi %, live check-in count
- Chart (recharts dibungkus komponen `chart` shadcn) — tren penjualan per event/kategori
- Palet tetap Obsidian+Gold sebagai aksen chart, background dashboard tetap didominasi putih/abu muda (bukan gelap total)

## 17. Kelola Event (List + Form Create/Edit) *(Superadmin, Admin ikut sesuai RBAC)*
- Table (`shadcn/ui table`) daftar event: judul, tanggal, status (Draft/Published/Archived badge), sales closed toggle
- Tombol "Tutup Penjualan" per row — konfirmasi dialog (`shadcn/ui dialog`) sebelum eksekusi
- Form create/edit event dalam `dialog`/`sheet`: judul, deskripsi, tanggal, venue, upload banner, kategori tiket nested (tambah/hapus kategori + kuota), assign artis (multi-select)

## 18. Verifikasi Pembayaran & Refund *(Admin & Superadmin)*
- Table daftar order pending verifikasi: nomor order, customer, jumlah, metode bayar (badge beda untuk Manual vs Doku), bukti bayar (thumbnail klik untuk preview besar)
- Tombol Approve (gold)/Reject (oxblood outline) per row, dengan dialog konfirmasi
- Tab terpisah untuk daftar **Request Refund** (Inovasi) dengan alasan customer & tombol approve/reject
- Order dengan metode Doku otomatis PAID lewat webhook **tetap muncul di list** (read-only, badge "Terverifikasi Otomatis") supaya admin tetap punya visibilitas penuh

## 19. Kelola User & Audit Log *(Superadmin saja)*
- Table daftar user (Admin/Superadmin/Customer), filter per role, tombol tambah/hapus Admin
- Section Audit Log terpisah (tab atau halaman scroll bawah): table log aksi (siapa, aksi apa, kapan) — data dari model `AuditLog`
- Badge role jelas beda warna (Superadmin gold solid, Admin obsidian outline)

## 20. Laporan/Reports *(Superadmin saja)*
- Filter per event/tanggal/kategori di atas (pill filter, konsisten dengan Explore Event di sisi customer supaya brand terasa nyambung)
- Table hasil laporan + tombol export (CSV/PDF)
- Ringkasan angka besar di atas table (total revenue periode terpilih, dsb) memakai `shadcn/ui card`

---

## Catatan Penutup untuk Stitch AI
- Generate per halaman satu per satu, bukan sekaligus 20 — supaya tiap halaman bisa direview & disesuaikan token warnanya dulu sebelum lanjut
- Halaman #1–#15 (customer) dan #16–#20 (admin) **harus terasa seperti 2 "kulit" berbeda dari 1 brand yang sama** — logo, warna, tipografi identik, tapi kepadatan informasi & gaya layout beda jauh (consumer app vs dashboard SaaS)
