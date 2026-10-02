import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { 
  LayoutDashboard, 
  ShoppingBag, 
  UserCheck, 
  Users, 
  Receipt, 
  History, 
  Calculator, 
  TrendingUp, 
  FileText, 
  BarChart3, 
  Settings, 
  ShieldCheck, 
  ArrowLeft,
  ChevronRight,
  Target,
  Sparkles
} from 'lucide-react';
import { CommissionCalculatorView } from './CommissionCalculatorView';
import { CommissionLevelsManager } from './CommissionLevelsManager';
import { JuniorLevelProgressView } from './JuniorLevelProgressView';
import { SalesEntryView } from './SalesEntryView';
import { MasterSalesHistoryView } from './MasterSalesHistoryView';

export type AdminTab = 
  | 'dashboard' 
  | 'commission' 
  | 'progress'
  | 'levels' 
  | 'sales' 
  | 'history' 
  | 'leads' 
  | 'products' 
  | 'salesmen' 
  | 'notes' 
  | 'reports' 
  | 'settings';

export const AdminLayoutShell: React.FC = () => {
  const { setMode, leads, sales, products, salesmen, levels } = useApp();
  const { activeRole, setRole, currentUser, isSuperAdmin, isJunior } = useAuth();
  const [activeTab, setActiveTab] = useState<AdminTab>('commission');

  const menuItems: { id: AdminTab; label: string; icon: React.ReactNode; badge?: string; superAdminOnly?: boolean }[] = [
    { id: 'commission', label: 'Commission Calculator', icon: <Calculator className="w-4 h-4" /> },
    { id: 'progress', label: 'Level Progress Tracker', icon: <Target className="w-4 h-4" /> },
    { id: 'levels', label: '13-Tier Schedule (Extra-L12)', icon: <TrendingUp className="w-4 h-4" />, badge: `${levels.length}` },
    { id: 'sales', label: 'Record New Sale', icon: <Receipt className="w-4 h-4" /> },
    { id: 'history', label: 'Master Sales History', icon: <History className="w-4 h-4" />, badge: `${sales.length}` },
    { id: 'leads', label: 'Inquiry Leads', icon: <UserCheck className="w-4 h-4" />, badge: `${leads.length}` },
    { id: 'products', label: 'Product Catalog', icon: <ShoppingBag className="w-4 h-4" />, badge: `${products.length}` },
    { id: 'salesmen', label: 'Route Salesmen', icon: <Users className="w-4 h-4" />, badge: `${salesmen.length}`, superAdminOnly: true },
    { id: 'notes', label: 'Depot Bulletins', icon: <FileText className="w-4 h-4" /> },
    { id: 'reports', label: 'Volume Analytics', icon: <BarChart3 className="w-4 h-4" /> },
    { id: 'settings', label: 'Depot Settings', icon: <Settings className="w-4 h-4" />, superAdminOnly: true },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900">
      {/* Top Demo Bar: Role Switcher & Back to Showcase */}
      <div className="bg-slate-950 text-slate-200 px-4 py-2.5 text-xs flex flex-col sm:flex-row items-center justify-between gap-3 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMode('public')}
            className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors font-medium border border-slate-700"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Public Showcase</span>
          </button>
          <span className="text-slate-600 hidden sm:inline">|</span>
          <span className="text-slate-400 hidden sm:inline font-mono">
            GRAMINMART INTERNAL OPERATIONS PORTAL
          </span>
        </div>

        {/* Role Toggle Switcher */}
        <div className="flex items-center gap-2">
          <span className="text-slate-400 text-xs font-mono">SIMULATE PERSONA:</span>
          <div className="inline-flex p-0.5 rounded-lg bg-slate-900 border border-slate-800">
            <button
              onClick={() => setRole('SUPER_ADMIN')}
              className={`px-3 py-1 rounded-md text-xs font-semibold transition-all ${
                isSuperAdmin
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Super Admin
            </button>
            <button
              onClick={() => setRole('JUNIOR', 'sm-rahul')}
              className={`px-3 py-1 rounded-md text-xs font-semibold transition-all ${
                isJunior
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Junior (Rahul Kumar)
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <aside className="w-64 bg-white border-r border-slate-200/90 flex flex-col justify-between shrink-0">
          <div className="p-4 space-y-4">
            {/* Active User Card */}
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
              <div className="flex items-center gap-2.5">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-white text-xs shadow-xs ${
                  isSuperAdmin ? 'bg-emerald-700' : 'bg-amber-600'
                }`}>
                  {isSuperAdmin ? 'SA' : 'JK'}
                </div>
                <div className="min-w-0 flex-1">
                  <h4 className="text-xs font-bold text-slate-900 truncate">
                    {currentUser.name}
                  </h4>
                  <span className={`inline-flex items-center text-[10px] uppercase font-bold px-2 py-0.2 rounded-full ${
                    isSuperAdmin ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                  }`}>
                    {activeRole}
                  </span>
                </div>
              </div>

              {isJunior && (
                <div className="mt-2.5 text-[10px] text-slate-500 border-t border-slate-200/60 pt-2 flex items-center justify-between font-mono">
                  <span>PINs: <strong>732123, 732124</strong></span>
                  <span className="font-bold text-emerald-700">0.50% Extra</span>
                </div>
              )}
            </div>

            {/* Menu List */}
            <nav className="space-y-1">
              {menuItems.map((item) => {
                if (item.superAdminOnly && isJunior) return null;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all duration-150 ${
                      isActive
                        ? 'bg-emerald-50 text-emerald-800 font-bold border border-emerald-200/80 shadow-2xs'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50 border border-transparent'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className={isActive ? 'text-emerald-700' : 'text-slate-500'}>
                        {item.icon}
                      </span>
                      <span>{item.label}</span>
                    </div>
                    {item.badge && (
                      <span className={`text-[10px] px-2 py-0.2 rounded-full font-mono font-bold ${
                        isActive ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-600'
                      }`}>
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Security / RBAC Banner */}
          <div className="p-4 border-t border-slate-200/80 text-xs text-slate-500 space-y-1 bg-slate-50/50">
            <div className="flex items-center gap-1.5 text-emerald-800 font-bold text-xs">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>RBAC Policy Active</span>
            </div>
            <p className="text-[11px] leading-relaxed text-slate-400">
              {isSuperAdmin 
                ? 'Super Admin has master control over commission levels and sales records.' 
                : 'Junior account restricted to own leads, personal sales, and applicable level.'}
            </p>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-6 lg:p-8">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Tab Renderers */}
            {activeTab === 'commission' && <CommissionCalculatorView />}
            {activeTab === 'progress' && <JuniorLevelProgressView />}
            {activeTab === 'levels' && <CommissionLevelsManager />}
            {activeTab === 'sales' && <SalesEntryView />}
            {activeTab === 'history' && <MasterSalesHistoryView />}

            {/* Other informational tabs */}
            {activeTab === 'leads' && (
              <div className="space-y-4">
                <div className="border-b border-slate-200 pb-4">
                  <h2 className="text-2xl font-bold font-display">Inquiry Leads Desk</h2>
                  <p className="text-xs text-slate-500">Leads captured through "I'm Interested" showcase CTAs.</p>
                </div>
                <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-3">
                  <div className="divide-y divide-slate-100">
                    {leads.map((l) => (
                      <div key={l.id} className="py-3 flex items-center justify-between text-xs">
                        <div>
                          <strong className="block font-bold text-slate-900">{l.customerName}</strong>
                          <span className="text-slate-500">Product: {l.productName} • PIN: {l.areaPin || 'Unspecified'}</span>
                        </div>
                        <div className="text-right font-mono">
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800">
                            {l.status}
                          </span>
                          <span className="block text-[11px] text-slate-400 mt-0.5">Assigned: {l.assignedSalesmanName || 'Central Hub'}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'products' && (
              <div className="space-y-4">
                <div className="border-b border-slate-200 pb-4 flex justify-between items-center">
                  <div>
                    <h2 className="text-2xl font-bold font-display">Product Catalog Inventory</h2>
                    <p className="text-xs text-slate-500">Master price schedule for showcase items.</p>
                  </div>
                  <button
                    onClick={() => setMode('public')}
                    className="px-3.5 py-1.5 rounded-xl bg-emerald-600 text-white text-xs font-semibold"
                  >
                    View in Showcase
                  </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {products.map((p) => (
                    <div key={p.id} className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-2">
                      <span className="text-[10px] font-bold uppercase text-emerald-700">{p.brand}</span>
                      <h4 className="font-bold text-sm text-slate-900 truncate">{p.name}</h4>
                      <div className="flex justify-between text-xs font-mono pt-1">
                        <span>Wholesale: <strong>₹{p.price}</strong></span>
                        <span className="text-slate-400 line-through">MRP: ₹{p.mrp}</span>
                      </div>
                      <div className="text-[11px] text-slate-500">{p.packSize}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'salesmen' && isSuperAdmin && (
              <div className="space-y-4">
                <div className="border-b border-slate-200 pb-4">
                  <h2 className="text-2xl font-bold font-display">Route Representatives Management</h2>
                  <p className="text-xs text-slate-500">Jurisdiction PIN assignments and cumulative commission totals.</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {salesmen.map((s) => (
                    <div key={s.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
                      <div className="flex items-center gap-3">
                        <img src={s.avatar} alt={s.name} className="w-12 h-12 rounded-xl object-cover" />
                        <div>
                          <h4 className="font-bold text-sm text-slate-900">{s.name}</h4>
                          <span className="text-xs text-emerald-700 font-mono font-bold">Tier: {s.levelId}</span>
                        </div>
                      </div>
                      <div className="text-xs font-mono space-y-1 pt-1 border-t border-slate-100">
                        <div>Assigned PINs: <strong>{s.assignedAreas.join(', ')}</strong></div>
                        <div>Total Sales: <strong>₹{s.totalSalesAmount.toLocaleString('en-IN')}</strong></div>
                        <div>Commission Disbursed: <strong className="text-emerald-700">₹{s.totalCommissionEarned.toFixed(2)}</strong></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};
