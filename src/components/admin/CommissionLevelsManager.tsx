import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { CommissionLevel } from '../../types/index';
import { 
  TrendingUp, 
  ShieldCheck, 
  Lock, 
  Edit3, 
  Check, 
  X, 
  AlertTriangle,
  RotateCcw,
  Sparkles
} from 'lucide-react';
import { INITIAL_COMMISSION_LEVELS } from '../../data/initialCommissionLevels';

export const CommissionLevelsManager: React.FC = () => {
  const { levels, updateLevels } = useApp();
  const { isSuperAdmin, isJunior, activeRole } = useAuth();

  const [editingLevel, setEditingLevel] = useState<CommissionLevel | null>(null);
  const [editQual, setEditQual] = useState<number>(0);
  const [editRate, setEditRate] = useState<number>(0);

  const startEdit = (lvl: CommissionLevel) => {
    if (!isSuperAdmin) return;
    setEditingLevel(lvl);
    setEditQual(lvl.qualificationAmount);
    setEditRate(lvl.rate);
  };

  const cancelEdit = () => {
    setEditingLevel(null);
  };

  const saveEdit = () => {
    if (!isSuperAdmin || !editingLevel) return;
    const updated = levels.map((l) => {
      if (l.id === editingLevel.id) {
        const expected = Number(((editQual * editRate) / 100).toFixed(2));
        return {
          ...l,
          qualificationAmount: editQual,
          rate: editRate,
          expectedCommission: expected,
        };
      }
      return l;
    });
    updateLevels(updated);
    setEditingLevel(null);
  };

  const handleResetToExactDefaults = () => {
    if (!isSuperAdmin) return;
    if (window.confirm('Reset all 13 tiers to the exact default schedule (Extra through L-12)?')) {
      updateLevels(INITIAL_COMMISSION_LEVELS);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-slate-200 pb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-700 uppercase tracking-wider font-mono">
            <TrendingUp className="w-4 h-4" />
            <span>Rule 3 & 6 — Commission Level Table & Admin Controls</span>
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 mt-1 font-display">
            13-Tier Commission Schedule
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Exact qualification thresholds and percentage rates from Extra (₹1,000 @ 0.50%) through Master L-12.
          </p>
        </div>

        {/* Super Admin Actions */}
        <div className="flex items-center gap-2">
          {isSuperAdmin ? (
            <button
              onClick={handleResetToExactDefaults}
              className="px-3 py-1.5 rounded-xl border border-slate-200 text-slate-700 text-xs font-semibold hover:bg-slate-50 flex items-center gap-1.5 transition"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset to Exact Specification</span>
            </button>
          ) : (
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 border border-amber-200 text-amber-900 text-xs font-semibold rounded-xl">
              <Lock className="w-3.5 h-3.5 text-amber-600" />
              <span>Read-Only View (Junior Persona)</span>
            </div>
          )}
        </div>
      </div>

      {/* RBAC Notice */}
      <div className={`p-4 rounded-2xl border text-xs flex items-start gap-3 ${
        isSuperAdmin ? 'bg-emerald-50/70 border-emerald-200 text-emerald-900' : 'bg-slate-100 border-slate-200 text-slate-700'
      }`}>
        <ShieldCheck className={`w-4 h-4 mt-0.5 shrink-0 ${isSuperAdmin ? 'text-emerald-700' : 'text-slate-500'}`} />
        <div>
          <strong className="block font-bold">
            {isSuperAdmin
              ? 'Super Admin Authority Active: You are authorized to modify qualification amounts and rates.'
              : 'Junior Restriction Enforced: Only SUPER_ADMIN has authority to change tier qualifications or commission percentages.'}
          </strong>
          <span className="text-[11px] opacity-80">
            A junior receives strictly their applicable tier rate on all sales. The 4% pool ceiling is retained by the business.
          </span>
        </div>
      </div>

      {/* 13-Tier Table */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-slate-900 text-slate-200 uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3 px-4">Tier / Level</th>
                <th className="py-3 px-4">Qualification Amount</th>
                <th className="py-3 px-4">Commission Rate (%)</th>
                <th className="py-3 px-4">Commission on Qualification</th>
                <th className="py-3 px-4">Status & Permissions</th>
                {isSuperAdmin && <th className="py-3 px-4 text-right">Admin Action</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {levels.map((lvl) => {
                const isExtra = lvl.id === 'EXTRA';
                return (
                  <tr
                    key={lvl.id}
                    className={`hover:bg-slate-50/80 transition-colors ${
                      isExtra ? 'bg-amber-50/30' : ''
                    }`}
                  >
                    <td className="py-3.5 px-4 font-bold text-slate-900">
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-0.5 rounded font-black text-xs ${
                          isExtra ? 'bg-amber-100 text-amber-900 border border-amber-300' : 'bg-slate-100 text-slate-800'
                        }`}>
                          {lvl.name}
                        </span>
                        {isExtra && (
                          <span className="text-[10px] text-amber-800 font-sans font-semibold">
                            (Starting Level)
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="py-3.5 px-4 font-bold text-slate-800">
                      ₹{lvl.qualificationAmount.toLocaleString('en-IN')}
                    </td>

                    <td className="py-3.5 px-4 font-black text-emerald-700">
                      {lvl.rate}%
                    </td>

                    <td className="py-3.5 px-4 font-bold text-slate-900">
                      ₹{lvl.expectedCommission.toFixed(2)}
                    </td>

                    <td className="py-3.5 px-4 text-slate-500 font-sans text-[11px]">
                      {lvl.description || 'Standard volume milestone'}
                    </td>

                    {isSuperAdmin && (
                      <td className="py-3.5 px-4 text-right font-sans">
                        <button
                          onClick={() => startEdit(lvl)}
                          className="px-2.5 py-1 rounded-lg border border-slate-200 hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-300 text-xs font-semibold transition"
                        >
                          Edit Tier
                        </button>
                      </td>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Tier Modal (Super Admin only) */}
      {editingLevel && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-5 animate-in fade-in duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-base text-slate-900 font-display">
                Modify Tier: {editingLevel.name}
              </h3>
              <button onClick={cancelEdit} className="p-1 rounded text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs font-mono">
              <div>
                <label className="block text-slate-700 font-bold uppercase mb-1">
                  Qualification Amount (₹):
                </label>
                <input
                  type="number"
                  min={1}
                  value={editQual}
                  onChange={(e) => setEditQual(Math.max(1, parseFloat(e.target.value) || 0))}
                  className="w-full p-2.5 border border-slate-200 rounded-xl bg-slate-50 font-bold text-slate-900"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold uppercase mb-1">
                  Commission Rate (%):
                </label>
                <input
                  type="number"
                  min={0.01}
                  max={4.0}
                  step={0.01}
                  value={editRate}
                  onChange={(e) => setEditRate(Math.max(0.01, parseFloat(e.target.value) || 0))}
                  className="w-full p-2.5 border border-slate-200 rounded-xl bg-slate-50 font-bold text-slate-900"
                />
                <span className="text-[11px] text-slate-500 font-sans mt-1 block">
                  Must be ≤ 4.0% (Maximum Pool ceiling)
                </span>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                <span className="text-[11px] text-slate-500 font-sans">Projected Commission on Qualification:</span>
                <p className="text-base font-bold text-emerald-700">
                  ₹{Number(((editQual * editRate) / 100).toFixed(2))}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                onClick={cancelEdit}
                className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold hover:bg-slate-50 transition"
              >
                Cancel
              </button>
              <button
                onClick={saveEdit}
                className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition shadow-xs"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
