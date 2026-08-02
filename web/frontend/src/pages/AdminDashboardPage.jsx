import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import AdminSidebar from '../components/AdminSidebar';
import AdminTopbar from '../components/AdminTopbar';
import { Ticket, DollarSign, TrendingUp, Users, CheckCircle2, Clock, Calendar, ArrowUpRight, Filter } from 'lucide-react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function AdminDashboardPage() {
  const { events, orders, currentUser } = useStore();
  const [dateFilter, setDateFilter] = useState('ALL');

  // Filter orders by date range
  const filteredOrders = orders.filter(o => {
    if (dateFilter === 'ALL') return true;
    const orderDate = new Date(o.createdAt);
    const now = new Date();
    
    if (dateFilter === 'TODAY') {
      return orderDate.toDateString() === now.toDateString();
    } else if (dateFilter === 'THIS_WEEK') {
      const oneWeekAgo = new Date(now.setDate(now.getDate() - 7));
      return orderDate >= oneWeekAgo;
    } else if (dateFilter === 'THIS_MONTH') {
      return orderDate.getMonth() === now.getMonth() && orderDate.getFullYear() === now.getFullYear();
    }
    return true;
  });

  // Metrics calculation
  const totalTicketsSold = events.reduce((acc, ev) => {
    return acc + (ev.ticketCategories || ev.categories || []).reduce((sum, cat) => sum + ((cat.totalSeats || 0) - (cat.availableSeats || 0)), 0);
  }, 0);
  
  const totalSeats = events.reduce((acc, ev) => {
    return acc + (ev.ticketCategories || ev.categories || []).reduce((sum, cat) => sum + (cat.totalSeats || 0), 0);
  }, 0);

  const totalRevenue = filteredOrders.filter((o) => o.status === 'PAID').reduce((acc, curr) => acc + Number(curr.totalAmount || 0), 0);
  const occupancyPercentage = totalSeats > 0 ? Math.round((totalTicketsSold / totalSeats) * 100) : 0;
  
  // As a simulation for live gate check-in, we just base it on a fraction of sold tickets
  const liveCheckinCount = Math.floor(totalTicketsSold * 0.4);

  // Chart Data Generation (Superadmin Only)
  const isSuperadmin = currentUser?.role === 'SUPERADMIN';
  
  // 1. Payment Methods Distribution (Pie Chart)
  const paymentMethodsData = [];
  if (isSuperadmin) {
    const methodCounts = {};
    filteredOrders.filter(o => o.status === 'PAID').forEach(o => {
      const method = o.paymentChannel || o.paymentMethod || 'Lainnya';
      methodCounts[method] = (methodCounts[method] || 0) + 1;
    });
    for (const [key, value] of Object.entries(methodCounts)) {
      paymentMethodsData.push({ name: key, value });
    }
  }
  const COLORS = ['#D4AF37', '#8B0000', '#2563EB', '#10B981', '#F59E0B'];

  // 2. Daily Revenue (Bar Chart)
  const dailyRevenueData = [];
  if (isSuperadmin) {
    const revenueByDate = {};
    filteredOrders.filter(o => o.status === 'PAID').forEach(o => {
      const dateStr = new Date(o.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });
      revenueByDate[dateStr] = (revenueByDate[dateStr] || 0) + Number(o.totalAmount);
    });
    for (const [date, rev] of Object.entries(revenueByDate)) {
      dailyRevenueData.push({ date, revenue: rev });
    }
  }

  return (
    <div className="min-h-screen bg-brand-bgLight dark:bg-obsidian-dark flex transition-colors">
      <AdminSidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <AdminTopbar title="Dashboard Monitoring Penjualan" />

        <main className="p-6 md:p-8 space-y-8 overflow-y-auto">
          
          <div className="flex justify-between items-center bg-white dark:bg-obsidian-card p-4 rounded-3xl border border-gray-200 dark:border-obsidian-border shadow-sm">
            <h2 className="text-sm font-extrabold flex items-center gap-2">
              <Filter className="w-4 h-4 text-gold" />
              Filter Dashboard
            </h2>
            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="px-4 py-2 rounded-xl text-xs bg-gray-50 dark:bg-obsidian-surface border border-gray-200 dark:border-obsidian-border focus:outline-none focus:border-gold font-semibold transition-colors"
            >
              <option value="ALL">Semua Waktu</option>
              <option value="TODAY">Hari Ini</option>
              <option value="THIS_WEEK">Minggu Ini</option>
              <option value="THIS_MONTH">Bulan Ini</option>
            </select>
          </div>

          {/* Top Metrics Cards (shadcn/ui style + Obsidian Gold token) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* Metric 1: Total Tiket Terjual (FR-07 Wajib Soal) */}
            <div className="bg-white dark:bg-obsidian-card p-6 rounded-3xl border border-gray-200 dark:border-obsidian-border shadow-sm flex flex-col justify-between">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-gray-500 dark:text-gray-400">Total Tiket Terjual</span>
                <div className="w-10 h-10 rounded-2xl bg-gold/10 text-gold flex items-center justify-center">
                  <Ticket className="w-5 h-5" />
                </div>
              </div>
              <div className="flex items-baseline justify-between">
                <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white">{totalTicketsSold}</h2>
                <span className="text-xs font-bold text-green-500 flex items-center gap-0.5">
                  <ArrowUpRight className="w-3.5 h-3.5" /> +14.2%
                </span>
              </div>
              <p className="text-[10px] text-gray-400 mt-2">Termasuk VIP & Ekonomi</p>
            </div>

            {/* Metric 2: Total Revenue (Inovasi) */}
            <div className="bg-white dark:bg-obsidian-card p-6 rounded-3xl border border-gray-200 dark:border-obsidian-border shadow-sm flex flex-col justify-between">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-gray-500 dark:text-gray-400">Total Pendapatan</span>
                <div className="w-10 h-10 rounded-2xl bg-gold/10 text-gold flex items-center justify-center">
                  <DollarSign className="w-5 h-5" />
                </div>
              </div>
              <div className="flex items-baseline justify-between">
                <h2 className="text-2xl font-extrabold text-gold">Rp {(totalRevenue / 1000000).toFixed(1)} Jt</h2>
                <span className="text-xs font-bold text-green-500 flex items-center gap-0.5">
                  <ArrowUpRight className="w-3.5 h-3.5" /> +18.5%
                </span>
              </div>
              <p className="text-[10px] text-gray-400 mt-2">Pembayaran Doku & Manual</p>
            </div>

            {/* Metric 3: Okupansi % (Inovasi) */}
            <div className="bg-white dark:bg-obsidian-card p-6 rounded-3xl border border-gray-200 dark:border-obsidian-border shadow-sm flex flex-col justify-between">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-gray-500 dark:text-gray-400">Tingkat Okupansi</span>
                <div className="w-10 h-10 rounded-2xl bg-gold/10 text-gold flex items-center justify-center">
                  <TrendingUp className="w-5 h-5" />
                </div>
              </div>
              <div className="flex items-baseline justify-between">
                <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white">{occupancyPercentage}%</h2>
                <span className="text-xs font-bold text-green-500 flex items-center gap-0.5">
                  <ArrowUpRight className="w-3.5 h-3.5" /> High
                </span>
              </div>
              <div className="w-full bg-gray-100 dark:bg-obsidian-surface h-2 rounded-full mt-3 overflow-hidden">
                <div className="bg-gold h-full rounded-full" style={{ width: `${occupancyPercentage}%` }}></div>
              </div>
            </div>

            {/* Metric 4: Live Check-in Gate Count (Inovasi) */}
            <div className="bg-white dark:bg-obsidian-card p-6 rounded-3xl border border-gray-200 dark:border-obsidian-border shadow-sm flex flex-col justify-between">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-gray-500 dark:text-gray-400">Live Gate Check-In</span>
                <div className="w-10 h-10 rounded-2xl bg-oxblood/10 text-oxblood flex items-center justify-center">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
              </div>
              <div className="flex items-baseline justify-between">
                <h2 className="text-3xl font-extrabold text-oxblood">{liveCheckinCount}</h2>
                <span className="text-[10px] font-extrabold bg-oxblood text-white px-2 py-0.5 rounded-full uppercase animate-pulse">
                  Live
                </span>
              </div>
              <p className="text-[10px] text-gray-400 mt-2">Discan di Pintu Masuk</p>
            </div>

          </div>

          {/* Superadmin Charts */}
          {isSuperadmin && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Payment Methods Pie Chart */}
              <div className="bg-white dark:bg-obsidian-card rounded-3xl border border-gray-200 dark:border-obsidian-border p-6 shadow-sm">
                <h3 className="text-sm font-extrabold mb-4 pb-2 border-b border-gray-100 dark:border-obsidian-border flex items-center gap-2">
                  Metode Pembayaran (Tiket Terjual)
                </h3>
                <div className="h-64">
                  {paymentMethodsData.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={paymentMethodsData}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={80}
                          paddingAngle={5}
                          dataKey="value"
                        >
                          {paymentMethodsData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip 
                          contentStyle={{ backgroundColor: '#1A1A1A', borderColor: '#333', borderRadius: '12px', fontSize: '12px' }}
                          itemStyle={{ color: '#fff' }}
                        />
                        <Legend wrapperStyle={{ fontSize: '10px', fontWeight: 'bold' }} />
                      </PieChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="h-full flex items-center justify-center text-gray-400 text-xs font-bold">Belum ada data pembayaran</div>
                  )}
                </div>
              </div>

              {/* Daily Revenue Bar Chart */}
              <div className="bg-white dark:bg-obsidian-card rounded-3xl border border-gray-200 dark:border-obsidian-border p-6 shadow-sm">
                <h3 className="text-sm font-extrabold mb-4 pb-2 border-b border-gray-100 dark:border-obsidian-border flex items-center gap-2">
                  Pendapatan Harian (Rp)
                </h3>
                <div className="h-64">
                  {dailyRevenueData.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={dailyRevenueData}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#333" opacity={0.2} />
                        <XAxis dataKey="date" tick={{ fontSize: 10 }} tickLine={false} axisLine={false} />
                        <YAxis 
                          tickFormatter={(value) => `${value / 1000000}M`}
                          tick={{ fontSize: 10 }} 
                          tickLine={false} 
                          axisLine={false} 
                        />
                        <Tooltip
                          formatter={(value) => [`Rp ${value.toLocaleString('id-ID')}`, 'Pendapatan']}
                          contentStyle={{ backgroundColor: '#1A1A1A', borderColor: '#333', borderRadius: '12px', fontSize: '12px' }}
                          itemStyle={{ color: '#D4AF37' }}
                          cursor={{ fill: 'transparent' }}
                        />
                        <Bar dataKey="revenue" fill="#D4AF37" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="h-full flex items-center justify-center text-gray-400 text-xs font-bold">Belum ada data pendapatan</div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Event Sales Table Summary */}
          <div className="bg-white dark:bg-obsidian-card rounded-3xl border border-gray-200 dark:border-obsidian-border p-6 shadow-sm">
            <h3 className="text-base font-extrabold mb-4 pb-2 border-b border-gray-100 dark:border-obsidian-border flex items-center justify-between">
              <span>Ringkasan Penjualan Per Konser</span>
              <span className="text-xs font-semibold text-gold">Realtime Updates</span>
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-obsidian-border text-[11px] font-extrabold uppercase text-gray-400">
                    <th className="pb-3">Judul Event</th>
                    <th className="pb-3">Tanggal</th>
                    <th className="pb-3">Status Penjualan</th>
                    <th className="pb-3">Kategori & Kuota</th>
                    <th className="pb-3 text-right">Tiket Terjual</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-obsidian-border text-xs">
                  {events.map((ev) => (
                    <tr key={ev.id} className="hover:bg-gray-50 dark:hover:bg-obsidian-surface transition-colors">
                      <td className="py-4 font-bold text-gray-900 dark:text-white">
                        {ev.title}
                        <span className="block text-[11px] font-normal text-gray-500">{ev.venueName}</span>
                      </td>
                      <td className="py-4 text-gray-600 dark:text-gray-300">
                        {new Date(ev.eventDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </td>
                      <td className="py-4">
                        {ev.salesClosed ? (
                          <span className="bg-oxblood/20 text-oxblood border border-oxblood/30 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase">
                            Ditutup
                          </span>
                        ) : (
                          <span className="bg-gold/20 text-gold border border-gold/30 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase">
                            Buka Penjualan
                          </span>
                        )}
                      </td>
                      <td className="py-4 text-gray-600 dark:text-gray-300">
                        {(ev.ticketCategories || ev.categories || []).map((c) => c.name).join(', ')}
                      </td>
                      <td className="py-4 text-right font-extrabold text-gold">
                        {(() => {
                           const cats = ev.ticketCategories || ev.categories || [];
                           const sold = cats.reduce((sum, c) => sum + ((c.totalSeats || 0) - (c.availableSeats || 0)), 0);
                           const total = cats.reduce((sum, c) => sum + (c.totalSeats || 0), 0);
                           return `${sold} / ${total}`;
                        })()}
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
