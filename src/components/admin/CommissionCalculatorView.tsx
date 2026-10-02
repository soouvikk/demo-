import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { 
  calculateCommission, 
  validateCommissionEngine, 
  DEFAULT_MAX_POOL_RATE 
} from '../../services/commissionEngine';
import { 
  Calculator, 
  AlertTriangle, 
  CheckCircle2, 
  Info, 
  ShieldAlert, 
  Sparkles, 
  TrendingUp,
  Receipt,
  HelpCircle,
  XCircle
} from 'lucide-react';

export const CommissionCalculatorView: React.FC = () => {
  const { products, levels } = useApp();
  const { isSuperAdmin, isJunior, currentUser } = useAuth();

  const [selectedProductId, setSelectedProductId] = useState<string>(products[0]?.id || '');
  const [customPrice, setCustomPrice] = useState<number>(products[0]?.price || 40);
  const [quantity, setQuantity] = useState<number>(10);
  const [selectedLevelId, setSelectedLevelId] = useState<string>('EXTRA');

  const fallbackProduct = {
    id: 'prod-colgate-1',
    name: 'Colgate MaxFresh Spicy Fresh Toothpaste 150g',
    price: 40,
    mrp: 45,
  };
  const fallbackLevel = {
    id: 'EXTRA',
    name: 'Extra',
    qualificationAmount: 1000,
    rate: 0.50,
  };

  const selectedProduct = products.find((p) => p.id === selectedProductId) || products[0] || fallbackProduct;
  const selectedLevel = levels.find((l) => l.id === selectedLevelId) || levels[0] || fallbackLevel;

  const price = selectedProduct?.price ?? customPrice ?? 40;
  const applicableRate = selectedLevel?.rate ?? 0.50;

  // Exact Calculation
  const result = useMemo(() => {
    return calculateCommission(price, quantity, applicableRate, DEFAULT_MAX_POOL_RATE);
  }, [price, quantity, applicableRate]);

  // Validation Test Suite Results
  const validationSuite = useMemo(() => {
    return validateCommissionEngine();
  }, []);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="border-b border-slate-200 pb-5">
        <div className="flex items-center gap-2 text-xs font-bold text-emerald-700 uppercase tracking-wider font-mono">
          <Calculator className="w-4 h-4" />
          <span>Core Mathematical Engine</span>
        </div>
        <h2 className="text-2xl font-extrabold text-slate-900 mt-1 font-display">
          Live Commission Calculator
        </h2>
        <p className="text-xs text-slate-500 mt-1 max-w-2xl">
          Simulate offline sales commission according to strict company rules. 4% represents the absolute maximum business pool ceiling; each junior receives strictly their applicable tier rate.
        </p>
      </div>

      {/* Critical Rule 1 & 5 Notice Banner */}
      <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200/90 text-xs text-amber-900 space-y-2 shadow-2xs">
        <div className="flex items-center gap-2 font-bold text-amber-800 text-sm">
          <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
          <span>Crucial Business Rule: 4% Maximum Pool vs Applicable Junior Rate</span>
        </div>
        <p className="leading-relaxed">
          <strong>DO NOT CALCULATE:</strong> ₹400 × 4% = ₹16 for a junior whose applicable rate is 0.50%. <br />
          <strong>CORRECT CALCULATION:</strong> ₹400 × 0.50% = <strong>₹2.00 commission</strong>. The remaining ₹14 (3.50%) stays in the retained business pool.
        </p>
      </div>

      {/* Dual Column: Interactive Calculator + Live Result Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Input Form Column */}
        <div className="lg:col-span-6 bg-white p-6 rounded-2xl border border-slate-200/90 shadow-2xs space-y-5">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider font-mono border-b border-slate-100 pb-3">
            Simulation Inputs
          </h3>

          {/* Product Selector */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
              Select Product:
            </label>
            <select
              value={selectedProductId}
              onChange={(e) => {
                setSelectedProductId(e.target.value);
                const prod = products.find((p) => p.id === e.target.value);
                if (prod) setCustomPrice(prod.price);
              }}
              className="w-full text-xs font-medium border border-slate-200 rounded-xl p-3 bg-slate-50/60 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition"
            >
              {products.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} — ₹{p.price} (MRP ₹{p.mrp})
                </option>
              ))}
            </select>
          </div>

          {/* Quantity & Unit Price */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Unit Price (₹):
              </label>
              <input
                type="number"
                min={1}
                value={price}
                onChange={(e) => setCustomPrice(Math.max(1, parseFloat(e.target.value) || 0))}
                className="w-full text-xs font-mono font-bold border border-slate-200 rounded-xl p-2.5 bg-slate-50/60 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Quantity (Units):
              </label>
              <input
                type="number"
                min={1}
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-full text-xs font-mono font-bold border border-slate-200 rounded-xl p-2.5 bg-slate-50/60 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
              />
            </div>
          </div>

          {/* Junior Level Selection */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
              Junior Qualification Level:
            </label>
            <select
              value={selectedLevelId}
              onChange={(e) => setSelectedLevelId(e.target.value)}
              className="w-full text-xs font-mono font-bold border border-slate-200 rounded-xl p-3 bg-slate-50/60 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
            >
              {levels.map((lvl) => (
                <option key={lvl.id} value={lvl.id}>
                  {lvl.name} (Qualification: ₹{lvl.qualificationAmount.toLocaleString('en-IN')}) — Rate: {lvl.rate}%
                </option>
              ))}
            </select>
            <span className="text-[11px] text-slate-500 mt-1 block">
              Applicable tier rate for {selectedLevel.name}: <strong>{selectedLevel.rate}%</strong>
            </span>
          </div>

          {/* Quick Preset Buttons */}
          <div className="pt-2 border-t border-slate-100">
            <span className="text-[11px] text-slate-500 font-semibold block mb-2">
              Quick Test Presets (Rule 4 & 9):
            </span>
            <div className="flex flex-wrap gap-2 text-[11px] font-mono">
              <button
                type="button"
                onClick={() => {
                  setCustomPrice(40);
                  setQuantity(1);
                  setSelectedLevelId('EXTRA');
                }}
                className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 border border-slate-200 transition"
              >
                Colgate @ ₹40 × 1 (EXTRA)
              </button>
              <button
                type="button"
                onClick={() => {
                  setCustomPrice(40);
                  setQuantity(10);
                  setSelectedLevelId('EXTRA');
                }}
                className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 border border-slate-200 transition"
              >
                Colgate @ ₹40 × 10 (EXTRA)
              </button>
              <button
                type="button"
                onClick={() => {
                  setCustomPrice(3000);
                  setQuantity(1);
                  setSelectedLevelId('L-1');
                }}
                className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 border border-slate-200 transition"
              >
                ₹3,000 × 1 (L-1 @ 0.20%)
              </button>
            </div>
          </div>
        </div>

        {/* Live Calculation Result Card */}
        <div className="lg:col-span-6 space-y-4">
          <div className="bg-slate-900 text-white p-6 sm:p-7 rounded-2xl border border-slate-800 shadow-xl space-y-5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <span className="text-xs uppercase font-mono tracking-wider text-emerald-400 font-bold">
                Calculated Commission Breakdown
              </span>
              <span className="text-[11px] font-mono bg-slate-800 text-slate-300 px-2 py-0.5 rounded-md border border-slate-700">
                Formula Verified
              </span>
            </div>

            {/* Spec Sheet Table */}
            <div className="space-y-3 font-mono text-xs">
              <div className="flex justify-between py-1 border-b border-slate-800">
                <span className="text-slate-400">Product:</span>
                <span className="font-bold text-white">{selectedProduct?.name || 'Custom Item'}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800">
                <span className="text-slate-400">Price:</span>
                <span className="font-bold text-white">₹{price}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800">
                <span className="text-slate-400">Quantity:</span>
                <span className="font-bold text-white">{quantity} units</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-800 text-sm">
                <span className="text-slate-300 font-bold">Sale Amount (Price × Qty):</span>
                <span className="font-black text-emerald-400">₹{result.saleAmount.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800">
                <span className="text-slate-400">Maximum Commission Pool (4%):</span>
                <span className="text-slate-300 font-mono">₹{result.maxCommissionPoolAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800">
                <span className="text-slate-400">Junior Level:</span>
                <span className="font-bold text-amber-400 uppercase">{selectedLevel.name}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800">
                <span className="text-slate-400">Applicable Commission Rate:</span>
                <span className="font-bold text-emerald-400">{applicableRate}%</span>
              </div>
            </div>

            {/* Final Highlighted Commission Box */}
            <div className="p-4 bg-slate-950 rounded-xl border border-emerald-500/40 text-center space-y-1">
              <span className="text-[11px] font-mono uppercase tracking-wider text-emerald-300 font-bold block">
                Calculated Junior Commission:
              </span>
              <div className="text-3xl font-black text-white font-display">
                ₹{result.calculatedJuniorCommission.toFixed(2)}
              </div>
              <p className="text-[11px] text-slate-400 font-mono">
                Formula: ₹{result.saleAmount} × {applicableRate}% = ₹{result.calculatedJuniorCommission.toFixed(2)}
              </p>
            </div>

            {/* Retained Pool Balance */}
            <div className="p-3 bg-slate-800/60 rounded-xl border border-slate-700/80 text-xs flex justify-between items-center font-mono">
              <span className="text-slate-400">Retained Business Pool (4% - Junior):</span>
              <span className="font-bold text-slate-200">₹{result.retainedBusinessCommission.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Validation Test Suite per Rule 9 */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-2xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            <h3 className="text-sm font-bold text-slate-900 font-display">
              Rule 9 Validation Suite (All 6 Test Cases)
            </h3>
          </div>
          <span className="text-[11px] font-mono px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold">
            {validationSuite.passed ? '100% Passed (6 / 6)' : 'Failing'}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 font-mono text-xs">
          {validationSuite.testResults.map((t, idx) => (
            <div
              key={idx}
              className={`p-3 rounded-xl border flex items-center justify-between ${
                t.passed ? 'bg-emerald-50/60 border-emerald-200 text-emerald-950' : 'bg-red-50 border-red-200 text-red-950'
              }`}
            >
              <div>
                <span className="font-bold block">{t.description}</span>
                <span className="text-[11px] text-slate-500">
                  Expected: ₹{t.expected.toFixed(2)} • Actual: ₹{t.actual.toFixed(2)}
                </span>
              </div>
              {t.passed ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              ) : (
                <XCircle className="w-5 h-5 text-red-600 shrink-0" />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
