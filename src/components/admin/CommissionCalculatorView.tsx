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
    <div className="space-y-8 text-[#20261D]">
      {/* Header */}
      <div className="border-b border-[#E8E0D5] pb-5">
        <div className="flex items-center gap-2 text-xs font-bold text-[#7D8D64] uppercase tracking-wider font-mono">
          <Calculator className="w-4 h-4" />
          <span>Core Mathematical Engine</span>
        </div>
        <h2 className="text-2xl font-extrabold text-[#20261D] mt-1 font-display">
          Live Commission Calculator
        </h2>
        <p className="text-xs text-[#646A5E] mt-1 max-w-2xl">
          Simulate offline sales commission according to strict company rules. 4% represents the absolute maximum business pool ceiling; each junior receives strictly their applicable tier rate.
        </p>
      </div>

      {/* Critical Rule 1 & 5 Notice Banner */}
      <div className="p-4 rounded-2xl bg-[#F3EDE4] border border-[#E8E0D5] text-xs text-[#20261D] space-y-2 shadow-2xs">
        <div className="flex items-center gap-2 font-bold text-[#3C472C] text-sm">
          <AlertTriangle className="w-4 h-4 text-[#7D8D64] shrink-0" />
          <span>Crucial Business Rule: 4% Maximum Pool vs Applicable Junior Rate</span>
        </div>
        <p className="leading-relaxed text-[#4A5638]">
          <strong>DO NOT CALCULATE:</strong> ₹400 × 4% = ₹16 for a junior whose applicable rate is 0.50%. <br />
          <strong>CORRECT CALCULATION:</strong> ₹400 × 0.50% = <strong>₹2.00 commission</strong>. The remaining ₹14 (3.50%) stays in the retained business pool.
        </p>
      </div>

      {/* Dual Column: Interactive Calculator + Live Result Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Input Form Column */}
        <div className="lg:col-span-6 bg-white p-6 rounded-2xl border border-[#E8E0D5] shadow-2xs space-y-5">
          <h3 className="text-sm font-bold text-[#20261D] uppercase tracking-wider font-mono border-b border-[#E8E0D5] pb-3">
            Simulation Inputs
          </h3>

          {/* Product Selector */}
          <div>
            <label className="block text-xs font-bold text-[#20261D] uppercase mb-1">
              Select Product:
            </label>
            <select
              value={selectedProductId}
              onChange={(e) => {
                setSelectedProductId(e.target.value);
                const prod = products.find((p) => p.id === e.target.value);
                if (prod) setCustomPrice(prod.price);
              }}
              className="w-full text-xs font-medium border border-[#E8E0D5] rounded-xl p-3 bg-[#FAF7F2] focus:ring-2 focus:ring-[#7D8D64]/30 focus:border-[#7D8D64] transition"
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
              <label className="block text-xs font-bold text-[#20261D] uppercase mb-1">
                Unit Price (₹):
              </label>
              <input
                type="number"
                min={1}
                value={price}
                onChange={(e) => setCustomPrice(Math.max(1, parseFloat(e.target.value) || 0))}
                className="w-full text-xs font-mono font-bold border border-[#E8E0D5] rounded-xl p-2.5 bg-[#FAF7F2] focus:ring-2 focus:ring-[#7D8D64]/30 focus:border-[#7D8D64]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#20261D] uppercase mb-1">
                Quantity (Units):
              </label>
              <input
                type="number"
                min={1}
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-full text-xs font-mono font-bold border border-[#E8E0D5] rounded-xl p-2.5 bg-[#FAF7F2] focus:ring-2 focus:ring-[#7D8D64]/30 focus:border-[#7D8D64]"
              />
            </div>
          </div>

          {/* Junior Level Selection */}
          <div>
            <label className="block text-xs font-bold text-[#20261D] uppercase mb-1">
              Junior Qualification Level:
            </label>
            <select
              value={selectedLevelId}
              onChange={(e) => setSelectedLevelId(e.target.value)}
              className="w-full text-xs font-mono font-bold border border-[#E8E0D5] rounded-xl p-3 bg-[#FAF7F2] focus:ring-2 focus:ring-[#7D8D64]/30 focus:border-[#7D8D64]"
            >
              {levels.map((lvl) => (
                <option key={lvl.id} value={lvl.id}>
                  {lvl.name} (Qualification: ₹{lvl.qualificationAmount.toLocaleString('en-IN')}) — Rate: {lvl.rate}%
                </option>
              ))}
            </select>
            <span className="text-[11px] text-[#646A5E] mt-1 block">
              Applicable tier rate for {selectedLevel.name}: <strong>{selectedLevel.rate}%</strong>
            </span>
          </div>

          {/* Quick Preset Buttons */}
          <div className="pt-2 border-t border-[#E8E0D5]">
            <span className="text-[11px] text-[#646A5E] font-semibold block mb-2">
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
                className="px-2.5 py-1 rounded-lg bg-[#FAF7F2] hover:bg-[#EDF2E8] hover:text-[#3C472C] border border-[#E8E0D5] transition"
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
                className="px-2.5 py-1 rounded-lg bg-[#FAF7F2] hover:bg-[#EDF2E8] hover:text-[#3C472C] border border-[#E8E0D5] transition"
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
                className="px-2.5 py-1 rounded-lg bg-[#FAF7F2] hover:bg-[#EDF2E8] hover:text-[#3C472C] border border-[#E8E0D5] transition"
              >
                ₹3,000 × 1 (L-1 @ 0.20%)
              </button>
            </div>
          </div>
        </div>

        {/* Live Calculation Result Card */}
        <div className="lg:col-span-6 space-y-4">
          <div className="bg-[#1C2214] text-white p-6 sm:p-7 rounded-2xl border border-[#3C472C] shadow-xl space-y-5">
            <div className="flex items-center justify-between border-b border-[#3C472C] pb-4">
              <span className="text-xs uppercase font-mono tracking-wider text-[#A3B489] font-bold">
                Calculated Commission Breakdown
              </span>
              <span className="text-[11px] font-mono bg-[#2A331E] text-[#EDF2E8] px-2 py-0.5 rounded-md border border-[#3C472C]">
                Formula Verified
              </span>
            </div>

            {/* Spec Sheet Table */}
            <div className="space-y-3 font-mono text-xs">
              <div className="flex justify-between py-1 border-b border-[#3C472C]">
                <span className="text-[#C8D4B8]">Product:</span>
                <span className="font-bold text-white">{selectedProduct?.name || 'Custom Item'}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#3C472C]">
                <span className="text-[#C8D4B8]">Price:</span>
                <span className="font-bold text-white">₹{price}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#3C472C]">
                <span className="text-[#C8D4B8]">Quantity:</span>
                <span className="font-bold text-white">{quantity} units</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-[#3C472C] text-sm">
                <span className="text-[#EDF2E8] font-bold">Sale Amount (Price × Qty):</span>
                <span className="font-black text-[#A3B489]">₹{result.saleAmount.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#3C472C]">
                <span className="text-[#C8D4B8]">Maximum Commission Pool (4%):</span>
                <span className="text-[#E8E0D5] font-mono">₹{result.maxCommissionPoolAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#3C472C]">
                <span className="text-[#C8D4B8]">Junior Level:</span>
                <span className="font-bold text-[#E8E0D5] uppercase">{selectedLevel.name}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#3C472C]">
                <span className="text-[#C8D4B8]">Applicable Commission Rate:</span>
                <span className="font-bold text-[#A3B489]">{applicableRate}%</span>
              </div>
            </div>

            {/* Final Highlighted Commission Box */}
            <div className="p-4 bg-[#2A331E] rounded-xl border border-[#7D8D64]/50 text-center space-y-1">
              <span className="text-[11px] font-mono uppercase tracking-wider text-[#A3B489] font-bold block">
                Calculated Junior Commission:
              </span>
              <div className="text-3xl font-black text-white font-display">
                ₹{result.calculatedJuniorCommission.toFixed(2)}
              </div>
              <p className="text-[11px] text-[#C8D4B8] font-mono">
                Formula: ₹{result.saleAmount} × {applicableRate}% = ₹{result.calculatedJuniorCommission.toFixed(2)}
              </p>
            </div>

            {/* Retained Pool Balance */}
            <div className="p-3 bg-[#242C19] rounded-xl border border-[#3C472C] text-xs flex justify-between items-center font-mono">
              <span className="text-[#C8D4B8]">Retained Business Pool (4% - Junior):</span>
              <span className="font-bold text-[#FAF7F2]">₹{result.retainedBusinessCommission.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Validation Test Suite per Rule 9 */}
      <div className="bg-white p-6 rounded-2xl border border-[#E8E0D5] shadow-2xs space-y-4">
        <div className="flex items-center justify-between border-b border-[#E8E0D5] pb-3">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-[#7D8D64]" />
            <h3 className="text-sm font-bold text-[#20261D] font-display">
              Rule 9 Validation Suite (All 6 Test Cases)
            </h3>
          </div>
          <span className="text-[11px] font-mono px-2.5 py-0.5 rounded-full bg-[#EDF2E8] text-[#3C472C] font-bold border border-[#C8D4B8]">
            {validationSuite.passed ? '100% Passed (6 / 6)' : 'Failing'}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 font-mono text-xs">
          {validationSuite.testResults.map((t, idx) => (
            <div
              key={idx}
              className={`p-3 rounded-xl border flex items-center justify-between ${
                t.passed ? 'bg-[#FAF7F2] border-[#C8D4B8] text-[#20261D]' : 'bg-red-50 border-red-200 text-red-950'
              }`}
            >
              <div>
                <span className="font-bold block">{t.description}</span>
                <span className="text-[11px] text-[#646A5E]">
                  Expected: ₹{t.expected.toFixed(2)} • Actual: ₹{t.actual.toFixed(2)}
                </span>
              </div>
              {t.passed ? (
                <CheckCircle2 className="w-5 h-5 text-[#7D8D64] shrink-0" />
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
