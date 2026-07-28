import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import Navbar from '../components/Navbar';
import { CreditCard, Building, QrCode, ArrowRight, ShieldCheck, Clock, Ticket } from 'lucide-react';

export default function CheckoutPage() {
  const { orderId } = useParams();
  const { orders, setActiveCheckout } = useStore();
  const navigate = useNavigate();

  const order = orders.find((o) => o.id === orderId) || orders[0];

  const [paymentMethod, setPaymentMethod] = useState('DOKU_VA');

  const handleProceed = () => {
    // Update order payment method
    order.paymentMethod = paymentMethod;
    setActiveCheckout(order);
    navigate(`/payment-proof/${order.id}`);
  };

  return (
    <div className="min-h-screen bg-brand-bgLight dark:bg-obsidian-dark text-brand-darkText dark:text-brand-lightText transition-colors">
      <Navbar />

      <div className="pt-28 pb-16 px-4 md:px-8 max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <span className="text-[10px] font-bold text-oxblood dark:text-gold uppercase tracking-widest block">Checkout Safe & Fast</span>
          <h1 className="text-3xl font-extrabold tracking-tight">Ringkasan Pemesanan & Pembayaran</h1>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Nomor Pesanan: <strong className="text-gold font-bold">{order.orderNumber}</strong>
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Left Column: Payment Method Selection (FR-04 Jalur A Manual vs Jalur B Doku) */}
          <div className="md:col-span-2 space-y-6">
            <div className="bg-white dark:bg-obsidian-card p-6 rounded-3xl border border-gray-200 dark:border-obsidian-border shadow-sm">
              <h3 className="text-base font-extrabold mb-4 pb-2 border-b border-gray-200 dark:border-obsidian-border flex items-center justify-between">
                <span>Pilih Metode Pembayaran</span>
                <span className="text-[10px] font-extrabold bg-gold/10 text-gold px-2.5 py-1 rounded-full uppercase">
                  Sandbox Environment
                </span>
              </h3>

              <div className="space-y-3">
                {/* Doku Sandbox Virtual Account */}
                <label
                  onClick={() => setPaymentMethod('DOKU_VA')}
                  className={`p-4 rounded-2xl border flex items-center justify-between cursor-pointer transition-all ${
                    paymentMethod === 'DOKU_VA'
                      ? 'border-gold bg-gold/5 shadow-gold-glow'
                      : 'border-gray-200 dark:border-obsidian-border bg-gray-50 dark:bg-obsidian-surface hover:border-gold/50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-obsidian text-gold flex items-center justify-center font-bold">
                      VA
                    </div>
                    <div>
                      <h4 className="font-extrabold text-xs">Doku Virtual Account (BCA / BNI / Mandiri)</h4>
                      <p className="text-[11px] text-gray-500 dark:text-gray-400">
                        Verifikasi otomatis instan via Webhook Sandbox Doku
                      </p>
                    </div>
                  </div>
                  <input
                    type="radio"
                    name="pay"
                    checked={paymentMethod === 'DOKU_VA'}
                    onChange={() => setPaymentMethod('DOKU_VA')}
                    className="text-gold focus:ring-gold"
                  />
                </label>

                {/* Doku Sandbox QRIS */}
                <label
                  onClick={() => setPaymentMethod('DOKU_QRIS')}
                  className={`p-4 rounded-2xl border flex items-center justify-between cursor-pointer transition-all ${
                    paymentMethod === 'DOKU_QRIS'
                      ? 'border-gold bg-gold/5 shadow-gold-glow'
                      : 'border-gray-200 dark:border-obsidian-border bg-gray-50 dark:bg-obsidian-surface hover:border-gold/50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-obsidian text-gold flex items-center justify-center font-bold">
                      <QrCode className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-extrabold text-xs">Doku QRIS Instant Payment</h4>
                      <p className="text-[11px] text-gray-500 dark:text-gray-400">
                        Scan QRIS dari aplikasi GoPay, OVO, ShopeePay, DANA
                      </p>
                    </div>
                  </div>
                  <input
                    type="radio"
                    name="pay"
                    checked={paymentMethod === 'DOKU_QRIS'}
                    onChange={() => setPaymentMethod('DOKU_QRIS')}
                    className="text-gold focus:ring-gold"
                  />
                </label>

                {/* Manual Bank Transfer (Baseline Wajib Soal) */}
                <label
                  onClick={() => setPaymentMethod('MANUAL_TRANSFER')}
                  className={`p-4 rounded-2xl border flex items-center justify-between cursor-pointer transition-all ${
                    paymentMethod === 'MANUAL_TRANSFER'
                      ? 'border-gold bg-gold/5 shadow-gold-glow'
                      : 'border-gray-200 dark:border-obsidian-border bg-gray-50 dark:bg-obsidian-surface hover:border-gold/50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-oxblood text-white flex items-center justify-center font-bold">
                      <Building className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-extrabold text-xs">Transfer Bank Manual (Upload Bukti)</h4>
                      <p className="text-[11px] text-gray-500 dark:text-gray-400">
                        Upload foto bukti transfer untuk dikonfirmasi Admin
                      </p>
                    </div>
                  </div>
                  <input
                    type="radio"
                    name="pay"
                    checked={paymentMethod === 'MANUAL_TRANSFER'}
                    onChange={() => setPaymentMethod('MANUAL_TRANSFER')}
                    className="text-gold focus:ring-gold"
                  />
                </label>
              </div>
            </div>
          </div>

          {/* Right Column: Summary Card */}
          <div>
            <div className="bg-white dark:bg-obsidian-card p-6 rounded-3xl border border-gray-200 dark:border-obsidian-border shadow-obsidian-glow sticky top-24">
              <h3 className="text-base font-extrabold mb-4 pb-2 border-b border-gray-200 dark:border-obsidian-border">
                Detail Biaya
              </h3>

              <div className="space-y-3 text-xs mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-500 dark:text-gray-400">Event:</span>
                  <span className="font-bold text-right truncate max-w-[150px]">{order.eventTitle}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500 dark:text-gray-400">Kursi:</span>
                  <span className="font-bold text-gold">{order.tickets[0]?.seatNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500 dark:text-gray-400">Kategori:</span>
                  <span className="font-bold">{order.tickets[0]?.categoryName}</span>
                </div>
                <div className="flex justify-between pt-3 border-t border-gray-100 dark:border-obsidian-border text-sm">
                  <span className="font-bold">Total Pembayaran:</span>
                  <span className="font-extrabold text-gold text-base">
                    Rp {order.totalAmount.toLocaleString('id-ID')}
                  </span>
                </div>
              </div>

              <button
                onClick={handleProceed}
                className="w-full py-3.5 rounded-xl gold-gradient-btn text-obsidian font-extrabold text-xs flex items-center justify-center gap-2 shadow-gold-glow"
              >
                Bayar Sekarang
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
