import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import AdminSidebar from '../components/AdminSidebar';
import AdminTopbar from '../components/AdminTopbar';
import { Plus, Edit, Trash2, ShieldAlert, Sparkles, UserPlus, Check, X } from 'lucide-react';

export default function AdminEventsPage() {
  const { events, artists, toggleSalesClosed, createEvent, createArtist } = useStore();

  const [modalOpen, setModalOpen] = useState(false);
  const [artistModalOpen, setArtistModalOpen] = useState(false);

  // Form states for Event creation
  const [title, setTitle] = useState('');
  const [venue, setVenue] = useState('');
  const [description, setDescription] = useState('');
  const [eventDate, setEventDate] = useState('');

  // Form states for Artist creation (FR-02c)
  const [artistName, setArtistName] = useState('');
  const [artistBio, setArtistBio] = useState('');

  const handleCreateEvent = (e) => {
    e.preventDefault();
    if (!title || !venue) return;
    createEvent({
      title,
      venueName: venue,
      venueAddress: venue,
      latitude: -6.2,
      longitude: 106.81,
      description,
      eventDate: eventDate || new Date().toISOString(),
      bannerUrl: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=1200&auto=format&fit=crop&q=80'
    });
    setModalOpen(false);
    setTitle('');
    setVenue('');
    setDescription('');
  };

  const handleCreateArtist = (e) => {
    e.preventDefault();
    if (!artistName) return;
    createArtist({
      name: artistName,
      bio: artistBio,
      photoUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600&auto=format&fit=crop&q=80',
      headliner: false
    });
    setArtistModalOpen(false);
    setArtistName('');
    setArtistBio('');
  };

  return (
    <div className="min-h-screen bg-brand-bgLight dark:bg-obsidian-dark flex transition-colors">
      <AdminSidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <AdminTopbar title="Kelola Event, Kategori & Artis" />

        <main className="p-6 md:p-8 space-y-8 overflow-y-auto">
          
          {/* Top Bar Action Buttons */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h2 className="text-xl font-extrabold tracking-tight">Manajemen Event & Artis</h2>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Kelola konser (FR-02), kategori tiket & kuota (FR-02b), artis (FR-02c), serta penutupan penjualan (FR-02d).
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setArtistModalOpen(true)}
                className="px-4 py-2.5 rounded-xl bg-obsidian text-white hover:text-gold border border-gold/30 text-xs font-bold flex items-center gap-2"
              >
                <UserPlus className="w-4 h-4" />
                Tambah Artis (FR-02c)
              </button>

              <button
                onClick={() => setModalOpen(true)}
                className="px-5 py-2.5 rounded-xl gold-gradient-btn text-obsidian text-xs font-extrabold flex items-center gap-2 shadow-gold-glow"
              >
                <Plus className="w-4 h-4" />
                Buat Event Baru
              </button>
            </div>
          </div>

          {/* Events Table (FR-02, FR-02b, FR-02d) */}
          <div className="bg-white dark:bg-obsidian-card rounded-3xl border border-gray-200 dark:border-obsidian-border p-6 shadow-sm">
            <h3 className="text-base font-extrabold mb-4 pb-2 border-b border-gray-100 dark:border-obsidian-border">
              Daftar Event Konser Terdaftar
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-obsidian-border text-[11px] font-extrabold uppercase text-gray-400">
                    <th className="pb-3">Judul Event</th>
                    <th className="pb-3">Venue</th>
                    <th className="pb-3">Kategori & Kuota (FR-02b)</th>
                    <th className="pb-3">Status Penjualan (FR-02d)</th>
                    <th className="pb-3 text-right">Aksi Control</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-obsidian-border text-xs">
                  {events.map((ev) => (
                    <tr key={ev.id} className="hover:bg-gray-50 dark:hover:bg-obsidian-surface transition-colors">
                      <td className="py-4 font-bold text-gray-900 dark:text-white">
                        {ev.title}
                        <span className="block text-[11px] text-gray-500 font-normal">
                          {new Date(ev.eventDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </span>
                      </td>
                      <td className="py-4 text-gray-600 dark:text-gray-300">{ev.venueName}</td>
                      <td className="py-4">
                        <div className="flex flex-wrap gap-1">
                          {ev.categories.map((c) => (
                            <span key={c.id} className="bg-gold/10 text-gold border border-gold/30 text-[10px] font-bold px-2 py-0.5 rounded-full">
                              {c.name} ({c.totalSeats} seats)
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="py-4">
                        {ev.salesClosed ? (
                          <span className="bg-oxblood/20 text-oxblood border border-oxblood/40 text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase flex items-center gap-1 w-max">
                            <ShieldAlert className="w-3 h-3" /> Penjualan Ditutup
                          </span>
                        ) : (
                          <span className="bg-green-500/20 text-green-500 border border-green-500/40 text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase w-max">
                            Buka (Active)
                          </span>
                        )}
                      </td>
                      <td className="py-4 text-right">
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
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Artists Table (FR-02c) */}
          <div className="bg-white dark:bg-obsidian-card rounded-3xl border border-gray-200 dark:border-obsidian-border p-6 shadow-sm">
            <h3 className="text-base font-extrabold mb-4 pb-2 border-b border-gray-100 dark:border-obsidian-border flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-gold" />
              Daftar Artis & Penyanyi Terdaftar (FR-02c)
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              {artists.map((art) => (
                <div key={art.id} className="p-4 rounded-2xl bg-gray-50 dark:bg-obsidian-surface border border-gray-200 dark:border-obsidian-border flex items-center gap-3">
                  <img src={art.photoUrl} alt={art.name} className="w-12 h-12 rounded-full object-cover border-2 border-gold/40" />
                  <div>
                    <h4 className="font-bold text-xs">{art.name}</h4>
                    <p className="text-[10px] text-gray-500 line-clamp-1">{art.bio}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </main>
      </div>

      {/* Modal Create Event */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-obsidian-card p-6 rounded-3xl border border-gray-200 dark:border-obsidian-border max-w-md w-full shadow-2xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-extrabold text-base">Buat Event Konser Baru</h3>
              <button onClick={() => setModalOpen(false)} className="text-gray-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateEvent} className="space-y-3">
              <div>
                <label className="block text-xs font-bold mb-1">Judul Event</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="MISAL: VISCERAL CONCERT 2026"
                  className="w-full p-2.5 rounded-xl text-xs bg-gray-50 dark:bg-obsidian-surface border border-gray-200 dark:border-obsidian-border"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold mb-1">Venue & Lokasi</label>
                <input
                  type="text"
                  value={venue}
                  onChange={(e) => setVenue(e.target.value)}
                  placeholder="MISAL: GBK Stadium, Jakarta"
                  className="w-full p-2.5 rounded-xl text-xs bg-gray-50 dark:bg-obsidian-surface border border-gray-200 dark:border-obsidian-border"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold mb-1">Deskripsi</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Deskripsi singkat acara..."
                  className="w-full p-2.5 rounded-xl text-xs bg-gray-50 dark:bg-obsidian-surface border border-gray-200 dark:border-obsidian-border h-20"
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl gold-gradient-btn text-obsidian font-extrabold text-xs shadow-gold-glow mt-4"
              >
                Simpan & Publish Event
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Modal Create Artist (FR-02c) */}
      {artistModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-obsidian-card p-6 rounded-3xl border border-gray-200 dark:border-obsidian-border max-w-md w-full shadow-2xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-extrabold text-base">Tambah Data Artis (FR-02c)</h3>
              <button onClick={() => setArtistModalOpen(false)} className="text-gray-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateArtist} className="space-y-3">
              <div>
                <label className="block text-xs font-bold mb-1">Nama Artis / Band</label>
                <input
                  type="text"
                  value={artistName}
                  onChange={(e) => setArtistName(e.target.value)}
                  placeholder="MISAL: Sheila On 7"
                  className="w-full p-2.5 rounded-xl text-xs bg-gray-50 dark:bg-obsidian-surface border border-gray-200 dark:border-obsidian-border"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold mb-1">Bio Singkat</label>
                <textarea
                  value={artistBio}
                  onChange={(e) => setArtistBio(e.target.value)}
                  placeholder="Bio singkat artis..."
                  className="w-full p-2.5 rounded-xl text-xs bg-gray-50 dark:bg-obsidian-surface border border-gray-200 dark:border-obsidian-border h-20"
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl gold-gradient-btn text-obsidian font-extrabold text-xs shadow-gold-glow mt-4"
              >
                Simpan Artis
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
