import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import AdminSidebar from '../components/AdminSidebar';
import AdminTopbar from '../components/AdminTopbar';
import { CheckCircle2, XCircle, Eye, ShieldCheck, RefreshCw, FileText } from 'lucide-react';

export default function AdminVerificationPage() {
  const { orders, approveOrder, rejectOrder, refunds, setRefunds } = useStore();
  const [tab, setTab] = useState('ORDERS'); // 'ORDERS' or 'REFUNDS'
  const [selectedProof, setSelectedProof] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const handleApproveRefund = (refundId) => {
    setRefunds(prev => prev.map(r => r.id === refundId ? { ...r, status: 'APPROVED' } : r));
  };

  const handleRejectRefund = (refundId) => {
    setRefunds(prev => prev.map(r => r.id === refundId ? { ...r, status: 'REJECTED' } : r));
  };

  const filteredOrders = orders.filter(ord => {
    const matchesSearch = 
      ord.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (ord.customerName && ord.customerName.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesStatus = statusFilter === 'ALL' || ord.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-brand-bgLight dark:bg-obsidian-dark flex transition-colors">
      <AdminSidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <AdminTopbar title="Verifikasi Pembayaran & Request Refund" />

        <main className="p-6 md:p-8 space-y-6 overflow-y-auto">
          
          {/* Tab Selector */}
          <div className="flex gap-3 border-b border-gray-200 dark:border-obsidian-border pb-4">
            <button
              onClick={() => setTab('ORDERS')}
              className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all ${
                tab === 'ORDERS'
                  ? 'bg-gold text-obsidian shadow-gold-glow'
                  : 'bg-white dark:bg-obsidian-card text-gray-600 dark:text-gray-300 hover:text-gold'
              }`}
            >
              Verifikasi Pembayaran Orders ({filteredOrders.length}) (FR-04)
            </button>

            <button
              onClick={() => setTab('REFUNDS')}
              className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all ${
                tab === 'REFUNDS'
                  ? 'bg-oxblood text-white shadow-oxblood-glow'
                  : 'bg-white dark:bg-obsidian-card text-gray-600 dark:text-gray-300 hover:text-gold'
              }`}
            >
              Request Refund Customer ({refunds.length}) (Inovasi)
            </button>
          </div>

          {tab === 'ORDERS' ? (
            /* Orders Verification Table */
            <div className="bg-white dark:bg-obsidian-card rounded-3xl border border-gray-200 dark:border-obsidian-border p-6 shadow-sm">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-4 pb-2 border-b border-gray-100 dark:border-obsidian-border">
                <h3 className="text-base font-extrabold">
                  Daftar Pesanan & Status Pembayaran
                </h3>
                
                <div className="flex gap-2 w-full md:w-auto">
                  <input
                    type="text"
                    placeholder="Cari No. Order / Customer..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full md:w-64 px-4 py-2 rounded-xl text-xs bg-gray-50 dark:bg-obsidian-surface border border-gray-200 dark:border-obsidian-border focus:outline-none focus:border-gold transition-colors"
                  />
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="px-4 py-2 rounded-xl text-xs bg-gray-50 dark:bg-obsidian-surface border border-gray-200 dark:border-obsidian-border focus:outline-none focus:border-gold font-semibold transition-colors"
                  >
                    <option value="ALL">Semua Status</option>
                    <option value="PENDING">PENDING</option>
                    <option value="PAID">PAID</option>
                    <option value="FAILED">FAILED</option>
                    <option value="EXPIRED">EXPIRED</option>
                  </select>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-gray-200 dark:border-obsidian-border text-[11px] font-extrabold uppercase text-gray-400">
                      <th className="pb-3">Nomor Order</th>
                      <th className="pb-3">Customer</th>
                      <th className="pb-3">Metode Bayar</th>
                      <th className="pb-3">Total Amount</th>
                      <th className="pb-3">Bukti Bayar</th>
                      <th className="pb-3">Status</th>
                      <th className="pb-3 text-right">Aksi Verifikasi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-obsidian-border text-xs">
                    {filteredOrders.length > 0 ? filteredOrders.map((ord) => {
                      const isPending = ord.status === 'PENDING';
                      const isPaid = ord.status === 'PAID';
                      const isDoku = ord.paymentMethod?.includes('DOKU');
                      const isCheckedIn = ord.tickets?.[0]?.status === 'CHECKED_IN';

                      return (
                        <tr key={ord.id} className="hover:bg-gray-50 dark:hover:bg-obsidian-surface transition-colors">
                          <td className="py-4 font-mono font-bold text-gray-900 dark:text-white">
                            {ord.orderNumber}
                          </td>
                          <td className="py-4">
                            <span className="font-bold block">{ord.customerName}</span>
                            <span className="text-[10px] text-gray-400">{ord.customerEmail}</span>
                          </td>
                          <td className="py-4 font-semibold text-gold">
                            {ord.paymentChannel || ord.paymentMethod}
                          </td>
                          <td className="py-4 font-extrabold text-gray-900 dark:text-white">
                            Rp {ord.totalAmount.toLocaleString('id-ID')}
                          </td>
                          <td className="py-4">
                            {ord.paymentProof ? (
                              <button
                                onClick={() => setSelectedProof(ord.paymentProof)}
                                className="px-3 py-1 rounded-full bg-gold/10 text-gold border border-gold/30 text-[10px] font-bold flex items-center gap-1 hover:bg-gold hover:text-obsidian transition-colors"
                              >
                                <Eye className="w-3 h-3" /> Preview Proof
                              </button>
                            ) : isDoku ? (
                              <span className="text-[10px] font-bold text-green-500 bg-green-500/10 px-2 py-0.5 rounded-full">
                                Doku Auto Verified
                              </span>
                            ) : (
                              <span className="text-[10px] text-gray-400">Belum Upload</span>
                            )}
                          </td>
                          <td className="py-4">
                            {isCheckedIn ? (
                              <span className="bg-oxblood/20 text-oxblood border border-oxblood/40 text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase">
                                TERPAKAI
                              </span>
                            ) : isPaid ? (
                              <span className="bg-gold/20 text-gold border border-gold/40 text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase">
                                PAID (Disetujui)
                              </span>
                            ) : isPending ? (
                              <span className="bg-yellow-500/20 text-yellow-600 dark:text-yellow-400 border border-yellow-500/30 text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase">
                                PENDING
                              </span>
                            ) : (
                              <span className="bg-oxblood/20 text-oxblood border border-oxblood/40 text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase">
                                {ord.status}
                              </span>
                            )}
                          </td>
                          <td className="py-4 text-right">
                            {isPending ? (
                              <div className="flex items-center justify-end gap-2">
                                <button
                                  onClick={() => approveOrder(ord.id)}
                                  className="px-3 py-1.5 rounded-xl bg-gold text-obsidian font-extrabold text-[11px] flex items-center gap-1 shadow-gold-glow"
                                >
                                  <CheckCircle2 className="w-3.5 h-3.5" /> Approve
                                </button>
                                <button
                                  onClick={() => rejectOrder(ord.id)}
                                  className="px-3 py-1.5 rounded-xl bg-oxblood text-white font-extrabold text-[11px] flex items-center gap-1 shadow-oxblood-glow"
                                >
                                  <XCircle className="w-3.5 h-3.5" /> Reject
                                </button>
                              </div>
                            ) : isPaid ? (
                              <div className="flex items-center justify-end">
                                <span className="text-green-500 font-extrabold text-xs flex items-center gap-1 bg-green-500/10 px-3 py-1.5 rounded-xl border border-green-500/20">
                                  <CheckCircle2 className="w-4 h-4" /> Disetujui
                                </span>
                              </div>
                            ) : (
                              <div className="flex items-center justify-end">
                                <span className="text-oxblood font-extrabold text-xs flex items-center gap-1 bg-oxblood/10 px-3 py-1.5 rounded-xl border border-oxblood/20">
                                  <XCircle className="w-4 h-4" /> Ditolak / Batal
                                </span>
                              </div>
                            )}
                          </td>
                        </tr>
                      );
                    }) : (
                      <tr>
                        <td colSpan="7" className="py-10 text-center text-gray-500 font-bold">
                          Tidak ada pesanan yang sesuai dengan filter.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            /* Refund Requests Table */
            <div className="bg-white dark:bg-obsidian-card rounded-3xl border border-gray-200 dark:border-obsidian-border p-6 shadow-sm">
              <h3 className="text-base font-extrabold mb-4 pb-2 border-b border-gray-100 dark:border-obsidian-border">
                Daftar Permohonan Refund Customer (Inovasi)
              </h3>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-gray-200 dark:border-obsidian-border text-[11px] font-extrabold uppercase text-gray-400">
                      <th className="pb-3">Nomor Order</th>
                      <th className="pb-3">Customer</th>
                      <th className="pb-3">Alasan Refund</th>
                      <th className="pb-3">Nominal</th>
                      <th className="pb-3">Status Refund</th>
                      <th className="pb-3 text-right">Aksi Superadmin</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-obsidian-border text-xs">
                    {refunds.map((ref) => (
                      <tr key={ref.id} className="hover:bg-gray-50 dark:hover:bg-obsidian-surface transition-colors">
                        <td className="py-4 font-mono font-bold text-gray-900 dark:text-white">{ref.orderNumber}</td>
                        <td className="py-4 font-bold">{ref.customerName}</td>
                        <td className="py-4 text-gray-600 dark:text-gray-300">{ref.reason}</td>
                        <td className="py-4 font-extrabold text-gold">Rp {ref.amount.toLocaleString('id-ID')}</td>
                        <td className="py-4">
                          <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase ${
                            ref.status === 'APPROVED' ? 'bg-green-500/20 text-green-500' : ref.status === 'REJECTED' ? 'bg-oxblood/20 text-oxblood' : 'bg-yellow-500/20 text-yellow-500'
                          }`}>
                            {ref.status}
                          </span>
                        </td>
                        <td className="py-4 text-right">
                          {ref.status === 'REQUESTED' && (
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => handleApproveRefund(ref.id)}
                                className="px-3 py-1.5 rounded-xl bg-gold text-obsidian font-extrabold text-[11px]"
                              >
                                Setujui Refund
                              </button>
                              <button
                                onClick={() => handleRejectRefund(ref.id)}
                                className="px-3 py-1.5 rounded-xl bg-oxblood text-white font-extrabold text-[11px]"
                              >
                                Tolak
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

        </main>
      </div>

      {/* Proof Preview Modal */}
      {selectedProof && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-obsidian-card p-6 rounded-3xl border border-gray-200 dark:border-obsidian-border max-w-lg w-full shadow-2xl text-center">
            <h3 className="font-extrabold text-base mb-4">Preview Bukti Transfer Manual</h3>
            <img src={selectedProof} alt="Bukti Transfer" className="w-full max-h-80 object-contain rounded-2xl mb-4 border border-gray-200 dark:border-obsidian-border" />
            <button
              onClick={() => setSelectedProof(null)}
              className="px-6 py-2 rounded-full bg-obsidian text-white hover:text-gold text-xs font-bold"
            >
              Tutup Preview
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
