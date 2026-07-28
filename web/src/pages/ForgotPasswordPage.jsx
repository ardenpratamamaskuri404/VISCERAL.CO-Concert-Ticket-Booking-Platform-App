import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { Mail, ArrowRight, KeyRound } from 'lucide-react';

export default function ForgotPasswordPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSent(true);
    setTimeout(() => {
      navigate('/reset-password');
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-brand-bgLight dark:bg-obsidian-dark flex flex-col justify-between transition-colors">
      <Navbar />

      <div className="flex-1 flex items-center justify-center px-4 pt-32 pb-16">
        <div className="w-full max-w-md bg-white dark:bg-obsidian-card p-8 rounded-3xl border border-gray-200 dark:border-obsidian-border shadow-obsidian-glow relative overflow-hidden">
          
          <div className="pulse-line-oxblood w-full absolute top-0 left-0"></div>

          <div className="w-12 h-12 rounded-2xl bg-obsidian border border-gold/40 flex items-center justify-center p-2.5 mx-auto mb-4 shadow-gold-glow">
            <KeyRound className="w-6 h-6 text-gold" />
          </div>

          <h2 className="text-2xl font-extrabold tracking-tight text-center">Lupa Password?</h2>
          <p className="text-xs text-gray-500 dark:text-gray-400 text-center mt-1 mb-6">
            Masukkan email terdaftar untuk menerima petunjuk reset password via WhatsApp OTP Fonnte.
          </p>

          {sent ? (
            <div className="p-4 rounded-2xl bg-gold/10 border border-gold/30 text-gold text-xs text-center font-semibold">
              Petunjuk reset password dikirim! Mengarahkan ke halaman Reset Password...
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-1">
                  Alamat Email Terdaftar
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="budi@gmail.com"
                    className="w-full pl-10 pr-4 py-3 rounded-xl text-xs bg-gray-50 dark:bg-obsidian-surface border border-gray-200 dark:border-obsidian-border text-gray-900 dark:text-white focus:outline-none focus:border-gold"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-xl gold-gradient-btn text-obsidian font-extrabold text-xs flex items-center justify-center gap-2 shadow-gold-glow mt-4"
              >
                Kirim Petunjuk Reset
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          <div className="mt-6 text-center text-xs">
            <Link to="/login" className="text-gray-500 hover:text-gold font-semibold">
              ← Kembali ke Halaman Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
