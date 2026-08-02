import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { getImageUrl } from '../utils/image';
import AdminSidebar from '../components/AdminSidebar';
import AdminTopbar from '../components/AdminTopbar';
import ProfileSettingsForm from '../components/ProfileSettingsForm';
import PasswordSettingsForm from '../components/PasswordSettingsForm';
import { User, Lock, ShieldAlert, CheckCircle2, AlertCircle, Trash2, Settings, Database, Activity } from 'lucide-react';

export default function AdminSettingsPage() {
  const { currentUser, updateUserProfile, changeUserPassword, deleteUserAccount } = useStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (!currentUser) {
      navigate('/login');
    }
  }, [currentUser, navigate]);

  const [activeTab, setActiveTab] = useState('profil');
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Form States
  const [profileData, setProfileData] = useState({
    fullName: currentUser?.fullName || '',
    phoneNumber: currentUser?.phoneNumber || '',
    avatarUrl: currentUser?.avatarUrl || '',
    avatarFile: null,
  });
  const fileInputRef = useRef(null);

  const [passwordData, setPasswordData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  if (!currentUser) return null;

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    const formData = new FormData();
    formData.append('fullName', profileData.fullName);
    if (profileData.phoneNumber) formData.append('phoneNumber', profileData.phoneNumber);
    if (profileData.avatarFile) {
        formData.append('avatarFile', profileData.avatarFile);
    }
    
    const res = await updateUserProfile(formData);
    
    if (res.success) {
      setSuccessMsg(res.message + ' Memuat ulang...');
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } else {
      setErrorMsg(res.error);
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setErrorMsg('Password baru dan konfirmasi tidak cocok');
      return;
    }
    setLoading(true);
    const res = await changeUserPassword({
      oldPassword: passwordData.oldPassword,
      newPassword: passwordData.newPassword
    });
    if (res.success) {
      setSuccessMsg(res.message);
      setPasswordData({ oldPassword: '', newPassword: '', confirmPassword: '' });
      setTimeout(() => setSuccessMsg(''), 3000);
    } else {
      setErrorMsg(res.error);
    }
    setLoading(false);
  };

  const handleDeleteAccount = async () => {
    setLoading(true);
    const res = await deleteUserAccount();
    if (res.success) {
      navigate('/');
    } else {
      setErrorMsg(res.error);
      setLoading(false);
      setShowDeleteConfirm(false);
    }
  };

  const tabs = [
    { id: 'profil', label: 'Profil Saya', icon: User },
    { id: 'keamanan', label: 'Keamanan', icon: Lock },
  ];

  if (currentUser?.role === 'SUPERADMIN') {
    tabs.push({ id: 'sistem', label: 'Konfigurasi Sistem', icon: Settings });
  } else {
    tabs.push({ id: 'zona', label: 'Zona Berbahaya', icon: ShieldAlert, color: 'text-oxblood' });
  }

  return (
    <div className="min-h-screen bg-brand-bgLight dark:bg-obsidian-dark flex transition-colors text-brand-darkText dark:text-brand-lightText">
      <AdminSidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <AdminTopbar title="Pengaturan Akun Admin" />

        <main className="p-6 md:p-8 space-y-8 overflow-y-auto">
          <div className="flex flex-col md:flex-row gap-8 max-w-6xl">
          {/* Sidebar */}
          <div className="md:w-64 flex-shrink-0">
            <div className="bg-white dark:bg-obsidian-card rounded-3xl p-4 shadow-xl border border-gray-100 dark:border-obsidian-border flex flex-col gap-2">
              {tabs.map(tab => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => {
                      setActiveTab(tab.id);
                      setErrorMsg('');
                      setSuccessMsg('');
                    }}
                    className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold transition-all ${
                      isActive 
                        ? 'bg-gold/10 text-gold shadow-sm' 
                        : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-obsidian hover:text-gold'
                    }`}
                  >
                    <Icon className={`w-5 h-5 ${tab.color ? tab.color : (isActive ? 'text-gold' : '')}`} />
                    <span className={tab.color ? tab.color : ''}>{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Content Area */}
          <div className="flex-1">
            <div className="bg-white dark:bg-obsidian-card rounded-3xl p-6 md:p-10 shadow-xl border border-gray-100 dark:border-obsidian-border relative overflow-hidden">
              {/* Decorative Blur */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-gold/5 rounded-full blur-3xl pointer-events-none"></div>

              {/* Status Messages */}
              {successMsg && (
                <div className="mb-6 bg-green-500/10 border border-green-500/20 text-green-500 px-4 py-3 rounded-xl flex items-center gap-3 text-sm font-medium">
                  <CheckCircle2 className="w-5 h-5" /> {successMsg}
                </div>
              )}
              {errorMsg && (
                <div className="mb-6 bg-oxblood/10 border border-oxblood/20 text-oxblood px-4 py-3 rounded-xl flex items-center gap-3 text-sm font-medium">
                  <AlertCircle className="w-5 h-5" /> {errorMsg}
                </div>
              )}

              {/* TAB: PROFIL */}
              {activeTab === 'profil' && (
                <ProfileSettingsForm 
                  currentUser={currentUser}
                  profileData={profileData}
                  setProfileData={setProfileData}
                  handleProfileSubmit={handleProfileSubmit}
                  loading={loading}
                  fileInputRef={fileInputRef}
                />
              )}

              {/* TAB: KEAMANAN */}
              {activeTab === 'keamanan' && (
                <PasswordSettingsForm 
                  passwordData={passwordData}
                  setPasswordData={setPasswordData}
                  handlePasswordSubmit={handlePasswordSubmit}
                  loading={loading}
                />
              )}

              {/* TAB: ZONA BERBAHAYA */}
              {activeTab === 'zona' && (
                <div className="relative z-10">
                  <h2 className="text-xl font-bold mb-2 text-oxblood flex items-center gap-2">
                    <ShieldAlert className="w-6 h-6" /> Zona Berbahaya
                  </h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-8">
                    Tindakan di bawah ini bersifat permanen dan tidak dapat dibatalkan. Berhati-hatilah.
                  </p>

                  <div className="bg-oxblood/5 border border-oxblood/20 rounded-2xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <h3 className="font-bold text-oxblood">Hapus Akun Permanen</h3>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        Semua data, riwayat pesanan, dan tiket Anda akan dihapus selamanya dari sistem VISCERAL.CO.
                      </p>
                    </div>
                    {!showDeleteConfirm ? (
                      <button
                        onClick={() => setShowDeleteConfirm(true)}
                        className="bg-oxblood hover:bg-red-700 text-white font-bold py-2.5 px-6 rounded-xl transition-colors whitespace-nowrap"
                      >
                        Hapus Akun
                      </button>
                    ) : (
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-bold text-oxblood uppercase">Yakin?</span>
                        <button
                          onClick={handleDeleteAccount}
                          disabled={loading}
                          className="bg-oxblood hover:bg-red-700 text-white font-bold py-2 px-4 rounded-xl transition-colors flex items-center gap-2 text-sm disabled:opacity-50"
                        >
                          {loading ? 'Menghapus...' : <><Trash2 className="w-4 h-4" /> Ya, Hapus</>}
                        </button>
                        <button
                          onClick={() => setShowDeleteConfirm(false)}
                          disabled={loading}
                          className="bg-gray-200 dark:bg-obsidian text-gray-700 dark:text-white font-bold py-2 px-4 rounded-xl transition-colors text-sm"
                        >
                          Batal
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}
              {activeTab === 'sistem' && currentUser?.role === 'SUPERADMIN' && (
                  <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div>
                      <h2 className="text-2xl font-extrabold flex items-center gap-2 mb-2">
                        <Settings className="w-6 h-6 text-gold" /> Konfigurasi Sistem
                      </h2>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Pengaturan global aplikasi (Eksklusif Super Admin).
                      </p>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-5 rounded-2xl bg-gray-50 dark:bg-obsidian-surface border border-gray-200 dark:border-obsidian-border flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-500">
                          <Database className="w-6 h-6" />
                        </div>
                        <div>
                          <h4 className="font-bold text-sm">Backup Database</h4>
                          <button className="text-xs font-extrabold text-blue-500 mt-1 hover:underline">Jalankan Backup Manual</button>
                        </div>
                      </div>
                      <div className="p-5 rounded-2xl bg-gray-50 dark:bg-obsidian-surface border border-gray-200 dark:border-obsidian-border flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center text-green-500">
                          <Activity className="w-6 h-6" />
                        </div>
                        <div>
                          <h4 className="font-bold text-sm">Mode Maintenance</h4>
                          <button className="text-xs font-extrabold text-gray-400 mt-1 cursor-not-allowed">Status: Nonaktif</button>
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-4 rounded-xl bg-gold/10 border border-gold/30 text-gold text-xs font-semibold">
                      Catatan: Fitur sistem konfigurasi secara penuh akan tersedia pada update v2.0.
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
