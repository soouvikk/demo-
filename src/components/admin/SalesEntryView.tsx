import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { calculateCommission, evaluateSalesmanLevel } from '../../services/commissionEngine';
import { 
  Receipt, 
  CheckCircle2, 
  AlertCircle, 
  MapPin, 
  User, 
  Package, 
  DollarSign, 
  Percent,
  Sparkles,
  ShieldCheck
} from 'lucide-react';

export const SalesEntryView: React.FC = () => {
  const { products, salesmen, levels, addSale } = useApp();
  const { isSuperAdmin, isJunior, currentUser } = useAuth();

  const [selectedSalesmanId, setSelectedSalesmanId] = useState<string>(
    currentUser.salesmanId || salesmen[0]?.id || 'sm-rahul'
  );
  const [selectedProductId, setSelectedProductId] = useState<string>(products[0]?.id || '');
  const [quantity, setQuantity] = useState<number>(10);
  const [customerName, setCustomerName] = useState<string>('Maa Tara Kirana Store');
  const [areaPin, setAreaPin] = useState<string>('732123');
  const [saleRecordedSuccess, setSaleRecordedSuccess] = useState<boolean>(false);

  const fallbackProduct = {
    id: 'prod-colgate-1',
    name: 'Colgate MaxFresh Spicy Fresh Toothpaste 150g',
    price: 40,
    mrp: 45,
  };

  const activeSalesman = salesmen.find((s) => s.id === selectedSalesmanId) || salesmen[0];
  const selectedProduct = products.find((p) => p.id === selectedProductId) || products[0] || fallbackProduct;
  const productPrice = selectedProduct?.price ?? 40;

  // Evaluate junior's current level based on their sales volume
  const levelDetails = useMemo(() => {
    return evaluateSalesmanLevel(activeSalesman?.totalSalesAmount || 0, levels);
  }, [activeSalesman?.totalSalesAmount, levels]);

  const applicableRate = levelDetails.currentCommissionRate; // e.g. 0.50% for EXTRA

  // Exact Commission calculation (Rule 1, 4, 5)
  const calculation = useMemo(() => {
    return calculateCommission(productPrice, quantity, applicableRate);
  }, [productPrice, quantity, applicableRate]);

  const handleSubmitSale = (e: React.FormEvent) => {
    e.preventDefault();

    addSale({
      salesmanId: activeSalesman.id,
      salesmanName: activeSalesman.name,
      productId: selectedProduct.id,
      productName: selectedProduct.name,
      productPrice: productPrice,
      quantity,
      saleAmount: calculation.saleAmount,
      applicableJuniorRate: applicableRate,
      commissionRate: applicableRate,
      calculatedCommission: calculation.calculatedJuniorCommission,
      maxCommissionPoolRate: calculation.maxCommissionPoolRate,
      salesmanLevel: levelDetails.currentLevel.name,
      customerAreaPin: areaPin.trim() || activeSalesman.assignedAreas[0] || '732123',
      customerName: customerName.trim(),
      status: 'COMPLETED',
      date: new Date().toISOString().split('T')[0],
      createdBy: currentUser.id,
    });

    setSaleRecordedSuccess(true);
    setTimeout(() => {
      setSaleRecordedSuccess(false);
    }, 4000);
  };

  return (
    <div className="space-y-6 text-[#20261D]">
      {/* Header */}
      <div className="border-b border-[#E8E0D5] pb-5">
        <div className="flex items-center gap-2 text-xs font-bold text-[#7D8D64] uppercase tracking-wider font-mono">
          <Receipt className="w-4 h-4" />
          <span>Rule 1, 4 & 5 — Offline Sales Entry & Exact Commissioning</span>
        </div>
        <h2 className="text-2xl font-extrabold text-[#20261D] mt-1 font-display">
          Record Completed Offline Sale
        </h2>
        <p className="text-xs text-[#646A5E] mt-1">
          Record physical stock delivery and compute junior commission strictly by current tier percentage.
        </p>
      </div>

      {saleRecordedSuccess && (
        <div className="p-4 bg-[#EDF2E8] border border-[#C8D4B8] rounded-2xl text-[#2A331E] text-xs flex items-center gap-3 animate-in fade-in duration-200 shadow-sm">
          <CheckCircle2 className="w-5 h-5 text-[#7D8D64] shrink-0" />
          <div>
            <strong className="block font-bold">Transaction Successfully Recorded to Master Ledger!</strong>
            <span>Commission of ₹{calculation.calculatedJuniorCommission.toFixed(2)} credited to {activeSalesman.name}'s performance ledger.</span>
          </div>
        </div>
      )}

      {/* Form & Real-Time Calculation Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start">
        {/* Form Column */}
        <div className="lg:col-span-7 bg-white p-5 sm:p-7 rounded-2xl border border-[#E8E0D5] shadow-2xs space-y-5">
          <h3 className="text-sm font-bold text-[#20261D] uppercase font-mono tracking-wider border-b border-[#E8E0D5] pb-3">
            Sale Transaction Details
          </h3>

          <form onSubmit={handleSubmitSale} className="space-y-4 text-xs font-mono">
            {/* Salesman Selection */}
            <div>
              <label className="block text-[#20261D] font-bold uppercase mb-1">
                FMCG Route Junior:
              </label>
              <select
                value={selectedSalesmanId}
                onChange={(e) => setSelectedSalesmanId(e.target.value)}
                disabled={isJunior} // Junior can only record their own
                className="w-full p-3 border border-[#E8E0D5] rounded-xl bg-[#FAF7F2] font-bold text-[#20261D] focus:ring-2 focus:ring-[#7D8D64]/30"
              >
                {salesmen.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name} ({s.assignedAreas.join(', ')}) — Tier: {s.levelId}
                  </option>
                ))}
              </select>
            </div>

            {/* Product Selection */}
            <div>
              <label className="block text-[#20261D] font-bold uppercase mb-1">
                Product Sourced:
              </label>
              <select
                value={selectedProductId}
                onChange={(e) => setSelectedProductId(e.target.value)}
                className="w-full p-3 border border-[#E8E0D5] rounded-xl bg-[#FAF7F2] font-bold text-[#20261D] focus:ring-2 focus:ring-[#7D8D64]/30"
              >
                {products.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} — Unit Price: ₹{p.price} (MRP: ₹{p.mrp})
                  </option>
                ))}
              </select>
            </div>

            {/* Quantity & PIN Corridor */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[#20261D] font-bold uppercase mb-1">
                  Quantity Delivered (Units):
                </label>
                <input
                  type="number"
                  min={1}
                  required
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-full p-3 border border-[#E8E0D5] rounded-xl bg-[#FAF7F2] font-bold text-[#20261D] focus:ring-2 focus:ring-[#7D8D64]/30"
                />
              </div>

              <div>
                <label className="block text-[#20261D] font-bold uppercase mb-1">
                  Delivery PIN Corridor:
                </label>
                <input
                  type="text"
                  required
                  value={areaPin}
                  onChange={(e) => setAreaPin(e.target.value)}
                  placeholder="e.g. 732123"
                  className="w-full p-3 border border-[#E8E0D5] rounded-xl bg-[#FAF7F2] font-bold text-[#20261D] focus:ring-2 focus:ring-[#7D8D64]/30"
                />
              </div>
            </div>

            {/* Store Name */}
            <div>
              <label className="block text-[#20261D] font-bold uppercase mb-1">
                Receiving Kirana Store Name:
              </label>
              <input
                type="text"
                required
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="e.g. Maa Tara Kirana Store"
                className="w-full p-3 border border-[#E8E0D5] rounded-xl bg-[#FAF7F2] font-bold text-[#20261D] focus:ring-2 focus:ring-[#7D8D64]/30"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-[#7D8D64] hover:bg-[#6E7D56] text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md shadow-[#7D8D64]/25 active:scale-98 flex items-center justify-center gap-2 mt-4"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Record Offline Sale & Disburse Commission</span>
            </button>
          </form>
        </div>

        {/* Live Rule 1, 4, 5 Calculation Summary */}
        <div className="lg:col-span-5 bg-[#1C2214] text-white p-5 sm:p-6 rounded-2xl border border-[#3C472C] shadow-xl space-y-5">
          <div className="flex items-center justify-between border-b border-[#3C472C] pb-3">
            <span className="text-xs uppercase font-mono tracking-wider text-[#A3B489] font-bold">
              Real-Time Commission Audit
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#2A331E] text-[#EDF2E8] border border-[#7D8D64]/40">
              Rule 1 & 4 Enforced
            </span>
          </div>

          <div className="space-y-3 font-mono text-xs">
            <div className="flex justify-between py-1 border-b border-[#3C472C]">
              <span className="text-[#C8D4B8]">Junior Salesman:</span>
              <span className="font-bold text-white font-sans">{activeSalesman.name}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-[#3C472C]">
              <span className="text-[#C8D4B8]">Current Assigned Level:</span>
              <span className="font-bold text-[#E8E0D5]">{levelDetails.currentLevel.name}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-[#3C472C]">
              <span className="text-[#C8D4B8]">Applicable Tier Rate:</span>
              <span className="font-bold text-[#A3B489]">{applicableRate}%</span>
            </div>
            <div className="flex justify-between py-1 border-b border-[#3C472C]">
              <span className="text-[#C8D4B8]">Product & Price:</span>
              <span className="font-bold text-white font-sans truncate max-w-[180px]">{selectedProduct.name} (₹{productPrice})</span>
            </div>
            <div className="flex justify-between py-1 border-b border-[#3C472C]">
              <span className="text-[#C8D4B8]">Quantity:</span>
              <span className="font-bold text-white">{quantity} units</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-[#3C472C] text-sm">
              <span className="text-[#EDF2E8] font-bold">Sale Amount:</span>
              <span className="font-black text-[#A3B489]">₹{calculation.saleAmount.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-[#3C472C]">
              <span className="text-[#C8D4B8]">Max Pool Ceiling (4%):</span>
              <span className="text-[#C8D4B8]">₹{calculation.maxCommissionPoolAmount.toFixed(2)}</span>
            </div>
          </div>

          {/* Junior Commission Highlight */}
          <div className="p-4 bg-[#2A331E] rounded-xl border border-[#7D8D64]/50 text-center space-y-1">
            <span className="text-[10px] uppercase font-mono tracking-wider text-[#A3B489] font-bold block">
              Credited Junior Commission:
            </span>
            <div className="text-3xl font-black text-white font-display">
              ₹{calculation.calculatedJuniorCommission.toFixed(2)}
            </div>
            <p className="text-[11px] text-[#C8D4B8] font-mono">
              ₹{calculation.saleAmount} × {applicableRate}% = ₹{calculation.calculatedJuniorCommission.toFixed(2)}
            </p>
          </div>

          {/* Retained Pool Balance */}
          <div className="p-3 bg-[#242C19] rounded-xl border border-[#3C472C] text-xs flex justify-between items-center font-mono">
            <span className="text-[#C8D4B8]">Retained Business Margin:</span>
            <span className="font-bold text-[#FAF7F2]">₹{calculation.retainedBusinessCommission.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
