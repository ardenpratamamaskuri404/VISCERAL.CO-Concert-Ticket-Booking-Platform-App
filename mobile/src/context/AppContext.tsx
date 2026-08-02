import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../api/axios';
import { connectSocket, disconnectSocket } from '../api/socket';
import { useAuth } from './AuthContext';
import { Event, Order, Notification, ChatMessage } from '../types';

interface AppContextType {
  // Data
  events: Event[];
  orders: Order[];
  notifications: Notification[];
  chatMessages: ChatMessage[];
  
  // State
  darkMode: boolean;
  isRefreshing: boolean;
  unreadNotifCount: number;

  // Actions
  fetchEvents: () => Promise<void>;
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
  const [orders, setOrders] = useState<Order[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [darkMode, setDarkMode] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [unreadNotifCount, setUnreadNotifCount] = useState(0);

  // Restore dark mode preference
  useEffect(() => {
    AsyncStorage.getItem('visceral_dark').then((val) => {
      if (val !== null) setDarkMode(JSON.parse(val));
    });
  }, []);

  // Connect socket when logged in
  useEffect(() => {
    if (isLoggedIn) {
      const socket = connectSocket();

      socket.on('order_paid', (data: any) => {
        // Refresh orders when payment confirmed
        fetchOrders();
      });

      socket.on('new_chat_message', (msg: ChatMessage) => {
        if (
          msg.receiverId === currentUser?.id ||
          msg.senderId === currentUser?.id
        ) {
          setChatMessages((prev) => [...prev, msg]);
        }
      });

      socket.on('new_notification', () => {
        fetchNotifications();
      });

      // Initial data fetch
      fetchEvents();
      fetchOrders();
      fetchNotifications();

      return () => {
        disconnectSocket();
      };
    }
  }, [isLoggedIn, currentUser?.id]);

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

  const fetchOrders = useCallback(async () => {
    if (!currentUser) return;
    try {
      const res = await api.get(`/orders?customerId=${currentUser.id}`);
      if (res.data?.data) {
        setOrders(res.data.data);
      }
    } catch (e) {
      console.error('Failed to fetch orders:', e);
    }
  }, [currentUser?.id]);

  const fetchNotifications = useCallback(async () => {
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
    try {
      const res = await api.get('/chat');
      if (res.data?.success) {
        setChatMessages(res.data.chats);
      }
    } catch (e) {
      console.error('Failed to fetch chat messages:', e);
    }
  }, []);

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
        orders,
        notifications,
        chatMessages,
        darkMode,
        isRefreshing,
        unreadNotifCount,
        fetchEvents,
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
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};
