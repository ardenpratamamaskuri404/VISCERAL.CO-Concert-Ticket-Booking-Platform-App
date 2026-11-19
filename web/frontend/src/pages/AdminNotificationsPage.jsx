import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { useStore } from '../context/StoreContext';
import AdminSidebar from '../components/AdminSidebar';
import AdminTopbar from '../components/AdminTopbar';
import {
  Bell,
  UserPlus,
  Ticket,
  Sparkles,
  CheckCircle2,
  History,
  MessageCircle,
  Filter,
  CheckCheck,
  ShieldCheck,
  RefreshCw,
} from 'lucide-react';
import api from '../api/axios';

const AUDIT_ACTION_LABELS = {
  LOGIN_OTP_VERIFIED: {
    title: 'Verifikasi Login OTP',
    verb: 'berhasil login dengan verifikasi OTP',
  },
  CREATE_ORDER: {
    title: 'Pesanan Tiket Baru',
    verb: 'membuat pesanan tiket baru',
  },
  APPROVE_ORDER: {
    title: 'Persetujuan Pembayaran',
    verb: 'menyetujui pembayaran pesanan',
  },
  REJECT_ORDER: {
    title: 'Penolakan Pesanan',
    verb: 'menolak pesanan tiket',
  },
  APPROVE_REFUND: {
    title: 'Refund Disetujui',
    verb: 'menyetujui pengajuan refund',
  },
  REJECT_REFUND: {
    title: 'Refund Ditolak',
    verb: 'menolak pengajuan refund',
  },
  CHECKIN_TICKET: {
    title: 'Check-In Gate',
    verb: 'memvalidasi check-in tiket di gate',
  },
  CREATE_EVENT: {
    title: 'Event Baru Dibuat',
    verb: 'menambahkan event konser baru',
  },
  UPDATE_EVENT: {
    title: 'Pembaruan Event',
    verb: 'memperbarui informasi event konser',
  },
  DELETE_EVENT: {
    title: 'Penghapusan Event',
    verb: 'menghapus event konser',
  },
  TOGGLE_SALES_CLOSED: {
    title: 'Status Penjualan Tiket',
    verb: 'mengubah status buka/tutup penjualan tiket',
  },
  CREATE_USER: {
    title: 'Akun Pengguna Baru',
    verb: 'menambahkan akun pengguna baru',
  },
  UPDATE_USER_ROLE: {
    title: 'Perubahan Hak Akses',
    verb: 'memperbarui role pengguna',
  },
  DELETE_USER: {
    title: 'Penghapusan Pengguna',
    verb: 'menghapus akun pengguna',
  },
};

const formatAuditLog = (log) => {
  const actor = log.user?.fullName || 'Sistem';
  const mapped = AUDIT_ACTION_LABELS[log.action];
  const orderNum = log.metadata?.orderNumber ? ` (${log.metadata.orderNumber})` : '';
  const eventTitle = log.metadata?.title ? ` — ${log.metadata.title}` : '';

  return {
    id: `audit-${log.id}`,
    rawId: log.id,
    title: mapped ? mapped.title : 'Aktivitas Sistem',
    message: mapped
      ? `${actor} ${mapped.verb}${orderNum}${eventTitle}.`
      : `${actor} menjalankan aktivitas ${log.action.replace(/_/g, ' ').toLowerCase()}.`,
    type: 'AUDIT_LOG',
    isRead: true,
    createdAt: log.createdAt,
  };
};

