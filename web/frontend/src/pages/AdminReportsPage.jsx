import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import AdminSidebar from '../components/AdminSidebar';
import AdminTopbar from '../components/AdminTopbar';
import { FileText, Download, Filter, Calendar, DollarSign, Ticket } from 'lucide-react';

export default function AdminReportsPage() {
  const { events, orders } = useStore();
  const [selectedEvent, setSelectedEvent] = useState('ALL');

  const filteredOrders = selectedEvent === 'ALL'
    ? orders
    : orders.filter((o) => o.eventId === selectedEvent);

  const totalRev = filteredOrders.reduce((sum, o) => sum + o.totalAmount, 0);

  const handleExportCSV = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + ["OrderNumber,Customer,Event,Amount,Status,Date"].join(",") + "\n"
      + filteredOrders.map(o => `${o.orderNumber},${o.customerName},${o.eventTitle},${o.totalAmount},${o.status},${o.createdAt}`).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `laporan_penjualan_visceral_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-brand-bgLight dark:bg-obsidian-dark flex transition-colors">
      <AdminSidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <AdminTopbar title="Laporan & Analytics Penjualan (Superadmin)" />

        <main className="p-6 md:p-8 space-y-6 overflow-y-auto">
          
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h2 className="text-xl font-extrabold tracking-tight">Laporan Penjualan Tiket</h2>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Filter laporan per event dan lakukan ekspor data transaksi ke file CSV / Excel.
              </p>
            </div>

            <button
              onClick={handleExportCSV}
              className="px-5 py-2.5 rounded-xl gold-gradient-btn text-obsidian text-xs font-extrabold flex items-center gap-2 shadow-gold-glow"
            >
              <Download className="w-4 h-4" /> Ekspor Laporan CSV
            </button>
          </div>

          {/* Filter Bar */}
          <div className="bg-white dark:bg-obsidian-card p-4 rounded-3xl border border-gray-200 dark:border-obsidian-border shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <Filter className="w-4 h-4 text-gold" />
              <span className="text-xs font-bold">Filter Event:</span>
              <select
                value={selectedEvent}
                onChange={(e) => setSelectedEvent(e.target.value)}
                className="py-2 px-4 rounded-full text-xs bg-gray-50 dark:bg-obsidian-surface border border-gray-200 dark:border-obsidian-border text-gray-900 dark:text-white focus:outline-none focus:border-gold"
              >
                <option value="ALL">Semua Konser (All Events)</option>
                {events.map((ev) => (
                  <option key={ev.id} value={ev.id}>{ev.title}</option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-4 text-xs">
              <span className="text-gray-500">Total Transaksi: <strong className="text-gold font-bold">{filteredOrders.length} Order</strong></span>
              <span className="text-gray-500">Omzet: <strong className="text-gold font-bold">Rp {totalRev.toLocaleString('id-ID')}</strong></span>
            </div>
          </div>

          {/* Report Table */}
          <div className="bg-white dark:bg-obsidian-card rounded-3xl border border-gray-200 dark:border-obsidian-border p-6 shadow-sm">
            <h3 className="text-base font-extrabold mb-4 pb-2 border-b border-gray-100 dark:border-obsidian-border flex items-center gap-2">
              <FileText className="w-4 h-4 text-gold" />
              Tabel Rincian Laporan Transaksi
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-obsidian-border text-[11px] font-extrabold uppercase text-gray-400">
                    <th className="pb-3">Nomor Order</th>
                    <th className="pb-3">Customer</th>
                    <th className="pb-3">Konser / Event</th>
                    <th className="pb-3">Metode Pembayaran</th>
                    <th className="pb-3">Nominal Transaksi</th>
                    <th className="pb-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-obsidian-border text-xs">
                  {filteredOrders.map((o) => (
                    <tr key={o.id} className="hover:bg-gray-50 dark:hover:bg-obsidian-surface transition-colors">
                      <td className="py-3.5 font-mono font-bold text-gray-900 dark:text-white">{o.orderNumber}</td>
                      <td className="py-3.5 font-bold">{o.customerName}</td>
                      <td className="py-3.5 text-gray-600 dark:text-gray-300">{o.eventTitle}</td>
                      <td className="py-3.5 text-gold font-semibold">{o.paymentChannel || o.paymentMethod}</td>
                      <td className="py-3.5 font-extrabold text-gray-900 dark:text-white">Rp {o.totalAmount.toLocaleString('id-ID')}</td>
                      <td className="py-3.5">
                        <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase ${
                          o.status === 'PAID' ? 'bg-gold/20 text-gold border border-gold/30' : 'bg-yellow-500/20 text-yellow-500'
                        }`}>
                          {o.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </main>
      </div>
    </div>
  );
}
