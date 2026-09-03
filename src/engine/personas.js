/**
 * Persona Test Profiles for Lokta Challenge
 * Priya, Ravi, and Anita
 */

export const PERSONAS = [
  {
    id: 'priya',
    name: 'Priya',
    age: 29,
    location: 'Bengaluru',
    tag: 'Salaried IT Professional',
    avatar: '👩‍💻',
    story: 'Software engineer at a large MNC for 5 years. High credit score (780). Wants ₹8L personal loan for a wedding.',
    answers: {
      loanPurpose: 'wedding',
      requestedAmount: 800000,
      desiredTenureMonths: 36,
      employmentType: 'salaried',
      netMonthlyIncome: 110000,
      existingEMIs: 14000, // Car loan
      livingExpenses: 28000, // Rent
      age: 29,
      creditScore: 780,
      companyTier: 'mnc',
      jobTenureYears: 5,
      collateralValue: 0
    }
  },
  {
    id: 'ravi',
    name: 'Ravi',
    age: 42,
    location: 'Mysuru',
    tag: 'Self-Employed Kirana Owner',
    avatar: '🏪',
    story: 'Runs shop for 14 years. Cash income ₹60k/mo, ITR ₹4.2L/yr. Owns ₹45L unencumbered shop property. No credit history (NTC). Wants ₹15L for stock line & delivery vehicle.',
    answers: {
      loanPurpose: 'business',
      requestedAmount: 1500000,
      desiredTenureMonths: 84, // 7-year LAP
      employmentType: 'self_employed',
      netMonthlyIncome: 60000, // Combined net cashflow (store + wife teaching)
      existingEMIs: 0,
      livingExpenses: 22000,
      age: 42,
      creditScore: 'unknown',
      businessAgeYears: 14,
      itrDeclaredIncomeAnnual: 420000,
      collateralValue: 4500000,
      expectedMonthlyIncomeGain: 20000
    }
  },
  {
    id: 'anita',
    name: 'Anita',
    age: 35,
    location: 'Hubballi',
    tag: 'Informal Gig Rider & Tailor',
    avatar: '🛵',
    story: 'Gig delivery + tailoring ₹28k/mo. Husband unemployed. 3 app loans (₹35k at 30%+) with 1 recent bounce. Wants ₹1.5L for EV delivery scooter.',
    answers: {
      loanPurpose: 'scooter',
      requestedAmount: 150000,
      desiredTenureMonths: 36,
      employmentType: 'informal',
      netMonthlyIncome: 28000,
      existingEMIs: 4500, // App loan EMIs
      livingExpenses: 18000,
      age: 35,
      creditScore: 600,
      existingHighCostLoansAmount: 35000,
      recentBounces: 'yes',
      expectedMonthlyIncomeGain: 12000
    }
  }
];
