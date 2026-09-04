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
 * Calculate All-in APR including Processing Fee & Charges.
 * Uses amortized fee impact approximation.
 * APR ≈ Nominal Rate + (Fee% / Tenure_years) * 1.6
 */
export function calculateAllInAPR(principal, annualRatePct, tenureMonths, processingFeePct = 2.0, docFee = 1000) {
  // BUG FIX: Removed hardcoded 100000 fallback. Return nominal rate if no principal.
  if (!principal || principal <= 0) return parseFloat(annualRatePct.toFixed(2));
  const upfrontFees = (principal * (processingFeePct / 100)) + docFee;
  const feeImpactPct = (upfrontFees / principal) * (12 / tenureMonths) * 100 * 1.6;
  const apr = annualRatePct + feeImpactPct;
  return parseFloat(apr.toFixed(2));
}

/**
 * Normalizes creditScore input from any source (string number, number, 'unknown', undefined)
 * to a canonical form: a number (e.g. 780) or the string 'unknown'.
 */
function normalizeCreditScore(raw) {
  if (raw === undefined || raw === null || raw === '') return 'unknown';
  if (raw === 'unknown') return 'unknown';
  const n = Number(raw);
  if (!isNaN(n) && n > 0) return n;
  return 'unknown';
}

/**
 * Core Financial Engine Evaluator
 * Takes raw questionnaire answers + optional rule overrides.
 * All inputs are defensively normalized to prevent undefined/NaN math errors.
 */
