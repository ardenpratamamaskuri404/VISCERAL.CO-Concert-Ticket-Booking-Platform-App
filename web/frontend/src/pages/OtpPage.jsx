import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import Navbar from '../components/Navbar';
import { MessageSquare, ArrowRight, CheckCircle2, RotateCw } from 'lucide-react';
import logoPng from '../assets/logo.png';

export default function OtpPage() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { loginUser } = useStore();

  const [digits, setDigits] = useState(['', '', '', '', '', '']);
  const [timer, setTimer] = useState(59);
  const [canResend, setCanResend] = useState(false);
  const [success, setSuccess] = useState(false);

  const phone = state?.phone || '+6281234567890';
  const maskedPhone = phone.replace(/(\+\d{3})\d{4}(\d{4})/, '$1-****-$2');

  useEffect(() => {
    let interval;
    if (timer > 0) {
      interval = setInterval(() => setTimer(prev => prev - 1), 1000);
    } else {
      setCanResend(true);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const handleChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;
    const newDigits = [...digits];
    newDigits[index] = value.slice(-1);
    setDigits(newDigits);

    // Auto focus next field
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-input-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !digits[index] && index > 0) {
      const prevInput = document.getElementById(`otp-input-${index - 1}`);
      if (prevInput) prevInput.focus();
    }
  };

  const handleVerify = (e) => {
    e.preventDefault();
    const code = digits.join('');
    if (code.length < 6) return;

    setSuccess(true);
    setTimeout(() => {
      loginUser(state?.email || 'budi@gmail.com', 'password123', 'CUSTOMER');
      navigate('/explore');
    }, 1200);
  };

  const handleResend = () => {
    setTimer(59);
    setCanResend(false);
    setDigits(['', '', '', '', '', '']);
  };

  return (
    <div className="min-h-screen bg-brand-bgLight dark:bg-obsidian-dark flex flex-col justify-between transition-colors">
      <Navbar />

      <div className="flex-1 flex items-center justify-center px-4 pt-32 pb-16">
        <div className="w-full max-w-md bg-white dark:bg-obsidian-card p-8 rounded-3xl border border-gray-200 dark:border-obsidian-border shadow-obsidian-glow text-center relative overflow-hidden">
          
          <div className="pulse-line-oxblood w-full absolute top-0 left-0"></div>

          <div className="w-14 h-14 rounded-2xl bg-obsidian border border-gold/40 flex items-center justify-center p-3 mx-auto mb-4 shadow-gold-glow">
            <MessageSquare className="w-7 h-7 text-gold" />
          </div>

          <h2 className="text-2xl font-extrabold tracking-tight">Verifikasi OTP WhatsApp</h2>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 mb-6">
            Kode 6-digit dikirim via WhatsApp Fonnte ke nomor <span className="font-bold text-gray-900 dark:text-white">{maskedPhone}</span>
          </p>

          {success ? (
            <div className="py-8 animate-in fade-in zoom-in-95 duration-300">
              <div className="w-16 h-16 bg-green-500/10 text-green-500 rounded-full flex items-center justify-center mx-auto mb-3">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h3 className="text-lg font-bold text-green-500">Nomor Berhasil Diverifikasi!</h3>
              <p className="text-xs text-gray-400 mt-1">Mengarahkan ke halaman Jelajah Konser...</p>
            </div>
          ) : (
            <form onSubmit={handleVerify}>
              {/* 6 Digit Inputs */}
              <div className="flex justify-center gap-2.5 mb-6">
                {digits.map((digit, idx) => (
                  <input
                    key={idx}
                    id={`otp-input-${idx}`}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleChange(idx, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(idx, e)}
                    className="w-12 h-14 rounded-2xl text-xl font-extrabold text-center bg-gray-50 dark:bg-obsidian-surface border-2 border-gray-200 dark:border-obsidian-border focus:border-gold focus:scale-105 text-gray-900 dark:text-white focus:outline-none transition-all shadow-sm"
                    autoFocus={idx === 0}
                  />
                ))}
              </div>

              <div className="mb-6 text-xs text-gray-500 dark:text-gray-400 flex items-center justify-center gap-2">
                {canResend ? (
                  <button
                    type="button"
                    onClick={handleResend}
                    className="text-gold font-bold hover:underline flex items-center gap-1"
                  >
                    <RotateCw className="w-3.5 h-3.5" />
                    Kirim Ulang Kode OTP
                  </button>
                ) : (
                  <span>
                    Kirim ulang kode dalam{' '}
                    <span className="font-bold text-oxblood">00:{timer < 10 ? `0${timer}` : timer}</span>
                  </span>
                )}
              </div>

              <button
                type="submit"
                disabled={digits.join('').length < 6}
                className="w-full py-3.5 rounded-xl gold-gradient-btn text-obsidian font-extrabold text-xs flex items-center justify-center gap-2 shadow-gold-glow disabled:opacity-50"
              >
                Verifikasi & Lanjut
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
