import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useStore } from '../context/StoreContext';
import Navbar from '../components/Navbar';
import { Mail, Lock, ArrowRight, ShieldCheck, User, Sparkles } from 'lucide-react';
import logoPng from '../assets/logo.png';

export default function LoginPage() {
  const { loginUser } = useStore();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [loginSuccess, setLoginSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Mohon isi email dan password.');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      const response = await api.post('/auth/login', { email, password });
      
      const user = response.data.user;
      loginUser(user, response.data.token);
      
      if (user.role === 'ADMIN' || user.role === 'SUPERADMIN') {
        navigate('/admin/dashboard');
      } else {
        setLoginSuccess(true);
        setTimeout(() => {
          navigate('/');
        }, 800);
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
        <div className={`w-full max-w-md bg-white dark:bg-obsidian-card p-8 rounded-3xl border border-gray-200 dark:border-obsidian-border shadow-obsidian-glow relative overflow-hidden transition-all duration-700 ${loginSuccess ? 'scale-95 opacity-80 ring-2 ring-green-500/50' : ''}`}>
          
          {/* Top Decorative Pulse Line */}
          <div className="pulse-line-oxblood w-full absolute top-0 left-0"></div>

          {/* Logo & Title */}
          <div className="text-center mb-6">
            <div className="w-14 h-14 rounded-2xl bg-obsidian border border-gold/40 flex items-center justify-center p-2.5 mx-auto mb-3 shadow-gold-glow">
              <img src={logoPng} alt="VISCERAL.CO" className="w-full h-full object-contain" />
            </div>
            <h2 className="text-2xl font-extrabold tracking-tight">Selamat Datang Kembali</h2>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Masuk ke akun VISCERAL.CO milikmu
            </p>
          </div>

          {/* Role Tab Selector Removed for real auth */}

          {error && (
            <div className="mb-4 p-3 rounded-xl bg-oxblood/10 border border-oxblood/30 text-oxblood text-xs font-semibold">
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
                <Link to="/forgot-password" className="text-xs text-gold hover:underline">
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
            <Link to="/register" className="text-gold font-bold hover:underline">
              Buat Akun Baru
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
