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
    <div className="space-y-8">
      {/* Header */}
      <div className="border-b border-slate-200 pb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-700 uppercase tracking-wider font-mono">
            <TrendingUp className="w-4 h-4" />
            <span>Rule 8 — Junior Level Progress Tracking</span>
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 mt-1 font-display">
            Level Progress & Qualification Tracker
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Real-time milestone tracking for regional juniors from entry Extra level (₹1,000 @ 0.50%) up to Master L-12.
          </p>
        </div>

        {/* Salesman Switcher for testing */}
        <div className="flex items-center gap-2 text-xs font-mono">
          <span className="text-slate-500">Inspecting Junior:</span>
          <select
            value={selectedSalesmanId}
            onChange={(e) => setSelectedSalesmanId(e.target.value)}
            disabled={isJunior} // Junior can only inspect themselves
            className="border border-slate-200 rounded-xl px-3 py-2 bg-white text-slate-800 font-bold focus:ring-2 focus:ring-emerald-500/20"
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
      <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
            ₹
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-900">
              Test Sales Simulator (Rule 8 Example Mode)
            </h4>
            <p className="text-[11px] text-slate-500">
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
            className="w-32 px-3 py-1.5 text-xs font-mono font-bold border border-slate-200 rounded-xl bg-slate-50"
          />
          <button
            onClick={() => setOverrideSales(700)}
            className="px-2.5 py-1.5 rounded-lg bg-emerald-50 text-emerald-800 hover:bg-emerald-100 font-mono text-[11px] font-bold border border-emerald-200 transition"
          >
            Reset to ₹700 (Example)
          </button>
          <button
            onClick={() => setOverrideSales(null)}
            className="px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-mono text-[11px] transition"
          >
            Use Actual Sales (₹{actualSales})
          </button>
        </div>
      </div>

      {/* Primary Level Progress Metric Dashboard (Exact Rule 8 Layout) */}
      <div className="bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950 text-white p-6 sm:p-8 rounded-3xl shadow-xl border border-slate-800 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
          <div className="flex items-center gap-3.5">
            <img
              src={activeSalesman.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=160&q=80'}
              alt={activeSalesman.name}
              className="w-14 h-14 rounded-2xl object-cover border-2 border-emerald-400"
            />
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg text-white font-display">
                  {activeSalesman.name}
                </span>
                <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800 font-bold">
                  {progressDetails.currentLevel.name} Status
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Route Jurisdiction: <span className="text-emerald-300 font-mono">PIN {activeSalesman.assignedAreas.join(', ')}</span>
              </p>
            </div>
          </div>

          <div className="text-right">
            <span className="text-[11px] uppercase tracking-wider text-slate-400 font-mono block">
              Applicable Rate:
            </span>
            <span className="text-2xl font-black text-emerald-400 font-display">
              {progressDetails.currentCommissionRate}%
            </span>
          </div>
        </div>

        {/* 6 Core Rule 8 Metrics Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 text-xs font-mono">
          <div className="p-3.5 bg-slate-900/90 rounded-2xl border border-slate-800 space-y-1">
            <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Current Level</span>
            <p className="text-base font-black text-amber-400">
              {progressDetails.currentLevel.name}
            </p>
          </div>

          <div className="p-3.5 bg-slate-900/90 rounded-2xl border border-slate-800 space-y-1">
            <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Current Sales</span>
            <p className="text-base font-black text-white">
              ₹{effectiveSales.toLocaleString('en-IN')}
            </p>
          </div>

          <div className="p-3.5 bg-slate-900/90 rounded-2xl border border-slate-800 space-y-1">
            <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Commission Rate</span>
            <p className="text-base font-black text-emerald-400">
              {progressDetails.currentCommissionRate}%
            </p>
          </div>

          <div className="p-3.5 bg-slate-900/90 rounded-2xl border border-slate-800 space-y-1">
            <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Target Milestone</span>
            <p className="text-base font-black text-white">
              ₹{progressDetails.currentQualificationTarget.toLocaleString('en-IN')}
            </p>
          </div>

          <div className="p-3.5 bg-slate-900/90 rounded-2xl border border-slate-800 space-y-1">
            <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Progress</span>
            <p className="text-base font-black text-emerald-400">
              {progressDetails.progressPercent}%
            </p>
          </div>

          <div className="p-3.5 bg-slate-900/90 rounded-2xl border border-slate-800 space-y-1">
            <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Remaining</span>
            <p className="text-base font-black text-amber-400">
              ₹{progressDetails.remainingAmount.toLocaleString('en-IN')}
            </p>
          </div>
        </div>

        {/* Visual Progress Bar */}
        <div className="space-y-2 pt-2">
          <div className="flex justify-between text-xs font-mono">
            <span className="text-slate-300">
              Advancement to {progressDetails.nextLevel ? progressDetails.nextLevel.name : 'Master L-12'}:
            </span>
            <span className="font-bold text-emerald-400">
              {progressDetails.progressPercent}% achieved
            </span>
          </div>

          <div className="w-full bg-slate-800 rounded-full h-3 overflow-hidden p-0.5 border border-slate-700">
            <div
              className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full rounded-full transition-all duration-500"
              style={{ width: `${progressDetails.progressPercent}%` }}
            />
          </div>

          <div className="flex justify-between text-[11px] text-slate-400 font-mono pt-1">
            <span>Current: ₹{effectiveSales.toLocaleString('en-IN')}</span>
            <span>
              Target: ₹{progressDetails.currentQualificationTarget.toLocaleString('en-IN')} (₹{progressDetails.remainingAmount.toLocaleString('en-IN')} needed)
            </span>
          </div>
        </div>
      </div>

      {/* 13-Tier Visual Roadmap */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-2xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h3 className="text-sm font-bold text-slate-900 font-display">
              13-Tier Career Qualification Ladder
            </h3>
            <p className="text-xs text-slate-500">
              Every junior begins at Extra (₹1,000 @ 0.50%) and progresses up to L-12 as sales volume expands.
            </p>
          </div>
          <span className="text-xs font-mono font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
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
                    ? 'bg-emerald-50 border-emerald-400 ring-2 ring-emerald-500/20'
                    : isAchieved
                    ? 'bg-slate-50 border-slate-300 text-slate-800'
                    : 'bg-white border-slate-200 text-slate-400 opacity-75'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className={`font-black ${isCurrent ? 'text-emerald-800' : 'text-slate-800'}`}>
                    {lvl.name}
                  </span>
                  <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded ${
                    isCurrent
                      ? 'bg-emerald-600 text-white'
                      : isAchieved
                      ? 'bg-slate-200 text-slate-700'
                      : 'bg-slate-100 text-slate-400'
                  }`}>
                    {lvl.rate}% Rate
                  </span>
                </div>

                <div className="text-[11px] space-y-0.5">
                  <div>Qual: <strong>₹{lvl.qualificationAmount.toLocaleString('en-IN')}</strong></div>
                  <div>Base Comm: <strong>₹{lvl.expectedCommission.toFixed(2)}</strong></div>
                </div>

                {isCurrent && (
                  <div className="mt-2 text-[10px] font-bold text-emerald-700 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
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
