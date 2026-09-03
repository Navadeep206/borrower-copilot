import { DEFAULT_RULES } from './rules.js';

/**
 * Standard EMI Formula: E = P * r * (1+r)^n / ((1+r)^n - 1)
 */
export function calculateEMI(principal, annualRatePct, tenureMonths) {
  if (!principal || principal <= 0 || tenureMonths <= 0) return 0;
  const r = annualRatePct / 12 / 100;
  if (r === 0) return Math.round(principal / tenureMonths);
  const emi = (principal * r * Math.pow(1 + r, tenureMonths)) / (Math.pow(1 + r, tenureMonths) - 1);
  return Math.round(emi);
}

/**
 * Reverse EMI: Max Loan Principal = E * ((1+r)^n - 1) / (r * (1+r)^n)
 */
export function calculateMaxLoanFromEMI(maxEMI, annualRatePct, tenureMonths) {
  if (!maxEMI || maxEMI <= 0 || tenureMonths <= 0) return 0;
  const r = annualRatePct / 12 / 100;
  if (r === 0) return Math.round(maxEMI * tenureMonths);
  const principal = (maxEMI * (Math.pow(1 + r, tenureMonths) - 1)) / (r * Math.pow(1 + r, tenureMonths));
  return Math.round(principal);
}

/**
 * Calculate All-in APR including Processing Fee & Charges
 * Formula approximates APR = Nominal Rate + (Processing Fee % / Tenure in years * 1.8)
 */
export function calculateAllInAPR(principal, annualRatePct, tenureMonths, processingFeePct = 2.0, docFee = 1000) {
  if (!principal || principal <= 0) return annualRatePct;
  const upfrontFees = (principal * (processingFeePct / 100)) + docFee;
  const netDisbursal = principal - upfrontFees;
  const emi = calculateEMI(principal, annualRatePct, tenureMonths);
  
  // Approximate internal rate of return (IRR) annualized
  const nominalMonthly = annualRatePct / 12 / 100;
  const tenureYears = tenureMonths / 12;
  const feeImpactPct = (upfrontFees / principal) * (12 / tenureMonths) * 100 * 1.6;
  const apr = annualRatePct + feeImpactPct;
  return parseFloat(apr.toFixed(2));
}

/**
 * Core Financial Engine Evaluator
 * Takes raw questionnaire answers + optional rule overrides
 */
