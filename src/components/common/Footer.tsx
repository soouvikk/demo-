import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Store, 
  MapPin, 
  Phone, 
  Mail, 
  MessageCircle, 
  ShieldCheck, 
  PackageCheck, 
  Truck, 
  Lock,
  ArrowRight
} from 'lucide-react';

export const Footer: React.FC = () => {
  const { setActivePublicPage, setMode, config, salesmen } = useApp();

  const allAreas = Array.from(
    new Set(salesmen.flatMap((s) => s.assignedAreas))
  ).slice(0, 8);

  return (
    <footer className="bg-[#202716] text-[#E8E0D5] pt-16 pb-12 border-t border-[#3C472C]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Core Value Pillars: Why No Checkout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pb-12 border-b border-[#3C472C] text-xs">
          <div className="flex items-start gap-3.5 p-4 rounded-2xl bg-[#2A331E]/60 border border-[#3C472C]">
            <div className="p-2.5 bg-[#3C472C] text-[#A3B489] border border-[#7D8D64]/40 rounded-xl shrink-0">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <h4 className="font-bold text-white text-xs uppercase tracking-wide">
                Direct Manufacturer Consignments
              </h4>
              <p className="text-[11px] text-[#C8D4B8] mt-1 leading-relaxed">
                Official distribution ties with Colgate, HUL, Tata, and Nestle. 100% genuine retail inventory.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5 p-4 rounded-2xl bg-[#2A331E]/60 border border-[#3C472C]">
            <div className="p-2.5 bg-[#3C472C] text-[#EDF2E8] border border-[#7D8D64]/40 rounded-xl shrink-0">
              <MapPin className="w-4 h-4" />
            </div>
            <div>
              <h4 className="font-bold text-white text-xs uppercase tracking-wide">
                Neighborhood Field Representatives
              </h4>
              <p className="text-[11px] text-[#C8D4B8] mt-1 leading-relaxed">
                Every PIN corridor is assigned to a verified junior rep who visits your kirana in person.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5 p-4 rounded-2xl bg-[#2A331E]/60 border border-[#3C472C]">
            <div className="p-2.5 bg-[#3C472C] text-[#A3B489] border border-[#7D8D64]/40 rounded-xl shrink-0">
              <PackageCheck className="w-4 h-4" />
            </div>
            <div>
              <h4 className="font-bold text-white text-xs uppercase tracking-wide">
                Spot Cash On Delivery
              </h4>
              <p className="text-[11px] text-[#C8D4B8] mt-1 leading-relaxed">
                Zero advance online payments. Inspect carton seals and batch dates physically before payment.
              </p>
            </div>
          </div>
        </div>

        {/* Footer Navigation Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 py-12">
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#7D8D64] to-[#4A5638] flex items-center justify-center text-white font-bold shadow-md shadow-[#7D8D64]/20">
                <Store className="w-5 h-5" />
              </div>
              <div>
                <span className="font-display text-xl font-bold tracking-tight text-white">
                  Gramin<span className="text-[#A3B489]">Mart</span>
                </span>
                <p className="text-[10px] text-[#C8D4B8] uppercase tracking-wider font-mono">
                  FMCG Regional Wholesale Network
                </p>
              </div>
            </div>

            <p className="text-xs text-[#C8D4B8] leading-relaxed pr-6">
              Dedicated product showcase and route lead assignment platform designed for retail grocers and wholesale kirana merchants. Direct human sales connections with physical spot delivery.
            </p>

            <div className="pt-2 flex flex-wrap gap-2 text-[10px] font-mono">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#2A331E] border border-[#3C472C] text-[#E8E0D5]">
                <Lock className="w-3 h-3 text-[#A3B489]" />
                Zero Online Card Transactions
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#2A331E] border border-[#3C472C] text-[#E8E0D5]">
                <Truck className="w-3 h-3 text-[#A3B489]" />
                Direct Route Rep Dispatch
              </span>
            </div>
          </div>

          {/* Catalog Links */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#FAF7F2] mb-4">
              Wholesale Sections
            </h4>
            <ul className="space-y-2.5 text-xs text-[#C8D4B8]">
              <li>
                <button
                  onClick={() => setActivePublicPage('home')}
                  className="hover:text-[#FAF7F2] transition-colors"
                >
                  Showcase Home
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActivePublicPage('products')}
                  className="hover:text-[#FAF7F2] transition-colors"
                >
                  All FMCG Lines
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActivePublicPage('offers')}
                  className="hover:text-[#FAF7F2] transition-colors"
                >
                  Active Trade Schemes
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActivePublicPage('notes')}
                  className="hover:text-[#FAF7F2] transition-colors"
                >
                  Depot Bulletins
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActivePublicPage('contact')}
                  className="hover:text-[#FAF7F2] transition-colors"
                >
                  Route Rep Directory
                </button>
              </li>
            </ul>
          </div>

          {/* Serviced PINs */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#FAF7F2] mb-4">
              Serviced Sector Corridors
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {allAreas.map((pin) => (
                <button
                  key={pin}
                  onClick={() => setActivePublicPage('contact')}
                  className="px-2.5 py-1 bg-[#2A331E] border border-[#3C472C] text-[10px] text-[#EDF2E8] rounded-lg hover:border-[#7D8D64] transition-colors font-mono"
                >
                  PIN {pin}
                </button>
              ))}
            </div>
            <button
              onClick={() => setActivePublicPage('contact')}
              className="mt-3 text-xs text-[#A3B489] inline-flex items-center gap-1 hover:underline"
            >
              <span>Check your area salesman</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          {/* Contact Details */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#FAF7F2] mb-4">
              Logistics Desk
            </h4>
            <ul className="space-y-3 text-xs text-[#C8D4B8]">
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-[#A3B489] shrink-0 mt-0.5" />
                <span className="text-[11px] leading-relaxed">{config.centralWarehouseAddress}</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#A3B489] shrink-0" />
                <span>Desk Phone: +91 73659 80930</span>
              </li>
              <li className="flex items-center gap-2">
                <MessageCircle className="w-4 h-4 text-[#A3B489] shrink-0" />
                <a
                  href="https://wa.me/917365980930"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white font-semibold"
                >
                  WhatsApp: +91 73659 80930
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#A3B489] shrink-0" />
                <span>{config.supportEmail}</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-[#3C472C] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#A3B489]">
          <div>
            © {new Date().getFullYear()} {config.companyName}. All rights reserved.
          </div>
          <div className="flex items-center gap-4">
            <span>Physical Spot Invoicing Protocol</span>
            <span>•</span>
            <button
              onClick={() => setMode('admin')}
              className="text-[#FAF7F2] hover:text-white underline font-medium"
            >
              Internal Staff & Salesman Desk
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
