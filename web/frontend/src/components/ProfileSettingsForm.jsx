import React from 'react';
import { User, Camera, Save } from 'lucide-react';
import { getImageUrl } from '../utils/image';

export default function ProfileSettingsForm({ 
  currentUser, 
  profileData, 
  setProfileData, 
  handleProfileSubmit, 
  loading,
  fileInputRef
}) {
  return (
    <form onSubmit={handleProfileSubmit} className="relative z-10">
      <h2 className="text-xl font-bold mb-6">Informasi Pribadi</h2>
      
      <div className="flex flex-col md:flex-row gap-8 mb-8">
        <div className="flex flex-col items-center gap-4">
          <div 
            className="w-32 h-32 rounded-full overflow-hidden border-4 border-gold/30 shadow-gold-glow bg-obsidian flex items-center justify-center relative group cursor-pointer"
            onClick={() => fileInputRef.current?.click()}
          >
            {profileData.avatarFile ? (
              <img src={URL.createObjectURL(profileData.avatarFile)} alt="Profile Preview" className="w-full h-full object-cover" />
            ) : currentUser?.avatarUrl ? (
              <img src={getImageUrl(currentUser.avatarUrl, 'users')} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <User className="w-12 h-12 text-gray-500" />
            )}
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center">
              <Camera className="w-6 h-6 text-white mb-1" />
              <span className="text-[10px] text-white font-bold uppercase">Ubah Foto</span>
            </div>
          </div>
          <input 
            type="file" 
            ref={fileInputRef} 
            className="hidden" 
            accept="image/*"
            onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                    setProfileData({...profileData, avatarFile: e.target.files[0]});
                }
            }}
          />
          <span className="text-xs text-gray-400 font-medium">Klik untuk mengganti foto</span>
        </div>

        <div className="flex-1 space-y-5">
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
