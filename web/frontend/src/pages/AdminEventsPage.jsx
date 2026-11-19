import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import AdminSidebar from '../components/AdminSidebar';
import AdminTopbar from '../components/AdminTopbar';
import { Plus } from 'lucide-react';
import AdminEventsTable from '../components/AdminEventsTable';
import AdminEventModal from '../components/AdminEventModal';

export default function AdminEventsPage() {
  const { artists, createEvent, updateEvent } = useStore();

  const [modalOpen, setModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);

  // Form states for Event creation
  const [title, setTitle] = useState('');
  const [venue, setVenue] = useState('');
  const [description, setDescription] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [bannerFile, setBannerFile] = useState(null);
  const [selectedArtistIds, setSelectedArtistIds] = useState([]);

  const [categories, setCategories] = useState([
    { name: 'FESTIVAL', price: 500000, totalSeats: 200, earlyBirdPrice: '', earlyBirdStartDate: '', earlyBirdEndDate: '' }
  ]);

  const toggleArtistSelection = (artistId) => {
    setSelectedArtistIds((prev) =>
      prev.includes(artistId) ? prev.filter((id) => id !== artistId) : [...prev, artistId]
    );
  };

  const resetForm = () => {
    setTitle('');
    setVenue('');
    setDescription('');
    setEventDate('');
    setBannerFile(null);
    setSelectedArtistIds([]);
    setSelectedEvent(null);
    setCategories([{ name: 'FESTIVAL', price: 500000, totalSeats: 200, earlyBirdPrice: '', earlyBirdStartDate: '', earlyBirdEndDate: '' }]);
  };

  const handleOpenCreateModal = () => {
    resetForm();
    setModalOpen(true);
  };

  const handleCategoryChange = (index, field, value) => {
    const newCategories = [...categories];
    newCategories[index][field] = value;
    setCategories(newCategories);
  };

  const addCategory = () => {
    setCategories([...categories, { name: '', price: '', totalSeats: '', earlyBirdPrice: '', earlyBirdStartDate: '', earlyBirdEndDate: '' }]);
  };

  const removeCategory = (index) => {
    if (categories.length <= 1) return;
    setCategories(categories.filter((_, idx) => idx !== index));
  };

  const handleCreateEvent = async (e) => {
    e.preventDefault();
    if (!title || !venue || categories.length === 0) return;
    
    // Inject dynamic categories for the API
    const formattedCategories = categories.map(cat => ({
      name: cat.name,
      price: Number(cat.price) || 0,
      totalSeats: Number(cat.totalSeats) || 0,
      earlyBirdPrice: cat.earlyBirdPrice ? Number(cat.earlyBirdPrice) : null,
      earlyBirdStartDate: cat.earlyBirdStartDate ? cat.earlyBirdStartDate : null,
      earlyBirdEndDate: cat.earlyBirdEndDate ? cat.earlyBirdEndDate : null,
    }));

    const formData = new FormData();
    formData.append('title', title);
    formData.append('venueName', venue);
    formData.append('description', description || 'Konser spektakuler');
    formData.append('eventDate', eventDate || new Date().toISOString());
    formData.append('isSeated', 'true');
    formData.append('categories', JSON.stringify(formattedCategories));
    formData.append('artistIds', JSON.stringify(selectedArtistIds));
    
    if (bannerFile) {
      formData.append('bannerFile', bannerFile);
    }

    const res = await createEvent(formData);
    
    if (res && res.success) {
      setModalOpen(false);
      resetForm();
    }
  };

  const handleEditClick = (ev) => {
    setSelectedEvent(ev);
    setTitle(ev.title);
    setVenue(ev.venueName);
    setDescription(ev.description || '');
    const dt = new Date(ev.eventDate);
    const localIso = new Date(dt.getTime() - dt.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
    setEventDate(localIso);
    setSelectedArtistIds(ev.artists?.map((ea) => ea.artistId) || []);
    setBannerFile(null);
    setEditModalOpen(true);
  };

  const handleUpdateEvent = async (e) => {
    e.preventDefault();
    if (!selectedEvent) return;
    
    const formData = new FormData();
    formData.append('title', title);
    formData.append('venueName', venue);
    formData.append('description', description);
    formData.append('eventDate', eventDate || new Date().toISOString());
    formData.append('artistIds', JSON.stringify(selectedArtistIds));
    
    if (bannerFile) {
      formData.append('bannerFile', bannerFile);
    }

    const res = await updateEvent(selectedEvent.id, formData);
    
    if (res && res.success) {
      setEditModalOpen(false);
      resetForm();
    }
  };

  return (
    <div className="min-h-screen bg-brand-bgLight dark:bg-obsidian-dark flex transition-colors">
      <AdminSidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <AdminTopbar title="Kelola Event Konser" />

        <main className="p-6 md:p-8 space-y-8 overflow-y-auto">
          
          {/* Top Bar Action Buttons */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h2 className="text-xl font-extrabold tracking-tight">Manajemen Event</h2>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Kelola konser, kategori tiket & kuota, serta penutupan penjualan.
              </p>
            </div>

            <button
              onClick={handleOpenCreateModal}
              className="px-5 py-2.5 rounded-xl gold-gradient-btn text-obsidian text-xs font-extrabold flex items-center gap-2 shadow-gold-glow"
            >
              <Plus className="w-4 h-4" />
              Buat Event Baru
            </button>
          </div>

          {/* Table Container */}
          <AdminEventsTable handleEditClick={handleEditClick} />
        </main>
      </div>

      <AdminEventModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        isEditMode={false}
        title={title} setTitle={setTitle}
        venue={venue} setVenue={setVenue}
        eventDate={eventDate} setEventDate={setEventDate}
        description={description} setDescription={setDescription}
        bannerFile={bannerFile} setBannerFile={setBannerFile}
        categories={categories} setCategories={setCategories}
        artistsList={artists}
        selectedArtistIds={selectedArtistIds}
        toggleArtistSelection={toggleArtistSelection}
        handleCategoryChange={handleCategoryChange}
        addCategory={addCategory}
        removeCategory={removeCategory}
        handleSubmit={handleCreateEvent}
      />

      <AdminEventModal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        isEditMode={true}
        title={title} setTitle={setTitle}
        venue={venue} setVenue={setVenue}
        eventDate={eventDate} setEventDate={setEventDate}
        description={description} setDescription={setDescription}
        bannerFile={bannerFile} setBannerFile={setBannerFile}
        categories={categories} setCategories={setCategories}
        artistsList={artists}
        selectedArtistIds={selectedArtistIds}
        toggleArtistSelection={toggleArtistSelection}
        handleSubmit={handleUpdateEvent}
      />
    </div>
  );
}