import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { LayoutDashboard, Calendar, CheckSquare, Users, FileText, ArrowLeft, LogOut, ShieldCheck, Sparkles } from 'lucide-react';
import logoPng from '../assets/logo.png';

export default function AdminSidebar() {
  const { currentUser, logoutUser } = useStore();
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path) => location.pathname === path;

  const isSuperadmin = currentUser?.role === 'SUPERADMIN';

  return (
    <aside className="w-64 bg-obsidian text-brand-lightText border-r border-obsidian-border flex flex-col justify-between h-screen sticky top-0 z-40">
      <div>
        {/* Sidebar Header / Logo */}
        <div className="p-5 border-b border-obsidian-border flex items-center justify-between">
          <Link to="/admin/dashboard" className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-obsidian-surface border border-gold/40 flex items-center justify-center p-1.5 shadow-gold-glow">
              <img src={logoPng} alt="VISCERAL.CO" className="w-full h-full object-contain" />
            </div>
            <div>
              <h1 className="font-extrabold text-sm tracking-wider text-white">
                VISCERAL<span className="text-gold">.CO</span>
              </h1>
              <span className="text-[10px] text-oxblood font-bold tracking-widest uppercase block -mt-1">
                Admin Panel
              </span>
            </div>
          </Link>
        </div>

        {/* Navigation Menu */}
        <nav className="p-3 space-y-1">
          <p className="px-3 text-[10px] uppercase font-bold text-gray-400 tracking-wider mb-2">
            Main Menu
          </p>

          <Link
            to="/admin/dashboard"
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${
              isActive('/admin/dashboard')
                ? 'bg-gold text-obsidian font-bold shadow-gold-glow'
                : 'text-gray-300 hover:bg-obsidian-surface hover:text-gold'
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            Dashboard Monitoring
          </Link>

          <Link
            to="/admin/events"
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${
              isActive('/admin/events')
                ? 'bg-gold text-obsidian font-bold shadow-gold-glow'
                : 'text-gray-300 hover:bg-obsidian-surface hover:text-gold'
            }`}
          >
            <Calendar className="w-4 h-4" />
            Kelola Event & Artis
          </Link>

          <Link
            to="/admin/verification"
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${
              isActive('/admin/verification')
                ? 'bg-gold text-obsidian font-bold shadow-gold-glow'
                : 'text-gray-300 hover:bg-obsidian-surface hover:text-gold'
            }`}
          >
            <CheckSquare className="w-4 h-4" />
            Verifikasi & Refund
          </Link>

          {isSuperadmin && (
            <>
              <p className="px-3 text-[10px] uppercase font-bold text-gold tracking-wider mt-4 mb-2 flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                Superadmin Only
              </p>

              <Link
                to="/admin/users"
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${
                  isActive('/admin/users')
                    ? 'bg-gold text-obsidian font-bold shadow-gold-glow'
                    : 'text-gray-300 hover:bg-obsidian-surface hover:text-gold'
                }`}
              >
                <Users className="w-4 h-4" />
                Kelola User & Audit Log
              </Link>

              <Link
                to="/admin/reports"
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${
                  isActive('/admin/reports')
                    ? 'bg-gold text-obsidian font-bold shadow-gold-glow'
                    : 'text-gray-300 hover:bg-obsidian-surface hover:text-gold'
                }`}
              >
                <FileText className="w-4 h-4" />
                Laporan Penjualan
              </Link>
            </>
          )}
        </nav>
      </div>

      {/* Sidebar Footer / User Profile */}
      <div className="p-3 border-t border-obsidian-border bg-obsidian-dark/50">
        <Link
          to="/explore"
          className="flex items-center justify-center gap-2 w-full py-2 mb-3 rounded-xl bg-obsidian-surface text-gray-300 hover:text-gold text-xs font-semibold border border-obsidian-border"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Ke Web Customer
        </Link>

        <div className="flex items-center justify-between bg-obsidian-surface p-2.5 rounded-xl border border-obsidian-border">
          <div className="flex items-center gap-2 overflow-hidden">
            <div className="w-8 h-8 rounded-full bg-gold text-obsidian font-bold flex items-center justify-center text-xs shrink-0">
              {currentUser ? currentUser.fullName.charAt(0) : 'A'}
            </div>
            <div className="truncate">
              <p className="text-xs font-bold text-white truncate">
                {currentUser ? currentUser.fullName : 'Admin'}
              </p>
              <span className="inline-block text-[9px] font-extrabold uppercase px-1.5 py-0.2 rounded bg-oxblood text-white">
                {currentUser?.role || 'ADMIN'}
              </span>
            </div>
          </div>
          <button
            onClick={() => {
              logoutUser();
              navigate('/landing');
            }}
            className="p-1.5 rounded-lg text-gray-400 hover:text-oxblood-light hover:bg-obsidian"
            title="Logout"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}
