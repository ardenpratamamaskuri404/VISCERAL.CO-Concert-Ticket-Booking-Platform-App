import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import Navbar from '../components/Navbar';
import CheckoutPaymentMethods from '../components/CheckoutPaymentMethods';
import CheckoutSummary from '../components/CheckoutSummary';
import { AlertTriangle, X, ArrowLeft } from 'lucide-react';

export default function CheckoutPage() {
  const { currentUser, createOrder } = useStore();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (!currentUser) {
      navigate('/login');
    }
  }, [currentUser, navigate]);

  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('MANDIRI_VA');
  const [isVADropdownOpen, setIsVADropdownOpen] = useState(true);
  const [errorModal, setErrorModal] = useState(null);

  const orderData = location.state?.orderData;

  if (!orderData) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center px-4 bg-brand-bgLight dark:bg-obsidian-dark text-brand-darkText dark:text-brand-lightText">
        <h2 className="text-xl font-bold mb-4">Pesanan Tidak Ditemukan</h2>
        <button onClick={() => navigate('/explore')} className="text-gold underline">
          Kembali ke Explore
        </button>
      </div>
    );
  }

  const handleProceed = async () => {
    setLoading(true);

    const finalOrderData = {
      ...orderData,
      paymentMethod,
    };

    const res = await createOrder(finalOrderData);
    setLoading(false);

    if (res.success) {
      navigate(`/payment-proof/${res.order.id}`, { state: { dokuUrl: res.paymentUrl } });
    } else {
      const rawMsg = res.message || 'Terjadi kendala saat memproses pesanan Anda. Silakan coba kembali.';
      const isSeatConflict =
        rawMsg.toLowerCase().includes('kursi') || rawMsg.toLowerCase().includes('kuota');

      setErrorModal({
        title: isSeatConflict ? 'Kursi Tidak Tersedia' : 'Pemesanan Tidak Dapat Diproses',
        message: rawMsg,
        isSeatConflict,
      });
    }
  };

  return (
    <div className="min-h-screen bg-brand-bgLight dark:bg-obsidian-dark text-brand-darkText dark:text-brand-lightText transition-colors">
      <Navbar />

      <div className="pt-28 pb-16 px-4 md:px-8 max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <span className="text-[10px] font-bold text-oxblood dark:text-gold uppercase tracking-widest block">
            Checkout Safe & Fast
          </span>
          <h1 className="text-3xl font-extrabold tracking-tight">Ringkasan Pemesanan & Pembayaran</h1>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Silakan tinjau kembali pesanan Anda sebelum melanjutkan pembayaran.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-6">
            <CheckoutPaymentMethods
              paymentMethod={paymentMethod}
              setPaymentMethod={setPaymentMethod}
              isVADropdownOpen={isVADropdownOpen}
              setIsVADropdownOpen={setIsVADropdownOpen}
            />
          </div>

          <div>
            <CheckoutSummary
              orderData={orderData}
              handleProceed={handleProceed}
              loading={loading}
            />
          </div>
        </div>
      </div>

      {/* Modal Notifikasi Error Pemesanan / Rebutan Kursi */}
      {errorModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-white dark:bg-obsidian-card rounded-3xl border border-gray-200 dark:border-obsidian-border shadow-2xl overflow-hidden relative">
            <div className="pulse-line-oxblood w-full absolute top-0 left-0"></div>

            <button
              onClick={() => setErrorModal(null)}
              className="absolute top-4 right-4 p-1.5 rounded-full text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-obsidian-surface transition-colors"
              aria-label="Tutup"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="p-7 text-center">
              <div className="w-14 h-14 rounded-2xl bg-oxblood/10 border border-oxblood/30 text-oxblood dark:text-red-400 flex items-center justify-center mx-auto mb-4">
                <AlertTriangle className="w-7 h-7" />
              </div>

              <h3 className="text-lg font-extrabold text-gray-900 dark:text-white mb-2">
                {errorModal.title}
              </h3>

              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 leading-relaxed mb-6">
                {errorModal.message}
              </p>

              <div className="flex flex-col sm:flex-row gap-2.5">
                {errorModal.isSeatConflict && orderData?.eventId && (
                  <button
                    type="button"
                    onClick={() => {
                      setErrorModal(null);
                      navigate(`/seat-map/${orderData.eventId}`);
                    }}
                    className="flex-1 py-3 px-4 rounded-xl gold-gradient-btn text-obsidian font-extrabold text-xs flex items-center justify-center gap-1.5 shadow-gold-glow"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Pilih Kursi Lain
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setErrorModal(null)}
                  className={`py-3 px-4 rounded-xl text-xs font-bold border transition-colors ${
                    errorModal.isSeatConflict && orderData?.eventId
                      ? 'flex-1 bg-gray-100 dark:bg-obsidian-surface border-gray-200 dark:border-obsidian-border text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-obsidian'
                      : 'w-full gold-gradient-btn text-obsidian font-extrabold shadow-gold-glow border-transparent'
                  }`}
                >
                  Mengerti
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
