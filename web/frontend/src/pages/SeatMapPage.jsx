import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import Navbar from '../components/Navbar';
import { ArrowLeft, Clock, Ticket, AlertTriangle, Plus, Minus } from 'lucide-react';

export default function SeatMapPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const selectedCatId = searchParams.get('category');
  const { currentUser, events } = useStore();

  useEffect(() => {
    if (!currentUser) {
      navigate('/login');
    }
  }, [currentUser, navigate]);

  const event = events.find((e) => e.id === id) || events[0];
  const category = event.categories?.find((c) => c.id === selectedCatId) || event.categories?.[0];

  const isStandingCat = (() => {
    if (!category) return false;
    const n = category.name.toLowerCase();
    return n.includes('standing') || n.includes('festival') || n.includes('general') || n.includes('presale') || n.includes('pass') || n.includes('ga');
  })();
  const requiresSeat = event.isSeated && !isStandingCat;

  const [seats, setSeats] = useState(category?.seats || []);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [standingQty, setStandingQty] = useState(1);
  const [lockTimer, setLockTimer] = useState(600); // 10 minutes

  // For seating events, we allow multiple seat selection (max 5)
  const handleSeatClick = (seat) => {
    if (seat.status !== 'AVAILABLE') return;
    
    setSelectedSeats(prev => {
      const isSelected = prev.find(s => s.id === seat.id);
      if (isSelected) {
        return prev.filter(s => s.id !== seat.id);
      } else {
        if (prev.length >= 5) {
          alert('Maksimal 5 kursi per pesanan');
          return prev;
        }
        return [...prev, seat];
      }
    });
    setLockTimer(600);
  };

  useEffect(() => {
    let interval;
    if ((selectedSeats.length > 0 || (standingQty > 0 && !requiresSeat)) && lockTimer > 0) {
      interval = setInterval(() => setLockTimer((prev) => prev - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [selectedSeats, standingQty, requiresSeat, lockTimer]);

  const handleProceedToCheckout = () => {
    let orderTickets = [];
    
    const isEarlyBirdActive = (cat) => {
      if (!cat.earlyBirdPrice || !cat.earlyBirdStartDate || !cat.earlyBirdEndDate) return false;
      const now = new Date();
      const start = new Date(cat.earlyBirdStartDate);
      const end = new Date(cat.earlyBirdEndDate);
      return now >= start && now <= end;
    };
    
    const activePrice = isEarlyBirdActive(category) ? Number(category.earlyBirdPrice) : Number(category.price);

    if (requiresSeat) {
      if (selectedSeats.length === 0) return;
      selectedSeats.forEach(s => orderTickets.push({
        categoryId: category.id,
        seatNumber: s.seatNumber,
        categoryName: category.name,
        price: activePrice
      }));
    } else {
      if (standingQty < 1 || standingQty > 5) return;
      // generate array of dummy tickets for checkout payload
      for (let i = 0; i < standingQty; i++) {
        orderTickets.push({
          categoryId: category.id,
          seatNumber: 'STANDING',
          categoryName: category.name,
          price: activePrice
        });
      }
    }

    const orderData = {
      eventId: event.id,
      eventTitle: event.title,
      totalAmount: activePrice * orderTickets.length,
      tickets: orderTickets
    };

    navigate(`/checkout`, { state: { orderData } });
  };

  const formatTimer = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m < 10 ? '0' + m : m}:${s < 10 ? '0' + s : s}`;
  };

  if (!category) return <div className="pt-32 text-center">Kategori tidak ditemukan</div>;

  const isEarlyBird = () => {
    if (!category.earlyBirdPrice || !category.earlyBirdStartDate || !category.earlyBirdEndDate) return false;
    const now = new Date();
    const start = new Date(category.earlyBirdStartDate);
    const end = new Date(category.earlyBirdEndDate);
    return now >= start && now <= end;
  };
  const currentPrice = isEarlyBird() ? Number(category.earlyBirdPrice) : Number(category.price);

  const totalSelection = requiresSeat ? selectedSeats.length : standingQty;
  const totalPrice = totalSelection * currentPrice;

  return (
    <div className="min-h-screen bg-brand-bgLight dark:bg-obsidian-dark text-brand-darkText dark:text-brand-lightText transition-colors">
      <Navbar />

      <div className="pt-28 pb-16 px-4 md:px-8 max-w-6xl mx-auto">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-500 hover:text-gold mb-6"
        >
          <ArrowLeft className="w-4 h-4" /> Kembali ke Detail Event
        </button>

        {category.isSalesClosed ? (
          <div className="bg-red-50 dark:bg-red-900/20 text-red-600 border border-red-200 dark:border-red-800 p-4 rounded-xl flex items-center justify-center gap-2 mb-8 font-bold">
            <AlertTriangle className="w-5 h-5" />
            Penjualan tiket kategori ini telah ditutup atau kedaluwarsa.
          </div>
        ) : category.availableSeats === 0 ? (
          <div className="bg-gray-100 dark:bg-obsidian-card text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-obsidian-border p-4 rounded-xl flex items-center justify-center gap-2 mb-8 font-bold">
            <Ticket className="w-5 h-5" />
            Tiket Sold Out!
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Main Area */}
            <div className="flex-1 bg-white dark:bg-obsidian-card p-6 md:p-8 rounded-3xl border border-gray-200 dark:border-obsidian-border shadow-obsidian-glow">
              <div className="text-center mb-8">
                <span className="text-[10px] font-bold text-gold uppercase tracking-widest block">Denah / Area</span>
                <h1 className="text-2xl font-extrabold">{event.title}</h1>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 flex items-center justify-center gap-2">
                  Kategori: <strong className="text-gold font-bold">{category.name}</strong>
                  {isEarlyBird() && (
                    <span className="animate-pulse bg-gold/20 text-gold border border-gold px-2 py-0.5 rounded text-[9px] uppercase tracking-widest font-black">
                      🔥 Early Bird
                    </span>
                  )}
                  <span>
                    (Rp {currentPrice.toLocaleString('id-ID')})
                  </span>
                </p>
                {!requiresSeat && (
                  <p className="text-xs text-gold mt-1 font-bold">Sisa Kuota: {category.availableSeats} Tiket</p>
                )}
              </div>

              {!requiresSeat ? (
                <div className="flex flex-col items-center justify-center py-10 space-y-8">
                  <div className="w-full h-32 rounded-2xl bg-gradient-to-t from-gray-200 to-gray-100 dark:from-obsidian-surface dark:to-obsidian-card border border-gray-300 dark:border-obsidian-border flex items-center justify-center overflow-hidden relative">
                     <div className="absolute inset-0 opacity-10 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-gold via-transparent to-transparent"></div>
                     <div className="z-10 text-center">
                       <span className="text-xl font-extrabold tracking-widest opacity-80">STANDING AREA</span>
                       <p className="text-xs mt-1 text-gray-500">Bebas memilih tempat berdiri di area ini</p>
                     </div>
                  </div>
                  
                  <div className="flex flex-col items-center gap-4">
                    <span className="text-sm font-bold">Pilih Jumlah Tiket (Maks 5)</span>
                    <div className="flex items-center gap-6 bg-gray-100 dark:bg-obsidian-surface p-2 rounded-2xl">
                      <button 
                        onClick={() => setStandingQty(q => Math.max(1, q - 1))}
                        className="w-10 h-10 rounded-xl bg-white dark:bg-obsidian-card text-gray-700 dark:text-white flex items-center justify-center shadow hover:text-gold"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="text-2xl font-extrabold w-8 text-center">{standingQty}</span>
                      <button 
                        onClick={() => setStandingQty(q => Math.min(5, Math.min(category.availableSeats, q + 1)))}
                        className="w-10 h-10 rounded-xl bg-white dark:bg-obsidian-card text-gray-700 dark:text-white flex items-center justify-center shadow hover:text-gold"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  <div className="w-full py-3 mb-10 rounded-2xl bg-gradient-to-r from-oxblood via-gold to-oxblood text-obsidian text-center font-extrabold text-xs uppercase tracking-widest shadow-gold-glow">
                    ★ PANGGUNG UTAMA / STAGE ★
                  </div>

                  <div className="flex flex-wrap justify-center gap-6 mb-8 text-xs font-medium">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded-lg bg-gray-100 dark:bg-obsidian-surface border border-gray-300 dark:border-obsidian-border"></div>
                      <span>Tersedia</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded-lg bg-gold text-obsidian font-bold flex items-center justify-center text-[10px]">✓</div>
                      <span>Pilihanmu</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded-lg bg-oxblood/40 text-oxblood border border-oxblood/60 cursor-not-allowed"></div>
                      <span>Terjual/Locked</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-10 gap-2 max-w-xl mx-auto">
                    {seats.map((seat) => {
                      const isSelected = selectedSeats.find(s => s.id === seat.id);
                      const isSold = seat.status !== 'AVAILABLE';

                      return (
                        <button
                          key={seat.id}
                          disabled={isSold}
                          onClick={() => handleSeatClick(seat)}
                          className={`py-2 rounded-xl text-[10px] font-bold transition-all flex items-center justify-center ${
                            isSold
                              ? 'bg-oxblood/20 text-oxblood border border-oxblood/40 cursor-not-allowed opacity-60'
                              : isSelected
                              ? 'bg-gold text-obsidian border-2 border-gold shadow-gold-glow scale-105 font-extrabold'
                              : 'bg-gray-100 dark:bg-obsidian-surface text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-obsidian-border hover:border-gold hover:scale-110'
                          }`}
                        >
                          {seat.seatNumber}
                        </button>
                      );
                    })}
                  </div>
                </>
              )}
            </div>

            {/* Right Summary Panel */}
            <div className="w-full lg:w-80 space-y-6">
              <div className="bg-white dark:bg-obsidian-card p-6 rounded-3xl border border-gray-200 dark:border-obsidian-border shadow-obsidian-glow sticky top-24">
                <h3 className="text-base font-extrabold mb-4 pb-2 border-b border-gray-200 dark:border-obsidian-border">
                  Ringkasan Pesanan
                </h3>

                {(requiresSeat ? selectedSeats.length > 0 : standingQty > 0) ? (
                  <div className="space-y-4">
                    <div className="p-4 rounded-2xl bg-gold/10 border border-gold/30">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-xs text-gray-500 dark:text-gray-400">Total Tiket:</span>
                        <span className="text-sm font-extrabold text-gold">{totalSelection}</span>
                      </div>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-xs text-gray-500 dark:text-gray-400">Kategori:</span>
                        <span className="text-xs font-bold">{category.name}</span>
                      </div>
                      {requiresSeat && (
                        <div className="flex justify-between items-start mt-2 pt-2 border-t border-gold/20">
                          <span className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Kursi:</span>
                          <div className="flex flex-wrap gap-1 justify-end flex-1 ml-4">
                            {selectedSeats.map(s => (
                              <span key={s.id} className="text-[10px] font-bold bg-gold text-obsidian px-1.5 py-0.5 rounded">{s.seatNumber}</span>
                            ))}
                          </div>
                        </div>
                      )}
                      <div className="flex justify-between items-center pt-3 mt-3 border-t border-gold/20">
                        <span className="text-xs text-gray-500 dark:text-gray-400">Total Harga:</span>
                        <span className="text-lg font-extrabold text-gold">
                          Rp {totalPrice.toLocaleString('id-ID')}
                        </span>
                      </div>
                    </div>

                    <div className="p-3 rounded-2xl bg-oxblood/10 border border-oxblood/30 flex items-center justify-between text-xs">
                      <span className="text-oxblood font-medium flex items-center gap-1.5">
                        <Clock className="w-4 h-4 animate-spin" />
                        Batas Waktu:
                      </span>
                      <span className="font-extrabold text-oxblood text-sm">
                        {formatTimer(lockTimer)}
                      </span>
                    </div>

                    <button
                      onClick={handleProceedToCheckout}
                      className="w-full py-3.5 rounded-xl gold-gradient-btn text-obsidian font-extrabold text-xs flex items-center justify-center gap-2 shadow-gold-glow"
                    >
                      Lanjut Ke Pembayaran
                    </button>
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-400">
                    <Ticket className="w-10 h-10 mx-auto mb-2 opacity-40" />
                    <p className="text-xs">
                      {event.isSeated ? 'Klik kursi pada denah untuk memilih.' : 'Pilih jumlah tiket.'}
                    </p>
                  </div>
                )}
              </div>
            </div>

          </div>
        )}
      </div>
    </div>
  );
}
