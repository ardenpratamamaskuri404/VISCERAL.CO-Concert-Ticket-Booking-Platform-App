import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useStore } from '../context/StoreContext';
import { Link, useNavigate } from 'react-router-dom';
import {
  Search,
  Bell,
  Sun,
  Moon,
  ShieldCheck,
  Sparkles,
  Clock,
  Calendar,
  Disc3,
  Ticket,
  X,
} from 'lucide-react';
import { getImageUrl } from '../utils/image';

export default function AdminTopbar({ title = 'Dashboard Monitoring' }) {
  const {
    darkMode,
    toggleDarkMode,
    currentUser,
    unreadCount,
    sessionExpiresAt,
    events,
    artists,
    orders,
  } = useStore();
  const navigate = useNavigate();

  const [query, setQuery] = useState('');
  const [searchOpen, setSearchOpen] = useState(false);
  const [remainingSec, setRemainingSec] = useState(null);
  const searchRef = useRef(null);

  const isSuperadmin = currentUser?.role === 'SUPERADMIN';

  // Live countdown sisa waktu sesi login (sinkron dengan JWT exp)
  useEffect(() => {
    if (!sessionExpiresAt) {
      setRemainingSec(null);
      return;
    }
    const updateRemaining = () => {
      const diff = Math.max(0, Math.floor((new Date(sessionExpiresAt).getTime() - Date.now()) / 1000));
      setRemainingSec(diff);
    };
    updateRemaining();
    const interval = setInterval(updateRemaining, 1000);
    return () => clearInterval(interval);
  }, [sessionExpiresAt]);

  // Tutup dropdown pencarian saat klik di luar
  useEffect(() => {
    const handleOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setSearchOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  }, []);

  const formatCountdown = (sec) => {
    if (sec === null) return '--:--:--';
    const h = Math.floor(sec / 3600);
    const m = Math.floor((sec % 3600) / 60);
    const s = sec % 60;
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  const searchResults = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    const results = [];

    if (isSuperadmin) {
      events
        .filter((ev) => ev.title?.toLowerCase().includes(q) || ev.venueName?.toLowerCase().includes(q))
        .slice(0, 3)
        .forEach((ev) =>
          results.push({
            id: `ev-${ev.id}`,
            label: ev.title,
            sub: ev.venueName || 'Event Konser',
            type: 'Event',
            to: '/admin/events',
          })
        );

      artists
        .filter((art) => art.name?.toLowerCase().includes(q))
        .slice(0, 3)
        .forEach((art) =>
          results.push({
            id: `art-${art.id}`,
            label: art.name,
            sub: 'Data Artis',
            type: 'Artis',
            to: '/admin/artists',
          })
        );
    }

    orders
      .filter(
        (ord) =>
          ord.orderNumber?.toLowerCase().includes(q) ||
          ord.customerName?.toLowerCase().includes(q) ||
          ord.eventTitle?.toLowerCase().includes(q)
      )
      .slice(0, 4)
      .forEach((ord) =>
        results.push({
          id: `ord-${ord.id}`,
          label: ord.orderNumber || ord.id,
          sub: `${ord.customerName || 'Customer'} • ${ord.status}`,
          type: 'Pesanan',
          to: '/admin/verification',
        })
      );

    return results;
  }, [query, events, artists, orders, isSuperadmin]);

  const isExpiringSoon = remainingSec !== null && remainingSec <= 900; // < 15 menit

  return (
    <header className="h-16 bg-white dark:bg-obsidian border-b border-gray-200 dark:border-obsidian-border px-6 flex items-center justify-between gap-4 sticky top-0 z-30 transition-colors">
      {/* Left: Page Title & Role Badge */}
      <div className="flex items-center gap-3 min-w-0">
        <h1 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white tracking-tight truncate">
          {title}
        </h1>
        {isSuperadmin ? (
          <span className="hidden sm:inline-flex px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-gold/15 text-oxblood dark:text-gold border border-gold/40 items-center gap-1 shrink-0">
            <Sparkles className="w-3 h-3" />
            SUPERADMIN MODE
          </span>
        ) : (
          <span className="hidden sm:inline-flex px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/30 items-center gap-1 shrink-0">
            <ShieldCheck className="w-3 h-3" />
            STAFF ADMIN
          </span>
        )}
      </div>

      {/* Right: Search, Bell, Dark Mode, Session Timer & Quick Profile */}
      <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
        {/* Interactive Quick Search Bar */}
        <div ref={searchRef} className="relative hidden lg:block">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={query}
            onFocus={() => setSearchOpen(true)}
            onChange={(e) => {
              setQuery(e.target.value);
              setSearchOpen(true);
            }}
            placeholder={isSuperadmin ? 'Cari transaksi, event, artis...' : 'Cari nomor pesanan, pembeli...'}
            className="pl-9 pr-8 py-1.5 rounded-full text-xs bg-gray-100 dark:bg-obsidian-surface border border-gray-200/80 dark:border-obsidian-border text-gray-800 dark:text-gray-200 focus:outline-none focus:border-gold w-60 xl:w-64 transition-all"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 dark:hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}

          {searchOpen && query.trim().length > 0 && (
            <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-obsidian-card rounded-2xl border border-gray-200 dark:border-obsidian-border shadow-xl overflow-hidden z-50">
              {searchResults.length === 0 ? (
                <div className="p-4 text-center text-xs text-gray-500 dark:text-gray-400">
                  Tidak ditemukan hasil untuk "{query}"
                </div>
              ) : (
                <div className="divide-y divide-gray-100 dark:divide-obsidian-border max-h-72 overflow-y-auto">
                  {searchResults.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => {
                        setSearchOpen(false);
                        setQuery('');
                        navigate(item.to);
                      }}
                      className="w-full px-4 py-2.5 text-left hover:bg-gray-50 dark:hover:bg-obsidian-surface flex items-center justify-between gap-2 transition-colors"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        {item.type === 'Event' ? (
                          <Calendar className="w-3.5 h-3.5 text-gold shrink-0" />
                        ) : item.type === 'Artis' ? (
                          <Disc3 className="w-3.5 h-3.5 text-purple-500 shrink-0" />
                        ) : (
                          <Ticket className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                        )}
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-gray-900 dark:text-white truncate">{item.label}</p>
                          <p className="text-[10px] text-gray-500 dark:text-gray-400 truncate">{item.sub}</p>
                        </div>
                      </div>
                      <span className="text-[9px] font-bold uppercase px-1.5 py-0.5 rounded bg-gray-100 dark:bg-obsidian-dark text-gray-500 dark:text-gray-400 shrink-0">
                        {item.type}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Notifications */}
        <Link
          to="/admin/notifications"
          className="relative p-2 rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-obsidian-surface transition-colors"
          title="Notifikasi"
        >
          <Bell className="w-4 h-4" />
          {unreadCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 min-w-[16px] h-4 px-1 rounded-full bg-red-500 text-white text-[9px] font-extrabold flex items-center justify-center shadow-sm">
              {unreadCount > 99 ? '99+' : unreadCount}
            </span>
          )}
        </Link>

        {/* Dark Mode Toggle */}
        <button
          onClick={toggleDarkMode}
          className="p-2 rounded-full text-gray-600 dark:text-gold hover:bg-gray-100 dark:hover:bg-obsidian-surface transition-colors"
          title={darkMode ? 'Beralih ke Light Mode' : 'Beralih ke Dark Mode'}
        >
          {darkMode ? <Sun className="w-4 h-4 text-gold" /> : <Moon className="w-4 h-4 text-obsidian" />}
        </button>

        {/* Live Session Timer Pill */}
        {remainingSec !== null && (
          <div
            title="Sisa waktu sesi login sebelum logout otomatis"
            className={`hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-mono font-bold border transition-colors ${
              isExpiringSoon
                ? 'bg-amber-500/10 border-amber-500/40 text-amber-600 dark:text-amber-400'
                : 'bg-gray-100 dark:bg-obsidian-surface border-gray-200 dark:border-obsidian-border text-gray-700 dark:text-gray-300'
            }`}
          >
            <Clock className={`w-3.5 h-3.5 ${isExpiringSoon ? 'text-amber-500 animate-pulse' : 'text-oxblood dark:text-gold'}`} />
            <span>{formatCountdown(remainingSec)}</span>
          </div>
        )}

        {/* Divider */}
        <div className="hidden sm:block h-6 w-px bg-gray-200 dark:bg-obsidian-border mx-0.5"></div>

        {/* Quick Profile Chip */}
        <Link
          to="/admin/settings"
          title="Pengaturan Akun"
          className="flex items-center gap-2.5 pl-1.5 pr-3 py-1 rounded-full bg-gray-100/80 dark:bg-obsidian-surface border border-gray-200 dark:border-obsidian-border hover:border-gold/60 transition-all"
        >
          <div className="w-7 h-7 rounded-full bg-gold text-obsidian font-extrabold text-xs flex items-center justify-center overflow-hidden shrink-0">
            {currentUser?.avatarUrl ? (
              <img
                src={getImageUrl(currentUser.avatarUrl, 'users')}
                alt={currentUser.fullName}
                className="w-full h-full object-cover"
              />
            ) : (
              currentUser?.fullName?.charAt(0)?.toUpperCase() || 'A'
            )}
          </div>
          <div className="hidden sm:flex flex-col leading-tight max-w-[120px]">
            <span className="text-xs font-bold text-gray-900 dark:text-white truncate">
              {currentUser?.fullName || 'Staff'}
            </span>
            <span className="text-[9px] font-semibold text-gray-500 dark:text-gray-400 truncate">
              {isSuperadmin ? 'Superadmin' : 'Admin Ops'}
            </span>
          </div>
        </Link>
      </div>
    </header>
  );
}
