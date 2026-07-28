# PRD — VISCERAL.CO (web-visceral-co)
### Product Requirement Document — Aplikasi Pemesanan Tiket Konser Berbasis Web & Mobile
Versi: 3.0 (Disesuaikan dengan Ketentuan Tugas Resmi) | Update: 28 Juli 2026

---

## 1. Overview & Vision

**VISCERAL.CO** adalah sistem pemesanan tiket konser end-to-end yang mencakup:
- Web Admin — kelola event/konser, kategori tiket, artis, verifikasi pembayaran, dashboard penjualan
- Mobile Pelanggan — jelajah konser, pesan tiket, riwayat pesanan, e-tiket QR

**Problem Statement**: Sistem ticketing konser konvensional rawan kesalahan kuota tiket, verifikasi pembayaran manual yang lambat/tidak transparan, dan minimnya visibilitas admin terhadap penjualan per kategori tiket.

**Goal**: Membangun sistem pemesanan tiket yang datanya konsisten (kuota tidak jebol), proses verifikasi pembayaran cepat, dan admin punya kendali penuh atas siklus hidup penjualan (buka → tutup penjualan).

**Metodologi**: Agile — Scrum dengan sprint 1-2 minggu, backlog berbasis Epic & User Story, ada Definition of Done per fitur.

**Catatan penting**: PRD ini disusun berdasarkan **ketentuan resmi tugas/ujian** (lihat Bagian 2) sebagai kebutuhan minimal wajib. Di luar itu, ditambahkan sejumlah **fitur inovasi** (seat-map real-time, refund, audit log, dsb) yang secara eksplisit diperbolehkan dan dinilai sebagai poin tambahan besar oleh soal aslinya — semua fitur inovasi ditandai `(Inovasi)` di seluruh dokumen ini supaya jelas mana yang wajib dan mana yang nilai plus.

---

## 2. Pemetaan Ketentuan Tugas Resmi → Fitur Sistem

### 2.1 Fitur Web (Admin) — sesuai soal

| Ketentuan Soal | Dipenuhi di PRD ini | Keterangan |
|---|---|---|
| Login | ✅ FR-01 | |
| CRUD Event/Konser | ✅ FR-02 | |
| CRUD Kategori Tiket (VIP, dll) | ✅ FR-02b | |
| CRUD Penyanyi/Artis | ✅ FR-02c | **Ditambahkan** — belum ada di draft sebelumnya |
| Melihat daftar pesanan | ✅ FR-04 | |
| Verifikasi pembayaran | ✅ FR-04 | |
| Dashboard jumlah tiket terjual | ✅ FR-07 | Diperluas jadi dashboard revenue+okupansi `(Inovasi)` |
| Kuota tiket per kelas/kategori | ✅ FR-02b | Direpresentasikan via `totalSeats`/kuota pada `TicketCategory` |
| Menutup penjualan tiket | ✅ FR-02d | **Ditambahkan** — belum ada di draft sebelumnya |

### 2.2 Fitur Mobile (Pelanggan) — sesuai soal

| Ketentuan Soal | Dipenuhi di PRD ini | Keterangan |
|---|---|---|
| Register/Login | ✅ FR-01 | |
| Melihat daftar konser | ✅ FR-03 | |
| Detail konser | ✅ FR-03 | |
| Memilih kelas tiket | ✅ FR-03 | Sistem ini implementasi sampai level **kursi spesifik**, bukan cuma kelas `(Inovasi)` — tetap mundur kompatibel: pelanggan tetap bisa dianggap "memilih kelas" lalu sistem alokasikan kursi otomatis kalau mau versi lebih simpel |
| Memesan tiket | ✅ FR-04 | |
| Melihat riwayat pesanan | ✅ FR-05b | |
| Melihat QR Code tiket *(bonus opsional di soal)* | ✅ FR-04 | Sudah diimplementasikan penuh, bukan opsional lagi di sistem ini |

### 2.3 Ketentuan Teknis — sesuai soal

| Ketentuan Soal | Dipenuhi di PRD ini |
|---|---|
| Membuat ERD dan relasi database | ✅ Bagian 6 |
| Tabel saling berelasi | ✅ Bagian 6 |
| Menggunakan REST API | ✅ Bagian 7 (Hono) |
| Semua data tersimpan di database | ✅ MySQL + Prisma |
| Validasi input wajib | ✅ NFR-03, Zod di semua endpoint |
| Upload source code ke GitHub | ✅ Bagian 11 (Deliverables) |

---

## 3. Tech Stack

