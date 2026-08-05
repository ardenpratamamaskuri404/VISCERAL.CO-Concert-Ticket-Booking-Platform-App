import React, { useState, useEffect, useRef } from 'react';
import { useStore } from '../context/StoreContext';
import AdminSidebar from '../components/AdminSidebar';
import { ScanLine, CheckCircle2, XCircle, Search, ShieldCheck, Camera, CameraOff } from 'lucide-react';
import api from '../api/axios';
import { Scanner } from '@yudiel/react-qr-scanner';

// Helper for generating simple beep sounds using Web Audio API
const playBeep = (type = 'success') => {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();
    
    osc.connect(gainNode);
    gainNode.connect(ctx.destination);
    
    if (type === 'success') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(1200, ctx.currentTime + 0.1);
      gainNode.gain.setValueAtTime(0.1, ctx.currentTime);
      osc.start();
      osc.stop(ctx.currentTime + 0.15);
    } else {
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(300, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(150, ctx.currentTime + 0.2);
      gainNode.gain.setValueAtTime(0.2, ctx.currentTime);
      osc.start();
      osc.stop(ctx.currentTime + 0.3);
    }
  } catch (e) {
    // Ignore audio errors
  }
};

export default function AdminScannerPage() {
  const { currentUser, addAuditLog } = useStore();
  const [ticketCode, setTicketCode] = useState('');
  const [scanResult, setScanResult] = useState(null); // { success: boolean, message: string, ticket?: any }
  const [loading, setLoading] = useState(false);
  const [cameraEnabled, setCameraEnabled] = useState(true);
  const inputRef = useRef(null);
  const scanTimeoutRef = useRef(null);

  // Auto-focus the input so hardware barcode scanners work seamlessly
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
    return () => {
      if (scanTimeoutRef.current) clearTimeout(scanTimeoutRef.current);
    }
  }, []);

  const processTicketCode = async (code) => {
    if (!code.trim() || loading) return;

    setLoading(true);
    setScanResult(null);
    setCameraEnabled(false); // Pause camera on detect

    try {
      const response = await api.put('/tickets/checkin', { ticketCode: code.trim() });
      if (response.data && response.data.success) {
        setScanResult({
          success: true,
          message: response.data.message,
          ticket: response.data.ticket
        });
        playBeep('success');
        addAuditLog('CHECKIN_TICKET', response.data.ticket.id, { ticketCode: code.trim() });
      }
    } catch (error) {
      setScanResult({
        success: false,
        message: error.response?.data?.message || 'Gagal memproses tiket',
      });
      playBeep('error');
    } finally {
      setLoading(false);
      setTicketCode('');
      
      // Auto-resume camera after 2.5 seconds
      if (scanTimeoutRef.current) clearTimeout(scanTimeoutRef.current);
      scanTimeoutRef.current = setTimeout(() => {
        setScanResult(null);
        setCameraEnabled(true);
        if (inputRef.current) inputRef.current.focus();
      }, 2500);
    }
  };

  const handleManualScan = async (e) => {
    e.preventDefault();
    processTicketCode(ticketCode);
  };

  const handleQRScan = (result) => {
    if (result && result.length > 0 && cameraEnabled && !loading) {
      const code = result[0].rawValue;
      processTicketCode(code);
    }
  };

  return (
    <div className="min-h-screen bg-obsidian flex">
      <AdminSidebar />
      <div className="flex-1 p-8 ml-64 transition-all">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
              <ScanLine className="w-8 h-8 text-gold" /> Scanner Gate
            </h1>
            <p className="text-gray-400 mt-2">
              Scan barcode tiket penonton untuk melakukan Check-in secara real-time.
            </p>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 mb-8">
            {/* Kamera QR */}
            <div className="bg-obsidian-card border border-obsidian-border rounded-3xl overflow-hidden relative shadow-lg h-[500px] flex flex-col">
              <div className="p-4 bg-obsidian-surface border-b border-obsidian-border flex justify-between items-center z-10">
                <span className="text-gold font-bold flex items-center gap-2">
                  <Camera className="w-5 h-5" /> Live Camera
                </span>
                <button 
                  onClick={() => setCameraEnabled(!cameraEnabled)}
                  className="px-4 py-2 bg-obsidian text-gray-300 rounded-lg text-sm font-bold hover:text-white transition-colors flex items-center gap-2"
                >
                  {cameraEnabled ? <><CameraOff className="w-4 h-4"/> Pause Kamera</> : <><Camera className="w-4 h-4"/> Mulai Scanner</>}
                </button>
              </div>
              <div className="flex-1 relative bg-black">
                {cameraEnabled ? (
                  <Scanner 
                    onScan={handleQRScan} 
                    formats={['qr_code']}
                    components={{
                      audio: false, 
                      onOff: false,
                      finder: true
                    }}
                    styles={{ container: { width: '100%', height: '100%' } }}
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-gray-500 flex-col gap-3">
                    <CameraOff className="w-16 h-16 opacity-50" />
                    <span className="font-medium text-lg">Kamera Dijeda</span>
                  </div>
                )}
                
                {/* Full screen color overlay on result */}
                {scanResult && (
                  <div className={`absolute inset-0 z-50 flex items-center justify-center transition-all animate-in fade-in duration-200 ${
                    scanResult.success ? 'bg-green-500/90' : 'bg-red-500/90'
                  }`}>
                    {scanResult.success ? (
                      <div className="text-center animate-bounce">
                        <CheckCircle2 className="w-32 h-32 text-white mx-auto mb-4 drop-shadow-lg" />
                        <h2 className="text-white text-4xl font-extrabold tracking-tight drop-shadow-lg">AKSES DITERIMA</h2>
                      </div>
                    ) : (
                      <div className="text-center animate-pulse">
                        <XCircle className="w-32 h-32 text-white mx-auto mb-4 drop-shadow-lg" />
                        <h2 className="text-white text-4xl font-extrabold tracking-tight drop-shadow-lg">DITOLAK</h2>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Input & Result */}
            <div className="flex flex-col gap-6">
              {/* Scanner Input Box */}
              <div className="bg-obsidian rounded-3xl p-6 shadow-obsidian-glow border border-gold/20 relative overflow-hidden">
                <div className="pulse-line-oxblood w-full absolute top-0 left-0"></div>
                
                <form onSubmit={handleManualScan} className="relative z-10">
                  <label className="block text-xs font-bold uppercase tracking-wider text-gold mb-3">
                    Input Manual / Barcode Scanner Fisik
                  </label>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <div className="relative flex-1">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Search className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        ref={inputRef}
                        type="text"
                        value={ticketCode}
                        onChange={(e) => setTicketCode(e.target.value)}
                        placeholder="Ketik kode tiket..."
                        className="w-full bg-obsidian-card border-2 border-obsidian-border rounded-xl py-4 pl-12 pr-4 text-white placeholder-gray-500 focus:outline-none focus:border-gold transition-colors text-lg font-mono tracking-wider"
                        disabled={loading}
                        autoComplete="off"
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={loading || !ticketCode.trim()}
                      className="bg-gold text-obsidian px-8 py-4 rounded-xl font-bold hover:bg-white transition-colors disabled:opacity-50 flex items-center justify-center min-w-[120px]"
                    >
                      {loading ? '...' : 'Scan Manual'}
                    </button>
                  </div>
                </form>
              </div>

              {/* Scan Result Status Mini */}
              {scanResult && (
                <div className={`rounded-3xl p-8 border-2 transition-all flex-1 flex flex-col justify-center ${
                  scanResult.success 
                    ? 'bg-green-900/20 border-green-500 shadow-[0_0_40px_rgba(34,197,94,0.15)]' 
                    : 'bg-red-900/20 border-red-500 shadow-[0_0_40px_rgba(239,68,68,0.15)]'
                }`}>
                  <div className="flex items-start gap-4 mb-6">
                    {scanResult.success ? (
                      <CheckCircle2 className="w-10 h-10 text-green-400 shrink-0" />
                    ) : (
                      <XCircle className="w-10 h-10 text-red-400 shrink-0" />
                    )}
                    <div>
                      <h3 className={`text-2xl font-extrabold tracking-tight ${
                        scanResult.success ? 'text-green-400' : 'text-red-400'
                      }`}>
                        {scanResult.success ? 'TIKET VALID' : 'TIKET INVALID'}
                      </h3>
                      <p className="text-gray-300 font-medium text-lg mt-1">
                        {scanResult.message}
                      </p>
                    </div>
                  </div>

                  {scanResult.success && scanResult.ticket && (
                    <div className="bg-obsidian-card rounded-2xl p-6 border border-obsidian-border shadow-lg space-y-4">
                      <div className="flex justify-between items-start pb-4 border-b border-obsidian-border/50">
                        <div>
                          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">Nama Penonton</span>
                          <span className="font-extrabold text-white text-2xl">{scanResult.ticket.order?.customerName || 'Unknown'}</span>
                        </div>
                        <ShieldCheck className="w-10 h-10 text-gold" />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-y-6 gap-x-4">
                        <div>
                          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">Kategori</span>
                          <span className="font-bold text-gold text-xl">{scanResult.ticket.category?.name || scanResult.ticket.seat?.category?.name || 'General'}</span>
                        </div>
                        <div>
                          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">Nomor Kursi</span>
                          <span className="font-extrabold text-white text-xl bg-white/10 px-3 py-1 rounded inline-block">{scanResult.ticket.seat?.seatNumber || '-'}</span>
                        </div>
                        
                        {scanResult.ticket.event && (
                          <>
                            <div className="col-span-2">
                              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">Acara & Tanggal</span>
                              <span className="font-medium text-white text-md">
                                {scanResult.ticket.event.title} • {new Date(scanResult.ticket.event.eventDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                              </span>
                            </div>
                            <div>
                              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">Open Gate</span>
                              <span className="font-medium text-gray-300 text-sm">
                                {new Date(new Date(scanResult.ticket.event.eventDate).getTime() - 60*60*1000).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} WIB
                              </span>
                            </div>
                          </>
                        )}
                        <div className={scanResult.ticket.event ? "" : "col-span-2"}>
                          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">Waktu Check-in</span>
                          <span className="font-medium text-gray-300 text-sm">{new Date().toLocaleTimeString('id-ID')}</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
