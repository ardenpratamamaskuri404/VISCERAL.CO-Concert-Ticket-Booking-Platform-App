# Design Notes — VISCERAL.CO
Terpisah dari `prd.md` — file ini khusus arahan visual/UI, dipakai sebagai brief untuk generate desain di **Stitch AI**.

---

## 0. Brand — VISCERAL.CO
**Dibaca**: Visceral dot Ko

**Filosofi nama**: ".Co" bukan sekadar singkatan "Company" — tapi merangkum tiga makna sekaligus:
- **Co-op** — kerja sama antar tim (superadmin, admin, dan customer sama-sama bagian dari satu ekosistem)
- **Co-creators** — dua pihak pencipta pengalaman (penyelenggara acara & penonton)
- **Connection** — koneksi emosional yang dirasakan langsung (visceral = dirasakan di dalam, bukan cuma dilihat)

Simple, premium, dan gampang diingat — nama ini jadi acuan seluruh arahan visual di bawah.

---

## 1. Logo & Icon

Ikon di samping wordmark "VISCERAL.CO" — konsep yang disarankan (lihat visual yang sudah digenerate di chat):

- **Bentuk dasar**: badge/emblem lingkaran gelap (obsidian), bukan kotak — kesan lebih premium & timeless dibanding logo app kotak generik
- **Monogram di dalamnya**: huruf **V** dibentuk dari dua "blade" (bilah tajam) berwarna emas yang saling bertemu di tengah bawah — dua blade ini melambangkan **dua co-creator** (poin ".Co" di nama brand), sekaligus terlihat tajam/sangar tanpa jadi agresif
- **Garis pulse/heartbeat** (warna oxblood/merah gelap) melintang horizontal di tengah emblem, memotong monogram — ini representasi visual dari kata **"Visceral"**: sesuatu yang dirasakan sampai ke "denyut", bukan cuma estetika permukaan. Detail ini juga yang bikin logo terasa hidup, bukan monogram statis biasa
- **Dua titik emas kecil** di ujung atas masing-masing blade — aksen kecil yang memperkuat makna "dua pihak yang terhubung"
- **Kenapa ini cocok**: garis tajam + palet gelap+emas = kesan elegan tapi tetap "sangar" (bukan imut/playful), sementara pulse merah menjaga ikon tidak terasa terlalu kaku/korporat — ada sisi emosional yang sesuai nama Visceral

> Gunakan versi monokrom (emas+obsidian saja, tanpa oxblood) untuk kebutuhan kecil seperti favicon/app icon supaya tetap jelas di ukuran kecil; versi lengkap dengan garis pulse dipakai di navbar, splash screen, dan materi marketing.

---

## 2. Palet Warna — Disesuaikan Nama "VISCERAL.CO"

Karena nama berubah dari nuansa "harmoni/hijau" ke **visceral** (mentah, dirasakan, intens), palet ikut disesuaikan supaya konsisten dengan logo di atas.

### Opsi A — Obsidian + Gold + Oxblood *(disarankan, senada logo)*
- Primary/dasar gelap: **Obsidian `#14110F`** — dipakai di navbar/sidebar aktif, footer, elemen premium
- Accent utama: **Gold `#C89B3C`** (atau gradasi `#F0CE7A` → `#9C7A2E`) — CTA utama, badge VIP, highlight harga
- Accent sekunder (dipakai tipis, jangan dominan): **Oxblood `#7A2E2E`** — status urgent/live indicator, aksen "visceral" di elemen tertentu (mis. label "Live Check-in")
- Neutral/base halaman: tetap **putih `#FFFFFF`** untuk formalitas, teks utama abu gelap hangat `#211D1A` (bukan hitam pekat)
- Dark mode: background `#0D0B0A`, surface card `#1A1613`, teks `#F3EFE9`, gold tetap jadi accent utama

### Opsi B — Emerald + Gold *(alternatif, kalau mau kesan lebih tenang)*
- Primary: Emerald `#0F6E4F`, Accent: Gold `#C89B3C`, neutral putih — opsi ini sisa dari eksplorasi nama sebelumnya (Harmoni), masih valid kalau ingin nuansa lebih kalem, tapi kurang match ke konsep "Visceral" yang lebih tajam/intens

> Rekomendasi: **Opsi A (Obsidian + Gold + Oxblood)** — paling konsisten dengan filosofi nama dan ikon di atas, tetap premium & formal (bukan gelap total), tanpa masuk ke ungu/pink.

---

## 3. Konsep Dasar Layout
- Background utama tetap **putih, formal, premium** — obsidian/gold dipakai sebagai aksen (navbar, tombol, badge), bukan warna dominan di seluruh halaman
- Ada **toggle Dark Mode** di navbar (icon bulan/matahari) — versi dark tetap wajib didesain
- Alur tampilan berubah total tergantung status login & role:
  - **Belum login** → Landing Page (marketing, hero video, CTA login/register)
  - **Sudah login sebagai Customer** → tampilan app-like, navbar atas dengan profile, **tanpa** dashboard monitoring/analytics
  - **Sudah login sebagai Admin/Superadmin** → layout sidebar, ada dashboard monitoring & analytics, profile+nama tampil di sidebar (bukan navbar atas)

