import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { getImageUrl } from '../utils/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Music, Sparkles, Calendar, MapPin, ArrowRight, X, Disc3 } from 'lucide-react';

export default function ArtistsPage() {
  const { artists, events, socketConnected } = useStore();
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('ALL');
  const [selectedArtist, setSelectedArtist] = useState(null);

  const enrichedArtists = useMemo(() => {
    return artists.map((artist) => {
      const artistEvents = events
        .filter((ev) => ev.artists?.some((ea) => ea.artistId === artist.id))
        .sort((a, b) => new Date(a.eventDate) - new Date(b.eventDate));

      const isHeadliner = events.some((ev) =>
        ev.artists?.some((ea) => ea.artistId === artist.id && ea.isHeadliner)
      );

      return {
        ...artist,
        events: artistEvents,
        isHeadliner,
      };
    });
  }, [artists, events]);

  const filteredArtists = useMemo(() => {
    return enrichedArtists.filter((art) => {
      const matchesSearch =
        art.name.toLowerCase().includes(search.toLowerCase()) ||
        (art.bio || '').toLowerCase().includes(search.toLowerCase());
      if (filterType === 'ACTIVE') return matchesSearch && art.events.length > 0;
      if (filterType === 'HEADLINER') return matchesSearch && art.isHeadliner;
      return matchesSearch;
    });
  }, [enrichedArtists, search, filterType]);

  const getMinPrice = (event) => {
    if (!event?.categories || event.categories.length === 0) return 0;
    return Math.min(...event.categories.map((c) => Number(c.price || 0)));
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
        <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4 text-center md:text-left">
          <div>
            <span className="text-xs font-bold text-oxblood dark:text-gold uppercase tracking-widest inline-flex items-center gap-1.5 mb-1">
              <Disc3 className="w-3.5 h-3.5" /> Kurasi Musisi Eksklusif
            </span>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white">
              Lineup Artis & Penampil
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1 max-w-2xl">
              Jelajahi profil musisi nasional dan internasional yang tampil di panggung VISCERAL.CO serta jadwal konser terdekat mereka.
            </p>
          </div>
          {socketConnected && (
            <span className="inline-flex items-center gap-2 self-center md:self-auto px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-500 text-[11px] font-bold">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Live Sync Aktif
            </span>
          )}
        </div>

        {/* Search & Filter Bar */}
        <div className="flex flex-col md:flex-row gap-4 justify-between items-center mb-10 bg-white dark:bg-obsidian-card p-4 rounded-3xl border border-gray-200 dark:border-obsidian-border shadow-sm">
          <div className="relative w-full md:w-96">
            <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari nama musisi atau genre..."
              className="w-full pl-11 pr-4 py-2.5 rounded-full text-xs bg-gray-50 dark:bg-obsidian-surface border border-gray-200 dark:border-obsidian-border text-gray-900 dark:text-white focus:outline-none focus:border-gold transition-colors"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
            <button
              onClick={() => setFilterType('ALL')}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-all whitespace-nowrap ${
                filterType === 'ALL'
                  ? 'bg-obsidian text-gold shadow-gold-glow'
                  : 'bg-gray-100 dark:bg-obsidian-surface text-gray-600 dark:text-gray-300 hover:text-gold'
              }`}
            >
              Semua Artis ({enrichedArtists.length})
            </button>
            <button
              onClick={() => setFilterType('ACTIVE')}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-all whitespace-nowrap ${
                filterType === 'ACTIVE'
                  ? 'bg-obsidian text-gold shadow-gold-glow'
                  : 'bg-gray-100 dark:bg-obsidian-surface text-gray-600 dark:text-gray-300 hover:text-gold'
              }`}
            >
              Ada Jadwal Konser
            </button>
            <button
              onClick={() => setFilterType('HEADLINER')}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-all whitespace-nowrap ${
                filterType === 'HEADLINER'
                  ? 'bg-oxblood text-white shadow-oxblood-glow'
                  : 'bg-gray-100 dark:bg-obsidian-surface text-gray-600 dark:text-gray-300 hover:text-gold'
              }`}
            >
              Headliner Utama
            </button>
          </div>
        </div>

        {/* Artists Grid */}
        {filteredArtists.length === 0 ? (
          <div className="bg-white dark:bg-obsidian-card rounded-3xl border border-gray-200 dark:border-obsidian-border p-12 text-center">
            <Music className="w-12 h-12 text-gray-400 mx-auto mb-3 opacity-50" />
            <h3 className="text-base font-bold text-gray-900 dark:text-white">Artis Tidak Ditemukan</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Coba ubah kata kunci pencarian atau reset filter untuk melihat seluruh lineup.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredArtists.map((artist, index) => (
              <motion.div
                key={artist.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.4, delay: Math.min(index * 0.05, 0.3) }}
                className="bg-white dark:bg-obsidian-card rounded-3xl border border-gray-200 dark:border-obsidian-border p-6 shadow-sm hover:border-gold/50 hover:shadow-gold-glow transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-16 h-16 rounded-2xl overflow-hidden border-2 border-gold/40 bg-obsidian-surface shrink-0">
                      <img
                        src={getImageUrl(artist.photoUrl, 'artists')}
                        alt={artist.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        {artist.isHeadliner && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-oxblood text-white">
                            <Sparkles className="w-2.5 h-2.5" /> Headliner
                          </span>
                        )}
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-gold/10 text-gold border border-gold/20">
                          {artist.events.length} Konser
                        </span>
                      </div>
                      <h2 className="text-lg font-extrabold text-gray-900 dark:text-white truncate group-hover:text-gold transition-colors">
                        {artist.name}
                      </h2>
                    </div>
                  </div>

                  <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed line-clamp-3 mb-5">
                    {artist.bio || 'Musisi pilihan yang menghadirkan pengalaman panggung live tak terlupakan bersama VISCERAL.CO.'}
                  </p>

                  {/* Upcoming Concerts Preview */}
                  {artist.events.length > 0 && (
                    <div className="space-y-2 mb-5">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block">
                        Jadwal Terdekat
                      </span>
                      {artist.events.slice(0, 2).map((ev) => (
                        <Link
                          key={ev.id}
                          to={`/event/${ev.id}`}
                          className="flex items-center justify-between gap-2 p-2.5 rounded-xl bg-gray-50 dark:bg-obsidian-surface border border-gray-200 dark:border-obsidian-border hover:border-gold/50 transition-colors text-xs"
                        >
                          <div className="min-w-0">
                            <p className="font-bold text-gray-900 dark:text-white truncate">{ev.title}</p>
                            <p className="text-[10px] text-gray-500 dark:text-gray-400 flex items-center gap-1 mt-0.5">
                              <Calendar className="w-3 h-3 text-gold shrink-0" />
                              {new Date(ev.eventDate).toLocaleDateString('id-ID', {
                                day: 'numeric',
                                month: 'short',
                                year: 'numeric',
                              })}
                            </p>
                          </div>
                          <ArrowRight className="w-3.5 h-3.5 text-gold shrink-0" />
                        </Link>
                      ))}
                    </div>
                  )}
                </div>

                <div className="pt-3 border-t border-gray-100 dark:border-obsidian-border flex items-center justify-between">
                  <button
                    onClick={() => setSelectedArtist(artist)}
                    className="w-full py-2.5 rounded-xl bg-gray-100 dark:bg-obsidian-surface hover:bg-obsidian hover:text-gold text-gray-800 dark:text-gray-200 font-bold text-xs transition-all flex items-center justify-center gap-2"
                  >
                    Lihat Profil & Semua Jadwal
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </motion.main>

      {/* Artist Detail Modal */}
      <AnimatePresence>
        {selectedArtist && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setSelectedArtist(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-2xl bg-white dark:bg-obsidian-card rounded-3xl border border-gray-200 dark:border-obsidian-border shadow-2xl overflow-hidden max-h-[85vh] flex flex-col"
            >
              <div className="p-6 border-b border-gray-200 dark:border-obsidian-border flex items-center justify-between bg-gray-50 dark:bg-obsidian-surface">
                <div className="flex items-center gap-4">
                  <img
                    src={getImageUrl(selectedArtist.photoUrl, 'artists')}
                    alt={selectedArtist.name}
                    className="w-14 h-14 rounded-2xl object-cover border-2 border-gold/40"
                  />
                  <div>
                    <h3 className="text-xl font-extrabold text-gray-900 dark:text-white">{selectedArtist.name}</h3>
                    <span className="text-xs text-gold font-bold">
                      {selectedArtist.events.length} Konser Terjadwal
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedArtist(null)}
                  className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-obsidian text-gray-500 dark:text-gray-400 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 overflow-y-auto space-y-6">
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2">
                    Tentang Musisi
                  </h4>
                  <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                    {selectedArtist.bio || 'Musisi resmi yang berkolaborasi menghadirkan konser eksklusif di platform VISCERAL.CO.'}
                  </p>
                </div>

                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-3">
                    Daftar Konser Mendatang
                  </h4>
                  {selectedArtist.events.length === 0 ? (
                    <div className="p-6 rounded-2xl bg-gray-50 dark:bg-obsidian-surface border border-gray-200 dark:border-obsidian-border text-center text-xs text-gray-500 dark:text-gray-400">
                      Belum ada jadwal konser yang diumumkan untuk artis ini dalam waktu dekat.
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {selectedArtist.events.map((ev) => (
                        <div
                          key={ev.id}
                          className="p-4 rounded-2xl bg-gray-50 dark:bg-obsidian-surface border border-gray-200 dark:border-obsidian-border flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                        >
                          <div className="min-w-0">
                            <h5 className="font-bold text-sm text-gray-900 dark:text-white">{ev.title}</h5>
                            <div className="flex flex-wrap gap-3 text-xs text-gray-500 dark:text-gray-400 mt-1">
                              <span className="flex items-center gap-1">
                                <Calendar className="w-3.5 h-3.5 text-gold" />
                                {new Date(ev.eventDate).toLocaleDateString('id-ID', {
                                  day: 'numeric',
                                  month: 'long',
                                  year: 'numeric',
                                })}
                              </span>
                              <span className="flex items-center gap-1">
                                <MapPin className="w-3.5 h-3.5 text-gold" />
                                {ev.venueName}
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center gap-3 shrink-0">
                            <div className="text-right">
                              <span className="text-[10px] text-gray-400 block">Mulai dari</span>
                              <span className="text-sm font-extrabold text-gold">
                                Rp {getMinPrice(ev).toLocaleString('id-ID')}
                              </span>
                            </div>
                            <Link
                              to={`/event/${ev.id}`}
                              onClick={() => setSelectedArtist(null)}
                              className="px-4 py-2 rounded-xl gold-gradient-btn text-obsidian font-extrabold text-xs shadow-gold-glow"
                            >
                              Beli Tiket
                            </Link>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
}
