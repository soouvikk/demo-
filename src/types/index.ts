export type Role = 'SUPER_ADMIN' | 'JUNIOR';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: Role;
  salesmanId?: string; // If role is JUNIOR, maps to salesman entity
}

export type ProductStatus = 'AVAILABLE' | 'LOW_STOCK' | 'OUT_OF_STOCK' | 'PRE_ORDER';

export interface Product {
  id: string;
  name: string;
  brand: string;
  category: string;
  price: number; // Current selling / B2B showcase price in INR
  mrp: number; // Original MRP
  image: string;
  description: string;
  unit: string; // e.g. "100g", "1 kg", "Pack of 12", "500ml"
  packSize: string; // e.g. "Carton of 24 units"
  minOrderQty: number; // Minimum recommended demo quantity
  offer?: string; // e.g. "Buy 10 cartons get 1 free" or "Special Festival Offer"
  status: ProductStatus;
  featured?: boolean;
}

export type LeadStatus = 'NEW' | 'CONTACTED' | 'FOLLOW_UP' | 'CONVERTED' | 'CLOSED';

export interface Lead {
  id: string;
  customerName?: string;
  customerPhone?: string;
  productId: string;
  productName: string;
  productPrice: number;
  productImage?: string;
  areaPin?: string;
  assignedSalesmanId?: string;
  assignedSalesmanName?: string;
  assignedSalesmanPhone?: string;
  status: LeadStatus;
  notes?: string;
  createdAt: string; // ISO 8601 string
  updatedAt?: string;
}

export interface Salesman {
  id: string;
  name: string;
  phone: string;
  email: string;
  assignedAreas: string[]; // List of PIN codes, e.g. ['732123', '732124']
  status: 'ACTIVE' | 'INACTIVE';
  levelId: string; // Level identifier, e.g., "EXTRA", "L-1", "L-2"
  levelName: string;
  commissionRate: number; // Current applicable junior commission rate (e.g. 0.50%)
  totalSalesAmount: number;
  totalCommissionEarned: number;
  joinedDate: string;
  avatar?: string;
}

export interface CommissionLevel {
  id: string;
  name: string; // "Extra", "L-1", "L-2", etc.
  qualificationAmount: number; // In INR, e.g. 1000, 3000, 9000
  rate: number; // Percentage, e.g. 0.50, 0.20, 0.10
  expectedCommission: number; // In INR at target qualification
  description?: string;
}

export interface Sale {
  id: string;
  salesmanId: string;
  salesmanName: string;
  productId: string;
  productName: string;
  productCategory?: string;
  productPrice: number;
  quantity: number;
  saleAmount: number; // productPrice * quantity
  maxCommissionPoolRate: number; // e.g. 4.0%
  applicableJuniorRate: number; // e.g. 0.50% based on salesman level
  commissionRate?: number; // Alias for applicableJuniorRate
  salesmanLevel?: string; // e.g. "EXTRA", "L-1"
  calculatedCommission: number; // saleAmount * applicableJuniorRate / 100
  date: string; // YYYY-MM-DD
  status: 'COMPLETED' | 'PENDING_APPROVAL' | 'CANCELLED';
  customerName?: string;
  customerAreaPin?: string;
  notes?: string;
  createdAt: string;
  createdBy: string; // Admin or Junior ID
}

export type NoteVisibility = 'PUBLIC' | 'JUNIOR_ONLY' | 'ADMIN_ONLY';

export interface BusinessNote {
  id: string;
  title: string;
  content: string;
  visibility: NoteVisibility;
  category: 'ANNOUNCEMENT' | 'OFFER' | 'OPERATIONAL' | 'POLICY';
  isPinned?: boolean;
  createdAt: string;
  authorName: string;
}

export interface BusinessConfig {
  companyName: string;
  tagline: string;
  whatsappNumber: string; // E.164 without plus or formatted for wa.me
  supportPhone: string;
  supportEmail: string;
  centralWarehouseAddress: string;
  maxCommissionPoolPercent: number; // Default 4%
  currencySymbol: string; // "₹"
}
