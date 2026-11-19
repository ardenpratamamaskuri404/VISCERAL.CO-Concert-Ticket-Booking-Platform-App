import React, { createContext, useContext, useState, useEffect, useCallback, useRef, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../api/axios';
import { connectSocket, disconnectSocket } from '../api/socket';
import { useAuth } from './AuthContext';
import { Event, Artist, Order, Notification, ChatMessage } from '../types';

interface AppContextType {
  // Data
  events: Event[];
  artists: Artist[];
  orders: Order[];
  notifications: Notification[];
  chatMessages: ChatMessage[];

  // State
  darkMode: boolean;
  isRefreshing: boolean;
  unreadNotifCount: number;
  socketConnected: boolean;

  // Actions
  fetchEvents: () => Promise<void>;
  fetchArtists: () => Promise<void>;
  fetchOrders: () => Promise<void>;
  fetchNotifications: () => Promise<void>;
  fetchChatMessages: () => Promise<void>;
  toggleDarkMode: () => void;
  setOrders: React.Dispatch<React.SetStateAction<Order[]>>;
  setChatMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const { currentUser, isLoggedIn } = useAuth();

  const [events, setEvents] = useState<Event[]>([]);
  const [artists, setArtists] = useState<Artist[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [darkMode, setDarkMode] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [unreadNotifCount, setUnreadNotifCount] = useState(0);
  const [socketConnected, setSocketConnected] = useState(false);

  const currentUserRef = useRef(currentUser);
  useEffect(() => {
    currentUserRef.current = currentUser;
  }, [currentUser]);

  // Restore dark mode preference
  useEffect(() => {
    AsyncStorage.getItem('visceral_dark').then((val) => {
      if (val !== null) setDarkMode(JSON.parse(val));
    });
  }, []);

  const fetchEvents = useCallback(async () => {
    try {
      const res = await api.get('/events');
      if (res.data?.data) {
        setEvents(res.data.data);
      }
    } catch (e) {
      console.error('Failed to fetch events:', e);
    }
  }, []);

  const fetchArtists = useCallback(async () => {
    try {
      const res = await api.get('/artists');
      if (res.data?.data) {
        setArtists(res.data.data);
      }
    } catch (e) {
      console.error('Failed to fetch artists:', e);
    }
  }, []);

  const fetchOrders = useCallback(async () => {
    const user = currentUserRef.current;
    if (!user) return;
    try {
      const url =
        user.role === 'ADMIN' || user.role === 'SUPERADMIN'
          ? '/orders'
          : `/orders?customerId=${user.id}`;
      const res = await api.get(url);
      if (res.data?.data) {
        setOrders(res.data.data);
      }
    } catch (e) {
      console.error('Failed to fetch orders:', e);
    }
  }, []);

  const fetchNotifications = useCallback(async () => {
    if (!currentUserRef.current) return;
    try {
      const res = await api.get('/notifications');
      if (res.data?.success) {
        setNotifications(res.data.notifications);
        const unread = res.data.notifications.filter((n: Notification) => !n.isRead).length;
        setUnreadNotifCount(unread);
      }
    } catch (e) {
      console.error('Failed to fetch notifications:', e);
    }
  }, []);

  const fetchChatMessages = useCallback(async () => {
    if (!currentUserRef.current) return;
    try {
      const res = await api.get('/chat');
      if (res.data?.success) {
        setChatMessages(res.data.chats);
      }
    } catch (e) {
      console.error('Failed to fetch chat messages:', e);
    }
  }, []);

  // Always fetch public catalog (events & artists) and stay connected to live Socket.io updates
  useEffect(() => {
    fetchEvents();
    fetchArtists();

    const socket = connectSocket();

    const onConnect = () => setSocketConnected(true);
    const onDisconnect = () => setSocketConnected(false);
    const onEventsUpdated = () => fetchEvents();
    const onArtistsUpdated = () => fetchArtists();
    const onOrdersUpdated = () => fetchOrders();
    const onOrderPaid = () => {
      fetchOrders();
      fetchEvents();
    };
    const onTicketScanned = () => fetchOrders();
    const onRefundsUpdated = () => {
      fetchOrders();
      fetchNotifications();
    };
    const onNewNotification = () => fetchNotifications();
    const onNewChatMessage = (msg: ChatMessage) => {
      const user = currentUserRef.current;
      if (!user) return;
      if (msg.receiverId === user.id || msg.senderId === user.id) {
        setChatMessages((prev) =>
          prev.some((existing) => existing.id === msg.id) ? prev : [...prev, msg]
        );
      }
    };

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    socket.on('events_updated', onEventsUpdated);
    socket.on('artists_updated', onArtistsUpdated);
    socket.on('orders_updated', onOrdersUpdated);
    socket.on('order_paid', onOrderPaid);
    socket.on('ticket_scanned', onTicketScanned);
    socket.on('refunds_updated', onRefundsUpdated);
    socket.on('new_notification', onNewNotification);
    socket.on('new_chat_message', onNewChatMessage);

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.off('events_updated', onEventsUpdated);
      socket.off('artists_updated', onArtistsUpdated);
      socket.off('orders_updated', onOrdersUpdated);
      socket.off('order_paid', onOrderPaid);
      socket.off('ticket_scanned', onTicketScanned);
      socket.off('refunds_updated', onRefundsUpdated);
      socket.off('new_notification', onNewNotification);
      socket.off('new_chat_message', onNewChatMessage);
      disconnectSocket();
    };
  }, [fetchEvents, fetchArtists, fetchOrders, fetchNotifications]);

  // Fetch user-scoped data when logged in
  useEffect(() => {
    if (isLoggedIn && currentUser) {
      fetchOrders();
      fetchNotifications();
    } else {
      setOrders([]);
      setNotifications([]);
      setUnreadNotifCount(0);
    }
  }, [isLoggedIn, currentUser?.id, fetchOrders, fetchNotifications]);

  const toggleDarkMode = () => {
    setDarkMode((prev) => {
      const next = !prev;
      AsyncStorage.setItem('visceral_dark', JSON.stringify(next));
      return next;
    });
  };

  return (
    <AppContext.Provider
      value={{
        events,
        artists,
        orders,
        notifications,
        chatMessages,
        darkMode,
        isRefreshing,
        unreadNotifCount,
        socketConnected,
        fetchEvents,
        fetchArtists,
        fetchOrders,
        fetchNotifications,
        fetchChatMessages,
        toggleDarkMode,
        setOrders,
        setChatMessages,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
};
