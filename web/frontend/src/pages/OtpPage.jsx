import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';
import { useStore } from '../context/StoreContext';
import Navbar from '../components/Navbar';
import { ArrowRight, ArrowLeft, CheckCircle2, RotateCw, Mail, Clock, ShieldCheck } from 'lucide-react';
import logoSvg from '../assets/logo.svg';

export default function OtpPage() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { loginUser } = useStore();

  // Pulihkan data pending OTP dari state router atau sessionStorage
  const pendingFallback = (() => {
    try {
      const raw = sessionStorage.getItem('visceral_pending_otp');
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  })();

  const email = state?.email || pendingFallback?.email || '';
  const password = state?.password || '';

  const initialOtpSeconds = (() => {
    if (state?.otpExpiresInSeconds) return state.otpExpiresInSeconds;
    if (pendingFallback?.expiresAtMs) {
      return Math.max(0, Math.floor((pendingFallback.expiresAtMs - Date.now()) / 1000));
    }
    return 300;
  })();

  const [digits, setDigits] = useState(['', '', '', '', '', '']);
  const [otpRemaining, setOtpRemaining] = useState(initialOtpSeconds);
  const [resendCooldown, setResendCooldown] = useState(60);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [error, setError] = useState('');
  const [infoMsg, setInfoMsg] = useState(
    state?.message || (email ? `Kode OTP 6 digit telah dikirim ke ${email}.` : '')
  );
  const [successInfo, setSuccessInfo] = useState(null);

  // Jika halaman /otp dibuka langsung tanpa sesi login OTP, kembalikan ke /login
  useEffect(() => {
    if (!email) {
      navigate('/login', { replace: true });
    }
  }, [email, navigate]);

  // Hitung mundur masa berlaku OTP (5 menit) & cooldown kirim ulang (60 detik)
  useEffect(() => {
    const interval = setInterval(() => {
      setOtpRemaining((prev) => (prev > 0 ? prev - 1 : 0));
      setResendCooldown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const formatTimer = (sec) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  const handleChange = (index, value) => {
    const cleaned = value.replace(/\D/g, '');
    if (!cleaned && value !== '') return;

    // Jika user menempelkan 6 digit sekaligus di salah satu kotak
    if (cleaned.length > 1) {
      const pasted = cleaned.slice(0, 6).split('');
      const nextDigits = ['', '', '', '', '', ''];
      pasted.forEach((d, idx) => {
        nextDigits[idx] = d;
      });
      setDigits(nextDigits);
      const focusIdx = Math.min(pasted.length, 5);
      document.getElementById(`otp-input-${focusIdx}`)?.focus();
      return;
    }

    const newDigits = [...digits];
    newDigits[index] = cleaned.slice(-1);
    setDigits(newDigits);
    setError('');

    if (cleaned && index < 5) {
      document.getElementById(`otp-input-${index + 1}`)?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = (e.clipboardData.getData('text') || '').replace(/\D/g, '').slice(0, 6);
    if (!pasted) return;
    const nextDigits = ['', '', '', '', '', ''];
    pasted.split('').forEach((d, idx) => {
      nextDigits[idx] = d;
    });
    setDigits(nextDigits);
    setError('');
    document.getElementById(`otp-input-${Math.min(pasted.length, 5)}`)?.focus();
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !digits[index] && index > 0) {
      document.getElementById(`otp-input-${index - 1}`)?.focus();
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    const code = digits.join('');
    if (code.length < 6 || loading) return;

    setLoading(true);
    setError('');

    try {
      const response = await api.post('/auth/verify-login-otp', {
        email,
        otp: code,
      });

      const { user, token, expiresAt, expiresInHours } = response.data;
      sessionStorage.removeItem('visceral_pending_otp');
      loginUser(user, token, expiresAt);

      const destination = user.role === 'ADMIN' || user.role === 'SUPERADMIN' ? '/admin/dashboard' : '/';
      setSuccessInfo({
        role: user.role,
        expiresInHours,
        destinationLabel:
          user.role === 'ADMIN' || user.role === 'SUPERADMIN'
            ? 'Dashboard Admin...'
            : 'Halaman Utama...',
      });

      setTimeout(() => {
        navigate(destination, { replace: true });
      }, 900);
    } catch (err) {
      setError(err.response?.data?.error || 'Kode OTP tidak valid atau sudah kedaluwarsa.');
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (resendCooldown > 0 || resending) return;

    // Jika password tidak ada (misal halaman di-refresh), minta user login ulang agar aman
    if (!password) {
      navigate('/login', { replace: true });
      return;
    }

    setResending(true);
    setError('');

    try {
      const response = await api.post('/auth/resend-login-otp', { email, password });
      const nextSeconds = response.data.otpExpiresInSeconds || 300;
      setOtpRemaining(nextSeconds);
      setResendCooldown(60);
      setDigits(['', '', '', '', '', '']);
      setInfoMsg(response.data.message || `Kode OTP baru telah dikirim ke ${email}.`);
      sessionStorage.setItem(
        'visceral_pending_otp',
        JSON.stringify({ email, expiresAtMs: Date.now() + nextSeconds * 1000 })
      );
      document.getElementById('otp-input-0')?.focus();
    } catch (err) {
      setError(err.response?.data?.error || 'Gagal mengirim ulang kode OTP.');
    } finally {
      setResending(false);
    }
  };

  if (!email) return null;

  return (
    <div className="min-h-screen bg-brand-bgLight dark:bg-obsidian-dark flex flex-col justify-between transition-colors">
      <Navbar />

      <div className="flex-1 flex items-center justify-center px-4 pt-32 pb-16">
        <div className="w-full max-w-md bg-white dark:bg-obsidian-card p-8 rounded-3xl border border-gray-200 dark:border-obsidian-border shadow-obsidian-glow text-center relative overflow-hidden">
          <div className="pulse-line-oxblood w-full absolute top-0 left-0"></div>

          <div className="w-16 h-16 rounded-full bg-obsidian border border-gold/40 flex items-center justify-center overflow-hidden mx-auto mb-4 shadow-gold-glow">
            <img src={logoSvg} alt="VISCERAL.CO" className="w-full h-full object-cover scale-105" />
          </div>

          <h2 className="text-2xl font-extrabold tracking-tight text-gray-900 dark:text-white">
            Verifikasi Kode OTP
          </h2>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 mb-5">
            Masukkan 6 digit kode verifikasi keamanan yang telah dikirimkan ke email akun Anda.
          </p>

          {successInfo ? (
            <div className="py-8 animate-in fade-in zoom-in-95 duration-300">
              <div className="w-16 h-16 bg-emerald-500/10 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-3">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h3 className="text-lg font-bold text-emerald-600 dark:text-emerald-400">
                Verifikasi OTP Berhasil!
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Sesi login aktif selama <span className="font-bold">{successInfo.expiresInHours} jam</span>. Mengarahkan ke {successInfo.destinationLabel}
              </p>
            </div>
          ) : (
            <form onSubmit={handleVerify}>
              {/* Info Email & Sisa Waktu OTP */}
              <div className="mb-4 p-3 rounded-xl bg-gray-50 dark:bg-obsidian-surface border border-gray-200 dark:border-obsidian-border flex items-center justify-between text-xs text-left">
                <div className="flex items-center gap-2 min-w-0">
                  <Mail className="w-4 h-4 text-oxblood dark:text-gold shrink-0" />
                  <span className="font-semibold text-gray-800 dark:text-gray-200 truncate">{email}</span>
                </div>
                <span
                  className={`inline-flex items-center gap-1 font-mono font-bold shrink-0 ml-2 ${
                    otpRemaining > 0 ? 'text-oxblood dark:text-gold' : 'text-red-500'
                  }`}
                >
                  <Clock className="w-3.5 h-3.5" />
                  {otpRemaining > 0 ? formatTimer(otpRemaining) : 'Habis'}
                </span>
              </div>

              {error && (
                <div className="mb-4 p-3 rounded-xl bg-oxblood/10 border border-oxblood/30 text-oxblood dark:text-red-400 text-xs font-semibold text-left">
                  {error}
                </div>
              )}

              {infoMsg && !error && (
                <div className="mb-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-400 text-xs font-semibold flex items-start gap-2 text-left">
                  <ShieldCheck className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{infoMsg}</span>
                </div>
              )}

              {/* 6 Digit Inputs */}
              <div className="flex justify-center gap-2 sm:gap-2.5 mb-5" onPaste={handlePaste}>
                {digits.map((digit, idx) => (
                  <input
                    key={idx}
                    id={`otp-input-${idx}`}
                    type="text"
                    inputMode="numeric"
                    autoComplete={idx === 0 ? 'one-time-code' : 'off'}
                    maxLength={6}
                    value={digit}
                    onChange={(e) => handleChange(idx, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(idx, e)}
                    className="w-11 h-14 sm:w-12 rounded-2xl text-xl font-extrabold text-center bg-gray-50 dark:bg-obsidian-surface border-2 border-gray-200 dark:border-obsidian-border focus:border-gold focus:scale-105 text-gray-900 dark:text-white focus:outline-none transition-all shadow-sm"
                    autoFocus={idx === 0}
                  />
                ))}
              </div>

              <div className="mb-5 text-xs text-gray-500 dark:text-gray-400 flex items-center justify-center gap-2">
                {resendCooldown === 0 ? (
                  <button
                    type="button"
                    onClick={handleResend}
                    disabled={resending}
                    className="text-oxblood dark:text-gold font-bold hover:underline flex items-center gap-1 disabled:opacity-50"
                  >
                    <RotateCw className={`w-3.5 h-3.5 ${resending ? 'animate-spin' : ''}`} />
                    {resending ? 'Mengirim ulang...' : 'Kirim Ulang Kode OTP'}
                  </button>
                ) : (
                  <span>
                    Kirim ulang kode dalam{' '}
                    <span className="font-bold text-oxblood dark:text-gold">
                      00:{resendCooldown < 10 ? `0${resendCooldown}` : resendCooldown}
                    </span>
                  </span>
                )}
              </div>

              <button
                type="submit"
                disabled={loading || digits.join('').length < 6 || otpRemaining === 0}
                className="w-full py-3.5 rounded-xl gold-gradient-btn text-obsidian font-extrabold text-xs flex items-center justify-center gap-2 shadow-gold-glow disabled:opacity-50"
              >
                {loading ? 'Memverifikasi...' : 'Verifikasi & Masuk'}
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="mt-5">
                <Link
                  to="/login"
                  onClick={() => sessionStorage.removeItem('visceral_pending_otp')}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  Kembali ke Halaman Login
                </Link>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
