import React from 'react';
import { ArrowRight, ArrowLeft } from 'lucide-react';

export default function CheckoutSummary({ orderData, handleProceed, onCancel, loading }) {
  return (
    <div>
      <div className="bg-white dark:bg-obsidian-card p-6 rounded-3xl border border-gray-200 dark:border-obsidian-border shadow-obsidian-glow sticky top-24">
        <h3 className="text-base font-extrabold text-gray-900 dark:text-white mb-4 pb-2 border-b border-gray-200 dark:border-obsidian-border">
          Detail Biaya
        </h3>

        <div className="space-y-3 text-xs mb-6">
          <div className="flex justify-between">
            <span className="text-gray-500 dark:text-gray-400">Event:</span>
            <span className="font-bold text-gray-900 dark:text-white text-right truncate max-w-[150px]">{orderData.eventTitle}</span>
          </div>
          <div className="flex justify-between items-start">
            <span className="text-gray-500 dark:text-gray-400">Tiket:</span>
            <div className="flex flex-col items-end">
              {orderData.tickets.map((t, idx) => (
                <span key={idx} className="font-bold text-gold">{t.seatNumber} ({t.categoryName})</span>
              ))}
            </div>
          </div>
          <div className="flex justify-between pt-3 border-t border-gray-100 dark:border-obsidian-border text-sm">
            <span className="font-bold text-gray-900 dark:text-white">Total Pembayaran:</span>
            <span className="font-extrabold text-gold text-base">
              Rp {orderData.totalAmount.toLocaleString('id-ID')}
            </span>
          </div>
        </div>

        <button
          onClick={handleProceed}
          disabled={loading}
          className="w-full py-3.5 rounded-xl gold-gradient-btn text-obsidian font-extrabold text-xs flex items-center justify-center gap-2 shadow-gold-glow disabled:opacity-50"
        >
          {loading ? 'Memproses Pesanan...' : 'Bayar Sekarang'}
          {!loading && <ArrowRight className="w-4 h-4" />}
        </button>

        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="w-full mt-2.5 py-3 rounded-xl bg-gray-100 dark:bg-obsidian-surface border border-gray-200 dark:border-obsidian-border text-gray-700 dark:text-gray-300 hover:border-oxblood/50 hover:text-oxblood dark:hover:text-red-400 font-bold text-xs flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
          >
            <ArrowLeft className="w-4 h-4" />
            Batalkan & Ubah Pilihan
          </button>
        )}
      </div>
    </div>
  );
}
