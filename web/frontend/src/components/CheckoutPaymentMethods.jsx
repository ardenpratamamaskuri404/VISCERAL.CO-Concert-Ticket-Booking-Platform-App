import React from 'react';
import { Building, ChevronDown, ChevronUp } from 'lucide-react';

export default function CheckoutPaymentMethods({ paymentMethod, setPaymentMethod, isVADropdownOpen, setIsVADropdownOpen }) {
  return (
    <div className="bg-white dark:bg-obsidian-card p-6 rounded-3xl border border-gray-200 dark:border-obsidian-border shadow-sm transition-colors">
      <h3 className="text-base font-extrabold text-gray-900 dark:text-white mb-4 pb-2 border-b border-gray-200 dark:border-obsidian-border flex items-center justify-between">
        <span>Pilih Metode Pembayaran</span>
        <span className="text-[10px] font-extrabold bg-gold/10 text-gold px-2.5 py-1 rounded-full uppercase tracking-wider">
          Metode Pembayaran Resmi
        </span>
      </h3>

      <div className="space-y-3">
        {/* VIRTUAL ACCOUNT DROPDOWN */}
        <div className="border border-gray-200 dark:border-obsidian-border rounded-2xl overflow-hidden bg-gray-50 dark:bg-obsidian-surface">
          <div 
            className="p-4 flex items-center justify-between cursor-pointer hover:bg-gray-100 dark:hover:bg-obsidian-border/60 transition-colors"
            onClick={() => setIsVADropdownOpen(!isVADropdownOpen)}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-obsidian text-gold border border-gold/20 flex items-center justify-center font-bold">
                <Building className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-extrabold text-xs text-gray-900 dark:text-white">Virtual Account Bank</h4>
                <p className="text-[11px] text-gray-500 dark:text-gray-400">
                  Pilih bank untuk transfer otomatis
                </p>
              </div>
            </div>
            <div className="text-gray-500 dark:text-gray-400">
              {isVADropdownOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
            </div>
          </div>

          {isVADropdownOpen && (
            <div className="p-3 border-t border-gray-200 dark:border-obsidian-border bg-white dark:bg-obsidian-dark flex flex-col gap-2">
              <label
                onClick={() => setPaymentMethod('MANDIRI_VA')}
                className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                  paymentMethod === 'MANDIRI_VA'
                    ? 'border-gold bg-gold/10 dark:bg-gold/10 shadow-gold-glow'
                    : 'border-transparent hover:border-gold/50 hover:bg-gray-50 dark:hover:bg-obsidian-surface/60'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-8 flex items-center justify-center bg-white rounded p-1 border border-gray-200 dark:border-obsidian-border">
                    <img src="/logos/mandiri.svg" alt="Mandiri" className="w-full h-full object-contain" />
                  </div>
                  <div>
                    <h4 className="font-bold text-xs text-gray-900 dark:text-white">Mandiri Virtual Account</h4>
                  </div>
                </div>
                <input type="radio" checked={paymentMethod === 'MANDIRI_VA'} readOnly className="accent-[#C89B3C] cursor-pointer" />
              </label>

              <label
                onClick={() => setPaymentMethod('BCA_VA')}
                className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                  paymentMethod === 'BCA_VA'
                    ? 'border-gold bg-gold/10 dark:bg-gold/10 shadow-gold-glow'
                    : 'border-transparent hover:border-gold/50 hover:bg-gray-50 dark:hover:bg-obsidian-surface/60'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-8 flex items-center justify-center bg-white rounded p-1 border border-gray-200 dark:border-obsidian-border">
                    <img src="/logos/bca.svg" alt="BCA" className="w-full h-full object-contain" />
                  </div>
                  <div>
                    <h4 className="font-bold text-xs text-gray-900 dark:text-white">BCA Virtual Account</h4>
                  </div>
                </div>
                <input type="radio" checked={paymentMethod === 'BCA_VA'} readOnly className="accent-[#C89B3C] cursor-pointer" />
              </label>

              <label
                onClick={() => setPaymentMethod('BRI_VA')}
                className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                  paymentMethod === 'BRI_VA'
                    ? 'border-gold bg-gold/10 dark:bg-gold/10 shadow-gold-glow'
                    : 'border-transparent hover:border-gold/50 hover:bg-gray-50 dark:hover:bg-obsidian-surface/60'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-8 flex items-center justify-center bg-white rounded p-1 border border-gray-200 dark:border-obsidian-border">
                    <img src="/logos/bri.svg" alt="BRI" className="w-full h-full object-contain" />
                  </div>
                  <div>
                    <h4 className="font-bold text-xs text-gray-900 dark:text-white">BRI Virtual Account</h4>
                  </div>
                </div>
                <input type="radio" checked={paymentMethod === 'BRI_VA'} readOnly className="accent-[#C89B3C] cursor-pointer" />
              </label>

              <label
                onClick={() => setPaymentMethod('BNI_VA')}
                className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                  paymentMethod === 'BNI_VA'
                    ? 'border-gold bg-gold/10 dark:bg-gold/10 shadow-gold-glow'
                    : 'border-transparent hover:border-gold/50 hover:bg-gray-50 dark:hover:bg-obsidian-surface/60'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-8 flex items-center justify-center bg-white rounded p-1 border border-gray-200 dark:border-obsidian-border">
                    <img src="/logos/bni.svg" alt="BNI" className="w-full h-full object-contain" />
                  </div>
                  <div>
                    <h4 className="font-bold text-xs text-gray-900 dark:text-white">BNI Virtual Account</h4>
                  </div>
                </div>
                <input type="radio" checked={paymentMethod === 'BNI_VA'} readOnly className="accent-[#C89B3C] cursor-pointer" />
              </label>
            </div>
          )}
        </div>

        <label
          onClick={() => setPaymentMethod('DOKU_QRIS')}
          className={`p-4 rounded-2xl border flex items-center justify-between cursor-pointer transition-all ${
            paymentMethod === 'DOKU_QRIS'
              ? 'border-gold bg-gold/10 dark:bg-gold/10 shadow-gold-glow'
              : 'border-gray-200 dark:border-obsidian-border bg-gray-50 dark:bg-obsidian-surface hover:border-gold/50 hover:bg-gray-100 dark:hover:bg-obsidian-border/60'
          }`}
        >
          <div className="flex items-center gap-3">
            <div className="w-12 h-8 flex items-center justify-center bg-white rounded p-1 border border-gray-200 dark:border-obsidian-border">
              <img src="/logos/qris.svg" alt="QRIS" className="w-full h-full object-contain" />
            </div>
            <div>
              <h4 className="font-extrabold text-xs text-gray-900 dark:text-white">QRIS</h4>
              <p className="text-[11px] text-gray-500 dark:text-gray-400">
                Scan QRIS dari aplikasi GoPay, M-Banking, dll
              </p>
            </div>
          </div>
          <input type="radio" readOnly checked={paymentMethod === 'DOKU_QRIS'} className="accent-[#C89B3C] cursor-pointer" />
        </label>

        <label
          onClick={() => setPaymentMethod('SHOPEEPAY')}
          className={`p-4 rounded-2xl border flex items-center justify-between cursor-pointer transition-all ${
            paymentMethod === 'SHOPEEPAY'
              ? 'border-gold bg-gold/10 dark:bg-gold/10 shadow-gold-glow'
              : 'border-gray-200 dark:border-obsidian-border bg-gray-50 dark:bg-obsidian-surface hover:border-gold/50 hover:bg-gray-100 dark:hover:bg-obsidian-border/60'
          }`}
        >
          <div className="flex items-center gap-3">
            <div className="w-12 h-8 flex items-center justify-center bg-white rounded p-1 border border-gray-200 dark:border-obsidian-border">
              <img src="/logos/shopee.svg" alt="ShopeePay" className="w-full h-full object-contain" />
            </div>
            <div>
              <h4 className="font-extrabold text-xs text-gray-900 dark:text-white">ShopeePay</h4>
              <p className="text-[11px] text-gray-500 dark:text-gray-400">Bayar instan via aplikasi Shopee</p>
            </div>
          </div>
          <input type="radio" readOnly checked={paymentMethod === 'SHOPEEPAY'} className="accent-[#C89B3C] cursor-pointer" />
        </label>

        <label
          onClick={() => setPaymentMethod('OVO')}
          className={`p-4 rounded-2xl border flex items-center justify-between cursor-pointer transition-all ${
            paymentMethod === 'OVO'
              ? 'border-gold bg-gold/10 dark:bg-gold/10 shadow-gold-glow'
              : 'border-gray-200 dark:border-obsidian-border bg-gray-50 dark:bg-obsidian-surface hover:border-gold/50 hover:bg-gray-100 dark:hover:bg-obsidian-border/60'
          }`}
        >
          <div className="flex items-center gap-3">
            <div className="w-12 h-8 flex items-center justify-center bg-white rounded p-1 border border-gray-200 dark:border-obsidian-border">
              <img src="/logos/ovo.svg" alt="OVO" className="w-full h-full object-contain" />
            </div>
            <div>
              <h4 className="font-extrabold text-xs text-gray-900 dark:text-white">OVO</h4>
              <p className="text-[11px] text-gray-500 dark:text-gray-400">Bayar mudah dengan OVO Cash</p>
            </div>
          </div>
          <input type="radio" readOnly checked={paymentMethod === 'OVO'} className="accent-[#C89B3C] cursor-pointer" />
        </label>

        <label
          onClick={() => setPaymentMethod('DANA')}
          className={`p-4 rounded-2xl border flex items-center justify-between cursor-pointer transition-all ${
            paymentMethod === 'DANA'
              ? 'border-gold bg-gold/10 dark:bg-gold/10 shadow-gold-glow'
              : 'border-gray-200 dark:border-obsidian-border bg-gray-50 dark:bg-obsidian-surface hover:border-gold/50 hover:bg-gray-100 dark:hover:bg-obsidian-border/60'
          }`}
        >
          <div className="flex items-center gap-3">
            <div className="w-12 h-8 flex items-center justify-center bg-white rounded p-1 border border-gray-200 dark:border-obsidian-border">
              <img src="/logos/dana.svg" alt="DANA" className="w-full h-full object-contain" />
            </div>
            <div>
              <h4 className="font-extrabold text-xs text-gray-900 dark:text-white">DANA</h4>
              <p className="text-[11px] text-gray-500 dark:text-gray-400">Dompet digital Indonesia</p>
            </div>
          </div>
          <input type="radio" readOnly checked={paymentMethod === 'DANA'} className="accent-[#C89B3C] cursor-pointer" />
        </label>
      </div>
    </div>
  );
}
