import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import api from '../api/axios';
import { useStore } from '../context/StoreContext';
import Navbar from '../components/Navbar';
import { Mail, Lock, ArrowRight, AlertTriangle } from 'lucide-react';
import logoSvg from '../assets/logo.svg';

export default function LoginPage() {
  const { loginUser } = useStore();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [expiredNotice, setExpiredNotice] = useState('');
  const [loading, setLoading] = useState(false);

  // Tampilkan notifikasi jika sesi login baru saja berakhir otomatis
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const savedMsg = sessionStorage.getItem('visceral_session_expired_msg');
    if (params.get('expired') === '1' || savedMsg) {
      setExpiredNotice(savedMsg || 'Sesi login Anda telah habis. Silakan login kembali.');
      sessionStorage.removeItem('visceral_session_expired_msg');
    }
  }, [location.search]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Mohon isi email dan password.');
      return;
    }

    setLoading(true);
    setError('');
    setExpiredNotice('');

    try {
      const response = await api.post('/auth/login', { email: email.trim(), password });

      if (response.data.requiresOtp) {
        const targetEmail = response.data.email || email.trim();
        sessionStorage.setItem(
          'visceral_pending_otp',
          JSON.stringify({
            email: targetEmail,
            expiresAtMs: Date.now() + (response.data.otpExpiresInSeconds || 300) * 1000,
          })
        );

        navigate('/otp', {
          state: {
            mode: 'LOGIN',
            email: targetEmail,
            password,
            otpExpiresInSeconds: response.data.otpExpiresInSeconds || 300,
            message: response.data.message,
          },
        });
        return;
      }

      // Fallback jika backend langsung mengembalikan token
      const user = response.data.user;
      loginUser(user, response.data.token, response.data.expiresAt);
      if (user.role === 'ADMIN' || user.role === 'SUPERADMIN') {
        navigate('/admin/dashboard');
      } else {
        navigate('/');
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Terjadi kesalahan saat login.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-brand-bgLight dark:bg-obsidian-dark flex flex-col justify-between transition-colors">
      <Navbar />

      <div className="flex-1 flex items-center justify-center px-4 pt-32 pb-16">
        <div className="w-full max-w-md bg-white dark:bg-obsidian-card p-8 rounded-3xl border border-gray-200 dark:border-obsidian-border shadow-obsidian-glow relative overflow-hidden transition-all duration-300">
          {/* Top Decorative Pulse Line */}
          <div className="pulse-line-oxblood w-full absolute top-0 left-0"></div>

          {/* Logo & Title */}
          <div className="text-center mb-6">
            <div className="w-16 h-16 rounded-full bg-obsidian border border-gold/40 flex items-center justify-center overflow-hidden mx-auto mb-3 shadow-gold-glow">
              <img src={logoSvg} alt="VISCERAL.CO" className="w-full h-full object-cover scale-105" />
            </div>
            <h2 className="text-2xl font-extrabold tracking-tight text-gray-900 dark:text-white">
              Selamat Datang Kembali
            </h2>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Masuk ke akun VISCERAL.CO milikmu
            </p>
          </div>

          {expiredNotice && (
            <div className="mb-4 p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-700 dark:text-amber-400 text-xs font-semibold flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{expiredNotice}</span>
            </div>
          )}

          {error && (
            <div className="mb-4 p-3 rounded-xl bg-oxblood/10 border border-oxblood/30 text-oxblood dark:text-red-400 text-xs font-semibold">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-1.5">
                Alamat Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="nama@email.com"
                  className="w-full pl-10 pr-4 py-3 rounded-xl text-xs bg-gray-50 dark:bg-obsidian-surface border border-gray-200 dark:border-obsidian-border text-gray-900 dark:text-white focus:outline-none focus:border-gold transition-colors"
                  required
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300">
                  Password
                </label>
                <Link to="/forgot-password" className="text-xs text-oxblood dark:text-gold hover:underline font-semibold">
                  Lupa Password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-3 rounded-xl text-xs bg-gray-50 dark:bg-obsidian-surface border border-gray-200 dark:border-obsidian-border text-gray-900 dark:text-white focus:outline-none focus:border-gold transition-colors"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl gold-gradient-btn text-obsidian font-extrabold text-xs flex items-center justify-center gap-2 shadow-gold-glow mt-6 disabled:opacity-50"
            >
              {loading ? 'Memproses...' : 'Masuk Sekarang'}
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="mt-6 text-center text-xs text-gray-500 dark:text-gray-400">
            Belum punya akun?{' '}
            <Link to="/register" className="text-oxblood dark:text-gold font-bold hover:underline">
              Buat Akun Baru
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
