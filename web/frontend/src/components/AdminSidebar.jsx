import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import {
  LayoutDashboard,
  Calendar,
  CheckSquare,
  Users,
  FileText,
  LogOut,
  ShieldCheck,
  Sparkles,
  Settings,
  Bell,
  MessageCircle,
  Disc3,
} from 'lucide-react';
import logoSvg from '../assets/logo.svg';
import { getImageUrl } from '../utils/image';

export default function AdminSidebar() {
  const { currentUser, performLogout, unreadCount } = useStore();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;
  const isSuperadmin = currentUser?.role === 'SUPERADMIN';

  const navItemClass = (path) =>
    `flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all ${
      isActive(path)
        ? 'bg-gold text-obsidian font-bold shadow-gold-glow'
        : 'text-gray-600 hover:bg-gray-100/80 dark:text-gray-300 dark:hover:bg-obsidian-surface hover:text-gray-900 dark:hover:text-gold'
    }`;

  return (
    <aside className="w-64 shrink-0 bg-white dark:bg-obsidian text-gray-900 dark:text-brand-lightText border-r border-gray-200 dark:border-obsidian-border flex flex-col justify-between h-screen sticky top-0 z-40 transition-colors">
      <div className="flex flex-col min-h-0 flex-1">
        {/* Sidebar Header / Brand Logo */}
        <div className="px-5 py-5 border-b border-gray-200 dark:border-obsidian-border">
          <Link to="/admin/dashboard" className="flex items-center gap-3.5 group">
            <div className="w-11 h-11 rounded-full bg-obsidian border border-gold/40 flex items-center justify-center overflow-hidden shadow-gold-glow shrink-0 group-hover:scale-105 transition-transform">
              <img src={logoSvg} alt="VISCERAL.CO" className="w-full h-full object-cover scale-105" />
            </div>
            <div className="min-w-0">
              <h1 className="font-extrabold text-lg tracking-wide leading-none text-gray-900 dark:text-white">
                VISCERAL<span className="text-gold">.CO</span>
              </h1>
              {isSuperadmin && (
                <span className="text-[10px] text-oxblood dark:text-gold font-extrabold tracking-[0.18em] uppercase block mt-1.5">
                  Admin Panel
                </span>
              )}
            </div>
          </Link>
        </div>

        {/* Navigation Menu */}
        <nav className="p-4 space-y-1.5 overflow-y-auto flex-1">
          <p className="px-3 text-[10px] uppercase font-bold text-gray-400 dark:text-gray-500 tracking-widest mb-2">
            Operasional
          </p>

          <Link to="/admin/dashboard" className={navItemClass('/admin/dashboard')}>
            <span className="flex items-center gap-3">
              <LayoutDashboard className="w-4 h-4 shrink-0" />
              Dashboard Monitoring
            </span>
          </Link>

          <Link to="/admin/verification" className={navItemClass('/admin/verification')}>
            <span className="flex items-center gap-3">
              <CheckSquare className="w-4 h-4 shrink-0" />
              Verifikasi & Refund
            </span>
          </Link>

          <Link to="/admin/scanner" className={navItemClass('/admin/scanner')}>
            <span className="flex items-center gap-3">
              <ShieldCheck className="w-4 h-4 shrink-0" />
              Scanner Gate
            </span>
          </Link>

          <Link to="/admin/notifications" className={navItemClass('/admin/notifications')}>
            <span className="flex items-center gap-3">
              <Bell className="w-4 h-4 shrink-0" />
              Notifikasi
            </span>
            {unreadCount > 0 && (
              <span
                className={`px-1.5 py-0.5 rounded-full text-[10px] font-extrabold ${
                  isActive('/admin/notifications')
                    ? 'bg-obsidian text-gold'
                    : 'bg-red-500 text-white'
                }`}
              >
                {unreadCount > 99 ? '99+' : unreadCount}
              </span>
            )}
          </Link>

          <Link to="/admin/chat" className={navItemClass('/admin/chat')}>
            <span className="flex items-center gap-3">
              <MessageCircle className="w-4 h-4 shrink-0" />
              Customer Support
            </span>
          </Link>

          <Link to="/admin/settings" className={navItemClass('/admin/settings')}>
            <span className="flex items-center gap-3">
              <Settings className="w-4 h-4 shrink-0" />
              Pengaturan Akun
            </span>
          </Link>

          {isSuperadmin && (
            <div className="pt-4 mt-3 border-t border-gray-200 dark:border-obsidian-border space-y-1.5">
              <p className="px-3 text-[10px] uppercase font-bold text-oxblood dark:text-gold tracking-widest mb-2 flex items-center gap-1.5">
                <Sparkles className="w-3 h-3" />
                Khusus Superadmin
              </p>

              <Link to="/admin/events" className={navItemClass('/admin/events')}>
                <span className="flex items-center gap-3">
                  <Calendar className="w-4 h-4 shrink-0" />
                  Kelola Event Konser
                </span>
              </Link>

              <Link to="/admin/artists" className={navItemClass('/admin/artists')}>
                <span className="flex items-center gap-3">
                  <Disc3 className="w-4 h-4 shrink-0" />
                  Kelola Data Artis
                </span>
              </Link>

              <Link to="/admin/reports" className={navItemClass('/admin/reports')}>
                <span className="flex items-center gap-3">
                  <FileText className="w-4 h-4 shrink-0" />
                  Laporan & Analitik
                </span>
              </Link>

              <Link to="/admin/users" className={navItemClass('/admin/users')}>
                <span className="flex items-center gap-3">
                  <Users className="w-4 h-4 shrink-0" />
                  Kelola User & Audit Log
                </span>
              </Link>
            </div>
          )}
        </nav>
      </div>

      {/* Sidebar Footer / User Profile */}
      <div className="p-3.5 border-t border-gray-200 dark:border-obsidian-border bg-gray-50 dark:bg-obsidian-dark/50">
        <div className="flex items-center justify-between bg-white dark:bg-obsidian-surface p-2.5 rounded-xl border border-gray-200 dark:border-obsidian-border shadow-sm gap-2">
          <div className="flex items-center gap-2.5 overflow-hidden">
            <div className="w-9 h-9 rounded-full bg-gold text-obsidian font-bold flex items-center justify-center text-xs shrink-0 shadow-gold-glow overflow-hidden">
              {currentUser?.avatarUrl ? (
                <img
                  src={getImageUrl(currentUser.avatarUrl, 'users')}
                  alt="Avatar"
                  className="w-full h-full object-cover"
                />
              ) : (
                currentUser ? currentUser.fullName.charAt(0) : 'A'
              )}
            </div>
            <div className="truncate">
              <p className="text-xs font-bold text-gray-900 dark:text-white truncate">
                {currentUser ? currentUser.fullName : 'Admin'}
              </p>
              {currentUser?.email && (
                <p className="text-[10px] text-gray-500 dark:text-gray-400 truncate">
                  {currentUser.email}
                </p>
              )}
              <span
                className={`inline-block text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded mt-1 ${
                  isSuperadmin
                    ? 'bg-gold/20 text-oxblood dark:text-gold border border-gold/40'
                    : 'bg-oxblood text-white'
                }`}
              >
                {currentUser?.role || 'ADMIN'}
              </span>
            </div>
          </div>
          <button
            onClick={performLogout}
            className="p-2 rounded-lg text-gray-400 hover:text-oxblood dark:hover:text-red-400 hover:bg-gray-100 dark:hover:bg-obsidian transition-colors shrink-0"
            title="Keluar"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}
