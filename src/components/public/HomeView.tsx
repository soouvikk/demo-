import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  ShoppingBag, 
  MessageCircle, 
  MapPin, 
  ShieldCheck, 
  ArrowRight, 
  CheckCircle2, 
  Truck, 
  Tag, 
  Store,
  Layers,
  Search,
  Calculator,
  Calendar,
  Phone,
  Clock,
  Sparkles,
  Award,
  ChevronRight,
  UserCheck
} from 'lucide-react';

export const HomeView: React.FC = () => {
  const { products, setActivePublicPage, openInterestModal, openDetailModal, salesmen } = useApp();

  // Search input inside Hero
  const [heroSearch, setHeroSearch] = useState('');

  // Interactive Profit Simulator state
  const [simProductIndex, setSimProductIndex] = useState(0);
  const [simCartons, setSimCartons] = useState(10);

  const featuredProducts = products.filter((p) => p.featured).slice(0, 4);
  if (featuredProducts.length === 0) {
    featuredProducts.push(...products.slice(0, 4));
  }

  // Selected product for margin simulator with safe fallback
  const activeSimProduct = products[simProductIndex] || products[0] || {
    id: 'prod-colgate-1',
    name: 'Colgate MaxFresh Spicy Fresh Toothpaste 150g',
    brand: 'Colgate',
    category: 'Oral Care',
    price: 40,
    mrp: 45,
    unit: '150g Tube',
    packSize: 'Carton of 48 Units',
    description: 'Fast-moving red gel formula with cooling crystals.',
    image: 'https://images.unsplash.com/photo-1559591937-e10324884df0?auto=format&fit=crop&w=600&q=80',
    inStock: true,
    minOrderQty: 10,
    featured: true,
  };

  const simPrice = activeSimProduct?.price ?? 40;
  const simMrp = activeSimProduct?.mrp ?? 45;
  const unitsPerCarton = 48; // Standard demo multiplier
  const totalUnits = simCartons * unitsPerCarton;
  const totalWholesaleCost = totalUnits * simPrice;
  const totalMrpValue = totalUnits * simMrp;
  const totalProfit = totalMrpValue - totalWholesaleCost;
  const marginPercent = simMrp > 0 ? Math.round(((simMrp - simPrice) / simMrp) * 100) : 11;

  const handleHeroSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setActivePublicPage('products');
  };

  const handleSimOrderOnWhatsApp = () => {
    if (activeSimProduct) {
      openInterestModal(activeSimProduct);
    }
  };

  return (
    <div className="space-y-20 pb-24 text-slate-900">
      {/* 1. Humanized Hero Section: Warm, Confident & Authentic */}
      <section className="relative overflow-hidden bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900 text-white pt-16 pb-24 px-4 sm:px-6 lg:px-8 border-b border-slate-800">
        <div className="absolute inset-0 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:32px_32px] opacity-10 pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10 space-y-12">
          {/* Top Status Capsule */}
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800/80 pb-6 text-xs">
            <div className="flex items-center gap-3">
              <span className="flex h-2.5 w-2.5 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
              </span>
              <span className="text-slate-300 font-medium">
                Central Depot Active • <strong className="text-white">Malda & Eastern Corridor</strong>
              </span>
            </div>

            <div className="flex items-center gap-4 text-slate-400 font-mono text-[11px]">
              <span className="hidden sm:inline">Offline Kirana Supply Network</span>
              <span>•</span>
              <a
                href="https://wa.me/917365980930"
                target="_blank"
                rel="noopener noreferrer"
                className="text-emerald-400 hover:text-emerald-300 font-semibold transition-colors flex items-center gap-1.5"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>Helpline: +91 73659 80930</span>
              </a>
            </div>
          </div>

          {/* Main Hero Header */}
          <div className="max-w-4xl space-y-6 text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-400/20 text-emerald-300 text-xs font-medium backdrop-blur-md">
              <Store className="w-3.5 h-3.5 text-emerald-400" />
              <span>Direct Manufacturer-to-Kirana Distribution</span>
            </div>

            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-[1.08]">
              Wholesale grocery supply, <br />
              <span className="font-serif italic font-normal text-emerald-400">
                delivered by your neighborhood rep.
              </span>
            </h1>

            <p className="text-base sm:text-xl text-slate-300 max-w-2xl leading-relaxed font-normal">
              No digital cards. No middleman markups. Browse daily brand staples like Colgate, Dove, Tata Salt, and Surf Excel. Connect directly with your route salesman on WhatsApp, inspect your stock physically, and pay cash on delivery.
            </p>

            {/* Live Search & Quick Action Bar */}
            <form onSubmit={handleHeroSearchSubmit} className="pt-2 max-w-2xl flex flex-col sm:flex-row gap-2.5">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-3.5 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  value={heroSearch}
                  onChange={(e) => setHeroSearch(e.target.value)}
                  placeholder="Search products, brands (Colgate, Dove, Tata Salt)..."
                  className="w-full pl-12 pr-4 py-3.5 bg-slate-900/90 text-white placeholder:text-slate-400 text-sm rounded-xl border border-slate-700/80 focus:outline-hidden focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 shadow-inner"
                />
              </div>

              <button
                type="submit"
                className="px-7 py-3.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm rounded-xl shadow-lg shadow-emerald-500/20 active:scale-98 transition-all flex items-center justify-center gap-2 shrink-0"
              >
                <span>Browse Catalog</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            {/* Human Team Presence / Social Proof */}
            <div className="pt-4 flex flex-wrap items-center gap-4 text-xs text-slate-400">
              <div className="flex -space-x-2 overflow-hidden">
                {salesmen.slice(0, 4).map((s) => (
                  <img
                    key={s.id}
                    src={s.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80'}
                    alt={s.name}
                    className="inline-block h-8 w-8 rounded-full ring-2 ring-slate-950 object-cover"
                  />
                ))}
              </div>
              <p className="text-slate-300">
                <strong className="text-white font-semibold">Rahul, Amit, Suman & Priya</strong> are actively covering retail routes in Malda & Murshidabad today.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Meet Your Local Field Representatives (Human Touch Section) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              Our People On The Ground
            </span>
            <h2 className="text-3xl font-extrabold text-slate-900 mt-2 font-display">
              Meet Your Designated Route Associates
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Real people you can call, meet in person, and count on for honest trade quotes.
            </p>
          </div>

          <button
            onClick={() => setActivePublicPage('contact')}
            className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 inline-flex items-center gap-1 transition-colors"
          >
            <span>View All Coverage PINs</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {salesmen.slice(0, 4).map((rep) => (
            <div
              key={rep.id}
              className="bg-white rounded-2xl border border-slate-200/90 hover:border-emerald-300 p-5 shadow-2xs hover:shadow-xl hover:-translate-y-1 transition-all duration-200 flex flex-col justify-between"
            >
              <div className="space-y-3.5">
                <div className="flex items-center gap-3.5">
                  <img
                    src={rep.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=160&q=80'}
                    alt={rep.name}
                    className="w-14 h-14 rounded-2xl object-cover border-2 border-slate-100 shadow-2xs"
                  />
                  <div>
                    <h3 className="font-bold text-base text-slate-900">{rep.name}</h3>
                    <span className="text-[10px] font-bold uppercase text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                      Route Junior
                    </span>
                  </div>
                </div>

                <div className="space-y-1.5 text-xs text-slate-600 font-sans">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>
                      Areas: <strong className="font-mono text-slate-800">{rep.assignedAreas.join(', ')}</strong>
                    </span>
                  </div>
                  <div className="flex items-center gap-2 font-mono text-[11px] text-slate-500">
                    <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>{rep.phone}</span>
                  </div>
                </div>

                <p className="text-[11px] text-slate-500 bg-slate-50 p-2.5 rounded-xl border border-slate-100 leading-relaxed">
                  Regularly visits store premises with batch catalogs and promotional floor units.
                </p>
              </div>

              <div className="pt-4 border-t border-slate-100 mt-4">
                <a
                  href={`https://wa.me/917365980930?text=${encodeURIComponent(`Hi, I'm reaching out via GraminMart to connect with route associate ${rep.name} for my store.`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2.5 bg-slate-100 hover:bg-emerald-600 hover:text-white text-slate-800 font-semibold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-all duration-150"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>Connect via WhatsApp</span>
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. Interactive Kirana Profit & Margin Simulator (Advanced Feature) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-slate-900 via-slate-950 to-emerald-950 rounded-3xl p-6 sm:p-10 text-white shadow-2xl border border-slate-800">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Left: Explanation */}
            <div className="lg:col-span-6 space-y-4">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold border border-emerald-400/30">
                <Calculator className="w-3.5 h-3.5" />
                <span>Interactive Kirana Profit Simulator</span>
              </span>

              <h2 className="text-3xl sm:text-4xl font-extrabold text-white leading-tight font-display">
                Calculate your exact retail margin <br />
                <span className="font-serif italic font-normal text-emerald-400">
                  before you place any offline order.
                </span>
              </h2>

              <p className="text-sm text-slate-300 leading-relaxed">
                See exactly how much your store keeps on fast-moving cartons. Full transparency on ex-depot trade rates versus maximum retail pricing.
              </p>

              {/* Product selector buttons */}
              <div className="pt-2">
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                  Select Fast Moving Product:
                </label>
                <div className="flex flex-wrap gap-2">
                  {products.slice(0, 5).map((p, idx) => (
                    <button
                      key={p.id}
                      onClick={() => setSimProductIndex(idx)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                        simProductIndex === idx
                          ? 'bg-emerald-500 text-slate-950 font-bold shadow-md'
                          : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                      }`}
                    >
                      {p.name.split(' ')[0]} {p.name.split(' ')[1]}
                    </button>
                  ))}
                </div>
              </div>

              {/* Volume Slider */}
              <div className="pt-2 space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-300">Order Quantity:</span>
                  <span className="font-mono text-emerald-400 font-bold text-sm">
                    {simCartons} Cartons ({totalUnits} units)
                  </span>
                </div>
                <input
                  type="range"
                  min={1}
                  max={50}
                  step={1}
                  value={simCartons}
                  onChange={(e) => setSimCartons(parseInt(e.target.value) || 1)}
                  className="w-full accent-emerald-500 cursor-pointer h-2 bg-slate-800 rounded-lg"
                />
                <div className="flex justify-between text-[11px] text-slate-500 font-mono">
                  <span>1 Carton</span>
                  <span>25 Cartons</span>
                  <span>50 Cartons</span>
                </div>
              </div>
            </div>

            {/* Right: Profit Breakdown Card */}
            <div className="lg:col-span-6">
              <div className="bg-slate-900/95 rounded-2xl border border-slate-700/80 p-6 sm:p-8 space-y-6 shadow-xl backdrop-blur-md">
                <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                  <div>
                    <span className="text-xs uppercase tracking-wider text-emerald-400 font-bold">
                      {activeSimProduct.brand}
                    </span>
                    <h3 className="text-base font-bold text-white truncate max-w-xs">
                      {activeSimProduct.name}
                    </h3>
                  </div>
                  <span className="text-xs font-mono bg-emerald-950 text-emerald-300 px-2.5 py-1 rounded-lg border border-emerald-800">
                    +{marginPercent}% Net Margin
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4 text-xs font-sans">
                  <div className="p-3.5 bg-slate-950/80 rounded-xl border border-slate-800 space-y-1">
                    <span className="text-slate-400 block text-[11px]">Wholesale Cost:</span>
                    <p className="text-lg font-bold text-white">
                      ₹{totalWholesaleCost.toLocaleString('en-IN')}
                    </p>
                    <span className="text-[10px] text-slate-500">
                      @ ₹{simPrice} / unit
                    </span>
                  </div>

                  <div className="p-3.5 bg-slate-950/80 rounded-xl border border-slate-800 space-y-1">
                    <span className="text-slate-400 block text-[11px]">Retail MRP Value:</span>
                    <p className="text-lg font-bold text-slate-300">
                      ₹{totalMrpValue.toLocaleString('en-IN')}
                    </p>
                    <span className="text-[10px] text-slate-500">
                      @ ₹{simMrp} / unit
                    </span>
                  </div>
                </div>

                {/* Net Profit Callout */}
                <div className="p-4 bg-emerald-950/60 rounded-xl border border-emerald-500/40 text-center space-y-1">
                  <span className="text-xs font-semibold text-emerald-300 uppercase tracking-wider">
                    Total Estimated Kirana Profit:
                  </span>
                  <div className="text-3xl font-extrabold text-white font-display">
                    +₹{totalProfit.toLocaleString('en-IN')}
                  </div>
                  <p className="text-[11px] text-emerald-200/80">
                    Free doorstep delivery to your store corridor. Zero hidden fees.
                  </p>
                </div>

                <button
                  onClick={handleSimOrderOnWhatsApp}
                  className="w-full py-3.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md shadow-emerald-500/20 flex items-center justify-center gap-2 active:scale-98"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Inquire This Batch on WhatsApp (+91 73659 80930)</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Curated Daily FMCG Lines */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              High Turnover Inventory
            </span>
            <h2 className="text-3xl font-extrabold text-slate-900 mt-2 font-display">
              Featured Brand Staples
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Fresh mill and factory batches ready for immediate local dispatch.
            </p>
          </div>

          <button
            onClick={() => setActivePublicPage('products')}
            className="text-xs font-bold text-emerald-700 hover:text-emerald-800 inline-flex items-center gap-1.5 transition-colors"
          >
            <span>Explore Complete Showcase</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Product Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProducts.map((p) => {
            const margin = p.mrp - p.price;
            const marginPct = Math.round((margin / p.mrp) * 100);

            return (
              <div
                key={p.id}
                className="bg-white rounded-2xl border border-slate-200/90 hover:border-emerald-300 overflow-hidden shadow-2xs hover:shadow-xl hover:-translate-y-1 transition-all duration-200 flex flex-col justify-between group"
              >
                <div>
                  <div className="relative aspect-4/3 overflow-hidden bg-slate-100">
                    <img
                      src={p.image}
                      alt={p.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <span className="absolute top-3 left-3 bg-slate-900/80 backdrop-blur-xs text-white text-[10px] font-semibold px-2 py-0.5 rounded-md">
                      {p.category}
                    </span>

                    {p.offer && (
                      <span className="absolute bottom-3 left-3 bg-amber-500 text-slate-950 text-[10px] font-extrabold px-2 py-0.5 rounded-md shadow-sm">
                        Scheme Available
                      </span>
                    )}
                  </div>

                  <div className="p-4 space-y-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700">
                      {p.brand}
                    </span>
                    <h3 className="font-display font-bold text-sm text-slate-900 line-clamp-1 group-hover:text-emerald-700 transition-colors">
                      {p.name}
                    </h3>
                    <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                      {p.description}
                    </p>

                    <div className="pt-2 flex items-baseline justify-between border-t border-slate-100">
                      <div>
                        <span className="text-xl font-extrabold text-slate-900 font-display">
                          ₹{p.price}
                        </span>
                        <span className="text-xs text-slate-400 line-through ml-2">
                          MRP ₹{p.mrp}
                        </span>
                      </div>
                      <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                        +{marginPct}% Margin
                      </span>
                    </div>

                    <div className="text-[11px] text-slate-500 flex items-center justify-between pt-1">
                      <span>Unit: {p.unit}</span>
                      <span className="font-semibold text-slate-700">{p.packSize}</span>
                    </div>
                  </div>
                </div>

                {/* Card CTA Actions */}
                <div className="p-4 pt-0 grid grid-cols-2 gap-2">
                  <button
                    onClick={() => openDetailModal(p)}
                    className="py-2.5 px-3 rounded-xl border border-slate-200 text-slate-700 font-semibold text-xs hover:bg-slate-50 transition-colors text-center"
                  >
                    View Specs
                  </button>
                  <button
                    onClick={() => openInterestModal(p)}
                    className="py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-1 shadow-md shadow-emerald-600/15 active:scale-95 transition-all"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>I'm Interested</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 5. Authentic Kirana Voices (Human Social Proof) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-100 rounded-3xl p-8 sm:p-12 border border-slate-200 space-y-8">
          <div className="max-w-2xl space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              Community Testimonials
            </span>
            <h2 className="text-3xl font-extrabold text-slate-900 font-display">
              Trusted by 450+ Neighborhood Kiranas
            </h2>
            <p className="text-xs sm:text-sm text-slate-600">
              Real store owners sharing their experience with our offline sales and delivery reps.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-2xs space-y-4">
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed italic">
                &ldquo;Rahul visits our store every Wednesday without fail. If a carton has a dented edge, he swaps it immediately on the spot. No email complaints, no waiting on chatbots. True wholesale peace of mind.&rdquo;
              </p>
              <div className="flex items-center gap-3 pt-2 border-t border-slate-100">
                <div className="w-9 h-9 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center text-xs">
                  BP
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Bikash Paul</h4>
                  <p className="text-[11px] text-slate-500">Maa Tara Variety Store, English Bazar (PIN 732123)</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-2xs space-y-4">
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed italic">
                &ldquo;We stopped losing margins to big distributors who only favor supermarkets. With GraminMart, we get direct factory prices even when ordering 5 to 10 cartons of Dove and Colgate.&rdquo;
              </p>
              <div className="flex items-center gap-3 pt-2 border-t border-slate-100">
                <div className="w-9 h-9 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center text-xs">
                  SD
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Subhashish Das</h4>
                  <p className="text-[11px] text-slate-500">Janata Kirana, Old Malda (PIN 732101)</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Humanized Process: How an Offline Deal Actually Happens */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            Transparent Workflow
          </span>
          <h2 className="text-3xl font-extrabold text-slate-900 mt-2 font-display">
            How An Offline Purchase Unfolds
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Zero online payment risks. Designed specifically for retail shopkeepers.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-2xs space-y-3">
            <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider font-mono">Step 1</span>
            <h3 className="font-bold text-base text-slate-900">Browse Free On Phone</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Open the website, check transparent carton prices and packaging without needing to register.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-2xs space-y-3">
            <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider font-mono">Step 2</span>
            <h3 className="font-bold text-base text-slate-900">Tap "I'm Interested"</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Launches WhatsApp with your pre-written product inquiry. No typing required.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-2xs space-y-3">
            <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider font-mono">Step 3</span>
            <h3 className="font-bold text-base text-slate-900">Area Rep Visits You</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Your designated junior representative stops by with physical samples and trade scheme sheets.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-2xs space-y-3">
            <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider font-mono">Step 4</span>
            <h3 className="font-bold text-base text-slate-900">Inspect & Settle Spot Cash</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Verify batch seals, receive physical spot invoice, and settle via cash or shop UPI upon delivery.
            </p>
          </div>
        </div>
      </section>

      {/* 7. Direct WhatsApp CTA Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-emerald-800 via-emerald-700 to-teal-800 rounded-3xl p-8 sm:p-12 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-emerald-200 text-xs font-bold uppercase tracking-wider backdrop-blur-xs border border-white/20">
              <Phone className="w-3.5 h-3.5" />
              Direct WhatsApp Helpline
            </span>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-white font-display">
              Ready to stock your kirana shelves?
            </h3>
            <p className="text-xs sm:text-sm text-emerald-100 max-w-xl leading-relaxed">
              Message our central dispatch desk at <strong>+91 73659 80930</strong>. We will connect you to your local route associate immediately.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
            <a
              href="https://wa.me/917365980930?text=Hi%20GraminMart%2C%20I%20would%20like%20to%20connect%20with%20my%20area%20salesman%20for%20grocery%20orders."
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3.5 rounded-xl bg-white hover:bg-slate-50 text-slate-950 font-bold text-xs uppercase tracking-wider shadow-md transition-all flex items-center gap-2"
            >
              <MessageCircle className="w-4 h-4 text-emerald-600" />
              <span>Message +91 73659 80930</span>
            </a>

            <button
              onClick={() => setActivePublicPage('products')}
              className="px-6 py-3.5 rounded-xl bg-slate-950/40 hover:bg-slate-950/60 text-white font-semibold text-xs border border-white/20 transition-colors"
            >
              Browse Full Catalog
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