### 3.1 Backend
- Runtime/Framework: **Hono** (REST API)
- ORM: **Prisma**
- Database: **MySQL**
- Auth: JWT (access token + refresh token disarankan)
- **Realtime — dipakai (bukan sekadar opsional)**: **Socket.io** (server nempel di server Hono via adapter Node `@hono/node-server` + `socket.io`), fallback polling `setInterval` 5 detik kalau koneksi socket gagal. Dipakai untuk:
  - Update status kursi (`AVAILABLE`/`LOCKED`/`SOLD`) real-time di Seat Map — broadcast per `room` = `eventId`
  - Update status order (PENDING → PAID/CANCELLED/EXPIRED) real-time ke customer yang lagi nunggu verifikasi
  - Update live check-in count di Dashboard Admin
- **Payment Gateway — Doku (Sandbox)**: integrasi **Doku Checkout / Payment Gateway API** (sandbox environment) untuk pembayaran otomatis, melengkapi alur upload bukti transfer manual (baseline wajib soal) — lihat detail di **Bagian 3.6**
- **OTP Gateway — Fonnte**: pengiriman kode OTP via WhatsApp API **Fonnte** untuk verifikasi register/login & reset password — lihat detail di **Bagian 3.7**
- File storage: bukti transfer & banner event (lokal/dev, disarankan S3-compatible untuk produksi — mis. Cloudflare R2/MinIO)

### 3.2 Frontend Web — Customer & Admin (React + Vite)

Dipakai untuk **kedua sisi** (Customer web & Admin/Superadmin), satu base stack, beda set komponen UI (lihat `design.md` Bagian 3 & 9):

- Framework: React 18 + Vite (.jsx/.tsx)
- Routing: react-router-dom v6
- HTTP Client: axios
- Realtime client: **socket.io-client** (connect ke namespace/room sesuai `eventId` atau `orderId`)
- QR Generator: qrcode.react
- Styling dasar: Tailwind CSS + lucide-react
- **UI Komponen Dashboard Admin**: **shadcn/ui** (table, dialog, dropdown-menu, card, tabs, sidebar, chart wrapper) — dipilih karena headless + gampang di-custom ke tema Obsidian+Gold di `design.md`, cocok untuk data-dense dashboard (bukan dipakai penuh di sisi customer supaya tetap terasa "app premium", bukan generik SaaS)
- **Animasi & Micro-interaction**: **Framer Motion** (`motion`) — dipakai untuk transisi antar halaman, hover/tap state pada card event & tombol CTA, animasi buka/tutup dialog & drawer
- **Scroll Effect & 3D Landing Page**: **GSAP** + plugin **ScrollTrigger** (dan **ScrollSmoother** kalau perlu smooth-scroll) — dipakai khusus di Landing Page (belum login) untuk reveal-on-scroll, parallax hero video, dan efek 3D tilt ringan pada card event unggulan; jangan dipakai berlebihan di halaman app-like (My Tickets, Checkout, dll) supaya tetap ringan & cepat
- State Management: Zustand / Context API
- Form validation: **Zod** + **React Hook Form**
- Maps: Leaflet.js + OpenStreetMap (lihat `design.md` 5.3)
- Bahasa UI: **Indonesia saja**, tidak pakai library i18n (lihat `design.md` 5.2)

```bash
npm create vite@latest web-visceral-co -- --template react
cd web-visceral-co
npm install react-router-dom axios qrcode.react lucide-react zustand zod react-hook-form
npm install socket.io-client framer-motion gsap
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p

# shadcn/ui (dipakai khusus di area Admin/Superadmin dashboard)
npx shadcn@latest init
npx shadcn@latest add table dialog dropdown-menu card tabs sidebar button badge sonner
```

> Catatan: `gsap` versi bundel dasar gratis untuk ScrollTrigger/ScrollSmoother (Club GreenSock plugin lain kalau butuh baru perlu lisensi) — cek dokumentasi resmi GSAP sebelum pakai plugin premium.

### 3.3 Mobile Pelanggan (React Native + Expo)
- Framework: React Native + Expo Managed Workflow
- HTTP Client: axios
- Realtime client: **socket.io-client** (koneksi sama seperti web, room per `eventId`/`orderId`)
- Storage: @react-native-async-storage/async-storage (JWT)
- Icon: lucide-react-native / @expo/vector-icons
- QR display: react-native-qrcode-svg
- **Animasi** (setara Framer Motion/GSAP di web, tapi versi native): **react-native-reanimated** + **Moti** (`moti` — dibangun di atas Reanimated, API mirip Framer Motion) untuk transisi halaman, skeleton loading, dan micro-interaction; **Lottie** (`lottie-react-native`) opsional untuk ilustrasi animasi di Onboarding/Splash Screen
- **Payment (Doku Sandbox)**: buka halaman checkout Doku via `react-native-webview` (redirect ke URL checkout yang di-generate backend), lalu backend dapat konfirmasi lewat webhook — bukan SDK native terpisah, supaya konsisten dengan alur web

