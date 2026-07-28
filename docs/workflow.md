# Workflow & Panduan Anti-Halu — VISCERAL.CO
Dokumen ini melengkapi `prd.md`, `schema.sql`, `design.md`, `stitch.md` — isinya alur kerja pengembangan + cara supaya AI assistant (Claude Code atau lainnya) yang bantu ngoding **tidak mengarang** fitur/field/endpoint di luar dokumen yang sudah fix.

---

## 1. Kenapa AI Bisa "Halu" Saat Bantu Ngoding

AI cenderung mengarang kalau:
- Diminta generate kode tanpa dikasih konteks dokumen sumber (dia nebak nama field/endpoint dari pola umum, bukan dari schema asli kamu)
- Scope permintaan kabur ("buatkan fitur order dong") tanpa nyebut FR mana yang dimaksud
- Tidak ada validasi otomatis (TypeScript/Zod/test) yang bisa langsung nangkep kalau AI salah nebak nama kolom
- Percakapan terlalu panjang tanpa AI "diingatkan ulang" ke dokumen sumber — makin panjang chat, makin gampang dia campur aduk asumsi lama

Prinsip dasar: **AI hanya boleh mengacu ke 4 dokumen ini sebagai satu-satunya sumber kebenaran** — `prd.md` (fitur & requirement), `schema.sql`/Prisma schema (struktur data), `design.md` + `stitch.md` (tampilan). Kalau ada yang belum diatur di situ, AI harus nanya, bukan nebak.

> **Khusus integrasi pihak ketiga (Doku Sandbox & Fonnte)**: `prd.md` Bagian 3.6 & 3.7 cuma berisi *alur* dan *field* yang dipakai sistem — bentuk endpoint/payload/header request-response persisnya **harus dicek langsung ke dokumentasi resmi** (`https://developers.doku.com` dan `https://fonnte.com`) saat implementasi, bukan ditebak dari draft ini. Kalau AI mengarang nama field payload Doku/Fonnte tanpa merujuk dokumentasi resminya, itu tetap dianggap halu meski nama fitur/alurnya benar.

---

## 2. Alur Kerja per Fitur (supaya grounded ke FR/NFR)

Setiap kali mau minta AI bikin 1 fitur, ikuti urutan ini — **jangan loncat langsung ke "tolong buatkan kodenya"**:

### Langkah 1 — Rujuk ID requirement
Sebut FR/NFR yang mau dikerjakan, bukan deskripsi bebas.
> Contoh benar: "Kerjakan FR-02c (CRUD Penyanyi/Artis) sesuai prd.md, pakai schema `artists` & `event_artists` di schema.sql"
> Contoh yang gampang bikin halu: "Buatin fitur artis dong"

### Langkah 2 — Tempelkan potongan dokumen relevan
Copy-paste bagian FR terkait dari `prd.md` + model Prisma/tabel terkait dari `schema.sql` langsung ke chat/prompt, jangan andalkan AI "ingat" dari percakapan sebelumnya (apalagi kalau sesi baru/model baru).

### Langkah 3 — Minta AI konfirmasi pemahaman dulu sebelum generate kode
Minta AI menuliskan ulang secara singkat: field apa saja yang dipakai, endpoint apa yang akan dibuat, sebelum dia nulis kode. Kalau ada yang meleset di sini, ketauan sebelum kode ditulis — lebih murah diperbaiki di tahap ini.

### Langkah 4 — Generate kode per potongan kecil, bukan sekaligus semua fitur
Satu request = satu FR/satu endpoint. Fitur besar (mis. seluruh alur pemesanan tiket FR-04) dipecah: bikin endpoint checkout dulu → review → baru lanjut endpoint upload bukti bayar → review → dst.

### Langkah 5 — Cocokkan hasil generate ke schema.sql/prisma schema
Setelah kode jadi, cek manual (atau minta AI cek ulang) apakah nama kolom/tabel yang dipakai di kode **persis sama** dengan `schema.sql`. Ini langkah paling sering kelewat padahal paling murah buat nyegah bug dari halu.

### Langkah 6 — Commit kecil per fitur
Sesuai catatan Deliverables di `prd.md` — commit per FR/epic, bukan 1 commit besar. Ini juga bikin gampang rollback kalau ternyata 1 fitur hasil AI keliru.

---

## 3. Checklist Anti-Halu (dicek tiap sesi kerja dengan AI)

