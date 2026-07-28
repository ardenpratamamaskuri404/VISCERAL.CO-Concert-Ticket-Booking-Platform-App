import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import Navbar from '../components/Navbar';
import { ArrowLeft, Clock, ShieldCheck, Ticket, Check, Zap } from 'lucide-react';

export default function SeatMapPage() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const selectedCatId = searchParams.get('category');
  const navigate = useNavigate();

  const { events, createOrder } = useStore();
  const event = events.find((e) => e.id === id) || events[0];

  const category = event.categories.find((c) => c.id === selectedCatId) || event.categories[0];

  // Generate interactive 30 seats per category grid
  const [seats, setSeats] = useState(() => {
    const arr = [];
    const rows = ['A', 'B', 'C', 'D', 'E'];
    let count = 1;
    rows.forEach((row) => {
      for (let i = 1; i <= 6; i++) {
        const seatNum = `${category.name.substring(0, 3)}-${row}${i < 10 ? '0' + i : i}`;
        // Give some initial SOLD and AVAILABLE seats
        const isSold = count === 3 || count === 7 || count === 14;
        arr.push({
          id: `seat-${count}`,
          seatNumber: seatNum,
          status: isSold ? 'SOLD' : 'AVAILABLE'
        });
        count++;
      }
    });
    return arr;
  });

  const [selectedSeat, setSelectedSeat] = useState(null);
  const [lockTimer, setLockTimer] = useState(600); // 10 minutes in seconds

  useEffect(() => {
    let interval;
    if (selectedSeat && lockTimer > 0) {
      interval = setInterval(() => setLockTimer((prev) => prev - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [selectedSeat, lockTimer]);

  const handleSeatClick = (seat) => {
    if (seat.status === 'SOLD') return;
    if (selectedSeat?.id === seat.id) {
      setSelectedSeat(null);
    } else {
      setSelectedSeat(seat);
      setLockTimer(600); // Reset 10 minutes lock timer
    }
  };

  const handleProceedToCheckout = () => {
    if (!selectedSeat) return;

    const orderData = {
      eventId: event.id,
      eventTitle: event.title,
      totalAmount: category.price,
      tickets: [
        {
          id: `tkt-${Date.now()}`,
          ticketCode: `VSC-TK-${selectedSeat.seatNumber}`,
          seatNumber: selectedSeat.seatNumber,
          categoryName: category.name,
          price: category.price,
          status: 'ACTIVE'
        }
      ]
    };

    const newOrder = createOrder(orderData);
    navigate(`/checkout/${newOrder.id}`);
  };

  const formatTimer = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m < 10 ? '0' + m : m}:${s < 10 ? '0' + s : s}`;
  };

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

        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Main Stage & Seat Grid Area */}
          <div className="flex-1 bg-white dark:bg-obsidian-card p-6 md:p-8 rounded-3xl border border-gray-200 dark:border-obsidian-border shadow-obsidian-glow">
            
            <div className="text-center mb-8">
              <span className="text-[10px] font-bold text-gold uppercase tracking-widest block">Denah Kursi Real-Time</span>
              <h1 className="text-2xl font-extrabold">{event.title}</h1>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                Kategori: <strong className="text-gold font-bold">{category.name}</strong> (Rp {category.price.toLocaleString('id-ID')})
              </p>
            </div>

            {/* Stage Bar */}
            <div className="w-full py-3 mb-10 rounded-2xl bg-gradient-to-r from-oxblood via-gold to-oxblood text-obsidian text-center font-extrabold text-xs uppercase tracking-widest shadow-gold-glow">
              ★ PANGGUNG UTAMA / STAGE ★
            </div>

            {/* Seat Map Legend */}
            <div className="flex flex-wrap justify-center gap-6 mb-8 text-xs font-medium">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-lg bg-gray-100 dark:bg-obsidian-surface border border-gray-300 dark:border-obsidian-border"></div>
                <span>Tersedia (Available)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-lg bg-gold text-obsidian font-bold flex items-center justify-center text-[10px]">✓</div>
                <span>Pilihanmu (Locked)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-lg bg-oxblood/40 text-oxblood border border-oxblood/60 cursor-not-allowed"></div>
                <span>Terjual (Sold)</span>
              </div>
            </div>

            {/* Seat Grid */}
            <div className="grid grid-cols-6 gap-3 max-w-md mx-auto">
              {seats.map((seat) => {
                const isSelected = selectedSeat?.id === seat.id;
                const isSold = seat.status === 'SOLD';

                return (
                  <button
                    key={seat.id}
                    disabled={isSold}
                    onClick={() => handleSeatClick(seat)}
                    className={`py-3 rounded-2xl text-xs font-bold transition-all flex flex-col items-center justify-center gap-0.5 ${
                      isSold
                        ? 'bg-oxblood/20 text-oxblood border border-oxblood/40 cursor-not-allowed opacity-60'
                        : isSelected
                        ? 'bg-gold text-obsidian border-2 border-gold shadow-gold-glow scale-105 font-extrabold'
                        : 'bg-gray-100 dark:bg-obsidian-surface text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-obsidian-border hover:border-gold hover:scale-105'
                    }`}
                  >
                    <span className="text-[10px]">{seat.seatNumber}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right Summary Panel */}
          <div className="w-full lg:w-80 space-y-6">
            <div className="bg-white dark:bg-obsidian-card p-6 rounded-3xl border border-gray-200 dark:border-obsidian-border shadow-obsidian-glow sticky top-24">
              <h3 className="text-base font-extrabold mb-4 pb-2 border-b border-gray-200 dark:border-obsidian-border">
                Ringkasan Kursi
              </h3>

              {selectedSeat ? (
                <div className="space-y-4">
                  <div className="p-4 rounded-2xl bg-gold/10 border border-gold/30">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-xs text-gray-500 dark:text-gray-400">Nomor Kursi:</span>
                      <span className="text-sm font-extrabold text-gold">{selectedSeat.seatNumber}</span>
                    </div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-xs text-gray-500 dark:text-gray-400">Kategori:</span>
                      <span className="text-xs font-bold">{category.name}</span>
                    </div>
                    <div className="flex justify-between items-center pt-2 border-t border-gold/20">
                      <span className="text-xs text-gray-500 dark:text-gray-400">Harga Tiket:</span>
                      <span className="text-sm font-extrabold text-gold">
                        Rp {category.price.toLocaleString('id-ID')}
                      </span>
                    </div>
                  </div>

                  {/* Seat Locking Countdown Timer */}
                  <div className="p-3 rounded-2xl bg-oxblood/10 border border-oxblood/30 flex items-center justify-between text-xs">
                    <span className="text-oxblood font-medium flex items-center gap-1.5">
                      <Clock className="w-4 h-4 animate-spin" />
                      Locking Kursi:
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
                  <p className="text-xs">Klik salah satu nomor kursi pada denah untuk memilih.</p>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
