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
    const targetSalesman = matchedSalesman || findSalesmanByPin(pin, salesmen);

    createLead({
      productName: selectedProductForInterest.name,
      productId: selectedProductForInterest.id,
      productPrice: selectedProductForInterest.price,
      customerName: customerName || undefined,
      areaPin: pin || undefined,
      status: 'NEW',
      assignedSalesmanId: targetSalesman?.id,
      assignedSalesmanName: targetSalesman?.name,
      notes: `Inquiry submitted via Web Showcase for ${quantity} units.`,
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
    <div className="fixed inset-0 z-50 overflow-y-auto bg-[#2A331E]/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 transition-all duration-300">
      <div className="relative bg-white rounded-t-3xl sm:rounded-2xl max-w-lg w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-[#E8E0D5] transform transition-all duration-200">
        
        {/* Mobile Pull Indicator */}
        <div className="w-12 h-1.5 bg-[#E8E0D5] rounded-full mx-auto my-2.5 sm:hidden" />

        {/* Modal Header */}
        <div className="bg-gradient-to-r from-[#2A331E] via-[#3C472C] to-[#2A331E] px-5 sm:px-6 py-4 sm:py-5 text-white flex items-center justify-between border-b border-[#3C472C]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20 shadow-inner">
              <MessageCircle className="w-5 h-5 text-[#A3B489]" />
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#C8D4B8] font-semibold block">
                DIRECT SALES LEAD DESK
              </span>
              <h3 className="font-display font-bold text-base sm:text-lg text-white">
                Connect via WhatsApp
              </h3>
            </div>
          </div>
          <button
            onClick={closeInterestModal}
            className="p-1.5 rounded-lg text-[#C8D4B8] hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 space-y-4 sm:space-y-5 text-[#20261D]">
          {/* Selected Product Manifest */}
          <div className="flex items-center gap-3.5 p-3.5 rounded-xl bg-[#FAF7F2] border border-[#E8E0D5] hover:border-[#7D8D64] transition-colors">
            <img
              src={selectedProductForInterest.image}
              alt={selectedProductForInterest.name}
              className="w-16 h-16 rounded-xl object-cover border border-[#E8E0D5] shadow-xs shrink-0"
            />
            <div className="flex-1 min-w-0">
              <span className="text-[10px] font-bold text-[#7D8D64] uppercase tracking-wider block">
                {selectedProductForInterest.brand}
              </span>
              <h4 className="font-display text-sm font-bold text-[#20261D] truncate">
                {selectedProductForInterest.name}
              </h4>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="font-bold text-base text-[#20261D]">
                  ₹{selectedProductForInterest.price}
                </span>
                <span className="text-xs text-[#646A5E] line-through">
                  ₹{selectedProductForInterest.mrp}
                </span>
                <span className="text-xs font-semibold text-[#3C472C] ml-auto bg-[#EDF2E8] px-2 py-0.5 rounded-full border border-[#C8D4B8]">
                  {selectedProductForInterest.packSize}
                </span>
              </div>
            </div>
          </div>

          {/* Instruction to Customer per specification */}
          <div className="p-3.5 rounded-xl bg-[#FAF7F2] border border-[#E8E0D5] text-xs text-[#20261D] space-y-1">
            <strong className="block text-[11px] font-bold text-[#3C472C] uppercase tracking-wide">
              Next Step on WhatsApp:
            </strong>
            <p className="font-medium text-[#20261D]">
              &ldquo;Please send your PIN/area on WhatsApp so we can connect you with the nearest salesman.&rdquo;
            </p>
          </div>

          {/* Form Fields: PIN & Area */}
          <div className="space-y-3.5">
            <div>
              <label className="block text-xs font-bold text-[#20261D] uppercase tracking-wider mb-1.5">
                Delivery Postal PIN Code
              </label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <MapPin className="absolute left-3.5 top-3 w-4 h-4 text-[#7D8D64]" />
                  <input
                    type="text"
                    value={pin}
                    onChange={handlePinChange}
                    placeholder="Enter 6-digit PIN (e.g. 732123)"
                    maxLength={6}
                    className="w-full pl-10 pr-3 py-2.5 text-sm font-mono border border-[#E8E0D5] rounded-xl focus:outline-hidden focus:ring-2 focus:ring-[#7D8D64]/30 focus:border-[#7D8D64] bg-[#FAF7F2] transition"
                  />
                </div>
                <button
                  type="button"
                  onClick={handleCheckArea}
                  className="px-4 py-2.5 bg-[#2A331E] hover:bg-[#3C472C] text-white text-xs font-semibold rounded-xl shadow-xs transition shrink-0"
                >
                  Verify Area
                </button>
              </div>

              {/* Sample PIN shortcuts */}
              <div className="flex items-center gap-1.5 mt-2 flex-wrap text-xs text-[#646A5E]">
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
                      className="px-2 py-0.5 rounded-lg bg-[#FAF7F2] hover:bg-[#EDF2E8] hover:text-[#2A331E] text-[11px] font-mono transition border border-[#E8E0D5]"
                    >
                      {item}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Matched Salesman Card */}
            {hasSearchedPin && (
              <div className="p-3.5 rounded-xl border transition-all duration-200 bg-[#EDF2E8] border-[#C8D4B8]">
                {matchedSalesman ? (
                  <div className="flex items-center gap-3.5">
                    <img
                      src={matchedSalesman.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80'}
                      alt={matchedSalesman.name}
                      className="w-12 h-12 rounded-xl object-cover border-2 border-[#7D8D64] shadow-xs"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-[#20261D]">
                          {matchedSalesman.name}
                        </span>
                        <span className="text-[10px] uppercase px-2 py-0.5 bg-[#7D8D64] text-white rounded-full font-bold">
                          Assigned Rep
                        </span>
                      </div>
                      <p className="text-xs text-[#3C472C] font-semibold flex items-center gap-1 mt-0.5 font-mono">
                        <Phone className="w-3.5 h-3.5 text-[#7D8D64]" />
                        {matchedSalesman.phone}
                      </p>
                      <p className="text-[11px] text-[#646A5E] mt-0.5">
                        Jurisdiction: PIN {matchedSalesman.assignedAreas.join(', ')}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="text-xs text-[#20261D]">
                    No field junior mapped yet for PIN <strong>{pin}</strong>. You will connect directly to our <strong>Central Dispatch Desk</strong>.
                  </div>
                )}
              </div>
            )}

            {/* Store Name & Volume */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div>
                <label className="block text-xs font-semibold text-[#20261D] mb-1">
                  Store / Kirana Name (Optional)
                </label>
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="e.g. Maa Tara Kirana"
                  className="w-full px-3 py-2 text-xs border border-[#E8E0D5] rounded-xl bg-[#FAF7F2] focus:outline-hidden focus:ring-2 focus:ring-[#7D8D64]/30 focus:border-[#7D8D64] transition"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#20261D] mb-1">
                  Inquiry Volume (Cartons / Packs)
                </label>
                <div className="relative">
                  <Package className="absolute left-3 top-2.5 w-4 h-4 text-[#7D8D64]" />
                  <input
                    type="number"
                    min={1}
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-full pl-9 pr-3 py-2 text-xs font-mono border border-[#E8E0D5] rounded-xl bg-[#FAF7F2] focus:outline-hidden focus:ring-2 focus:ring-[#7D8D64]/30 focus:border-[#7D8D64] transition"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Pre-formatted Message Display */}
          <div className="p-3 bg-[#FAF7F2] rounded-xl border border-[#E8E0D5] text-xs text-[#20261D] leading-relaxed">
            <div className="flex items-center justify-between mb-1.5">
              <span className="font-bold text-[10px] uppercase tracking-wider text-[#646A5E]">
                Dynamic WhatsApp Message Preview:
              </span>
              <span className="text-[11px] font-mono text-[#7D8D64] font-semibold">
                wa.me/917365980930
              </span>
            </div>
            <p className="bg-white p-3 rounded-lg border border-[#E8E0D5] text-[#20261D] text-xs font-sans">
              Hi, I'm interested in {selectedProductForInterest.name} at ₹{selectedProductForInterest.price}. Please help me with this product. I would also like to know the salesman for my area.
              {pin && `\n\n(My Area PIN is: ${pin})`}
              {customerName && `\n(Store: ${customerName})`}
            </p>
          </div>

          {/* Action Trigger */}
          <div className="pt-1 space-y-2 pb-2">
            <button
              onClick={handleOpenWhatsApp}
              className="w-full py-3.5 bg-[#7D8D64] hover:bg-[#6E7D56] text-white font-bold text-sm rounded-xl shadow-lg shadow-[#7D8D64]/30 flex items-center justify-center gap-2 active:scale-98 transition-all duration-150"
            >
              <MessageCircle className="w-5 h-5 text-white" />
              <span>Open WhatsApp Click-to-Chat</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </button>

            <p className="text-center text-[11px] text-[#646A5E]">
              Clicking will open WhatsApp directly with <strong className="text-[#20261D]">+91 73659 80930</strong>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
