import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, MapPin } from 'lucide-react';
import { getImageUrl } from '../../utils/image';

export default function ConcertAtmosphereSection() {
  const atmospheres = [
    { src: 'tulus.png', alt: 'Tulus — Tur Manusia 2026', venue: 'Istora Senayan, Jakarta', type: 'events' },
    { src: 'so7.jpeg', alt: 'Sheila On 7 — Tunggu Aku di Jakarta', venue: 'JIExpo Kemayoran', type: 'events' },
    { src: 'festival-visceral.jpg', alt: 'VISCERAL Festival: The Resonance', venue: 'Gelora Bung Karno Stadium', type: 'events' },
    { src: 'coldplay.jpg', alt: 'Coldplay — Music of the Spheres', venue: 'Stadion Utama Gelora Bung Karno', type: 'events' },
    { src: 'bruno-mars.jpeg', alt: 'Bruno Mars — 24K Magic Tour', venue: 'Jakarta International Stadium', type: 'events' },
    { src: 'bernadya.jpg', alt: 'Bernadya — Satu Kali Saja Concert', venue: 'M Bloc Live House, Jakarta', type: 'events' },
  ];

  return (
    <section className="py-20 px-4 md:px-8 max-w-7xl mx-auto">
      <div className="text-center mb-12">
        <span className="text-xs font-bold text-oxblood uppercase tracking-widest inline-flex items-center gap-1.5 mb-2 px-3 py-1 rounded-full bg-oxblood/10 border border-oxblood/20">
          <Sparkles className="w-3.5 h-3.5 text-gold" />
          Atmosfer Panggung Spektakuler
        </span>
        <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-4">
          Keseruan yang Menanti Anda
        </h2>
        <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400 max-w-xl mx-auto leading-relaxed">
          Rasakan energi panggung megah, harmoni ribuan penonton, dan pengalaman visual tak tertandingi di setiap konser VISCERAL.CO.
        </p>
      </div>

      {/* Balanced, Symmetrical 3x2 Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {atmospheres.map((item, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ delay: i * 0.08, duration: 0.5, ease: 'easeOut' }}
            whileHover={{ y: -6 }}
            className="h-64 sm:h-72 lg:h-80 rounded-[2rem] overflow-hidden relative group border border-gray-200 dark:border-obsidian-border bg-obsidian-surface shadow-md hover:border-gold/50 transition-all duration-500"
          >
            <img 
              src={getImageUrl(item.src, item.type)} 
              alt={item.alt} 
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
            />
            
            {/* Always visible bottom gradient for readability + enhanced on hover */}
            <div className="absolute inset-0 bg-gradient-to-t from-obsidian via-obsidian/40 to-transparent opacity-80 group-hover:opacity-95 transition-opacity duration-300"></div>

            {/* Bottom Content Badge */}
            <div className="absolute bottom-0 left-0 right-0 p-5 transform transition-transform duration-300">
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-gold mb-1">
                <MapPin className="w-3 h-3 text-gold" />
                {item.venue}
              </span>
              <h3 className="text-white font-extrabold text-base md:text-lg tracking-tight group-hover:text-gold transition-colors">
                {item.alt}
              </h3>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