```bash
npx create-expo-app mobile-visceral-co
cd mobile-visceral-co
npm install axios lucide-react-native react-native-qrcode-svg socket.io-client
npx expo install react-native-reanimated moti react-native-webview
```

### 3.4 Mobile Gate Check-In `(Inovasi — di luar ketentuan soal)`
- Scanner: expo-camera / expo-barcode-scanner, dipakai admin untuk scan e-tiket saat masuk venue

### 3.5 DevOps & Tooling
- Testing: Vitest/Jest (unit), Supertest (API integration)
- CI/CD: GitHub Actions (lint → test → build)
- Environment: `.env` terpisah dev/staging/prod, jangan commit secret
- Containerization: Docker Compose untuk MySQL + backend lokal

### 3.6 Payment Gateway — Doku (Sandbox)

Melengkapi FR-04 (baseline soal: upload bukti transfer manual + verifikasi admin). Doku Sandbox ditambahkan sebagai jalur pembayaran otomatis, supaya order bisa langsung `PAID` tanpa nunggu admin approve manual (kecuali metode transfer manual tetap dipertahankan sebagai fallback wajib soal).

- Environment: **Sandbox** Doku (`https://api-sandbox.doku.com`) — pakai `Client Id` & `Secret Key` sandbox dari Doku Dashboard, simpan di `.env` (`DOKU_CLIENT_ID`, `DOKU_SECRET_KEY`, `DOKU_SANDBOX_BASE_URL`), **jangan** commit ke repo
- Metode yang didukung sandbox (contoh umum Doku Checkout): Virtual Account (BCA/BNI/Mandiri VA sandbox), QRIS, e-wallet (OVO/DANA sandbox) — sesuaikan channel aktif dengan dokumen resmi Doku terbaru saat implementasi (jangan asumsikan daftar channel dari draft ini, cek `https://developers.doku.com` langsung)
- Alur:
  1. Customer checkout → backend generate `Order` (`PENDING`) + request "Create Invoice/Payment" ke Doku, dapat `invoiceNumber`/`referenceId` dari Doku
  2. Customer diarahkan ke halaman/URL checkout Doku (redirect web, atau WebView di mobile) buat pilih metode bayar & bayar (data sandbox, bukan uang asli)
  3. Doku kirim **notifikasi webhook** ke endpoint backend saat status pembayaran berubah
  4. Backend **wajib verifikasi signature** webhook (HMAC sesuai spesifikasi Doku) sebelum memproses — jangan percaya payload webhook mentah-mentah
  5. Kalau signature valid & status `SUCCESS` → jalankan logic yang sama persis dengan `approveOrder()` (Bagian 3 `alur-aplikasi.md`) supaya 1 sumber logic tidak duplikat antara verifikasi manual admin vs webhook otomatis
- Field tambahan di schema: lihat `paymentMethod`, `dokuReferenceId`, `paymentChannel` di Bagian 6.2 (schema `Order`)
- Endpoint terkait: lihat Bagian 7.6

### 3.7 OTP Gateway — Fonnte (WhatsApp API)

Dipakai untuk verifikasi register/login (FR-01) & reset password, menggantikan/menambah OTP email biasa.

- Fonnte adalah gateway pengirim pesan WhatsApp berbasis API key (bukan resmi WhatsApp Business Cloud API) — cek dokumentasi resmi `https://fonnte.com` untuk format endpoint & payload terbaru saat implementasi, jangan asumsikan bentuk request dari draft ini
- Simpan `FONNTE_API_KEY` di `.env`, jangan hardcode
- Alur dasar:
  1. Customer register/login/lupa password → backend generate kode OTP 6 digit + simpan (hash) sementara dengan `expiresAt` singkat (mis. 5 menit)
  2. Backend request ke API Fonnte untuk kirim pesan WhatsApp berisi kode OTP ke `phoneNumber` user
  3. Customer input 6 digit di halaman OTP Verification (`design.md` Bagian 6) → backend cocokkan & tandai user/aksi terverifikasi
  4. Rate limit percobaan kirim ulang (resend) & percobaan verifikasi (cegah brute-force) — bagian dari NFR-03
- **Fallback**: kalau kuota/API Fonnte gagal, sediakan jalur OTP via email sebagai cadangan (jangan biarkan seluruh alur auth macet total karena 1 provider eksternal down) — lihat mitigasi di Bagian 9

---

## 4. Role & Hak Akses (RBAC Matrix)

Soal menyebut 1 role "Admin" untuk web dan "Pelanggan" untuk mobile. Sistem ini memecah sisi Admin jadi 2 tingkat (**Superadmin** & **Admin**) sebagai `(Inovasi)` — kalau butuh versi paling minimal sesuai soal, cukup pakai 1 role Admin saja dan skip kolom Superadmin.

