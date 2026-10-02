import {
  Product,
  Salesman,
  Lead,
  Sale,
  CommissionLevel,
  BusinessNote,
  BusinessConfig,
} from '../types/index';
import { INITIAL_PRODUCTS } from '../data/initialProducts';
import { INITIAL_SALESMEN } from '../data/initialSalesmen';
import { INITIAL_COMMISSION_LEVELS } from '../data/initialCommissionLevels';
import { INITIAL_LEADS } from '../data/initialLeads';
import { INITIAL_SALES } from '../data/initialSales';
import { INITIAL_NOTES } from '../data/initialNotes';

const STORAGE_KEYS = {
  PRODUCTS: 'graminmart_products_v1',
  SALESMEN: 'graminmart_salesmen_v1',
  LEADS: 'graminmart_leads_v1',
  SALES: 'graminmart_sales_v1',
  LEVELS: 'graminmart_levels_v1',
  NOTES: 'graminmart_notes_v1',
  CONFIG: 'graminmart_config_v3',
};

const DEFAULT_CONFIG: BusinessConfig = {
  companyName: 'GraminMart FMCG Distribution Network',
  tagline: 'Direct-from-Source B2B Grocery Showcase & Regional Representative Network',
  whatsappNumber: '917365980930',
  supportPhone: '+91 73659 80930',
  supportEmail: 'care@graminmart.in',
  centralWarehouseAddress: 'Plot 42, Malda Industrial Growth Centre, Mangalbari, West Bengal - 732142',
  maxCommissionPoolPercent: 4.0,
  currencySymbol: '₹',
};

function readItem<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function writeItem<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.warn(`Failed to persist to localStorage [${key}]`, err);
  }
}

