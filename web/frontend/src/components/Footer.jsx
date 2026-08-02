import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import logoPng from '../assets/logo.png';

export default function Footer() {
  return (
    <footer className="bg-obsidian text-brand-lightText pt-20 pb-10 border-t border-obsidian-border mt-10">
      <div className="max-w-7xl mx-auto px-4 md:px-8 grid grid-cols-1 md:grid-cols-4 gap-12 pb-12 border-b border-obsidian-border">
        <div className="md:col-span-2">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-full bg-obsidian-surface border border-gold/40 flex items-center justify-center p-2 shadow-gold-glow">
              <img src={logoPng} alt="VISCERAL.CO" className="w-full h-full object-contain" />
            </div>
            <span className="font-extrabold text-2xl text-white tracking-tight">VISCERAL<span className="text-gold">.CO</span></span>
          </div>
          <p className="text-sm text-gray-400 max-w-sm leading-relaxed mb-6">
            Platform elit yang menyatukan kurator, kreator, dan audiens untuk menghadirkan harmoni pertunjukan musik langsung ke dimensi yang sepenuhnya baru.
          </p>
          <div className="pulse-line-oxblood max-w-xs rounded-full h-1"></div>
        </div>

        <div>
          <h4 className="text-sm font-bold uppercase tracking-wider text-gold mb-6">Navigasi Utama</h4>
          <ul className="space-y-3 text-sm text-gray-400 font-medium">
            <li><Link to="/explore" className="hover:text-gold transition-colors inline-flex items-center gap-2"><ArrowRight className="w-3 h-3"/> Jelajah Konser</Link></li>
            <li><Link to="/my-tickets" className="hover:text-gold transition-colors inline-flex items-center gap-2"><ArrowRight className="w-3 h-3"/> Tiket Saya</Link></li>
            <li><Link to="/login" className="hover:text-gold transition-colors inline-flex items-center gap-2"><ArrowRight className="w-3 h-3"/> Login User</Link></li>
            <li><Link to="/register" className="hover:text-gold transition-colors inline-flex items-center gap-2"><ArrowRight className="w-3 h-3"/> Daftar Akun</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-bold uppercase tracking-wider text-gold mb-6">Bantuan & Legal</h4>
          <ul className="space-y-3 text-sm text-gray-400 font-medium">
            <li><Link to="/terms" className="hover:text-gold transition-colors">Syarat & Ketentuan</Link></li>
            <li><Link to="/privacy" className="hover:text-gold transition-colors">Kebijakan Privasi</Link></li>
            <li><Link to="/guide" className="hover:text-gold transition-colors">Panduan Verifikasi Doku</Link></li>
            <li><Link to="/contact" className="hover:text-gold transition-colors">Hubungi Support Tim</Link></li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 pt-8 flex flex-col sm:flex-row justify-between items-center text-sm text-gray-500 font-medium">
        <p>© 2026 VISCERAL.CO — Hak Cipta Dilindungi Undang-Undang.</p>
      </div>
    </footer>
  );
}
