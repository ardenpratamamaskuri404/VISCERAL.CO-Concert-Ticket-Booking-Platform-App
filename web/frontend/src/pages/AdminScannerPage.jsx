import React, { useState, useEffect, useRef } from 'react';
import { useStore } from '../context/StoreContext';
import AdminSidebar from '../components/AdminSidebar';
import { ScanLine, CheckCircle2, XCircle, Search, ShieldCheck, Ticket } from 'lucide-react';
import api from '../api/axios';

export default function AdminScannerPage() {
  const { currentUser, addAuditLog } = useStore();
  const [ticketCode, setTicketCode] = useState('');
  const [scanResult, setScanResult] = useState(null); // { success: boolean, message: string, ticket?: any }
  const [loading, setLoading] = useState(false);
  const inputRef = useRef(null);

  // Auto-focus the input so hardware barcode scanners work seamlessly
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const handleScan = async (e) => {
    e.preventDefault();
    if (!ticketCode.trim()) return;

    setLoading(true);
    setScanResult(null);

    try {
      const response = await api.put('/tickets/checkin', { ticketCode: ticketCode.trim() });
      if (response.data && response.data.success) {
        setScanResult({
          success: true,
          message: response.data.message,
          ticket: response.data.ticket
        });
        addAuditLog('CHECKIN_TICKET', response.data.ticket.id, { ticketCode: ticketCode.trim() });
      }
    } catch (error) {
      setScanResult({
        success: false,
        message: error.response?.data?.message || 'Gagal memproses tiket',
      });
    } finally {
      setLoading(false);
      setTicketCode('');
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }
  };

  return (
    <div className="min-h-screen bg-obsidian flex">
      <AdminSidebar />
      <div className="flex-1 p-8 ml-64 transition-all">
        <div className="max-w-2xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
              <ScanLine className="w-8 h-8 text-gold" /> Scanner Gate
            </h1>
            <p className="text-gray-400 mt-2">
              Scan barcode tiket penonton untuk melakukan Check-in.
            </p>
          </div>

          {/* Scanner Input Box */}
          <div className="bg-obsidian rounded-3xl p-8 shadow-obsidian-glow border border-gold/20 mb-8 relative overflow-hidden">
            <div className="pulse-line-oxblood w-full absolute top-0 left-0"></div>
            
            <form onSubmit={handleScan} className="relative z-10">
              <label className="block text-xs font-bold uppercase tracking-wider text-gold mb-3">
                Input QR / Kode Tiket
              </label>
              <div className="flex gap-4">
                <div className="relative flex-1">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    ref={inputRef}
                    type="text"
                    value={ticketCode}
                    onChange={(e) => setTicketCode(e.target.value)}
                    placeholder="Scan atau ketik kode tiket di sini..."
                    className="w-full bg-obsidian-card border-2 border-obsidian-border rounded-2xl py-4 pl-12 pr-4 text-white placeholder-gray-500 focus:outline-none focus:border-gold transition-colors text-lg font-mono tracking-wider"
                    disabled={loading}
                    autoComplete="off"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading || !ticketCode.trim()}
                  className="bg-gold text-obsidian px-8 rounded-2xl font-bold hover:bg-white transition-colors disabled:opacity-50 flex items-center justify-center min-w-[120px]"
                >
                  {loading ? 'Scanning...' : 'Scan'}
                </button>
              </div>
            </form>
          </div>

          {/* Scan Result Status */}
          {scanResult && (
            <div className={`rounded-3xl p-8 border-2 transition-all ${
              scanResult.success 
                ? 'bg-green-900/20 border-green-500 shadow-[0_0_30px_rgba(34,197,94,0.15)]' 
                : 'bg-red-900/20 border-red-500 shadow-[0_0_30px_rgba(239,68,68,0.15)]'
            }`}>
              <div className="flex items-start gap-4">
                {scanResult.success ? (
                  <CheckCircle2 className="w-12 h-12 text-green-400 shrink-0" />
                ) : (
                  <XCircle className="w-12 h-12 text-red-400 shrink-0" />
                )}
                
                <div className="flex-1">
                  <h3 className={`text-2xl font-extrabold tracking-tight mb-2 ${
                    scanResult.success ? 'text-green-400' : 'text-red-400'
                  }`}>
                    {scanResult.success ? 'AKSES DITERIMA' : 'AKSES DITOLAK'}
                  </h3>
                  <p className="text-gray-300 font-medium text-lg mb-6">
                    {scanResult.message}
                  </p>

                  {scanResult.success && scanResult.ticket && (
                    <div className="bg-obsidian-card rounded-2xl p-6 border border-obsidian-border shadow-lg space-y-5">
                      <div className="flex justify-between items-center pb-4 border-b border-obsidian-border/50">
                        <div>
                          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">Nama Penonton</span>
                          <span className="font-extrabold text-white text-xl">{scanResult.ticket.order?.customerName || 'Unknown'}</span>
                        </div>
                        <ShieldCheck className="w-10 h-10 text-gold" />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-y-6 gap-x-4">
                        <div>
                          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">Kategori</span>
                          <span className="font-bold text-gray-100 text-lg">{scanResult.ticket.seat?.category?.name || 'General'}</span>
                        </div>
                        <div>
                          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">Nomor Kursi</span>
                          <span className="font-bold text-gray-100 text-lg">{scanResult.ticket.seat?.seatNumber || '-'}</span>
                        </div>
                        <div>
                          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">Kode Tiket</span>
                          <span className="font-mono text-gold text-sm bg-gold/10 px-2 py-1 rounded border border-gold/20 inline-block mt-1">{scanResult.ticket.ticketCode}</span>
                        </div>
                        <div>
                          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">Waktu Check-in</span>
                          <span className="font-medium text-gray-300 text-sm mt-1 block">{new Date().toLocaleTimeString('id-ID')}</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