- [ ] AI dikasih akses/tempelan `prd.md`, `schema.sql`, `design.md` yang **versi terbaru** (bukan draft lama)
- [ ] Setiap request nyebut ID FR/NFR yang jelas
- [ ] Tidak ada field/tabel/endpoint yang dipakai AI tanpa ada sumbernya di `schema.sql` atau `prd.md` — kalau AI munculin field baru, tanya balik "field ini dari mana, kok belum ada di schema?"
- [ ] Validasi otomatis aktif: TypeScript strict mode + Zod schema — supaya kalau AI salah ketik nama field, langsung merah di editor/CI, bukan ketauan pas runtime
- [ ] Ada test (unit/integration) minimal untuk tiap FR kritikal (checkout, verifikasi pembayaran, decrement kuota) — AI harus bikin kode yang lolos test ini, bukan cuma "keliatan benar"
- [ ] Endpoint request/response dicek ulang ke dokumentasi API di Bagian 7 `prd.md` — jangan biarkan AI mengarang bentuk response sendiri
- [ ] Kalau AI menyarankan library/pattern baru yang tidak ada di stack `prd.md` Bagian 3, tanya dulu alasannya — jangan otomatis dipakai

---

## 4. Dokumen Tambahan yang Disarankan (supaya makin sulit halu)

Selain 4 dokumen yang sudah ada, ini yang biasanya masih kurang dan cukup krusial:

### 4.1 API Contract Formal (OpenAPI/Swagger)
`prd.md` Bagian 7 baru daftar endpoint + 1 contoh response. Idealnya dibuatkan file `openapi.yaml` berisi skema request/response lengkap tiap endpoint (termasuk tipe data & field wajib). Ini jadi "kontrak" yang jauh lebih sulit disimpangi AI dibanding deskripsi teks bebas — AI generate langsung dari skema formal, bukan dari kalimat yang bisa ditafsirkan macam-macam.

### 4.2 Postman Collection / Contoh Request Nyata
Kumpulan contoh request-response asli (bukan cuma di dokumentasi) — dipakai buat AI cross-check hasil generate-nya betulan sesuai atau enggak, dan dipakai juga buat testing manual kamu sendiri.

### 4.3 Seed Data / Fixture
Script `seed.ts` (Prisma seed) isi data contoh: beberapa admin, artis, event, kategori tiket, order dummy. Berguna supaya AI (dan kamu) bisa langsung testing alur end-to-end tanpa input data manual berulang, dan AI juga jadi "lihat" bentuk data asli, bukan cuma nebak dari nama kolom.

### 4.4 `.env.example` Lengkap
Daftar semua environment variable yang dibutuhkan (DATABASE_URL, JWT_SECRET, dll) — supaya AI gak mengarang nama env variable sendiri pas generate kode config/auth.

### 4.5 Test Suite Ditulis Duluan (atau Bareng), Bukan Belakangan
Untuk FR kritikal (checkout, verifikasi pembayaran, decrement kuota, generate tiket) — tulis dulu test case-nya (bisa sama-sama AI, tapi direview manual dulu apakah test-nya sudah benar mencerminkan requirement), baru minta AI implementasi kodenya sampai lolos test itu. Ini paling efektif nyegah halu karena AI "dipaksa" ketemu kriteria konkret, bukan sekadar "kelihatan masuk akal".

### 4.6 Prompt/System Instruction Standar
Simpan 1 template prompt pembuka yang dipakai tiap mulai sesi baru dengan AI assistant, isinya kurang lebih:
> "Kamu bekerja di project VISCERAL.CO. Rujukan satu-satunya: prd.md, schema.sql, design.md, stitch.md (versi yang saya lampirkan). Jangan menambahkan field, tabel, endpoint, atau fitur yang tidak ada di dokumen ini. Kalau ada kebutuhan yang belum jelas, tanya dulu sebelum menulis kode."

---

## 5. Ringkasan Prioritas

Kalau waktunya terbatas dan cuma bisa nambah 1-2 hal dulu dari Bagian 4, prioritaskan:
1. **Seed data** (4.3) — paling cepat dibuat, dampaknya langsung kelihatan pas testing
2. **Test suite untuk FR kritikal** (4.5) — paling efektif nahan AI dari halu di logic penting (kuota, pembayaran)

Sisanya (OpenAPI, Postman, .env.example, prompt template) bisa menyusul begitu development jalan.
