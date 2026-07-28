import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import Navbar from '../components/Navbar';
import { User, Mail, Phone, Lock, Moon, Sun, LogOut, CheckCircle2 } from 'lucide-react';

export default function ProfilePage() {
  const { currentUser, setCurrentUser, darkMode, toggleDarkMode, logoutUser } = useStore();
  const navigate = useNavigate();

  const [fullName, setFullName] = useState(currentUser?.fullName || 'Budi Pratama');
  const [phone, setPhone] = useState(currentUser?.phoneNumber || '+6281234567890');
  const [saved, setSaved] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    if (currentUser) {
      setCurrentUser({
        ...currentUser,
        fullName,
        phoneNumber: phone
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-brand-bgLight dark:bg-obsidian-dark text-brand-darkText dark:text-brand-lightText transition-colors">
      <Navbar />

      <div className="pt-28 pb-16 px-4 md:px-8 max-w-2xl mx-auto">
        <div className="bg-white dark:bg-obsidian-card p-8 rounded-3xl border border-gray-200 dark:border-obsidian-border shadow-obsidian-glow relative overflow-hidden">
          
          <div className="pulse-line-oxblood w-full absolute top-0 left-0"></div>

          <div className="flex items-center gap-4 mb-6 pb-6 border-b border-gray-100 dark:border-obsidian-border">
            <div className="w-16 h-16 rounded-full bg-gold text-obsidian font-extrabold flex items-center justify-center text-2xl shadow-gold-glow">
              {fullName.charAt(0)}
            </div>
            <div>
              <h1 className="text-xl font-extrabold text-gray-900 dark:text-white">{fullName}</h1>
              <p className="text-xs text-gray-500 dark:text-gray-400">{currentUser?.email}</p>
              <span className="inline-block mt-1 bg-oxblood text-white text-[9px] font-extrabold px-2 py-0.5 rounded-full uppercase">
                {currentUser?.role || 'CUSTOMER'}
              </span>
            </div>
          </div>

          {saved && (
            <div className="mb-6 p-3 rounded-2xl bg-green-500/10 border border-green-500/30 text-green-500 text-xs font-semibold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" /> Profil berhasil diperbarui!
            </div>
          )}

          <form onSubmit={handleSave} className="space-y-4 mb-8">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-1">
                Nama Lengkap
              </label>
              <div className="relative">
                <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl text-xs bg-gray-50 dark:bg-obsidian-surface border border-gray-200 dark:border-obsidian-border text-gray-900 dark:text-white focus:outline-none focus:border-gold"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-1">
                Nomor WhatsApp Fonnte OTP
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl text-xs bg-gray-50 dark:bg-obsidian-surface border border-gray-200 dark:border-obsidian-border text-gray-900 dark:text-white focus:outline-none focus:border-gold"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl gold-gradient-btn text-obsidian font-extrabold text-xs shadow-gold-glow"
            >
              Simpan Perubahan
            </button>
          </form>

          {/* Preferences & Logout */}
          <div className="space-y-3 pt-6 border-t border-gray-100 dark:border-obsidian-border">
            <div className="flex items-center justify-between p-3 rounded-2xl bg-gray-50 dark:bg-obsidian-surface">
              <span className="text-xs font-bold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                {darkMode ? <Sun className="w-4 h-4 text-gold" /> : <Moon className="w-4 h-4 text-obsidian" />}
                Mode Tampilan Tema Dark/Light
              </span>
              <button
                onClick={toggleDarkMode}
                className="px-3 py-1 rounded-full bg-obsidian text-gold text-xs font-bold shadow-sm"
              >
                {darkMode ? 'Dark Active' : 'Light Active'}
              </button>
            </div>

            <button
              onClick={() => {
                logoutUser();
                navigate('/landing');
              }}
              className="w-full py-3 rounded-xl bg-oxblood/10 text-oxblood hover:bg-oxblood hover:text-white transition-colors text-xs font-bold flex items-center justify-center gap-2 border border-oxblood/30"
            >
              <LogOut className="w-4 h-4" /> Keluar Dari Akun
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
