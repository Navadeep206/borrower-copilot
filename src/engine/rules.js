/**
 * Borrower Copilot Engine - Core Financial Rules & Baseline Benchmarks (India Market 2026)
 * All values are configurable in real-time via the Rule Sandbox.
 */

export const DEFAULT_RULES = {
  // Fixed Obligation to Income Ratio (FOIR) Ceilings by employment type
  foirCeilings: {
    salaried: { base: 0.50, highIncome: 0.55, lowIncome: 0.40 }, // Net > 1L gets 55%
    self_employed: { base: 0.40, highIncome: 0.45, lowIncome: 0.35 },
    informal: { base: 0.35, highIncome: 0.40, lowIncome: 0.30 }
  },

  // Emergency safety buffer required from net monthly income (before EMI allowance)
  safetyBufferPct: {
    salaried: 0.15,
    self_employed: 0.20,
    informal: 0.25
  },

  // Loan to Value (LTV) limits by product type
  ltvLimits: {
    lap: 0.60,              // Loan Against Property max 60% of market value
    gold: 0.75,             // Gold Loan max 75% RBI cap
    two_wheeler: 0.85,      // EV / Scooter max 85%
    car: 0.80,
    home: 0.80
  },

  // Benchmark Interest Rate Bands in India (Base min - max)
  productBands: {
    personal: { minRate: 10.5, maxRate: 24.0, defaultProcessingFeePct: 2.0, maxTenureMonths: 60 },
    lap: { minRate: 9.0, maxRate: 14.0, defaultProcessingFeePct: 1.0, maxTenureMonths: 180 },
    gold: { minRate: 8.5, maxRate: 16.0, defaultProcessingFeePct: 0.5, maxTenureMonths: 36 },
    two_wheeler: { minRate: 11.0, maxRate: 18.0, defaultProcessingFeePct: 2.0, maxTenureMonths: 48 },
    business_unsecured: { minRate: 14.0, maxRate: 28.0, defaultProcessingFeePct: 2.5, maxTenureMonths: 36 },
    app_loan: { minRate: 28.0, maxRate: 42.0, defaultProcessingFeePct: 4.0, maxTenureMonths: 12 }
  },

  // Credit Score Risk Adjustments (in percentage points added to base min rate)
  creditScorePremiums: {
    excellent: { range: [750, 900], premium: 0.0, label: "Excellent (750+)" },
    good: { range: [700, 749], premium: 1.5, label: "Good (700-749)" },
    fair: { range: [650, 699], premium: 3.5, label: "Fair (650-699)" },
    poor: { range: [300, 649], premium: 7.0, label: "Poor / Risk (<650)" },
    unknown: { range: null, premium: 3.0, label: "Unknown / New-to-Credit (NTC)" }
  },

  // Stress Test Constants
  stressScenarios: {
    rateHikeBps: 200,      // +2.0% interest rate hike
    incomeDropPct: 0.20    // -20% monthly net income drop
  },

  // Debt Trap Trigger Thresholds
  debtTrapThresholds: {
    maxDebtToIncomeRatio: 0.55,       // Current debt > 55% of income
    highCostInterestRateCutoff: 25.0,  // Existing loan rate > 25% is high cost
    bouncePenaltyMultiplier: 1.5       // Recent bounce increases risk premium
  }
};
