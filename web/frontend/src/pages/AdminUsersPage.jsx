import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import AdminSidebar from '../components/AdminSidebar';
import AdminTopbar from '../components/AdminTopbar';
import { Users, Shield, Sparkles, FileText, UserPlus, Trash2, Key, Edit2, User } from 'lucide-react';
import { getImageUrl } from '../utils/image';

export default function AdminUsersPage() {
  const { auditLogs, currentUser, users } = useStore();
  const isSuperadmin = currentUser?.role === 'SUPERADMIN';

  const [newAdminName, setNewAdminName] = useState('');
  const [newAdminEmail, setNewAdminEmail] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

  // Edit Role States
  const { updateUserRole } = useStore();
  const [showEditModal, setShowEditModal] = useState(false);
  const [editUserId, setEditUserId] = useState(null);
  const [editUserRole, setEditUserRole] = useState('');
  const [editUserName, setEditUserName] = useState('');

  const handleAddAdmin = async (e) => {
    e.preventDefault();
    if (!newAdminName || !newAdminEmail) return;
    // For now we don't have a real POST /users endpoint implemented for Superadmin, so just alert
    alert('Penambahan admin masih dalam tahap pengembangan API');
    setShowAddModal(false);
    setNewAdminName('');
    setNewAdminEmail('');
  };

  const handleDeleteUser = async (id) => {
    // We would call DELETE /users/:id here
    alert('Penghapusan user melalui dashboard masih dalam tahap pengembangan');
  };

  const handleEditUser = (user) => {
    setEditUserId(user.id);
    setEditUserName(user.fullName);
    setEditUserRole(user.role);
    setShowEditModal(true);
  };

  const submitEditRole = async (e) => {
    e.preventDefault();
    const res = await updateUserRole(editUserId, editUserRole);
    if (res && res.success) {
      setShowEditModal(false);
    }
  };

  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');

  const filteredUsers = users.filter(u => {
    const matchesSearch = 
      u.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === 'ALL' || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

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
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-4 pb-2 border-b border-gray-100 dark:border-obsidian-border">
              <h3 className="text-base font-extrabold flex items-center gap-2">
                <Users className="w-4 h-4 text-gold" />
                Daftar Pengguna Sistem (RBAC)
              </h3>
              
              <div className="flex gap-2 w-full md:w-auto">
                <input
                  type="text"
                  placeholder="Cari nama atau email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full md:w-64 px-4 py-2 rounded-xl text-xs bg-gray-50 dark:bg-obsidian-surface border border-gray-200 dark:border-obsidian-border focus:outline-none focus:border-gold transition-colors"
                />
                <select
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                  className="px-4 py-2 rounded-xl text-xs bg-gray-50 dark:bg-obsidian-surface border border-gray-200 dark:border-obsidian-border focus:outline-none focus:border-gold font-semibold transition-colors"
                >
                  <option value="ALL">Semua Role</option>
                  <option value="SUPERADMIN">Superadmin</option>
                  <option value="ADMIN">Admin</option>
                  <option value="CUSTOMER">Customer</option>
                </select>
              </div>
            </div>

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
                  {filteredUsers.length > 0 ? filteredUsers.map((u) => (
                    <tr key={u.id} className="hover:bg-gray-50 dark:hover:bg-obsidian-surface transition-colors">
                      <td className="py-3.5 font-bold text-gray-900 dark:text-white">{u.fullName}</td>
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
                      <td className="py-3.5 text-right flex justify-end gap-1">
                        {isSuperadmin && (
                          <button
                            onClick={() => handleEditUser(u)}
                            className="p-1.5 rounded-lg text-gray-400 hover:text-gold hover:bg-gold/10 transition-colors"
                            title="Edit Data/Role Pengguna"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                        )}
                        {u.id !== currentUser.id && isSuperadmin && (
                          <button
                            onClick={() => handleDeleteUser(u.id)}
                            className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
                            title="Hapus Pengguna"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan="4" className="py-8 text-center text-gray-500 font-bold">Tidak ada pengguna yang sesuai dengan filter.</td>
                    </tr>
                  )}
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
                      <td className="py-3">
                        <div className="flex items-center gap-2">
                          {log.userAvatarUrl ? (
                            <img src={getImageUrl(log.userAvatarUrl, 'users')} alt="Avatar" className="w-6 h-6 rounded-full object-cover" />
                          ) : (
                            <div className="w-6 h-6 rounded-full bg-gray-200 dark:bg-obsidian border border-gray-300 dark:border-obsidian-border flex items-center justify-center">
                              <User className="w-3 h-3 text-gray-400" />
                            </div>
                          )}
                          <div>
                            <div className="font-bold">{log.userName}</div>
                            <span className="block text-[10px] text-gold">{log.userRole}</span>
                          </div>
                        </div>
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

      {/* Edit Role Modal */}
      {showEditModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-obsidian-card p-6 rounded-3xl border border-gray-200 dark:border-obsidian-border max-w-sm w-full shadow-2xl animate-scaleIn">
            <h3 className="font-extrabold text-base mb-4">Ubah Role Pengguna</h3>
            <p className="text-xs text-gray-50 mb-4">
              Ubah hak akses untuk <strong className="text-gray-900 dark:text-white">{editUserName}</strong>.
            </p>
            
            <form onSubmit={submitEditRole} className="space-y-4">
              <div>
                <label className="block text-xs font-bold mb-2">Role Baru</label>
                <select
                  value={editUserRole}
                  onChange={(e) => setEditUserRole(e.target.value)}
                  className="w-full p-2.5 rounded-xl text-xs bg-gray-50 dark:bg-obsidian-surface border border-gray-200 dark:border-obsidian-border focus:outline-none focus:border-gold"
                >
                  <option value="CUSTOMER">CUSTOMER</option>
                  <option value="ADMIN">ADMIN</option>
                  <option value="SUPERADMIN">SUPERADMIN</option>
                </select>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="flex-1 py-2.5 rounded-xl border border-gray-200 dark:border-obsidian-border text-xs font-bold hover:bg-gray-50 dark:hover:bg-obsidian-surface transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl gold-gradient-btn text-obsidian text-xs font-extrabold shadow-gold-glow"
                >
                  Simpan Role
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
