import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { motion } from 'framer-motion';
import { ChevronDown, ChevronRight, Ticket, Shield, Zap, QrCode, Headphones, CreditCard, ArrowRight } from 'lucide-react';
import logoPng from '../assets/logo.png';

const faqs = [
  {
    q: 'Apa itu VISCERAL.CO?',
    a: 'VISCERAL.CO adalah platform ticketing konser premium yang memungkinkan Anda memesan tiket konser artis favorit secara real-time dengan fitur seat map interaktif, pembayaran aman via Doku Payment Gateway, dan E-Ticket berteknologi QR Code.'
  },
  {
    q: 'Bagaimana cara membeli tiket?',
    a: 'Cukup buat akun, pilih event konser, pilih kategori tiket & kursi yang tersedia di seat map, lalu lakukan pembayaran melalui Virtual Account, QRIS, E-Wallet, atau transfer manual. Setelah pembayaran terverifikasi, E-Ticket QR akan langsung terbit!'
  },
  {
    q: 'Apakah tiket saya aman dari penipuan?',
    a: 'Ya! Setiap tiket memiliki QR Code unik dan terenkripsi yang hanya bisa di-scan sekali di gate venue. Sistem kami juga dilengkapi real-time seat locking untuk mencegah oversell dan double booking.'
  },
  {
    q: 'Metode pembayaran apa saja yang tersedia?',
    a: 'Kami mendukung Doku Virtual Account (BCA, BRI, Mandiri, BNI), QRIS untuk semua e-wallet, serta opsi transfer manual. Semua transaksi diproses melalui Doku Payment Gateway yang tersertifikasi PCI DSS.'
  },
  {
    q: 'Bagaimana jika saya lupa password?',
    a: 'Anda bisa menggunakan fitur "Lupa Password" yang akan mengirimkan kode OTP 6 digit ke nomor WhatsApp Anda melalui Fonnte API. Masukkan kode OTP tersebut untuk membuat password baru.'
  },
  {
    q: 'Bisakah saya melakukan refund tiket?',
    a: 'Ya, kami menyediakan fitur request refund. Anda bisa mengajukan refund melalui halaman Tiket Saya dan tim kami akan memprosesnya sesuai kebijakan refund event tersebut.'
  },
  {
    q: 'Apakah ada biaya tambahan selain harga tiket?',
    a: 'Harga yang tertera sudah termasuk semua biaya. Tidak ada biaya tersembunyi. Yang Anda lihat adalah yang Anda bayar.'
  },
  {
    q: 'Bagaimana cara masuk ke venue dengan E-Ticket?',
    a: 'Buka halaman "Tiket Saya", tampilkan QR Code pada tiket digital Anda, lalu tunjukkan ke petugas di gate masuk venue untuk di-scan. Prosesnya cepat dan paperless!'
  }
];