---

## 4. Navbar Modern — Pill Style (Referensi Gambar)

Navbar yang dimaksud: **floating pill navbar**, bukan navbar bar panjang biasa.

Struktur (adaptasi ke tema terang/putih, referensi gambar dasarnya dark):
- Container luar: pill besar, melayang (floating, ada shadow lembut), posisi sticky di tengah-atas atau kiri-atas
- Di dalam container ada 1 pill "track" berisi menu item sejajar (Home, Explore Event, dst)
- **State hover**: item mendapat background pill putih terang (elevated, sedikit shadow)
- **State selected/active** (halaman yang sedang dibuka): pill dengan background **obsidian solid** (sesuai Opsi A) + teks emas/putih — kontras jelas dari item lain
- Untuk versi light theme: track pill pakai abu-abu muda (`gray-100`), hover pakai putih solid + shadow tipis, active/selected pakai obsidian

### 4.1 Navbar — Customer (belum login / landing)
`[Icon+Logo VISCERAL.CO] | Home  Explore  Tentang  Kontak | [Toggle Dark Mode] | Login | Register`

### 4.2 Navbar — Customer (sudah login)
`[Icon+Logo] | Explore Event  My Tickets | [Toggle Dark Mode] | 🔔 Notifikasi | Avatar + Nama (dropdown: Profil, Pengaturan, Logout)`
- **Tidak ada** menu dashboard/analytics di sini — customer hanya lihat event & tiket miliknya
- Avatar + nama customer tampil di ujung kanan navbar (pill kecil, bisa diklik jadi dropdown)

### 4.3 Sidebar — Admin & Superadmin
Layout berubah total jadi **sidebar + topbar**, bukan navbar pill mengambang:
- Sidebar kiri (fixed, collapsible): Icon+Logo di atas, lalu menu (Dashboard, Kelola Event, Verifikasi Pembayaran, Refund, Laporan, khusus Superadmin: Kelola User & Audit Log)
- Bagian **bawah sidebar**: foto profil + nama + role admin/superadmin, dengan menu kecil (Pengaturan, Logout)
- Topbar atas (di area konten, bukan sidebar): search bar, toggle dark mode, notifikasi
- Dashboard monitoring/analytics (revenue, okupansi, live check-in count) **hanya muncul di sini**, tidak pernah di sisi customer

---

## 5. Fitur Tambahan di Navbar/Topbar

### 5.1 Dark Mode
- Icon toggle matahari/bulan, transisi smooth antar tema, preferensi disimpan per user

### 5.2 Bahasa — Indonesia Saja
- UI (web & mobile) menggunakan **Bahasa Indonesia saja**, tidak perlu language switcher/toggle bahasa di navbar/sidebar/topbar
- Konten dinamis (deskripsi event, dsb) juga diinput & ditampilkan dalam Bahasa Indonesia — tidak perlu integrasi auto-translate

### 5.3 Lokasi/Maps
- Ditampilkan di halaman **Detail Tiket** — pin lokasi venue konser
- Rekomendasi: **Leaflet.js + OpenStreetMap** (gratis, tanpa API key) atau **Google Maps Embed/JavaScript API** (lebih familiar, perlu API key + billing)
- Mobile: `react-native-maps`

---

## 6. Halaman OTP (Premium Style)
- Layout tengah, card putih dengan shadow lembut mengambang
- 6 kotak input digit terpisah, auto-focus pindah otomatis
- Warna kotak aktif: border gold (sesuai Opsi A), animasi highlight halus saat digit terisi
- Countdown timer "Kirim ulang kode dalam 00:59" + tombol resend disable sampai countdown habis
- Ilustrasi kecil di atas — pakai ilustrasi vector simpel senada warna brand, bukan foto orang generik

---

## 7. Daftar Halaman — Web (Brief untuk Stitch AI, maks 20)

| # | Halaman | Untuk Role |
|---|---|---|
| 1 | Landing Page (hero video, list event unggulan) | Publik |
| 2 | Login | Semua role |
| 3 | Register | Customer |
| 4 | OTP Verification | Semua role |
| 5 | Forgot Password | Semua role |
| 6 | Reset Password | Semua role |
| 7 | Explore/List Event | Customer |
| 8 | Detail Event | Customer |
| 9 | Seat Map Selection | Customer |
| 10 | Checkout & Ringkasan Order | Customer |
| 11 | Upload Bukti Pembayaran | Customer |
| 12 | Order Sukses / Tiket Terbit | Customer |
| 13 | My Tickets (list) | Customer |
| 14 | Detail Tiket (QR + Peta Lokasi) | Customer |
| 15 | Profil & Pengaturan Customer | Customer |
| 16 | Dashboard Monitoring (revenue, okupansi, live check-in) | Admin & Superadmin |
| 17 | Kelola Event (list + form create/edit) | Superadmin |
| 18 | Verifikasi Pembayaran & Refund | Admin & Superadmin |
| 19 | Kelola User & Audit Log | Superadmin |
| 20 | Laporan/Reports (export, filter per event) | Superadmin |

