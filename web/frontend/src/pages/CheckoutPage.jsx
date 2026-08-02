import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import Navbar from '../components/Navbar';
import CheckoutPaymentMethods from '../components/CheckoutPaymentMethods';
import CheckoutSummary from '../components/CheckoutSummary';

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

  const orderData = location.state?.orderData;

  if (!orderData) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center px-4 bg-brand-bgLight dark:bg-obsidian-dark text-brand-darkText dark:text-brand-lightText">
        <h2 className="text-xl font-bold mb-4">Pesanan Tidak Ditemukan</h2>
        <button onClick={() => navigate('/explore')} className="text-gold underline">Kembali ke Explore</button>
      </div>
    );
  }

  const handleProceed = async () => {
    setLoading(true);
    
    // Total amount and tickets mapped correctly
    const finalOrderData = {
      ...orderData,
      paymentMethod,
      // API expects the totalAmount mapped properly or calculated in backend. 
      // We send what API needs
    };

    const res = await createOrder(finalOrderData);
    setLoading(false);

    if (res.success) {
      navigate(`/payment-proof/${res.order.id}`, { state: { dokuUrl: res.paymentUrl } });
    } else {
      alert('Gagal membuat pesanan: ' + res.message);
    }
  };

  return (
    <div className="min-h-screen bg-brand-bgLight dark:bg-obsidian-dark text-brand-darkText dark:text-brand-lightText transition-colors">
      <Navbar />

      <div className="pt-28 pb-16 px-4 md:px-8 max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <span className="text-[10px] font-bold text-oxblood dark:text-gold uppercase tracking-widest block">Checkout Safe & Fast</span>
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
    </div>
  );
}
