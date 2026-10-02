import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { findSalesmanByPin, buildWhatsAppMessage } from '../../services/whatsappService';
import { Salesman } from '../../types/index';
import { 
  MessageCircle, 
  X, 
  MapPin, 
  Phone, 
  ArrowRight, 
  Package, 
  ShieldCheck,
  CheckCircle2,
  Sparkles
} from 'lucide-react';

export const InterestedModal: React.FC = () => {
  const { 
    selectedProductForInterest, 
    closeInterestModal, 
    salesmen, 
    createLead, 
    config 
  } = useApp();

  const [pin, setPin] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [quantity, setQuantity] = useState<number>(10);
  const [matchedSalesman, setMatchedSalesman] = useState<Salesman | null>(null);
  const [hasSearchedPin, setHasSearchedPin] = useState(false);

  useEffect(() => {
    if (selectedProductForInterest) {
      setQuantity(selectedProductForInterest.minOrderQty || 10);
      setPin('');
      setCustomerName('');
      setMatchedSalesman(null);
      setHasSearchedPin(false);
    }
  }, [selectedProductForInterest]);

  if (!selectedProductForInterest) return null;

  const handlePinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/[^0-9]/g, '').slice(0, 6);
    setPin(val);
    setHasSearchedPin(false);

    if (val.length === 6) {
      const match = findSalesmanByPin(val, salesmen);
      setMatchedSalesman(match);
      setHasSearchedPin(true);
    } else {
      setMatchedSalesman(null);
    }
  };

  const handleCheckArea = () => {
    if (!pin) return;
    const match = findSalesmanByPin(pin, salesmen);
    setMatchedSalesman(match);
    setHasSearchedPin(true);
  };

  const handleOpenWhatsApp = () => {
    const targetSalesman = matchedSalesman;
    createLead({
      customerName: customerName.trim() || 'Kirana Store Inquirer',
      customerPhone: undefined,
      productId: selectedProductForInterest.id,
      productName: selectedProductForInterest.name,
      productPrice: selectedProductForInterest.price,
      productImage: selectedProductForInterest.image,
      areaPin: pin || undefined,
      assignedSalesmanId: targetSalesman ? targetSalesman.id : undefined,
      assignedSalesmanName: targetSalesman ? targetSalesman.name : undefined,
      assignedSalesmanPhone: targetSalesman ? targetSalesman.phone : undefined,
      status: 'NEW',
      notes: `Inquiry via showcase CTA. Requested carton volume: ${quantity} units.`,
    });

    const message = buildWhatsAppMessage({
      product: selectedProductForInterest,
      quantity,
      areaPin: pin || undefined,
      customerName: customerName || undefined,
      assignedSalesman: targetSalesman,
    });

    // Exact required Click-to-Chat URL with demo number: 917365980930
    const url = `https://wa.me/917365980930?text=${encodeURIComponent(message)}`;

    window.open(url, '_blank');
  };

  const samplePins = ['732123 (Rahul)', '732101 (Amit)', '732125 (Suman)', '732142 (Priya)'];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 transition-all duration-300">
      <div className="relative bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-100 overflow-hidden transform transition-all duration-200 scale-100">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-emerald-800 via-emerald-700 to-teal-800 px-6 py-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20 shadow-inner">
              <MessageCircle className="w-5 h-5 text-emerald-200" />
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-emerald-200 font-semibold block">
                DIRECT SALES LEAD DESK
              </span>
              <h3 className="font-display font-bold text-lg text-white">
                Connect via WhatsApp
              </h3>
            </div>
          </div>
          <button
            onClick={closeInterestModal}
            className="p-1.5 rounded-lg text-emerald-200 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5">
          {/* Selected Product Manifest */}
          <div className="flex items-center gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200/80 hover:border-emerald-300 transition-colors">
            <img
              src={selectedProductForInterest.image}
              alt={selectedProductForInterest.name}
              className="w-16 h-16 rounded-lg object-cover border border-slate-200 shadow-xs shrink-0"
            />
            <div className="flex-1 min-w-0">
              <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider block">
                {selectedProductForInterest.brand}
              </span>
              <h4 className="font-display text-sm font-bold text-slate-900 truncate">
                {selectedProductForInterest.name}
              </h4>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="font-bold text-base text-slate-900">
                  ₹{selectedProductForInterest.price}
                </span>
                <span className="text-xs text-slate-400 line-through">
                  ₹{selectedProductForInterest.mrp}
                </span>
                <span className="text-xs font-semibold text-emerald-600 ml-auto bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                  {selectedProductForInterest.packSize}
                </span>
              </div>
            </div>
          </div>

          {/* Instruction to Customer per specification */}
          <div className="p-3.5 rounded-xl bg-amber-50/90 border border-amber-200 text-xs text-amber-900 space-y-1">
            <strong className="block text-[11px] font-bold text-amber-800 uppercase tracking-wide">
              Next Step on WhatsApp:
            </strong>
            <p className="font-medium text-amber-950">
              &ldquo;Please send your PIN/area on WhatsApp so we can connect you with the nearest salesman.&rdquo;
            </p>
          </div>

          {/* Form Fields: PIN & Area */}
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Delivery Postal PIN Code
              </label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <MapPin className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    value={pin}
                    onChange={handlePinChange}
                    placeholder="Enter 6-digit PIN (e.g. 732123)"
                    maxLength={6}
                    className="w-full pl-10 pr-3 py-2.5 text-sm font-mono border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 bg-white shadow-2xs transition"
                  />
                </div>
                <button
                  type="button"
                  onClick={handleCheckArea}
                  className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-xl shadow-xs transition"
                >
                  Verify Area
                </button>
              </div>

              {/* Sample PIN shortcuts */}
              <div className="flex items-center gap-1.5 mt-2 flex-wrap text-xs text-slate-500">
                <span className="text-[11px]">Quick Samples:</span>
                {samplePins.map((item) => {
                  const rawPin = item.split(' ')[0];
                  return (
                    <button
                      key={rawPin}
                      type="button"
                      onClick={() => {
                        setPin(rawPin);
                        const match = findSalesmanByPin(rawPin, salesmen);
                        setMatchedSalesman(match);
                        setHasSearchedPin(true);
                      }}
                      className="px-2 py-0.5 rounded-lg bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 text-[11px] font-mono transition border border-slate-200/60"
                    >
                      {item}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Matched Salesman Card */}
            {hasSearchedPin && (
              <div className="p-4 rounded-xl border transition-all duration-200 bg-emerald-50/60 border-emerald-200/80">
                {matchedSalesman ? (
                  <div className="flex items-center gap-3.5">
                    <img
                      src={matchedSalesman.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80'}
                      alt={matchedSalesman.name}
                      className="w-12 h-12 rounded-xl object-cover border-2 border-emerald-500 shadow-xs"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-slate-900">
                          {matchedSalesman.name}
                        </span>
                        <span className="text-[10px] uppercase px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded-full font-bold">
                          Assigned Rep
                        </span>
                      </div>
                      <p className="text-xs text-emerald-700 font-semibold flex items-center gap-1 mt-0.5 font-mono">
                        <Phone className="w-3.5 h-3.5" />
                        {matchedSalesman.phone}
                      </p>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        Jurisdiction: PIN {matchedSalesman.assignedAreas.join(', ')}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="text-xs text-slate-600">
                    No field junior mapped yet for PIN <strong>{pin}</strong>. You will connect directly to our <strong>Central Dispatch Desk</strong>.
                  </div>
                )}
              </div>
            )}

            {/* Store Name & Volume */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Store / Kirana Name (Optional)
                </label>
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="e.g. Maa Tara Kirana"
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl bg-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Inquiry Volume (Cartons / Packs)
                </label>
                <div className="relative">
                  <Package className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                  <input
                    type="number"
                    min={1}
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-full pl-9 pr-3 py-2 text-xs font-mono border border-slate-200 rounded-xl bg-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Pre-formatted Message Display */}
          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80 text-xs text-slate-700 leading-relaxed">
            <div className="flex items-center justify-between mb-1.5">
              <span className="font-bold text-[10px] uppercase tracking-wider text-slate-500">
                Dynamic WhatsApp Message Preview:
              </span>
              <span className="text-[11px] font-mono text-emerald-700 font-semibold">
                wa.me/917365980930
              </span>
            </div>
            <p className="bg-white p-3 rounded-lg border border-slate-200 text-slate-800 text-xs font-sans">
              Hi, I'm interested in {selectedProductForInterest.name} at ₹{selectedProductForInterest.price}. Please help me with this product. I would also like to know the salesman for my area.
              {pin && `\n\n(My Area PIN is: ${pin})`}
              {customerName && `\n(Store: ${customerName})`}
            </p>
          </div>

          {/* Action Trigger */}
          <div className="pt-1 space-y-2">
            <button
              onClick={handleOpenWhatsApp}
              className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-xl shadow-lg shadow-emerald-600/25 flex items-center justify-center gap-2 active:scale-98 transition-all duration-150"
            >
              <MessageCircle className="w-5 h-5 text-white" />
              <span>Open WhatsApp Click-to-Chat (+91 73659 80930)</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </button>

            <p className="text-center text-[11px] text-slate-500">
              Clicking will open WhatsApp directly with <span className="font-semibold text-slate-700">+91 73659 80930</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