export default function AdminNotificationsPage() {
  const {
    currentUser,
    adminNotifications,
    auditLogs,
    markAllNotificationsRead,
    markSingleNotificationRead,
  } = useStore();

  const [notifications, setNotifications] = useState([]);
  const [activeTab, setActiveTab] = useState('ALL');
  const [loading, setLoading] = useState(true);

  const isSuperadmin = currentUser?.role === 'SUPERADMIN';

  const fetchNotifications = useCallback(async () => {
    if (!currentUser) return;
    try {
      let combined = [];
      const res = await api.get('/notifications');
      if (res.data?.success && Array.isArray(res.data.notifications)) {
        combined = res.data.notifications.map((n) => ({
          ...n,
          rawId: n.id,
        }));
      }

      // Log aktivitas sistem hanya ditampilkan khusus untuk Superadmin
      if (isSuperadmin) {
        const auditRes = await api.get('/users/audit-logs');
        if (auditRes.data?.data && Array.isArray(auditRes.data.data)) {
          const formattedLogs = auditRes.data.data.map(formatAuditLog);
          combined = [...combined, ...formattedLogs];
        }
      }

      combined.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setNotifications(combined);
    } catch (error) {
      console.error('Failed to fetch notifications', error);
    } finally {
      setLoading(false);
    }
  }, [currentUser, isSuperadmin]);

  // Auto-refresh saat masuk halaman atau ketika ada event real-time dari StoreContext
  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications, adminNotifications.length, auditLogs.length]);

  const markAllAsRead = async () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    await markAllNotificationsRead();
  };

  const markSingleRead = async (notif) => {
    if (notif.isRead || notif.type === 'AUDIT_LOG') return;
    setNotifications((prev) =>
      prev.map((n) => (n.id === notif.id ? { ...n, isRead: true } : n))
    );
    await markSingleNotificationRead(notif.rawId);
  };

  const stats = useMemo(() => {
    const unread = notifications.filter((n) => !n.isRead).length;
    const orders = notifications.filter((n) => n.type === 'ORDER' || n.type === 'NEW_ORDER').length;
    const audits = notifications.filter((n) => n.type === 'AUDIT_LOG').length;
    const read = notifications.filter((n) => n.isRead && n.type !== 'AUDIT_LOG').length;
    return { total: notifications.length, unread, orders, audits, read };
  }, [notifications]);

  const filteredNotifications = useMemo(() => {
    if (activeTab === 'UNREAD') return notifications.filter((n) => !n.isRead);
    if (activeTab === 'ORDER') {
      return notifications.filter((n) => n.type === 'ORDER' || n.type === 'NEW_ORDER');
    }
    if (activeTab === 'AUDIT') return notifications.filter((n) => n.type === 'AUDIT_LOG');
    return notifications;
  }, [notifications, activeTab]);

  const getBadgeMeta = (type) => {
    switch (type) {
      case 'ORDER':
      case 'NEW_ORDER':
        return {
          icon: <Ticket className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />,
          bg: 'bg-emerald-500/10 border-emerald-500/20',
          label: 'Pesanan',
          pill: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20',
        };
      case 'CHAT':
        return {
          icon: <MessageCircle className="w-4 h-4 text-blue-600 dark:text-blue-400" />,
          bg: 'bg-blue-500/10 border-blue-500/20',
          label: 'Pesan',
          pill: 'bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20',
        };
      case 'AUDIT_LOG':
        return {
          icon: <ShieldCheck className="w-4 h-4 text-purple-600 dark:text-purple-400" />,
          bg: 'bg-purple-500/10 border-purple-500/20',
          label: 'Audit Sistem',
          pill: 'bg-purple-500/10 text-purple-700 dark:text-purple-400 border-purple-500/20',
        };
      case 'NEW_USER':
        return {
          icon: <UserPlus className="w-4 h-4 text-sky-600 dark:text-sky-400" />,
          bg: 'bg-sky-500/10 border-sky-500/20',
          label: 'Pengguna',
          pill: 'bg-sky-500/10 text-sky-700 dark:text-sky-400 border-sky-500/20',
        };
      default:
        return {
          icon: <Bell className="w-4 h-4 text-oxblood dark:text-gold" />,
          bg: 'bg-gold/10 border-gold/25',
          label: 'Sistem',
          pill: 'bg-gold/10 text-oxblood dark:text-gold border-gold/25',
        };
    }
  };

  const formatDateTime = (iso) => {
    const d = new Date(iso);
    return d.toLocaleString('id-ID', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="min-h-screen bg-brand-bgLight dark:bg-obsidian-dark flex transition-colors text-brand-darkText dark:text-brand-lightText">
      <AdminSidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <AdminTopbar title="Notifikasi & Aktivitas" />

        <main className="p-6 md:p-8 overflow-y-auto">
          <div className="max-w-6xl mx-auto space-y-6">
            {/* Header Row */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-extrabold text-gray-900 dark:text-white flex items-center gap-2.5">
                  <Bell className="w-5 h-5 text-oxblood dark:text-gold" />
                  Pusat Notifikasi Terbaru
                </h2>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {isSuperadmin
                    ? 'Pantau seluruh pesanan masuk, pesan pelanggan, dan log audit sistem secara real-time.'
                    : 'Pantau pesanan tiket masuk dan notifikasi operasional terbaru secara real-time.'}
                </p>
              </div>

              <div className="flex items-center gap-2.5">
                <button
                  onClick={fetchNotifications}
                  className="px-3.5 py-2 rounded-xl text-xs font-bold bg-white dark:bg-obsidian-card border border-gray-200 dark:border-obsidian-border text-gray-700 dark:text-gray-300 hover:border-gold flex items-center gap-1.5 transition-all"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  Segarkan
                </button>
                <button
                  onClick={markAllAsRead}
                  disabled={stats.unread === 0}
                  className="px-4 py-2 rounded-xl text-xs font-extrabold bg-gold text-obsidian shadow-gold-glow hover:opacity-95 disabled:opacity-40 flex items-center gap-1.5 transition-all"
                >
                  <CheckCheck className="w-4 h-4" />
                  Tandai Semua Dibaca
                </button>
              </div>
            </div>

            {/* Summary KPI Strip */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white dark:bg-obsidian-card p-4 rounded-2xl border border-gray-200 dark:border-obsidian-border shadow-sm">
                <p className="text-[11px] font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  Total Item
                </p>
                <p className="text-2xl font-extrabold text-gray-900 dark:text-white mt-1">{stats.total}</p>
              </div>
              <div className="bg-white dark:bg-obsidian-card p-4 rounded-2xl border border-gray-200 dark:border-obsidian-border shadow-sm">
                <p className="text-[11px] font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  Belum Dibaca
                </p>
                <p className="text-2xl font-extrabold text-oxblood dark:text-gold mt-1">{stats.unread}</p>
              </div>
              <div className="bg-white dark:bg-obsidian-card p-4 rounded-2xl border border-gray-200 dark:border-obsidian-border shadow-sm">
                <p className="text-[11px] font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  Pesanan & Transaksi
                </p>
                <p className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-1">{stats.orders}</p>
              </div>
              <div className="bg-white dark:bg-obsidian-card p-4 rounded-2xl border border-gray-200 dark:border-obsidian-border shadow-sm">
                <p className="text-[11px] font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  {isSuperadmin ? 'Aktivitas Audit' : 'Sudah Dibaca'}
                </p>
                <p className="text-2xl font-extrabold text-purple-600 dark:text-purple-400 mt-1">
                  {isSuperadmin ? stats.audits : stats.read}
                </p>
              </div>
            </div>

            {/* Filter Tabs */}
            <div className="flex flex-wrap items-center justify-between gap-3 bg-white dark:bg-obsidian-card p-3 rounded-2xl border border-gray-200 dark:border-obsidian-border shadow-sm">
              <div className="flex items-center gap-2 overflow-x-auto">
                <Filter className="w-4 h-4 text-gray-400 ml-1 shrink-0" />
                {[
                  { key: 'ALL', label: `Semua (${stats.total})` },
                  { key: 'UNREAD', label: `Belum Dibaca (${stats.unread})` },
                  { key: 'ORDER', label: `Pesanan (${stats.orders})` },
                  ...(isSuperadmin ? [{ key: 'AUDIT', label: `Aktivitas Sistem (${stats.audits})` }] : []),
                ].map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                      activeTab === tab.key
                        ? 'bg-obsidian dark:bg-gold text-gold dark:text-obsidian shadow-sm'
                        : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-obsidian-surface'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
              <span className="text-[11px] text-gray-400 hidden sm:inline px-2">
                Klik notifikasi belum dibaca untuk menandai telah dibaca
              </span>
            </div>

            {/* Notification List Card */}
            <div className="bg-white dark:bg-obsidian-card rounded-3xl border border-gray-200 dark:border-obsidian-border shadow-sm overflow-hidden">
              {loading ? (
                <div className="p-12 text-center text-xs text-gray-500 dark:text-gray-400">
                  Memuat daftar notifikasi...
                </div>
              ) : filteredNotifications.length === 0 ? (
                <div className="p-14 text-center text-gray-500 dark:text-gray-400">
                  <Sparkles className="w-9 h-9 mx-auto mb-3 text-gray-300 dark:text-obsidian-surface" />
                  <p className="text-sm font-bold text-gray-700 dark:text-gray-300">
                    Tidak ada notifikasi pada kategori ini.
                  </p>
                  <p className="text-xs mt-1">
                    Notifikasi terbaru akan muncul di sini secara otomatis.
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-gray-100 dark:divide-obsidian-border">
                  {filteredNotifications.map((notif) => {
                    const meta = getBadgeMeta(notif.type);
                    const isUnread = !notif.isRead;
                    return (
                      <div
                        key={notif.id}
                        onClick={() => markSingleRead(notif)}
                        className={`px-5 py-4 flex items-start gap-4 transition-colors ${
                          isUnread
                            ? 'bg-gold/5 dark:bg-gold/10 hover:bg-gold/10 dark:hover:bg-gold/15 cursor-pointer'
                            : 'hover:bg-gray-50 dark:hover:bg-obsidian-surface/60'
                        }`}
                      >
                        {/* Icon */}
                        <div
                          className={`w-10 h-10 rounded-2xl border flex items-center justify-center shrink-0 mt-0.5 ${meta.bg}`}
                        >
                          {meta.icon}
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-wrap items-center justify-between gap-2 mb-1">
                            <div className="flex items-center gap-2 min-w-0">
                              {isUnread && (
                                <span className="w-2 h-2 rounded-full bg-oxblood dark:bg-gold shrink-0"></span>
                              )}
                              <h3
                                className={`text-sm truncate ${
                                  isUnread
                                    ? 'font-extrabold text-gray-900 dark:text-white'
                                    : 'font-bold text-gray-800 dark:text-gray-200'
                                }`}
                              >
                                {notif.title}
                              </h3>
                              <span
                                className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${meta.pill}`}
                              >
                                {meta.label}
                              </span>
                            </div>

                            <span className="text-[11px] text-gray-400 font-semibold whitespace-nowrap">
                              {formatDateTime(notif.createdAt)} WIB
                            </span>
                          </div>

                          <p
                            className={`text-xs leading-relaxed ${
                              isUnread
                                ? 'text-gray-700 dark:text-gray-200 font-medium'
                                : 'text-gray-500 dark:text-gray-400'
                            }`}
                          >
                            {notif.message}
                          </p>
                        </div>

                        {/* Status icon */}
                        <div className="shrink-0 self-center hidden sm:block">
                          {isUnread ? (
                            <span className="text-[10px] font-extrabold uppercase px-2 py-1 rounded-lg bg-oxblood/10 dark:bg-gold/15 text-oxblood dark:text-gold">
                              Baru
                            </span>
                          ) : (
                            <CheckCircle2 className="w-4 h-4 text-gray-300 dark:text-gray-600" />
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
