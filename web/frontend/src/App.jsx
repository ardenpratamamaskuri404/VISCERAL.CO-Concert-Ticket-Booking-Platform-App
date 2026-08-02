import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { StoreProvider } from './context/StoreContext';
import { AdminRoute, CustomerRoute } from './components/RouteGuards';
import { io } from 'socket.io-client';

// Import All 20 Web Pages
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import OtpPage from './pages/OtpPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import ExploreEventPage from './pages/ExploreEventPage';
import DetailEventPage from './pages/DetailEventPage';
import SeatMapPage from './pages/SeatMapPage';
import CheckoutPage from './pages/CheckoutPage';
import PaymentProofPage from './pages/PaymentProofPage';
import OrderSuccessPage from './pages/OrderSuccessPage';
import MyTicketsPage from './pages/MyTicketsPage';
import TicketDetailPage from './pages/TicketDetailPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import AdminEventsPage from './pages/AdminEventsPage';
import AdminArtistsPage from './pages/AdminArtistsPage';
import AdminVerificationPage from './pages/AdminVerificationPage';
import AdminScannerPage from './pages/AdminScannerPage';
import AdminUsersPage from './pages/AdminUsersPage';
import AdminReportsPage from './pages/AdminReportsPage';
import AboutPage from './pages/AboutPage';
import SettingsPage from './pages/SettingsPage';
import AdminSettingsPage from './pages/AdminSettingsPage';
import AdminNotificationsPage from './pages/AdminNotificationsPage';
import AdminChatPage from './pages/AdminChatPage';
import ChatWidget from './components/ChatWidget';

// Initialize Socket.io Connection
export const socket = io(import.meta.env.VITE_BACKEND_URL || 'http://localhost:3005');

export default function App() {
  return (
    <StoreProvider>
      <Router>
        <Routes>
          {/* Public & Customer Auth Routes */}
          <Route path="/" element={<CustomerRoute><LandingPage /></CustomerRoute>} />
          <Route path="/landing" element={<CustomerRoute><LandingPage /></CustomerRoute>} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/otp" element={<OtpPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          <Route path="/about" element={<CustomerRoute><AboutPage /></CustomerRoute>} />

          {/* Customer Application Flow */}
          <Route path="/explore" element={<CustomerRoute><ExploreEventPage /></CustomerRoute>} />
          <Route path="/event/:id" element={<CustomerRoute><DetailEventPage /></CustomerRoute>} />
          <Route path="/seat-map/:id" element={<CustomerRoute><SeatMapPage /></CustomerRoute>} />
          <Route path="/checkout" element={<CustomerRoute><CheckoutPage /></CustomerRoute>} />
          <Route path="/payment-proof/:orderId" element={<CustomerRoute><PaymentProofPage /></CustomerRoute>} />
          <Route path="/order-success/:orderId" element={<CustomerRoute><OrderSuccessPage /></CustomerRoute>} />
          <Route path="/my-tickets" element={<CustomerRoute><MyTicketsPage /></CustomerRoute>} />
          <Route path="/ticket/:ticketId" element={<CustomerRoute><TicketDetailPage /></CustomerRoute>} />
          <Route path="/settings" element={<CustomerRoute><SettingsPage /></CustomerRoute>} />

          {/* Admin & Superadmin Dashboard Flow */}
          <Route path="/admin/dashboard" element={<AdminRoute><AdminDashboardPage /></AdminRoute>} />
          <Route path="/admin/events" element={<AdminRoute><AdminEventsPage /></AdminRoute>} />
          <Route path="/admin/artists" element={<AdminRoute><AdminArtistsPage /></AdminRoute>} />
          <Route path="/admin/verification" element={<AdminRoute><AdminVerificationPage /></AdminRoute>} />
          <Route path="/admin/scanner" element={<AdminRoute><AdminScannerPage /></AdminRoute>} />
          <Route path="/admin/users" element={<AdminRoute requireSuperadmin={true}><AdminUsersPage /></AdminRoute>} />
          <Route path="/admin/reports" element={
            <AdminRoute><AdminReportsPage /></AdminRoute>
          } />
          <Route path="/admin/chat" element={
            <AdminRoute><AdminChatPage /></AdminRoute>
          } />
          <Route path="/admin/settings" element={<AdminRoute><AdminSettingsPage /></AdminRoute>} />
          <Route path="/admin/notifications" element={<AdminRoute><AdminNotificationsPage /></AdminRoute>} />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        <ChatWidget />
      </Router>
    </StoreProvider>
  );
}
