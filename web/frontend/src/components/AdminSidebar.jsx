import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { LayoutDashboard, Calendar, CheckSquare, Users, FileText, ArrowLeft, LogOut, ShieldCheck, Sparkles, Settings, Bell, MessageCircle } from 'lucide-react';
import logoPng from '../assets/logo.png';
import { getImageUrl } from '../utils/image';

export default function AdminSidebar() {
  const { currentUser, performLogout } = useStore();
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path) => location.pathname === path;

  const isSuperadmin = currentUser?.role === 'SUPERADMIN';

  return (
    <aside className="w-64 bg-white dark:bg-obsidian text-gray-900 dark:text-brand-lightText border-r border-gray-200 dark:border-obsidian-border flex flex-col justify-between h-screen sticky top-0 z-40 transition-colors">
      <div>
        {/* Sidebar Header / Logo */}
        <div className="p-5 border-b border-gray-200 dark:border-obsidian-border flex items-center justify-between">
          <Link to="/admin/dashboard" className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-gray-50 dark:bg-obsidian-surface border border-gold/40 flex items-center justify-center p-1.5 shadow-gold-glow">
              <img src={logoPng} alt="VISCERAL.CO" className="w-full h-full object-contain" />
            </div>
            <div>
              <h1 className="font-extrabold text-sm tracking-wider text-gray-900 dark:text-white">
                VISCERAL<span className="text-gold">.CO</span>
              </h1>
              <span className="text-[10px] text-oxblood font-bold tracking-widest uppercase block -mt-1">
                Admin Panel
              </span>
            </div>
          </Link>
        </div>

        {/* Navigation Menu */}
        <nav className="p-3 space-y-1">
          <p className="px-3 text-[10px] uppercase font-bold text-gray-400 tracking-wider mb-2">
            Main Menu
          </p>

          <Link
            to="/admin/dashboard"
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${
              isActive('/admin/dashboard')
                ? 'bg-gold text-obsidian font-bold shadow-gold-glow'
                : 'text-gray-600 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-obsidian-surface hover:text-gold'
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            Dashboard Monitoring
          </Link>

          <Link
            to="/admin/events"
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${
              isActive('/admin/events')
                ? 'bg-gold text-obsidian font-bold shadow-gold-glow'
                : 'text-gray-600 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-obsidian-surface hover:text-gold'
            }`}
          >
            <Calendar className="w-4 h-4" />
            Kelola Event Konser
          </Link>

          <Link
            to="/admin/artists"
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${
              isActive('/admin/artists')
                ? 'bg-gold text-obsidian font-bold shadow-gold-glow'
                : 'text-gray-600 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-obsidian-surface hover:text-gold'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            Kelola Data Artis
          </Link>

          <Link
            to="/admin/verification"
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${
              isActive('/admin/verification')
                ? 'bg-gold text-obsidian font-bold shadow-gold-glow'
                : 'text-gray-600 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-obsidian-surface hover:text-gold'
            }`}
          >
            <CheckSquare className="w-4 h-4" />
            Verifikasi & Refund
          </Link>

          <Link
            to="/admin/scanner"
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${
              isActive('/admin/scanner')
                ? 'bg-gold text-obsidian font-bold shadow-gold-glow'
                : 'text-gray-600 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-obsidian-surface hover:text-gold'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            Scanner Gate
          </Link>

          <Link
            to="/admin/notifications"
            className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${
              isActive('/admin/notifications')
                ? 'bg-gold text-obsidian font-bold shadow-gold-glow'
                : 'text-gray-600 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-obsidian-surface hover:text-gold'
            }`}
          >
            <div className="flex items-center gap-3">
              <Bell className="w-4 h-4" />
              Notifikasi
            </div>
            {/* Realtime badge will go here later if needed */}
          </Link>

          <Link
            to="/admin/reports"
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${
              isActive('/admin/reports')
                ? 'bg-gold text-obsidian font-bold shadow-gold-glow'
                : 'text-gray-600 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-obsidian-surface hover:text-gold'
            }`}
          >
            <FileText className="w-4 h-4" />
            Laporan & Analitik
          </Link>

          <Link
            to="/admin/chat"
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${
              isActive('/admin/chat')
                ? 'bg-gold text-obsidian font-bold shadow-gold-glow'
                : 'text-gray-600 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-obsidian-surface hover:text-gold'
            }`}
          >
            <MessageCircle className="w-4 h-4" />
            Customer Support
          </Link>

          <Link
            to="/admin/settings"
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${
              isActive('/admin/settings')
                ? 'bg-gold text-obsidian font-bold shadow-gold-glow'
                : 'text-gray-600 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-obsidian-surface hover:text-gold'
            }`}
          >
            <Settings className="w-4 h-4" />
            Pengaturan Akun
          </Link>

          {isSuperadmin && (
            <>
              <p className="px-3 text-[10px] uppercase font-bold text-gold tracking-wider mt-4 mb-2 flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                Superadmin Only
              </p>

              <Link
                to="/admin/users"
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${
                  isActive('/admin/users')
                    ? 'bg-gold text-obsidian font-bold shadow-gold-glow'
                    : 'text-gray-600 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-obsidian-surface hover:text-gold'
                }`}
              >
                <Users className="w-4 h-4" />
                Kelola User & Audit Log
              </Link>

            </>
          )}
        </nav>
      </div>

      {/* Sidebar Footer / User Profile */}
      <div className="p-3 border-t border-gray-200 dark:border-obsidian-border bg-gray-50 dark:bg-obsidian-dark/50">


        <div className="flex items-center justify-between bg-white dark:bg-obsidian-surface p-2.5 rounded-xl border border-gray-200 dark:border-obsidian-border shadow-sm">
          <div className="flex items-center gap-2 overflow-hidden">
            <div className="w-8 h-8 rounded-full bg-gold text-obsidian font-bold flex items-center justify-center text-xs shrink-0 shadow-gold-glow overflow-hidden">
              {currentUser?.avatarUrl ? (
                <img src={getImageUrl(currentUser.avatarUrl, 'users')} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                currentUser ? currentUser.fullName.charAt(0) : 'A'
              )}
            </div>
            <div className="truncate">
              <p className="text-xs font-bold text-gray-900 dark:text-white truncate">
                {currentUser ? currentUser.fullName : 'Admin'}
              </p>
              <span className="inline-block text-[9px] font-extrabold uppercase px-1.5 py-0.2 rounded bg-oxblood text-white mt-0.5">
                {currentUser?.role || 'ADMIN'}
              </span>
            </div>
          </div>
          <button
            onClick={() => {
              performLogout();
            }}
            className="p-1.5 rounded-lg text-gray-400 hover:text-oxblood-light hover:bg-gray-100 dark:hover:bg-obsidian"
            title="Logout"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}
