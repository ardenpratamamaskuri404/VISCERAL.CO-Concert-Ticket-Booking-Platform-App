import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import Navbar from '../components/Navbar';
import ProfileSettingsForm from '../components/ProfileSettingsForm';
import PasswordSettingsForm from '../components/PasswordSettingsForm';
import { User, Lock, ShieldAlert, CheckCircle2, AlertCircle, Trash2 } from 'lucide-react';

export default function SettingsPage() {
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
  const fileInputRef = React.useRef(null);

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
    setErrorMsg('');
    setSuccessMsg('');

    const formData = new FormData();
    formData.append('fullName', profileData.fullName);
    if (profileData.phoneNumber) formData.append('phoneNumber', profileData.phoneNumber);
    if (profileData.avatarFile) {
        formData.append('avatarFile', profileData.avatarFile);
    }

    const res = await updateUserProfile(formData);
    if (res.success) {
      setSuccessMsg('Profil berhasil diperbarui! Memuat ulang...');
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
      setErrorMsg('Password baru dan konfirmasi password tidak cocok');
      return;
    }

    setLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    const res = await changeUserPassword({
      oldPassword: passwordData.oldPassword,
      newPassword: passwordData.newPassword
    });

    if (res.success) {
      setSuccessMsg('Password berhasil diubah!');
      setPasswordData({ oldPassword: '', newPassword: '', confirmPassword: '' });
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
    { id: 'zona', label: 'Zona Berbahaya', icon: ShieldAlert, color: 'text-oxblood' },
  ];

  return (
    <div className="min-h-screen bg-brand-bgLight dark:bg-obsidian-dark text-brand-darkText dark:text-brand-lightText transition-colors">
      <Navbar />

      <div className="pt-32 pb-16 px-4 md:px-8 max-w-6xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-extrabold mb-8 gold-gradient-text">Pengaturan Akun</h1>

        <div className="flex flex-col md:flex-row gap-8">
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
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
