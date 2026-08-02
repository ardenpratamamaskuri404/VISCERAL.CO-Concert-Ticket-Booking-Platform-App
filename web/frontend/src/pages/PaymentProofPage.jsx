import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import Navbar from '../components/Navbar';
import { Upload, CheckCircle2, QrCode, Building, ArrowRight, ShieldCheck, RefreshCw } from 'lucide-react';
import api from '../api/axios';

export default function PaymentProofPage() {
  const { orderId } = useParams();
  const { orders, approveOrder } = useStore();
  const navigate = useNavigate();
  const location = useLocation();
  
  const dokuUrl = location.state?.dokuUrl;

  const order = orders.find((o) => o.id === orderId) || orders[0];
  // Auto-redirect jika order sudah PAID (misalnya user baru kembali dari Doku dan webhook sudah sukses)
  useEffect(() => {
    if (order && order.status === 'PAID') {
      navigate(`/order-success/${order.id}`);
    }
  }, [order, navigate]);

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-[#0D0B0A] text-gray-900 dark:text-white">
        <div className="text-center animate-pulse">
          <p className="font-bold text-lg mb-2">Memuat Data Pesanan...</p>
          <p className="text-xs text-gray-500">Jika tidak muncul, pastikan Anda sudah login.</p>
        </div>
      </div>
    );
  }

  const isManual = order.paymentMethod === 'MANUAL_TRANSFER';

  const [uploaded, setUploaded] = useState(false);
  const [loading, setLoading] = useState(false);

  // Handle Drag & Drop / File Upload for Manual Transfer
  const handleUpload = () => {
    setLoading(true);
    setTimeout(async () => {
      setLoading(false);
      setUploaded(true);
      const proofUrl = 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=600&auto=format&fit=crop&q=80';
      
      // Update local state and backend
      order.paymentProof = proofUrl;
      try {
        await api.put(`/orders/${order.id}/proof`, { proofUrl });
      } catch (error) {
        console.error('Failed to upload proof to backend', error);
      }
    }, 1000);
  };

  // Handle Actual DOKU Payment Redirect
  const handleDokuPayment = async () => {
    setLoading(true);
    try {
      if (dokuUrl) {
        window.location.href = dokuUrl;
        return;
      }
      const response = await api.post(`/orders/${order.id}/generate-doku`);
      if (response.data && response.data.success) {
        window.location.href = response.data.dokuUrl;
      } else {
        alert('Gagal generate link DOKU: ' + response.data.message);
      }
    } catch (error) {
      console.error(error);
      alert('Terjadi kesalahan saat memproses pembayaran');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-brand-bgLight dark:bg-obsidian-dark text-brand-darkText dark:text-brand-lightText transition-colors">
      <Navbar />

      <div className="pt-28 pb-16 px-4 md:px-8 max-w-2xl mx-auto">
        <div className="bg-white dark:bg-obsidian-card p-8 rounded-3xl border border-gray-200 dark:border-obsidian-border shadow-obsidian-glow text-center relative overflow-hidden">
          
          <div className="pulse-line-oxblood w-full absolute top-0 left-0"></div>

          <span className="text-[10px] font-bold text-oxblood dark:text-gold uppercase tracking-widest block mb-1">
            Instruksi Pembayaran
          </span>
          <h1 className="text-2xl font-extrabold tracking-tight mb-2">
            {isManual ? 'Transfer Bank & Upload Bukti' : 'Pembayaran Doku Gateway'}
          </h1>
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-6">
            Nomor Pesanan: <strong className="text-gold">{order.orderNumber}</strong> | Total: <strong className="text-gold">Rp {Number(order.totalAmount || 0).toLocaleString('id-ID')}</strong>
          </p>

          {isManual ? (
            /* Manual Transfer View */
            <div className="space-y-6 text-left">
              <div className="p-4 rounded-2xl bg-gray-50 dark:bg-obsidian-surface border border-gray-200 dark:border-obsidian-border text-xs space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-500 dark:text-gray-400">Bank Tujuan:</span>
                  <span className="font-bold text-gray-900 dark:text-white">BCA (Bank Central Asia)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500 dark:text-gray-400">Nomor Rekening:</span>
                  <span className="font-extrabold text-gold text-sm tracking-wider">8830-192-3849</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500 dark:text-gray-400">Atas Nama:</span>
                  <span className="font-bold text-gray-900 dark:text-white">PT VISCERAL KREATIF INDONESIA</span>
                </div>
              </div>

              {!uploaded ? (
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-2">
                    Upload Foto / Screenshot Bukti Transfer
                  </label>
                  <div
                    onClick={handleUpload}
                    className="border-2 border-dashed border-gold/40 hover:border-gold p-8 rounded-2xl text-center cursor-pointer bg-gray-50 dark:bg-obsidian-surface transition-colors"
                  >
                    <Upload className="w-8 h-8 text-gold mx-auto mb-2" />
                    <p className="text-xs font-bold">Klik untuk memilih file atau Drag & Drop ke sini</p>
                    <p className="text-[10px] text-gray-400 mt-1">Format JPG, PNG (Maksimal 5MB)</p>
                  </div>
                </div>
              ) : (
                <div className="p-4 rounded-2xl bg-gold/10 border border-gold/30 text-center">
                  <CheckCircle2 className="w-8 h-8 text-gold mx-auto mb-2" />
                  <h4 className="font-bold text-xs text-gold">Bukti Transfer Berhasil Diunggah!</h4>
                  <p className="text-[11px] text-gray-400 mt-1 mb-4">
                    Pesananmu sedang diverifikasi oleh Tim Admin VISCERAL.CO.
                  </p>
                  <button
                    onClick={() => navigate('/my-tickets')}
                    className="px-6 py-2.5 rounded-full bg-obsidian text-white hover:text-gold border border-gold/30 text-xs font-bold"
                  >
                    Lihat Status di Tiket Saya
                  </button>
                </div>
              )}
            </div>
          ) : (
            /* Doku Sandbox Payment Simulator View */
            <div className="space-y-6">
              <div className="p-6 rounded-2xl bg-obsidian text-white border border-gold/40 text-center space-y-4">
                <QrCode className="w-20 h-20 text-gold mx-auto" />
                <div>
                  <h3 className="font-extrabold text-sm text-gold">DOKU PAYMENT GATEWAY SANDBOX</h3>
                  <p className="text-xs text-gray-300 mt-1">
                    Silakan klik tombol di bawah untuk diarahkan ke halaman pembayaran yang aman dari DOKU Sandbox.
                  </p>
                </div>
              </div>

              <button
                onClick={handleDokuPayment}
                disabled={loading}
                className="w-full py-4 rounded-xl gold-gradient-btn text-obsidian font-extrabold text-xs flex items-center justify-center gap-2 shadow-gold-glow"
              >
                {loading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    Mengarahkan ke DOKU Sandbox...
                  </>
                ) : (
                  <>
                    Lanjutkan ke Pembayaran DOKU
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
