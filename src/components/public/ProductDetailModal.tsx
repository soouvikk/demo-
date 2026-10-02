import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  X, 
  Tag, 
  MessageCircle, 
  ShieldCheck, 
  Truck, 
  CheckCircle2,
  Package
} from 'lucide-react';

export const ProductDetailModal: React.FC = () => {
  const { selectedProductForDetail, closeDetailModal, openInterestModal } = useApp();

  if (!selectedProductForDetail) return null;

  const product = selectedProductForDetail;
  const margin = product.mrp - product.price;
  const marginPercent = Math.round((margin / product.mrp) * 100);

  const handleInterestedClick = () => {
    closeDetailModal();
    openInterestModal(product);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 transition-all duration-300">
      <div className="relative bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-slate-100 overflow-hidden animate-in fade-in duration-150">
        {/* Close Button */}
        <button
          onClick={closeDetailModal}
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/90 text-slate-600 hover:text-slate-900 hover:bg-white shadow-md transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Image Column */}
          <div className="relative bg-slate-100 min-h-[260px] md:min-h-full flex items-center justify-center p-6 border-b md:border-b-0 md:border-r border-slate-200">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-64 object-cover rounded-xl shadow-xs"
            />
            <span className="absolute top-4 left-4 bg-slate-900/80 backdrop-blur-xs text-white text-[10px] font-semibold px-2.5 py-1 rounded-md">
              {product.category}
            </span>
          </div>

          {/* Details Column */}
          <div className="p-6 md:p-8 flex flex-col justify-between space-y-5">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">
                  {product.brand}
                </span>
                <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
                  In Stock • Verified
                </span>
              </div>

              <h2 className="font-display text-xl font-bold text-slate-900 mt-1 leading-snug">
                {product.name}
              </h2>

              {/* Price Block */}
              <div className="mt-4 p-4 bg-slate-50 rounded-xl border border-slate-200/80">
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-black text-slate-900 font-display">
                    ₹{product.price}
                  </span>
                  <span className="text-xs text-slate-400 line-through">
                    MRP ₹{product.mrp}
                  </span>
                  <span className="text-xs font-bold text-emerald-700 ml-auto">
                    (₹{margin} Margin • {marginPercent}%)
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  Ex-depot wholesale price. Subject to bulk distributor schemes.
                </p>
              </div>

              {/* Specifications */}
              <div className="grid grid-cols-2 gap-2 mt-3 text-xs">
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80">
                  <span className="text-slate-400 block text-[10px] uppercase font-semibold">Unit Packaging</span>
                  <span className="font-bold text-slate-800">{product.unit}</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80">
                  <span className="text-slate-400 block text-[10px] uppercase font-semibold">Carton Sizing</span>
                  <span className="font-bold text-slate-800">{product.packSize}</span>
                </div>
              </div>

              {/* Description */}
              <p className="text-xs text-slate-600 mt-3 leading-relaxed">
                {product.description}
              </p>

              {/* Trade Scheme Banner if any */}
              {product.offer && (
                <div className="mt-3 p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 flex items-start gap-2">
                  <Tag className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-[10px] uppercase font-bold text-amber-800">Trade Scheme:</strong>
                    <span>{product.offer}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="pt-2 space-y-2">
              <button
                onClick={handleInterestedClick}
                className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-md shadow-emerald-600/20 flex items-center justify-center gap-2 active:scale-98 transition-all"
              >
                <MessageCircle className="w-4 h-4" />
                <span>I'm Interested — WhatsApp (+91 73659 80930)</span>
              </button>

              <div className="flex items-center justify-center gap-3 text-[11px] text-slate-400 pt-1">
                <span>100% Genuine Brands</span>
                <span>•</span>
                <span>Spot COD Settlement</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
