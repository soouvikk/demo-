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
    <div className="fixed inset-0 z-50 overflow-y-auto bg-[#2A331E]/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 transition-all duration-300">
      <div className="relative bg-white rounded-t-3xl sm:rounded-2xl max-w-2xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-[#E8E0D5] overflow-hidden animate-in fade-in duration-150">
        
        {/* Mobile Pull Handle */}
        <div className="w-12 h-1.5 bg-[#E8E0D5] rounded-full mx-auto my-2.5 sm:hidden" />

        {/* Close Button */}
        <button
          onClick={closeDetailModal}
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/90 text-[#20261D] hover:bg-white shadow-md transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Image Column */}
          <div className="relative bg-[#FAF7F2] min-h-[220px] sm:min-h-[260px] md:min-h-full flex items-center justify-center p-4 sm:p-6 border-b md:border-b-0 md:border-r border-[#E8E0D5]">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-56 sm:h-64 object-cover rounded-xl shadow-xs"
            />
            <span className="absolute top-4 left-4 bg-[#2A331E]/85 backdrop-blur-xs text-[#EDF2E8] text-[10px] font-semibold px-2.5 py-1 rounded-md">
              {product.category}
            </span>
          </div>

          {/* Details Column */}
          <div className="p-5 sm:p-6 md:p-8 flex flex-col justify-between space-y-4 text-[#20261D]">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-[#4A5638]">
                  {product.brand}
                </span>
                <span className="text-[11px] font-semibold text-[#3C472C] bg-[#EDF2E8] border border-[#C8D4B8] px-2.5 py-0.5 rounded-full">
                  In Stock • Verified
                </span>
              </div>

              <h2 className="font-display text-lg sm:text-xl font-bold text-[#20261D] mt-1 leading-snug">
                {product.name}
              </h2>

              {/* Price Block */}
              <div className="mt-3 p-3.5 bg-[#FAF7F2] rounded-xl border border-[#E8E0D5]">
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-black text-[#20261D] font-display">
                    ₹{product.price}
                  </span>
                  <span className="text-xs text-[#646A5E] line-through">
                    MRP ₹{product.mrp}
                  </span>
                  <span className="text-xs font-bold text-[#3C472C] ml-auto">
                    (₹{margin} Margin • {marginPercent}%)
                  </span>
                </div>
                <p className="text-xs text-[#646A5E] mt-1">
                  Ex-depot wholesale price. Subject to bulk distributor schemes.
                </p>
              </div>

              {/* Specifications */}
              <div className="grid grid-cols-2 gap-2 mt-3 text-xs">
                <div className="p-2.5 rounded-xl bg-[#FAF7F2] border border-[#E8E0D5]">
                  <span className="text-[#646A5E] block text-[10px] uppercase font-semibold">Unit Packaging</span>
                  <span className="font-bold text-[#20261D]">{product.unit}</span>
                </div>
                <div className="p-2.5 rounded-xl bg-[#FAF7F2] border border-[#E8E0D5]">
                  <span className="text-[#646A5E] block text-[10px] uppercase font-semibold">Carton Sizing</span>
                  <span className="font-bold text-[#20261D]">{product.packSize}</span>
                </div>
              </div>

              {/* Description */}
              <p className="text-xs text-[#646A5E] mt-3 leading-relaxed">
                {product.description}
              </p>

              {/* Trade Scheme Banner if any */}
              {product.offer && (
                <div className="mt-3 p-3 bg-[#EDF2E8] border border-[#C8D4B8] rounded-xl text-xs text-[#2A331E] flex items-start gap-2">
                  <Tag className="w-4 h-4 text-[#7D8D64] shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-[10px] uppercase font-bold text-[#3C472C]">Trade Scheme:</strong>
                    <span>{product.offer}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="pt-2 space-y-2">
              <button
                onClick={handleInterestedClick}
                className="w-full py-3.5 bg-[#7D8D64] hover:bg-[#6E7D56] text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-md shadow-[#7D8D64]/25 flex items-center justify-center gap-2 active:scale-98 transition-all"
              >
                <MessageCircle className="w-4 h-4" />
                <span>I'm Interested — WhatsApp Desk</span>
              </button>

              <div className="flex items-center justify-center gap-3 text-[11px] text-[#646A5E] pt-1">
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
