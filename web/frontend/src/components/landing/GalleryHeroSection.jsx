import React, { forwardRef } from 'react';
import { motion } from 'framer-motion';

const GalleryHeroSection = forwardRef((props, ref) => {
  // Menduplikasi gambar untuk efek infinite scroll yang mulus
  const images = [
    "/images/banner1.png",
    "/images/banner2.png",
    "/images/banner3.png",
    "/images/banner1.png",
    "/images/banner2.png",
    "/images/banner3.png",
  ];

  return (
    <section className="py-20 bg-obsidian text-white overflow-hidden" ref={ref}>
      <div className="max-w-7xl mx-auto px-4 md:px-8 mb-10">
        <h2 className="text-3xl md:text-4xl font-extrabold gold-gradient-text">Momen Magis Konser</h2>
        <p className="text-gray-400 mt-2">Atmosfer yang tak tergantikan dari setiap panggung.</p>
      </div>
      
      {/* Infinite Auto-Scrolling Marquee */}
      <div className="relative w-full flex overflow-hidden">
        {/* Gradient shadow untuk memberikan efek fade di pinggiran (opsional, tapi membuat mewah) */}
        <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-obsidian to-transparent z-10 pointer-events-none"></div>
        <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-obsidian to-transparent z-10 pointer-events-none"></div>

        <motion.div 
          className="flex gap-6 w-max px-4"
          animate={{ x: ["0%", "-50%"] }}
          transition={{ ease: "linear", duration: 25, repeat: Infinity }}
        >
          {images.map((src, i) => (
            <div key={i} className="gallery-item w-[85vw] md:w-[45vw] lg:w-[35vw] h-64 md:h-96 rounded-3xl overflow-hidden shadow-2xl flex-shrink-0 border border-gold/10">
              <img src={src} alt={`Concert Euphoria ${i}`} className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
});

export default GalleryHeroSection;
