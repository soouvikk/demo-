import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Product,
  Salesman,
  Lead,
  Sale,
  CommissionLevel,
  BusinessNote,
  BusinessConfig,
} from '../types/index';
import { StorageService } from '../services/storageService';

export type PublicPage = 'home' | 'products' | 'offers' | 'notes' | 'contact';
export type AppMode = 'public' | 'admin';

interface AppContextType {
  mode: AppMode;
  setMode: (mode: AppMode) => void;
  activePublicPage: PublicPage;
  setActivePublicPage: (page: PublicPage) => void;
  
  // Data entities
  products: Product[];
  salesmen: Salesman[];
  leads: Lead[];
  sales: Sale[];
  levels: CommissionLevel[];
  notes: BusinessNote[];
  config: BusinessConfig;

  // Actions
  addProduct: (product: Product) => void;
  updateProduct: (product: Product) => void;
  deleteProduct: (id: string) => void;
  
  createLead: (lead: Omit<Lead, 'id' | 'createdAt'>) => Lead;
  updateLeadStatus: (leadId: string, status: Lead['status'], notes?: string) => void;
  
  addSale: (sale: Omit<Sale, 'id' | 'createdAt'>) => Sale;
  updateMasterSale: (sale: Sale, actorRole: string) => { success: boolean; error?: string };

  addSalesman: (salesman: Salesman) => void;
  updateSalesman: (salesman: Salesman) => void;

  updateLevels: (levels: CommissionLevel[]) => void;
  addNote: (note: BusinessNote) => void;
  deleteNote: (id: string) => void;
  updateConfig: (config: BusinessConfig) => void;
  resetAllData: () => void;

  // Lead interest modal triggers
  selectedProductForInterest: Product | null;
  openInterestModal: (product: Product) => void;
  closeInterestModal: () => void;

  // Product detail modal
  selectedProductForDetail: Product | null;
  openDetailModal: (product: Product) => void;
  closeDetailModal: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [mode, setMode] = useState<AppMode>('public');
  const [activePublicPage, setActivePublicPage] = useState<PublicPage>('home');

  const [products, setProducts] = useState<Product[]>(() => StorageService.getProducts());
  const [salesmen, setSalesmen] = useState<Salesman[]>(() => StorageService.getSalesmen());
  const [leads, setLeads] = useState<Lead[]>(() => StorageService.getLeads());
  const [sales, setSales] = useState<Sale[]>(() => StorageService.getSales());
  const [levels, setLevels] = useState<CommissionLevel[]>(() => StorageService.getCommissionLevels());
  const [notes, setNotes] = useState<BusinessNote[]>(() => StorageService.getNotes());
  const [config, setConfig] = useState<BusinessConfig>(() => StorageService.getConfig());

  const [selectedProductForInterest, setSelectedProductForInterest] = useState<Product | null>(null);
  const [selectedProductForDetail, setSelectedProductForDetail] = useState<Product | null>(null);

  // Load data on mount
  useEffect(() => {
    refreshData();
  }, []);

  const refreshData = () => {
    setProducts(StorageService.getProducts());
    setSalesmen(StorageService.getSalesmen());
    setLeads(StorageService.getLeads());
    setSales(StorageService.getSales());
    setLevels(StorageService.getCommissionLevels());
    setNotes(StorageService.getNotes());
    setConfig(StorageService.getConfig());
  };

  const addProduct = (product: Product) => {
    const updated = StorageService.saveProduct(product);
    setProducts(updated);
  };

  const updateProduct = (product: Product) => {
    const updated = StorageService.saveProduct(product);
    setProducts(updated);
  };

  const deleteProduct = (id: string) => {
    const updated = StorageService.deleteProduct(id);
    setProducts(updated);
  };

  const createLead = (leadData: Omit<Lead, 'id' | 'createdAt'>): Lead => {
    const newLead: Lead = {
      ...leadData,
      id: `lead-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      createdAt: new Date().toISOString(),
    };
    const updated = StorageService.saveLead(newLead);
    setLeads(updated);
    return newLead;
  };

  const updateLeadStatus = (leadId: string, status: Lead['status'], notes?: string) => {
    const target = leads.find((l) => l.id === leadId);
    if (!target) return;
    const updatedLead: Lead = {
      ...target,
      status,
      notes: notes !== undefined ? notes : target.notes,
      updatedAt: new Date().toISOString(),
    };
    const updated = StorageService.saveLead(updatedLead);
    setLeads(updated);
  };

  const addSale = (saleData: Omit<Sale, 'id' | 'createdAt'>): Sale => {
    const newSale: Sale = {
      ...saleData,
      id: `SALE-${Date.now().toString().slice(-4)}`,
      createdAt: new Date().toISOString(),
    };
    const updated = StorageService.recordSale(newSale);
    setSales(updated);
    // Refresh salesmen to catch updated totals
    setSalesmen(StorageService.getSalesmen());
    return newSale;
  };

  const updateMasterSale = (sale: Sale, actorRole: string): { success: boolean; error?: string } => {
    const result = StorageService.updateMasterSale(sale, actorRole);
    if (result.success) {
      setSales(result.sales);
      setSalesmen(StorageService.getSalesmen());
    }
    return { success: result.success, error: result.error };
  };

  const addSalesman = (salesman: Salesman) => {
    const updated = StorageService.saveSalesman(salesman);
    setSalesmen(updated);
  };

  const updateSalesman = (salesman: Salesman) => {
    const updated = StorageService.saveSalesman(salesman);
    setSalesmen(updated);
  };

  const updateLevels = (newLevels: CommissionLevel[]) => {
    const updated = StorageService.saveCommissionLevels(newLevels);
    setLevels(updated);
  };

  const addNote = (note: BusinessNote) => {
    const updated = StorageService.saveNote(note);
    setNotes(updated);
  };

  const deleteNote = (id: string) => {
    const updated = StorageService.deleteNote(id);
    setNotes(updated);
  };

  const updateConfig = (newConfig: BusinessConfig) => {
    const updated = StorageService.saveConfig(newConfig);
    setConfig(updated);
  };

  const resetAllData = () => {
    StorageService.resetAll();
    refreshData();
  };

  const openInterestModal = (product: Product) => {
    setSelectedProductForInterest(product);
  };

  const closeInterestModal = () => {
    setSelectedProductForInterest(null);
  };

  const openDetailModal = (product: Product) => {
    setSelectedProductForDetail(product);
  };

  const closeDetailModal = () => {
    setSelectedProductForDetail(null);
  };

  return (
    <AppContext.Provider
      value={{
        mode,
        setMode,
        activePublicPage,
        setActivePublicPage: (page) => {
          setActivePublicPage(page);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        },
        products,
        salesmen,
        leads,
        sales,
        levels,
        notes,
        config,
        addProduct,
        updateProduct,
        deleteProduct,
        createLead,
        updateLeadStatus,
        addSale,
        updateMasterSale,
        addSalesman,
        updateSalesman,
        updateLevels,
        addNote,
        deleteNote,
        updateConfig,
        resetAllData,
        selectedProductForInterest,
        openInterestModal,
        closeInterestModal,
        selectedProductForDetail,
        openDetailModal,
        closeDetailModal,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = (): AppContextType => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
