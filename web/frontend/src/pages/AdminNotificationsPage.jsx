import React, { useEffect, useState } from 'react';
import { useStore } from '../context/StoreContext';
import AdminSidebar from '../components/AdminSidebar';
import AdminTopbar from '../components/AdminTopbar';
import { Bell, UserPlus, Ticket, Sparkles, CheckCircle2, History } from 'lucide-react';
import api from '../api/axios';

export default function AdminNotificationsPage() {
  const { currentUser, setUnreadNotificationCount } = useStore();
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    fetchNotifications();
  }, [currentUser]);

  const fetchNotifications = async () => {
    try {
      let combined = [];
      const res = await api.get('/notifications');
      if (res.data?.success) {
        combined = [...res.data.notifications];
      }

      // If Superadmin, also fetch audit logs
      if (currentUser?.role === 'SUPERADMIN') {
        const auditRes = await api.get('/users/audit-logs');
        if (auditRes.data?.data) {
          const formattedLogs = auditRes.data.data.map(log => ({
            id: log.id,
            title: 'Sistem Activity',
            message: `${log.user?.fullName} melakukan: ${log.action}`,
            type: 'AUDIT_LOG',
            isRead: true, // Audit logs don't have read status natively
            createdAt: log.createdAt
          }));
          combined = [...combined, ...formattedLogs];
        }
      }

      // Sort combined by date descending
      combined.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setNotifications(combined);
    } catch (error) {
      console.error('Failed to fetch notifications', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      await api.put('/notifications/read-all');
      setUnreadNotificationCount(0);
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    } catch (error) {
      console.error('Failed to mark all as read', error);
    }
  };

  const getIcon = (type) => {
    switch (type) {
      case 'ORDER': return <Ticket className="w-5 h-5 text-green-500" />;
      case 'CHAT': return <UserPlus className="w-5 h-5 text-blue-500" />;
      case 'AUDIT_LOG': return <History className="w-5 h-5 text-purple-500" />;
      case 'NEW_ORDER': return <Ticket className="w-5 h-5 text-green-500" />;
      case 'NEW_USER': return <UserPlus className="w-5 h-5 text-blue-500" />;
      default: return <Bell className="w-5 h-5 text-gold" />;
    }
  };

  return (
    <div className="min-h-screen bg-brand-bgLight dark:bg-obsidian-dark flex transition-colors text-brand-darkText dark:text-brand-lightText">
      <AdminSidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <AdminTopbar title="Notifikasi Sistem" />

        <main className="p-6 md:p-8 space-y-8 overflow-y-auto">
          <div className="max-w-4xl">
            
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <Bell className="w-5 h-5 text-gold" />
                Daftar Notifikasi Terbaru
              </h2>
              <button 
                onClick={markAllAsRead}
                className="text-xs font-bold text-gray-500 hover:text-gold flex items-center gap-1 transition-colors"
              >
                <CheckCircle2 className="w-4 h-4" /> Tandai Semua Dibaca
              </button>
            </div>

            <div className="bg-white dark:bg-obsidian-card rounded-3xl border border-gray-200 dark:border-obsidian-border shadow-sm overflow-hidden">
              {notifications.length === 0 ? (
                <div className="p-10 text-center text-gray-500 dark:text-gray-400">
                  <Sparkles className="w-8 h-8 mx-auto mb-3 text-gray-300 dark:text-obsidian-surface" />
                  <p>Tidak ada notifikasi saat ini.</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-100 dark:divide-obsidian-border">
                  {notifications.map(notif => (
                    <div 
                      key={notif.id} 
                      className={`p-5 flex items-start gap-4 transition-colors ${notif.isRead ? 'bg-transparent' : 'bg-gold/5 dark:bg-gold/10'}`}
                    >
                      <div className="w-10 h-10 rounded-full bg-gray-50 dark:bg-obsidian-surface flex items-center justify-center shrink-0 border border-gray-100 dark:border-obsidian-border shadow-sm">
                        {getIcon(notif.type)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <h3 className={`text-sm ${notif.isRead ? 'font-bold' : 'font-extrabold text-gray-900 dark:text-white'}`}>
                            {notif.title}
                          </h3>
                          <span className="text-[10px] text-gray-400 font-bold whitespace-nowrap">
                            {new Date(notif.createdAt).toLocaleDateString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        <p className={`text-xs ${notif.isRead ? 'text-gray-500' : 'text-gray-700 dark:text-gray-300'}`}>
                          {notif.message}
                        </p>
                      </div>
                    </div>
                  ))}</div>
              )}
            </div>

          </div>
        </main>
      </div>
    </div>
  );
}
