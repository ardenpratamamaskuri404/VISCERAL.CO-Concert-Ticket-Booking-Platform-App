import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import AdminSidebar from '../components/AdminSidebar';
import AdminTopbar from '../components/AdminTopbar';
import { Plus, X, Sparkles, UserPlus, Pencil, Trash2 } from 'lucide-react';
import { getImageUrl } from '../utils/image';

export default function AdminArtistsPage() {
  const { artists, createArtist, updateArtist, deleteArtist } = useStore();

  const [modalOpen, setModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Form states for Artist creation
  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [photoFile, setPhotoFile] = useState(null);

  const openCreateModal = () => {
    setIsEditing(false);
    setEditingId(null);
    setName('');
    setBio('');
    setPhotoFile(null);
    setModalOpen(true);
  };

  const openEditModal = (art) => {
    setIsEditing(true);
    setEditingId(art.id);
    setName(art.name);
    setBio(art.bio || '');
    setPhotoFile(null);
    setModalOpen(true);
  };

  const handleSubmitArtist = async (e) => {
    e.preventDefault();
    if (!name) return;
    
    const formData = new FormData();
    formData.append('name', name);
    formData.append('bio', bio);
    
    if (photoFile) {
      formData.append('photoFile', photoFile);
    }

    let res;
    if (isEditing) {
      res = await updateArtist(editingId, formData);
    } else {
      res = await createArtist(formData);
    }
    
    if (res && res.success) {
      setModalOpen(false);
      setName('');
      setBio('');
      setPhotoFile(null);
    }
  };

  const filteredArtists = artists.filter(art => 
    art.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    (art.bio && art.bio.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-brand-bgLight dark:bg-obsidian-dark flex transition-colors">
      <AdminSidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <AdminTopbar title="Kelola Data Artis" />

        <main className="p-6 md:p-8 space-y-8 overflow-y-auto">
          
          {/* Top Bar Action Buttons */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h2 className="text-xl font-extrabold tracking-tight">Manajemen Artis</h2>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Kelola daftar artis dan musisi yang tampil di berbagai konser.
              </p>
            </div>

            <button
              onClick={openCreateModal}
              className="px-5 py-2.5 rounded-xl bg-obsidian text-white border border-gold/40 hover:text-gold text-xs font-extrabold flex items-center gap-2 shadow-sm transition-all"
            >
              <UserPlus className="w-4 h-4" />
              Tambah Artis Baru
            </button>
          </div>

          {/* Table Container */}
          <div className="bg-white dark:bg-obsidian-card rounded-3xl border border-gray-200 dark:border-obsidian-border p-6 shadow-sm">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4 pb-2 border-b border-gray-100 dark:border-obsidian-border">
              <h3 className="text-base font-extrabold flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-gold" />
                Daftar Artis & Penyanyi Terdaftar
              </h3>
              
              {/* Search Filter */}
              <input
                type="text"
                placeholder="Cari nama artis atau deskripsi..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full sm:w-64 px-4 py-2 rounded-xl text-xs bg-gray-50 dark:bg-obsidian-surface border border-gray-200 dark:border-obsidian-border focus:outline-none focus:border-gold transition-colors"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              {filteredArtists.length > 0 ? filteredArtists.map((art) => (
                <div key={art.id} className="p-4 rounded-2xl bg-gray-50 dark:bg-obsidian-surface border border-gray-200 dark:border-obsidian-border flex items-center gap-3 transition-transform hover:-translate-y-1 relative group">
                  <img src={getImageUrl(art.photoUrl, 'artists')} alt={art.name} className="w-12 h-12 rounded-full object-cover border-2 border-gold/40" />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-xs text-gray-900 dark:text-white truncate">{art.name}</h4>
                    <p className="text-[10px] text-gray-500 line-clamp-2">{art.bio}</p>
                  </div>
                    <div className="absolute top-2 right-2 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => openEditModal(art)}
                        className="p-1.5 rounded-md bg-gold/10 text-gold hover:bg-gold hover:text-obsidian transition-colors"
                        title="Edit Artis"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => {
                          if (window.confirm('Yakin ingin menghapus artis ini?')) {
                            deleteArtist(art.id);
                          }
                        }}
                        className="p-1.5 rounded-md bg-oxblood/10 text-oxblood hover:bg-oxblood hover:text-white transition-colors"
                        title="Hapus Artis"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                </div>
              )) : (
                <div className="col-span-full py-10 text-center text-gray-500 dark:text-gray-400">
                  <p className="text-sm font-bold">Tidak ada artis ditemukan</p>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>

      {/* Modal Create Artist */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-obsidian-card p-6 rounded-3xl border border-gray-200 dark:border-obsidian-border max-w-md w-full shadow-2xl animate-scaleIn">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-extrabold text-base">{isEditing ? 'Edit Artis' : 'Buat Artis Baru'}</h3>
              <button onClick={() => setModalOpen(false)} className="text-gray-400 hover:text-white transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitArtist} className="space-y-3">
              <div>
                <label className="block text-xs font-bold mb-1">Nama Artis</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="MISAL: Tulus"
                  className="w-full p-2.5 rounded-xl text-xs bg-gray-50 dark:bg-obsidian-surface border border-gray-200 dark:border-obsidian-border focus:outline-none focus:border-gold"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold mb-1">Foto Artis</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setPhotoFile(e.target.files[0])}
                  className="w-full p-2.5 rounded-xl text-xs bg-gray-50 dark:bg-obsidian-surface border border-gray-200 dark:border-obsidian-border focus:outline-none focus:border-gold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold mb-1">Biografi Singkat</label>
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Penyanyi dan penulis lagu..."
                  className="w-full p-2.5 rounded-xl text-xs bg-gray-50 dark:bg-obsidian-surface border border-gray-200 dark:border-obsidian-border h-24 focus:outline-none focus:border-gold"
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl gold-gradient-btn text-obsidian font-extrabold text-xs shadow-gold-glow mt-4"
              >
                {isEditing ? 'Simpan Perubahan' : 'Simpan & Publish Artis'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
