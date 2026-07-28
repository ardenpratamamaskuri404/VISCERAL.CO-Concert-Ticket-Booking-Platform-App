import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import Navbar from '../components/Navbar';
import { MapPin, Calendar, Clock, Sparkles, ShieldAlert, ChevronRight, User } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';

export default function DetailEventPage() {
  const { id } = useParams();
  const { events, artists } = useStore();
  const navigate = useNavigate();

  const event = events.find((e) => e.id === id) || events[0];

  // Map artists to headliner details
  const eventArtists = event.artists.map((ea) => {
    const art = artists.find((a) => a.id === ea.artistId);
    return {
      ...art,
      isHeadliner: ea.isHeadliner
    };
  });

  return (
    <div className="min-h-screen bg-brand-bgLight dark:bg-obsidian-dark text-brand-darkText dark:text-brand-lightText transition-colors">
      <Navbar />

      {/* Hero Banner Section */}
      <div className="relative pt-24 h-96 w-full overflow-hidden">
        <img
          src={event.bannerUrl}
          alt={event.title}
          className="w-full h-full object-cover filter brightness-75"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-obsidian via-obsidian/40 to-transparent"></div>

        <div className="absolute bottom-6 left-0 right-0 max-w-7xl mx-auto px-4 md:px-8 text-white flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              {event.salesClosed ? (
                <span className="bg-oxblood text-white text-[10px] font-extrabold uppercase px-3 py-1 rounded-full shadow-lg flex items-center gap-1">
                  <ShieldAlert className="w-3.5 h-3.5" /> Penjualan Tiket Ditutup
                </span>
              ) : (
                <span className="bg-gold text-obsidian text-[10px] font-extrabold uppercase px-3 py-1 rounded-full shadow-gold-glow">
                  Tiket Tersedia (Buka Penjualan)
                </span>
              )}
            </div>

            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight">
              {event.title}
            </h1>
            <p className="text-xs sm:text-sm text-gold font-medium flex items-center gap-1.5 mt-2">
              <MapPin className="w-4 h-4" /> {event.venueName} — {event.venueAddress}
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 py-12 grid grid-cols-1 lg:grid-cols-3 gap-10">
        
        {/* Left Column: Event Description & Artists & Venue Map */}
        <div className="lg:col-span-2 space-y-10">
          
          {/* Info Card */}
          <div className="flex flex-wrap gap-6 bg-white dark:bg-obsidian-card p-6 rounded-3xl border border-gray-200 dark:border-obsidian-border shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gold/10 text-gold flex items-center justify-center">
                <Calendar className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] text-gray-400 uppercase tracking-wider block">Tanggal</span>
                <span className="text-xs font-bold">
                  {new Date(event.eventDate).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gold/10 text-gold flex items-center justify-center">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] text-gray-400 uppercase tracking-wider block">Waktu Open Gate</span>
                <span className="text-xs font-bold">19:00 WIB</span>
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <h3 className="text-lg font-bold mb-3 border-b border-gray-200 dark:border-obsidian-border pb-2">Deskripsi Konser</h3>
            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 leading-relaxed whitespace-pre-line">
              {event.description}
            </p>
          </div>

          {/* Lineup Performers / Artists (FR-02c & FR-03) */}
          <div>
            <h3 className="text-lg font-bold mb-4 border-b border-gray-200 dark:border-obsidian-border pb-2 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-gold" />
              Lineup Performers & Artis
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {eventArtists.map((artist) => (
                <div
                  key={artist.id}
                  className="flex items-center gap-4 bg-white dark:bg-obsidian-card p-4 rounded-2xl border border-gray-200 dark:border-obsidian-border shadow-sm"
                >
                  <img
                    src={artist.photoUrl}
                    alt={artist.name}
                    className="w-14 h-14 rounded-full object-cover border-2 border-gold/40"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-sm">{artist.name}</h4>
                      {artist.isHeadliner && (
                        <span className="bg-oxblood text-white text-[9px] font-extrabold px-2 py-0.5 rounded-full uppercase">
                          Headliner
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-gray-500 dark:text-gray-400 line-clamp-2 mt-0.5">
                      {artist.bio}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Venue Location Map (Leaflet.js) */}
          <div>
            <h3 className="text-lg font-bold mb-3 border-b border-gray-200 dark:border-obsidian-border pb-2 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-gold" />
              Lokasi Venue Konser (Peta Interactive)
            </h3>
            <div className="h-64 w-full rounded-3xl overflow-hidden border border-gray-200 dark:border-obsidian-border shadow-md">
              <MapContainer
                center={[event.latitude, event.longitude]}
                zoom={14}
                scrollWheelZoom={false}
                className="h-full w-full"
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Marker position={[event.latitude, event.longitude]}>
                  <Popup>
                    <div className="text-xs font-bold">
                      {event.title} <br /> {event.venueName}
                    </div>
                  </Popup>
                </Marker>
              </MapContainer>
            </div>
          </div>

        </div>

        {/* Right Column: Ticket Category Selection */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-obsidian-card p-6 rounded-3xl border border-gray-200 dark:border-obsidian-border shadow-obsidian-glow sticky top-24">
            <h3 className="text-lg font-extrabold mb-1">Pilih Kategori Tiket</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-6">
              Harga belum termasuk pajak pemerintah 10%.
            </p>

            <div className="space-y-4">
              {event.categories.map((cat) => (
                <div
                  key={cat.id}
                  className="p-4 rounded-2xl bg-gray-50 dark:bg-obsidian-surface border border-gray-200 dark:border-obsidian-border hover:border-gold/60 transition-all flex flex-col justify-between"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-extrabold text-sm text-gray-900 dark:text-white">{cat.name}</h4>
                      <span className="text-[10px] text-gray-500 dark:text-gray-400">
                        Sisa Kuota: <strong className="text-gold font-bold">{cat.totalSeats} Kursi</strong>
                      </span>
                    </div>
                    <span className="text-sm font-extrabold text-gold">
                      Rp {cat.price.toLocaleString('id-ID')}
                    </span>
                  </div>

                  <button
                    onClick={() => {
                      if (!event.salesClosed) {
                        navigate(`/seat-map/${event.id}?category=${cat.id}`);
                      }
                    }}
                    disabled={event.salesClosed}
                    className={`w-full py-2.5 rounded-xl text-xs font-extrabold flex items-center justify-center gap-1.5 transition-all mt-2 ${
                      event.salesClosed
                        ? 'bg-gray-200 dark:bg-obsidian text-gray-400 cursor-not-allowed'
                        : 'gold-gradient-btn text-obsidian shadow-gold-glow'
                    }`}
                  >
                    {event.salesClosed ? 'Penjualan Ditutup' : 'Pilih Kursi (Seat Map)'}
                    {!event.salesClosed && <ChevronRight className="w-4 h-4" />}
                  </button>
                </div>
              ))}
            </div>

            {event.salesClosed && (
              <div className="mt-6 p-4 rounded-2xl bg-oxblood/10 border border-oxblood/30 text-oxblood text-xs text-center font-semibold">
                Penyelenggara telah menutup penjualan tiket untuk acara ini.
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
