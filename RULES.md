# RULES.md — Financial Engine Rules, Thresholds, & Assumptions

This document registers every financial rule, threshold, formula, interest rate band, and domain assumption powering **Borrower Copilot**.

---

## 1. Fixed Obligation to Income Ratio (FOIR) Rules

| What (Rule Name) | Value | Why (Financial Rationale) | Source / Basis |
| :--- | :--- | :--- | :--- |
| **Salaried FOIR Base Ceiling** | 50% | Maximum total EMI obligation allowed as a percentage of net monthly take-home salary. | Indian Banking Industry Standard (SBI / HDFC / ICICI) |
| **Salaried High-Income FOIR** | 55% | Net income > ₹1,00,000/mo has higher discretionary margin to absorb debt. | Lender Risk Policy Norms |
| **Self-Employed FOIR Base** | 40% | Cashflows in business vary seasonally; lower FOIR prevents business distress. | NBFC Micro-Lending Policy |
| **Informal / Gig Worker FOIR** | 35% | Unverified platform/cash income requires strict debt ceilings to avoid default. | MFI & Fintech Micro-Lending Guidelines |

---

## 2. Income Safety & Living Expense Buffers

| What (Rule Name) | Value | Why (Financial Rationale) | Source / Basis |
| :--- | :--- | :--- | :--- |
| **Salaried Emergency Buffer** | 15% of Net Income | Mandated liquid savings reserve before allocating income to new EMIs. | Personal Finance Planning Principles |
| **Self-Employed Emergency Buffer** | 20% of Net Income | Accounts for working capital drops or delayed customer receivables. | MSME Cashflow Management Standard |
| **Informal Worker Emergency Buffer** | 25% of Net Income | Gig workers face income shocks (fuel price hikes, platform algorithm changes). | My Judgement (Risk Mitigation) |

---

## 3. Product Interest Rate Bands & Fees (India 2026 Benchmarks)

| Product | Rate Band (Min - Max) | Default Processing Fee | Max Tenure | Source / Basis |
| :--- | :--- | :--- | :--- | :--- |
| **Personal Loan (Unsecured)** | 10.5% – 24.0% | 2.0% + GST | 60 Months | Scheduled Commercial Banks / NBFCs |
| **Loan Against Property (LAP)** | 9.0% – 14.0% | 1.0% + GST | 180 Months | Housing Finance Companies (HFCs) |
| **Gold Loan** | 8.5% – 16.0% | 0.5% + GST | 36 Months | RBI Statutory Cap Norms |
| **Two-Wheeler / EV Scooter** | 11.0% – 18.0% | 2.0% + GST | 48 Months | Vehicle Finance Lenders |
| **Unsecured Business Loan** | 14.0% – 28.0% | 2.5% + GST | 36 Months | Micro-Business Lenders |
| **High-Cost App Loans** | 28.0% – 42.0% | 4.0% + GST | 12 Months | Instant Loan Apps (Flagged as High Risk) |

---

## 4. Credit Score Risk Premiums & NTC Rules

| Credit Score Bracket | Risk Premium (Added to Min Rate) | Label & Treatment | Source / Basis |
| :--- | :--- | :--- | :--- |
| **750 – 900** | +0.0% | Excellent (Prime borrower, lowest rate band) | CIBIL Prime Standard |
| **700 – 749** | +1.5% | Good (Standard pricing) | Lender Risk Tier 2 |
| **650 – 699** | +3.5% | Fair (Elevated risk pricing) | Lender Risk Tier 3 |
| **Below 650** | +7.0% | Poor / Past Bounce Penalty | High-Risk Lending Policy |
| **Unknown / Missing** | +3.0% | New-to-Credit (NTC) | **My Judgement: Unknown is never 300** |

> [!IMPORTANT]
> **Rule #3 Enforcement ("Unknown is never zero")**: If a borrower does not know their credit score or is New-to-Credit (e.g., Ravi), the model does *not* assume a defaulting 300 score. It applies an NTC profile (+3% risk margin) and evaluates collateral / cashflow strength.

---

## 5. Loan-to-Value (LTV) Collateral Limits

| Product | Max LTV Cap | Rationale | Source / Basis |
| :--- | :--- | :--- | :--- |
| **Loan Against Property (LAP)** | 60% of Market Value | Protects borrower from property liquidation risk & limits lender LTV exposure. | RBI Housing & LAP Guidelines |
| **Gold Loan** | 75% of Gold Value | Statutory maximum cap enforced by RBI. | RBI Master Direction |
| **Two-Wheeler / Scooter Loan** | 85% of On-Road Price | standard vehicle financing margin down payment (15%). | Auto Finance Benchmark |

---

## 6. Debt Trap & Verdict Rules (O1)

| Rule / Trigger | Threshold | Verdict Output | Rationale |
| :--- | :--- | :--- | :--- |
| **High-Cost App Debt Trap** | Existing app loans at >25% interest + FOIR > 45% | **DO NOT BORROW** | Adding new debt to existing 30%+ app loans triggers debt spiraling. |
| **Excessive Debt Ratio** | Total EMIs > FOIR Limit + 10% | **DO NOT BORROW / BORROW LESS** | Monthly living expenses will be severely compromised. |
| **Sanction vs Safe Divergence** | Sanction Limit > Safe Carry Limit * 1.15 | **BORROW LESS** | Lenders sanction based on gross income, but safe carry protects real budget. |
| **High-Cost Refinancing Opportunity** | Lower-rate loan available + existing high-cost app debt | **REFINANCE FIRST** | Replace 30%+ instant app loans with lower-rate LAP/Personal loan. |
| **Productive Asset ROI Positive** | Incremental Income > Monthly EMI | **PROCEED (Smart Borrow)** | Asset pays for its own loan and generates positive net monthly surplus. |

---

## 7. All-in APR Calculation Formula

$$\text{All-in APR} \approx \text{Nominal Annual Rate} + \left( \frac{\text{Upfront Processing Fee \%}}{\text{Tenure in Years}} \times 1.6 \right)$$

*Includes processing fee (1-3% + GST) and documentation charges amortized over loan tenure.*
