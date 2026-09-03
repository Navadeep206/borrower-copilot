# Borrower Copilot · Indian Credit Self-Assessment & Lender Negotiation Assistant

> **Lokta Build Challenge Deliverable**  
> Build a personal assistant that helps an Indian borrower answer four questions before walking into a lender:  
> **1. Should I borrow at all?**  
> **2. How much am I really eligible for?**  
> **3. What is a fair rate for me?**  
> **4. What EMI should I agree to?**  
> Then hand them a one-page **Negotiation Card** they can hold up in a branch.

---

## 🚀 Quick Start (< 2 Minutes)

No backend required. Privacy-first, 100% client-side calculation engine.

```bash
# 1. Install dependencies
npm install

# 2. Run local development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

To run production build test:
```bash
npm run build
```

---

## 🌟 Key Differentiators (Standing Out)

1. ⚡ **Live "Lender Counter-Offer" Evaluator**: Standing at the bank manager's desk, type in the manager's quote (e.g. "14.5% + 2% fee") to instantly see: *"Overpaying by ₹42,800 in total interest. Counter with 11.5%."*
2. 📈 **Productive Asset ROI Engine**: Calculates **Net Monthly Cashflow Impact** (`New Income - EMI`). Shows how Anita’s e-scooter loan generates net **+₹7,500/mo** surplus despite loan EMI.
3. 💬 **Branch Counter-Script Generator**: Produces exact word-for-word scripts in English/Kannada for the borrower to speak to bank managers based on profile strengths.
4. 🎛️ **Live "Rule Sandbox Mode" (Built for Interview Follow-up)**: Interactive in-app control panel allowing evaluators to modify FOIR ceilings and rate bands live during the interview!
5. 🔍 **Dynamic Confidence & Range Tightener**: Visually demonstrates how answering Tier 2 questions narrows the interest rate range and boosts confidence.

---

## 📊 Three Borrower Persona Run-Throughs

### 1. Priya (29, Bengaluru · Salaried IT Professional)
* **Profile**: MNC Software Engineer (5 yrs). Net ₹1,10,000/mo. Car loan EMI ₹14,000/mo (2 yrs left). Rent ₹28,000/mo. CIBIL: 780.
* **Goal**: Wants ₹8,00,000 personal loan for a wedding.
* **Questions Asked**: Purpose (Wedding), Requested Amount (₹8L), Employment (Salaried), Income (₹1.1L), Existing EMI (₹14k), Rent (₹28k), Age (29), CIBIL (780), Employer (MNC).
* **Outputs**:
  - **O1 Verdict**: `PROCEED TO BORROW (WITH CAUTION)` — Profile is strong (EMI of ₹26,170/mo fits within safe surplus of ₹41,500/mo), but wedding is non-productive consumption.
  - **O2 Amount**: Lender Sanction Limit = **₹12,45,000** | Borrower Safe Carry = **₹12,45,000**.
  - **O3 Fair Rate & All-in APR**: Fair Band = **10.5% – 13.0%** | All-in APR = **11.5% – 14.0%** (2% fee cap).
  - **O4 EMI Ceiling & Stress**: Safe EMI Ceiling = **₹41,000/mo** | Requested EMI = **₹26,170/mo**.
  - **Negotiation Card**: Highlights 780 CIBIL score to demand sub-11.5% prime rate.

---

### 2. Ravi (42, Mysuru · Self-Employed Kirana Owner)
* **Profile**: Kirana store for 14 yrs. Cash income ₹60,000/mo (ITR ₹4.2L/yr). Wife earns ₹18,000/mo teaching. Owns shop premises unencumbered (~₹45,00,000). No credit score (New-to-Credit).
* **Goal**: Wants ₹15,00,000 for stock line + delivery vehicle.
* **Questions Asked**: Purpose (Business), Requested Amount (₹15L), Employment (Self-Employed), Net Cashflow (₹60k), Living Expenses (₹22k), CIBIL (Unknown), Collateral Value (₹45L), Business Age (14 yrs), Expected Extra Income (₹20k/mo).
* **Outputs**:
  - **O1 Verdict**: `PROCEED TO BORROW (ROUTE TO LAP)` — Automatically routes Ravi from a 24%+ unsecured business loan to **Loan Against Property (LAP)** at 9.5%–12.0%. Smart productive borrow generates +₹20k/mo revenue.
  - **O2 Amount**: Lender Sanction Limit = **₹27,00,000** (60% LTV Cap) | Borrower Safe Carry = **₹15,40,000** (based on cashflow). Borrower limit recommended.
  - **O3 Fair Rate & All-in APR**: Fair LAP Band = **9.5% – 12.0%** | All-in APR = **10.0% – 12.5%**.
  - **O4 EMI Ceiling & Stress**: Safe EMI Ceiling = **₹26,000/mo** | LAP EMI (7 yrs) = **₹24,800/mo**.
  - **Negotiation Card**: Leverages ₹45L unencumbered property & <35% LTV to counter 24% business loan quotes.

---

### 3. Anita (35, Hubballi · Informal Gig Rider & Tailor)
* **Profile**: Delivery rider + tailoring ₹28,000/mo. 2 children. Husband unemployed. 3 app loans (₹35,000 outstanding at 30%+ interest), 1 EMI bounced last month. CIBIL: 600.
* **Goal**: Wants ₹1,50,000 for electric scooter to double delivery runs.
* **Questions Asked**: Purpose (Scooter), Requested Amount (₹1.5L), Employment (Informal), Income (₹28k), Living Expenses (₹18k), App Loans (₹35k at 30%+), Bounces (Yes), Expected Extra Income (₹12k/mo).
* **Outputs**:
  - **O1 Verdict**: `REFINANCE HIGH-COST APP LOANS FIRST` — Flagged for high risk of debt spiraling due to 30%+ app loans and recent bounce. Recommends using part of scooter loan to clear ₹35k app debt immediately.
  - **O2 Amount**: Lender Sanction Limit = **₹1,20,000** | Borrower Safe Carry = **₹1,05,000**.
  - **O3 Fair Rate & All-in APR**: Fair Two-Wheeler Band = **13.5% – 16.0%** | All-in APR = **15.0% – 17.5%**.
  - **O4 EMI Ceiling & Stress**: Safe EMI Ceiling = **₹5,300/mo** | Requested EMI = **₹5,090/mo**.
  - **Productive Asset ROI**: Scooter adds +₹12,000/mo income against ₹5,090 EMI = **Net Positive Cashflow of +₹6,910/mo**.

---

## 🎬 5-Minute Walkthrough Summary

### What We Would Build Next:
1. **Multi-Language Voice Assistant (Kannada, Hindi, Tamil, Marathi)**: Enable voice input for informal borrowers who find text questionnaires challenging.
2. **Document OCR / Bank Statement Parser**: Local PDF parser to auto-extract income and existing EMIs from bank statements without sending data to servers.
3. **Lender Branch Map & Rate Comparison**: Real-time crowd-sourced rate registry comparing actual sanctions across public & private sector banks.

### What We Would Cut:
1. **Complex Machine Learning Models**: Rule-based deterministic engines are far superior for transparency and explainability in lending.
2. **Third-Party Bureau Integration**: Direct bureau pulling introduces privacy/regulatory hurdles and costs money; self-assessment with unknown score handling is faster and cleaner.

---

## 📂 Deliverables Checklist

- [x] **Working Web App**: React 18 + Vite, runs locally in < 2 mins via `npm install && npm run dev`.
- [x] **RULES.md**: Complete table of all rules, thresholds, formulas, and justifications.
- [x] **Three Run-throughs**: Detailed analysis and Negotiation Cards for Priya, Ravi, and Anita.
- [x] **5-Minute Walkthrough**: Architectural roadmap of next features and cuts.
