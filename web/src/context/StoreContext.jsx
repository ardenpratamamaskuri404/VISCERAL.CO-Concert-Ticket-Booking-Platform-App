import React, { createContext, useContext, useState, useEffect } from 'react';
import { INITIAL_ARTISTS, INITIAL_EVENTS, INITIAL_ORDERS, INITIAL_USERS, INITIAL_AUDIT_LOGS } from '../data/mockData';

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

  // Auth / Role State: 'GUEST', 'CUSTOMER', 'ADMIN', 'SUPERADMIN'
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('visceral_user');
    return saved ? JSON.parse(saved) : INITIAL_USERS[2]; // Default logged-in customer Budi
  });

  const loginUser = (email, password, role = 'CUSTOMER') => {
    let user;
    if (role === 'SUPERADMIN' || email.includes('superadmin')) {
      user = INITIAL_USERS[0];
    } else if (role === 'ADMIN' || email.includes('admin')) {
      user = INITIAL_USERS[1];
    } else {
      user = {
        id: `user-${Date.now()}`,
        fullName: email.split('@')[0].toUpperCase(),
        email: email,
        phoneNumber: '+6281299988877',
        role: 'CUSTOMER',
        createdAt: new Date().toISOString()
      };
    }
    setCurrentUser(user);
    localStorage.setItem('visceral_user', JSON.stringify(user));
    return user;
  };

  const logoutUser = () => {
    setCurrentUser(null);
    localStorage.removeItem('visceral_user');
  };

  // Application Data States
  const [events, setEvents] = useState(INITIAL_EVENTS);
  const [artists, setArtists] = useState(INITIAL_ARTISTS);
  const [orders, setOrders] = useState(INITIAL_ORDERS);
  const [auditLogs, setAuditLogs] = useState(INITIAL_AUDIT_LOGS);
  const [refunds, setRefunds] = useState([
    {
      id: 'ref-1',
      orderId: 'ord-1002',
      orderNumber: 'VSC-20261015-9931',
      customerName: 'Siti Rahmawati',
      amount: 1500000,
      reason: 'Salah tanggal penerbangan sehingga tidak bisa hadir',
      status: 'REQUESTED',
      createdAt: '2026-07-28T16:00:00.000Z'
    }
  ]);

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

  const approveOrder = (orderId) => {
    setOrders(prev => prev.map(ord => {
      if (ord.id === orderId) {
        return { ...ord, status: 'PAID' };
      }
      return ord;
    }));
    addAuditLog('APPROVE_ORDER', orderId, { orderId });
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

  const createOrder = (orderData) => {
    const newOrder = {
      id: `ord-${Date.now()}`,
      orderNumber: `VSC-${new Date().toISOString().slice(0,10).replace(/-/g,'')}-${Math.floor(1000 + Math.random() * 9000)}`,
      customerId: currentUser?.id || 'cust-anon',
      customerName: currentUser?.fullName || 'Pengunjung',
      customerEmail: currentUser?.email || 'user@visceral.co',
      customerPhone: currentUser?.phoneNumber || '+628120000000',
      status: 'PENDING',
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      ...orderData
    };
    setOrders(prev => [newOrder, ...prev]);
    setActiveCheckout(newOrder);
    addAuditLog('CREATE_ORDER', newOrder.id, { orderNumber: newOrder.orderNumber, totalAmount: newOrder.totalAmount });
    return newOrder;
  };

  const addAuditLog = (action, entityId, metadata = {}) => {
    if (!currentUser) return;
    const newLog = {
      id: `log-${Date.now()}`,
      userId: currentUser.id,
      userName: currentUser.fullName,
      userRole: currentUser.role,
      action,
      entityId,
      metadata,
      createdAt: new Date().toISOString()
    };
    setAuditLogs(prev => [newLog, ...prev]);
  };

  const createEvent = (newEventData) => {
    const created = {
      id: `evt-${Date.now()}`,
      status: 'DRAFT',
      salesClosed: false,
      createdById: currentUser?.id || 'admin-1',
      createdAt: new Date().toISOString(),
      artists: [],
      categories: [
        { id: `cat-${Date.now()}-1`, name: 'VIP', price: 2000000, totalSeats: 50 },
        { id: `cat-${Date.now()}-2`, name: 'CAT 1', price: 1000000, totalSeats: 100 }
      ],
      ...newEventData
    };
    setEvents(prev => [created, ...prev]);
    addAuditLog('CREATE_EVENT', created.id, { title: created.title });
    return created;
  };

  const createArtist = (artistData) => {
    const newArt = {
      id: `art-${Date.now()}`,
      createdAt: new Date().toISOString(),
      ...artistData
    };
    setArtists(prev => [newArt, ...prev]);
    addAuditLog('CREATE_ARTIST', newArt.id, { name: newArt.name });
    return newArt;
  };

  return (
    <StoreContext.Provider value={{
      darkMode,
      toggleDarkMode,
      currentUser,
      setCurrentUser,
      loginUser,
      logoutUser,
      events,
      setEvents,
      artists,
      setArtists,
      orders,
      setOrders,
      auditLogs,
      refunds,
      setRefunds,
      activeCheckout,
      setActiveCheckout,
      lockedSeat,
      setLockedSeat,
      toggleSalesClosed,
      approveOrder,
      rejectOrder,
      createOrder,
      createEvent,
      createArtist,
      addAuditLog
    }}>
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) throw new Error('useStore must be used within StoreProvider');
  return context;
};
