import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { Mail, Lock, User, Phone, ArrowRight, CheckCircle2 } from 'lucide-react';
import logoPng from '../assets/logo.png';

export default function RegisterPage() {
  const navigate = useNavigate();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [agree, setAgree] = useState(true);

  // Password strength calculation
  const getPasswordStrength = () => {
    if (password.length === 0) return 0;
    if (password.length < 6) return 1;
    if (password.length < 10) return 2;
    return 3;
  };

  const strength = getPasswordStrength();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!fullName || !email || !phone || !password) return;
    // Redirect to OTP verification page as required in prd.md FR-01 Fonnte WhatsApp flow
    navigate('/otp', { state: { email, phone, fullName } });
  };

  return (
    <div className="min-h-screen bg-brand-bgLight dark:bg-obsidian-dark flex flex-col justify-between transition-colors">
      <Navbar />

      <div className="flex-1 flex items-center justify-center px-4 pt-32 pb-16">
        <div className="w-full max-w-md bg-white dark:bg-obsidian-card p-8 rounded-3xl border border-gray-200 dark:border-obsidian-border shadow-obsidian-glow relative overflow-hidden">
          
          <div className="pulse-line-oxblood w-full absolute top-0 left-0"></div>

          <div className="text-center mb-6">
            <div className="w-12 h-12 rounded-2xl bg-obsidian border border-gold/40 flex items-center justify-center p-2 mx-auto mb-3 shadow-gold-glow">
              <img src={logoPng} alt="VISCERAL.CO" className="w-full h-full object-contain" />
            </div>
            <h2 className="text-2xl font-extrabold tracking-tight">Buat Akun Customer</h2>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Nikmati kemudahan pesan tiket konser resmi VISCERAL.CO
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3.5">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-1">
                Nama Lengkap
              </label>
              <div className="relative">
                <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Nama sesuai KTP"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl text-xs bg-gray-50 dark:bg-obsidian-surface border border-gray-200 dark:border-obsidian-border text-gray-900 dark:text-white focus:outline-none focus:border-gold"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-1">
                Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="nama@email.com"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl text-xs bg-gray-50 dark:bg-obsidian-surface border border-gray-200 dark:border-obsidian-border text-gray-900 dark:text-white focus:outline-none focus:border-gold"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-1">
                Nomor WhatsApp (Aktif)
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+6281234567890"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl text-xs bg-gray-50 dark:bg-obsidian-surface border border-gray-200 dark:border-obsidian-border text-gray-900 dark:text-white focus:outline-none focus:border-gold"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Minimal 8 karakter"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl text-xs bg-gray-50 dark:bg-obsidian-surface border border-gray-200 dark:border-obsidian-border text-gray-900 dark:text-white focus:outline-none focus:border-gold"
                  required
                />
              </div>

              {/* Password Strength Bar */}
              {password.length > 0 && (
                <div className="mt-2">
                  <div className="flex gap-1.5 h-1">
                    <div className={`flex-1 rounded-full ${strength >= 1 ? 'bg-oxblood' : 'bg-gray-200 dark:bg-obsidian-surface'}`}></div>
                    <div className={`flex-1 rounded-full ${strength >= 2 ? 'bg-gold' : 'bg-gray-200 dark:bg-obsidian-surface'}`}></div>
                    <div className={`flex-1 rounded-full ${strength >= 3 ? 'bg-green-500' : 'bg-gray-200 dark:bg-obsidian-surface'}`}></div>
                  </div>
                  <span className="text-[10px] text-gray-500 dark:text-gray-400 mt-1 block">
                    Kekuatan password: {strength === 1 ? 'Lemas' : strength === 2 ? 'Sedang' : 'Kuat & Aman'}
                  </span>
                </div>
              )}
            </div>

            <div className="flex items-center gap-2 pt-2">
              <input
                type="checkbox"
                id="terms"
                checked={agree}
                onChange={(e) => setAgree(e.target.checked)}
                className="rounded border-gray-300 text-gold focus:ring-gold"
                required
              />
              <label htmlFor="terms" className="text-[11px] text-gray-600 dark:text-gray-400">
                Saya menyetujui Syarat & Ketentuan serta Kebijakan Privasi VISCERAL.CO
              </label>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-xl gold-gradient-btn text-obsidian font-extrabold text-xs flex items-center justify-center gap-2 shadow-gold-glow mt-4"
            >
              Daftar & Kirim OTP WhatsApp
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="mt-6 text-center text-xs text-gray-500 dark:text-gray-400">
            Sudah memiliki akun?{' '}
            <Link to="/login" className="text-gold font-bold hover:underline">
              Masuk Di Sini
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
