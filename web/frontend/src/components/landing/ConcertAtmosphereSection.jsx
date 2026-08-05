import React from 'react';
import { motion } from 'framer-motion';
import { getImageUrl } from '../../utils/image';

export default function ConcertAtmosphereSection() {
  return (
    <section className="py-16 px-4 md:px-8 max-w-7xl mx-auto">
      <div className="text-center mb-12">
        <span className="text-xs font-bold text-oxblood uppercase tracking-widest block mb-2">Atmosfer Panggung</span>
        <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-4">Keseruan yang Menanti Anda</h2>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {[
          { src: 'tulus.png', alt: 'Tulus Live', type: 'events' },
          { src: 'so7.jpeg', alt: 'Sheila On 7', type: 'events' },
          { src: 'festival-visceral.jpg', alt: 'Festival Crowd', type: 'events' },
          { src: 'coldplay.jpg', alt: 'Coldplay Concert', type: 'events' },
          { src: 'bruno-mars.jpeg', alt: 'Bruno Mars', type: 'events' },
          { src: 'bernadya.jpg', alt: 'Bernadya', type: 'events' },
        ].map((img, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1, duration: 0.5 }}
            className={`overflow-hidden rounded-2xl bg-obsidian border border-gold/10 flex items-center justify-center relative group ${i === 0 || i === 5 ? 'md:row-span-2 h-64 md:h-full' : 'h-48 md:h-64'}`}
          >
            <img 
              src={getImageUrl(img.src, img.type)} 
              alt={img.alt} 
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-obsidian/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
              <span className="text-white font-bold text-sm">{img.alt}</span>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
