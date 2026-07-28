import React from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import Navbar from '../components/Navbar';
import { Ticket, Calendar, QrCode, ShieldCheck, Clock, ChevronRight } from 'lucide-react';

export default function MyTicketsPage() {
  const { orders } = useStore();

  return (
    <div className="min-h-screen bg-brand-bgLight dark:bg-obsidian-dark text-brand-darkText dark:text-brand-lightText transition-colors">
      <Navbar />

      <div className="pt-28 pb-16 px-4 md:px-8 max-w-5xl mx-auto">
        <div className="mb-8">
          <span className="text-xs font-bold text-oxblood dark:text-gold uppercase tracking-widest block mb-1">
            Riwayat Pemesanan
          </span>
          <h1 className="text-3xl font-extrabold tracking-tight">Daftar Tiket & Pesanan Saya</h1>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Kelola tiket konser dan lihat status verifikasi pembayaran Anda.
          </p>
        </div>

        {orders.length === 0 ? (
          <div className="bg-white dark:bg-obsidian-card p-12 rounded-3xl border border-gray-200 dark:border-obsidian-border text-center">
            <Ticket className="w-12 h-12 text-gray-400 mx-auto mb-3 opacity-50" />
            <h3 className="text-base font-bold">Belum Ada Tiket</h3>
            <p className="text-xs text-gray-500 mt-1 mb-4">Anda belum memiliki riwayat pemesanan tiket konser.</p>
            <Link
              to="/explore"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full gold-gradient-btn text-obsidian font-bold text-xs shadow-gold-glow"
            >
              Jelajahi Konser Sekarang
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => {
              const isPaid = order.status === 'PAID';
              const isPending = order.status === 'PENDING';
              const isCancelled = order.status === 'CANCELLED' || order.status === 'EXPIRED';

              return (
                <div
                  key={order.id}
                  className="bg-white dark:bg-obsidian-card p-6 rounded-3xl border border-gray-200 dark:border-obsidian-border shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-gold/50 transition-all"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-obsidian text-gold flex items-center justify-center font-bold shrink-0">
                      <Ticket className="w-6 h-6" />
                    </div>

                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] font-mono text-gray-400">{order.orderNumber}</span>
                        
                        {isPaid && (
                          <span className="bg-gold/20 text-gold border border-gold/40 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase flex items-center gap-1">
                            <ShieldCheck className="w-3 h-3" /> Tiket Aktif (Paid)
                          </span>
                        )}

                        {isPending && (
                          <span className="bg-yellow-500/20 text-yellow-600 dark:text-yellow-400 border border-yellow-500/30 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase flex items-center gap-1">
                            <Clock className="w-3 h-3" /> Menunggu Verifikasi
                          </span>
                        )}

                        {isCancelled && (
                          <span className="bg-oxblood/20 text-oxblood border border-oxblood/40 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase">
                            Dibatalkan / Expired
                          </span>
                        )}
                      </div>

                      <h3 className="font-extrabold text-base text-gray-900 dark:text-white">
                        {order.eventTitle}
                      </h3>

                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        Kursi: <strong className="text-gold font-bold">{order.tickets[0]?.seatNumber}</strong> | Kategori: {order.tickets[0]?.categoryName}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between md:justify-end gap-4 pt-4 md:pt-0 border-t md:border-t-0 border-gray-100 dark:border-obsidian-border">
                    <div className="text-left md:text-right">
                      <span className="text-[10px] text-gray-400 uppercase tracking-wider block">Total Harga</span>
                      <span className="text-sm font-extrabold text-gold">
                        Rp {order.totalAmount.toLocaleString('id-ID')}
                      </span>
                    </div>

                    {isPaid ? (
                      <Link
                        to={`/ticket/${order.tickets[0]?.id || 'tkt-1'}`}
                        className="px-5 py-2.5 rounded-full gold-gradient-btn text-obsidian text-xs font-bold flex items-center gap-1 shadow-gold-glow"
                      >
                        <QrCode className="w-4 h-4" /> Buka QR Tiket
                      </Link>
                    ) : isPending ? (
                      <Link
                        to={`/payment-proof/${order.id}`}
                        className="px-5 py-2.5 rounded-full bg-obsidian text-white hover:text-gold border border-gold/30 text-xs font-bold flex items-center gap-1"
                      >
                        Status Pembayaran <ChevronRight className="w-4 h-4" />
                      </Link>
                    ) : (
                      <button disabled className="px-5 py-2.5 rounded-full bg-gray-100 dark:bg-obsidian-surface text-gray-400 text-xs font-bold">
                        Expired
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
