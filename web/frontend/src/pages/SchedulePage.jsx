import React, { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { getImageUrl } from '../utils/image';
import { formatWibTime } from '../utils/date';
import { motion } from 'framer-motion';
import { Calendar, Clock, MapPin, Ticket, ArrowRight, Sparkles, ShieldAlert } from 'lucide-react';

export default function SchedulePage() {
  const { events, artists } = useStore();
  const [selectedMonth, setSelectedMonth] = useState('ALL');
  const [onlyAvailable, setOnlyAvailable] = useState(false);
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const sortedEvents = useMemo(() => {
    return [...events].sort((a, b) => new Date(a.eventDate) - new Date(b.eventDate));
  }, [events]);

  const monthOptions = useMemo(() => {
    const map = new Map();
    sortedEvents.forEach((ev) => {
      const d = new Date(ev.eventDate);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      const label = d.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' });
      if (!map.has(key)) map.set(key, label);
    });
    return Array.from(map.entries()).map(([key, label]) => ({ key, label }));
  }, [sortedEvents]);

  const filteredEvents = useMemo(() => {
    return sortedEvents.filter((ev) => {
      if (onlyAvailable && ev.salesClosed) return false;
      if (selectedMonth === 'ALL') return true;
      const d = new Date(ev.eventDate);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      return key === selectedMonth;
    });
  }, [sortedEvents, selectedMonth, onlyAvailable]);

  const groupedByMonth = useMemo(() => {
    const groups = [];
    const map = new Map();
    filteredEvents.forEach((ev) => {
      const d = new Date(ev.eventDate);
      const label = d.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' });
      if (!map.has(label)) {
        const group = { monthLabel: label, items: [] };
        map.set(label, group);
        groups.push(group);
      }
      map.get(label).items.push(ev);
    });
    return groups;
  }, [filteredEvents]);

  const nextUpcomingEvent = useMemo(() => {
    return sortedEvents.find((ev) => new Date(ev.eventDate) > now && !ev.salesClosed) || sortedEvents[0];
  }, [sortedEvents, now]);

  const getCountdown = (targetDate) => {
    const diff = new Date(targetDate) - now;
    if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / (1000 * 60)) % 60);
    const seconds = Math.floor((diff / 1000) % 60);
    return { days, hours, minutes, seconds };
  };

  const getMinPrice = (ev) => {
    if (!ev.categories || ev.categories.length === 0) return 0;
    return Math.min(...ev.categories.map((c) => Number(c.price || 0)));
  };

  const getEventArtists = (ev) => {
    if (!ev.artists) return [];
    return ev.artists
      .map((ea) => artists.find((a) => a.id === ea.artistId)?.name)
      .filter(Boolean);
  };

  return (
    <div className="min-h-screen bg-brand-bgLight dark:bg-obsidian-dark text-brand-darkText dark:text-brand-lightText flex flex-col transition-colors">
      <Navbar />

      <motion.main
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: 'easeOut' }}
        className="flex-1 pt-28 pb-16 px-4 md:px-8 max-w-7xl mx-auto w-full"
      >
        {/* Header */}
        <div className="mb-8 text-center md:text-left">
          <span className="text-xs font-bold text-oxblood dark:text-gold uppercase tracking-widest inline-flex items-center gap-1.5 mb-1">
            <Calendar className="w-3.5 h-3.5" /> Agenda Pertunjukan Resmi
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white">
            Kalender & Jadwal Konser
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1 max-w-2xl">
            Pantau seluruh agenda konser VISCERAL.CO secara kronologis per bulan agar tidak melewatkan penampilan artis favorit Anda.
          </p>
        </div>

        {/* Next Upcoming Spotlight Card */}
        {nextUpcomingEvent && (
          <div className="mb-10 rounded-3xl bg-white dark:bg-obsidian-card border border-gray-200 dark:border-gold/30 shadow-obsidian-glow overflow-hidden relative">
            <div className="pulse-line-oxblood w-full absolute top-0 left-0"></div>
            <div className="grid grid-cols-1 lg:grid-cols-3">
              <div className="relative h-56 lg:h-auto overflow-hidden">
                <img
                  src={getImageUrl(nextUpcomingEvent.bannerUrl, 'events')}
                  alt={nextUpcomingEvent.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-obsidian/80 via-transparent to-transparent"></div>
                <span className="absolute top-4 left-4 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gold text-obsidian text-[10px] font-extrabold uppercase shadow-gold-glow">
                  <Sparkles className="w-3 h-3" /> Konser Terdekat
                </span>
              </div>

              <div className="lg:col-span-2 p-6 md:p-8 flex flex-col justify-between gap-6">
                <div>
                  <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 dark:text-white mb-2">
                    {nextUpcomingEvent.title}
                  </h2>
                  <div className="flex flex-wrap items-center gap-4 text-xs text-gray-600 dark:text-gray-300">
                    <span className="flex items-center gap-1.5">
                      <Calendar className="w-4 h-4 text-gold" />
                      {new Date(nextUpcomingEvent.eventDate).toLocaleDateString('id-ID', {
                        weekday: 'long',
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                      })}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <MapPin className="w-4 h-4 text-gold" />
                      {nextUpcomingEvent.venueName}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Clock className="w-4 h-4 text-gold" />
                      {formatWibTime(nextUpcomingEvent.eventDate)}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-gray-100 dark:border-obsidian-border">
                  {(() => {
                    const cd = getCountdown(nextUpcomingEvent.eventDate);
                    return (
                      <div className="flex items-center gap-2.5">
                        <div className="px-3 py-2 rounded-2xl bg-gray-100 dark:bg-obsidian-surface border border-gray-200 dark:border-obsidian-border text-center min-w-[58px]">
                          <span className="text-lg font-black text-gold block leading-none">{cd.days}</span>
                          <span className="text-[10px] text-gray-500 dark:text-gray-400 uppercase font-bold">Hari</span>
                        </div>
                        <div className="px-3 py-2 rounded-2xl bg-gray-100 dark:bg-obsidian-surface border border-gray-200 dark:border-obsidian-border text-center min-w-[58px]">
                          <span className="text-lg font-black text-gold block leading-none">{String(cd.hours).padStart(2, '0')}</span>
                          <span className="text-[10px] text-gray-500 dark:text-gray-400 uppercase font-bold">Jam</span>
                        </div>
                        <div className="px-3 py-2 rounded-2xl bg-gray-100 dark:bg-obsidian-surface border border-gray-200 dark:border-obsidian-border text-center min-w-[58px]">
                          <span className="text-lg font-black text-gold block leading-none">{String(cd.minutes).padStart(2, '0')}</span>
                          <span className="text-[10px] text-gray-500 dark:text-gray-400 uppercase font-bold">Menit</span>
                        </div>
                        <div className="px-3 py-2 rounded-2xl bg-gray-100 dark:bg-obsidian-surface border border-gray-200 dark:border-obsidian-border text-center min-w-[58px]">
                          <span className="text-lg font-black text-gold block leading-none">{String(cd.seconds).padStart(2, '0')}</span>
                          <span className="text-[10px] text-gray-500 dark:text-gray-400 uppercase font-bold">Detik</span>
                        </div>
                      </div>
                    );
                  })()}

                  <Link
                    to={`/event/${nextUpcomingEvent.id}`}
                    className="px-6 py-3.5 rounded-xl gold-gradient-btn text-obsidian font-extrabold text-xs flex items-center justify-center gap-2 shadow-gold-glow"
                  >
                    <Ticket className="w-4 h-4" />
                    Amankan Tiket Sekarang
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Month Filter Bar */}
        <div className="flex flex-col md:flex-row gap-4 justify-between items-center mb-10 bg-white dark:bg-obsidian-card p-4 rounded-3xl border border-gray-200 dark:border-obsidian-border shadow-sm">
          <div className="flex items-center gap-2 overflow-x-auto w-full pb-1 md:pb-0">
            <button
              onClick={() => setSelectedMonth('ALL')}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-all whitespace-nowrap ${
                selectedMonth === 'ALL'
                  ? 'bg-obsidian text-gold shadow-gold-glow'
                  : 'bg-gray-100 dark:bg-obsidian-surface text-gray-600 dark:text-gray-300 hover:text-gold'
              }`}
            >
              Semua Bulan
            </button>
            {monthOptions.map((m) => (
              <button
                key={m.key}
                onClick={() => setSelectedMonth(m.key)}
                className={`px-4 py-2 rounded-full text-xs font-bold transition-all whitespace-nowrap ${
                  selectedMonth === m.key
                    ? 'bg-obsidian text-gold shadow-gold-glow'
                    : 'bg-gray-100 dark:bg-obsidian-surface text-gray-600 dark:text-gray-300 hover:text-gold'
                }`}
              >
                {m.label}
              </button>
            ))}
          </div>

          <button
            onClick={() => setOnlyAvailable(!onlyAvailable)}
            className={`px-4 py-2 rounded-full text-xs font-bold transition-all whitespace-nowrap shrink-0 border ${
              onlyAvailable
                ? 'bg-gold/15 text-gold border-gold/40'
                : 'bg-gray-100 dark:bg-obsidian-surface text-gray-600 dark:text-gray-300 border-transparent'
            }`}
          >
            {onlyAvailable ? '✓ Hanya Tiket Tersedia' : 'Tampilkan Semua Status'}
          </button>
        </div>

        {/* Chronological Timeline List */}
        {groupedByMonth.length === 0 ? (
          <div className="bg-white dark:bg-obsidian-card rounded-3xl border border-gray-200 dark:border-obsidian-border p-12 text-center">
            <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-3 opacity-50" />
            <h3 className="text-base font-bold text-gray-900 dark:text-white">Tidak Ada Jadwal</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Belum ada konser yang sesuai filter bulan atau ketersediaan tiket yang dipilih.
            </p>
          </div>
        ) : (
          <div className="space-y-10">
            {groupedByMonth.map((group) => (
              <section key={group.monthLabel}>
                <div className="flex items-center gap-3 mb-4">
                  <span className="px-4 py-1.5 rounded-full bg-gold/15 text-gold border border-gold/30 text-xs font-extrabold uppercase tracking-wider">
                    {group.monthLabel}
                  </span>
                  <div className="h-px flex-1 bg-gray-200 dark:bg-obsidian-border"></div>
                  <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">
                    {group.items.length} Event
                  </span>
                </div>

                <div className="space-y-4">
                  {group.items.map((ev) => {
                    const d = new Date(ev.eventDate);
                    const dayNum = d.getDate();
                    const dayName = d.toLocaleDateString('id-ID', { weekday: 'short' });
                    const monthShort = d.toLocaleDateString('id-ID', { month: 'short' });
                    const artistNames = getEventArtists(ev);

                    return (
                      <div
                        key={ev.id}
                        className="bg-white dark:bg-obsidian-card rounded-3xl border border-gray-200 dark:border-obsidian-border p-4 md:p-5 flex flex-col md:flex-row md:items-center justify-between gap-5 shadow-sm hover:border-gold/50 transition-all"
                      >
                        <div className="flex items-center gap-4 min-w-0">
                          {/* Date Badge */}
                          <div className="w-16 h-16 rounded-2xl bg-gray-100 dark:bg-obsidian-surface border border-gray-200 dark:border-obsidian-border flex flex-col items-center justify-center shrink-0">
                            <span className="text-[10px] font-bold uppercase text-oxblood dark:text-gold">{dayName}</span>
                            <span className="text-xl font-black text-gray-900 dark:text-white leading-none my-0.5">{dayNum}</span>
                            <span className="text-[10px] font-semibold text-gray-500 dark:text-gray-400 uppercase">{monthShort}</span>
                          </div>

                          {/* Thumbnail */}
                          <div className="w-20 h-16 rounded-2xl overflow-hidden shrink-0 hidden sm:block border border-gray-200 dark:border-obsidian-border">
                            <img
                              src={getImageUrl(ev.bannerUrl, 'events')}
                              alt={ev.title}
                              className="w-full h-full object-cover"
                            />
                          </div>

                          {/* Event Info */}
                          <div className="min-w-0">
                            <div className="flex flex-wrap items-center gap-2 mb-1">
                              {ev.salesClosed ? (
                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-oxblood text-white">
                                  <ShieldAlert className="w-3 h-3" /> Penjualan Ditutup
                                </span>
                              ) : (
                                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-gold/15 text-gold border border-gold/30">
                                  Tersedia
                                </span>
                              )}
                              {artistNames.length > 0 && (
                                <span className="text-[11px] font-semibold text-gray-500 dark:text-gray-400 truncate">
                                  • {artistNames.join(', ')}
                                </span>
                              )}
                            </div>

                            <h3 className="font-extrabold text-base text-gray-900 dark:text-white truncate">
                              {ev.title}
                            </h3>
                            <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500 dark:text-gray-400 mt-1">
                              <span className="flex items-center gap-1">
                                <MapPin className="w-3.5 h-3.5 text-gold" /> {ev.venueName}
                              </span>
                              <span className="flex items-center gap-1">
                                <Clock className="w-3.5 h-3.5 text-gold" /> {formatWibTime(ev.eventDate)}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center justify-between md:justify-end gap-4 pt-3 md:pt-0 border-t md:border-t-0 border-gray-100 dark:border-obsidian-border shrink-0">
                          <div className="md:text-right">
                            <span className="text-[10px] uppercase tracking-wider text-gray-400 block">Mulai Dari</span>
                            <span className="text-base font-black text-gold">
                              Rp {getMinPrice(ev).toLocaleString('id-ID')}
                            </span>
                          </div>

                          <Link
                            to={`/event/${ev.id}`}
                            className={`px-5 py-2.5 rounded-full text-xs font-bold flex items-center gap-1.5 transition-all ${
                              ev.salesClosed
                                ? 'bg-gray-200 dark:bg-obsidian-surface text-gray-600 dark:text-gray-400'
                                : 'bg-obsidian text-white hover:text-gold border border-gold/30 hover:border-gold shadow-md hover:shadow-gold-glow'
                            }`}
                          >
                            {ev.salesClosed ? 'Lihat Info' : 'Pesan Tiket'}
                            <ArrowRight className="w-3.5 h-3.5" />
                          </Link>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>
            ))}
          </div>
        )}
      </motion.main>

      <Footer />
    </div>
  );
}
