import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import Navbar from '../components/Navbar';
import { Ticket, Calendar, QrCode, ShieldCheck, Clock, ChevronRight, RefreshCcw, X, AlertCircle, CheckCircle2 } from 'lucide-react';
import api from '../api/axios';

export default function MyTicketsPage() {
  const { orders, fetchOrders } = useStore();

  const [refundModal, setRefundModal] = useState({
    isOpen: false,
    orderId: null,
    reason: '',
    bankName: 'BCA',
    accountNumber: '',
    accountName: '',
    agreePolicy: false,
    loading: false,
    error: '',
    success: ''
  });

  const openRefundModal = (orderId) => {
    setRefundModal({
      isOpen: true,
      orderId,
      reason: '',
      bankName: 'BCA',
      accountNumber: '',
      accountName: '',
      agreePolicy: false,
      loading: false,
      error: '',
      success: ''
    });
  };

  const submitRefund = async () => {
    if (!refundModal.reason.trim()) {
      setRefundModal(prev => ({ ...prev, error: 'Alasan refund tidak boleh kosong.', success: '' }));
      return;
    }
    if (!refundModal.accountNumber.trim() || !refundModal.accountName.trim()) {
      setRefundModal(prev => ({ ...prev, error: 'Informasi rekening pengembalian dana harus diisi lengkap.', success: '' }));
      return;
    }
    if (!refundModal.agreePolicy) {
      setRefundModal(prev => ({ ...prev, error: 'Anda harus menyetujui syarat dan ketentuan pembatalan.', success: '' }));
      return;
    }
    
    setRefundModal(prev => ({ ...prev, loading: true, error: '', success: '' }));
    try {
      const formattedReason = `[${refundModal.bankName} - ${refundModal.accountNumber} - a/n ${refundModal.accountName}]\n\nAlasan:\n${refundModal.reason}`;
      const res = await api.post(`/orders/${refundModal.orderId}/refund`, { reason: formattedReason });
      
      if (res.data?.success) {
        setRefundModal(prev => ({ ...prev, loading: false, success: 'Pengajuan refund berhasil dikirim.', error: '' }));
        fetchOrders();
        setTimeout(() => {
          setRefundModal(prev => ({ ...prev, isOpen: false }));
        }, 2500);
      }
    } catch (e) {
      console.error(e);
      setRefundModal(prev => ({ 
        ...prev, 
        loading: false, 
        error: 'Gagal mengajukan refund. Pastikan Anda belum mengajukan refund sebelumnya.',
        success: ''
      }));
    }
  };

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
                      <>
                        <Link
                          to={`/ticket/${order.tickets[0]?.id || 'tkt-1'}`}
                          className="px-5 py-2.5 rounded-full gold-gradient-btn text-obsidian text-xs font-bold flex items-center gap-1 shadow-gold-glow"
                        >
                          <QrCode className="w-4 h-4" /> Buka QR Tiket
                        </Link>
                        <button 
                          onClick={() => openRefundModal(order.id)}
                          className="px-4 py-2.5 rounded-full border border-gray-200 dark:border-obsidian-border text-gray-500 hover:text-red-500 hover:border-red-200 hover:bg-red-50 transition-colors text-xs font-bold flex items-center gap-1"
                        >
                          <RefreshCcw className="w-3 h-3" /> Refund
                        </button>
                      </>
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

      {/* Refund Modal */}
      {refundModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
          <div className="bg-white dark:bg-obsidian-card rounded-3xl w-full max-w-lg overflow-hidden border border-gray-100 dark:border-obsidian-border shadow-2xl relative animate-in fade-in zoom-in duration-300">
            {/* Modal Header */}
            <div className="bg-gray-50 dark:bg-obsidian p-6 border-b border-gray-100 dark:border-obsidian-border relative">
              <button 
                onClick={() => !refundModal.loading && setRefundModal(prev => ({ ...prev, isOpen: false }))}
                className="absolute top-6 right-6 p-2 text-gray-400 hover:text-white bg-gray-200 dark:bg-obsidian-surface hover:bg-oxblood rounded-full transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-oxblood/10 text-oxblood flex items-center justify-center">
                  <RefreshCcw className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-extrabold text-gray-900 dark:text-white">Pengajuan Refund</h3>
                  <p className="text-[11px] font-semibold text-gray-500 uppercase tracking-widest mt-1">Pembatalan Tiket & Pengembalian Dana</p>
                </div>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 max-h-[60vh] overflow-y-auto custom-scrollbar">
              {refundModal.error && (
                <div className="mb-6 bg-oxblood/10 text-oxblood border border-oxblood/20 p-4 rounded-xl flex items-start gap-3 text-sm font-bold">
                  <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" /> 
                  <p>{refundModal.error}</p>
                </div>
              )}

              {refundModal.success && (
                <div className="mb-6 bg-green-500/10 text-green-500 border border-green-500/20 p-4 rounded-xl flex items-center gap-3 text-sm font-bold">
                  <CheckCircle2 className="w-5 h-5 flex-shrink-0" /> 
                  <p>{refundModal.success}</p>
                </div>
              )}

              <div className="space-y-5 opacity-100 transition-opacity">
                {/* Bank Details Section */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-2 uppercase tracking-wide">
                    Rekening Pengembalian Dana
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <span className="text-[10px] text-gray-500 block mb-1">Nama Bank</span>
                      <select 
                        value={refundModal.bankName}
                        onChange={(e) => setRefundModal(prev => ({ ...prev, bankName: e.target.value, error: '' }))}
                        disabled={refundModal.loading || refundModal.success}
                        className="w-full bg-gray-50 dark:bg-obsidian-surface p-3 rounded-xl text-sm border border-gray-200 dark:border-obsidian-border focus:border-gold focus:outline-none transition-colors"
                      >
                        <option value="BCA">BCA</option>
                        <option value="Mandiri">Mandiri</option>
                        <option value="BNI">BNI</option>
                        <option value="BRI">BRI</option>
                        <option value="BSI">BSI</option>
                        <option value="ShopeePay">ShopeePay</option>
                        <option value="GoPay">GoPay</option>
                        <option value="OVO">OVO</option>
                        <option value="DANA">DANA</option>
                      </select>
                    </div>
                    <div>
                      <span className="text-[10px] text-gray-500 block mb-1">Nomor Rekening / HP</span>
                      <input 
                        type="text"
                        value={refundModal.accountNumber}
                        onChange={(e) => setRefundModal(prev => ({ ...prev, accountNumber: e.target.value, error: '' }))}
                        disabled={refundModal.loading || refundModal.success}
                        placeholder="Contoh: 1234567890"
                        className="w-full bg-gray-50 dark:bg-obsidian-surface p-3 rounded-xl text-sm border border-gray-200 dark:border-obsidian-border focus:border-gold focus:outline-none transition-colors"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <span className="text-[10px] text-gray-500 block mb-1">Nama Pemilik Rekening</span>
                      <input 
                        type="text"
                        value={refundModal.accountName}
                        onChange={(e) => setRefundModal(prev => ({ ...prev, accountName: e.target.value, error: '' }))}
                        disabled={refundModal.loading || refundModal.success}
                        placeholder="Sesuai buku tabungan"
                        className="w-full bg-gray-50 dark:bg-obsidian-surface p-3 rounded-xl text-sm border border-gray-200 dark:border-obsidian-border focus:border-gold focus:outline-none transition-colors"
                      />
                    </div>
                  </div>
                </div>

                {/* Reason Section */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-2 uppercase tracking-wide">
                    Alasan Pembatalan
                  </label>
                  <textarea
                    className="w-full bg-gray-50 dark:bg-obsidian-surface p-4 rounded-2xl text-sm border border-gray-200 dark:border-obsidian-border focus:border-gold focus:outline-none transition-colors resize-none h-28"
                    placeholder="Ceritakan alasan detail mengapa Anda ingin membatalkan pesanan ini..."
                    value={refundModal.reason}
                    onChange={(e) => setRefundModal(prev => ({ ...prev, reason: e.target.value, error: '' }))}
                    disabled={refundModal.loading || refundModal.success}
                  />
                </div>

                {/* Policy Agreement */}
                <label className="flex items-start gap-3 p-4 rounded-2xl border border-gray-200 dark:border-obsidian-border bg-gray-50 dark:bg-obsidian-surface cursor-pointer group hover:border-gold/50 transition-colors">
                  <div className="relative flex items-center justify-center mt-0.5">
                    <input 
                      type="checkbox" 
                      className="peer sr-only"
                      checked={refundModal.agreePolicy}
                      onChange={(e) => setRefundModal(prev => ({ ...prev, agreePolicy: e.target.checked, error: '' }))}
                      disabled={refundModal.loading || refundModal.success}
                    />
                    <div className="w-5 h-5 rounded-md border-2 border-gray-300 dark:border-gray-600 peer-checked:bg-gold peer-checked:border-gold transition-colors flex items-center justify-center">
                      <CheckCircle2 className="w-3.5 h-3.5 text-obsidian opacity-0 peer-checked:opacity-100" />
                    </div>
                  </div>
                  <div className="text-[11px] text-gray-500 dark:text-gray-400 leading-relaxed">
                    Saya mengerti bahwa dana yang dikembalikan mungkin dipotong biaya administrasi sesuai kebijakan penyelenggara, dan tiket ini akan <strong className="text-oxblood font-bold">hangus secara permanen</strong>.
                  </div>
                </label>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-6 bg-gray-50 dark:bg-obsidian border-t border-gray-100 dark:border-obsidian-border flex items-center justify-end gap-3">
              <button
                onClick={() => setRefundModal(prev => ({ ...prev, isOpen: false }))}
                disabled={refundModal.loading}
                className="px-6 py-3 rounded-xl bg-white dark:bg-obsidian-surface border border-gray-200 dark:border-obsidian-border text-gray-600 dark:text-gray-300 font-bold text-xs hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                Kembali
              </button>
              <button
                onClick={submitRefund}
                disabled={refundModal.loading || refundModal.success}
                className="px-8 py-3 rounded-xl bg-oxblood hover:bg-red-700 text-white font-extrabold text-xs shadow-oxblood-glow transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {refundModal.loading ? 'Memproses...' : 'Kirim Pengajuan'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
