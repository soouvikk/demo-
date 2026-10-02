import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { evaluateSalesmanLevel } from '../../services/commissionEngine';
import { 
  TrendingUp, 
  Target, 
  Award, 
  Sparkles, 
  ShieldCheck, 
  CheckCircle2, 
  ArrowRight,
  User,
  Percent,
  Receipt
} from 'lucide-react';

export const JuniorLevelProgressView: React.FC = () => {
  const { levels, salesmen, sales } = useApp();
  const { isSuperAdmin, isJunior, currentUser } = useAuth();

  // If junior, default to their salesmanId, otherwise allow selecting salesman to inspect
  const [selectedSalesmanId, setSelectedSalesmanId] = useState<string>(
    currentUser.salesmanId || salesmen[0]?.id || 'sm-rahul'
  );

  // Allow custom sales simulator test (e.g. ₹700 per Rule 8 example)
  const [overrideSales, setOverrideSales] = useState<number | null>(700);

  const activeSalesman = salesmen.find((s) => s.id === selectedSalesmanId) || salesmen[0];

  const actualSales = useMemo(() => {
    const sList = sales.filter((s) => s.salesmanId === activeSalesman.id && s.status === 'COMPLETED');
    return sList.reduce((acc, s) => acc + s.saleAmount, 0);
  }, [sales, activeSalesman.id]);

  const effectiveSales = overrideSales !== null ? overrideSales : actualSales;

  // Evaluate Level & Progress according to strict Rule 8 & Rule 2
  const progressDetails = useMemo(() => {
    return evaluateSalesmanLevel(effectiveSales, levels);
  }, [effectiveSales, levels]);

  return (
    <div className="space-y-8 text-[#20261D]">
      {/* Header */}
      <div className="border-b border-[#E8E0D5] pb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-[#7D8D64] uppercase tracking-wider font-mono">
            <TrendingUp className="w-4 h-4" />
            <span>Rule 8 — Junior Level Progress Tracking</span>
          </div>
          <h2 className="text-2xl font-extrabold text-[#20261D] mt-1 font-display">
            Level Progress & Qualification Tracker
          </h2>
          <p className="text-xs text-[#646A5E] mt-1">
            Real-time milestone tracking for regional juniors from entry Extra level (₹1,000 @ 0.50%) up to Master L-12.
          </p>
        </div>

        {/* Salesman Switcher for testing */}
        <div className="flex items-center gap-2 text-xs font-mono">
          <span className="text-[#646A5E]">Inspecting Junior:</span>
          <select
            value={selectedSalesmanId}
            onChange={(e) => setSelectedSalesmanId(e.target.value)}
            disabled={isJunior} // Junior can only inspect themselves
            className="border border-[#E8E0D5] rounded-xl px-3 py-2 bg-white text-[#20261D] font-bold focus:ring-2 focus:ring-[#7D8D64]/30"
          >
            {salesmen.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name} ({s.assignedAreas.join(', ')})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Simulator Test Bar (Pre-filled with Rule 8 example: ₹700) */}
      <div className="p-4 rounded-2xl bg-white border border-[#E8E0D5] shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#EDF2E8] text-[#3C472C] flex items-center justify-center font-bold">
            ₹
          </div>
          <div>
            <h4 className="text-xs font-bold text-[#20261D]">
              Test Sales Simulator (Rule 8 Example Mode)
            </h4>
            <p className="text-[11px] text-[#646A5E]">
              Enter any sales volume to see instant level evaluation and progress percentage.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <input
            type="number"
            min={0}
            value={effectiveSales}
            onChange={(e) => setOverrideSales(Math.max(0, parseFloat(e.target.value) || 0))}
            placeholder="Enter sales amount"
            className="w-32 px-3 py-1.5 text-xs font-mono font-bold border border-[#E8E0D5] rounded-xl bg-[#FAF7F2]"
          />
          <button
            onClick={() => setOverrideSales(700)}
            className="px-2.5 py-1.5 rounded-lg bg-[#EDF2E8] text-[#3C472C] hover:bg-[#FAF7F2] font-mono text-[11px] font-bold border border-[#C8D4B8] transition"
          >
            Reset to ₹700 (Example)
          </button>
          <button
            onClick={() => setOverrideSales(null)}
            className="px-2.5 py-1.5 rounded-lg bg-[#F0F1EF] hover:bg-[#FAF7F2] text-[#20261D] font-mono text-[11px] border border-[#E8E0D5] transition"
          >
            Use Actual Sales (₹{actualSales})
          </button>
        </div>
      </div>

      {/* Primary Level Progress Metric Dashboard (Exact Rule 8 Layout) */}
      <div className="bg-gradient-to-br from-[#2A331E] via-[#222918] to-[#1A2113] text-white p-6 sm:p-8 rounded-3xl shadow-xl border border-[#3C472C] space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#3C472C] pb-5">
          <div className="flex items-center gap-3.5">
            <img
              src={activeSalesman.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=160&q=80'}
              alt={activeSalesman.name}
              className="w-14 h-14 rounded-2xl object-cover border-2 border-[#7D8D64]"
            />
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg text-white font-display">
                  {activeSalesman.name}
                </span>
                <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-full bg-[#3C472C] text-[#EDF2E8] border border-[#7D8D64]/50 font-bold">
                  {progressDetails.currentLevel.name} Status
                </span>
              </div>
              <p className="text-xs text-[#C8D4B8] mt-0.5">
                Route Jurisdiction: <span className="text-[#A3B489] font-mono">PIN {activeSalesman.assignedAreas.join(', ')}</span>
              </p>
            </div>
          </div>

          <div className="text-right">
            <span className="text-[11px] uppercase tracking-wider text-[#C8D4B8] font-mono block">
              Applicable Rate:
            </span>
            <span className="text-2xl font-black text-[#A3B489] font-display">
              {progressDetails.currentCommissionRate}%
            </span>
          </div>
        </div>

        {/* 6 Core Rule 8 Metrics Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 text-xs font-mono">
          <div className="p-3.5 bg-[#1C2214] rounded-2xl border border-[#3C472C] space-y-1">
            <span className="text-[10px] text-[#C8D4B8] uppercase tracking-wider block">Current Level</span>
            <p className="text-base font-black text-[#A3B489]">
              {progressDetails.currentLevel.name}
            </p>
          </div>

          <div className="p-3.5 bg-[#1C2214] rounded-2xl border border-[#3C472C] space-y-1">
            <span className="text-[10px] text-[#C8D4B8] uppercase tracking-wider block">Current Sales</span>
            <p className="text-base font-black text-white">
              ₹{effectiveSales.toLocaleString('en-IN')}
            </p>
          </div>

          <div className="p-3.5 bg-[#1C2214] rounded-2xl border border-[#3C472C] space-y-1">
            <span className="text-[10px] text-[#C8D4B8] uppercase tracking-wider block">Commission Rate</span>
            <p className="text-base font-black text-[#A3B489]">
              {progressDetails.currentCommissionRate}%
            </p>
          </div>

          <div className="p-3.5 bg-[#1C2214] rounded-2xl border border-[#3C472C] space-y-1">
            <span className="text-[10px] text-[#C8D4B8] uppercase tracking-wider block">Target Milestone</span>
            <p className="text-base font-black text-white">
              ₹{progressDetails.currentQualificationTarget.toLocaleString('en-IN')}
            </p>
          </div>

          <div className="p-3.5 bg-[#1C2214] rounded-2xl border border-[#3C472C] space-y-1">
            <span className="text-[10px] text-[#C8D4B8] uppercase tracking-wider block">Progress</span>
            <p className="text-base font-black text-[#A3B489]">
              {progressDetails.progressPercent}%
            </p>
          </div>

          <div className="p-3.5 bg-[#1C2214] rounded-2xl border border-[#3C472C] space-y-1">
            <span className="text-[10px] text-[#C8D4B8] uppercase tracking-wider block">Remaining</span>
            <p className="text-base font-black text-[#FAF7F2]">
              ₹{progressDetails.remainingAmount.toLocaleString('en-IN')}
            </p>
          </div>
        </div>

        {/* Visual Progress Bar */}
        <div className="space-y-2 pt-2">
          <div className="flex justify-between text-xs font-mono">
            <span className="text-[#E8E0D5]">
              Advancement to {progressDetails.nextLevel ? progressDetails.nextLevel.name : 'Master L-12'}:
            </span>
            <span className="font-bold text-[#A3B489]">
              {progressDetails.progressPercent}% achieved
            </span>
          </div>

          <div className="w-full bg-[#1C2214] rounded-full h-3 overflow-hidden p-0.5 border border-[#3C472C]">
            <div
              className="bg-gradient-to-r from-[#7D8D64] to-[#A3B489] h-full rounded-full transition-all duration-500"
              style={{ width: `${progressDetails.progressPercent}%` }}
            />
          </div>

          <div className="flex justify-between text-[11px] text-[#C8D4B8] font-mono pt-1">
            <span>Current: ₹{effectiveSales.toLocaleString('en-IN')}</span>
            <span>
              Target: ₹{progressDetails.currentQualificationTarget.toLocaleString('en-IN')} (₹{progressDetails.remainingAmount.toLocaleString('en-IN')} needed)
            </span>
          </div>
        </div>
      </div>

      {/* 13-Tier Visual Roadmap */}
      <div className="bg-white p-6 rounded-2xl border border-[#E8E0D5] shadow-2xs space-y-4">
        <div className="flex items-center justify-between border-b border-[#E8E0D5] pb-3">
          <div>
            <h3 className="text-sm font-bold text-[#20261D] font-display">
              13-Tier Career Qualification Ladder
            </h3>
            <p className="text-xs text-[#646A5E]">
              Every junior begins at Extra (₹1,000 @ 0.50%) and progresses up to L-12 as sales volume expands.
            </p>
          </div>
          <span className="text-xs font-mono font-bold text-[#3C472C] bg-[#EDF2E8] px-2.5 py-1 rounded-full border border-[#C8D4B8]">
            Current: {progressDetails.currentLevel.name}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 font-mono text-xs">
          {levels.map((lvl) => {
            const isCurrent = lvl.id === progressDetails.currentLevel.id;
            const isAchieved = effectiveSales >= lvl.qualificationAmount;

            return (
              <div
                key={lvl.id}
                className={`p-3.5 rounded-xl border transition-all ${
                  isCurrent
                    ? 'bg-[#EDF2E8] border-[#7D8D64] ring-2 ring-[#7D8D64]/30'
                    : isAchieved
                    ? 'bg-[#FAF7F2] border-[#E8E0D5] text-[#20261D]'
                    : 'bg-white border-[#E8E0D5] text-[#646A5E] opacity-75'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className={`font-black ${isCurrent ? 'text-[#2A331E]' : 'text-[#20261D]'}`}>
                    {lvl.name}
                  </span>
                  <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded ${
                    isCurrent
                      ? 'bg-[#7D8D64] text-white'
                      : isAchieved
                      ? 'bg-[#E8E0D5] text-[#20261D]'
                      : 'bg-[#F0F1EF] text-[#646A5E]'
                  }`}>
                    {lvl.rate}% Rate
                  </span>
                </div>

                <div className="text-[11px] space-y-0.5">
                  <div>Qual: <strong>₹{lvl.qualificationAmount.toLocaleString('en-IN')}</strong></div>
                  <div>Base Comm: <strong>₹{lvl.expectedCommission.toFixed(2)}</strong></div>
                </div>

                {isCurrent && (
                  <div className="mt-2 text-[10px] font-bold text-[#3C472C] flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#7D8D64]" />
                    <span>Active Assigned Tier</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
