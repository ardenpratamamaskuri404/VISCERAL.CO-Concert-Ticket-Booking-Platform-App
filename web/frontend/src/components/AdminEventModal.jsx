import React from 'react';
import { X, Image } from 'lucide-react';

export default function AdminEventModal({
  isOpen,
  onClose,
  isEditMode,
  title, setTitle,
  venue, setVenue,
  eventDate, setEventDate,
  description, setDescription,
  bannerFile, setBannerFile,
  categories, setCategories,
  handleCategoryChange,
  addCategory,
  handleSubmit
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white dark:bg-obsidian-card p-6 rounded-3xl border border-gray-200 dark:border-obsidian-border max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-extrabold text-base">
            {isEditMode ? 'Edit Data Event' : 'Buat Event Konser Baru'}
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
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
              <label className="block text-xs font-bold mb-1">Tanggal Event</label>
              <input
                type={isEditMode ? "date" : "datetime-local"}
                value={eventDate}
                onChange={(e) => setEventDate(e.target.value)}
                className="w-full p-2.5 rounded-xl text-xs bg-gray-50 dark:bg-obsidian-surface border border-gray-200 dark:border-obsidian-border focus:outline-none focus:border-gold"
                required
              />
            </div>
          </div>

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

          {!isEditMode && categories && (
            <div>
              <label className="block text-xs font-bold mb-1">Kategori Tiket & Harga Early Bird</label>
              {categories.map((cat, idx) => (
                <div key={idx} className="p-3 border border-gray-200 dark:border-obsidian-border rounded-xl mb-3 space-y-3 bg-gray-50/50 dark:bg-obsidian-surface/50">
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
