import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { findSalesmanByPin, generateWhatsAppLink } from '../../services/whatsappService';
import { Salesman } from '../../types/index';
import { 
  Phone, 
  Mail, 
  MapPin, 
  MessageCircle, 
  Building2, 
  Clock, 
  UserCheck, 
  ArrowRight,
  Search,
  AlertCircle,
  ShieldCheck
} from 'lucide-react';

export const ContactView: React.FC = () => {
  const { config, salesmen } = useApp();

  const [searchPin, setSearchPin] = useState('');
  const [matchedSalesman, setMatchedSalesman] = useState<Salesman | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  const [inquirerName, setInquirerName] = useState('');
  const [inquirerStore, setInquirerStore] = useState('');
  const [inquirerPhone, setInquirerPhone] = useState('');
  const [inquiryText, setInquiryText] = useState('');

  const handlePinLookup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchPin.trim()) return;
    const match = findSalesmanByPin(searchPin.trim(), salesmen);
    setMatchedSalesman(match);
    setHasSearched(true);
  };

  const handleGeneralWhatsApp = (e: React.FormEvent) => {
    e.preventDefault();
    let msg = `Hi GraminMart Logistics, I am inquiring about regular wholesale supply for my store.`;
    if (inquirerName) msg += `\nName: ${inquirerName}`;
    if (inquirerStore) msg += `\nStore: ${inquirerStore}`;
    if (inquirerPhone) msg += `\nPhone: ${inquirerPhone}`;
    if (inquiryText) msg += `\nRequirement: ${inquiryText}`;

    // Target demo phone: 917365980930
    const link = generateWhatsAppLink('917365980930', msg);
    window.open(link, '_blank');
  };

  const sampleAreas = [
    { pin: '732123', name: 'Malda Town & English Bazar', rep: 'Rahul Kumar' },
    { pin: '732101', name: 'Old Malda & Mangalbari', rep: 'Amit Sharma' },
    { pin: '732125', name: 'Gazole & Pandua Sector', rep: 'Suman Roy' },
    { pin: '732142', name: 'Kaliachak & Farakka Corridor', rep: 'Priya Mukherjee' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      {/* Header */}
      <div className="border-b border-slate-200 pb-6">
        <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
          Regional Route Network
        </span>
        <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-slate-900 mt-2">
          Route Salesmen & Depot Directory
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl">
          Enter your 6-digit postal code to identify the designated route representative assigned to your kirana jurisdiction.
        </p>
      </div>

      {/* PIN Lookup Box */}
      <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-emerald-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-800">
        <div className="max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-300 text-xs font-semibold border border-emerald-400/20">
            <MapPin className="w-3.5 h-3.5 text-emerald-400" />
            <span>Interactive Salesman Finder</span>
          </div>

          <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-white">
            Lookup Your Authorized Area Junior
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">
            Enter your 6-digit delivery PIN. We immediately pull the assigned field representative's name, mobile number, and jurisdiction.
          </p>

          <form onSubmit={handlePinLookup} className="pt-2 flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={searchPin}
                onChange={(e) => {
                  setSearchPin(e.target.value.replace(/[^0-9]/g, '').slice(0, 6));
                  setHasSearched(false);
                }}
                placeholder="Enter 6-digit PIN (e.g. 732123, 732101, 732125)"
                className="w-full pl-10 pr-4 py-3 bg-white text-slate-900 text-sm font-mono rounded-xl focus:outline-hidden focus:ring-2 focus:ring-emerald-400 shadow-inner"
              />
            </div>
            <button
              type="submit"
              className="px-6 py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md shadow-emerald-500/20 flex items-center justify-center gap-2 shrink-0 active:scale-98"
            >
              <UserCheck className="w-4 h-4" />
              <span>Verify Route</span>
            </button>
          </form>

          {/* Result Card */}
          {hasSearched && (
            <div className="pt-3">
              {matchedSalesman ? (
                <div className="bg-slate-900/90 border border-emerald-500/30 rounded-2xl p-5 flex flex-col sm:flex-row items-center sm:items-start justify-between gap-5 animate-in fade-in duration-200">
                  <div className="flex items-center gap-4">
                    <img
                      src={matchedSalesman.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=160&q=80'}
                      alt={matchedSalesman.name}
                      className="w-14 h-14 rounded-xl object-cover border-2 border-emerald-400 shadow-sm"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-display text-base font-bold text-white">
                          {matchedSalesman.name}
                        </span>
                        <span className="text-[10px] uppercase px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800 font-bold">
                          Assigned Rep
                        </span>
                      </div>
                      <p className="text-xs text-emerald-400 mt-1 flex items-center gap-1.5 font-mono">
                        <Phone className="w-3.5 h-3.5" />
                        {matchedSalesman.phone}
                      </p>
                      <p className="text-xs text-slate-400 mt-0.5">
                        Jurisdiction: <span className="text-slate-200 font-mono">PIN {matchedSalesman.assignedAreas.join(', ')}</span>
                      </p>
                    </div>
                  </div>

                  <a
                    href={`https://wa.me/917365980930?text=${encodeURIComponent(`Hi ${matchedSalesman.name}, I found your contact on GraminMart for PIN ${searchPin}. Please connect regarding grocery supply.`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-2 transition-all shrink-0 active:scale-98 shadow-md"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>WhatsApp {matchedSalesman.name}</span>
                  </a>
                </div>
              ) : (
                <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 text-xs text-slate-300 flex items-center gap-3">
                  <AlertCircle className="w-5 h-5 text-amber-400 shrink-0" />
                  <div>
                    No direct field junior mapped yet for PIN <strong className="text-white font-mono">{searchPin}</strong>. Please reach our <strong>Central Dispatch Desk</strong> below.
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Dual Column Layout: Warehouse Coordinates + Direct WhatsApp Dispatch Form */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-2xs space-y-4">
            <h3 className="font-display font-bold text-base text-slate-900 flex items-center gap-2">
              <Building2 className="w-5 h-5 text-emerald-600" />
              <span>Central Logistics Warehouse</span>
            </h3>

            <div className="space-y-3.5 text-xs text-slate-600">
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>{config.centralWarehouseAddress}</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Desk Phone: +91 73659 80930</span>
              </div>
              <div className="flex items-center gap-3">
                <MessageCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>WhatsApp Helpline: +91 73659 80930</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Logistics: {config.supportEmail}</span>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Depot Hours: Mon - Sat (8:00 AM - 7:00 PM)</span>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100">
              <a
                href="https://wa.me/917365980930"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs shadow-md shadow-emerald-600/20 transition-all active:scale-98"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Message Central WhatsApp (+91 73659 80930)</span>
              </a>
            </div>
          </div>

          {/* Serviced Routes List */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-2xs space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Major Regional Route Corridors
            </h4>
            <div className="space-y-2 text-xs">
              {sampleAreas.map((area) => (
                <div
                  key={area.pin}
                  onClick={() => {
                    setSearchPin(area.pin);
                    const match = findSalesmanByPin(area.pin, salesmen);
                    setMatchedSalesman(match);
                    setHasSearched(true);
                  }}
                  className="p-3 rounded-xl bg-slate-50 hover:bg-emerald-50/80 border border-slate-200/80 cursor-pointer transition-all flex items-center justify-between"
                >
                  <div>
                    <span className="font-bold text-emerald-800 font-mono">
                      PIN {area.pin}
                    </span>
                    <span className="text-slate-700 ml-2">{area.name}</span>
                  </div>
                  <span className="text-[11px] text-slate-500 font-medium">
                    Rep: {area.rep}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Inquiry Form */}
        <div className="lg:col-span-7">
          <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/90 shadow-2xs space-y-6">
            <div>
              <span className="text-xs font-bold uppercase text-emerald-700 tracking-wider block">
                Retail Account Opening
              </span>
              <h3 className="font-display text-xl font-bold text-slate-900 mt-1">
                Request Field Salesman Visit to Your Store
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Submit store coordinates. A sales representative will be dispatched to your premises with catalog samples and wholesale price contracts.
              </p>
            </div>

            <form onSubmit={handleGeneralWhatsApp} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-700 font-medium mb-1">
                    Store Owner Name
                  </label>
                  <input
                    type="text"
                    required
                    value={inquirerName}
                    onChange={(e) => setInquirerName(e.target.value)}
                    placeholder="e.g. Ramesh Ghosh"
                    className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl bg-slate-50/50 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-medium mb-1">
                    Shop / Firm Name
                  </label>
                  <input
                    type="text"
                    required
                    value={inquirerStore}
                    onChange={(e) => setInquirerStore(e.target.value)}
                    placeholder="e.g. Ghosh General Stores"
                    className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl bg-slate-50/50 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">
                  Contact Mobile Number
                </label>
                <input
                  type="tel"
                  required
                  value={inquirerPhone}
                  onChange={(e) => setInquirerPhone(e.target.value)}
                  placeholder="e.g. +91 98321 00000"
                  className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl bg-slate-50/50 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">
                  Brands / Stock Requirements
                </label>
                <textarea
                  rows={3}
                  value={inquiryText}
                  onChange={(e) => setInquiryText(e.target.value)}
                  placeholder="e.g. Weekly requirement: Colgate MaxFresh cartons, Dove soap cases, Surf Excel packages..."
                  className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl bg-slate-50/50 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition"
                />
              </div>

              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200/80 text-[11px] text-amber-900 flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                <span>
                  <strong>Doorstep Offline Protocol:</strong> Our authorized junior visits in person. Zero online cards or advance payments.
                </span>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase tracking-wider shadow-md shadow-emerald-600/20 flex items-center justify-center gap-2 transition-all active:scale-98"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Submit to WhatsApp (+91 73659 80930)</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