| Fitur / Aksi | Superadmin `(Inovasi split)` | Admin | Customer |
|---|---|---|---|
| Login | ✅ | ✅ | ✅ (+Register) |
| CRUD Event/Konser | ✅ | ✅ | ❌ |
| CRUD Kategori Tiket | ✅ | ✅ | ❌ |
| CRUD Penyanyi/Artis | ✅ | ✅ | ❌ |
| Menutup Penjualan Tiket | ✅ | ✅ | ❌ |
| Melihat Daftar Pesanan | ✅ | ✅ | ❌ (hanya pesanan sendiri) |
| Verifikasi Pembayaran | ✅ | ✅ | ❌ |
| Dashboard Jumlah Tiket Terjual | ✅ | ✅ | ❌ |
| Management User (Tambah/Hapus Admin) `(Inovasi)` | ✅ | ❌ | ❌ |
| Melihat Laporan Keuangan Lengkap `(Inovasi)` | ✅ | ❌ | ❌ |
| Scan QR Gate Check-In `(Inovasi)` | ❌ | ✅ | ❌ |
| Register & Login | ❌ | ❌ | ✅ |
| Lihat Daftar & Detail Konser | ❌ | ❌ | ✅ |
| Pilih Kelas/Kursi Tiket | ❌ | ❌ | ✅ |
| Pesan Tiket & Upload Bukti Bayar | ❌ | ❌ | ✅ |
| Riwayat Pesanan | ❌ | ❌ | ✅ |
| Lihat QR Code Tiket | ❌ | ❌ | ✅ |
| Request Refund `(Inovasi)` | ❌ | ❌ (approve saja) | ✅ (request) |

---

## 5. Kebutuhan Sistem

### 5.1 Functional Requirements (FR)

**FR-01 — Auth System**
- Customer register (nama, email, password, no HP) dengan validasi email unik — *wajib soal*
- Admin & Customer login → JWT token — *wajib soal*
- **Verifikasi OTP via WhatsApp (Fonnte)** saat register (dan opsional saat login dari device baru) — nomor HP wajib diverifikasi sebelum akun aktif penuh `(Inovasi, lihat Bagian 3.7)`
- Forgot/reset password `(Inovasi)` — juga pakai OTP Fonnte sebagai metode verifikasi utama, fallback OTP email

**FR-02 — CRUD Event/Konser** *(wajib soal)*
- Admin create/edit/delete event (judul, deskripsi, tanggal, venue, banner)
- Draft/Publish state `(Inovasi)`

**FR-02b — CRUD Kategori Tiket** *(wajib soal)*
- Admin create/edit/delete kategori tiket per event (nama kelas mis. VIP/CAT1/CAT2, harga, **kuota**)
- Kuota tersimpan sebagai `totalSeats` pada `TicketCategory`; sistem otomatis hitung sisa kuota = kuota − jumlah tiket terjual/terkunci

**FR-02c — CRUD Penyanyi/Artis** *(wajib soal)*
- Admin create/edit/delete data artis (nama, foto, bio singkat)
- 1 event bisa punya banyak artis, 1 artis bisa tampil di banyak event (many-to-many via tabel relasi)

**FR-02d — Menutup Penjualan Tiket** *(wajib soal)*
- Admin bisa menutup penjualan tiket untuk 1 event secara manual (`salesClosed = true`) sebelum tanggal event
- Setelah ditutup, endpoint pemesanan menolak order baru untuk event tsb, tapi kategori & tiket yang sudah terjual tetap tampil normal di riwayat customer

**FR-03 — Jelajah Konser & Pilih Tiket** *(wajib soal, level kelas; sistem implementasikan level kursi sebagai `(Inovasi)`)*
- Customer lihat daftar & detail konser (termasuk daftar artis yang tampil)
- Customer pilih kategori/kelas tiket
- Seat-map real-time dengan locking 10 menit `(Inovasi)`

**FR-04 — Pemesanan Tiket & Verifikasi** *(wajib soal, jalur pembayaran otomatis Doku ditambahkan sebagai `(Inovasi)`)*
- Customer checkout, upload bukti transfer manual — *wajib soal, tetap jadi baseline*
- **Bayar via Doku Sandbox** (VA/QRIS/e-wallet sandbox) sebagai alternatif — order otomatis jadi `PAID` lewat webhook Doku tanpa nunggu admin, begitu signature webhook tervalidasi `(Inovasi, Bagian 3.6)`
- Admin lihat daftar pesanan & verifikasi pembayaran manual (approve/reject) — tetap dipakai untuk order dengan metode transfer manual
- Setelah approve (manual) / webhook sukses (Doku) → generate e-tiket + QR Code, kuota kategori otomatis berkurang — **satu fungsi service yang sama** dipanggil di kedua jalur (lihat catatan di `alur-aplikasi.md` Bagian 3.3)
- Status pembayaran & perubahan status order dikirim **real-time** ke customer via Socket.io, bukan cuma polling manual
- Notifikasi email/in-app saat approved/rejected `(Inovasi)`

