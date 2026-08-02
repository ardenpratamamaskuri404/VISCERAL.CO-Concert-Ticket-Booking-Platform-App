import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import Navbar from '../components/Navbar';
import { CheckCircle2, Ticket, ArrowRight, ShieldCheck } from 'lucide-react';
import api from '../api/axios';

export default function OrderSuccessPage() {
  const { orderId } = useParams();
  const { orders } = useStore();

  const order = orders.find((o) => o.id === orderId) || orders[0];

  // Simulasi Webhook DOKU untuk Localhost
  // Karena DOKU tidak bisa mengirim webhook asli ke localhost, kita trigger manual
  React.useEffect(() => {
    if (order && order.status === 'PENDING') {
      api.put(`/orders/${order.id}/approve`).catch(console.error);
    }
  }, [order]);

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-brand-bgLight dark:bg-obsidian-dark text-brand-darkText dark:text-brand-lightText">
        <div className="text-center animate-pulse">
          <p className="font-bold text-lg mb-2 text-gold">Memuat E-Tiket...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-bgLight dark:bg-obsidian-dark text-brand-darkText dark:text-brand-lightText transition-colors">
      <Navbar />

      <div className="pt-32 pb-16 px-4 md:px-8 max-w-xl mx-auto text-center">
        <div className="bg-white dark:bg-obsidian-card p-8 rounded-3xl border border-gray-200 dark:border-obsidian-border shadow-obsidian-glow relative overflow-hidden">
          
          <div className="pulse-line-oxblood w-full absolute top-0 left-0"></div>

          {/* Success Checkmark Animation */}
          <div className="w-20 h-20 bg-green-500/10 text-green-500 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
            <CheckCircle2 className="w-12 h-12" />
          </div>

          <span className="text-[10px] font-extrabold text-gold uppercase tracking-widest block mb-1">
            Pembayaran Sukses & Terverifikasi
          </span>
          <h1 className="text-2xl font-extrabold tracking-tight">Selamat! E-Tiket Anda Telah Terbit</h1>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 mb-6">
            Nomor Transaksi: <strong className="text-gold">{order.orderNumber}</strong>
          </p>

          <div className="p-4 rounded-2xl bg-gray-50 dark:bg-obsidian-surface border border-gray-200 dark:border-obsidian-border text-xs text-left space-y-2 mb-6">
            <div className="flex justify-between">
              <span className="text-gray-500 dark:text-gray-400">Event:</span>
              <span className="font-bold text-gray-900 dark:text-white">{order.eventTitle}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500 dark:text-gray-400">Nomor Kursi:</span>
              <span className="font-extrabold text-gold">{order.tickets[0]?.seatNumber}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500 dark:text-gray-400">Kode Tiket (QR):</span>
              <span className="font-mono text-xs text-gray-700 dark:text-gray-300">{order.tickets[0]?.ticketCode}</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              to={`/ticket/${order.tickets[0]?.id || 'tkt-1'}`}
              className="flex-1 py-3.5 rounded-xl gold-gradient-btn text-obsidian font-extrabold text-xs flex items-center justify-center gap-2 shadow-gold-glow"
            >
              <Ticket className="w-4 h-4" />
              Buka E-Tiket QR Code
            </Link>

            <Link
              to="/my-tickets"
              className="px-6 py-3.5 rounded-xl bg-obsidian text-white hover:text-gold border border-gold/30 text-xs font-bold"
            >
              Lihat Tiket Saya
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}
