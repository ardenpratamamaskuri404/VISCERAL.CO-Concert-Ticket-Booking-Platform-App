import React from 'react';
import { Zap, Shield, Ticket } from 'lucide-react';
import TiltCard from '../TiltCard';

export default function FeaturesSection() {
  return (
    <section className="py-24 px-4 md:px-8 max-w-7xl mx-auto relative z-10">
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-4">Mendefinisikan Ulang Akses Eksklusif</h2>
        <p className="text-gray-500 dark:text-gray-400">Teknologi premium yang memastikan perjalanan mulus Anda menuju momen tak terlupakan.</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto" style={{ perspective: "1000px" }}>
        <TiltCard className="glass-pill p-8 rounded-3xl border border-gold/20 bg-white/50 dark:bg-obsidian-card/80 backdrop-blur-xl">
          <div className="w-14 h-14 rounded-2xl bg-obsidian text-gold flex items-center justify-center mb-6 shadow-gold-glow">
            <Zap className="w-7 h-7" />
          </div>
          <h3 className="text-xl font-bold mb-3">Reservasi Presisi</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
            Sistem penguncian kursi real-time yang membebaskan Anda dari kecemasan bentrok reservasi. Amankan posisi impian Anda dengan tenang.
          </p>
        </TiltCard>

        <TiltCard className="glass-pill p-8 rounded-3xl border border-gold/20 bg-white/50 dark:bg-obsidian-card/80 backdrop-blur-xl">
          <div className="w-14 h-14 rounded-2xl bg-obsidian text-gold flex items-center justify-center mb-6 shadow-gold-glow">
            <Shield className="w-7 h-7" />
          </div>
          <h3 className="text-xl font-bold mb-3">Keamanan Transaksi</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
            Gerbang pembayaran berlapis ganda yang melindungi setiap transaksi Anda, menghadirkan validasi instan dalam sentuhan magis.
          </p>
        </TiltCard>

        <TiltCard className="glass-pill p-8 rounded-3xl border border-gold/20 bg-white/50 dark:bg-obsidian-card/80 backdrop-blur-xl">
          <div className="w-14 h-14 rounded-2xl bg-obsidian text-gold flex items-center justify-center mb-6 shadow-gold-glow">
            <Ticket className="w-7 h-7" />
          </div>
          <h3 className="text-xl font-bold mb-3">Akses Digital Premium</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
            Kredensial elektronik instan dengan enkripsi QR tingkat lanjut. Tanpa antrian penukaran tiket, langsung menuju kemegahan panggung.
          </p>
        </TiltCard>
      </div>
    </section>
  );
}
