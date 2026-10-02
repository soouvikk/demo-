import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { Sale } from '../../types/index';
import { 
  History, 
  Search, 
  Filter, 
  ShieldCheck, 
  AlertCircle, 
  CheckCircle2, 
  Clock, 
  FileSpreadsheet, 
  Lock,
  Edit2,
  Percent,
  Receipt
} from 'lucide-react';

export const MasterSalesHistoryView: React.FC = () => {
  const { sales, updateMasterSale, salesmen } = useApp();
  const { isSuperAdmin, isJunior, currentUser } = useAuth();

  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [editingSale, setEditingSale] = useState<Sale | null>(null);
  const [editStatus, setEditStatus] = useState<Sale['status']>('COMPLETED');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // RBAC Enforcement per Rule 6:
  // If JUNIOR, filter records strictly to their own transactions
  const visibleSales = useMemo(() => {
    let list = [...sales];

    if (isJunior) {
      const juniorId = currentUser.salesmanId || 'sm-rahul';
      list = list.filter((s) => s.salesmanId === juniorId);
    }

    if (filterStatus !== 'ALL') {
      list = list.filter((s) => s.status === filterStatus);
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

    // Sort by latest first
    return list.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [sales, isJunior, currentUser.salesmanId, filterStatus, searchQuery]);

  const totalFilteredSales = useMemo(() => {
    return visibleSales.reduce((acc, s) => acc + s.saleAmount, 0);
  }, [visibleSales]);

  const totalFilteredCommission = useMemo(() => {
    return visibleSales.reduce((acc, s) => acc + s.calculatedCommission, 0);
  }, [visibleSales]);

  const startEdit = (sale: Sale) => {
    if (!isSuperAdmin) {
      setErrorMessage('Security Alert: Only SUPER_ADMIN is authorized to modify master ledger transactions.');
      setTimeout(() => setErrorMessage(null), 4000);
      return;
    }
    setEditingSale(sale);
    setEditStatus(sale.status);
  };

  const handleSaveEdit = () => {
    if (!editingSale) return;

    const res = updateMasterSale(
      {
        ...editingSale,
        status: editStatus,
      },
      currentUser.role
    );

    if (res.success) {
      setEditingSale(null);
    } else {
      setErrorMessage(res.error || 'Failed to update transaction.');
    }
  };

  return (
    <div className="space-y-6 text-[#20261D]">
      {/* Header */}
      <div className="border-b border-[#E8E0D5] pb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-[#7D8D64] uppercase tracking-wider font-mono">
            <History className="w-4 h-4" />
            <span>Rule 6 — Verified Master Ledger</span>
          </div>
          <h2 className="text-2xl font-extrabold text-[#20261D] mt-1 font-display">
            Master Sales History & Ledgers
          </h2>
          <p className="text-xs text-[#646A5E] mt-1">
            Complete transaction ledger. Super Admin has unrestricted authority to audit and modify; junior view is restricted to personal records.
          </p>
        </div>

        {/* Status Indicator */}
        <div className="flex items-center gap-2">
          {isSuperAdmin ? (
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-mono font-bold bg-[#EDF2E8] text-[#2A331E] border border-[#C8D4B8]">
              <ShieldCheck className="w-3.5 h-3.5 text-[#7D8D64]" />
              Super Admin: Full Master Access
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-mono font-bold bg-[#FAF7F2] text-[#20261D] border border-[#E8E0D5]">
              <Lock className="w-3.5 h-3.5 text-[#646A5E]" />
              Junior Restricted View (Personal Records Only)
            </span>
          )}
        </div>
      </div>

      {/* Summary KPI Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
        <div className="bg-white p-4 rounded-2xl border border-[#E8E0D5] shadow-2xs font-mono">
          <span className="text-[11px] text-[#646A5E] uppercase font-semibold">Total Verified Volume</span>
          <p className="text-xl font-bold text-[#20261D] mt-1">₹{totalFilteredSales.toLocaleString('en-IN')}</p>
          <span className="text-[10px] text-[#646A5E]">{visibleSales.length} Transactions</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-[#E8E0D5] shadow-2xs font-mono">
          <span className="text-[11px] text-[#646A5E] uppercase font-semibold">Earned Junior Commission</span>
          <p className="text-xl font-bold text-[#7D8D64] mt-1">₹{totalFilteredCommission.toFixed(2)}</p>
          <span className="text-[10px] text-[#646A5E]">Strict level tier rates</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-[#E8E0D5] shadow-2xs font-mono">
          <span className="text-[11px] text-[#646A5E] uppercase font-semibold">4% Max Pool Cap</span>
          <p className="text-xl font-bold text-[#20261D] mt-1">₹{(totalFilteredSales * 0.04).toFixed(2)}</p>
          <span className="text-[10px] text-[#646A5E]">Company pool ceiling</span>
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
      <div className="bg-white p-3 rounded-2xl border border-[#E8E0D5] shadow-2xs flex items-center gap-2">
        <Search className="w-4 h-4 text-[#7D8D64] ml-2 shrink-0" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Filter by Sale ID, Product, Junior name, Customer..."
          className="w-full text-xs py-1.5 focus:outline-hidden bg-transparent text-[#20261D]"
        />
        {searchQuery && (
          <button onClick={() => setSearchQuery('')} className="text-xs text-[#646A5E] hover:text-[#20261D] mr-2">
            Clear
          </button>
        )}
      </div>

      {/* Mobile Card List (Thumb-Friendly on Phones) */}
      <div className="md:hidden space-y-3">
        {visibleSales.length > 0 ? (
          visibleSales.map((sale) => (
            <div 
              key={sale.id}
              className="bg-white p-4 rounded-2xl border border-[#E8E0D5] shadow-2xs space-y-3 font-mono text-xs"
            >
              <div className="flex items-center justify-between border-b border-[#E8E0D5] pb-2">
                <div>
                  <span className="font-bold text-[#20261D] block">{sale.id}</span>
                  <span className="text-[10px] text-[#646A5E]">{sale.date}</span>
                </div>
                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${
                  sale.status === 'COMPLETED'
                    ? 'bg-[#EDF2E8] text-[#2A331E] border border-[#C8D4B8]'
                    : sale.status === 'CANCELLED'
                    ? 'bg-red-50 text-red-800 border border-red-200'
                    : 'bg-amber-50 text-amber-800 border border-amber-200'
                }`}>
                  {sale.status}
                </span>
              </div>

              <div>
                <span className="text-[10px] uppercase font-bold text-[#7D8D64] block">Product & Volume:</span>
                <p className="font-sans font-bold text-sm text-[#20261D]">{sale.productName}</p>
                <span className="text-[11px] text-[#646A5E]">{sale.quantity} units @ ₹{sale.productPrice}/unit</span>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-1 border-t border-[#E8E0D5] text-[11px]">
                <div>
                  <span className="text-[#646A5E] block">Salesman:</span>
                  <strong className="text-[#20261D]">{sale.salesmanName}</strong>
                </div>
                <div>
                  <span className="text-[#646A5E] block">Level & Rate:</span>
                  <span className="font-bold text-[#7D8D64]">{sale.salesmanLevel || 'Extra'} ({sale.applicableJuniorRate || sale.commissionRate || 0.5}%)</span>
                </div>
              </div>

              <div className="p-3 bg-[#FAF7F2] rounded-xl border border-[#E8E0D5] flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase text-[#646A5E] block">Sale Total:</span>
                  <span className="font-bold text-sm text-[#20261D]">₹{sale.saleAmount.toLocaleString('en-IN')}</span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] uppercase text-[#7D8D64] font-bold block">Commission:</span>
                  <span className="font-black text-base text-[#7D8D64]">₹{sale.calculatedCommission.toFixed(2)}</span>
                </div>
              </div>

              {isSuperAdmin && (
                <div className="pt-1 flex justify-end">
                  <button
                    onClick={() => startEdit(sale)}
                    className="px-3 py-1.5 rounded-lg border border-[#E8E0D5] text-[#20261D] hover:bg-[#EDF2E8] hover:text-[#2A331E] hover:border-[#7D8D64] text-xs font-semibold transition"
                  >
                    Modify Record
                  </button>
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="p-8 text-center text-[#646A5E] bg-white rounded-2xl border border-[#E8E0D5]">
            No sales records found matching query.
          </div>
        )}
      </div>

      {/* Desktop Sales Table (Hidden on Mobile) */}
      <div className="hidden md:block bg-white rounded-2xl border border-[#E8E0D5] shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-[#2A331E] text-[#FAF7F2] uppercase tracking-wider text-[11px]">
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
            <tbody className="divide-y divide-[#E8E0D5]">
              {visibleSales.length > 0 ? (
                visibleSales.map((sale) => (
                  <tr key={sale.id} className="hover:bg-[#FAF7F2] transition-colors">
                    <td className="py-3 px-4 font-bold text-[#20261D]">
                      <div>{sale.id}</div>
                      <span className="text-[10px] text-[#646A5E] font-normal">{sale.date}</span>
                    </td>

                    <td className="py-3 px-4">
                      <div className="font-bold text-[#20261D]">{sale.salesmanName}</div>
                      <span className="text-[10px] text-[#646A5E]">ID: {sale.salesmanId}</span>
                    </td>

                    <td className="py-3 px-4">
                      <div className="font-bold text-[#20261D]">{sale.productName}</div>
                      <span className="text-[10px] text-[#646A5E]">Qty: {sale.quantity} units @ ₹{sale.productPrice}</span>
                    </td>

                    <td className="py-3 px-4 font-bold text-[#20261D]">
                      ₹{sale.saleAmount.toLocaleString('en-IN')}
                    </td>

                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded font-black text-xs bg-[#EDF2E8] text-[#2A331E] border border-[#C8D4B8]">
                        {sale.salesmanLevel || 'Extra'}
                      </span>
                      <span className="block text-[10px] text-[#7D8D64] mt-0.5 font-bold">
                        {sale.applicableJuniorRate || sale.commissionRate || 0.5}% Rate
                      </span>
                    </td>

                    <td className="py-3 px-4 font-black text-[#7D8D64]">
                      ₹{sale.calculatedCommission.toFixed(2)}
                    </td>

                    <td className="py-3 px-4 font-sans">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        sale.status === 'COMPLETED'
                          ? 'bg-[#EDF2E8] text-[#2A331E] border border-[#C8D4B8]'
                          : sale.status === 'CANCELLED'
                          ? 'bg-red-50 text-red-800'
                          : 'bg-amber-50 text-amber-800'
                      }`}>
                        {sale.status}
                      </span>
                    </td>

                    {isSuperAdmin && (
                      <td className="py-3 px-4 text-right font-sans">
                        <button
                          onClick={() => startEdit(sale)}
                          className="px-2.5 py-1 rounded-lg border border-[#E8E0D5] text-[#20261D] hover:bg-[#EDF2E8] hover:text-[#2A331E] hover:border-[#7D8D64] text-xs font-semibold transition"
                        >
                          Modify
                        </button>
                      </td>
                    )}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={isSuperAdmin ? 8 : 7} className="py-8 text-center text-[#646A5E] font-sans">
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
        <div className="fixed inset-0 z-50 bg-[#2A331E]/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="bg-white rounded-t-3xl sm:rounded-2xl max-w-md w-full p-6 shadow-2xl border border-[#E8E0D5] space-y-4 animate-in fade-in duration-150">
            <h3 className="font-bold text-base text-[#20261D] font-display">
              Modify Master Sale Record: {editingSale.id}
            </h3>

            <div className="p-3 bg-[#FAF7F2] rounded-xl text-xs space-y-1 font-mono border border-[#E8E0D5]">
              <div>Product: <strong>{editingSale.productName}</strong></div>
              <div>Salesman: <strong>{editingSale.salesmanName}</strong></div>
              <div>Amount: <strong>₹{editingSale.saleAmount}</strong></div>
              <div>Commission: <strong>₹{editingSale.calculatedCommission} ({editingSale.commissionRate || editingSale.applicableJuniorRate}%)</strong></div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#20261D] uppercase mb-1">
                Transaction Status:
              </label>
              <select
                value={editStatus}
                onChange={(e: any) => setEditStatus(e.target.value)}
                className="w-full text-xs font-bold border border-[#E8E0D5] rounded-xl p-2.5 bg-[#FAF7F2] font-mono focus:ring-2 focus:ring-[#7D8D64]/30"
              >
                <option value="COMPLETED">COMPLETED (Commission Qualified)</option>
                <option value="PENDING">PENDING (Verification In Progress)</option>
                <option value="CANCELLED">CANCELLED (Zero Commission)</option>
              </select>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#E8E0D5]">
              <button
                onClick={() => setEditingSale(null)}
                className="px-4 py-2 rounded-xl border border-[#E8E0D5] text-xs font-semibold hover:bg-[#FAF7F2]"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveEdit}
                className="px-5 py-2 rounded-xl bg-[#7D8D64] hover:bg-[#6E7D56] text-white text-xs font-bold shadow-xs"
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
