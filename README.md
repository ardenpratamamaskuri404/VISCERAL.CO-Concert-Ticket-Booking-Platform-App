<div align="center">
  <img src="https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=1200&auto=format&fit=crop&q=80" alt="VISCERAL.CO Banner" width="100%" style="border-radius: 12px; margin-bottom: 20px;" />

  # VISCERAL.CO 🎫
  **The Future of Premium Concert E-Ticketing**

  [![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
  [![Vite](https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E)](https://vitejs.dev/)
  [![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
  [![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
  [![Hono](https://img.shields.io/badge/Hono.js-E36002?style=for-the-badge&logo=hono&logoColor=white)](https://hono.dev/)
  [![Prisma](https://img.shields.io/badge/Prisma-3982CE?style=for-the-badge&logo=Prisma&logoColor=white)](https://www.prisma.io/)

  <p align="center">
    Platform e-ticketing konser eksklusif dengan arsitektur <i>real-time seat locking</i> berkinerja tinggi dan antarmuka 3D premium (Obsidian Gold Edition).
  </p>
</div>

---

## 🚀 Overview

**VISCERAL.CO** dibangun untuk mendisrupsi sistem penjualan tiket konser konvensional. Mengatasi permasalahan klasik seperti *overselling*, *crash* saat *war* tiket, dan proses verifikasi yang lambat, platform ini mengadopsi arsitektur *event-driven* menggunakan **Socket.io** dan **Hono.js**. 

Di sisi klien, kami menghadirkan pengalaman visual kelas dunia melalui animasi 3D *Tilt*, transisi *seamless*, dan skema warna eksklusif yang memadukan Obsidian, Oxblood, dan Gold.

## ✨ Key Features

- 💺 **Real-Time Seat Locking Mechanism:** Memastikan tidak ada *double-booking* saat *war* tiket. Kursi otomatis terkunci selama 10 menit menggunakan Socket.io.
- ⚡ **Ultra-Fast API Server:** Ditenagai oleh **Hono.js** yang jauh lebih ringan dan cepat dibandingkan framework tradisional Node.js, disandingkan dengan **Prisma ORM**.
- 💳 **Automated Payment Gateway:** Terintegrasi penuh dengan **Doku Sandbox** mendukung Virtual Account, QRIS, dan E-Wallet dengan konfirmasi instan.
- 💬 **Live Chat & Notifications:** Dukungan *live chat* real-time berbasis WebSocket antara pengguna dan admin.
- 📱 **WhatsApp Integration:** Pengiriman *E-Ticket* langsung ke WhatsApp pengguna melalui **Fonnte API**.
- 🎫 **Instant QR E-Ticket:** Tiket diterbitkan *real-time* dengan kode QR terenkripsi, siap dipindai oleh *Scanner Gate* di lapangan.
- 🎨 **Premium 3D UI/UX:** Memanfaatkan **Framer Motion** & **GSAP** untuk menghadirkan mikro-interaksi dinamis dan *parallax scrolling*.

---

## 🛠️ Tech Stack

### Frontend (User & Admin Dashboard)
- **Framework:** React.js + Vite
- **Styling:** Tailwind CSS v4 (Custom Theme)
- **State Management:** Zustand
- **Animations:** Framer Motion, GSAP
- **Icons:** Lucide React
- **i18n:** react-i18next (🇮🇩/🇬🇧)

### Backend (Core API)
- **Runtime:** Node.js
- **Framework:** Hono.js
- **Database:** MySQL
- **ORM:** Prisma
- **Real-time Engine:** Socket.io
- **Security:** JWT, Bcrypt, Zod Validation

---

## 📁 Repository Structure

Proyek ini menggunakan struktur *monorepo* untuk web dan backend. *(Catatan: Aplikasi Mobile Scanner berada di repository terpisah).*

```text
sistem-konser-app/
├── web/
│   ├── frontend/       # React SPA (Client Portal & Admin Dashboard)
│   │   ├── src/
│   │   └── scripts/    # Build & Asset utility scripts
│   └── backend/        # Node.js + Hono API Server
│       ├── src/
│       └── scripts/    # CRON jobs & server utilities
└── docs/               # Dokumentasi lengkap (ERD, Schema, Panduan)
```

---

## 💻 Quick Start

Bagi tim *developer* yang ingin menjalankan *project* ini secara lokal, silakan ikuti panduan lengkap *step-by-step* di bawah ini:

👉 **[BACA PANDUAN SETUP LENGKAP (PANDUAN_SETUP.md)](./docs/PANDUAN_SETUP.md)**

*Panduan tersebut mencakup:*
1. Impor Database ke MySQL Workbench
2. Menjalankan Hono Backend API
3. Menjalankan React Frontend

---

## 📱 Mobile Scanner App
Aplikasi khusus (*React Native/Expo*) untuk *Gate Scanner* tiket di lapangan dikelola pada repository terpisah untuk skalabilitas *deployment*. Aplikasi ini terhubung langsung via WebSocket ke backend utama ini.

---

## 👨‍💻 Development Team

Proyek kolaboratif ini dirancang, diarsiteki, dan dikembangkan oleh:

| Nama | Peran Utama | Fokus Area |
| :--- | :--- | :--- |
| **Arden Pratama Maskuri** | Backend Developer | API Architecture, Database Schema, Real-time Socket Engine, Payment Integration |
| **Muhammad Arkan Afif** | Frontend Developer | Premium UI/UX, GSAP 3D Effects, React Ecosystem, Responsive Design |

<br/>

> *"Merangkum Co-op, Co-creators, dan Connection untuk menghadirkan koneksi emosional pertunjukan musik secara langsung."* — **VISCERAL.CO**