**FR-05 — Mobile Gate Check-In** `(Inovasi — di luar soal)`
- Admin scan QR di gate → validasi tiket, ubah status CHECKED_IN

**FR-05b — Riwayat Pesanan** *(wajib soal)*
- Customer lihat semua pesanan (status: menunggu verifikasi, dibayar, ditolak/dibatalkan)

**FR-06 — Refund & Cancellation** `(Inovasi)`

**FR-07 — Dashboard Jumlah Tiket Terjual** *(wajib soal, diperluas jadi dashboard analitik penuh sebagai `(Inovasi)`)*
- Wajib: total tiket terjual per event per kategori
- Inovasi: total revenue, okupansi %, live check-in count

### 5.2 Non-Functional Requirements (NFR)

- **NFR-01 (Konsistensi Data/Concurrency)** *(wajib soal — "semua data tersimpan pada database" + validasi)*: Prisma `$transaction` untuk decrement kuota kategori/kursi, cegah oversell saat 2 pemesanan bersamaan
- **NFR-02 (Validasi Input)** *(wajib soal)*: Zod schema di setiap endpoint — register, login, create event, create kategori, create artis, checkout
- **NFR-03 (Security)**: bcryptjs (salt rounds ≥10), JWT middleware, hash QR UUID v4
- **NFR-04 (Performance)** `(Inovasi)`: API scan QR <500ms
- **NFR-05 (Usability)**: UI web & mobile responsif
- **NFR-06 (Reliability)** `(Inovasi)`: backup database terjadwal

---

## 6. Rancangan Database & ERD

Database relasional **MySQL** + **Prisma ORM** — tabel saling berelasi sesuai ketentuan soal.

### 6.1 Diagram Relasi (Conceptual ERD)

```
[USERS] (1) ─── (N) [EVENTS]              (Admin/Superadmin buat event)
[USERS] (1) ─── (N) [ORDERS]              (Customer order)

[EVENTS] (1) ─── (N) [TICKET_CATEGORIES]
[EVENTS] (N) ─── (N) [ARTISTS]  via [EVENT_ARTISTS]     ← wajib soal, baru ditambahkan

[TICKET_CATEGORIES] (1) ─── (N) [SEATS]   (kursi = representasi kuota per kategori)
[ORDERS] (1) ─── (N) [TICKETS]
[SEATS] (1) ─── (0..1) [TICKETS]

--- Tabel inovasi tambahan ---
[USERS] (1) ─── (N) [TICKETS]             (Admin scan saat check-in)      (Inovasi)
[ORDERS] (1) ─── (0..1) [REFUNDS]                                          (Inovasi)
[USERS] (1) ─── (N) [AUDIT_LOGS]                                           (Inovasi)
```

### 6.2 Prisma Schema Reference (lengkap)

