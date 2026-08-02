import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { Sun, Moon, Ticket, User, LogOut, Shield, Compass, Home, Languages, Info, Settings, Bell } from 'lucide-react';
import logoPng from '../assets/logo.png';
import { getImageUrl } from '../utils/image';

export default function Navbar() {
  const { darkMode, toggleDarkMode, currentUser, performLogout, unreadCount, unreadNotificationCount } = useStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [profileOpen, setProfileOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [currentLang, setCurrentLang] = useState('id');
  const langRef = useRef(null);
  const profileRef = useRef(null);

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    setProfileOpen(false);
    performLogout();
  };

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (langRef.current && !langRef.current.contains(e.target)) setLangOpen(false);
      if (profileRef.current && !profileRef.current.contains(e.target)) setProfileOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const switchLanguage = (langCode) => {
    setCurrentLang(langCode);
    setLangOpen(false);
    // Trigger Google Translate
    const frame = document.querySelector('.goog-te-combo');
    if (frame) {
      frame.value = langCode === 'id' ? 'id' : 'en';
      frame.dispatchEvent(new Event('change'));
    }
  };

  return (
    <header className="fixed top-4 left-0 right-0 z-50 flex justify-center px-4">
      <nav className="glass-pill max-w-5xl w-full rounded-full px-4 py-2.5 flex items-center justify-between shadow-obsidian-glow transition-all duration-300">
        
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-full bg-obsidian border border-gold/40 flex items-center justify-center p-1.5 shadow-gold-glow group-hover:scale-105 transition-transform">
            <img src={logoPng} alt="VISCERAL.CO" className="w-full h-full object-contain" />
          </div>
          <div className="flex flex-col">
            <span className="font-extrabold text-base tracking-wider text-obsidian dark:text-brand-lightText flex items-center gap-1 font-sans">
              VISCERAL<span className="text-gold">.CO</span>
            </span>
            <span className="text-[9px] uppercase tracking-widest text-oxblood dark:text-gold-light font-semibold -mt-1">
              Live Concerts
            </span>
          </div>
        </Link>

        {/* Menu Pill Track */}
        <div className="hidden md:flex items-center gap-1 bg-gray-100/80 dark:bg-obsidian-card/90 p-1 rounded-full border border-gray-200 dark:border-obsidian-border">
          <Link
            to="/landing"
            className={`px-4 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all ${
              isActive('/landing') || isActive('/')
                ? 'bg-obsidian text-gold shadow-sm font-bold'
                : 'text-gray-600 dark:text-gray-300 hover:text-gold'
            }`}
          >
            <Home className="w-3.5 h-3.5" />
            Beranda
          </Link>

          <Link
            to="/explore"
            className={`px-4 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all ${
              isActive('/explore')
                ? 'bg-obsidian text-gold shadow-sm font-bold'
                : 'text-gray-600 dark:text-gray-300 hover:text-gold'
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            Jelajah Konser
          </Link>

          {/* About link — always visible but especially useful for guests */}
          {!currentUser && (
            <Link
              to="/about"
              className={`px-4 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all ${
                isActive('/about')
                  ? 'bg-obsidian text-gold shadow-sm font-bold'
                  : 'text-gray-600 dark:text-gray-300 hover:text-gold'
              }`}
            >
              <Info className="w-3.5 h-3.5" />
              Tentang
            </Link>
          )}

          {currentUser && currentUser.role === 'CUSTOMER' && (
            <Link
              to="/my-tickets"
              className={`px-4 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all ${
                isActive('/my-tickets')
                  ? 'bg-obsidian text-gold shadow-sm font-bold'
                  : 'text-gray-600 dark:text-gray-300 hover:text-gold'
              }`}
            >
              <Ticket className="w-3.5 h-3.5" />
              Tiket Saya
            </Link>
          )}

          {(currentUser?.role === 'ADMIN' || currentUser?.role === 'SUPERADMIN') && (
            <Link
              to="/admin/dashboard"
              className="px-4 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 bg-oxblood text-white shadow-oxblood-glow hover:bg-oxblood-light transition-all"
            >
              <Shield className="w-3.5 h-3.5" />
              Dashboard Admin
            </Link>
          )}
        </div>

        {/* Right Tools */}
        <div className="flex items-center gap-2">
          {/* Notifications Icon (Admin only) */}
          {(currentUser?.role === 'ADMIN' || currentUser?.role === 'SUPERADMIN') && (
            <Link
              to="/admin/notifications"
              className="relative p-2 rounded-full bg-gray-100 dark:bg-obsidian-surface text-gray-700 dark:text-gold hover:scale-110 transition-transform mr-1"
              title="Notifikasi"
            >
              <Bell className="w-4 h-4" />
              {unreadNotificationCount > 0 && (
                <span className="absolute -top-1 -right-1 min-w-[16px] h-4 px-1 rounded-full bg-red-500 text-white text-[9px] font-extrabold flex items-center justify-center animate-bounce shadow-sm">
                  {unreadNotificationCount > 99 ? '99+' : unreadNotificationCount}
                </span>
              )}
            </Link>
          )}

          {/* Language Switcher Icon */}
          <div className="relative" ref={langRef}>
            <button
              onClick={() => setLangOpen(!langOpen)}
              className="p-2 rounded-full bg-gray-100 dark:bg-obsidian-surface text-gray-700 dark:text-gold hover:scale-110 transition-transform"
              title="Ganti Bahasa"
            >
              <Languages className="w-4 h-4" />
            </button>

            {langOpen && (
              <div className="absolute right-0 mt-2 w-40 bg-white dark:bg-obsidian-card border border-gold/20 dark:border-obsidian-border rounded-2xl shadow-2xl p-1.5 z-50 text-xs">
                <button
                  onClick={() => switchLanguage('id')}
                  className={`w-full text-left px-3 py-2 rounded-lg flex items-center gap-2 transition-colors ${
                    currentLang === 'id' ? 'bg-gold/10 text-gold font-bold' : 'text-gray-700 dark:text-gray-200 hover:bg-gold/10'
                  }`}
                >
                  🇮🇩 Bahasa Indonesia
                </button>
                <button
                  onClick={() => switchLanguage('en')}
                  className={`w-full text-left px-3 py-2 rounded-lg flex items-center gap-2 transition-colors ${
                    currentLang === 'en' ? 'bg-gold/10 text-gold font-bold' : 'text-gray-700 dark:text-gray-200 hover:bg-gold/10'
                  }`}
                >
                  🇬🇧 English
                </button>
              </div>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setLangOpen(!langOpen)}
              className="p-2 rounded-full bg-gray-100 dark:bg-obsidian-surface text-gray-700 dark:text-gold"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            {langOpen && (
              <div className="absolute right-0 mt-12 w-48 bg-white dark:bg-obsidian-card border border-gold/20 dark:border-obsidian-border rounded-2xl shadow-2xl p-2 z-50 text-sm flex flex-col gap-1">
                <Link to="/landing" className="px-3 py-2 rounded-lg hover:bg-gold/10 text-gray-700 dark:text-gray-200">Beranda</Link>
                <Link to="/explore" className="px-3 py-2 rounded-lg hover:bg-gold/10 text-gray-700 dark:text-gray-200">Jelajah Konser</Link>
                {!currentUser && <Link to="/about" className="px-3 py-2 rounded-lg hover:bg-gold/10 text-gray-700 dark:text-gray-200">Tentang</Link>}
                {currentUser?.role === 'CUSTOMER' && <Link to="/my-tickets" className="px-3 py-2 rounded-lg hover:bg-gold/10 text-gray-700 dark:text-gray-200">Tiket Saya</Link>}
                {(currentUser?.role === 'ADMIN' || currentUser?.role === 'SUPERADMIN') && (
                  <Link to="/admin/dashboard" className="px-3 py-2 rounded-lg hover:bg-gold/10 text-gray-700 dark:text-gray-200">Dashboard Admin</Link>
                )}
              </div>
            )}
          </div>

          {/* Dark Mode Toggle */}
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-full bg-gray-100 dark:bg-obsidian-surface text-gray-700 dark:text-gold hover:scale-110 transition-transform"
            title="Toggle Tema Dark/Light"
          >
            {darkMode ? <Sun className="w-4 h-4 text-gold" /> : <Moon className="w-4 h-4 text-obsidian" />}
          </button>

          {/* Profile Dropdown */}
          <div className="relative" ref={profileRef}>
            <button
              onClick={() => setProfileOpen(!profileOpen)}
              className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-full bg-obsidian text-white border border-gold/30 hover:border-gold transition-colors text-xs font-medium"
            >
              <div className="w-6 h-6 rounded-full bg-gold text-obsidian font-bold flex items-center justify-center text-[10px] overflow-hidden">
                {currentUser?.avatarUrl ? (
                  <img src={getImageUrl(currentUser.avatarUrl, 'users')} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  currentUser ? currentUser.fullName.charAt(0) : '?'
                )}
              </div>
              <span className="hidden sm:inline max-w-[100px] truncate">
                {currentUser ? currentUser.fullName : 'Tamu'}
              </span>
              <span className="bg-oxblood text-[9px] px-1.5 py-0.5 rounded-full font-semibold uppercase text-white">
                {currentUser ? currentUser.role : 'GUEST'}
              </span>
            </button>

            {/* Dropdown Menu */}
            {profileOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-obsidian-card border border-gold/20 dark:border-obsidian-border rounded-2xl shadow-2xl p-2 z-50 text-xs">
                <div className="px-3 py-2 border-b border-gray-100 dark:border-obsidian-border">
                  <p className="font-bold text-gray-900 dark:text-white truncate">
                    {currentUser ? currentUser.fullName : 'Pengunjung Tamu'}
                  </p>
                  <p className="text-[11px] text-gray-500 dark:text-gray-400 truncate">
                    {currentUser ? currentUser.email : 'Belum Login'}
                  </p>
                </div>

                {currentUser ? (
                  <>
                    {currentUser.role === 'CUSTOMER' && (
                      <div className="py-1">
                        <Link
                          to="/my-tickets"
                          onClick={() => setProfileOpen(false)}
                          className="w-full text-left px-3 py-1.5 rounded-lg hover:bg-gold/10 flex items-center gap-2 text-gray-700 dark:text-gray-200"
                        >
                          <Ticket className="w-3.5 h-3.5 text-gold" />
                          Tiket Saya
                        </Link>
                      </div>
                    )}
                    <div className="py-1 border-t border-gray-100 dark:border-obsidian-border">
                      <Link
                        to="/settings"
                        onClick={() => setProfileOpen(false)}
                        className="w-full text-left px-3 py-1.5 rounded-lg hover:bg-gold/10 flex items-center gap-2 text-gray-700 dark:text-gray-200"
                      >
                        <Settings className="w-3.5 h-3.5 text-gold" />
                        Pengaturan Akun
                      </Link>
                    </div>
                    <div className="pt-1 border-t border-gray-100 dark:border-obsidian-border">
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-3 py-1.5 rounded-lg hover:bg-oxblood/10 text-oxblood dark:text-red-400 flex items-center gap-2 font-semibold"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        Logout
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="pt-1 border-t border-gray-100 dark:border-obsidian-border space-y-1">
                    <Link
                      to="/login"
                      onClick={() => setProfileOpen(false)}
                      className="block w-full text-center py-1.5 rounded-lg bg-gold text-obsidian font-bold"
                    >
                      Login
                    </Link>
                    <Link
                      to="/register"
                      onClick={() => setProfileOpen(false)}
                      className="block w-full text-center py-1.5 rounded-lg bg-obsidian text-white border border-gold/30 font-bold"
                    >
                      Daftar Akun
                    </Link>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

      </nav>
    </header>
  );
}
