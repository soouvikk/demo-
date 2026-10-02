import React from 'react';
import { useApp, PublicPage } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { 
  Building2, 
  Store, 
  Tag, 
  Phone, 
  Layers, 
  MessageCircle, 
  Receipt 
} from 'lucide-react';

export const MobileBottomBar: React.FC = () => {
  const { activePublicPage, setActivePublicPage, mode, setMode, notes } = useApp();
  const { activeRole } = useAuth();

  const handleNavClick = (page: PublicPage) => {
    setActivePublicPage(page);
    setMode('public');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const openAdmin = () => {
    setMode('admin');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      {/* Mobile Floating WhatsApp Quick Action Button (above bottom bar) */}
      <div className="md:hidden fixed bottom-18 right-4 z-40">
        <a
          href="https://wa.me/917365980930?text=Hi%20GraminMart%2C%20I%20want%20to%20inquire%20about%20kirana%20supplies%20for%20my%20store."
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Direct WhatsApp Support"
          className="flex items-center gap-2 px-3.5 py-2.5 bg-[#7D8D64] hover:bg-[#6E7D56] text-white font-bold text-xs rounded-full shadow-lg shadow-[#7D8D64]/40 active:scale-90 transition-all border-2 border-white"
        >
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-white" />
          </span>
          <MessageCircle className="w-4 h-4 fill-white/20" />
          <span className="font-semibold text-[11px]">Chat Helpline</span>
        </a>
      </div>

      {/* Sticky Mobile App-Style Bottom Navigation Bar */}
      <nav 
        aria-label="Mobile Bottom Navigation"
        className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#FAF7F2]/95 backdrop-blur-lg border-t border-[#E8E0D5] px-2 py-1.5 shadow-[0_-4px_20px_rgba(32,38,29,0.08)] pb-[calc(0.5rem+env(safe-area-inset-bottom,0px))]"
      >
        <div className="grid grid-cols-5 items-center justify-items-center">
          {/* 1. Showcase Home */}
          <button
            onClick={() => handleNavClick('home')}
            className={`flex flex-col items-center justify-center py-1 px-1.5 rounded-xl transition-all duration-150 w-full ${
              mode === 'public' && activePublicPage === 'home'
                ? 'text-[#2A331E] font-bold'
                : 'text-[#646A5E] hover:text-[#20261D]'
            }`}
          >
            <div className={`p-1 rounded-lg ${
              mode === 'public' && activePublicPage === 'home'
                ? 'bg-[#EDF2E8] text-[#7D8D64]'
                : ''
            }`}>
              <Building2 className="w-5 h-5 stroke-[2.2]" />
            </div>
            <span className="text-[10px] tracking-tight mt-0.5">Showcase</span>
          </button>

          {/* 2. Products Catalog */}
          <button
            onClick={() => handleNavClick('products')}
            className={`flex flex-col items-center justify-center py-1 px-1.5 rounded-xl transition-all duration-150 w-full ${
              mode === 'public' && activePublicPage === 'products'
                ? 'text-[#2A331E] font-bold'
                : 'text-[#646A5E] hover:text-[#20261D]'
            }`}
          >
            <div className={`p-1 rounded-lg ${
              mode === 'public' && activePublicPage === 'products'
                ? 'bg-[#EDF2E8] text-[#7D8D64]'
                : ''
            }`}>
              <Store className="w-5 h-5 stroke-[2.2]" />
            </div>
            <span className="text-[10px] tracking-tight mt-0.5">Catalog</span>
          </button>

          {/* 3. Trade Schemes */}
          <button
            onClick={() => handleNavClick('offers')}
            className={`flex flex-col items-center justify-center py-1 px-1.5 rounded-xl transition-all duration-150 w-full relative ${
              mode === 'public' && activePublicPage === 'offers'
                ? 'text-[#2A331E] font-bold'
                : 'text-[#646A5E] hover:text-[#20261D]'
            }`}
          >
            <div className={`p-1 rounded-lg relative ${
              mode === 'public' && activePublicPage === 'offers'
                ? 'bg-[#EDF2E8] text-[#7D8D64]'
                : ''
            }`}>
              <Tag className="w-5 h-5 stroke-[2.2]" />
              <span className="absolute -top-0.5 -right-1 w-2 h-2 rounded-full bg-[#7D8D64]" />
            </div>
            <span className="text-[10px] tracking-tight mt-0.5">Schemes</span>
          </button>

          {/* 4. Local Area Reps */}
          <button
            onClick={() => handleNavClick('contact')}
            className={`flex flex-col items-center justify-center py-1 px-1.5 rounded-xl transition-all duration-150 w-full ${
              mode === 'public' && activePublicPage === 'contact'
                ? 'text-[#2A331E] font-bold'
                : 'text-[#646A5E] hover:text-[#20261D]'
            }`}
          >
            <div className={`p-1 rounded-lg ${
              mode === 'public' && activePublicPage === 'contact'
                ? 'bg-[#EDF2E8] text-[#7D8D64]'
                : ''
            }`}>
              <Phone className="w-5 h-5 stroke-[2.2]" />
            </div>
            <span className="text-[10px] tracking-tight mt-0.5">Route Reps</span>
          </button>

          {/* 5. Staff / Salesman Desk */}
          <button
            onClick={openAdmin}
            className={`flex flex-col items-center justify-center py-1 px-1.5 rounded-xl transition-all duration-150 w-full ${
              mode === 'admin'
                ? 'text-[#2A331E] font-bold'
                : 'text-[#646A5E] hover:text-[#20261D]'
            }`}
          >
            <div className={`p-1 rounded-lg relative ${
              mode === 'admin'
                ? 'bg-[#2A331E] text-white shadow-xs'
                : 'bg-[#F0F1EF] text-[#3C472C]'
            }`}>
              <Layers className="w-5 h-5 stroke-[2.2]" />
            </div>
            <span className="text-[10px] tracking-tight mt-0.5">
              {activeRole === 'SUPER_ADMIN' ? 'Admin' : 'Junior'} Desk
            </span>
          </button>
        </div>
      </nav>
    </>
  );
};
