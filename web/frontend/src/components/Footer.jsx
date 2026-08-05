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
          <div className="flex gap-4 mb-6">
            <a href="https://instagram.com" target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-obsidian-surface border border-obsidian-border flex items-center justify-center text-gray-400 hover:text-gold hover:border-gold hover:-translate-y-1 hover:shadow-gold-glow transition-all duration-300">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
            </a>
            <a href="https://facebook.com" target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-obsidian-surface border border-obsidian-border flex items-center justify-center text-gray-400 hover:text-gold hover:border-gold hover:-translate-y-1 hover:shadow-gold-glow transition-all duration-300">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
            </a>
            <a href="https://twitter.com" target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-obsidian-surface border border-obsidian-border flex items-center justify-center text-gray-400 hover:text-gold hover:border-gold hover:-translate-y-1 hover:shadow-gold-glow transition-all duration-300">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path></svg>
            </a>
            <a href="https://youtube.com" target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-obsidian-surface border border-obsidian-border flex items-center justify-center text-gray-400 hover:text-gold hover:border-gold hover:-translate-y-1 hover:shadow-gold-glow transition-all duration-300">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33 2.78 2.78 0 0 0 1.94 2c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.33 29 29 0 0 0-.46-5.33z"></path><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon></svg>
            </a>
          </div>
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
