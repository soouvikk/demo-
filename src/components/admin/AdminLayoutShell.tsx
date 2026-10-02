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
  Sparkles,
  Menu,
  X
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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const menuItems: { id: AdminTab; label: string; shortLabel?: string; icon: React.ReactNode; badge?: string; superAdminOnly?: boolean }[] = [
    { id: 'commission', label: 'Commission Calculator', shortLabel: 'Calculator', icon: <Calculator className="w-4 h-4" /> },
    { id: 'progress', label: 'Level Progress Tracker', shortLabel: 'My Progress', icon: <Target className="w-4 h-4" /> },
    { id: 'levels', label: '13-Tier Schedule (Extra-L12)', shortLabel: '13 Tiers', icon: <TrendingUp className="w-4 h-4" />, badge: `${levels.length}` },
    { id: 'sales', label: 'Record New Sale', shortLabel: 'Offline Sale', icon: <Receipt className="w-4 h-4" /> },
    { id: 'history', label: 'Master Sales History', shortLabel: 'Ledger', icon: <History className="w-4 h-4" />, badge: `${sales.length}` },
    { id: 'leads', label: 'Inquiry Leads', shortLabel: 'Leads', icon: <UserCheck className="w-4 h-4" />, badge: `${leads.length}` },
    { id: 'products', label: 'Product Catalog', shortLabel: 'Products', icon: <ShoppingBag className="w-4 h-4" />, badge: `${products.length}` },
    { id: 'salesmen', label: 'Route Salesmen', shortLabel: 'Salesmen', icon: <Users className="w-4 h-4" />, badge: `${salesmen.length}`, superAdminOnly: true },
    { id: 'notes', label: 'Depot Bulletins', shortLabel: 'Bulletins', icon: <FileText className="w-4 h-4" /> },
    { id: 'reports', label: 'Volume Analytics', shortLabel: 'Reports', icon: <BarChart3 className="w-4 h-4" /> },
    { id: 'settings', label: 'Depot Settings', shortLabel: 'Settings', icon: <Settings className="w-4 h-4" />, superAdminOnly: true },
  ];

  const handleTabSelect = (tab: AdminTab) => {
    setActiveTab(tab);
    setMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] flex flex-col font-sans text-[#20261D]">
      {/* Top Demo Bar: Role Switcher & Back to Showcase */}
      <div className="bg-[#2A331E] text-[#FAF7F2] px-3 sm:px-4 py-2.5 text-xs flex flex-col sm:flex-row items-center justify-between gap-2.5 border-b border-[#3C472C]">
        <div className="flex items-center justify-between w-full sm:w-auto gap-2">
          <button
            onClick={() => setMode('public')}
            className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg bg-[#3C472C] hover:bg-[#4A5638] text-white transition-colors font-medium border border-[#7D8D64]/40 shrink-0 text-[11px] sm:text-xs"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Showcase</span>
          </button>
          
          <span className="text-[#A3B489] text-[11px] font-mono sm:hidden truncate font-semibold">
            {currentUser.name} ({activeRole === 'SUPER_ADMIN' ? 'Admin' : 'Junior'})
          </span>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-1.5 rounded-lg bg-[#3C472C] text-white border border-[#7D8D64]/40"
            aria-label="Toggle Desk Menu"
          >
            {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>

        {/* Role Toggle Switcher */}
        <div className="flex items-center justify-between w-full sm:w-auto gap-2">
          <span className="text-[#C8D4B8] text-[10px] sm:text-xs font-mono">SIMULATE:</span>
          <div className="inline-flex p-0.5 rounded-lg bg-[#1C2214] border border-[#3C472C]">
            <button
              onClick={() => setRole('SUPER_ADMIN')}
              className={`px-2.5 sm:px-3 py-1 rounded-md text-[11px] sm:text-xs font-semibold transition-all ${
                isSuperAdmin
                  ? 'bg-[#7D8D64] text-white shadow-xs'
                  : 'text-[#C8D4B8] hover:text-white'
              }`}
            >
              Super Admin
            </button>
            <button
              onClick={() => setRole('JUNIOR', 'sm-rahul')}
              className={`px-2.5 sm:px-3 py-1 rounded-md text-[11px] sm:text-xs font-semibold transition-all ${
                isJunior
                  ? 'bg-[#3C472C] text-[#EDF2E8] border border-[#7D8D64] shadow-xs'
                  : 'text-[#C8D4B8] hover:text-white'
              }`}
            >
              Junior (Rahul)
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Horizontal Fast-Scroll Tab Bar (Phone Viewport Optimized) */}
      <div className="lg:hidden bg-white border-b border-[#E8E0D5] px-3 py-2 overflow-x-auto no-scrollbar shadow-xs">
        <div className="flex items-center gap-1.5 whitespace-nowrap min-w-max">
          {menuItems.map((item) => {
            if (item.superAdminOnly && isJunior) return null;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleTabSelect(item.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
                  isActive
                    ? 'bg-[#EDF2E8] text-[#2A331E] font-bold border border-[#C8D4B8]'
                    : 'bg-[#FAF7F2] text-[#646A5E] hover:text-[#20261D] border border-transparent'
                }`}
              >
                <span className={isActive ? 'text-[#7D8D64]' : 'text-[#646A5E]'}>
                  {item.icon}
                </span>
                <span>{item.shortLabel || item.label}</span>
                {item.badge && (
                  <span className={`text-[9px] px-1.5 py-0.2 rounded-full font-mono font-bold ${
                    isActive ? 'bg-[#7D8D64] text-white' : 'bg-[#E8E0D5] text-[#3C472C]'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Mobile Full Slide-out Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-[#2A331E]/60 backdrop-blur-xs flex">
          <div className="w-72 max-w-[85vw] bg-white h-full flex flex-col justify-between p-4 shadow-2xl border-r border-[#E8E0D5] overflow-y-auto">
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#E8E0D5]">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-[#7D8D64] text-white flex items-center justify-center font-bold text-xs">
                    GM
                  </div>
                  <h3 className="font-bold text-sm text-[#20261D]">Operations Desk</h3>
                </div>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1 rounded-lg hover:bg-[#FAF7F2] text-[#646A5E]"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* User Identity */}
              <div className="p-3 rounded-xl bg-[#FAF7F2] border border-[#E8E0D5]">
                <div className="flex items-center gap-2">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-white text-xs ${
                    isSuperAdmin ? 'bg-[#7D8D64]' : 'bg-[#4A5638]'
                  }`}>
                    {isSuperAdmin ? 'SA' : 'JK'}
                  </div>
                  <div>
                    <div className="font-bold text-xs text-[#20261D]">{currentUser.name}</div>
                    <span className="text-[10px] font-mono uppercase bg-[#EDF2E8] text-[#3C472C] px-1.5 py-0.2 rounded font-semibold">
                      {activeRole}
                    </span>
                  </div>
                </div>
              </div>

              {/* Menu items */}
              <nav className="space-y-1">
                {menuItems.map((item) => {
                  if (item.superAdminOnly && isJunior) return null;
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleTabSelect(item.id)}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                        isActive
                          ? 'bg-[#EDF2E8] text-[#2A331E] font-bold border border-[#C8D4B8]'
                          : 'text-[#646A5E] hover:text-[#20261D] hover:bg-[#FAF7F2]'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <span className={isActive ? 'text-[#7D8D64]' : 'text-[#646A5E]'}>
                          {item.icon}
                        </span>
                        <span>{item.label}</span>
                      </div>
                      {item.badge && (
                        <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                          isActive ? 'bg-[#7D8D64] text-white font-bold' : 'bg-[#E8E0D5] text-[#3C472C]'
                        }`}>
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </nav>
            </div>

            <div className="pt-4 border-t border-[#E8E0D5] space-y-2">
              <button
                onClick={() => setMode('public')}
                className="w-full py-2 bg-[#2A331E] text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Return to Public Showcase</span>
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex-1 flex overflow-hidden">
        {/* Desktop Sidebar (hidden on phone, visible on lg screens) */}
        <aside className="hidden lg:flex w-64 bg-white border-r border-[#E8E0D5] flex-col justify-between shrink-0">
          <div className="p-4 space-y-4">
            {/* Active User Card */}
            <div className="p-3.5 rounded-xl bg-[#FAF7F2] border border-[#E8E0D5]">
              <div className="flex items-center gap-2.5">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-white text-xs shadow-xs ${
                  isSuperAdmin ? 'bg-[#7D8D64]' : 'bg-[#4A5638]'
                }`}>
                  {isSuperAdmin ? 'SA' : 'JK'}
                </div>
                <div className="min-w-0 flex-1">
                  <h4 className="text-xs font-bold text-[#20261D] truncate">
                    {currentUser.name}
                  </h4>
                  <span className={`inline-flex items-center text-[10px] uppercase font-bold px-2 py-0.2 rounded-full ${
                    isSuperAdmin ? 'bg-[#EDF2E8] text-[#3C472C]' : 'bg-[#F0F1EF] text-[#20261D]'
                  }`}>
                    {activeRole}
                  </span>
                </div>
              </div>

              {isJunior && (
                <div className="mt-2.5 text-[10px] text-[#646A5E] border-t border-[#E8E0D5] pt-2 flex items-center justify-between font-mono">
                  <span>PINs: <strong>732123, 732124</strong></span>
                  <span className="font-bold text-[#7D8D64]">0.50% Extra</span>
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
                        ? 'bg-[#EDF2E8] text-[#2A331E] font-bold border border-[#C8D4B8] shadow-2xs'
                        : 'text-[#646A5E] hover:text-[#20261D] hover:bg-[#F3EDE4] border border-transparent'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className={isActive ? 'text-[#7D8D64]' : 'text-[#646A5E]'}>
                        {item.icon}
                      </span>
                      <span>{item.label}</span>
                    </div>
                    {item.badge && (
                      <span className={`text-[10px] px-2 py-0.2 rounded-full font-mono font-bold ${
                        isActive ? 'bg-[#7D8D64] text-white' : 'bg-[#E8E0D5] text-[#3C472C]'
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
          <div className="p-4 border-t border-[#E8E0D5] text-xs text-[#646A5E] space-y-1 bg-[#FAF7F2]">
            <div className="flex items-center gap-1.5 text-[#3C472C] font-bold text-xs">
              <ShieldCheck className="w-3.5 h-3.5 text-[#7D8D64]" />
              <span>RBAC Policy Active</span>
            </div>
            <p className="text-[11px] leading-relaxed text-[#646A5E]">
              {isSuperAdmin 
                ? 'Super Admin has master control over commission levels and sales records.' 
                : 'Junior account restricted to own leads, personal sales, and applicable level.'}
            </p>
          </div>
        </aside>

        {/* Main Content Area (padding responsive on phone with pb-28 for bottom bar) */}
        <main className="flex-1 overflow-y-auto p-3.5 sm:p-6 lg:p-8 pb-32 lg:pb-12">
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
                    className="px-3.5 py-1.5 rounded-xl bg-[#7D8D64] hover:bg-[#6E7D56] text-white text-xs font-semibold shadow-xs"
                  >
                    View in Showcase
                  </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {products.map((p) => (
                    <div key={p.id} className="bg-white p-4 rounded-2xl border border-[#E8E0D5] shadow-2xs space-y-2">
                      <span className="text-[10px] font-bold uppercase text-[#7D8D64]">{p.brand}</span>
                      <h4 className="font-bold text-sm text-[#20261D] truncate">{p.name}</h4>
                      <div className="flex justify-between text-xs font-mono pt-1">
                        <span>Wholesale: <strong>₹{p.price}</strong></span>
                        <span className="text-[#646A5E] line-through">MRP: ₹{p.mrp}</span>
                      </div>
                      <div className="text-[11px] text-[#646A5E]">{p.packSize}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'salesmen' && isSuperAdmin && (
              <div className="space-y-4">
                <div className="border-b border-[#E8E0D5] pb-4">
                  <h2 className="text-2xl font-bold font-display text-[#20261D]">Route Representatives Management</h2>
                  <p className="text-xs text-[#646A5E]">Jurisdiction PIN assignments and cumulative commission totals.</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {salesmen.map((s) => (
                    <div key={s.id} className="bg-white p-5 rounded-2xl border border-[#E8E0D5] shadow-2xs space-y-3">
                      <div className="flex items-center gap-3">
                        <img src={s.avatar} alt={s.name} className="w-12 h-12 rounded-xl object-cover" />
                        <div>
                          <h4 className="font-bold text-sm text-[#20261D]">{s.name}</h4>
                          <span className="text-xs text-[#7D8D64] font-mono font-bold">Tier: {s.levelId}</span>
                        </div>
                      </div>
                      <div className="text-xs font-mono space-y-1 pt-1 border-t border-[#E8E0D5]">
                        <div>Assigned PINs: <strong>{s.assignedAreas.join(', ')}</strong></div>
                        <div>Total Sales: <strong>₹{s.totalSalesAmount.toLocaleString('en-IN')}</strong></div>
                        <div>Commission Disbursed: <strong className="text-[#7D8D64]">₹{s.totalCommissionEarned.toFixed(2)}</strong></div>
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
