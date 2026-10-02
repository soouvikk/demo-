import React, { useState } from 'react';
import { useApp, PublicPage } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { 
  Phone, 
  MessageCircle, 
  Menu, 
  X, 
  Tag, 
  Bell, 
  Layers, 
  Building2,
  PackageCheck,
  ChevronRight,
  Store,
  ArrowRight
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const { activePublicPage, setActivePublicPage, mode, setMode, config, notes } = useApp();
  const { activeRole } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const publicNotesCount = notes.filter((n) => n.visibility === 'PUBLIC').length;

  const navLinks: { label: string; page: PublicPage; icon: React.ReactNode; badge?: string }[] = [
    { label: 'Showcase Home', page: 'home', icon: <Building2 className="w-4 h-4" /> },
    { label: 'Grocery Catalog', page: 'products', icon: <Store className="w-4 h-4" /> },
    { label: 'Trade Schemes', page: 'offers', icon: <Tag className="w-4 h-4" />, badge: 'Active' },
    { 
      label: 'Depot Bulletins', 
      page: 'notes', 
      icon: <Bell className="w-4 h-4" />, 
      badge: publicNotesCount > 0 ? `${publicNotesCount}` : undefined 
    },
    { label: 'Area Representatives', page: 'contact', icon: <Phone className="w-4 h-4" /> },
  ];

  const handleNavClick = (page: PublicPage) => {
    setActivePublicPage(page);
    setMode('public');
    setMobileMenuOpen(false);
  };

  const openAdmin = () => {
    setMode('admin');
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-2xs transition-all duration-200">
      {/* Top Banner: Real Business Clarification */}
      <div className="bg-slate-950 text-slate-300 text-xs py-2 px-4 border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-2">
          <div className="flex items-center gap-2 text-xs">
            <span className="font-mono bg-emerald-950 text-emerald-300 px-2 py-0.5 rounded-full font-semibold tracking-wider text-[10px] uppercase border border-emerald-800">
              OFFICIAL B2B SHOWCASE
            </span>
            <span className="text-slate-300 font-medium">
              Regional FMCG Wholesale Showcase • Offline Kirana Fulfillment & Spot Invoicing
            </span>
          </div>

          <div className="flex items-center gap-5 text-xs font-mono">
            <span className="hidden md:inline-flex items-center gap-1.5 text-slate-400">
              <PackageCheck className="w-3.5 h-3.5 text-emerald-400" />
              Zero Online Payment Risk
            </span>
            <a
              href="https://wa.me/917365980930"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-emerald-400 hover:text-emerald-300 font-semibold transition-colors"
            >
              <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
              WhatsApp Helpdesk: <strong className="text-white">+91 73659 80930</strong>
            </a>
          </div>
        </div>
      </div>

      {/* Main Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo / Brand Mark */}
          <div 
            onClick={() => handleNavClick('home')}
            className="flex items-center gap-3 cursor-pointer group select-none"
          >
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-700 flex items-center justify-center text-white shadow-md shadow-emerald-700/20 group-hover:scale-105 transition-all duration-200">
              <Store className="w-6 h-6 stroke-[2.2]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-display text-2xl font-extrabold tracking-tight text-slate-900">
                  Gramin<span className="text-emerald-600">Mart</span>
                </span>
                <span className="font-mono text-[9px] uppercase tracking-wider font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded-full">
                  WHOLESALE
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium tracking-tight">
                Regional Kirana & FMCG Distribution Network
              </p>
            </div>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((item) => {
              const isActive = mode === 'public' && activePublicPage === item.page;
              return (
                <button
                  key={item.page}
                  onClick={() => handleNavClick(item.page)}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold tracking-wide transition-all duration-150 flex items-center gap-2 ${
                    isActive
                      ? 'bg-emerald-50 text-emerald-800 font-bold border border-emerald-200/80 shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50 border border-transparent'
                  }`}
                >
                  <span className={isActive ? 'text-emerald-700' : 'text-slate-500'}>
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full font-bold ${
                      isActive ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-700'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Action: Admin Portal Gateway */}
          <div className="hidden lg:flex items-center gap-3">
            <button
              onClick={openAdmin}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all duration-150 ${
                mode === 'admin'
                  ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                  : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
              }`}
            >
              <Layers className="w-3.5 h-3.5 text-emerald-600" />
              <span>Staff / Salesman Desk</span>
              <span className="text-[10px] uppercase px-1.5 py-0.5 rounded-md bg-slate-100 text-slate-600 font-mono">
                {activeRole === 'SUPER_ADMIN' ? 'Admin' : 'Junior'}
              </span>
            </button>

            <a
              href="https://wa.me/917365980930"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs rounded-xl shadow-md shadow-emerald-600/20 active:scale-95 transition-all duration-150"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>Direct WhatsApp</span>
            </a>
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={openAdmin}
              className="px-2.5 py-1.5 text-xs font-semibold rounded-lg bg-slate-100 text-slate-800 border border-slate-200"
            >
              Portal
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-700 hover:bg-slate-100 transition-colors"
              aria-label="Toggle Navigation"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Panel */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-3 shadow-xl animate-in slide-in-from-top-2 duration-200">
          <div className="space-y-1">
            {navLinks.map((item) => {
              const isActive = mode === 'public' && activePublicPage === item.page;
              return (
                <button
                  key={item.page}
                  onClick={() => handleNavClick(item.page)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold tracking-wide transition-all ${
                    isActive
                      ? 'bg-emerald-50 text-emerald-800 font-bold border border-emerald-200'
                      : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    {item.icon}
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-600 text-white font-bold">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          <div className="pt-3 border-t border-slate-100 space-y-2">
            <button
              onClick={openAdmin}
              className="w-full flex items-center justify-between px-4 py-2.5 rounded-xl bg-slate-900 text-white text-xs font-semibold shadow-xs"
            >
              <div className="flex items-center gap-2">
                <Layers className="w-3.5 h-3.5 text-emerald-400" />
                <span>Salesman & Admin Portal</span>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </button>

            <a
              href="https://wa.me/917365980930"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 text-white text-xs font-semibold shadow-md shadow-emerald-600/20"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Connect on WhatsApp (+91 73659 80930)</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
};
