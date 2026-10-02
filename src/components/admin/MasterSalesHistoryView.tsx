import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { Sale } from '../../types/index';
import { 
  History, 
  ShieldCheck, 
  Lock, 
  Edit3, 
  Search, 
  CheckCircle2, 
  XCircle, 
  AlertCircle,
  Filter,
  DollarSign
} from 'lucide-react';

export const MasterSalesHistoryView: React.FC = () => {
  const { sales, updateMasterSale, salesmen } = useApp();
  const { isSuperAdmin, isJunior, currentUser, activeRole } = useAuth();

  const [searchQuery, setSearchQuery] = useState('');
  const [editingSale, setEditingSale] = useState<Sale | null>(null);
  const [editStatus, setEditStatus] = useState<Sale['status']>('COMPLETED');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Enforce Rule 6: Junior can only view their own sales
  const visibleSales = useMemo(() => {
    let list = [...sales];

    if (isJunior) {
      list = list.filter((s) => s.salesmanId === currentUser.salesmanId);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(
        (s) =>
          s.id.toLowerCase().includes(q) ||
          s.productName.toLowerCase().includes(q) ||
          s.salesmanName.toLowerCase().includes(q) ||
          (s.customerName && s.customerName.toLowerCase().includes(q))
      );
    }

    return list;
  }, [sales, isJunior, currentUser.salesmanId, searchQuery]);

  const totalFilteredSales = visibleSales.reduce((acc, s) => acc + s.saleAmount, 0);
  const totalFilteredCommission = visibleSales.reduce((acc, s) => acc + s.calculatedCommission, 0);

  const startEdit = (sale: Sale) => {
    if (!isSuperAdmin) {
      setErrorMessage('Security Violation: Only SUPER_ADMIN has authority to alter Master Sales History.');
      return;
    }
    setEditingSale(sale);
    setEditStatus(sale.status);
    setErrorMessage(null);
  };

  const handleSaveEdit = () => {
    if (!editingSale || !isSuperAdmin) return;
    const updated: Sale = {
      ...editingSale,
      status: editStatus,
    };

    const res = updateMasterSale(updated, activeRole);
    if (!res.success) {
      setErrorMessage(res.error || 'Failed to update sale.');
    } else {
      setEditingSale(null);
      setErrorMessage(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-slate-200 pb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-700 uppercase tracking-wider font-mono">
            <History className="w-4 h-4" />
            <span>Rule 6 — Master Sales Ledger</span>
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 mt-1 font-display">
            {isSuperAdmin ? 'Master Sales History (All Juniors)' : `Personal Sales Records (${currentUser.name})`}
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            {isSuperAdmin
              ? 'Complete historical ledger of verified offline sales. Only Super Admin has authority to modify master records.'
              : 'Your verified offline sales transactions and earned level commissions. Master editing is restricted to Super Admin.'}
          </p>
        </div>

        {/* Security Badge */}
        <div className={`px-3.5 py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 ${
          isSuperAdmin ? 'bg-emerald-50 text-emerald-900 border-emerald-200' : 'bg-slate-100 text-slate-700 border-slate-200'
        }`}>
          {isSuperAdmin ? (
            <>
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Full Master Ledger Privileges</span>
            </>
          ) : (
            <>
              <Lock className="w-4 h-4 text-slate-500" />
              <span>Read-Only Personal View</span>
            </>
          )}
        </div>
      </div>

      {/* Summary KPI Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs font-mono">
          <span className="text-[11px] text-slate-500 uppercase font-semibold">Total Verified Volume</span>
          <p className="text-xl font-bold text-slate-900 mt-1">₹{totalFilteredSales.toLocaleString('en-IN')}</p>
          <span className="text-[10px] text-slate-400">{visibleSales.length} Transactions</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs font-mono">
          <span className="text-[11px] text-slate-500 uppercase font-semibold">Earned Junior Commission</span>
          <p className="text-xl font-bold text-emerald-700 mt-1">₹{totalFilteredCommission.toFixed(2)}</p>
          <span className="text-[10px] text-slate-400">Strict level tier rates</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs font-mono">
          <span className="text-[11px] text-slate-500 uppercase font-semibold">4% Max Pool Cap</span>
          <p className="text-xl font-bold text-slate-700 mt-1">₹{(totalFilteredSales * 0.04).toFixed(2)}</p>
          <span className="text-[10px] text-slate-400">Company pool ceiling</span>
        </div>
      </div>

      {/* Error alert if non-admin attempted modification */}
      {errorMessage && (
        <div className="p-3.5 bg-red-50 border border-red-200 text-red-900 text-xs rounded-xl flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
            <span>{errorMessage}</span>
          </div>
          <button onClick={() => setErrorMessage(null)} className="text-red-700 hover:text-red-900 font-bold">
            Dismiss
          </button>
        </div>
      )}

      {/* Search Input Bar */}
      <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-2xs flex items-center gap-2">
        <Search className="w-4 h-4 text-slate-400 ml-2" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Filter by Sale ID, Product, Junior name, Customer..."
          className="w-full text-xs py-1.5 focus:outline-hidden bg-transparent"
        />
        {searchQuery && (
          <button onClick={() => setSearchQuery('')} className="text-xs text-slate-400 hover:text-slate-600 mr-2">
            Clear
          </button>
        )}
      </div>

      {/* Sales Table */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-slate-900 text-slate-200 uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3 px-4">Sale ID & Date</th>
                <th className="py-3 px-4">Salesman</th>
                <th className="py-3 px-4">Product & Qty</th>
                <th className="py-3 px-4">Sale Amount</th>
                <th className="py-3 px-4">Level & Rate</th>
                <th className="py-3 px-4">Commission</th>
                <th className="py-3 px-4">Status</th>
                {isSuperAdmin && <th className="py-3 px-4 text-right">Master Action</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {visibleSales.length > 0 ? (
                visibleSales.map((sale) => (
                  <tr key={sale.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-4">
                      <span className="font-bold text-slate-900 block">{sale.id}</span>
                      <span className="text-[10px] text-slate-400">
                        {new Date(sale.createdAt).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </span>
                    </td>

                    <td className="py-3 px-4 font-bold text-slate-800 font-sans">
                      {sale.salesmanName}
                    </td>

                    <td className="py-3 px-4">
                      <span className="font-bold text-slate-900 font-sans block">{sale.productName}</span>
                      <span className="text-[11px] text-slate-500">
                        ₹{sale.productPrice} × {sale.quantity} units
                      </span>
                    </td>

                    <td className="py-3 px-4 font-black text-slate-900">
                      ₹{sale.saleAmount.toLocaleString('en-IN')}
                    </td>

                    <td className="py-3 px-4">
                      <span className="font-bold px-1.5 py-0.5 rounded bg-amber-100 text-amber-900 text-[10px]">
                        {sale.salesmanLevel}
                      </span>
                      <span className="text-emerald-700 ml-1.5 font-bold">
                        {sale.commissionRate}%
                      </span>
                    </td>

                    <td className="py-3 px-4 font-black text-emerald-700">
                      ₹{sale.calculatedCommission.toFixed(2)}
                    </td>

                    <td className="py-3 px-4 font-sans">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        sale.status === 'COMPLETED'
                          ? 'bg-emerald-100 text-emerald-800'
                          : sale.status === 'CANCELLED'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}>
                        {sale.status}
                      </span>
                    </td>

                    {isSuperAdmin && (
                      <td className="py-3 px-4 text-right font-sans">
                        <button
                          onClick={() => startEdit(sale)}
                          className="px-2.5 py-1 rounded-lg border border-slate-200 text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 text-xs font-semibold transition"
                        >
                          Modify
                        </button>
                      </td>
                    )}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={isSuperAdmin ? 8 : 7} className="py-8 text-center text-slate-400 font-sans">
                    No sales records found matching query.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Super Admin Edit Sale Modal */}
      {editingSale && isSuperAdmin && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4 animate-in fade-in duration-150">
            <h3 className="font-bold text-base text-slate-900 font-display">
              Modify Master Sale Record: {editingSale.id}
            </h3>

            <div className="p-3 bg-slate-50 rounded-xl text-xs space-y-1 font-mono">
              <div>Product: <strong>{editingSale.productName}</strong></div>
              <div>Salesman: <strong>{editingSale.salesmanName}</strong></div>
              <div>Amount: <strong>₹{editingSale.saleAmount}</strong></div>
              <div>Commission: <strong>₹{editingSale.calculatedCommission} ({editingSale.commissionRate}%)</strong></div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Transaction Status:
              </label>
              <select
                value={editStatus}
                onChange={(e: any) => setEditStatus(e.target.value)}
                className="w-full text-xs font-bold border border-slate-200 rounded-xl p-2.5 bg-slate-50 font-mono"
              >
                <option value="COMPLETED">COMPLETED (Commission Qualified)</option>
                <option value="PENDING">PENDING (Verification In Progress)</option>
                <option value="CANCELLED">CANCELLED (Zero Commission)</option>
              </select>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                onClick={() => setEditingSale(null)}
                className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveEdit}
                className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs"
              >
                Commit Master Update
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