export function evaluateBorrower(answers = {}, rules = DEFAULT_RULES) {
  // Extract key normalized input parameters
  const employmentType = answers.employmentType || 'salaried'; // salaried | self_employed | informal
  const netIncome = Math.max(0, Number(answers.netMonthlyIncome) || 0);
  const existingEMIs = Math.max(0, Number(answers.existingEMIs) || 0);
  const livingExpenses = Math.max(0, Number(answers.livingExpenses) || 0);
  const requestedAmount = Math.max(0, Number(answers.requestedAmount) || 0);
  const loanPurpose = answers.loanPurpose || 'personal'; // personal | wedding | business | vehicle | debt_consolidation | emergency
  const tenureMonths = Number(answers.desiredTenureMonths) || (loanPurpose === 'lap' ? 120 : 36);
  
  // Tier 2 inputs
  const creditScoreInput = answers.creditScore; // number or 'unknown'
  const collateralValue = Math.max(0, Number(answers.collateralValue) || 0);
  const hasBounces = answers.recentBounces === 'yes';
  const existingAppLoans = Number(answers.existingHighCostLoansAmount) || 0;
  const expectedMonthlyIncomeGain = Math.max(0, Number(answers.expectedMonthlyIncomeGain) || 0);
  const existingOffers = Number(answers.lenderQuotedRate) || null;

  // 1. Determine Product Routing & Asset Type
  let targetProduct = 'personal';
  let isProductiveAsset = false;

  if (loanPurpose === 'vehicle' || loanPurpose === 'scooter') {
    targetProduct = 'two_wheeler';
    isProductiveAsset = true;
  } else if (loanPurpose === 'business' || loanPurpose === 'stock') {
    if (collateralValue > 0 && collateralValue >= requestedAmount) {
      targetProduct = 'lap';
    } else {
      targetProduct = 'business_unsecured';
    }
    isProductiveAsset = true;
  } else if (collateralValue >= 300000 && (requestedAmount >= 500000 || employmentType === 'self_employed')) {
    targetProduct = 'lap';
  } else if (loanPurpose === 'debt_consolidation') {
    targetProduct = collateralValue > 0 ? 'lap' : 'personal';
  }

  const productSpec = rules.productBands[targetProduct] || rules.productBands.personal;

  // 2. Determine Credit Score Risk Premium
  let creditPremium = rules.creditScorePremiums.unknown.premium;
  let creditLabel = rules.creditScorePremiums.unknown.label;

  if (typeof creditScoreInput === 'number' && creditScoreInput > 0) {
    if (creditScoreInput >= 750) {
      creditPremium = rules.creditScorePremiums.excellent.premium;
      creditLabel = rules.creditScorePremiums.excellent.label;
    } else if (creditScoreInput >= 700) {
      creditPremium = rules.creditScorePremiums.good.premium;
      creditLabel = rules.creditScorePremiums.good.label;
    } else if (creditScoreInput >= 650) {
      creditPremium = rules.creditScorePremiums.fair.premium;
      creditLabel = rules.creditScorePremiums.fair.label;
    } else {
      creditPremium = rules.creditScorePremiums.poor.premium;
      creditLabel = rules.creditScorePremiums.poor.label;
    }
  }

  if (hasBounces) {
    creditPremium += 2.5; // Penalty for recent ECS/EMI bounce
  }

  // 3. Calculate Fair Interest Rate Band
  const minFairRate = Math.min(productSpec.maxRate - 1, Math.max(productSpec.minRate, productSpec.minRate + creditPremium));
  const maxFairRate = Math.min(productSpec.maxRate, minFairRate + 2.5);
  const midpointRate = (minFairRate + maxFairRate) / 2;

  const defaultProcessingFee = productSpec.defaultProcessingFeePct;
  const fairAllInAPRMin = calculateAllInAPR(requestedAmount || 100000, minFairRate, tenureMonths, defaultProcessingFee);
  const fairAllInAPRMax = calculateAllInAPR(requestedAmount || 100000, maxFairRate, tenureMonths, defaultProcessingFee);

  // 4. Calculate FOIR and Capacity Limits
  const foirConfig = rules.foirCeilings[employmentType] || rules.foirCeilings.salaried;
  let foirCap = foirConfig.base;
  if (netIncome >= 100000) foirCap = foirConfig.highIncome;
  else if (netIncome <= 30000) foirCap = foirConfig.lowIncome;

  const safetyBuffer = netIncome * (rules.safetyBufferPct[employmentType] || 0.15);

  // Max total EMI lender will allow
  const maxTotalEMILender = netIncome * foirCap;
  const maxNewEMILender = Math.max(0, maxTotalEMILender - existingEMIs);

  // Max total EMI borrower can SAFELY afford
  // Net Income - Living Expenses - Safety Buffer - Existing EMIs
  const safeAvailableForEMI = Math.max(0, netIncome - livingExpenses - safetyBuffer - existingEMIs);
  const safeNewEMIBorrower = Math.min(maxNewEMILender, safeAvailableForEMI);

  // Convert EMI limits to Principal Loan Amounts
  const lenderSanctionLimitRaw = calculateMaxLoanFromEMI(maxNewEMILender, midpointRate, tenureMonths);
  const safeBorrowerLimitRaw = calculateMaxLoanFromEMI(safeNewEMIBorrower, midpointRate, tenureMonths);

  // Apply Collateral LTV Cap if applicable
  let lenderSanctionLimit = lenderSanctionLimitRaw;
  if (targetProduct === 'lap' && collateralValue > 0) {
    const ltvCap = collateralValue * rules.ltvLimits.lap;
    lenderSanctionLimit = Math.min(lenderSanctionLimitRaw, ltvCap);
  }

  const safeBorrowerLimit = Math.min(lenderSanctionLimit, safeBorrowerLimitRaw);

  // Proposed EMI for requested amount
  const requestedEMI = calculateEMI(requestedAmount, midpointRate, tenureMonths);

  // 5. Productive Asset Net Cashflow Calculation
  const netCashflowDelta = expectedMonthlyIncomeGain > 0 ? (expectedMonthlyIncomeGain - requestedEMI) : null;

  // 6. Stress Testing Scenarios
  // Scenario A: Income drops by 20%
  const stressedIncome = netIncome * (1 - rules.stressScenarios.incomeDropPct);
  const stressedSafeEMI = Math.max(0, stressedIncome - livingExpenses - (stressedIncome * 0.10) - existingEMIs);

  // Scenario B: Rate rises by 2.0% (+200 bps)
  const stressedRate = midpointRate + (rules.stressScenarios.rateHikeBps / 100);
  const stressedEMI = calculateEMI(requestedAmount, stressedRate, tenureMonths);

  // 7. O1 Verdict Logic & One-Sentence Explanation
  let verdict = 'borrow'; // 'borrow' | 'don't_borrow' | 'borrow_less' | 'refinance'
  let verdictWhy = '';

  const debtToIncomeRatio = netIncome > 0 ? (existingEMIs / netIncome) : 0;
  const currentTotalEMIPct = netIncome > 0 ? ((existingEMIs + requestedEMI) / netIncome) : 1;

  if (existingAppLoans > 0 && debtToIncomeRatio > 0.45) {
    verdict = "don't_borrow";
    verdictWhy = `You are currently spending ${(debtToIncomeRatio * 100).toFixed(0)}% of income on high-cost app debt; adding more debt risks a severe financial trap.`;
  } else if (currentTotalEMIPct > foirCap + 0.10) {
    verdict = "don't_borrow";
    verdictWhy = `Requested ₹${requestedAmount.toLocaleString('en-IN')} loan requires ₹${requestedEMI.toLocaleString('en-IN')}/mo EMI, pushing your debt obligations to ${(currentTotalEMIPct * 100).toFixed(0)}% of income, exceeding the safe ceiling of ${(foirCap * 100).toFixed(0)}%.`;
  } else if (requestedAmount > safeBorrowerLimit * 1.15 && safeBorrowerLimit > 0) {
    verdict = "borrow_less";
    verdictWhy = `While lenders may sanction up to ₹${lenderSanctionLimit.toLocaleString('en-IN')}, your safe carry ceiling is ₹${safeBorrowerLimit.toLocaleString('en-IN')} to avoid stretching your monthly living budget.`;
  } else if (existingAppLoans > 0 && existingAppLoans < requestedAmount) {
    verdict = "refinance";
    verdictWhy = `First use part of this lower-rate loan (or LAP) to clear your ${existingAppLoans > 0 ? '₹' + existingAppLoans.toLocaleString('en-IN') : ''} high-cost app debt at 30%+ interest.`;
  } else if (loanPurpose === 'wedding' || loanPurpose === 'personal') {
    if (requestedEMI > safeAvailableForEMI) {
      verdict = "borrow_less";
      verdictWhy = `For non-productive personal spending, limit your EMI to ₹${safeNewEMIBorrower.toLocaleString('en-IN')}/mo (loan of ~₹${safeBorrowerLimit.toLocaleString('en-IN')}) to preserve essential savings.`;
    } else {
      verdict = "borrow";
      verdictWhy = `Your financial profile is strong: EMI of ₹${requestedEMI.toLocaleString('en-IN')} is well within your safe monthly surplus of ₹${safeAvailableForEMI.toLocaleString('en-IN')}.`;
    }
  } else {
    verdict = "borrow";
    if (isProductiveAsset && netCashflowDelta !== null && netCashflowDelta > 0) {
      verdictWhy = `Smart productive borrow: The asset generates ₹${expectedMonthlyIncomeGain.toLocaleString('en-IN')}/mo income, covering the ₹${requestedEMI.toLocaleString('en-IN')} EMI with a net positive surplus of +₹${netCashflowDelta.toLocaleString('en-IN')}/mo.`;
    } else {
      verdictWhy = `Your debt obligations are within safe limits. Maintain a maximum EMI ceiling of ₹${safeNewEMIBorrower.toLocaleString('en-IN')}/mo.`;
    }
  }

  // 8. Confidence Score Matrix
  let answeredCount = 0;
  if (answers.netMonthlyIncome) answeredCount++;
  if (answers.existingEMIs !== undefined) answeredCount++;
  if (answers.livingExpenses !== undefined) answeredCount++;
  if (answers.creditScore) answeredCount++;
  if (answers.collateralValue !== undefined) answeredCount++;
  if (answers.employmentType) answeredCount++;
  if (answers.recentBounces) answeredCount++;

  let confidenceLevel = 'Medium';
  let confidenceReason = 'Standard details provided. Providing collateral or exact credit score narrows the rate band further.';
  if (answeredCount >= 6 && answers.creditScore && answers.creditScore !== 'unknown') {
    confidenceLevel = 'High';
    confidenceReason = 'Full profile provided including verified income, CIBIL, and expense breakdown.';
  } else if (answeredCount <= 3 || creditScoreInput === 'unknown') {
    confidenceLevel = 'Low';
    confidenceReason = 'Wide rate band shown due to unverified credit score and minimal expense details. Unknown score is modeled conservatively.';
  }

  // 9. Lender Negotiation Talking Points & Script
  const talkingPoints = [];
  if (creditScoreInput >= 750) {
    talkingPoints.push(`Tier-1 CIBIL Score (${creditScoreInput}): Benchmark rate for prime borrowers is ${minFairRate}% - ${maxFairRate}%.`);
  } else if (creditScoreInput === 'unknown' || !creditScoreInput) {
    talkingPoints.push(`New-to-Credit (NTC): Request NTC program pricing without subprime penalties.`);
  }

  if (targetProduct === 'lap' && collateralValue > 0) {
    const ltvPct = ((requestedAmount / collateralValue) * 100).toFixed(0);
    talkingPoints.push(`Low LTV Collateral (${ltvPct}% of ₹${(collateralValue / 100000).toFixed(1)}L property): Strongly secured loan warrants lowest LAP band (${minFairRate}%).`);
  }

  if (isProductiveAsset && expectedMonthlyIncomeGain > 0) {
    talkingPoints.push(`Income-Generating Purpose: Asset yields ₹${expectedMonthlyIncomeGain.toLocaleString('en-IN')}/mo, ensuring 100% debt-service reliability.`);
  }

  if (existingOffers) {
    const delta = existingOffers - midpointRate;
    if (delta > 0) {
      talkingPoints.push(`Lender Quote Analysis: Quote of ${existingOffers}% is ${delta.toFixed(1)}% above fair market band (${minFairRate}% - ${maxFairRate}%). Counter with ${minFairRate}%.`);
    }
  }

  return {
    employmentType,
    targetProduct,
    isProductiveAsset,
    netIncome,
    existingEMIs,
    livingExpenses,
    requestedAmount,
    tenureMonths,

    // O1 Output
    verdict,
    verdictWhy,

    // O2 Output
    lenderSanctionLimit,
    safeBorrowerLimit,
    recommendedUseLimit: safeBorrowerLimit < lenderSanctionLimit ? safeBorrowerLimit : lenderSanctionLimit,
    limitDifference: Math.abs(lenderSanctionLimit - safeBorrowerLimit),

    // O3 Output
    fairRateBand: {
      min: parseFloat(minFairRate.toFixed(1)),
      max: parseFloat(maxFairRate.toFixed(1)),
      midpoint: parseFloat(midpointRate.toFixed(1))
    },
    allInAPR: {
      min: fairAllInAPRMin,
      max: fairAllInAPRMax,
      processingFeePct: defaultProcessingFee
    },

    // O4 Output
    requestedEMI,
    safeEMICeiling: safeNewEMIBorrower,
    safeAvailableForEMI,
    stressCases: {
      incomeDrop: {
        newIncome: Math.round(stressedIncome),
        newSafeEMI: Math.round(stressedSafeEMI),
        isStressedEMIViable: requestedEMI <= stressedSafeEMI
      },
      rateHike: {
        newRate: parseFloat(stressedRate.toFixed(1)),
        newEMI: Math.round(stressedEMI),
        additionalMonthlyCost: Math.max(0, Math.round(stressedEMI - requestedEMI))
      }
    },

    // Differentiator Outputs
    productiveAssetROI: {
      expectedIncomeGain: expectedMonthlyIncomeGain,
      requestedEMI,
      netCashflowDelta: netCashflowDelta !== null ? Math.round(netCashflowDelta) : null,
      isCashflowPositive: netCashflowDelta !== null && netCashflowDelta > 0
    },

    // Confidence & Transparency
    confidenceLevel,
    confidenceReason,
    creditLabel,
    talkingPoints,
    rawAnswers: answers
  };
}
