import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/axios';
import { io } from 'socket.io-client';

const StoreContext = createContext(null);

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
    return (savedUser && token) ? JSON.parse(savedUser) : null;
  });

  const [adminNotifications, setAdminNotifications] = useState([
    {
      id: Date.now() + 1,
      type: 'PROFILE_UPDATE',
      message: 'Profil Superadmin berhasil diperbarui dan disinkronkan',
      time: 'Baru saja',
      read: false
    },
    {
      id: Date.now() + 2,
      type: 'NEW_ORDER',
      message: 'Pesanan baru dari Arkan senilai Rp 1.250.000',
      time: '2 jam yang lalu',
      read: false
    },
    {
      id: Date.now() + 3,
      type: 'ORDER_PAID',
      message: 'Pesanan #ORD-89231 telah DIBAYAR via DOKU!',
      time: '3 jam yang lalu',
      read: true
    },
    {
      id: Date.now() + 4,
      type: 'NEW_USER',
      message: 'Arkan (CUSTOMER) baru saja membuat akun baru',
      time: '5 jam yang lalu',
      read: true
    }
  ]);
  const [unreadCount, setUnreadCount] = useState(2);
  const [unreadNotificationCount, setUnreadNotificationCount] = useState(0);

  // Setup Socket connection for real-time updates
  useEffect(() => {
    let socket;
    if (currentUser) {
      const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3005';
      socket = io(backendUrl);

      socket.on('new_order', (data) => {
        const notif = {
          id: Date.now(),
          type: 'NEW_ORDER',
          message: `Pesanan baru dari ${data.customerName || data.customerId} senilai Rp ${Number(data.totalAmount).toLocaleString('id-ID')}`,
          time: 'Baru saja',
          read: false
        };
        setAdminNotifications((prev) => [notif, ...prev]);
        setUnreadCount((prev) => prev + 1);
        
        // Auto update orders list in admin dashboard
        setOrders(prev => [data, ...prev]);
      });

      socket.on('order_paid', (data) => {
        const notif = {
          id: Date.now(),
          type: 'ORDER_PAID',
          message: `Pesanan ${data.orderNumber} telah DIBAYAR!`,
          time: 'Baru saja',
          read: false
        };
        setAdminNotifications((prev) => [notif, ...prev]);
        setUnreadCount((prev) => prev + 1);
        
        // Auto update orders list in admin dashboard
        setOrders(prev => prev.map(o => o.id === data.id ? { ...o, status: 'PAID' } : o));
      });

      socket.on('ticket_scanned', (data) => {
        // Update ticket status instantly in the global orders state
        setOrders(prev => prev.map(ord => {
          if (ord.id === data.orderId) {
             return {
               ...ord,
               tickets: ord.tickets?.map(t => t.id === data.id ? { ...t, status: 'CHECKED_IN', checkedInAt: data.checkedInAt } : t)
             };
          }
          return ord;
        }));
      });
      
      socket.on('new_notification', () => {
        setUnreadNotificationCount((prev) => prev + 1);
      });
    }

    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, [currentUser]);

  const markAllNotificationsRead = () => {
    setAdminNotifications((prev) => prev.map(n => ({ ...n, read: true })));
    setUnreadCount(0);
  };

  const loginUser = (user, token) => {
    setCurrentUser(user);
    localStorage.setItem('visceral_user', JSON.stringify(user));
    localStorage.setItem('visceral_token', token);
  };

  const logoutUser = () => {
    setCurrentUser(null);
    localStorage.removeItem('visceral_user');
    localStorage.removeItem('visceral_token');
  };

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

  // Application Data States
  const [events, setEvents] = useState([]);
  const [artists, setArtists] = useState([]);
  const [orders, setOrders] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);
  const [users, setUsers] = useState([]);
  const [refunds, setRefunds] = useState([]);

  // Fetch initial data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const eventsRes = await api.get('/events');
        if (eventsRes.data && eventsRes.data.data) {
          setEvents(eventsRes.data.data);
        }

        // Fetch Artists
        const artistsRes = await api.get('/artists');
        if (artistsRes.data && artistsRes.data.data) {
          setArtists(artistsRes.data.data);
        }
        
        // Fetch Orders & Admin Data
        if (currentUser) {
          const orderUrl = (currentUser.role === 'ADMIN' || currentUser.role === 'SUPERADMIN') 
            ? '/orders' 
            : `/orders?customerId=${currentUser.id}`;
            
          const ordersRes = await api.get(orderUrl);
          if (ordersRes.data && ordersRes.data.data) {
            setOrders(ordersRes.data.data);
          }

          if (currentUser.role === 'SUPERADMIN') {
            const usersRes = await api.get('/users');
            if (usersRes.data && usersRes.data.data) setUsers(usersRes.data.data);
            
            const logsRes = await api.get('/users/audit-logs');
            if (logsRes.data && logsRes.data.data) {
               // Transform to match frontend schema
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
          }
        }
      } catch (error) {
        console.error('Failed to fetch data:', error);
      }
    };
    fetchData();
  }, [currentUser]);

  // Selected Order for Checkout
  const [activeCheckout, setActiveCheckout] = useState(null);

  // Seat Lock State (Inovasi)
  const [lockedSeat, setLockedSeat] = useState(null);

  // Helper actions
  const toggleSalesClosed = (eventId) => {
    setEvents(prev => prev.map(ev => {
      if (ev.id === eventId) {
        return { ...ev, salesClosed: !ev.salesClosed };
      }
      return ev;
    }));
    addAuditLog('TOGGLE_SALES_CLOSED', eventId, { eventId });
  };

  const approveOrder = async (orderId) => {
    try {
      const res = await api.put(`/orders/${orderId}/approve`);
      if (res.data.success) {
        setOrders(prev => prev.map(ord => {
          if (ord.id === orderId) {
            return { ...ord, status: 'PAID' };
          }
          return ord;
        }));
        addAuditLog('APPROVE_ORDER', orderId, { orderId });
      }
    } catch (error) {
      console.error('Approve failed:', error);
      alert('Gagal approve pesanan: ' + (error.response?.data?.message || error.message));
    }
  };

  const rejectOrder = (orderId) => {
    setOrders(prev => prev.map(ord => {
      if (ord.id === orderId) {
        return { ...ord, status: 'CANCELLED' };
      }
      return ord;
    }));
    addAuditLog('REJECT_ORDER', orderId, { orderId });
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
        setOrders(prev => [newOrder, ...prev]);
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

  const addAuditLog = async (action, entityId, metadata = {}) => {
    if (!currentUser) return;
    
    // Optimistic update
    const newLog = {
      id: `log-temp-${Date.now()}`,
      userId: currentUser.id,
      userName: currentUser.fullName,
      userRole: currentUser.role,
      action,
      entityId,
      metadata,
      createdAt: new Date().toISOString()
    };
    setAuditLogs(prev => [newLog, ...prev]);

    // Persist to DB
    try {
      await api.post('/users/audit-logs', { action, entityId, metadata });
    } catch (error) {
      console.error('Failed to save audit log:', error);
    }
  };

  const createEvent = async (newEventData) => {
    try {
      const response = await api.post('/events', newEventData);
      if (response.data.success) {
        setEvents((prev) => [...prev, response.data.data]);
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
        setEvents((prev) => prev.map(ev => ev.id === eventId ? { ...ev, ...response.data.data } : ev));
        return { success: true };
      }
    } catch (error) {
      console.error('Failed to update event', error);
      alert('Gagal mengupdate event: ' + (error.response?.data?.error || error.message));
      return { success: false };
    }
  };

  const createArtist = async (artistData) => {
    try {
      const response = await api.post('/artists', artistData);
      if (response.data && response.data.success) {
        const newArt = response.data.data;
        setArtists(prev => [newArt, ...prev]);
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
        setArtists(prev => prev.map(a => a.id === artistId ? { ...a, ...updatedArt } : a));
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

  const updateUserRole = async (userId, newRole) => {
    try {
      const response = await api.put(`/users/${userId}/role`, { role: newRole });
      if (response.data && response.data.success) {
        setUsers(prev => prev.map(u => u.id === userId ? { ...u, role: newRole } : u));
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

  const deleteArtist = async (id) => {
    try {
      const res = await api.delete(`/artists/${id}`);
      if (res.data.success) {
        setArtists(prev => prev.filter(a => a.id !== id));
        addAuditLog('DELETE_ARTIST', id, { artistId: id });
        return { success: true };
      }
    } catch (error) {
      console.error(error);
      alert('Gagal menghapus artis: ' + (error.response?.data?.error || error.message));
      return { success: false };
    }
  };

  return (
    <StoreContext.Provider value={{
      darkMode,
      toggleDarkMode,
      currentUser,
      setCurrentUser,
      loginUser,
      logoutUser,
      performLogout,
      updateUserProfile,
      changeUserPassword,
      deleteUserAccount,
      events,
      setEvents,
      artists,
      setArtists,
      orders,
      setOrders,
      adminNotifications,
      unreadCount,
      markAllNotificationsRead,
      auditLogs,
      users,
      setUsers,
      refunds,
      setRefunds,
      unreadNotificationCount,
      setUnreadNotificationCount,
      activeCheckout,
      setActiveCheckout,
      lockedSeat,
      setLockedSeat,
      toggleSalesClosed,
      approveOrder,
      rejectOrder,
      createOrder,
      createEvent,
      updateEvent,
      createArtist,
      updateArtist,
      deleteArtist,
      updateUserRole,
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
