import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useStore } from '../context/StoreContext';
import Navbar from '../components/Navbar';
import { Mail, Lock, User, Phone, ArrowRight, CheckCircle2, ShieldCheck } from 'lucide-react';
import logoSvg from '../assets/logo.svg';

export default function RegisterPage() {
  const navigate = useNavigate();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agree, setAgree] = useState(false); // Manual persetujuan, default false
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const { loginUser } = useStore();

  // Realtime password strength calculation
  const getPasswordStrength = () => {
    if (!password) return { score: 0, label: '', color: '', barColor: '' };
    let score = 0;
    if (password.length >= 8) score += 1;
    if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score += 1;
    if (/[0-9]/.test(password) || /[^A-Za-z0-9]/.test(password)) score += 1;

    if (score === 1) return { score: 1, label: 'Lemah', color: 'text-red-500', barColor: 'bg-red-500' };
    if (score === 2) return { score: 2, label: 'Sedang', color: 'text-amber-500', barColor: 'bg-amber-500' };
    if (score >= 3) return { score: 3, label: 'Kuat & Aman', color: 'text-emerald-500', barColor: 'bg-emerald-500' };
    return { score: 1, label: 'Lemah', color: 'text-red-500', barColor: 'bg-red-500' };
  };

  const strength = getPasswordStrength();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!fullName || !email || !phone || !password || !confirmPassword) {
      setErrorMsg('Harap lengkapi semua field pendaftaran.');
      return;
    }

    if (!agree) {
      setErrorMsg('Anda wajib menyetujui Syarat & Ketentuan serta Kebijakan Privasi.');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMsg('Konfirmasi password tidak cocok dengan password yang dimasukkan.');
      return;
    }

    if (password.length < 8) {
      setErrorMsg('Password minimal harus terdiri dari 8 karakter.');
      return;
    }
    
    setLoading(true);
    setErrorMsg('');
    try {
      const response = await api.post('/auth/register', {
        fullName,
        email,
        phoneNumber: phone,
        password
      });
      
      loginUser(response.data.user, response.data.token);
      navigate('/');
    } catch (error) {
      setErrorMsg(error.response?.data?.error || 'Terjadi kesalahan saat registrasi.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-brand-bgLight dark:bg-obsidian-dark flex flex-col justify-between transition-colors">
      <Navbar />

      <div className="flex-1 flex items-center justify-center px-4 pt-32 pb-16">
        <div className="w-full max-w-md bg-white dark:bg-obsidian-card p-8 rounded-3xl border border-gray-200 dark:border-obsidian-border shadow-obsidian-glow relative overflow-hidden">
          
          <div className="pulse-line-oxblood w-full absolute top-0 left-0"></div>

          <div className="text-center mb-6">
            <div className="w-16 h-16 rounded-full bg-obsidian border border-gold/40 flex items-center justify-center overflow-hidden mx-auto mb-3 shadow-gold-glow">
              <img src={logoSvg} alt="VISCERAL.CO" className="w-full h-full object-cover scale-105" />
            </div>
            <h2 className="text-2xl font-extrabold tracking-tight">Daftar Akun Baru</h2>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Daftarkan akun resmi untuk kemudahan akses dan pemesanan tiket konser VISCERAL.CO
            </p>
          </div>

          {errorMsg && (
            <div className="mb-4 p-3 rounded-xl bg-oxblood/10 border border-oxblood text-oxblood text-xs font-bold text-center">
              {errorMsg}
            </div>
          )}

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
                  placeholder="Nama sesuai identitas resmi (KTP)"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl text-xs bg-gray-50 dark:bg-obsidian-surface border border-gray-200 dark:border-obsidian-border text-gray-900 dark:text-white focus:outline-none focus:border-gold transition-colors"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-1">
                Alamat Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="nama@email.com"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl text-xs bg-gray-50 dark:bg-obsidian-surface border border-gray-200 dark:border-obsidian-border text-gray-900 dark:text-white focus:outline-none focus:border-gold transition-colors"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-1">
                Nomor Telepon / WhatsApp
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+62 812 3456 7890"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl text-xs bg-gray-50 dark:bg-obsidian-surface border border-gray-200 dark:border-obsidian-border text-gray-900 dark:text-white focus:outline-none focus:border-gold transition-colors"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-1">
                Kata Sandi
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Minimal 8 karakter"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl text-xs bg-gray-50 dark:bg-obsidian-surface border border-gray-200 dark:border-obsidian-border text-gray-900 dark:text-white focus:outline-none focus:border-gold transition-colors"
                  required
                />
              </div>

              {/* Realtime Password Strength Bar */}
              {password.length > 0 && (
                <div className="mt-2 transition-all">
                  <div className="flex gap-1.5 h-1.5">
                    <div className={`flex-1 rounded-full transition-all duration-300 ${strength.score >= 1 ? strength.barColor : 'bg-gray-200 dark:bg-obsidian-surface'}`}></div>
                    <div className={`flex-1 rounded-full transition-all duration-300 ${strength.score >= 2 ? strength.barColor : 'bg-gray-200 dark:bg-obsidian-surface'}`}></div>
                    <div className={`flex-1 rounded-full transition-all duration-300 ${strength.score >= 3 ? strength.barColor : 'bg-gray-200 dark:bg-obsidian-surface'}`}></div>
                  </div>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-[10px] text-gray-500 dark:text-gray-400">Keamanan Password:</span>
                    <span className={`text-[10px] font-bold ${strength.color}`}>
                      {strength.label}
                    </span>
                  </div>
                </div>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-1">
                Konfirmasi Kata Sandi
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Ulangi kata sandi minimal 8 karakter"
                  className={`w-full pl-10 pr-4 py-2.5 rounded-xl text-xs bg-gray-50 dark:bg-obsidian-surface border text-gray-900 dark:text-white focus:outline-none transition-colors ${
                    confirmPassword && password !== confirmPassword 
                      ? 'border-red-500 focus:border-red-500' 
                      : confirmPassword && password === confirmPassword
                      ? 'border-emerald-500 focus:border-emerald-500'
                      : 'border-gray-200 dark:border-obsidian-border focus:border-gold'
                  }`}
                  required
                />
              </div>
              {confirmPassword.length > 0 && password !== confirmPassword && (
                <span className="text-[10px] text-red-500 font-semibold mt-1 block">
                  Konfirmasi password belum cocok
                </span>
              )}
              {confirmPassword.length > 0 && password === confirmPassword && (
                <span className="text-[10px] text-emerald-500 font-semibold mt-1 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Password cocok
                </span>
              )}
            </div>

            {/* Manual Checkbox Persetujuan */}
            <div className="flex items-start gap-2.5 pt-2">
              <input
                type="checkbox"
                id="terms"
                checked={agree}
                onChange={(e) => setAgree(e.target.checked)}
                className="mt-0.5 w-4 h-4 rounded border-gray-300 dark:border-obsidian-border text-gold focus:ring-gold cursor-pointer accent-[#C89B3C]"
                required
              />
              <label htmlFor="terms" className="text-[11px] text-gray-600 dark:text-gray-400 cursor-pointer select-none leading-relaxed">
                Saya menyetujui <span className="text-gold font-semibold hover:underline">Syarat & Ketentuan</span> serta <span className="text-gold font-semibold hover:underline">Kebijakan Privasi</span> resmi VISCERAL.CO
              </label>
            </div>

            <button
              type="submit"
              disabled={loading || !agree || (confirmPassword.length > 0 && password !== confirmPassword)}
              className="w-full py-3.5 rounded-xl gold-gradient-btn text-obsidian font-extrabold text-xs flex items-center justify-center gap-2 shadow-gold-glow mt-4 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-all"
            >
              {loading ? 'Memproses Pendaftaran...' : 'Daftar Akun Baru'}
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