```prisma
datasource db {
  provider = "mysql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

enum Role {
  SUPERADMIN
  ADMIN
  CUSTOMER
}

enum SeatStatus {
  AVAILABLE
  LOCKED
  SOLD
}

enum OrderStatus {
  PENDING
  PAID
  CANCELLED
  EXPIRED
}

enum TicketStatus {
  ACTIVE
  CHECKED_IN
  CANCELLED
}

enum EventStatus {
  DRAFT
  PUBLISHED
  ARCHIVED
}

enum RefundStatus {
  REQUESTED
  APPROVED
  REJECTED
}

enum PaymentMethod {
  MANUAL_TRANSFER
  DOKU_VA
  DOKU_QRIS
  DOKU_EWALLET
}

model User {
  id             String   @id @default(uuid())
  email          String   @unique
  password       String
  fullName       String   @map("full_name")
  phoneNumber    String?  @map("phone_number")
  phoneVerified  Boolean  @default(false) @map("phone_verified")     // Inovasi — Fonnte OTP
  otpCodeHash    String?  @map("otp_code_hash")                       // Inovasi — Fonnte OTP
  otpExpiresAt   DateTime? @map("otp_expires_at")                     // Inovasi — Fonnte OTP
  role           Role     @default(CUSTOMER)
  createdAt      DateTime @default(now()) @map("created_at")
  updatedAt      DateTime @updatedAt @map("updated_at")

  createdEvents   Event[]  @relation("EventCreator")
  orders          Order[]  @relation("CustomerOrders")
  scannedTickets  Ticket[] @relation("AdminScannedTickets")  // Inovasi
  auditLogs       AuditLog[]                                 // Inovasi

  @@map("users")
}

model Event {
  id           String      @id @default(uuid())
  title        String
  description  String      @db.Text
  venueName    String      @map("venue_name")
  eventDate    DateTime    @map("event_date")
  bannerUrl    String?     @map("banner_url")
  status       EventStatus @default(DRAFT)
  salesClosed  Boolean     @default(false) @map("sales_closed")   // wajib soal — "Menutup penjualan tiket"
  createdById  String      @map("created_by_id")
  createdAt    DateTime    @default(now()) @map("created_at")
  updatedAt    DateTime    @updatedAt @map("updated_at")

  createdBy        User             @relation("EventCreator", fields: [createdById], references: [id], onDelete: Restrict)
  ticketCategories TicketCategory[]
  artists          EventArtist[]    // wajib soal

  @@map("events")
}

// ==== Wajib soal — CRUD Penyanyi/Artis ====

model Artist {
  id       String        @id @default(uuid())
  name     String
  bio      String?       @db.Text
  photoUrl String?       @map("photo_url")
  createdAt DateTime     @default(now()) @map("created_at")

  events EventArtist[]

  @@map("artists")
}

model EventArtist {
  eventId  String @map("event_id")
  artistId String @map("artist_id")
  isHeadliner Boolean @default(false) @map("is_headliner")

  event  Event  @relation(fields: [eventId], references: [id], onDelete: Cascade)
  artist Artist @relation(fields: [artistId], references: [id], onDelete: Cascade)

  @@id([eventId, artistId])
  @@map("event_artists")
}

model TicketCategory {
  id         String   @id @default(uuid())
  eventId    String   @map("event_id")
  name       String   // wajib soal: nama kelas, mis. "VIP", "CAT 1"
  price      Decimal  @db.Decimal(12, 2)
  totalSeats Int      @map("total_seats")   // wajib soal: kuota tiket per kategori
  createdAt  DateTime @default(now()) @map("created_at")

  event Event  @relation(fields: [eventId], references: [id], onDelete: Cascade)
  seats Seat[]

  @@map("ticket_categories")
}

model Seat {
  id             String     @id @default(uuid())
  categoryId     String     @map("category_id")
  seatNumber     String     @map("seat_number")
  status         SeatStatus @default(AVAILABLE)
  lockedUntil    DateTime?  @map("locked_until")     // Inovasi
  lockedByUserId String?    @map("locked_by_user_id") // Inovasi

  category TicketCategory @relation(fields: [categoryId], references: [id], onDelete: Cascade)
  ticket   Ticket?

  @@unique([categoryId, seatNumber])
  @@map("seats")
}

model Order {
  id             String        @id @default(uuid())
  orderNumber    String        @unique @map("order_number")
  customerId     String        @map("customer_id")
  totalAmount    Decimal       @map("total_amount") @db.Decimal(12, 2)
  status         OrderStatus   @default(PENDING)
  paymentProof   String?       @map("payment_proof")
  paymentMethod  PaymentMethod @default(MANUAL_TRANSFER) @map("payment_method")   // Inovasi — Doku
  dokuReferenceId String?      @unique @map("doku_reference_id")                  // Inovasi — Doku
  paymentChannel String?       @map("payment_channel")                            // Inovasi — mis. "VA_BCA", "QRIS"
  expiresAt      DateTime      @map("expires_at")
  createdAt      DateTime      @default(now()) @map("created_at")
  updatedAt      DateTime      @updatedAt @map("updated_at")

  customer User     @relation("CustomerOrders", fields: [customerId], references: [id], onDelete: Restrict)
  tickets  Ticket[]
  refund   Refund?    // Inovasi

  @@map("orders")
}

model Ticket {
  id               String       @id @default(uuid())
  orderId          String       @map("order_id")
  seatId           String       @unique @map("seat_id")
  ticketCode       String       @unique @map("ticket_code")   // wajib soal: dipakai untuk QR Code
  status           TicketStatus @default(ACTIVE)
  checkedInAt      DateTime?    @map("checked_in_at")          // Inovasi
  checkedInByAdmin String?      @map("checked_in_by_admin")    // Inovasi
  createdAt        DateTime     @default(now()) @map("created_at")

  order           Order  @relation(fields: [orderId], references: [id], onDelete: Cascade)
  seat            Seat   @relation(fields: [seatId], references: [id], onDelete: Restrict)
  adminWhoScanned User?  @relation("AdminScannedTickets", fields: [checkedInByAdmin], references: [id])

  @@map("tickets")
}

// ==== Tabel Inovasi ====

model Refund {
  id          String       @id @default(uuid())
  orderId     String       @unique @map("order_id")
  reason      String       @db.Text
  status      RefundStatus @default(REQUESTED)
  processedBy String?      @map("processed_by")
  createdAt   DateTime     @default(now()) @map("created_at")
  updatedAt   DateTime     @updatedAt @map("updated_at")

  order Order @relation(fields: [orderId], references: [id], onDelete: Cascade)

  @@map("refunds")
}

model AuditLog {
  id        String   @id @default(uuid())
  userId    String   @map("user_id")
  action    String
  entityId  String?  @map("entity_id")
  metadata  Json?
  createdAt DateTime @default(now()) @map("created_at")

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@map("audit_logs")
}
```