const FaqItem = ({ faq, index }) => {
  const [open, setOpen] = useState(false);
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.08, duration: 0.5 }}
      className="border border-gray-200 dark:border-obsidian-border rounded-2xl overflow-hidden"
    >
      <button
        onClick={() => setOpen(!open)}
        className="w-full text-left px-6 py-5 flex items-center justify-between gap-4 bg-white dark:bg-obsidian-card hover:bg-gray-50 dark:hover:bg-obsidian-surface transition-colors"
      >
        <span className="font-bold text-sm text-gray-900 dark:text-white">{faq.q}</span>
        <ChevronDown className={`w-4 h-4 text-gold flex-shrink-0 transition-transform duration-300 ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="px-6 pb-5 text-sm text-gray-600 dark:text-gray-400 leading-relaxed bg-gray-50 dark:bg-obsidian-surface"
        >
          {faq.a}
        </motion.div>
      )}
    </motion.div>
  );
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-brand-bgLight dark:bg-obsidian-dark text-brand-darkText dark:text-brand-lightText transition-colors duration-300">
      <Navbar />

      {/* Hero About */}
      <section className="relative pt-32 pb-20 px-4 md:px-8 max-w-5xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="w-16 h-16 rounded-3xl bg-obsidian border border-gold/40 flex items-center justify-center p-3 mx-auto mb-6 shadow-gold-glow">
            <img src={logoPng} alt="VISCERAL.CO" className="w-full h-full object-contain" />
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-4">
            Tentang <span className="gold-gradient-text">VISCERAL.CO</span>
          </h1>
          <div className="pulse-line-oxblood max-w-md mx-auto my-6 rounded-full h-1"></div>
          <p className="text-base md:text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed">
            VISCERAL.CO adalah platform ticketing konser eksklusif masa depan yang menghubungkan penggemar musik dengan artis favorit mereka melalui teknologi terdepan. <strong>CO</strong> melambangkan <em>Co-op, Co-creators, dan Connection</em> — tiga pilar yang mendefinisikan misi kami.
          </p>
        </motion.div>
      </section>

      {/* Features Overview */}
      <section className="py-16 px-4 md:px-8 max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-extrabold mb-3">Fitur Unggulan Platform</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">Teknologi yang kami bangun untuk pengalaman konser Anda</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { icon: <Zap className="w-6 h-6" />, title: 'Reservasi Presisi', desc: 'Pilih area dan tempat duduk dengan akurasi real-time untuk memastikan pengalaman menonton tanpa kendala.' },
            { icon: <CreditCard className="w-6 h-6" />, title: 'Transaksi Aman & Cepat', desc: 'Beragam metode pembayaran dengan sistem verifikasi instan dan lapisan keamanan tingkat tinggi.' },
            { icon: <QrCode className="w-6 h-6" />, title: 'Akses Digital Premium', desc: 'Dapatkan e-ticket berteknologi enkripsi QR untuk proses validasi yang eksklusif dan mulus di pintu masuk.' },
            { icon: <Shield className="w-6 h-6" />, title: 'Perlindungan Privasi', desc: 'Data pribadi dan riwayat transaksi Anda dilindungi oleh arsitektur keamanan standar industri global.' },
            { icon: <Headphones className="w-6 h-6" />, title: 'Autentikasi Terintegrasi', desc: 'Sistem verifikasi akun yang cepat dan aman, memastikan identitas Anda selalu terlindungi dengan baik.' },
            { icon: <Ticket className="w-6 h-6" />, title: 'Layanan Fleksibel', desc: 'Fasilitas layanan pengembalian dana yang fleksibel dan transparan untuk kenyamanan Anda sepenuhnya.' },
          ].map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="p-6 rounded-2xl bg-white dark:bg-obsidian-card border border-gray-200 dark:border-obsidian-border hover:border-gold/40 transition-colors"
            >
              <div className="w-12 h-12 rounded-xl bg-obsidian text-gold flex items-center justify-center mb-4 shadow-gold-glow">
                {feature.icon}
              </div>
              <h3 className="font-bold text-base mb-2">{feature.title}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 px-4 md:px-8 max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <span className="text-xs font-bold text-oxblood uppercase tracking-widest block mb-2">FAQ</span>
          <h2 className="text-2xl md:text-3xl font-extrabold mb-3">Pertanyaan yang Sering Ditanyakan</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">Temukan jawaban untuk pertanyaan umum seputar VISCERAL.CO</p>
        </div>
        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <FaqItem key={i} faq={faq} index={i} />
          ))}
        </div>
      </section>

      {/* Syarat & Ketentuan Ringkas */}
      <section className="py-16 px-4 md:px-8 max-w-4xl mx-auto">
        <div className="bg-obsidian rounded-3xl p-8 md:p-12 border border-gold/20 shadow-obsidian-glow">
          <h2 className="text-2xl font-extrabold text-white mb-6">Syarat & Ketentuan Ringkas</h2>
          <ul className="space-y-4 text-sm text-gray-300 leading-relaxed">
            <li className="flex gap-3"><span className="text-gold font-bold">1.</span> Pembelian tiket bersifat final dan tidak dapat dibatalkan kecuali melalui fitur Request Refund sesuai kebijakan event.</li>
            <li className="flex gap-3"><span className="text-gold font-bold">2.</span> Setiap akun hanya boleh membeli maksimal 4 tiket per event untuk menjaga keadilan distribusi.</li>
            <li className="flex gap-3"><span className="text-gold font-bold">3.</span> QR Code tiket bersifat unik dan hanya bisa di-scan 1 kali. Jangan membagikan screenshot tiket Anda.</li>
            <li className="flex gap-3"><span className="text-gold font-bold">4.</span> Pembayaran harus diselesaikan dalam waktu 24 jam setelah order dibuat, jika tidak maka order akan otomatis expired.</li>
            <li className="flex gap-3"><span className="text-gold font-bold">5.</span> VISCERAL.CO berhak membatalkan tiket yang diperoleh melalui metode yang melanggar ketentuan (bot, dll).</li>
          </ul>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4 md:px-8 max-w-3xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
        >
          <h2 className="text-2xl md:text-3xl font-extrabold mb-4">Siap Merasakan Pengalaman Visceral?</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-8">Daftarkan akunmu sekarang dan jelajahi ratusan konser eksklusif</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              to="/register"
              className="px-8 py-4 rounded-full gold-gradient-btn text-obsidian font-extrabold text-sm flex items-center gap-2 shadow-gold-glow hover:scale-105 transition-transform"
            >
              Daftar Akun Gratis <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/explore"
              className="px-8 py-4 rounded-full bg-obsidian text-white hover:text-gold border border-gold/30 font-bold text-sm flex items-center gap-2 transition-all hover:border-gold"
            >
              Jelajahi Konser <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="bg-obsidian text-brand-lightText py-8 border-t border-obsidian-border">
        <div className="max-w-7xl mx-auto px-4 md:px-8 flex flex-col sm:flex-row justify-between items-center text-sm text-gray-500 font-medium">
          <p>© 2026 VISCERAL.CO — Hak Cipta Dilindungi Undang-Undang.</p>
        </div>
      </footer>
    </div>
  );
}
