import React from 'react';
import { X, Image, Music, Trash2 } from 'lucide-react';

export default function AdminEventModal({
  isOpen,
  onClose,
  isEditMode,
  title, setTitle,
  venue, setVenue,
  eventDate, setEventDate,
  isSeated = true, setIsSeated,
  canConfigureSeating = false,
  description, setDescription,
  bannerFile, setBannerFile,
  categories, setCategories,
  artistsList = [],
  selectedArtistIds = [],
  toggleArtistSelection,
  handleCategoryChange,
  addCategory,
  removeCategory,
  handleSubmit
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white dark:bg-obsidian-card p-6 rounded-3xl border border-gray-200 dark:border-obsidian-border max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-extrabold text-base text-gray-900 dark:text-white">
            {isEditMode ? 'Edit Data Event' : 'Buat Event Konser Baru'}
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-900 dark:hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-xs font-bold mb-1">Judul Event</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="MISAL: VISCERAL CONCERT 2026"
              className="w-full p-2.5 rounded-xl text-xs bg-gray-50 dark:bg-obsidian-surface border border-gray-200 dark:border-obsidian-border focus:outline-none focus:border-gold"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold mb-1">Venue / Tempat</label>
              <input
                type="text"
                value={venue}
                onChange={(e) => setVenue(e.target.value)}
                placeholder="MISAL: GBK Stadium, Jakarta"
                className="w-full p-2.5 rounded-xl text-xs bg-gray-50 dark:bg-obsidian-surface border border-gray-200 dark:border-obsidian-border focus:outline-none focus:border-gold"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold mb-1">Tanggal & Waktu Event</label>
              <input
                type="datetime-local"
                value={eventDate}
                onChange={(e) => setEventDate(e.target.value)}
                className="w-full p-2.5 rounded-xl text-xs bg-gray-50 dark:bg-obsidian-surface border border-gray-200 dark:border-obsidian-border focus:outline-none focus:border-gold"
                required
              />
            </div>
          </div>

          {canConfigureSeating && setIsSeated && (
            <div>
              <label className="block text-xs font-bold mb-1.5">Tipe Area / Kursi (Khusus Superadmin)</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setIsSeated(true)}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    isSeated
                      ? 'bg-gold/10 border-gold text-gray-900 dark:text-white'
                      : 'bg-gray-50 dark:bg-obsidian-surface border-gray-200 dark:border-obsidian-border text-gray-500 dark:text-gray-400'
                  }`}
                >
                  <div className="text-xs font-extrabold">Seated (Pilih Kursi)</div>
                  <div className="text-[11px] opacity-80 mt-0.5">Penonton memilih nomor kursi pada denah</div>
                </button>
                <button
                  type="button"
                  onClick={() => setIsSeated(false)}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    !isSeated
                      ? 'bg-gold/10 border-gold text-gray-900 dark:text-white'
                      : 'bg-gray-50 dark:bg-obsidian-surface border-gray-200 dark:border-obsidian-border text-gray-500 dark:text-gray-400'
                  }`}
                >
                  <div className="text-xs font-extrabold">Standing (Area Bebas)</div>
                  <div className="text-[11px] opacity-80 mt-0.5">Penonton bebas berdiri & hanya pilih jumlah tiket</div>
                </button>
              </div>
              <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-1.5">
                Catatan: Kategori bernama Standing, Festival, General, Presale, Pass, atau GA otomatis menjadi area berdiri.
              </p>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold mb-1 flex items-center gap-2">
              <Image className="w-4 h-4" /> {isEditMode ? 'Ubah Foto/Banner (Opsional)' : 'Banner Gambar Event'}
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  setBannerFile(e.target.files[0]);
                }
              }}
              className="w-full text-xs text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-gold/10 file:text-gold hover:file:bg-gold/20"
            />
          </div>

          <div>
            <label className="block text-xs font-bold mb-1">Deskripsi Singkat</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Deskripsi singkat acara..."
              className="w-full p-2.5 rounded-xl text-xs bg-gray-50 dark:bg-obsidian-surface border border-gray-200 dark:border-obsidian-border min-h-[80px] focus:outline-none focus:border-gold"
            />
          </div>

          {artistsList.length > 0 && toggleArtistSelection && (
            <div>
              <label className="block text-xs font-bold mb-1.5 flex items-center gap-1.5">
                <Music className="w-3.5 h-3.5 text-gold" /> Lineup Artis Penampil (Artis pertama = Headliner)
              </label>
              <div className="flex flex-wrap gap-2 p-3 rounded-xl bg-gray-50 dark:bg-obsidian-surface border border-gray-200 dark:border-obsidian-border max-h-36 overflow-y-auto">
                {artistsList.map((art) => {
                  const isSelected = selectedArtistIds.includes(art.id);
                  const isFirst = selectedArtistIds[0] === art.id;
                  return (
                    <button
                      key={art.id}
                      type="button"
                      onClick={() => toggleArtistSelection(art.id)}
                      className={`px-3 py-1 rounded-full text-[11px] font-bold transition-all border ${
                        isSelected
                          ? 'bg-gold text-obsidian border-gold shadow-sm'
                          : 'bg-white dark:bg-obsidian text-gray-600 dark:text-gray-300 border-gray-200 dark:border-obsidian-border hover:border-gold/50'
                      }`}
                    >
                      {isFirst ? '★ ' : ''}{art.name}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {!isEditMode && categories && (
            <div>
              <label className="block text-xs font-bold mb-1">Kategori Tiket & Harga Early Bird</label>
              {categories.map((cat, idx) => (
                <div key={idx} className="p-3 border border-gray-200 dark:border-obsidian-border rounded-xl mb-3 space-y-3 bg-gray-50/50 dark:bg-obsidian-surface/50">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-gray-500 dark:text-gray-400">
                      Kategori #{idx + 1}
                    </span>
                    {categories.length > 1 && (
                      <button
                        type="button"
                        onClick={() =>
                          removeCategory
                            ? removeCategory(idx)
                            : setCategories(categories.filter((_, i) => i !== idx))
                        }
                        title="Hapus Kategori"
                        className="inline-flex items-center gap-1 px-2 py-1 rounded-lg text-[11px] font-bold text-oxblood dark:text-red-400 hover:bg-oxblood/10 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        Hapus
                      </button>
                    )}
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    <input
                      type="text"
                      value={cat.name}
                      onChange={(e) => handleCategoryChange(idx, 'name', e.target.value)}
                      placeholder="Nama (VIP, CAT 1)"
                      className="p-2 rounded-lg text-xs border border-gray-300 dark:border-obsidian-border bg-white dark:bg-obsidian w-full"
                      required
                    />
                    <input
                      type="number"
                      value={cat.price}
                      onChange={(e) => handleCategoryChange(idx, 'price', e.target.value)}
                      placeholder="Harga Normal (Rp)"
                      className="p-2 rounded-lg text-xs border border-gray-300 dark:border-obsidian-border bg-white dark:bg-obsidian w-full"
                      required
                    />
                    <input
                      type="number"
                      value={cat.totalSeats}
                      onChange={(e) => handleCategoryChange(idx, 'totalSeats', e.target.value)}
                      placeholder="Total Kursi"
                      className="p-2 rounded-lg text-xs border border-gray-300 dark:border-obsidian-border bg-white dark:bg-obsidian w-full"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    <input
                      type="number"
                      value={cat.earlyBirdPrice}
                      onChange={(e) => handleCategoryChange(idx, 'earlyBirdPrice', e.target.value)}
                      placeholder="Harga Promo (Opsional)"
                      className="p-2 rounded-lg text-xs border border-gray-300 dark:border-obsidian-border bg-white dark:bg-obsidian w-full"
                    />
                    <input
                      type="datetime-local"
                      value={cat.earlyBirdStartDate}
                      onChange={(e) => handleCategoryChange(idx, 'earlyBirdStartDate', e.target.value)}
                      title="Tanggal Mulai Promo"
                      className="p-2 rounded-lg text-xs border border-gray-300 dark:border-obsidian-border bg-white dark:bg-obsidian w-full"
                    />
                    <input
                      type="datetime-local"
                      value={cat.earlyBirdEndDate}
                      onChange={(e) => handleCategoryChange(idx, 'earlyBirdEndDate', e.target.value)}
                      title="Tanggal Berakhir Promo"
                      className="p-2 rounded-lg text-xs border border-gray-300 dark:border-obsidian-border bg-white dark:bg-obsidian w-full"
                    />
                  </div>
                </div>
              ))}
              <button
                type="button"
                onClick={addCategory}
                className="text-xs font-bold text-gold hover:underline mt-1"
              >
                + Tambah Kategori
              </button>
            </div>
          )}

          <button
            type="submit"
            className="w-full py-3 rounded-xl gold-gradient-btn text-obsidian font-extrabold text-xs shadow-gold-glow mt-6"
          >
            {isEditMode ? 'Simpan Perubahan' : 'Simpan & Publish Event'}
          </button>
        </form>
      </div>
    </div>
  );
}
