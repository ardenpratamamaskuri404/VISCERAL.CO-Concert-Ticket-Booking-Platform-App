import React, { useState } from 'react';
import { Check, Edit3, ShieldAlert, Filter } from 'lucide-react';
import { getImageUrl } from '../utils/image';
import { useStore } from '../context/StoreContext';

export default function AdminEventsTable({ handleEditClick }) {
  const { events, toggleSalesClosed } = useStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const filteredEvents = events.filter(ev => {
    const matchesSearch = ev.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          ev.venueName.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Status mapping: Active = !isSalesClosed, Closed = isSalesClosed
    let matchesStatus = true;
    if (statusFilter === 'ACTIVE') matchesStatus = !ev.isSalesClosed;
    if (statusFilter === 'CLOSED') matchesStatus = ev.isSalesClosed;
    
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="bg-white dark:bg-obsidian-card rounded-3xl border border-gray-200 dark:border-obsidian-border overflow-hidden shadow-sm">
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-6 gap-4 border-b border-gray-200 dark:border-obsidian-border">
        <h3 className="text-base font-extrabold flex items-center gap-2">
          <Filter className="w-4 h-4 text-gold" />
          Filter Event
        </h3>
        <div className="flex gap-2 w-full sm:w-auto">
          <input
            type="text"
            placeholder="Cari event atau venue..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full sm:w-64 px-4 py-2 rounded-xl text-xs bg-gray-50 dark:bg-obsidian-surface border border-gray-200 dark:border-obsidian-border focus:outline-none focus:border-gold transition-colors"
          />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 rounded-xl text-xs bg-gray-50 dark:bg-obsidian-surface border border-gray-200 dark:border-obsidian-border focus:outline-none focus:border-gold font-semibold transition-colors"
          >
            <option value="ALL">Semua Status</option>
            <option value="ACTIVE">Aktif Dijual</option>
            <option value="CLOSED">Penjualan Ditutup</option>
          </select>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 dark:bg-obsidian-surface border-b border-gray-200 dark:border-obsidian-border text-xs font-extrabold text-gray-500 uppercase tracking-widest">
              <th className="py-4 px-6 font-bold">Event & Tanggal</th>
              <th className="py-4 px-6 font-bold">Venue</th>
              <th className="py-4 px-6 font-bold">Kategori & Kursi</th>
              <th className="py-4 px-6 font-bold">Status Penjualan</th>
              <th className="py-4 px-6 font-bold text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-obsidian-border/50">
            {filteredEvents.length > 0 ? filteredEvents.map((ev) => (
              <tr
                key={ev.id}
                className="hover:bg-gray-50 dark:hover:bg-obsidian-surface/50 transition-colors"
              >
                <td className="py-4 px-6">
                  <div className="flex items-center gap-4">
                    <img
                      src={getImageUrl(ev.bannerUrl) || 'https://images.unsplash.com/photo-1540039155732-6761b54f2224?w=800&auto=format&fit=crop&q=80'}
                      alt={ev.title}
                      className="w-16 h-12 rounded-xl object-cover"
                    />
                    <div>
                      <p className="font-extrabold text-sm text-gray-900 dark:text-white">
                        {ev.title}
                      </p>
                      <p className="text-[10px] font-bold text-gray-500 mt-0.5">
                        {new Date(ev.eventDate).toLocaleDateString('id-ID', {
                          weekday: 'long',
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric'
                        })}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="py-4 px-6 text-sm font-semibold text-gray-600 dark:text-gray-300">
                  {ev.venueName}
                </td>
                <td className="py-4 px-6">
                  <div className="space-y-1">
                    {ev.categories?.map((cat) => (
                      <div key={cat.id} className="text-[11px] font-semibold text-gray-500 dark:text-gray-400 flex items-center justify-between gap-4">
                        <span>{cat.name}</span>
                        <span className="font-bold text-gray-900 dark:text-white">
                          {cat.totalSeats} Kursi
                        </span>
                      </div>
                    ))}
                  </div>
                </td>
                <td className="py-4 px-6">
                  {ev.salesClosed ? (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold bg-oxblood/10 text-oxblood border border-oxblood/20">
                      <ShieldAlert className="w-3 h-3" />
                      DITUTUP SEMENTARA
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold bg-green-500/10 text-green-600 border border-green-500/20">
                      <Check className="w-3 h-3" />
                      PENJUALAN BUKA
                    </span>
                  )}
                </td>
                <td className="py-4 px-6 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => handleEditClick(ev)}
                      className="p-1.5 rounded-lg bg-gray-100 dark:bg-obsidian text-gray-500 hover:text-gold border border-gray-200 dark:border-obsidian-border transition-colors"
                      title="Edit Event"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => toggleSalesClosed(ev.id)}
                      className={`px-3 py-1.5 rounded-xl text-[11px] font-bold transition-all ${
                        ev.salesClosed
                          ? 'bg-gold text-obsidian shadow-gold-glow'
                          : 'bg-oxblood text-white hover:bg-oxblood-dark shadow-oxblood-glow'
                      }`}
                    >
                      {ev.salesClosed ? 'Buka Kembali' : 'Tutup Penjualan'}
                    </button>
                  </div>
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan="5" className="py-10 text-center text-gray-500 font-bold">
                  Tidak ada event yang sesuai dengan filter.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
