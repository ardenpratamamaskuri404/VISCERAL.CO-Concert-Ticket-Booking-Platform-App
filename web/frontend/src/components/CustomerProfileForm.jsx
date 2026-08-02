import React from 'react';
import { User, UploadCloud, Save, Camera } from 'lucide-react';

export default function CustomerProfileForm({ 
  currentUser, 
  profileData, 
  setProfileData, 
  handleProfileSubmit, 
  loading 
}) {
  return (
    <form onSubmit={handleProfileSubmit} className="relative z-10">
      <h2 className="text-xl font-bold mb-6">Informasi Pribadi</h2>
      
      <div className="flex flex-col md:flex-row gap-8 mb-8">
        <div className="flex flex-col items-center gap-4">
          <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-gold/30 shadow-gold-glow bg-obsidian flex items-center justify-center relative group">
            {profileData.avatarUrl ? (
              <img src={profileData.avatarUrl} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <User className="w-12 h-12 text-gray-500" />
            )}
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer">
              <Camera className="w-8 h-8 text-white" />
            </div>
          </div>
          <span className="text-xs text-gray-400 font-medium">Pratinjau Foto</span>
        </div>

        <div className="flex-1 space-y-5">
          <div>
            <label className="block text-xs font-bold text-gray-400 mb-2 uppercase tracking-wider">URL Foto Profil (Opsional)</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <UploadCloud className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                value={profileData.avatarUrl}
                onChange={(e) => setProfileData({...profileData, avatarUrl: e.target.value})}
                placeholder="https://example.com/foto.jpg"
                className="w-full bg-gray-50 dark:bg-obsidian border border-gray-200 dark:border-obsidian-border text-brand-darkText dark:text-white rounded-xl pl-11 pr-4 py-3 focus:outline-none focus:border-gold transition-colors text-sm"
              />
            </div>
            <p className="text-[11px] text-gray-500 mt-1">Masukkan URL gambar untuk mengganti foto profil Anda.</p>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-400 mb-2 uppercase tracking-wider">Email (Tidak bisa diubah)</label>
            <input
              type="email"
              value={currentUser?.email || ''}
              disabled
              className="w-full bg-gray-100 dark:bg-obsidian/50 border border-gray-200 dark:border-obsidian-border text-gray-500 rounded-xl px-4 py-3 text-sm cursor-not-allowed"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-400 mb-2 uppercase tracking-wider">Nama Lengkap</label>
            <input
              type="text"
              value={profileData.fullName}
              onChange={(e) => setProfileData({...profileData, fullName: e.target.value})}
              required
              className="w-full bg-gray-50 dark:bg-obsidian border border-gray-200 dark:border-obsidian-border text-brand-darkText dark:text-white rounded-xl px-4 py-3 focus:outline-none focus:border-gold transition-colors text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-400 mb-2 uppercase tracking-wider">Nomor WhatsApp</label>
            <input
              type="text"
              value={profileData.phoneNumber}
              onChange={(e) => setProfileData({...profileData, phoneNumber: e.target.value})}
              placeholder="+628123456789"
              className="w-full bg-gray-50 dark:bg-obsidian border border-gray-200 dark:border-obsidian-border text-brand-darkText dark:text-white rounded-xl px-4 py-3 focus:outline-none focus:border-gold transition-colors text-sm"
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end pt-4 border-t border-gray-100 dark:border-obsidian-border">
        <button
          type="submit"
          disabled={loading}
          className="gold-gradient-btn text-obsidian font-bold py-3 px-8 rounded-xl flex items-center gap-2 shadow-gold-glow disabled:opacity-50"
        >
          {loading ? 'Menyimpan...' : <><Save className="w-4 h-4" /> Simpan Perubahan</>}
        </button>
      </div>
    </form>
  );
}