export function evaluateBorrower(answers = {}, rules = DEFAULT_RULES) {
  // --- Extract & Normalize Inputs ---
  const employmentType = answers.employmentType || 'salaried';
  const netIncome = Math.max(0, Number(answers.netMonthlyIncome) || 0);
  const existingEMIs = Math.max(0, Number(answers.existingEMIs) || 0);
  const livingExpenses = Math.max(0, Number(answers.livingExpenses) || 0);
  const requestedAmount = Math.max(0, Number(answers.requestedAmount) || 0);

  // FIX: 'scooter' was used in persona but 'vehicle' in questions schema - normalise both
  const rawPurpose = answers.loanPurpose || 'personal';
  const loanPurpose = rawPurpose === 'scooter' ? 'vehicle' : rawPurpose;

  const tenureMonths = Math.max(1, Number(answers.desiredTenureMonths) || 36);

  // Tier 2 inputs
  // FIX: Always normalize credit score through helper to handle string/number inconsistency
  const creditScoreInput = normalizeCreditScore(answers.creditScore);
  const collateralValue = Math.max(0, Number(answers.collateralValue) || 0);
  const hasBounces = answers.recentBounces === 'yes';
  const existingAppLoans = Math.max(0, Number(answers.existingHighCostLoansAmount) || 0);
  const expectedMonthlyIncomeGain = Math.max(0, Number(answers.expectedMonthlyIncomeGain) || 0);
  const lenderQuotedRate = answers.lenderQuotedRate ? Number(answers.lenderQuotedRate) : null;
  const existingOffers = lenderQuotedRate && lenderQuotedRate > 0 ? lenderQuotedRate : null;

  // --- 1. Product Routing & Asset Type ---
  let targetProduct = 'personal';
  let isProductiveAsset = false;

  if (loanPurpose === 'vehicle') {
    // FIX: Unified scooter/vehicle to 'vehicle' above; routes to two_wheeler
    targetProduct = 'two_wheeler';
    isProductiveAsset = true;
  } else if (loanPurpose === 'business') {
    // Route to LAP if collateral covers the loan; else unsecured business loan
    if (collateralValue > 0 && collateralValue >= requestedAmount) {
      targetProduct = 'lap';
    } else {
      targetProduct = 'business_unsecured';
    }
    isProductiveAsset = true;
  } else if (loanPurpose === 'debt_consolidation') {
    // Prefer LAP for consolidation if collateral exists; otherwise personal
    targetProduct = collateralValue > 0 ? 'lap' : 'personal';
  } else {
    // For personal/wedding: if collateral ≥ 3L AND (amount ≥ 5L OR self-employed), suggest LAP
    if (collateralValue >= 300000 && (requestedAmount >= 500000 || employmentType === 'self_employed')) {
      targetProduct = 'lap';
    }
  }

  // Guard: ensure target product exists in rules
  const productSpec = rules.productBands[targetProduct] || rules.productBands.personal;

  // --- 2. Credit Score Risk Premium ---
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
      // < 650 (poor score range)
      creditPremium = rules.creditScorePremiums.poor.premium;
      creditLabel = rules.creditScorePremiums.poor.label;
    }
  }

  if (hasBounces) {
    creditPremium += 2.5; // Penalty for recent ECS/EMI bounce
  }

  // --- 3. Fair Interest Rate Band ---
  // minFairRate = productSpec.minRate + creditPremium, capped at maxRate - 1
  const minFairRate = parseFloat(
    Math.min(productSpec.maxRate - 1.0, Math.max(productSpec.minRate, productSpec.minRate + creditPremium)).toFixed(1)
  );
  // maxFairRate = minFairRate + 2.5%, capped at productSpec.maxRate
  const maxFairRate = parseFloat(Math.min(productSpec.maxRate, minFairRate + 2.5).toFixed(1));
  const midpointRate = parseFloat(((minFairRate + maxFairRate) / 2).toFixed(2));

  const defaultProcessingFee = productSpec.defaultProcessingFeePct;

  // FIX: Use actual requestedAmount for APR; only fall back if 0 (e.g. no input yet)
  const aprBase = requestedAmount > 0 ? requestedAmount : 100000;
  const fairAllInAPRMin = calculateAllInAPR(aprBase, minFairRate, tenureMonths, defaultProcessingFee);
  const fairAllInAPRMax = calculateAllInAPR(aprBase, maxFairRate, tenureMonths, defaultProcessingFee);

  // --- 4. FOIR & Capacity Limits ---
  const foirConfig = rules.foirCeilings[employmentType] || rules.foirCeilings.salaried;
  let foirCap = foirConfig.base;
  if (netIncome >= 100000) foirCap = foirConfig.highIncome;
  else if (netIncome > 0 && netIncome <= 30000) foirCap = foirConfig.lowIncome;

  const safetyBufferPct = rules.safetyBufferPct[employmentType] ?? rules.safetyBufferPct.salaried;
  const safetyBuffer = netIncome * safetyBufferPct;

  // Max total EMI the lender will allow (FOIR based)
  const maxTotalEMILender = netIncome * foirCap;
  const maxNewEMILender = Math.max(0, maxTotalEMILender - existingEMIs);

  // Max EMI the borrower can safely afford (after living expenses + safety buffer + existing EMIs)
  const safeAvailableForEMI = Math.max(0, netIncome - livingExpenses - safetyBuffer - existingEMIs);
  // Safe new EMI = min of lender cap and borrower's actual surplus
  const safeNewEMIBorrower = Math.min(maxNewEMILender, safeAvailableForEMI);

  // Convert to principal loan amounts using reverse EMI
  const lenderSanctionLimitRaw = calculateMaxLoanFromEMI(maxNewEMILender, midpointRate, tenureMonths);
  const safeBorrowerLimitRaw = calculateMaxLoanFromEMI(safeNewEMIBorrower, midpointRate, tenureMonths);

  // Apply LTV cap for collateral-backed products
  let lenderSanctionLimit = lenderSanctionLimitRaw;
  if (targetProduct === 'lap' && collateralValue > 0) {
    const ltvCap = collateralValue * (rules.ltvLimits.lap || 0.60);
    lenderSanctionLimit = Math.min(lenderSanctionLimitRaw, ltvCap);
  }

  // Safe carry is min of lender's approval and borrower's safe cash flow limit
  const safeBorrowerLimit = Math.min(lenderSanctionLimit, safeBorrowerLimitRaw);

  // EMI for the requested loan at midpoint rate
  const requestedEMI = calculateEMI(requestedAmount, midpointRate, tenureMonths);

  // --- 5. Productive Asset Net Cashflow ---
  // Only calculated when there's an expected income gain (vehicle/business purpose)
  const netCashflowDelta = (isProductiveAsset && expectedMonthlyIncomeGain > 0)
    ? Math.round(expectedMonthlyIncomeGain - requestedEMI)
    : null;

  // --- 6. Stress Testing ---
  // Scenario A: Income drops by configured %
  const incomeDropPct = rules.stressScenarios?.incomeDropPct ?? 0.20;
  const stressedIncome = netIncome * (1 - incomeDropPct);
  const stressedSafetyBuffer = stressedIncome * safetyBufferPct;
  const stressedSafeEMI = Math.max(0, stressedIncome - livingExpenses - stressedSafetyBuffer - existingEMIs);

  // Scenario B: Rate hike by configured bps
  const rateHikeBps = rules.stressScenarios?.rateHikeBps ?? 200;
  const stressedRate = parseFloat((midpointRate + rateHikeBps / 100).toFixed(2));
  const stressedEMI = calculateEMI(requestedAmount, stressedRate, tenureMonths);

  // --- 7. O1 Verdict Logic ---
  let verdict = 'borrow';
  let verdictWhy = '';

  const debtToIncomeRatio = netIncome > 0 ? (existingEMIs / netIncome) : 0;
  const projectedTotalEMIPct = netIncome > 0 ? ((existingEMIs + requestedEMI) / netIncome) : 1;

  if (existingAppLoans > 0 && debtToIncomeRatio > 0.45) {
    // Existing high-cost app debt consuming > 45% of income: debt trap risk
    verdict = "don't_borrow";
    verdictWhy = `You are currently spending ${(debtToIncomeRatio * 100).toFixed(0)}% of income on existing high-cost app debt. Adding more debt risks a severe financial trap — refinance first.`;
  } else if (projectedTotalEMIPct > foirCap + 0.10) {
    // Projected total EMI exceeds FOIR ceiling by more than 10%
    verdict = "don't_borrow";
    verdictWhy = `Requested ₹${requestedAmount.toLocaleString('en-IN')} loan requires ₹${requestedEMI.toLocaleString('en-IN')}/mo EMI, pushing total debt to ${(projectedTotalEMIPct * 100).toFixed(0)}% of income — exceeds the safe ${(foirCap * 100).toFixed(0)}% ceiling.`;
  } else if (requestedAmount > 0 && safeBorrowerLimit > 0 && requestedAmount > safeBorrowerLimit * 1.15) {
    // Requested amount is more than 15% above the safe carry limit
    verdict = "borrow_less";
    verdictWhy = `While lenders may sanction up to ₹${lenderSanctionLimit.toLocaleString('en-IN')}, your safe carry ceiling is ₹${safeBorrowerLimit.toLocaleString('en-IN')} to avoid stretching your monthly budget.`;
  } else if (existingAppLoans > 0 && loanPurpose !== 'debt_consolidation') {
    // Has active high-cost app loans — recommend refinancing them first
    verdict = "refinance";
    verdictWhy = `Use part of this lower-rate loan to first clear your ₹${existingAppLoans.toLocaleString('en-IN')} high-cost app debt at 30%+ interest, then redeploy remaining funds for your goal.`;
  } else if (loanPurpose === 'wedding' || loanPurpose === 'personal') {
    // Non-productive consumption: apply stricter check
    if (requestedEMI > safeAvailableForEMI) {
      verdict = "borrow_less";
      verdictWhy = `For non-productive personal spending, limit your EMI to ₹${safeNewEMIBorrower.toLocaleString('en-IN')}/mo (≈ ₹${safeBorrowerLimit.toLocaleString('en-IN')} loan) to preserve essential savings.`;
    } else {
      verdict = "borrow";
      verdictWhy = `Your financial profile is strong: the ₹${requestedEMI.toLocaleString('en-IN')}/mo EMI is well within your safe monthly surplus of ₹${safeAvailableForEMI.toLocaleString('en-IN')}.`;
    }
  } else {
    verdict = "borrow";
    if (isProductiveAsset && netCashflowDelta !== null && netCashflowDelta > 0) {
      verdictWhy = `Smart productive borrow: the asset generates ₹${expectedMonthlyIncomeGain.toLocaleString('en-IN')}/mo income, covering the ₹${requestedEMI.toLocaleString('en-IN')} EMI with a net positive surplus of +₹${netCashflowDelta.toLocaleString('en-IN')}/mo.`;
    } else if (isProductiveAsset && netCashflowDelta !== null && netCashflowDelta <= 0) {
      // Income gain doesn't fully cover EMI — flag it, but still viable if within FOIR
      verdict = "borrow_less";
      verdictWhy = `The expected asset income of ₹${expectedMonthlyIncomeGain.toLocaleString('en-IN')}/mo does not fully cover the ₹${requestedEMI.toLocaleString('en-IN')} EMI. Consider a smaller loan or longer tenure.`;
    } else {
      verdictWhy = `Your debt obligations are within safe limits. Maintain a maximum new EMI of ₹${safeNewEMIBorrower.toLocaleString('en-IN')}/mo.`;
    }
  }

  // --- 8. Confidence Score ---
  let answeredCount = 0;
  if (answers.netMonthlyIncome && Number(answers.netMonthlyIncome) > 0) answeredCount++;
  if (answers.existingEMIs !== undefined && answers.existingEMIs !== '') answeredCount++;
  if (answers.livingExpenses !== undefined && answers.livingExpenses !== '') answeredCount++;
  if (answers.creditScore) answeredCount++;
  if (answers.collateralValue !== undefined && answers.collateralValue !== '') answeredCount++;
  if (answers.employmentType) answeredCount++;
  if (answers.recentBounces) answeredCount++;

  let confidenceLevel = 'Medium';
  let confidenceReason = 'Standard details provided. Providing collateral or exact CIBIL score narrows the rate band further.';

  if (answeredCount >= 6 && creditScoreInput !== 'unknown') {
    confidenceLevel = 'High';
    confidenceReason = 'Full profile provided including verified income, CIBIL, and expense breakdown.';
  } else if (answeredCount <= 3 || creditScoreInput === 'unknown') {
    confidenceLevel = 'Low';
    confidenceReason = 'Wide rate band shown due to unknown/missing credit score or incomplete inputs. Unknown score is treated conservatively (not as 300).';
  }

  // --- 9. Negotiation Talking Points ---
  const talkingPoints = [];

  // Credit score leverage
  if (typeof creditScoreInput === 'number' && creditScoreInput >= 750) {
    talkingPoints.push(`Tier-1 CIBIL Score (${creditScoreInput}): Benchmark rate for prime borrowers is ${minFairRate}%–${maxFairRate}%. Insist on this band.`);
  } else if (typeof creditScoreInput === 'number' && creditScoreInput >= 700) {
    talkingPoints.push(`Good CIBIL Score (${creditScoreInput}): You qualify for near-prime pricing. Target the lower half of the ${minFairRate}%–${maxFairRate}% band.`);
  } else if (creditScoreInput === 'unknown') {
    talkingPoints.push(`New-to-Credit (NTC): Request NTC program pricing — unknown score should not be treated as defaulted. A NTC premium of +3% is fair, not +7%.`);
  }

  // Collateral / LTV leverage
  if (targetProduct === 'lap' && collateralValue > 0 && requestedAmount > 0) {
    const ltvPct = ((requestedAmount / collateralValue) * 100).toFixed(0);
    talkingPoints.push(`Low LTV Collateral: ${ltvPct}% LTV on ₹${(collateralValue / 100000).toFixed(1)}L property. Fully secured loan warrants the lowest LAP band (${minFairRate}%).`);
  }

  // Income-generating asset leverage
  if (isProductiveAsset && expectedMonthlyIncomeGain > 0) {
    talkingPoints.push(`Income-Generating Purpose: Asset yields +₹${expectedMonthlyIncomeGain.toLocaleString('en-IN')}/mo, ensuring 100% debt-service reliability with positive cashflow.`);
  }

  // Employment stability leverage
  if (employmentType === 'salaried') {
    talkingPoints.push(`Stable Salaried Income: Regular payslip income with predictable monthly flow supports lowest risk classification.`);
  } else if (employmentType === 'self_employed') {
    const businessYears = Number(answers.businessAgeYears) || 0;
    if (businessYears >= 5) {
      talkingPoints.push(`Established Business (${businessYears} years): Demonstrated business longevity supports creditworthiness despite cash-based income.`);
    }
  }

  // Lender quote delta — counter offer
  if (existingOffers && existingOffers > maxFairRate) {
    const delta = (existingOffers - midpointRate).toFixed(1);
    talkingPoints.push(`Counter the Lender: Quoted rate of ${existingOffers}% is ${delta}% above fair market band (${minFairRate}%–${maxFairRate}%). Counter-offer firmly with ${minFairRate}%.`);
  }

  // Fallback: always give at least one talking point
  if (talkingPoints.length === 0) {
    talkingPoints.push(`Request itemised fee breakup: Ensure processing fee ≤ ${defaultProcessingFee}% + GST. Total all-in cost should not exceed ${fairAllInAPRMax}% APR.`);
  }

  // --- Return canonical evaluation object ---
  return {
    // Inputs (passed through for UI use)
    employmentType,
    targetProduct,
    isProductiveAsset,
    netIncome,
    existingEMIs,
    livingExpenses,
    requestedAmount,
    tenureMonths,
    midpointRate, // FIX: Exported so StressTestSlider can use it directly

    // O1: Verdict
    verdict,
    verdictWhy,

    // O2: Amount ceilings
    lenderSanctionLimit,
    safeBorrowerLimit,
    recommendedUseLimit: Math.min(safeBorrowerLimit, lenderSanctionLimit),
    limitDifference: Math.abs(lenderSanctionLimit - safeBorrowerLimit),

    // O3: Fair rate band & APR
    fairRateBand: {
      min: minFairRate,
      max: maxFairRate,
      midpoint: midpointRate
    },
    allInAPR: {
      min: fairAllInAPRMin,
      max: fairAllInAPRMax,
      processingFeePct: defaultProcessingFee
    },

    // O4: EMI ceiling & stress test
    requestedEMI,
    safeEMICeiling: Math.round(safeNewEMIBorrower),
    safeAvailableForEMI: Math.round(safeAvailableForEMI),
    foirCap,
    stressCases: {
      incomeDrop: {
        newIncome: Math.round(stressedIncome),
        newSafeEMI: Math.round(stressedSafeEMI),
        isStressedEMIViable: requestedEMI <= stressedSafeEMI
      },
      rateHike: {
        newRate: stressedRate,
        newEMI: Math.round(stressedEMI),
        additionalMonthlyCost: Math.max(0, Math.round(stressedEMI - requestedEMI))
      }
    },

    // Differentiator: Productive Asset ROI
    productiveAssetROI: {
      expectedIncomeGain: expectedMonthlyIncomeGain,
      requestedEMI,
      netCashflowDelta,
      isCashflowPositive: netCashflowDelta !== null && netCashflowDelta > 0
    },

    // Confidence & transparency
    confidenceLevel,
    confidenceReason,
    creditLabel,
    creditScoreInput,
    talkingPoints,
    rawAnswers: answers
  };
}
