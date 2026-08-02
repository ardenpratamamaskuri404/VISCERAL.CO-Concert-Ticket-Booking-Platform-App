import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, MapPin, Calendar, Clock } from 'lucide-react';
import { getImageUrl } from '../../utils/image';

export default function FeaturedEventsSection({ events }) {
  return (
    <section className="py-16 px-4 md:px-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-10">
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
        >
          <span className="text-xs font-bold text-oxblood uppercase tracking-widest block mb-2">
            Event Mendatang
          </span>
          <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight">Konser Unggulan <br/>Musisi Papan Atas</h2>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
        >
          <Link
            to="/explore"
            className="inline-flex items-center gap-1.5 text-sm font-bold text-gold hover:underline mt-6 md:mt-0 px-6 py-3 border border-gold/30 rounded-full hover:bg-gold/10 transition-colors"
          >
            Lihat Semua Konser <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>
      </div>

      {events.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8" style={{ perspective: "1200px" }}>
          {events.slice(0, 6).map((event, index) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, y: 50, rotateX: 10 }}
              whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.7, delay: index * 0.15 }}
              whileHover={{ y: -10, scale: 1.02 }}
              className="bg-white dark:bg-obsidian-card rounded-[2rem] overflow-hidden border border-gray-200 dark:border-obsidian-border shadow-obsidian-glow group hover:border-gold/50 transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={getImageUrl(event.bannerUrl || event.banner_url, 'events')}
                    alt={event.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-obsidian via-transparent to-transparent opacity-90"></div>
                  
                  {(event.salesClosed || event.sales_closed) ? (
                    <span className="absolute top-5 right-5 bg-oxblood text-white text-[10px] font-extrabold uppercase px-3 py-1.5 rounded-full shadow-lg">
                      Penjualan Ditutup
                    </span>
                  ) : (
                    <span className="absolute top-5 right-5 bg-gold text-obsidian text-[10px] font-extrabold uppercase px-3 py-1.5 rounded-full shadow-gold-glow">
                      Tersedia
                    </span>
                  )}

                  <div className="absolute bottom-4 left-5 right-5 text-white">
                    <span className="text-xs font-medium text-gold flex items-center gap-1 mb-2">
                      <MapPin className="w-3.5 h-3.5" /> {event.venueName || event.venue_name}
                    </span>
                    <h3 className="text-xl font-extrabold leading-tight group-hover:text-gold transition-colors">
                      {event.title}
                    </h3>
                  </div>
                </div>

                <div className="p-6">
                  <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-3 mb-5 leading-relaxed">
                    {event.description}
                  </p>

                  <div className="flex items-center gap-5 text-sm text-gray-600 dark:text-gray-300 mb-5 pb-5 border-b border-gray-100 dark:border-obsidian-border">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-gold" />
                      <span className="font-medium">{new Date(event.eventDate || event.event_date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-gold" />
                      <span className="font-medium">19:00 WIB</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="px-6 pb-6 flex items-center justify-between">
                <div>
                  <span className="text-xs text-gray-400 uppercase tracking-wider block mb-1">Mulai Dari</span>
                  <span className="text-xl font-black text-gold">
                    Rp {(event.categories?.[0]?.price || 0).toLocaleString('id-ID')}
                  </span>
                </div>

                <Link
                  to={`/event/${event.id}`}
                  className="px-5 py-2.5 rounded-full bg-obsidian text-white hover:text-gold border border-gold/30 hover:border-gold text-sm font-bold transition-all shadow-md hover:shadow-gold-glow"
                >
                  Detail
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { title: 'Coldplay: Music of the Spheres', venue: 'GBK Stadium, Jakarta', img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8c/Coldplay_-_Music_of_the_Spheres_World_Tour_%28cropped%29.jpg/1200px-Coldplay_-_Music_of_the_Spheres_World_Tour_%28cropped%29.jpg', price: 'Rp 800.000' },
            { title: 'Taylor Swift: The Eras Tour', venue: 'GBK Stadium, Jakarta', img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d7/Taylor_Swift_at_the_2023_MTV_VMAs_%283%29.png/800px-Taylor_Swift_at_the_2023_MTV_VMAs_%283%29.png', price: 'Rp 1.200.000' },
            { title: 'Bruno Mars: 24K Magic Tour', venue: 'GBK Stadium, Jakarta', img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/Bruno_Mars%2C_Las_Vegas_%28cropped%29.jpg/800px-Bruno_Mars%2C_Las_Vegas_%28cropped%29.jpg', price: 'Rp 1.200.000' },
          ].map((card, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.2, duration: 0.6 }}
              className="bg-white dark:bg-obsidian-card rounded-[2rem] overflow-hidden border border-gray-200 dark:border-obsidian-border shadow-obsidian-glow group hover:border-gold/50 transition-all duration-300"
            >
              <div className="relative h-64 overflow-hidden">
                <img src={card.img} alt={card.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-obsidian via-transparent to-transparent opacity-90"></div>
                <span className="absolute top-5 right-5 bg-gold text-obsidian text-[10px] font-extrabold uppercase px-3 py-1.5 rounded-full shadow-gold-glow">Coming Soon</span>
                <div className="absolute bottom-4 left-5 right-5 text-white">
                  <span className="text-xs font-medium text-gold flex items-center gap-1 mb-2"><MapPin className="w-3.5 h-3.5" /> {card.venue}</span>
                  <h3 className="text-xl font-extrabold leading-tight">{card.title}</h3>
                </div>
              </div>
              <div className="p-6 flex items-center justify-between">
                <div>
                  <span className="text-xs text-gray-400 uppercase tracking-wider block mb-1">Mulai Dari</span>
                  <span className="text-xl font-black text-gold">{card.price}</span>
                </div>
                <Link to="/explore" className="px-5 py-2.5 rounded-full bg-obsidian text-white hover:text-gold border border-gold/30 hover:border-gold text-sm font-bold transition-all shadow-md hover:shadow-gold-glow">
                  Lihat
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </section>
  );
}
