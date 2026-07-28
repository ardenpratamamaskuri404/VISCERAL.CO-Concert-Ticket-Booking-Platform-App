import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { Sun, Moon, Ticket, User, LogOut, Shield, Compass, Home, Bell, Sparkles } from 'lucide-react';
import logoPng from '../assets/logo.png';

export default function Navbar() {
  const { darkMode, toggleDarkMode, currentUser, logoutUser, setCurrentUser } = useStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [profileOpen, setProfileOpen] = useState(false);

  const isActive = (path) => location.pathname === path;

  const handleRoleSwitch = (role) => {
    if (role === 'SUPERADMIN') {
      setCurrentUser({
        id: 'user-superadmin-1',
        fullName: 'Superadmin Visceral',
        email: 'superadmin@visceral.co',
        role: 'SUPERADMIN'
      });
      navigate('/admin/dashboard');
    } else if (role === 'ADMIN') {
      setCurrentUser({
        id: 'user-admin-1',
        fullName: 'Admin Ops Jakarta',
        email: 'admin@visceral.co',
        role: 'ADMIN'
      });
      navigate('/admin/dashboard');
    } else if (role === 'CUSTOMER') {
      setCurrentUser({
        id: 'user-cust-1',
        fullName: 'Budi Pratama',
        email: 'budi@gmail.com',
        role: 'CUSTOMER'
      });
      navigate('/explore');
    } else {
      logoutUser();
      navigate('/landing');
    }
    setProfileOpen(false);
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
            Home
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
          {/* Dark Mode Toggle */}
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-full bg-gray-100 dark:bg-obsidian-surface text-gray-700 dark:text-gold hover:scale-110 transition-transform"
            title="Toggle Tema Dark/Light"
          >
            {darkMode ? <Sun className="w-4 h-4 text-gold" /> : <Moon className="w-4 h-4 text-obsidian" />}
          </button>

          {/* Quick Demo Role Selector Dropdown */}
          <div className="relative">
            <button
              onClick={() => setProfileOpen(!profileOpen)}
              className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-full bg-obsidian text-white border border-gold/30 hover:border-gold transition-colors text-xs font-medium"
            >
              <div className="w-6 h-6 rounded-full bg-gold text-obsidian font-bold flex items-center justify-center text-[10px]">
                {currentUser ? currentUser.fullName.charAt(0) : '?'}
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
              <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-obsidian-card border border-gold/20 dark:border-obsidian-border rounded-2xl shadow-2xl p-2 z-50 text-xs animate-in fade-in zoom-in-95 duration-150">
                <div className="px-3 py-2 border-b border-gray-100 dark:border-obsidian-border">
                  <p className="font-bold text-gray-900 dark:text-white truncate">
                    {currentUser ? currentUser.fullName : 'Pengunjung Tamu'}
                  </p>
                  <p className="text-[11px] text-gray-500 dark:text-gray-400 truncate">
                    {currentUser ? currentUser.email : 'Belum Login'}
                  </p>
                </div>

                <div className="py-1">
                  <p className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-gold">
                    Switch Role Demo
                  </p>
                  <button
                    onClick={() => handleRoleSwitch('CUSTOMER')}
                    className="w-full text-left px-3 py-1.5 rounded-lg hover:bg-gold/10 flex items-center gap-2 text-gray-700 dark:text-gray-200"
                  >
                    <User className="w-3.5 h-3.5 text-gold" />
                    Customer (Budi)
                  </button>
                  <button
                    onClick={() => handleRoleSwitch('ADMIN')}
                    className="w-full text-left px-3 py-1.5 rounded-lg hover:bg-gold/10 flex items-center gap-2 text-gray-700 dark:text-gray-200"
                  >
                    <Shield className="w-3.5 h-3.5 text-blue-400" />
                    Admin (Ops)
                  </button>
                  <button
                    onClick={() => handleRoleSwitch('SUPERADMIN')}
                    className="w-full text-left px-3 py-1.5 rounded-lg hover:bg-gold/10 flex items-center gap-2 text-gray-700 dark:text-gray-200"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                    Superadmin
                  </button>
                </div>

                {currentUser ? (
                  <div className="pt-1 border-t border-gray-100 dark:border-obsidian-border">
                    <button
                      onClick={() => handleRoleSwitch('GUEST')}
                      className="w-full text-left px-3 py-1.5 rounded-lg hover:bg-oxblood/10 text-oxblood dark:text-red-400 flex items-center gap-2 font-semibold"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      Logout
                    </button>
                  </div>
                ) : (
                  <div className="pt-1 border-t border-gray-100 dark:border-obsidian-border">
                    <Link
                      to="/login"
                      onClick={() => setProfileOpen(false)}
                      className="block w-full text-center py-1.5 rounded-lg bg-gold text-obsidian font-bold"
                    >
                      Login / Register
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
