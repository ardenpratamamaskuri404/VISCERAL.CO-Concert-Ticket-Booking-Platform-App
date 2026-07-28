import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { StoreProvider } from './context/StoreContext';

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
import ProfilePage from './pages/ProfilePage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import AdminEventsPage from './pages/AdminEventsPage';
import AdminVerificationPage from './pages/AdminVerificationPage';
import AdminUsersPage from './pages/AdminUsersPage';
import AdminReportsPage from './pages/AdminReportsPage';

export default function App() {
  return (
    <StoreProvider>
      <Router>
        <Routes>
          {/* Public & Customer Auth Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/landing" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/otp" element={<OtpPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />

          {/* Customer Application Flow */}
          <Route path="/explore" element={<ExploreEventPage />} />
          <Route path="/event/:id" element={<DetailEventPage />} />
          <Route path="/seat-map/:id" element={<SeatMapPage />} />
          <Route path="/checkout/:orderId" element={<CheckoutPage />} />
          <Route path="/payment-proof/:orderId" element={<PaymentProofPage />} />
          <Route path="/order-success/:orderId" element={<OrderSuccessPage />} />
          <Route path="/my-tickets" element={<MyTicketsPage />} />
          <Route path="/ticket/:ticketId" element={<TicketDetailPage />} />
          <Route path="/profile" element={<ProfilePage />} />

          {/* Admin & Superadmin Dashboard Flow */}
          <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
          <Route path="/admin/events" element={<AdminEventsPage />} />
          <Route path="/admin/verification" element={<AdminVerificationPage />} />
          <Route path="/admin/users" element={<AdminUsersPage />} />
          <Route path="/admin/reports" element={<AdminReportsPage />} />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </StoreProvider>
  );
}