---

## 7. Spesifikasi API Endpoint (REST API — wajib soal)

### 7.1 Authentication `/api/auth`
- `POST /api/auth/register` — *wajib*
- `POST /api/auth/login` — *wajib*
- `GET /api/auth/me`
- `POST /api/auth/otp/send` `(Inovasi — Fonnte)` — kirim/kirim ulang OTP WhatsApp
- `POST /api/auth/otp/verify` `(Inovasi — Fonnte)` — verifikasi kode OTP
- `POST /api/auth/forgot-password` `(Inovasi)`

### 7.2 Event `/api/events` *(wajib — CRUD Event)*
- `GET /api/events`
- `POST /api/events`
- `GET /api/events/:id`
- `PATCH /api/events/:id`
- `DELETE /api/events/:id`
- `PATCH /api/events/:id/close-sales` — *wajib, "Menutup penjualan tiket"*

### 7.3 Kategori Tiket `/api/events/:eventId/categories` *(wajib — CRUD Kategori)*
- `GET /api/events/:eventId/categories`
- `POST /api/events/:eventId/categories`
- `PATCH /api/categories/:id`
- `DELETE /api/categories/:id`

### 7.4 Artis `/api/artists` *(wajib — CRUD Artis)*
- `GET /api/artists`
- `POST /api/artists`
- `PATCH /api/artists/:id`
- `DELETE /api/artists/:id`
- `POST /api/events/:eventId/artists` — assign artis ke event

### 7.5 Seat `/api/seats` `(Inovasi)`
- `GET /api/events/:id/seat-map`
- `POST /api/seats/lock`
- `POST /api/seats/unlock`

### 7.6 Order & Tiket `/api/orders` & `/api/tickets` *(wajib — Pesan Tiket, Verifikasi, Riwayat, QR)*
- `POST /api/orders/checkout` — *wajib*
- `POST /api/orders/:id/upload-proof` — *wajib*
- `GET /api/orders` — daftar pesanan (Admin) — *wajib*
- `PATCH /api/orders/:id/approve` — verifikasi pembayaran — *wajib*
- `PATCH /api/orders/:id/reject` — *wajib*
- `GET /api/orders/my-orders` — riwayat pesanan customer — *wajib*
- `GET /api/tickets/my-tickets` — termasuk data untuk generate QR — *wajib*
- `POST /api/orders/:id/refund-request` `(Inovasi)`

### 7.6b Payment Gateway `/api/payments` `(Inovasi — Doku Sandbox)`
- `POST /api/orders/:id/payments/doku` — buat invoice/payment request ke Doku, return URL/data checkout
- `POST /api/payments/doku/callback` — endpoint **webhook** notifikasi Doku (public, tapi wajib verifikasi signature HMAC sebelum diproses)
- `GET /api/orders/:id/payment-status` — cek status terkini (dipakai kalau socket gagal, fallback polling)

### 7.7 Gate Check-In `/api/tickets/scan` `(Inovasi)`
- `POST /api/tickets/scan`

### 7.8 Dashboard `/api/dashboard` *(wajib — jumlah tiket terjual)*
- `GET /api/dashboard/summary` — total tiket terjual per event/kategori — *wajib*
- `GET /api/dashboard/revenue` `(Inovasi)`
- `GET /api/dashboard/occupancy` `(Inovasi)`

---

## 8. Penanganan Konsistensi Kuota (Race Condition)

Ketentuan soal mewajibkan "semua data tersimpan pada database" dan validasi input — implikasinya kuota tiket per kategori **tidak boleh oversell** saat ada pemesanan bersamaan. Ditangani dengan Prisma transaction:

```ts
await prisma.$transaction(async (tx) => {
  const category = await tx.ticketCategory.findUnique({
    where: { id: categoryId },
    include: { _count: { select: { seats: { where: { status: 'SOLD' } } } } }
  });

  const sold = category._count.seats;
  if (sold >= category.totalSeats) {
    throw new Error('Kuota tiket kategori ini sudah habis!');
  }

  // lanjut proses order/seat assignment di transaksi yang sama
});
```

`(Inovasi)` — kalau pakai seat-map real-time, locking kursi 10 menit dengan mekanisme sama seperti draft sebelumnya, plus job scheduler (node-cron) untuk auto-release lock/expired order.

---

## 9. Rencana Pengujian & Mitigasi Risiko

