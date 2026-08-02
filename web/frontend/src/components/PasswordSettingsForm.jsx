import React from 'react';

export default function PasswordSettingsForm({ 
  passwordData, 
  setPasswordData, 
  handlePasswordSubmit, 
  loading 
}) {
  return (
    <form onSubmit={handlePasswordSubmit} className="relative z-10">
      <h2 className="text-xl font-bold mb-6">Ubah Password</h2>
      <div className="space-y-5 mb-8 max-w-md">
        <div>
          <label className="block text-xs font-bold text-gray-400 mb-2 uppercase tracking-wider">Password Lama</label>
          <input
            type="password"
            value={passwordData.oldPassword}
            onChange={(e) => setPasswordData({...passwordData, oldPassword: e.target.value})}
            required
            className="w-full bg-gray-50 dark:bg-obsidian border border-gray-200 dark:border-obsidian-border text-brand-darkText dark:text-white rounded-xl px-4 py-3 focus:outline-none focus:border-gold transition-colors text-sm"
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-gray-400 mb-2 uppercase tracking-wider">Password Baru</label>
          <input
            type="password"
            value={passwordData.newPassword}
            onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
            required
            className="w-full bg-gray-50 dark:bg-obsidian border border-gray-200 dark:border-obsidian-border text-brand-darkText dark:text-white rounded-xl px-4 py-3 focus:outline-none focus:border-gold transition-colors text-sm"
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-gray-400 mb-2 uppercase tracking-wider">Konfirmasi Password Baru</label>
          <input
            type="password"
            value={passwordData.confirmPassword}
            onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
            required
            className="w-full bg-gray-50 dark:bg-obsidian border border-gray-200 dark:border-obsidian-border text-brand-darkText dark:text-white rounded-xl px-4 py-3 focus:outline-none focus:border-oxblood transition-colors text-sm"
          />
        </div>
      </div>

      <div className="flex justify-end pt-4 border-t border-gray-100 dark:border-obsidian-border">
        <button
          type="submit"
          disabled={loading}
          className="bg-obsidian-surface hover:bg-obsidian text-white border border-gray-600 hover:border-gold font-bold py-3 px-8 rounded-xl transition-all disabled:opacity-50"
        >
          {loading ? 'Memproses...' : 'Perbarui Password'}
        </button>
      </div>
    </form>
  );
}
