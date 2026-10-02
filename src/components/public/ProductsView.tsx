import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Search, 
  MessageCircle, 
  SlidersHorizontal,
  Package,
  Store,
  ArrowRight,
  Info
} from 'lucide-react';

export const ProductsView: React.FC = () => {
  const { products, openInterestModal, openDetailModal } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'name'>('featured');

  const categories = useMemo(() => {
    const set = new Set(products.map((p) => p.category));
    return ['ALL', ...Array.from(set)];
  }, [products]);

  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Search filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.brand.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q)
      );
    }

    // Category filter
    if (selectedCategory !== 'ALL') {
      result = result.filter((p) => p.category === selectedCategory);
    }

    // Sort
    if (sortBy === 'price-asc') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-desc') {
      result.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'name') {
      result.sort((a, b) => a.name.localeCompare(b.name));
    } else {
      // featured
      result.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
    }

    return result;
  }, [products, searchQuery, selectedCategory, sortBy]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Page Header */}
      <div className="border-b border-slate-200 pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            Wholesale Catalog
          </span>
          <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-slate-900 mt-2">
            Grocery Product Showcase
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl">
            Official trade prices, carton packaging specifications, and manufacturer schemes. All transactions are settled offline upon doorstep inspection.
          </p>
        </div>

        {/* Informational Callout */}
        <div className="bg-emerald-50 border border-emerald-200/80 p-3.5 rounded-2xl text-xs text-emerald-950 max-w-sm flex items-start gap-2.5">
          <Info className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
          <span>
            <strong>Kirana Wholesale Policy:</strong> No digital shopping cart. Tapping "I'm Interested" triggers WhatsApp dispatch to your local area representative.
          </span>
        </div>
      </div>

      {/* Control Bar: Search, Category Filters, Sorting */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/90 shadow-2xs space-y-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-3">
          {/* Search Input */}
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by brand, item name (Colgate, Dove, Tata)..."
              className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 bg-slate-50/50 transition-colors"
            />
          </div>

          {/* Sort Selector */}
          <div className="w-full md:w-auto flex items-center justify-end gap-2 text-xs">
            <SlidersHorizontal className="w-3.5 h-3.5 text-slate-500" />
            <span className="text-slate-600 font-medium">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e: any) => setSortBy(e.target.value)}
              className="text-xs border border-slate-200 bg-slate-50/80 rounded-xl px-3 py-2 text-slate-800 font-medium focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition"
            >
              <option value="featured">High Velocity (Featured)</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="name">Alphabetical</option>
            </select>
          </div>
        </div>

        {/* Category Filter Chips */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none pt-1">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-150 ${
                selectedCategory === cat
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat === 'ALL' ? 'All FMCG Categories' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Results Count Bar */}
      <div className="flex items-center justify-between text-xs text-slate-500 px-1">
        <span>
          Showing <strong>{filteredProducts.length}</strong> active wholesale products
          {selectedCategory !== 'ALL' && ` in "${selectedCategory}"`}
        </span>
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="text-emerald-700 font-semibold hover:underline"
          >
            Clear Search
          </button>
        )}
      </div>

      {/* Product Grid */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredProducts.map((p) => {
            const margin = p.mrp - p.price;
            const marginPercent = Math.round((margin / p.mrp) * 100);

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
                        <span className="text-xl font-extrabold text-slate-900">
                          ₹{p.price}
                        </span>
                        <span className="text-xs text-slate-400 line-through ml-2">
                          MRP ₹{p.mrp}
                        </span>
                      </div>
                      <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                        +{marginPercent}% Margin
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
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-3">
          <Package className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="text-base font-bold text-slate-800">
            No matching products found
          </h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Try adjusting your search keywords or resetting the category filter.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('ALL');
            }}
            className="px-4 py-2 bg-emerald-600 text-white text-xs font-semibold rounded-xl"
          >
            Reset Filters
          </button>
        </div>
      )}
    </div>
  );
};