| Potensi Masalah | Solusi & Plan B |
|---|---|
| Oversell kuota tiket saat pemesanan bersamaan | Prisma `$transaction` (Bagian 8) — **wajib**, ini yang paling penting dites |
| Kamera scanner lambat/izin kamera bermasalah `(Inovasi)` | Tombol input manual kode tiket |
| Testing lokal Laptop↔HP gagal konek | 1 Wi-Fi yang sama, pakai IP lokal laptop, bukan `localhost` |
| Socket.io gagal konek | Auto polling `setInterval` tiap 5 detik ke `GET /api/orders/:id/payment-status` atau `GET /api/events/:id/seat-map` |
| Doku Sandbox down/limit tercapai `(Inovasi)` | Fallback ke jalur upload bukti transfer manual (baseline wajib soal) — jangan sampai customer tidak bisa checkout sama sekali |
| Webhook Doku tidak sampai (network/firewall) | Endpoint `GET /api/orders/:id/payment-status` untuk polling manual status ke Doku API, plus cron job cek status invoice pending secara berkala |
| Fonnte gagal kirim OTP WhatsApp `(Inovasi)` | Fallback kirim OTP via email; jangan sampai proses register/login macet total karena 1 provider eksternal |

### 9.1 Test Plan
- Unit test: fungsi decrement kuota, fungsi generate ticket code
- Integration test: checkout → approve → lihat tiket (Supertest)
- Load test sederhana: simulasi beberapa request checkout bersamaan ke kategori dengan kuota terbatas, pastikan total tiket terjual tidak melebihi kuota

---

## 10. Struktur Agile

### 10.1 Epic Breakdown
1. **Epic — Auth & User Management** *(wajib)*
2. **Epic — CRUD Event, Kategori Tiket, Artis** *(wajib)*
3. **Epic — Jelajah Konser & Pemesanan Tiket** *(wajib)*
4. **Epic — Verifikasi Pembayaran & Riwayat Pesanan** *(wajib)*
5. **Epic — Dashboard Tiket Terjual** *(wajib)*
6. **Epic — Seat-Map Real-Time & Locking** `(Inovasi)`
7. **Epic — Mobile Gate Check-In** `(Inovasi)`
8. **Epic — Refund, Audit Log & Reporting Lanjutan** `(Inovasi)`

### 10.2 Sprint Plan

| Sprint | Fokus |
|---|---|
| Sprint 0 | Setup repo GitHub, DB schema (termasuk tabel Artist), auth dasar |
| Sprint 1 | Auth lengkap, CRUD Event, CRUD Kategori Tiket, CRUD Artis |
| Sprint 2 | Alur pemesanan tiket dasar (pilih kategori, checkout, kuota decrement via transaction) |
| Sprint 3 | Upload bukti bayar, verifikasi admin, generate QR e-tiket |
| Sprint 4 | Riwayat pesanan customer, dashboard jumlah tiket terjual, tutup penjualan tiket |
| Sprint 5 `(Inovasi)` | Seat-map real-time + locking + job scheduler |
| Sprint 6 `(Inovasi)` | Mobile gate check-in scanner |
| Sprint 7 `(Inovasi)` | Refund flow, audit log, dashboard revenue/okupansi lanjutan |
| Sprint 8 | Testing menyeluruh, bug fixing, deployment, finalisasi README + submit GitHub |

### 10.3 Definition of Done
- Kode sudah code review & lolos lint
- Endpoint sudah ada validasi input (Zod)
- Unit/integration test minimal untuk logic kritikal (decrement kuota, verifikasi pembayaran)
- Sudah didemo ke stakeholder/penguji
- Tidak ada known bug blocker

---

## 11. Deliverables & Submission (sesuai Ketentuan Teknis soal)

- **Source code di GitHub** — repo terpisah atau monorepo untuk `web-visceral-co` (Admin) dan `mobile-visceral-co` (Pelanggan), plus backend Hono
- **README per repo** — cara install, `.env.example`, cara jalankan migrasi Prisma, cara seed data awal (minimal 1 admin, beberapa artis & event contoh)
- **File ERD** — export diagram relasi (bisa dari `prisma-erd-generator` atau digambar manual) disertakan di root repo/`docs/`
- **Dokumentasi API** — minimal daftar endpoint + contoh request/response (bisa file Markdown atau Postman collection)
- Commit history sebaiknya bertahap per fitur/epic (bukan 1 commit besar) — memperlihatkan progres pengerjaan sesuai sprint plan di Bagian 10.2, ini biasanya jadi nilai plus dari sisi proses kerja

---

## 12. Catatan Terpisah

Desain visual (warna, logo, navbar, video background, dsb) **sengaja tidak dimasukkan** ke PRD ini — lihat file terpisah `design.md` dan `stitch.md` supaya PRD ini fokus ke workflow, fitur, dan struktur teknis saja.
