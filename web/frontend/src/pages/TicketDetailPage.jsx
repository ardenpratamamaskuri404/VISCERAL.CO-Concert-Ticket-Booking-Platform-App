import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import Navbar from '../components/Navbar';
import { QRCodeSVG } from 'qrcode.react';
import { MapPin, Calendar, Clock, ShieldCheck, Ticket, ArrowLeft, Download } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import logoPng from '../assets/logo.png';

export default function TicketDetailPage() {
  const { ticketId } = useParams();
  const { orders, events } = useStore();

  // Find ticket across orders
  let ticketFound = null;
  let orderFound = null;

  orders.forEach((ord) => {
    ord.tickets.forEach((t) => {
      if (t.id === ticketId) {
        ticketFound = t;
        orderFound = ord;
      }
    });
  });

  if (orders.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-brand-bgLight dark:bg-obsidian-dark text-brand-darkText dark:text-brand-lightText">
        <div className="text-center animate-pulse">
          <p className="font-bold text-lg mb-2">Memuat Data Tiket...</p>
        </div>
      </div>
    );
  }

  if (!ticketFound) {
    orderFound = orders[0];
    ticketFound = orderFound?.tickets[0] || {
      id: 'tkt-1',
      ticketCode: 'VSC-TK-VIP-A12',
      seatNumber: 'VIP-A12',
      categoryName: 'VIP VISCERAL EMERALD',
      price: 2500000,
      status: 'ACTIVE'
    };
  }

  const event = events.find((e) => e.id === orderFound?.eventId) || events[0];

  return (
    <div className="min-h-screen bg-brand-bgLight dark:bg-obsidian-dark text-brand-darkText dark:text-brand-lightText transition-colors">
      <Navbar />

      <div className="pt-28 pb-16 px-4 md:px-8 max-w-3xl mx-auto">
        <Link
          to="/my-tickets"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-500 hover:text-gold mb-6"
        >
          <ArrowLeft className="w-4 h-4" /> Kembali ke Tiket Saya
        </Link>

        {/* E-Ticket Card Obsidian Gold Edition */}
        <div className="bg-obsidian text-white rounded-3xl border border-gold/40 shadow-gold-glow overflow-hidden relative">
          
          {/* Top Header Ticket Bar */}
          <div className="p-6 border-b border-obsidian-border bg-obsidian-card flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-obsidian border border-gold/40 flex items-center justify-center p-1.5 shadow-gold-glow">
                <img src={logoPng} alt="VISCERAL.CO" className="w-full h-full object-contain" />
              </div>
              <div>
                <span className="font-extrabold text-sm tracking-wider text-white">
                  VISCERAL<span className="text-gold">.CO</span>
                </span>
                <span className="text-[10px] text-gold font-bold tracking-widest uppercase block -mt-1">
                  OFFICIAL E-TICKET
                </span>
              </div>
            </div>

            <span className="bg-gold/20 text-gold border border-gold/40 text-[10px] font-extrabold px-3 py-1 rounded-full uppercase flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" /> STATUS: {ticketFound.status}
            </span>
          </div>

          <div className="p-6 sm:p-8 space-y-6">
            
            {/* Concert Title & Venue */}
            <div>
              <span className="text-[10px] text-oxblood font-bold tracking-widest uppercase block mb-1">
                Event Konser
              </span>
              <h1 className="text-2xl font-extrabold text-white tracking-tight">
                {event.title}
              </h1>
              <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-gold" /> {event.venueName}
              </p>
            </div>

            {/* Ticket Seat Info Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-2xl bg-obsidian-surface border border-obsidian-border">
              <div>
                <span className="text-[10px] text-gray-400 uppercase tracking-wider block">Kategori</span>
                <span className="text-xs font-extrabold text-gold">{ticketFound.categoryName}</span>
              </div>
              <div>
                <span className="text-[10px] text-gray-400 uppercase tracking-wider block">Nomor Kursi</span>
                <span className="text-sm font-extrabold text-white">{ticketFound.seatNumber}</span>
              </div>
              <div>
                <span className="text-[10px] text-gray-400 uppercase tracking-wider block">Tanggal Event</span>
                <span className="text-xs font-bold text-gray-200">
                  {new Date(event.eventDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-gray-400 uppercase tracking-wider block">Open Gate</span>
                <span className="text-xs font-bold text-gray-200">19:00 WIB</span>
              </div>
            </div>

            {/* QR Code Center Box */}
            <div className="bg-white p-6 rounded-3xl text-center max-w-xs mx-auto shadow-2xl space-y-3">
              <QRCodeSVG
                value={ticketFound.ticketCode}
                size={180}
                bgColor={"#FFFFFF"}
                fgColor={"#14110F"}
                level={"H"}
                includeMargin={true}
                className="mx-auto"
              />
              <p className="font-mono text-xs font-extrabold text-obsidian tracking-wider">
                {ticketFound.ticketCode}
              </p>
              <p className="text-[10px] text-gray-500">
                Tunjukkan QR Code ini pada Scanner Gate Masuk Admin saat konser.
              </p>
            </div>

            {/* Venue Location Map */}
            <div className="pt-4 border-t border-obsidian-border">
              <h4 className="text-xs font-bold uppercase tracking-wider text-gold mb-3 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5" /> Peta Navigasi Venue Konser
              </h4>
              <div className="h-48 w-full rounded-2xl overflow-hidden border border-obsidian-border">
                <MapContainer
                  center={[event.latitude || -6.2088, event.longitude || 106.8456]}
                  zoom={14}
                  scrollWheelZoom={false}
                  className="h-full w-full"
                >
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  <Marker position={[event.latitude || -6.2088, event.longitude || 106.8456]}>
                    <Popup>
                      <div className="text-xs font-bold">
                        {event.venueName}
                      </div>
                    </Popup>
                  </Marker>
                </MapContainer>
              </div>
            </div>

          </div>

          <div className="p-4 bg-obsidian-dark border-t border-obsidian-border text-center">
            <p className="text-[10px] text-gray-500">
              E-Ticket resmi diterbitkan oleh VISCERAL.CO System. Dilarang menggandakan atau memperjualbelikan kode QR ini.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
