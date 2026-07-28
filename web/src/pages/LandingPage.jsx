import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import Navbar from '../components/Navbar';
import { Ticket, Shield, Sparkles, ChevronRight, MapPin, Calendar, Clock, ArrowRight, Zap, CheckCircle2 } from 'lucide-react';
import logoPng from '../assets/logo.png';

export default function LandingPage() {
  const { events } = useStore();

  return (
    <div className="min-h-screen bg-brand-bgLight dark:bg-obsidian-dark text-brand-darkText dark:text-brand-lightText transition-colors duration-300">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 md:px-8 max-w-7xl mx-auto overflow-hidden">
        {/* Background glow effects */}
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-96 h-96 bg-gold/15 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-oxblood/20 rounded-full blur-3xl pointer-events-none"></div>

        <div className="text-center max-w-4xl mx-auto relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-obsidian text-gold border border-gold/40 text-xs font-semibold shadow-gold-glow mb-6 animate-float">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Platform Ticketing Konser Eksklusif Masa Depan</span>
          </div>

          <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight leading-[1.1] mb-6">
            Rasakan Pengalaman <br />
            <span className="gold-gradient-text">Visceral Yang Sesungguhnya</span>
          </h1>

          {/* Oxblood Pulse Decorative Line */}
          <div className="pulse-line-oxblood max-w-md mx-auto my-6 rounded-full"></div>

          <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto font-normal leading-relaxed mb-8">
            Pesan tiket konser artis favoritmu secara real-time dengan garansi kuota anti-oversell, verifikasi instan Doku Gateway, dan E-Ticket QR terenkripsi.
          </p>

          <div className="flex flex-wrap justify-center items-center gap-4">
            <Link
              to="/explore"
              className="px-8 py-4 rounded-full gold-gradient-btn text-obsidian font-extrabold text-sm flex items-center gap-2 shadow-gold-glow hover:scale-105 transition-transform"
            >
              <Ticket className="w-4 h-4" />
              Jelajahi Event Konser
              <ChevronRight className="w-4 h-4" />
            </Link>

            <Link
              to="/register"
              className="px-8 py-4 rounded-full bg-obsidian text-white hover:text-gold border border-gold/30 font-bold text-sm flex items-center gap-2 transition-all hover:border-gold"
            >
              Daftar Akun Baru
            </Link>
          </div>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16 max-w-5xl mx-auto">
          <div className="glass-pill p-6 rounded-3xl border border-gold/20 hover:border-gold/50 transition-all duration-300 hover:-translate-y-1">
            <div className="w-12 h-12 rounded-2xl bg-obsidian text-gold flex items-center justify-center mb-4 shadow-gold-glow">
              <Zap className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold mb-2">Real-Time Seat Map</h3>
            <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
              Pilih posisi kursi spesifik secara langsung dengan sistem locking 10 menit tanpa resiko bentrok kuota.
            </p>
          </div>

          <div className="glass-pill p-6 rounded-3xl border border-gold/20 hover:border-gold/50 transition-all duration-300 hover:-translate-y-1">
            <div className="w-12 h-12 rounded-2xl bg-obsidian text-gold flex items-center justify-center mb-4 shadow-gold-glow">
              <Shield className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold mb-2">Verifikasi Pembayaran Otomatis</h3>
            <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
              Integrasi Doku Checkout Sandbox (VA, QRIS, E-Wallet) & Transfer Manual dengan approval cepat.
            </p>
          </div>

          <div className="glass-pill p-6 rounded-3xl border border-gold/20 hover:border-gold/50 transition-all duration-300 hover:-translate-y-1">
            <div className="w-12 h-12 rounded-2xl bg-obsidian text-gold flex items-center justify-center mb-4 shadow-gold-glow">
              <Ticket className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold mb-2">E-Ticket QR Code Instant</h3>
            <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
              Tiket langsung terbit dengan QR Code unik dan siap di-scan pada gate masuk venue konser.
            </p>
          </div>
        </div>
      </section>

      {/* Featured Concerts Section */}
      <section className="py-16 px-4 md:px-8 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10">
          <div>
            <span className="text-xs font-bold text-oxblood uppercase tracking-widest block mb-1">
              Event Mendatang
            </span>
            <h2 className="text-3xl font-extrabold tracking-tight">Konser Unggulan Musisi Papan Atas</h2>
          </div>
          <Link
            to="/explore"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-gold hover:underline mt-4 md:mt-0"
          >
            Lihat Semua Konser <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {events.map((event) => (
            <div
              key={event.id}
              className="bg-white dark:bg-obsidian-card rounded-3xl overflow-hidden border border-gray-200 dark:border-obsidian-border shadow-obsidian-glow group hover:border-gold/50 transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="relative h-52 overflow-hidden">
                  <img
                    src={event.bannerUrl}
                    alt={event.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-obsidian via-transparent to-transparent opacity-80"></div>
                  
                  {event.salesClosed ? (
                    <span className="absolute top-4 right-4 bg-oxblood text-white text-[10px] font-extrabold uppercase px-3 py-1 rounded-full shadow-lg">
                      Penjualan Ditutup
                    </span>
                  ) : (
                    <span className="absolute top-4 right-4 bg-gold text-obsidian text-[10px] font-extrabold uppercase px-3 py-1 rounded-full shadow-gold-glow">
                      Tersedia
                    </span>
                  )}

                  <div className="absolute bottom-3 left-4 right-4 text-white">
                    <span className="text-[11px] font-medium text-gold flex items-center gap-1 mb-1">
                      <MapPin className="w-3 h-3" /> {event.venueName}
                    </span>
                    <h3 className="text-base font-bold line-clamp-1 group-hover:text-gold transition-colors">
                      {event.title}
                    </h3>
                  </div>
                </div>

                <div className="p-5">
                  <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 mb-4 leading-relaxed">
                    {event.description}
                  </p>

                  <div className="flex items-center gap-4 text-xs text-gray-600 dark:text-gray-300 mb-4 pb-4 border-b border-gray-100 dark:border-obsidian-border">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-gold" />
                      <span>{new Date(event.eventDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-gold" />
                      <span>19:00 WIB</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="px-5 pb-5 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-gray-400 uppercase tracking-wider block">Mulai Dari</span>
                  <span className="text-base font-extrabold text-gold">
                    Rp {event.categories[0]?.price.toLocaleString('id-ID')}
                  </span>
                </div>

                <Link
                  to={`/event/${event.id}`}
                  className="px-4 py-2 rounded-full bg-obsidian text-white hover:text-gold border border-gold/30 hover:border-gold text-xs font-bold transition-all"
                >
                  Detail Event
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-obsidian text-brand-lightText pt-16 pb-8 border-t border-obsidian-border">
        <div className="max-w-7xl mx-auto px-4 md:px-8 grid grid-cols-1 md:grid-cols-4 gap-8 pb-12 border-b border-obsidian-border">
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-obsidian-surface border border-gold/40 flex items-center justify-center p-1.5 shadow-gold-glow">
                <img src={logoPng} alt="VISCERAL.CO" className="w-full h-full object-contain" />
              </div>
              <span className="font-extrabold text-lg text-white">VISCERAL<span className="text-gold">.CO</span></span>
            </div>
            <p className="text-xs text-gray-400 max-w-sm leading-relaxed mb-4">
              VISCERAL.CO merangkum Co-op, Co-creators, dan Connection untuk menghadirkan koneksi emosional pertunjukan musik secara langsung.
            </p>
            <div className="pulse-line-oxblood max-w-xs rounded-full"></div>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-gold mb-4">Navigasi</h4>
            <ul className="space-y-2 text-xs text-gray-400">
              <li><Link to="/explore" className="hover:text-gold">Jelajah Konser</Link></li>
              <li><Link to="/my-tickets" className="hover:text-gold">Tiket Saya</Link></li>
              <li><Link to="/login" className="hover:text-gold">Login User</Link></li>
              <li><Link to="/register" className="hover:text-gold">Daftar Akun</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-gold mb-4">Bantuan & Legal</h4>
            <ul className="space-y-2 text-xs text-gray-400">
              <li><a href="#" className="hover:text-gold">Syarat & Ketentuan</a></li>
              <li><a href="#" className="hover:text-gold">Kebijakan Privasi</a></li>
              <li><a href="#" className="hover:text-gold">Panduan Verifikasi Doku</a></li>
              <li><a href="#" className="hover:text-gold">Kontak Customer Service</a></li>
            </ul>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 md:px-8 pt-6 flex flex-col sm:flex-row justify-between items-center text-xs text-gray-500">
          <p>© 2026 VISCERAL.CO — Hak Cipta Dilindungi Undang-Undang.</p>
          <p className="mt-2 sm:mt-0 font-medium">Obsidian Gold Edition</p>
        </div>
      </footer>
    </div>
  );
}
