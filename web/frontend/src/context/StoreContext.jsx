import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import api from '../api/axios';
import { io } from 'socket.io-client';

const StoreContext = createContext(null);

const getTokenExpiryMs = (token) => {
  if (!token || typeof token !== 'string') return null;
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    const base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
    const payload = JSON.parse(atob(base64));
    return typeof payload.exp === 'number' ? payload.exp * 1000 : null;
  } catch {
    return null;
  }
};

export const StoreProvider = ({ children }) => {
  // Theme State
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('visceral_dark');
    return saved ? JSON.parse(saved) : true; // Default dark theme for obsidian/gold vibe
  });

  useEffect(() => {
    localStorage.setItem('visceral_dark', JSON.stringify(darkMode));
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const toggleDarkMode = () => setDarkMode(prev => !prev);

  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const [currentUser, setCurrentUser] = useState(() => {
    const savedUser = localStorage.getItem('visceral_user');
    const token = localStorage.getItem('visceral_token');
    if (!savedUser || !token) return null;
    const expMs = getTokenExpiryMs(token);
    if (expMs && Date.now() >= expMs) {
      localStorage.removeItem('visceral_user');
      localStorage.removeItem('visceral_token');
      localStorage.removeItem('visceral_token_exp');
      sessionStorage.setItem(
        'visceral_session_expired_msg',
        'Sesi login Anda telah habis. Silakan login kembali.'
      );
      return null;
    }
    try {
      return JSON.parse(savedUser);
    } catch {
      return null;
    }
  });

  const [sessionExpiresAt, setSessionExpiresAt] = useState(() => {
    const token = localStorage.getItem('visceral_token');
    const expMs = getTokenExpiryMs(token);
    if (expMs && Date.now() < expMs) return new Date(expMs).toISOString();
    return null;
  });

  // Application Data States
  const [events, setEvents] = useState([]);
  const [artists, setArtists] = useState([]);
  const [orders, setOrders] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);
  const [users, setUsers] = useState([]);
  const [refunds, setRefunds] = useState([]);
  const [adminNotifications, setAdminNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [unreadNotificationCount, setUnreadNotificationCount] = useState(0);
  const [socketConnected, setSocketConnected] = useState(false);

  // Selected Order & Seat Lock State
  const [activeCheckout, setActiveCheckout] = useState(null);
  const [lockedSeat, setLockedSeat] = useState(null);

  const currentUserRef = useRef(currentUser);
  useEffect(() => {
    currentUserRef.current = currentUser;
  }, [currentUser]);

  // --- Data Fetchers (reusable for initial load + Socket.io live sync) ---
  const fetchEvents = useCallback(async () => {
    try {
      const eventsRes = await api.get('/events');
      if (eventsRes.data && eventsRes.data.data) {
        setEvents(eventsRes.data.data);
      }
    } catch (error) {
      console.error('Failed to fetch events:', error);
    }
  }, []);

  const fetchArtists = useCallback(async () => {
    try {
      const artistsRes = await api.get('/artists');
      if (artistsRes.data && artistsRes.data.data) {
        setArtists(artistsRes.data.data);
      }
    } catch (error) {
      console.error('Failed to fetch artists:', error);
    }
  }, []);

  const fetchOrders = useCallback(async (userOverride) => {
    const activeUser = userOverride !== undefined ? userOverride : currentUserRef.current;
    if (!activeUser) {
      setOrders([]);
      return;
    }
    try {
      const orderUrl = (activeUser.role === 'ADMIN' || activeUser.role === 'SUPERADMIN')
        ? '/orders'
        : `/orders?customerId=${activeUser.id}`;
      const ordersRes = await api.get(orderUrl);
      if (ordersRes.data && ordersRes.data.data) {
        setOrders(ordersRes.data.data);
      }
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    }
  }, []);

  const fetchRefunds = useCallback(async (userOverride) => {
    const activeUser = userOverride !== undefined ? userOverride : currentUserRef.current;
    if (!activeUser || (activeUser.role !== 'ADMIN' && activeUser.role !== 'SUPERADMIN')) {
      setRefunds([]);
      return;
    }
    try {
      const res = await api.get('/orders/refunds');
      if (res.data && res.data.data) {
        setRefunds(res.data.data);
      }
    } catch (error) {
      console.error('Failed to fetch refunds:', error);
    }
  }, []);

  const fetchUsers = useCallback(async (userOverride) => {
    const activeUser = userOverride !== undefined ? userOverride : currentUserRef.current;
    if (!activeUser || activeUser.role !== 'SUPERADMIN') {
      setUsers([]);
      return;
    }
    try {
      const usersRes = await api.get('/users');
      if (usersRes.data && usersRes.data.data) {
        setUsers(usersRes.data.data);
      }
    } catch (error) {
      console.error('Failed to fetch users:', error);
    }
  }, []);

  const fetchAuditLogs = useCallback(async (userOverride) => {
    const activeUser = userOverride !== undefined ? userOverride : currentUserRef.current;
    if (!activeUser || activeUser.role !== 'SUPERADMIN') {
      setAuditLogs([]);
      return;
    }
    try {
      const logsRes = await api.get('/users/audit-logs');
      if (logsRes.data && logsRes.data.data) {
        const formattedLogs = logsRes.data.data.map(log => ({
          id: log.id,
          userId: log.userId,
          userName: log.user?.fullName || 'Unknown',
          userRole: log.user?.role || 'CUSTOMER',
          userAvatarUrl: log.user?.avatarUrl || null,
          action: log.action,
          entityId: log.entityId,
          metadata: log.metadata,
          createdAt: log.createdAt
        }));
        setAuditLogs(formattedLogs);
      }
    } catch (error) {
      console.error('Failed to fetch audit logs:', error);
    }
  }, []);

  const fetchNotifications = useCallback(async (userOverride) => {
    const activeUser = userOverride !== undefined ? userOverride : currentUserRef.current;
    if (!activeUser) {
      setAdminNotifications([]);
      setUnreadCount(0);
      setUnreadNotificationCount(0);
      return;
    }
    try {
      const res = await api.get('/notifications');
      if (res.data && res.data.notifications) {
        const list = res.data.notifications;
        const unread = list.filter((n) => !n.isRead).length;
        setAdminNotifications(list.map((n) => ({
          id: n.id,
          type: n.type,
          title: n.title,
          message: n.message,
          time: new Date(n.createdAt).toLocaleString('id-ID'),
          read: n.isRead,
        })));
        setUnreadCount(unread);
        setUnreadNotificationCount(unread);
      }
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
    }
  }, []);

  // Fetch initial data on mount & user change
  useEffect(() => {
    fetchEvents();
    fetchArtists();
    if (currentUser) {
      fetchOrders(currentUser);
      fetchRefunds(currentUser);
      fetchUsers(currentUser);
      fetchAuditLogs(currentUser);
      fetchNotifications(currentUser);
    } else {
      setOrders([]);
      setRefunds([]);
      setUsers([]);
      setAuditLogs([]);
      setAdminNotifications([]);
      setUnreadCount(0);
      setUnreadNotificationCount(0);
    }
  }, [currentUser, fetchEvents, fetchArtists, fetchOrders, fetchRefunds, fetchUsers, fetchAuditLogs, fetchNotifications]);

  // Always-on Socket.io real-time sync (works for guests, customers, admins, and superadmins)
  useEffect(() => {
    const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3005';
    const socket = io(backendUrl, {
      transports: ['websocket', 'polling'],
      reconnection: true,
    });

    socket.on('connect', () => {
      setSocketConnected(true);
    });

    socket.on('disconnect', () => {
      setSocketConnected(false);
    });

    socket.on('events_updated', () => {
      fetchEvents();
    });

    socket.on('artists_updated', () => {
      fetchArtists();
    });

    socket.on('new_order', () => {
      fetchOrders();
      fetchNotifications();
    });

    socket.on('order_paid', () => {
      fetchOrders();
      fetchEvents();
      fetchNotifications();
    });

    socket.on('orders_updated', () => {
      fetchOrders();
    });

    socket.on('ticket_scanned', (data) => {
      setOrders(prev => prev.map(ord => {
        if (ord.id === data.orderId) {
          return {
            ...ord,
            tickets: ord.tickets?.map(t => t.id === data.id ? { ...t, status: 'CHECKED_IN', checkedInAt: data.checkedInAt } : t)
          };
        }
        return ord;
      }));
      fetchOrders();
    });

    socket.on('refunds_updated', () => {
      fetchRefunds();
      fetchOrders();
      fetchNotifications();
    });

    socket.on('users_updated', () => {
      fetchUsers();
    });

    socket.on('audit_logs_updated', () => {
      fetchAuditLogs();
    });

    socket.on('new_notification', () => {
      fetchNotifications();
    });

    return () => {
      socket.disconnect();
    };
  }, [fetchEvents, fetchArtists, fetchOrders, fetchRefunds, fetchUsers, fetchAuditLogs, fetchNotifications]);

  const markAllNotificationsRead = async () => {
    setAdminNotifications((prev) => prev.map(n => ({ ...n, read: true })));
    setUnreadCount(0);
    setUnreadNotificationCount(0);
    try {
      await api.put('/notifications/read-all');
    } catch (e) {}
  };

  const loginUser = (user, token, expiresAt) => {
    setCurrentUser(user);
    localStorage.setItem('visceral_user', JSON.stringify(user));
    localStorage.setItem('visceral_token', token);
    const expMs = expiresAt ? new Date(expiresAt).getTime() : getTokenExpiryMs(token);
    if (expMs) {
      const iso = new Date(expMs).toISOString();
      localStorage.setItem('visceral_token_exp', iso);
      setSessionExpiresAt(iso);
    }
  };

  const logoutUser = useCallback(() => {
    setCurrentUser(null);
    setSessionExpiresAt(null);
    localStorage.removeItem('visceral_user');
    localStorage.removeItem('visceral_token');
    localStorage.removeItem('visceral_token_exp');
  }, []);

  // Auto-logout otomatis tepat saat masa berlaku token sesi habis (middleware + client guard)
  useEffect(() => {
    const handleForceExpire = (msg) => {
      const notice = msg || 'Sesi login Anda telah habis. Silakan login kembali.';
      logoutUser();
      sessionStorage.setItem('visceral_session_expired_msg', notice);
      if (window.location.pathname !== '/login') {
        window.location.href = '/login?expired=1';
      }
    };

    const onSessionExpiredEvent = (e) => {
      logoutUser();
      if (e?.detail?.message) {
        sessionStorage.setItem('visceral_session_expired_msg', e.detail.message);
      }
    };

    window.addEventListener('visceral:session-expired', onSessionExpiredEvent);

    if (!currentUser) {
      return () => {
        window.removeEventListener('visceral:session-expired', onSessionExpiredEvent);
      };
    }

    const token = localStorage.getItem('visceral_token');
    const expMs = getTokenExpiryMs(token);
    if (!token || !expMs) {
      handleForceExpire('Sesi login tidak valid. Silakan login kembali.');
      return () => {
        window.removeEventListener('visceral:session-expired', onSessionExpiredEvent);
      };
    }

    const remainingMs = expMs - Date.now();
    if (remainingMs <= 0) {
      handleForceExpire('Sesi login Anda telah habis. Silakan login kembali.');
      return () => {
        window.removeEventListener('visceral:session-expired', onSessionExpiredEvent);
      };
    }

    setSessionExpiresAt(new Date(expMs).toISOString());

    // Verifikasi sesi ke backend middleware saat halaman dimuat
    api.get('/auth/session').catch(() => {
      // 401 ditangani oleh axios interceptor
    });

    // Set timer auto-logout tepat saat token kedaluwarsa (dibatasi max 2^31-1 ms)
    const timeoutDelay = Math.min(remainingMs, 2147483647);
    const expiryTimer = setTimeout(() => {
      handleForceExpire('Batas waktu sesi login Anda telah berakhir. Silakan login kembali.');
    }, timeoutDelay);

    // Cek ulang saat user kembali membuka tab setelah sleep/idle
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        const currentToken = localStorage.getItem('visceral_token');
        const currentExp = getTokenExpiryMs(currentToken);
        if (!currentToken || !currentExp || Date.now() >= currentExp) {
          handleForceExpire('Batas waktu sesi login Anda telah berakhir. Silakan login kembali.');
        }
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      clearTimeout(expiryTimer);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('visceral:session-expired', onSessionExpiredEvent);
    };
  }, [currentUser, logoutUser]);

  const performLogout = () => {
    setIsLoggingOut(true);
    setTimeout(() => {
      logoutUser();
      window.location.href = '/landing';
    }, 1500);
  };

  const updateUserProfile = async (profileData) => {
    try {
      const response = await api.put('/users/profile', profileData);
      const updatedUser = response.data.data;
      setCurrentUser(updatedUser);
      localStorage.setItem('visceral_user', JSON.stringify(updatedUser));
      return { success: true, message: response.data.message };
    } catch (error) {
      return { success: false, error: error.response?.data?.error || 'Gagal memperbarui profil' };
    }
  };

  const changeUserPassword = async (passwordData) => {
    try {
      const response = await api.put('/users/password', passwordData);
      return { success: true, message: response.data.message };
    } catch (error) {
      return { success: false, error: error.response?.data?.error || 'Gagal mengubah password' };
    }
  };

  const deleteUserAccount = async () => {
    try {
      await api.delete('/users/account');
      logoutUser();
      return { success: true };
    } catch (error) {
      return { success: false, error: error.response?.data?.error || 'Gagal menghapus akun' };
    }
  };

  const addAuditLog = async (action, entityId, metadata = {}) => {
    if (!currentUser) return;
    try {
      await api.post('/users/audit-logs', { action, entityId, metadata });
      fetchAuditLogs();
    } catch (error) {
      console.error('Failed to save audit log:', error);
    }
  };

  // --- Event Actions (Persisted to MySQL + Broadcast via Socket.io) ---
  const toggleSalesClosed = async (eventId) => {
    try {
      const res = await api.patch(`/events/${eventId}/sales-closed`);
      if (res.data?.success) {
        setEvents(prev => prev.map(ev =>
          ev.id === eventId ? { ...ev, salesClosed: res.data.data.salesClosed } : ev
        ));
        return { success: true };
      }
    } catch (error) {
      console.error('Toggle salesClosed failed:', error);
      alert('Gagal mengubah status penjualan: ' + (error.response?.data?.error || error.message));
      return { success: false };
    }
  };

  const createEvent = async (newEventData) => {
    try {
      const response = await api.post('/events', newEventData);
      if (response.data.success) {
        await fetchEvents();
        return { success: true };
      }
    } catch (error) {
      console.error('Failed to create event', error);
      alert('Gagal membuat event: ' + (error.response?.data?.error || error.message));
      return { success: false };
    }
  };

  const updateEvent = async (eventId, updatedEventData) => {
    try {
      const response = await api.put(`/events/${eventId}`, updatedEventData);
      if (response.data.success) {
        await fetchEvents();
        return { success: true };
      }
    } catch (error) {
      console.error('Failed to update event', error);
      alert('Gagal mengupdate event: ' + (error.response?.data?.error || error.message));
      return { success: false };
    }
  };

  const deleteEvent = async (eventId) => {
    try {
      const response = await api.delete(`/events/${eventId}`);
      if (response.data.success) {
        setEvents((prev) => prev.filter((ev) => ev.id !== eventId));
        return { success: true };
      }
    } catch (error) {
      console.error('Failed to delete event', error);
      alert(error.response?.data?.error || 'Gagal menghapus event');
      return { success: false };
    }
  };

  // --- Order & Refund Actions (Persisted to MySQL + Broadcast via Socket.io) ---
  const approveOrder = async (orderId) => {
    try {
      const res = await api.put(`/orders/${orderId}/approve`);
      if (res.data.success) {
        await fetchOrders();
        addAuditLog('APPROVE_ORDER', orderId, { orderId });
        return { success: true };
      }
    } catch (error) {
      console.error('Approve failed:', error);
      alert('Gagal approve pesanan: ' + (error.response?.data?.message || error.message));
      return { success: false };
    }
  };

  const rejectOrder = async (orderId) => {
    try {
      const res = await api.put(`/orders/${orderId}/reject`);
      if (res.data.success) {
        await fetchOrders();
        return { success: true };
      }
    } catch (error) {
      console.error('Reject failed:', error);
      alert('Gagal menolak pesanan: ' + (error.response?.data?.message || error.message));
      return { success: false };
    }
  };

  const approveRefund = async (refundId) => {
    try {
      const res = await api.put(`/orders/refunds/${refundId}/approve`);
      if (res.data.success) {
        await Promise.all([fetchRefunds(), fetchOrders()]);
        return { success: true };
      }
    } catch (error) {
      console.error('Approve refund failed:', error);
      alert(error.response?.data?.error || 'Gagal menyetujui refund');
      return { success: false };
    }
  };

  const rejectRefund = async (refundId) => {
    try {
      const res = await api.put(`/orders/refunds/${refundId}/reject`);
      if (res.data.success) {
        await fetchRefunds();
        return { success: true };
      }
    } catch (error) {
      console.error('Reject refund failed:', error);
      alert(error.response?.data?.error || 'Gagal menolak refund');
      return { success: false };
    }
  };

  const createOrder = async (orderData) => {
    try {
      const response = await api.post('/orders/checkout', {
        ...orderData,
        customerId: currentUser?.id || 'cust-anon',
        customerName: currentUser?.fullName || 'Pengunjung',
        customerEmail: currentUser?.email || 'user@visceral.co',
      });

      if (response.data && response.data.success) {
        const newOrder = response.data.order;
        await fetchOrders();
        setActiveCheckout(newOrder);
        addAuditLog('CREATE_ORDER', newOrder.id, { orderNumber: newOrder.orderNumber, totalAmount: newOrder.totalAmount });
        return { success: true, order: newOrder, paymentUrl: response.data.paymentUrl };
      } else {
        throw new Error(response.data?.message || 'Gagal membuat pesanan');
      }
    } catch (error) {
      console.error('Create Order Error:', error);
      alert('Maaf, ' + (error.response?.data?.message || error.message));
      return { success: false };
    }
  };

  // --- Artist Actions ---
  const createArtist = async (artistData) => {
    try {
      const response = await api.post('/artists', artistData);
      if (response.data && response.data.success) {
        const newArt = response.data.data;
        await fetchArtists();
        addAuditLog('CREATE_ARTIST', newArt.id, { name: newArt.name });
        return { success: true, artist: newArt };
      } else {
        throw new Error(response.data?.message || 'Gagal menambahkan artis');
      }
    } catch (error) {
      console.error('Create Artist Error:', error);
      alert('Gagal menambahkan artis: ' + (error.response?.data?.error || error.message));
      return { success: false };
    }
  };

  const updateArtist = async (artistId, artistData) => {
    try {
      const response = await api.put(`/artists/${artistId}`, artistData);
      if (response.data && response.data.success) {
        const updatedArt = response.data.data;
        await fetchArtists();
        addAuditLog('UPDATE_ARTIST', updatedArt.id, { name: updatedArt.name });
        return { success: true, artist: updatedArt };
      } else {
        throw new Error(response.data?.message || 'Gagal mengubah artis');
      }
    } catch (error) {
      console.error('Update Artist Error:', error);
      alert('Gagal mengubah artis: ' + (error.response?.data?.error || error.message));
      return { success: false };
    }
  };

  const deleteArtist = async (id) => {
    try {
      const res = await api.delete(`/artists/${id}`);
      if (res.data.success) {
        await fetchArtists();
        addAuditLog('DELETE_ARTIST', id, { artistId: id });
        return { success: true };
      }
    } catch (error) {
      console.error(error);
      alert('Gagal menghapus artis: ' + (error.response?.data?.error || error.message));
      return { success: false };
    }
  };

  // --- Superadmin User Management Actions ---
  const createAdminUser = async (payload) => {
    try {
      const response = await api.post('/users', payload);
      if (response.data && response.data.success) {
        await fetchUsers();
        return { success: true, data: response.data.data };
      }
      return { success: false, error: response.data?.error || 'Gagal menambahkan akun' };
    } catch (error) {
      const errMsg = error.response?.data?.error || 'Gagal menambahkan akun';
      alert(errMsg);
      return { success: false, error: errMsg };
    }
  };

  const updateUserRole = async (userId, newRole) => {
    try {
      const response = await api.put(`/users/${userId}/role`, { role: newRole });
      if (response.data && response.data.success) {
        await fetchUsers();
        return { success: true };
      } else {
        throw new Error(response.data?.message || 'Gagal mengubah role');
      }
    } catch (error) {
      console.error('Update Role Error:', error);
      alert('Gagal mengubah role: ' + (error.response?.data?.error || error.message));
      return { success: false };
    }
  };

  const deleteUser = async (userId) => {
    try {
      const response = await api.delete(`/users/${userId}`);
      if (response.data && response.data.success) {
        await fetchUsers();
        return { success: true };
      }
      return { success: false };
    } catch (error) {
      console.error('Delete User Error:', error);
      alert(error.response?.data?.error || 'Gagal menghapus pengguna');
      return { success: false };
    }
  };

  return (
    <StoreContext.Provider value={{
      darkMode,
      toggleDarkMode,
      socketConnected,
      currentUser,
      sessionExpiresAt,
      setCurrentUser,
      loginUser,
      logoutUser,
      performLogout,
      updateUserProfile,
      changeUserPassword,
      deleteUserAccount,
      events,
      setEvents,
      fetchEvents,
      artists,
      setArtists,
      fetchArtists,
      orders,
      setOrders,
      fetchOrders,
      adminNotifications,
      unreadCount,
      markAllNotificationsRead,
      auditLogs,
      fetchAuditLogs,
      users,
      setUsers,
      fetchUsers,
      refunds,
      setRefunds,
      fetchRefunds,
      unreadNotificationCount,
      setUnreadNotificationCount,
      activeCheckout,
      setActiveCheckout,
      lockedSeat,
      setLockedSeat,
      toggleSalesClosed,
      deleteEvent,
      approveOrder,
      rejectOrder,
      approveRefund,
      rejectRefund,
      createOrder,
      createEvent,
      updateEvent,
      createArtist,
      updateArtist,
      deleteArtist,
      createAdminUser,
      updateUserRole,
      deleteUser,
      addAuditLog
    }}>
      {children}

      {/* Global Logout Animation Overlay */}
      {isLoggingOut && (
        <div className="fixed inset-0 z-[9999] bg-obsidian-dark flex flex-col items-center justify-center transition-all duration-500 animate-in fade-in zoom-in-95">
          <div className="relative w-24 h-24 mb-6">
            <div className="absolute inset-0 rounded-full border-t-2 border-r-2 border-gold animate-spin"></div>
            <div className="absolute inset-2 rounded-full border-b-2 border-l-2 border-oxblood animate-spin-slow"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-3xl font-black text-white tracking-tighter">V</span>
            </div>
          </div>
          <h2 className="text-xl font-extrabold text-white tracking-widest uppercase animate-pulse">
            Logging Out
          </h2>
          <p className="text-xs text-gray-400 mt-2">See you next time, {currentUser?.fullName?.split(' ')[0] || 'User'}!</p>
        </div>
      )}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) throw new Error('useStore must be used within StoreProvider');
  return context;
};
