import React from 'react';
import { useStore } from '../context/StoreContext';
import { Link } from 'react-router-dom';
import { Search, Bell, Sun, Moon, ShieldCheck, Sparkles } from 'lucide-react';

export default function AdminTopbar({ title = 'Dashboard Monitoring' }) {
  const { darkMode, toggleDarkMode, currentUser, unreadNotificationCount } = useStore();

  return (
    <header className="h-16 bg-white dark:bg-obsidian border-b border-gray-200 dark:border-obsidian-border px-6 flex items-center justify-between sticky top-0 z-30 transition-colors">
      <div className="flex items-center gap-3">
        <h1 className="text-lg font-bold text-gray-900 dark:text-white tracking-tight flex items-center gap-2">
          {title}
        </h1>
        {currentUser?.role === 'SUPERADMIN' ? (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-gold/20 text-gold border border-gold/40 flex items-center gap-1">
            <Sparkles className="w-3 h-3" />
            SUPERADMIN MODE
          </span>
        ) : (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-blue-500/10 text-blue-400 border border-blue-500/30 flex items-center gap-1">
            <ShieldCheck className="w-3 h-3" />
            STAFF ADMIN
          </span>
        )}
      </div>

      <div className="flex items-center gap-4">
        {/* Search Bar */}
        <div className="relative hidden md:block">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Cari transaksi, event, artis..."
            className="pl-9 pr-4 py-1.5 rounded-full text-xs bg-gray-100 dark:bg-obsidian-surface border border-transparent dark:border-obsidian-border text-gray-800 dark:text-gray-200 focus:outline-none focus:border-gold w-64 transition-all"
          />
        </div>

        {/* Notifications */}
        <Link to="/admin/notifications" className="relative p-2 rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-obsidian-surface">
          <Bell className="w-4 h-4" />
          {unreadNotificationCount > 0 && (
            <span className="absolute -top-1 -right-1 min-w-[16px] h-4 px-1 rounded-full bg-red-500 text-white text-[9px] font-extrabold flex items-center justify-center animate-bounce shadow-sm">
              {unreadNotificationCount > 99 ? '99+' : unreadNotificationCount}
            </span>
          )}
        </Link>

        {/* Dark Mode Toggle */}
        <button
          onClick={toggleDarkMode}
          className="p-2 rounded-full text-gray-600 dark:text-gold hover:bg-gray-100 dark:hover:bg-obsidian-surface"
          title="Toggle Dark Mode"
        >
          {darkMode ? <Sun className="w-4 h-4 text-gold" /> : <Moon className="w-4 h-4 text-obsidian" />}
        </button>
      </div>
    </header>
  );
}
