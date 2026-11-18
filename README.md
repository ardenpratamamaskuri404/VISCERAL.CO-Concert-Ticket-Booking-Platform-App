<div align="center">
  <img src="https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=1200&auto=format&fit=crop&q=80" alt="VISCERAL.CO Banner" width="100%" />

  # VISCERAL.CO
  **Platform Pemesanan Tiket Konser Eksklusif Berbasis Real-Time**

  [![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
  [![Vite](https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E)](https://vitejs.dev/)
  [![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
  [![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
  [![Hono](https://img.shields.io/badge/Hono.js-E36002?style=for-the-badge&logo=hono&logoColor=white)](https://hono.dev/)
  [![Prisma](https://img.shields.io/badge/Prisma-3982CE?style=for-the-badge&logo=Prisma&logoColor=white)](https://www.prisma.io/)
  [![Expo](https://img.shields.io/badge/Expo_SDK_58-000020?style=for-the-badge&logo=expo&logoColor=white)](https://expo.dev/)

  <p align="center">
    Platform e-ticketing konser end-to-end dengan arsitektur real-time seat locking, pembayaran otomatis terintegrasi DOKU, pengiriman OTP email via Mailpit SMTP, serta aplikasi mobile pelanggan dan scanner gate terpadu.
  </p>
</div>

---

## Ringkasan Sistem

**VISCERAL.CO** dirancang untuk mengatasi permasalahan klasik pada penjualan tiket konser skala besar, seperti *double-booking* saat pembelian serentak, verifikasi pembayaran manual yang lambat, serta validasi tiket di pintu masuk venue. Seluruh sistem web, API backend, database, dan aplikasi mobile terintegrasi dalam satu monorepo melalui koneksi REST API dan WebSocket (`Socket.io`).

---

## Fitur Utama

- **Real-Time Seat Locking:** Mengunci kursi pilihan secara langsung melalui WebSocket (`Socket.io`) selama masa checkout berlangsung untuk mencegah pemesanan ganda.
- **API Server Berkinerja Tinggi:** Dibangun dengan **Hono.js** di atas **Node.js + TypeScript**, didukung **Prisma ORM** dan **MySQL**.
- **Integrasi Payment Gateway DOKU:** Mendukung Virtual Account (Mandiri, BCA, BRI, BNI), QRIS, ShopeePay, OVO, DANA, serta unggah bukti transfer manual dengan pembaruan status otomatis via webhook.
- **Keamanan Akun & Email OTP (Mailpit SMTP):** Autentikasi JWT, enkripsi password `bcryptjs`, validasi kekuatan password dan persetujuan S&K saat registrasi, serta pengiriman kode OTP reset password langsung melalui SMTP (`nodemailer` ke Laragon Mailpit).
- **Katalog Konser, Lineup Artis & Kalender Jadwal:** Halaman publik untuk menjelajahi konser, profil lengkap musisi penampil (`/artists`), serta timeline jadwal pertunjukan (`/schedule`) lengkap dengan hitung mundur.
- **E-Ticket QR Code & Gate Scanner:** Tiket elektronik diterbitkan instan dengan kode QR unik yang dapat dipindai langsung melalui Dashboard Web Admin maupun Aplikasi Mobile Scanner.
- **Live Chat, Notifikasi & Dashboard Admin:** Fitur percakapan langsung antara pembeli dan admin secara real-time, grafik analitik penjualan, manajemen event/artis/user, serta pengajuan dan persetujuan refund.
- **Dukungan Light Mode, Dark Mode & Multi-Bahasa:** Tema terang/gelap yang tersinkronisasi di seluruh halaman serta dukungan bahasa Indonesia dan Inggris (`react-i18next`).

---

## Arsitektur Teknologi

### Web Frontend (`web/frontend`)
- **Framework:** React + Vite
- **Routing:** React Router DOM
- **Styling:** Tailwind CSS v4 (Custom Obsidian, Oxblood & Gold Tokens)
- **State Management:** React Context API (`StoreContext`)
- **Visualisasi & Interaksi:** Framer Motion, GSAP, Recharts, Leaflet / React-Leaflet, QRCode.react, `@yudiel/react-qr-scanner`, Lucide React
- **Internasionalisasi:** `i18next` & `react-i18next` (ID / EN)

### Backend Core API (`web/backend`)
- **Runtime & Framework:** Node.js, TypeScript, Hono.js
- **Database & ORM:** MySQL 8.x & Prisma ORM
- **Real-Time Engine:** Socket.io
- **Layanan Eksternal:** DOKU Checkout/Webhook Service, Nodemailer (Mailpit SMTP `127.0.0.1:1025`)
- **Keamanan & Validasi:** JSON Web Token (JWT), `bcryptjs`, `crypto-js`, `zod`

### Aplikasi Mobile (`mobile`)
- **Framework:** React Native + Expo SDK 58 (`expo-router`)
- **Fitur:** Katalog konser, pemilihan kursi, checkout, penyimpanan e-ticket QR, peta venue (`react-native-maps`), live chat, serta **Admin QR Scanner** berbasis `expo-camera`.

---

## Struktur Direktori

```text
sistem-konser-app/
├── web/
│   ├── frontend/
│   │   ├── public/                # Aset statis, logo pembayaran, dan video background
│   │   ├── src/
│   │   │   ├── api/               # Konfigurasi Axios client
│   │   │   ├── assets/            # Logo SVG brand dan gambar hero
│   │   │   ├── components/        # Navbar, Footer, Sidebar, Checkout & Landing sections
│   │   │   ├── context/           # StoreContext (Auth, Theme, Socket, Data)
│   │   │   ├── locales/           # File terjemahan id.json dan en.json
│   │   │   ├── pages/             # Halaman Customer & Dashboard Admin
│   │   │   └── utils/             # Utilitas resolver URL gambar
│   │   ├── index.html
│   │   └── package.json
│   └── backend/
│       ├── prisma/
│       │   ├── schema.prisma      # Definisi model database Prisma (12 tabel)
│       │   └── seed.ts            # Skrip seeder awal database
│       ├── public/                # Penyimpanan file upload (artis, event, avatar)
│       ├── src/
│       │   ├── config/            # Inisialisasi Prisma & koneksi database
│       │   ├── middlewares/       # Middleware autentikasi & otorisasi role
│       │   ├── routes/            # Endpoint API (auth, events, artists, orders, tickets, chat, notifications, users)
│       │   ├── services/          # Integrasi DOKU, Email Mailpit SMTP, dan logika order
│       │   └── index.ts           # Entry point server Hono + Socket.io
│       ├── tsconfig.json
│       └── package.json
├── mobile/
│   ├── app/
│   │   ├── (admin)/               # Halaman scanner gate admin
│   │   ├── (auth)/                # Login, register, verifikasi OTP, reset password
│   │   ├── (tabs)/                # Beranda, tiket saya, dan profil
│   │   ├── checkout/              # Alur checkout tiket
│   │   ├── event/                 # Detail konser
│   │   ├── payment/               # Instruksi & status pembayaran
│   │   ├── seat-selection/        # Pemilihan kursi real-time
│   │   ├── settings/              # Pengaturan profil, password, tampilan, bantuan
│   │   └── ticket/                # Detail E-Ticket QR
│   ├── src/
│   │   ├── api/                   # Konfigurasi Axios mobile
│   │   ├── components/            # Komponen UI & VisceralLogo SVG
│   │   ├── constants/             # Konstanta warna & tema
│   │   ├── context/               # AuthContext, AppContext, dan SocketContext
│   │   └── types/                 # Tipe TypeScript
│   ├── app.json
│   └── package.json
├── docs/
│   ├── schema.sql                 # DDL lengkap, data seed, dan kumpulan query SQL
│   ├── schemabaru.sql             # Salinan sinkronisasi database terbaru
│   ├── PANDUAN_SETUP.md           # Panduan instalasi awal
│   ├── panduan-run.md             # Daftar port & cara menjalankan layanan lokal
│   ├── alur-aplikasi.md           # Dokumentasi alur sistem
│   ├── design.md                  # Dokumentasi sistem desain UI
│   ├── DokuGuide.md               # Panduan integrasi pembayaran DOKU
│   ├── ScannerGateAdmin.md        # Dokumentasi alur check-in tiket di gate
│   └── workflow.md                # Alur pengembangan proyek
└── README.md
```

---

## Panduan Menjalankan Proyek Secara Lokal

1. **Database & Mailpit (Laragon / MySQL 8):**
   - Jalankan MySQL (port `3306`) dan Mailpit SMTP (port `1025`, Web UI `http://localhost:8025`).
   - Impor database menggunakan file `docs/schema.sql` atau `docs/schemabaru.sql` melalui MySQL Workbench, HeidiSQL, atau terminal:
     ```bash
     mysql -u root < docs/schema.sql
     ```

2. **Backend Server (`web/backend`):**
   ```bash
   cd web/backend
   npm install
   npx prisma generate
   npm run dev
   ```
   Server berjalan di `http://localhost:3005`.

3. **Web Frontend (`web/frontend`):**
   ```bash
   cd web/frontend
   npm install
   npm run dev
   ```
   Aplikasi web berjalan di `http://localhost:5173`.

4. **Aplikasi Mobile (`mobile`):**
   ```bash
   cd mobile
   npm install
   npx expo start
   ```

---

## Tim Pengembang

Proyek ini dirancang dan dikembangkan oleh:

| Nama | Peran Utama | Fokus Area |
| :--- | :--- | :--- |
| **Arden Pratama Maskuri** | Backend Developer | Arsitektur API, Skema Database, Real-Time Socket Engine, Integrasi Pembayaran & SMTP |
| **Muhammad Arkan Afif** | Frontend Developer | UI/UX Web & Mobile, Animasi Interaktif, Integrasi Komponen & Sistem Tema |

---

> "Merangkum Co-op, Co-creators, dan Connection untuk menghadirkan koneksi emosional pertunjukan musik secara langsung." — **VISCERAL.CO**
