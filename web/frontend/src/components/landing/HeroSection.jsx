import React, { forwardRef } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sparkles, ChevronRight, Ticket } from 'lucide-react';

const HeroSection = forwardRef(({ currentUser }, ref) => {
  // Framer Motion variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2, delayChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
  };

  return (
    <section ref={ref} className="relative pt-32 pb-20 px-4 md:px-8 mx-auto overflow-hidden min-h-[90vh] flex items-center justify-center">
      
      {/* Video Background */}
      <div className="absolute inset-0 w-full h-full z-0 overflow-hidden bg-obsidian-dark">
        <div className="absolute inset-0 bg-brand-bgLight/80 dark:bg-obsidian-dark/70 z-10"></div> {/* Overlay to blend with theme */}
        <video 
          autoPlay 
          loop 
          muted 
          playsInline
          onEnded={(e) => {
            e.target.currentTime = 0;
            e.target.play();
          }}
          className="absolute inset-0 w-full h-full object-cover z-0 opacity-80"
        >
          <source src="/concert-bg.mp4" type="video/mp4" />
          Browser Anda tidak mendukung tag video.
        </video>
      </div>

      <div className="hero-glow-1 absolute top-20 left-1/2 -translate-x-1/2 w-96 h-96 bg-gold/30 rounded-full blur-[100px] pointer-events-none z-0"></div>
      <div className="hero-glow-2 absolute bottom-0 right-10 w-72 h-72 bg-oxblood/30 rounded-full blur-[100px] pointer-events-none z-0"></div>

      <motion.div 
        className="text-center max-w-4xl mx-auto relative z-10"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-obsidian text-gold border border-gold/40 text-xs font-semibold shadow-gold-glow mb-6">
          <Sparkles className="w-3.5 h-3.5 animate-pulse" />
          <span>Elevasi Pengalaman Menikmati Musik Hidup</span>
        </motion.div>

        <motion.h1 variants={itemVariants} className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight leading-[1.1] mb-6">
          {currentUser ? (
            <>Selamat Datang, <br/><span className="gold-gradient-text drop-shadow-lg">{currentUser.fullName.split(' ')[0]}</span></>
          ) : (
            <>Rasakan Euforia & <br /><span className="gold-gradient-text drop-shadow-lg">Atmosfer Konser Nyata</span></>
          )}
        </motion.h1>

        <motion.div variants={itemVariants} className="pulse-line-oxblood max-w-md mx-auto my-8 rounded-full h-1"></motion.div>

        <motion.p variants={itemVariants} className="text-base sm:text-xl text-gray-700 dark:text-gray-300 max-w-2xl mx-auto font-normal leading-relaxed mb-10">
          VISCERAL.CO adalah platform resmi yang menghubungkanmu dengan artis favorit. Nikmati kemudahan memesan tiket konser impian dengan sistem yang aman, cepat, dan transparan. Jadilah bagian dari momen bersejarah yang tak terlupakan.
        </motion.p>

        <motion.div variants={itemVariants} className="flex flex-wrap justify-center items-center gap-6">
          <Link
            to="/explore"
            className="px-8 py-4 rounded-full gold-gradient-btn text-obsidian font-extrabold text-sm flex items-center gap-2 shadow-gold-glow hover:scale-105 transition-transform"
          >
            <Ticket className="w-4 h-4" />
            Jelajahi Kurasi Event
            <ChevronRight className="w-4 h-4" />
          </Link>

          {!currentUser ? (
            <Link
              to="/register"
              className="px-8 py-4 rounded-full bg-obsidian text-white hover:text-gold border border-gold/30 font-bold text-sm flex items-center gap-2 transition-all hover:border-gold hover:shadow-[0_0_15px_rgba(200,155,60,0.3)]"
            >
              Bergabung Sekarang
            </Link>
          ) : (
            <Link
              to={currentUser.role === 'CUSTOMER' ? "/my-tickets" : "/admin/dashboard"}
              className="px-8 py-4 rounded-full bg-obsidian text-white hover:text-gold border border-gold/30 font-bold text-sm flex items-center gap-2 transition-all hover:border-gold hover:shadow-[0_0_15px_rgba(200,155,60,0.3)]"
            >
              {currentUser.role === 'CUSTOMER' ? 'Koleksi Tiket Saya' : 'Akses Dashboard'}
            </Link>
          )}
        </motion.div>
      </motion.div>
    </section>
  );
});

export default HeroSection;
