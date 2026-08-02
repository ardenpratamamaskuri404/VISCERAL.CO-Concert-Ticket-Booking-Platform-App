import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import AdminSidebar from '../components/AdminSidebar';
import AdminTopbar from '../components/AdminTopbar';
import { Plus } from 'lucide-react';
import AdminEventsTable from '../components/AdminEventsTable';
import AdminEventModal from '../components/AdminEventModal';

export default function AdminEventsPage() {
  const { events, toggleSalesClosed, createEvent, updateEvent } = useStore();

  const [modalOpen, setModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);

  // Form states for Event creation
  const [title, setTitle] = useState('');
  const [venue, setVenue] = useState('');
  const [description, setDescription] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [bannerFile, setBannerFile] = useState(null);

  const [categories, setCategories] = useState([
    { name: 'FESTIVAL', price: 500000, totalSeats: 200, earlyBirdPrice: '', earlyBirdStartDate: '', earlyBirdEndDate: '' }
  ]);

  const handleCategoryChange = (index, field, value) => {
    const newCategories = [...categories];
    newCategories[index][field] = value;
    setCategories(newCategories);
  };

  const addCategory = () => {
    setCategories([...categories, { name: '', price: '', totalSeats: '', earlyBirdPrice: '', earlyBirdStartDate: '', earlyBirdEndDate: '' }]);
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
    
    if (bannerFile) {
      formData.append('bannerFile', bannerFile);
    }

    const res = await createEvent(formData);
    
    if (res && res.success) {
      setModalOpen(false);
      setTitle('');
      setVenue('');
      setDescription('');
      setEventDate('');
      setBannerFile(null);
      setCategories([{ name: 'FESTIVAL', price: 500000, totalSeats: 200, earlyBirdPrice: '', earlyBirdStartDate: '', earlyBirdEndDate: '' }]);
    }
  };

  const handleEditClick = (ev) => {
    setSelectedEvent(ev);
    setTitle(ev.title);
    setVenue(ev.venueName);
    setDescription(ev.description || '');
    setEventDate(ev.eventDate.split('T')[0]); // simplified date
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
    
    if (bannerFile) {
      formData.append('bannerFile', bannerFile);
    }

    const res = await updateEvent(selectedEvent.id, formData);
    
    if (res && res.success) {
      setEditModalOpen(false);
      setTitle('');
      setVenue('');
      setDescription('');
      setEventDate('');
      setBannerFile(null);
      setSelectedEvent(null);
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
              onClick={() => setModalOpen(true)}
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
        handleCategoryChange={handleCategoryChange}
        addCategory={addCategory}
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
        handleSubmit={handleUpdateEvent}
      />
    </div>
  );
}