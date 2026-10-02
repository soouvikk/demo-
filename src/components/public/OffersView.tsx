import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Tag, 
  MessageCircle, 
  ArrowRight, 
  Calendar, 
  Store,
  Sparkles,
  Gift
} from 'lucide-react';

export const OffersView: React.FC = () => {
  const { products, openInterestModal, openDetailModal, setActivePublicPage } = useApp();

  const productsWithOffers = products.filter((p) => p.offer && p.offer.trim() !== '');

  const promotionalBanners = [
    {
      id: 'offer-1',
      title: 'Oral Care Distributor Volume Slab',
      badge: 'TOP RETENTION',
      description: 'Special distributor slab on Colgate MaxFresh 150g cartons. Extra cash discount for wholesale bookings above 25 cartons in Malda & Murshidabad sectors.',
      validity: 'Valid through this month',
      discount: 'Volume Scheme',
    },
    {
      id: 'offer-2',
      title: 'Personal Care Retailer Combo Deal',
      badge: 'PROMOTIONAL',
      description: 'Order 5 cartons of Dove Bathing Bars and receive an official branded counter-top display unit plus promotional POS merchandising material.',
      validity: 'Limited stocks',
      discount: 'Free Display POS',
    },
    {
      id: 'offer-3',
      title: 'Staples & Spices Cluster Incentive',
      badge: 'FAST DISPATCH',
      description: 'Pre-book 50 bags of Tata Salt Vacuum Evaporated Iodised Salt with guaranteed zero-breakage packaging and doorstep drop-off by your assigned junior.',
      validity: 'First-come basis',
      discount: 'Priority Logistics',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* Header */}
      <div className="border-b border-slate-200 pb-6">
        <span className="text-xs font-bold uppercase tracking-wider text-amber-700 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
          Wholesale Incentives
        </span>
        <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-slate-900 mt-2">
          Current Trade Offers & Schemes
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl">
          Direct manufacturer incentives, carton volume rebates, and retail merchandising displays.
        </p>
      </div>

      {/* Promos */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {promotionalBanners.map((b) => (
          <div
            key={b.id}
            className="bg-white rounded-2xl border border-slate-200/90 hover:border-emerald-300 p-6 shadow-2xs hover:shadow-lg hover:-translate-y-1 transition-all duration-200 flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 bg-amber-100 text-amber-800 rounded-full">
                  {b.badge}
                </span>
                <span className="text-xs font-bold text-emerald-700 font-mono">
                  {b.discount}
                </span>
              </div>
              <h3 className="font-display text-lg font-bold text-slate-900 leading-snug">{b.title}</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                {b.description}
              </p>
            </div>

            <div className="pt-5 mt-4 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="flex items-center gap-1 text-slate-400 text-[11px]">
                <Calendar className="w-3.5 h-3.5" />
                {b.validity}
              </span>
              <a
                href="https://wa.me/917365980930"
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 transition-colors"
              >
                <span>Ask on WA</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* Products with schemes */}
      <div className="space-y-6 pt-4">
        <div className="flex items-center justify-between border-b border-slate-200 pb-3">
          <div>
            <h2 className="font-display text-xl font-bold text-slate-900">
              Inventory Carrying Active Trade Schemes
            </h2>
          </div>
          <span className="text-xs font-semibold px-3 py-1 bg-amber-100 text-amber-800 rounded-full">
            {productsWithOffers.length} Active Schemes
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {productsWithOffers.map((p) => {
            const margin = p.mrp - p.price;
            return (
              <div
                key={p.id}
                className="bg-white rounded-2xl border border-slate-200/90 hover:border-emerald-300 p-5 space-y-4 flex flex-col justify-between shadow-2xs hover:shadow-lg hover:-translate-y-1 transition-all duration-200"
              >
                <div className="space-y-3">
                  <div className="flex items-start gap-4">
                    <img
                      src={p.image}
                      alt={p.name}
                      className="w-20 h-20 rounded-xl object-cover border border-slate-200 shrink-0 shadow-2xs"
                    />
                    <div className="flex-1 min-w-0">
                      <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider block">
                        {p.brand}
                      </span>
                      <h3 className="font-display font-bold text-sm text-slate-900 truncate">
                        {p.name}
                      </h3>
                      <div className="flex items-baseline gap-2 mt-1">
                        <span className="font-bold text-base text-slate-900">
                          ₹{p.price}
                        </span>
                        <span className="text-xs text-slate-400 line-through">
                          MRP ₹{p.mrp}
                        </span>
                        <span className="text-[11px] font-bold text-emerald-700 ml-auto">
                          +₹{margin} Margin
                        </span>
                      </div>
                      <span className="text-[11px] text-slate-500 block mt-0.5">
                        {p.packSize}
                      </span>
                    </div>
                  </div>

                  {/* Scheme tag */}
                  <div className="p-3 bg-amber-50 rounded-xl border border-amber-200/80 text-xs text-amber-900 flex items-start gap-2">
                    <Tag className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <div>
                      <strong className="block text-[10px] uppercase font-bold text-amber-800">Trade Scheme:</strong>
                      <span>{p.offer}</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100">
                  <button
                    onClick={() => openDetailModal(p)}
                    className="py-2.5 px-3 rounded-xl border border-slate-200 text-slate-700 font-semibold text-xs hover:bg-slate-50 transition-colors text-center"
                  >
                    View Specs
                  </button>
                  <button
                    onClick={() => openInterestModal(p)}
                    className="py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-1 shadow-md shadow-emerald-600/15 transition-all"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>Claim via WA</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
