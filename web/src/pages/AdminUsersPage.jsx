import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import AdminSidebar from '../components/AdminSidebar';
import AdminTopbar from '../components/AdminTopbar';
import { Users, Shield, Sparkles, FileText, UserPlus, Trash2, Key } from 'lucide-react';

export default function AdminUsersPage() {
  const { auditLogs, currentUser } = useStore();
  const isSuperadmin = currentUser?.role === 'SUPERADMIN';

  const [usersList, setUsersList] = useState([
    { id: 'usr-1', name: 'Superadmin Visceral', email: 'superadmin@visceral.co', role: 'SUPERADMIN' },
    { id: 'usr-2', name: 'Admin Ops Jakarta', email: 'admin@visceral.co', role: 'ADMIN' },
    { id: 'usr-3', name: 'Budi Pratama', email: 'budi@gmail.com', role: 'CUSTOMER' },
    { id: 'usr-4', name: 'Siti Rahmawati', email: 'siti.rahma@yahoo.com', role: 'CUSTOMER' }
  ]);

  const [newAdminName, setNewAdminName] = useState('');
  const [newAdminEmail, setNewAdminEmail] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

  const handleAddAdmin = (e) => {
    e.preventDefault();
    if (!newAdminName || !newAdminEmail) return;
    setUsersList(prev => [
      ...prev,
      { id: `usr-${Date.now()}`, name: newAdminName, email: newAdminEmail, role: 'ADMIN' }
    ]);
    setShowAddModal(false);
    setNewAdminName('');
    setNewAdminEmail('');
  };

  const handleDeleteUser = (id) => {
    setUsersList(prev => prev.filter(u => u.id !== id));
  };

  return (
    <div className="min-h-screen bg-brand-bgLight dark:bg-obsidian-dark flex transition-colors">
      <AdminSidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <AdminTopbar title="Kelola User & Audit Log (Superadmin)" />

        <main className="p-6 md:p-8 space-y-8 overflow-y-auto">
          
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl font-extrabold tracking-tight">Manajemen Hak Akses & Audit Log</h2>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Kelola staff admin (RBAC) dan pantau seluruh riwayat aktivitas sistem.
              </p>
            </div>

            {isSuperadmin && (
              <button
                onClick={() => setShowAddModal(true)}
                className="px-5 py-2.5 rounded-xl gold-gradient-btn text-obsidian text-xs font-extrabold flex items-center gap-2 shadow-gold-glow"
              >
                <UserPlus className="w-4 h-4" /> Tambah Staff Admin
              </button>
            )}
          </div>

          {/* Users Table */}
          <div className="bg-white dark:bg-obsidian-card rounded-3xl border border-gray-200 dark:border-obsidian-border p-6 shadow-sm">
            <h3 className="text-base font-extrabold mb-4 pb-2 border-b border-gray-100 dark:border-obsidian-border flex items-center gap-2">
              <Users className="w-4 h-4 text-gold" />
              Daftar Pengguna Sistem (RBAC)
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-obsidian-border text-[11px] font-extrabold uppercase text-gray-400">
                    <th className="pb-3">Nama User</th>
                    <th className="pb-3">Email</th>
                    <th className="pb-3">Role Status</th>
                    <th className="pb-3 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-obsidian-border text-xs">
                  {usersList.map((u) => (
                    <tr key={u.id} className="hover:bg-gray-50 dark:hover:bg-obsidian-surface transition-colors">
                      <td className="py-3.5 font-bold text-gray-900 dark:text-white">{u.name}</td>
                      <td className="py-3.5 text-gray-600 dark:text-gray-300">{u.email}</td>
                      <td className="py-3.5">
                        {u.role === 'SUPERADMIN' ? (
                          <span className="bg-gold text-obsidian text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase flex items-center gap-1 w-max shadow-gold-glow">
                            <Sparkles className="w-3 h-3" /> SUPERADMIN
                          </span>
                        ) : u.role === 'ADMIN' ? (
                          <span className="bg-blue-500/20 text-blue-400 border border-blue-500/30 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase w-max">
                            STAFF ADMIN
                          </span>
                        ) : (
                          <span className="bg-gray-100 dark:bg-obsidian-surface text-gray-400 text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase w-max">
                            CUSTOMER
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 text-right">
                        {u.role !== 'SUPERADMIN' && isSuperadmin && (
                          <button
                            onClick={() => handleDeleteUser(u.id)}
                            className="p-1.5 rounded-lg text-oxblood hover:bg-oxblood/10"
                            title="Hapus Admin"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Audit Log Table (Inovasi Model AuditLog) */}
          <div className="bg-white dark:bg-obsidian-card rounded-3xl border border-gray-200 dark:border-obsidian-border p-6 shadow-sm">
            <h3 className="text-base font-extrabold mb-4 pb-2 border-b border-gray-100 dark:border-obsidian-border flex items-center gap-2">
              <FileText className="w-4 h-4 text-gold" />
              Audit Log Aktivitas Sistem (System Logs)
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-obsidian-border text-[11px] font-extrabold uppercase text-gray-400">
                    <th className="pb-3">Waktu Log</th>
                    <th className="pb-3">User Pelaku</th>
                    <th className="pb-3">Jenis Aksi</th>
                    <th className="pb-3">Metadata</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-obsidian-border text-xs">
                  {auditLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-gray-50 dark:hover:bg-obsidian-surface transition-colors">
                      <td className="py-3 text-gray-500 font-mono text-[11px]">
                        {new Date(log.createdAt).toLocaleString('id-ID')}
                      </td>
                      <td className="py-3 font-bold">
                        {log.userName}
                        <span className="block text-[10px] text-gold">{log.userRole}</span>
                      </td>
                      <td className="py-3 font-mono font-bold text-oxblood dark:text-gold-light">
                        {log.action}
                      </td>
                      <td className="py-3 text-gray-600 dark:text-gray-300 font-mono text-[11px]">
                        {JSON.stringify(log.metadata)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </main>
      </div>

      {/* Modal Add Admin */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-obsidian-card p-6 rounded-3xl border border-gray-200 dark:border-obsidian-border max-w-md w-full shadow-2xl">
            <h3 className="font-extrabold text-base mb-4">Tambah Staff Admin Baru</h3>
            <form onSubmit={handleAddAdmin} className="space-y-3">
              <div>
                <label className="block text-xs font-bold mb-1">Nama Lengkap Admin</label>
                <input
                  type="text"
                  value={newAdminName}
                  onChange={(e) => setNewAdminName(e.target.value)}
                  placeholder="MISAL: Andi Admin"
                  className="w-full p-2.5 rounded-xl text-xs bg-gray-50 dark:bg-obsidian-surface border border-gray-200 dark:border-obsidian-border"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold mb-1">Email Staff</label>
                <input
                  type="email"
                  value={newAdminEmail}
                  onChange={(e) => setNewAdminEmail(e.target.value)}
                  placeholder="andi@visceral.co"
                  className="w-full p-2.5 rounded-xl text-xs bg-gray-50 dark:bg-obsidian-surface border border-gray-200 dark:border-obsidian-border"
                  required
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 py-2.5 rounded-xl bg-gray-200 dark:bg-obsidian text-xs font-bold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl gold-gradient-btn text-obsidian text-xs font-extrabold shadow-gold-glow"
                >
                  Simpan Admin
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
