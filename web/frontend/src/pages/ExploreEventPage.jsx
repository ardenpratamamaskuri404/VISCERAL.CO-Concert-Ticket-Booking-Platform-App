import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import Navbar from '../components/Navbar';
import { Search, Filter, Calendar, MapPin, Ticket, ShieldAlert } from 'lucide-react';
import { getImageUrl } from '../utils/image';
import { motion } from 'framer-motion';

export default function ExploreEventPage() {
  const { events } = useStore();
  const [search, setSearch] = useState('');
  const [filterCategory, setFilterCategory] = useState('ALL');

  const getMinPrice = (event) => {
    if (!event.categories || event.categories.length === 0) return 0;
    let minPrice = Infinity;
    const now = new Date();
    for (const cat of event.categories) {
      let currentPrice = Number(cat.price);
      if (cat.earlyBirdPrice && cat.earlyBirdStartDate && cat.earlyBirdEndDate) {
        const start = new Date(cat.earlyBirdStartDate);
        const end = new Date(cat.earlyBirdEndDate);
        if (now >= start && now <= end) {
          currentPrice = Number(cat.earlyBirdPrice);
        }
      }
      if (currentPrice < minPrice) {
        minPrice = currentPrice;
      }
    }
    return minPrice === Infinity ? 0 : minPrice;
  };

  const filteredEvents = events.filter((ev) => {
    const matchesSearch = ev.title.toLowerCase().includes(search.toLowerCase()) ||
                          ev.venueName.toLowerCase().includes(search.toLowerCase());
    if (filterCategory === 'OPEN') return matchesSearch && !ev.salesClosed;
    if (filterCategory === 'CLOSED') return matchesSearch && ev.salesClosed;
    return matchesSearch;
  });

  return (
    <div className="min-h-screen bg-brand-bgLight dark:bg-obsidian-dark text-brand-darkText dark:text-brand-lightText transition-colors">
      <Navbar />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="pt-28 pb-16 px-4 md:px-8 max-w-7xl mx-auto"
      >
        {/* Header Title */}
        <div className="mb-8 text-center md:text-left">
          <span className="text-xs font-bold text-oxblood dark:text-gold uppercase tracking-widest block mb-1">
            Katalog Konser Resmi
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">Jelajah Konser & Festival Musik</h1>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Temukan tiket acara musik terbaik di seluruh Indonesia dengan jaminan tempat duduk real-time.
          </p>
        </div>

        {/* Search & Pill Filter Bar */}
        <div className="flex flex-col md:flex-row gap-4 justify-between items-center mb-8 bg-white dark:bg-obsidian-card p-4 rounded-3xl border border-gray-200 dark:border-obsidian-border shadow-sm">
          <div className="relative w-full md:w-96">
            <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari judul konser, venue, atau kota..."
              className="w-full pl-11 pr-4 py-2.5 rounded-full text-xs bg-gray-50 dark:bg-obsidian-surface border border-gray-200 dark:border-obsidian-border text-gray-900 dark:text-white focus:outline-none focus:border-gold"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
            <button
              onClick={() => setFilterCategory('ALL')}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-all whitespace-nowrap ${
                filterCategory === 'ALL'
                  ? 'bg-obsidian text-gold shadow-gold-glow'
                  : 'bg-gray-100 dark:bg-obsidian-surface text-gray-600 dark:text-gray-300 hover:text-gold'
              }`}
            >
              Semua Event
            </button>

            <button
              onClick={() => setFilterCategory('OPEN')}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-all whitespace-nowrap ${
                filterCategory === 'OPEN'
                  ? 'bg-obsidian text-gold shadow-gold-glow'
                  : 'bg-gray-100 dark:bg-obsidian-surface text-gray-600 dark:text-gray-300 hover:text-gold'
              }`}
            >
              Penjualan Buka
            </button>

            <button
              onClick={() => setFilterCategory('CLOSED')}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-all whitespace-nowrap ${
                filterCategory === 'CLOSED'
                  ? 'bg-oxblood text-white shadow-oxblood-glow'
                  : 'bg-gray-100 dark:bg-obsidian-surface text-gray-600 dark:text-gray-300 hover:text-gold'
              }`}
            >
              Penjualan Ditutup
            </button>
          </div>
        </div>

        {/* Events Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {filteredEvents.map((event, index) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: index * 0.1, ease: 'easeOut' }}
              className="bg-white dark:bg-obsidian-card rounded-3xl overflow-hidden border border-gray-200 dark:border-obsidian-border shadow-obsidian-glow group hover:border-gold/50 transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="relative h-56 overflow-hidden">
                  <img
                    src={getImageUrl(event.bannerUrl || event.banner_url, 'events')}
                    alt={event.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-obsidian via-transparent to-transparent opacity-80"></div>

                  {event.salesClosed ? (
                    <span className="absolute top-4 right-4 bg-oxblood text-white text-[10px] font-extrabold uppercase px-3 py-1 rounded-full shadow-lg flex items-center gap-1">
                      <ShieldAlert className="w-3 h-3" /> Penjualan Ditutup
                    </span>
                  ) : (
                    <span className="absolute top-4 right-4 bg-gold text-obsidian text-[10px] font-extrabold uppercase px-3 py-1 rounded-full shadow-gold-glow">
                      Tersedia
                    </span>
                  )}

                  <div className="absolute bottom-3 left-4 right-4 text-white">
                    <span className="text-[11px] font-medium text-gold flex items-center gap-1 mb-1">
                      <MapPin className="w-3 h-3" /> {event.venueName}
                    </span>
                    <h3 className="text-base font-bold line-clamp-1 group-hover:text-gold transition-colors">
                      {event.title}
                    </h3>
                  </div>
                </div>

                <div className="p-5">
                  <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 mb-4 leading-relaxed">
                    {event.description}
                  </p>

                  <div className="flex items-center justify-between text-xs text-gray-600 dark:text-gray-300 pb-4 border-b border-gray-100 dark:border-obsidian-border">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-gold" />
                      <span>{new Date(event.eventDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                    </div>
                    <span className="text-[11px] font-semibold text-gold bg-gold/10 px-2 py-0.5 rounded-full">
                      {event.categories?.length || 0} Kategori Tiket
                    </span>
                  </div>
                </div>
              </div>

              <div className="px-5 pb-5 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-gray-400 uppercase tracking-wider block">Mulai Dari</span>
                  <span className="text-base font-extrabold text-gold">
                    Rp {getMinPrice(event).toLocaleString('id-ID')}
                  </span>
                </div>

                <Link
                  to={`/event/${event.id}`}
                  className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all ${
                    event.salesClosed
                      ? 'bg-gray-200 dark:bg-obsidian-surface text-gray-400 cursor-not-allowed'
                      : 'gold-gradient-btn text-obsidian shadow-gold-glow'
                  }`}
                >
                  {event.salesClosed ? 'Lihat Detail' : 'Beli Tiket'}
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
