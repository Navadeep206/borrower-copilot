import React, { useState } from 'react';
import { Calculator, AlertCircle, CheckCircle2 } from 'lucide-react';

export default function CounterOfferSimulator({ evaluation }) {
  const [lenderRate, setLenderRate] = useState(evaluation.rawAnswers.lenderQuotedRate || '');
  const [lenderFeePct, setLenderFeePct] = useState(2.0);

  const { fairRateBand, requestedAmount, tenureMonths } = evaluation;

  const quotedRateNum = Number(lenderRate);
  const isQuoted = quotedRateNum > 0;

  const rateDelta = isQuoted ? quotedRateNum - fairRateBand.midpoint : 0;
  const isOverpaying = rateDelta > 0.5;
  const isGoodDeal = isQuoted && quotedRateNum <= fairRateBand.max;

  // Total interest calculation difference over loan tenure
  const fairTotalInterest = (evaluation.requestedEMI * tenureMonths) - requestedAmount;
  
  // Calculate quoted EMI
  const r = quotedRateNum / 12 / 100;
  const n = tenureMonths || 36;
  const P = requestedAmount || 100000;
  const quotedEMI = isQuoted ? Math.round((P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1)) : 0;
  const quotedTotalInterest = isQuoted ? (quotedEMI * n) - P : 0;

  const totalOverpayment = Math.max(0, quotedTotalInterest - fairTotalInterest);

  return (
    <div style={{ background: 'var(--bg-surface-elevated)', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', marginTop: '1.25rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
        <Calculator size={18} color="var(--accent-cyan)" />
        <h4 style={{ fontSize: '0.95rem', fontWeight: '700', margin: 0 }}>
          ⚡ Live "Lender Counter-Offer" Evaluator
        </h4>
      </div>

      <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
        Standing in a branch? Type the lender's quote below to see if you are overpaying.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
        <div>
          <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '0.2rem' }}>
            Lender Quoted Rate (%)
          </label>
          <input
            type="number"
            className="form-input"
            placeholder="e.g. 14.5"
            step="0.1"
            value={lenderRate}
            onChange={(e) => setLenderRate(e.target.value)}
          />
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '0.2rem' }}>
            Quoted Processing Fee (%)
          </label>
          <input
            type="number"
            className="form-input"
            placeholder="e.g. 2.0"
            step="0.5"
            value={lenderFeePct}
            onChange={(e) => setLenderFeePct(e.target.value)}
          />
        </div>
      </div>

      {isQuoted && (
        <div style={{
          padding: '0.9rem',
          borderRadius: 'var(--radius-sm)',
          background: isOverpaying ? 'var(--accent-rose-bg)' : 'var(--accent-green-bg)',
          color: isOverpaying ? 'var(--accent-rose)' : 'var(--accent-green)',
          border: `1px solid ${isOverpaying ? 'var(--accent-rose)' : 'var(--accent-green)'}`
        }}>
          <div style={{ fontWeight: '700', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            {isOverpaying ? <AlertCircle size={16} /> : <CheckCircle2 size={16} />}
            {isOverpaying ? `OVERPAYING BY ₹${Math.round(totalOverpayment).toLocaleString('en-IN')} IN TOTAL INTEREST!` : 'GOOD DEAL: Rate is within fair market band'}
          </div>
          <div style={{ fontSize: '0.8rem', marginTop: '0.3rem', color: 'var(--text-primary)' }}>
            {isOverpaying ? (
              <>
                Lender quoted <span className="mono-number">{quotedRateNum}%</span> (EMI: ₹{quotedEMI.toLocaleString('en-IN')}). Fair band for your profile is <span className="mono-number">{fairRateBand.min}% - {fairRateBand.max}%</span>. <strong>Counter-offer with {fairRateBand.min}%.</strong>
              </>
            ) : (
              <>
                The quote of <span className="mono-number">{quotedRateNum}%</span> aligns well with your fair rate range of {fairRateBand.min}% - {fairRateBand.max}%. Ensure processing fee stays below {evaluation.allInAPR.processingFeePct}%.
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
