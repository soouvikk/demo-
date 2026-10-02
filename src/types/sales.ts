export interface CommissionCalculationResult {
  productPrice: number;
  quantity: number;
  saleAmount: number;
  maxCommissionPoolRate: number; // e.g. 4.0%
  maxCommissionPoolAmount: number; // saleAmount * 0.04
  applicableJuniorRate: number; // e.g. 0.50%
  calculatedJuniorCommission: number; // saleAmount * (applicableJuniorRate / 100)
  retainedBusinessCommission: number; // maxCommissionPoolAmount - calculatedJuniorCommission
}

export interface CommissionSimulatorInput {
  productId: string;
  unitPrice: number;
  quantity: number;
  juniorRate: number;
  maxPoolRate?: number;
}
