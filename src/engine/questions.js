/**
 * Adaptive Question Schema for Borrower Copilot
 * Separated into Tier 1 (Must Questions) and Tier 2 (Adaptive Additional Questions)
 */

export const QUESTION_SCHEMA = {
  tier1: [
    {
      id: 'loanPurpose',
      label: 'What is the loan for?',
      type: 'select',
      required: true,
      options: [
        { value: 'personal', label: 'Personal / General Use' },
        { value: 'wedding', label: 'Wedding / Social Event' },
        { value: 'business', label: 'Business Working Capital / Stock' },
        { value: 'vehicle', label: 'Delivery Scooter / Vehicle' },
        { value: 'debt_consolidation', label: 'Refinance High-Cost App Loans' }
      ]
    },
    {
      id: 'requestedAmount',
      label: 'How much do you want to borrow? (₹)',
      type: 'currency',
      required: true,
      placeholder: 'e.g. 5,00,000',
      min: 10000,
      max: 5000000
    },
    {
      id: 'desiredTenureMonths',
      label: 'Desired Repayment Tenure',
      type: 'select',
      required: true,
      options: [
        { value: 12, label: '1 Year (12 months)' },
        { value: 24, label: '2 Years (24 months)' },
        { value: 36, label: '3 Years (36 months)' },
        { value: 48, label: '4 Years (48 months)' },
        { value: 60, label: '5 Years (60 months)' },
        { value: 120, label: '10 Years (120 months - LAP / Housing)' }
      ]
    },
    {
      id: 'employmentType',
      label: 'What is your primary income type?',
      type: 'radio',
      required: true,
      options: [
        { value: 'salaried', label: 'Salaried (MNC / Govt / Private)' },
        { value: 'self_employed', label: 'Self-Employed / Shop / Business' },
        { value: 'informal', label: 'Informal / Gig Worker / Platform Rider' }
      ]
    },
    {
      id: 'netMonthlyIncome',
      label: 'Net Monthly Take-Home Income (₹)',
      type: 'currency',
      required: true,
      placeholder: 'e.g. 50,000'
    },
    {
      id: 'existingEMIs',
      label: 'Total Existing Monthly EMIs Paid Today (₹)',
      type: 'currency',
      required: true,
      placeholder: 'e.g. 10,000 (0 if none)'
    },
    {
      id: 'livingExpenses',
      label: 'Monthly Household Living Expenses & Rent (₹)',
      type: 'currency',
      required: true,
      placeholder: 'e.g. 20,000'
    },
    {
      id: 'age',
      label: 'Your Age (Years)',
      type: 'number',
      required: true,
      min: 18,
      max: 75,
      placeholder: 'e.g. 32'
    },
    {
      id: 'creditScore',
      label: 'Known Credit Score (CIBIL / Experian)',
      type: 'select',
      required: true,
      options: [
        { value: 780, label: '780+ (Excellent)' },
        { value: 720, label: '700 - 779 (Good)' },
        { value: 660, label: '650 - 699 (Fair)' },
        { value: 600, label: 'Below 650 (Poor / Past Default)' },
        { value: 'unknown', label: 'Don\'t Know / No Prior Formal Loans' }
      ]
    }
  ],

  tier2: [
    // Salaried specific
    {
      id: 'companyTier',
      label: 'Employer Category',
      type: 'select',
      condition: (answers) => answers.employmentType === 'salaried',
      options: [
        { value: 'mnc', label: 'Large MNC / Fortune 500' },
        { value: 'govt', label: 'Government / Public Sector' },
        { value: 'private_ltd', label: 'Private Ltd / SME' },
        { value: 'startup', label: 'Early-stage Startup' }
      ]
    },
    {
      id: 'jobTenureYears',
      label: 'Years at Current Job / Career',
      type: 'number',
      condition: (answers) => answers.employmentType === 'salaried',
      placeholder: 'e.g. 5'
    },

    // Self-employed specific
    {
      id: 'businessAgeYears',
      label: 'Business Operational History (Years)',
      type: 'number',
      condition: (answers) => answers.employmentType === 'self_employed',
      placeholder: 'e.g. 14'
    },
    {
      id: 'itrDeclaredIncomeAnnual',
      label: 'Annual Income Declared on Last ITR (₹)',
      type: 'currency',
      condition: (answers) => answers.employmentType === 'self_employed',
      placeholder: 'e.g. 4,20,000'
    },

    // Informal specific
    {
      id: 'existingHighCostLoansAmount',
      label: 'Outstanding High-Cost App Loans / Local Money Loans (₹)',
      type: 'currency',
      condition: (answers) => answers.employmentType === 'informal' || answers.loanPurpose === 'debt_consolidation',
      placeholder: 'e.g. 35,000 (at 30%+ rate)'
    },
    {
      id: 'recentBounces',
      label: 'Did any EMI or cheque bounce in the last 6 months?',
      type: 'radio',
      condition: (answers) => answers.employmentType === 'informal' || answers.employmentType === 'self_employed',
      options: [
        { value: 'no', label: 'No Bounces (Clean Repayment)' },
        { value: 'yes', label: 'Yes (1 or more bounced EMIs)' }
      ]
    },

    // Productive Asset ROI Questions
    {
      id: 'expectedMonthlyIncomeGain',
      label: 'If productive (vehicle/business), how much EXTRA monthly income will it generate? (₹)',
      type: 'currency',
      condition: (answers) => answers.loanPurpose === 'business' || answers.loanPurpose === 'vehicle' || answers.loanPurpose === 'scooter',
      placeholder: 'e.g. 12,000 extra per month'
    },

    // Collateral Question (Key for Ravi & LAP routing)
    {
      id: 'collateralValue',
      label: 'Market Value of Property / Shop / Asset You Own Unencumbered (₹)',
      type: 'currency',
      condition: (answers) => answers.employmentType === 'self_employed' || answers.requestedAmount >= 300000,
      placeholder: 'e.g. 45,00,000 (0 if none)'
    },

    // Lender Quote Input (For Counter-Offer Evaluator)
    {
      id: 'lenderQuotedRate',
      label: 'Has a lender already quoted an interest rate? (%)',
      type: 'number',
      placeholder: 'e.g. 14.5 (%)',
      min: 5,
      max: 45
    }
  ]
};
