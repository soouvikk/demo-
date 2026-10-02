import { CommissionCalculationResult } from '../types/sales';
import { CommissionLevel } from '../types/index';

export const DEFAULT_MAX_POOL_RATE = 4.0; // 4% maximum commission pool

/**
 * Calculates commission breakdown based strictly on user formula:
 *
 * saleAmount = productPrice * quantity
 * commission = saleAmount * applicableCommissionRate / 100
 *
 * CRITICAL BUSINESS RULE:
 * 4% is ONLY the maximum available business commission pool.
 * A junior/joiner does NOT automatically receive 4%.
 * A junior receives ONLY the commission rate applicable to their current level.
 */
export function calculateCommission(
  productPrice: number,
  quantity: number,
  applicableJuniorRate: number,
  maxPoolRate: number = DEFAULT_MAX_POOL_RATE
): CommissionCalculationResult {
  const safePrice = Math.max(0, Number(productPrice) || 0);
  const safeQty = Math.max(0, Math.floor(Number(quantity) || 0));
  const safeJuniorRate = Math.max(0, Number(applicableJuniorRate) || 0);
  const safePoolRate = Math.max(0, Number(maxPoolRate) || DEFAULT_MAX_POOL_RATE);

  const saleAmount = safePrice * safeQty;
  const maxCommissionPoolAmount = Number(((saleAmount * safePoolRate) / 100).toFixed(2));
  
  // Exact junior commission: saleAmount * applicableCommissionRate / 100
  const calculatedJuniorCommission = Number(((saleAmount * safeJuniorRate) / 100).toFixed(2));
  
  // Retained business pool difference: 4% pool - junior commission
  const retainedBusinessCommission = Number(
    Math.max(0, maxCommissionPoolAmount - calculatedJuniorCommission).toFixed(2)
  );

  return {
    productPrice: safePrice,
    quantity: safeQty,
    saleAmount,
    maxCommissionPoolRate: safePoolRate,
    maxCommissionPoolAmount,
    applicableJuniorRate: safeJuniorRate,
    calculatedJuniorCommission,
    retainedBusinessCommission,
  };
}

export interface LevelProgressDetails {
  currentLevel: CommissionLevel;
  currentSales: number;
  currentCommissionRate: number;
  currentQualificationTarget: number;
  nextLevel: CommissionLevel | null;
  progressPercent: number;
  remainingAmount: number;
  isFullyQualifiedExtra: boolean;
}

/**
 * Evaluates junior progress according to Rule 2, 3, & 8.
 *
 * Example:
 * Current Level: EXTRA
 * Current Sales: ₹700
 * Qualification Target: ₹1,000
 * Progress: 70%
 * Remaining: ₹300
 */
export function evaluateSalesmanLevel(
  totalSales: number,
  levels: CommissionLevel[]
): LevelProgressDetails {
  const safeSales = Math.max(0, Number(totalSales) || 0);
  const sorted = [...levels].sort((a, b) => a.qualificationAmount - b.qualificationAmount);

  const extraLevel = sorted.find((l) => l.id === 'EXTRA') || sorted[0];

  // If sales are below Extra's ₹1,000 milestone:
  if (safeSales < extraLevel.qualificationAmount) {
    const target = extraLevel.qualificationAmount; // ₹1,000
    const progress = Math.min(100, Math.round((safeSales / target) * 100));
    const remaining = Math.max(0, target - safeSales);

    return {
      currentLevel: extraLevel,
      currentSales: safeSales,
      currentCommissionRate: extraLevel.rate, // 0.50%
      currentQualificationTarget: target,
      nextLevel: sorted[1] || null, // L-1
      progressPercent: progress,
      remainingAmount: remaining,
      isFullyQualifiedExtra: false,
    };
  }

  // Find the highest level achieved
  let currentLevel = extraLevel;
  let nextLevel: CommissionLevel | null = null;
  let nextLevelIndex = 1;

  for (let i = 0; i < sorted.length; i++) {
    if (safeSales >= sorted[i].qualificationAmount) {
      currentLevel = sorted[i];
      nextLevelIndex = i + 1;
    }
  }

  nextLevel = sorted[nextLevelIndex] || null;

  let progressPercent = 100;
  let remainingAmount = 0;
  let targetAmount = currentLevel.qualificationAmount;

  if (nextLevel) {
    targetAmount = nextLevel.qualificationAmount;
    const base = currentLevel.qualificationAmount;
    const span = targetAmount - base;
    const achieved = Math.max(0, safeSales - base);
    progressPercent = span > 0 ? Math.min(100, Math.round((achieved / span) * 100)) : 100;
    remainingAmount = Math.max(0, targetAmount - safeSales);
  }

  return {
    currentLevel,
    currentSales: safeSales,
    currentCommissionRate: currentLevel.rate,
    currentQualificationTarget: targetAmount,
    nextLevel,
    progressPercent,
    remainingAmount,
    isFullyQualifiedExtra: true,
  };
}

/**
 * Validation Suite verifying Rule 9:
 * - ₹40 × 1 at 0.50% = ₹0.20
 * - ₹40 × 10 at 0.50% = ₹2
 * - ₹1,000 at 0.50% = ₹5
 * - ₹3,000 at 0.20% = ₹6
 * - ₹9,000 at 0.10% = ₹9
 * - ₹27,000 at 0.08% = ₹21.60
 */
export function validateCommissionEngine(): { passed: boolean; testResults: Array<{ description: string; expected: number; actual: number; passed: boolean }> } {
  const tests = [
    {
      description: '₹40 × 1 at 0.50%',
      calc: calculateCommission(40, 1, 0.50),
      expected: 0.20,
    },
    {
      description: '₹40 × 10 at 0.50%',
      calc: calculateCommission(40, 10, 0.50),
      expected: 2.00,
    },
    {
      description: '₹1,000 at 0.50%',
      calc: calculateCommission(1000, 1, 0.50),
      expected: 5.00,
    },
    {
      description: '₹3,000 at 0.20%',
      calc: calculateCommission(3000, 1, 0.20),
      expected: 6.00,
    },
    {
      description: '₹9,000 at 0.10%',
      calc: calculateCommission(9000, 1, 0.10),
      expected: 9.00,
    },
    {
      description: '₹27,000 at 0.08%',
      calc: calculateCommission(27000, 1, 0.08),
      expected: 21.60,
    },
  ];

  const testResults = tests.map((t) => {
    const actual = t.calc.calculatedJuniorCommission;
    const passed = Math.abs(actual - t.expected) < 0.001;
    return {
      description: t.description,
      expected: t.expected,
      actual,
      passed,
    };
  });

  const passed = testResults.every((r) => r.passed);
  return { passed, testResults };
}