export const StorageService = {
  // PRODUCTS
  getProducts(): Product[] {
    return readItem<Product[]>(STORAGE_KEYS.PRODUCTS, INITIAL_PRODUCTS);
  },
  saveProduct(product: Product): Product[] {
    const list = this.getProducts();
    const index = list.findIndex((p) => p.id === product.id);
    let updated: Product[];
    if (index >= 0) {
      updated = [...list];
      updated[index] = product;
    } else {
      updated = [product, ...list];
    }
    writeItem(STORAGE_KEYS.PRODUCTS, updated);
    return updated;
  },
  deleteProduct(id: string): Product[] {
    const list = this.getProducts().filter((p) => p.id !== id);
    writeItem(STORAGE_KEYS.PRODUCTS, list);
    return list;
  },

  // SALESMEN
  getSalesmen(): Salesman[] {
    return readItem<Salesman[]>(STORAGE_KEYS.SALESMEN, INITIAL_SALESMEN);
  },
  saveSalesman(salesman: Salesman): Salesman[] {
    const list = this.getSalesmen();
    const index = list.findIndex((s) => s.id === salesman.id);
    let updated: Salesman[];
    if (index >= 0) {
      updated = [...list];
      updated[index] = salesman;
    } else {
      updated = [salesman, ...list];
    }
    writeItem(STORAGE_KEYS.SALESMEN, updated);
    return updated;
  },

  // LEADS
  getLeads(): Lead[] {
    return readItem<Lead[]>(STORAGE_KEYS.LEADS, INITIAL_LEADS);
  },
  saveLead(lead: Lead): Lead[] {
    const list = this.getLeads();
    const index = list.findIndex((l) => l.id === lead.id);
    let updated: Lead[];
    if (index >= 0) {
      updated = [...list];
      updated[index] = lead;
    } else {
      updated = [lead, ...list];
    }
    writeItem(STORAGE_KEYS.LEADS, updated);
    return updated;
  },

  // SALES (with strict Master Sales History demarcation)
  getSales(): Sale[] {
    return readItem<Sale[]>(STORAGE_KEYS.SALES, INITIAL_SALES);
  },
  recordSale(sale: Sale): Sale[] {
    const list = this.getSales();
    const updated = [sale, ...list];
    writeItem(STORAGE_KEYS.SALES, updated);

    // Also update salesman cumulative metrics
    this.recalculateSalesmanMetrics(sale.salesmanId);
    return updated;
  },
  /**
   * Only SUPER_ADMIN is authorized to edit or delete master sales history
   */
  updateMasterSale(sale: Sale, actorRole: string): { success: boolean; sales: Sale[]; error?: string } {
    if (actorRole !== 'SUPER_ADMIN') {
      return {
        success: false,
        sales: this.getSales(),
        error: 'Security Violation: Only SUPER_ADMIN has authority to alter Master Sales History.',
      };
    }
    const list = this.getSales();
    const index = list.findIndex((s) => s.id === sale.id);
    if (index < 0) {
      return { success: false, sales: list, error: 'Sale record not found' };
    }
    const updated = [...list];
    updated[index] = sale;
    writeItem(STORAGE_KEYS.SALES, updated);
    this.recalculateSalesmanMetrics(sale.salesmanId);
    return { success: true, sales: updated };
  },

  // Recalculates totalSalesAmount and totalCommissionEarned for a salesman
  recalculateSalesmanMetrics(salesmanId: string): void {
    const sales = this.getSales().filter((s) => s.salesmanId === salesmanId && s.status === 'COMPLETED');
    const totalSalesAmount = sales.reduce((acc, s) => acc + s.saleAmount, 0);
    const totalCommissionEarned = sales.reduce((acc, s) => acc + s.calculatedCommission, 0);

    const salesmen = this.getSalesmen();
    const target = salesmen.find((s) => s.id === salesmanId);
    if (target) {
      target.totalSalesAmount = totalSalesAmount;
      target.totalCommissionEarned = Number(totalCommissionEarned.toFixed(2));
      this.saveSalesman(target);
    }
  },

  // COMMISSION LEVELS
  getCommissionLevels(): CommissionLevel[] {
    return readItem<CommissionLevel[]>(STORAGE_KEYS.LEVELS, INITIAL_COMMISSION_LEVELS);
  },
  saveCommissionLevels(levels: CommissionLevel[]): CommissionLevel[] {
    writeItem(STORAGE_KEYS.LEVELS, levels);
    return levels;
  },

  // NOTES
  getNotes(): BusinessNote[] {
    return readItem<BusinessNote[]>(STORAGE_KEYS.NOTES, INITIAL_NOTES);
  },
  saveNote(note: BusinessNote): BusinessNote[] {
    const list = this.getNotes();
    const index = list.findIndex((n) => n.id === note.id);
    let updated: BusinessNote[];
    if (index >= 0) {
      updated = [...list];
      updated[index] = note;
    } else {
      updated = [note, ...list];
    }
    writeItem(STORAGE_KEYS.NOTES, updated);
    return updated;
  },
  deleteNote(id: string): BusinessNote[] {
    const list = this.getNotes().filter((n) => n.id !== id);
    writeItem(STORAGE_KEYS.NOTES, list);
    return list;
  },

  // BUSINESS CONFIG
  getConfig(): BusinessConfig {
    return readItem<BusinessConfig>(STORAGE_KEYS.CONFIG, DEFAULT_CONFIG);
  },
  saveConfig(config: BusinessConfig): BusinessConfig {
    writeItem(STORAGE_KEYS.CONFIG, config);
    return config;
  },

  // RESET
  resetAll(): void {
    writeItem(STORAGE_KEYS.PRODUCTS, INITIAL_PRODUCTS);
    writeItem(STORAGE_KEYS.SALESMEN, INITIAL_SALESMEN);
    writeItem(STORAGE_KEYS.LEADS, INITIAL_LEADS);
    writeItem(STORAGE_KEYS.SALES, INITIAL_SALES);
    writeItem(STORAGE_KEYS.LEVELS, INITIAL_COMMISSION_LEVELS);
    writeItem(STORAGE_KEYS.NOTES, INITIAL_NOTES);
    writeItem(STORAGE_KEYS.CONFIG, DEFAULT_CONFIG);
  },
};