---

## 8. Daftar Halaman — Mobile (Brief untuk Stitch AI, maks 20)

| # | Layar | Untuk Role |
|---|---|---|
| 1 | Splash Screen | Semua role |
| 2 | Onboarding (3 slide singkat) | Customer |
| 3 | Login | Semua role |
| 4 | Register | Customer |
| 5 | OTP Verification | Semua role |
| 6 | Forgot Password | Semua role |
| 7 | Home/Explore Event | Customer |
| 8 | Detail Event | Customer |
| 9 | Seat Map (adaptasi mobile) | Customer |
| 10 | Checkout | Customer |
| 11 | Upload Bukti Pembayaran | Customer |
| 12 | Order Sukses | Customer |
| 13 | My Tickets (list) | Customer |
| 14 | Detail Tiket (QR + Peta) | Customer |
| 15 | Profil & Pengaturan | Customer |
| 16 | Login Staff (Admin/Superadmin) | Admin/Superadmin |
| 17 | Scanner Gate Check-In (kamera aktif) | Admin |
| 18 | Hasil Scan — Berhasil (indikator hijau) | Admin |
| 19 | Hasil Scan — Ditolak (indikator merah) | Admin |
| 20 | Input Manual Kode Tiket (fallback kamera error) | Admin |

---

## 9a. Komponen UI & Library Animasi (Web)

Fokus tahap ini: **UI web & mobile dulu**, sebelum integrasi backend penuh.

### Dashboard Admin/Superadmin — shadcn/ui
- Semua elemen data-dense (table pesanan, form CRUD event/kategori/artis, dialog verifikasi, chart dashboard) pakai **shadcn/ui** di atas Tailwind: `table`, `card`, `dialog`, `dropdown-menu`, `tabs`, `sidebar`, `badge`, `button`, `sonner` (toast notifikasi)
- Chart revenue/okupansi: bungkus **recharts** dengan wrapper style shadcn (`chart` component) supaya konsisten dengan palet Obsidian+Gold di Bagian 2
- Sidebar admin (Bagian 4.3) dibangun dari komponen `sidebar` shadcn, bukan custom dari nol — lebih cepat dan konsisten aksesibilitasnya

### Sisi Customer — tetap ringan, jangan pakai shadcn penuh
- Halaman customer (Explore, Detail Event, Checkout, My Tickets) tetap custom Tailwind + komponen ringan sendiri, supaya terasa seperti consumer app premium, bukan template dashboard SaaS

### Animasi & Micro-interaction — Framer Motion
- Dipakai di **semua halaman customer & auth**: transisi masuk/keluar halaman (`AnimatePresence`), animasi card event saat hover/tap, animasi buka-tutup modal/drawer, animasi digit terisi di halaman OTP (Bagian 6)
- Prinsip: durasi singkat (150–300ms), easing halus (`ease-out`), jangan animasikan semua elemen sekaligus — cukup elemen yang jadi fokus interaksi

### Scroll Effect & Efek 3D — GSAP (ScrollTrigger)
- **Khusus dipakai di Landing Page** (halaman publik sebelum login):
  - Reveal-on-scroll untuk section fitur & list event unggulan (fade + translateY halus)
  - Parallax ringan pada hero video/banner
  - Efek 3D tilt (perspective + rotateX/rotateY berdasar posisi mouse) pada card event unggulan — dipakai tipis, jangan berlebihan supaya tetap terasa "premium" bukan gimmick
- **Jangan** dipakai di halaman app-like (Explore setelah login, Checkout, My Tickets, Dashboard Admin) — halaman ini prioritas kecepatan & kejelasan data, bukan showcase animasi

### Mobile — padanan native
- Animasi transisi & micro-interaction: **Moti** (di atas `react-native-reanimated`), API-nya sengaja mirip Framer Motion supaya development terasa konsisten dengan web
- Ilustrasi animasi (Onboarding, Splash Screen): **Lottie** (`lottie-react-native`), opsional

---

## 9. Ringkasan Prinsip Desain (untuk prompt Stitch AI)
- Style: **modern, premium, clean**, sedikit "sangar" di aksen logo/CTA, banyak whitespace, rounded corners besar (pill/rounded-2xl), shadow lembut
- Tipografi: sans-serif modern (misal Inter/Poppins), heading tebal, body regular
- Customer-facing = ringan, seperti consumer app premium (Traveloka/Tiket.com vibe tapi lebih minimalis & gelap-emas di aksen)
- Admin/Superadmin-facing = seperti dashboard SaaS profesional (Linear/Notion vibe), dibangun dari **shadcn/ui**, sidebar + data-dense tapi tetap rapi
- Warna dominan tetap putih, obsidian+gold+oxblood hanya sebagai aksen (bukan warna block besar-besar)
- Interaksi & transisi halus pakai **Framer Motion** (web) / **Moti** (mobile); efek scroll & 3D tipis di Landing Page pakai **GSAP ScrollTrigger** — lihat Bagian 9a untuk detail pemakaian per halaman
