import React from 'react';
import CounterOfferSimulator from './CounterOfferSimulator.jsx';
import BranchScriptGenerator from './BranchScriptGenerator.jsx';
import { Printer, ShieldCheck, ArrowRight, AlertTriangle, Coins } from 'lucide-react';

export default function NegotiationCard({ evaluation }) {
  if (!evaluation) return null;

  const {
    verdict,
    verdictWhy,
    lenderSanctionLimit,
    safeBorrowerLimit,
    fairRateBand,
    allInAPR,
    safeEMICeiling,
    requestedEMI,
    requestedAmount,
    talkingPoints,
    confidenceLevel,
    confidenceReason,
    creditLabel
  } = evaluation;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="glass-card print-card" style={{ marginTop: '1.5rem', background: 'var(--bg-surface)' }}>
      {/* Header Bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '2px solid var(--border-color)', paddingBottom: '1rem', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <span style={{ fontSize: '0.75rem', fontWeight: '800', color: 'var(--accent-cyan)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
            Lender Negotiation Card • Official Copy
          </span>
          <h2 className="title-medium" style={{ margin: 0 }}>
            Borrower Profile Assessment Card
          </h2>
        </div>

        <button 
          className="btn btn-primary no-print" 
          onClick={handlePrint}
          style={{ fontSize: '0.85rem' }}
        >
          <Printer size={16} />
          <span>Print / Save PDF Card</span>
        </button>
      </div>

      {/* Profile Overview Pill */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justify: 'space-between',
        background: 'var(--bg-surface-elevated)',
        padding: '0.85rem 1.25rem',
        borderRadius: 'var(--radius-sm)',
        marginBottom: '1.25rem',
        flexWrap: 'wrap',
        gap: '0.75rem'
      }}>
        <div>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Loan Request: </span>
          <strong className="mono-number" style={{ fontSize: '1rem', color: 'var(--accent-cyan)' }}>
            ₹{requestedAmount.toLocaleString('en-IN')}
          </strong>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}> ({evaluation.tenureMonths} mo tenure)</span>
        </div>

        <div>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Credit Profile: </span>
          <strong>{creditLabel}</strong>
        </div>

        <div>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Assessment Confidence: </span>
          <span className={`badge ${confidenceLevel === 'High' ? 'badge-green' : confidenceLevel === 'Medium' ? 'badge-cyan' : 'badge-amber'}`}>
            {confidenceLevel} Confidence
          </span>
        </div>
      </div>

      {/* O1 Verdict Header */}
      <div style={{
        background: verdict === 'borrow' ? 'var(--accent-green-bg)' : verdict === 'borrow_less' ? 'var(--accent-amber-bg)' : 'var(--accent-rose-bg)',
        borderLeft: `5px solid ${verdict === 'borrow' ? 'var(--accent-green)' : verdict === 'borrow_less' ? 'var(--accent-amber)' : 'var(--accent-rose)'}`,
        padding: '1.1rem',
        borderRadius: 'var(--radius-sm)',
        marginBottom: '1.5rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.3rem' }}>
          <ShieldCheck size={20} color={verdict === 'borrow' ? 'var(--accent-green)' : verdict === 'borrow_less' ? 'var(--accent-amber)' : 'var(--accent-rose)'} />
          <h3 style={{ fontSize: '1.1rem', fontWeight: '800', margin: 0, textTransform: 'uppercase', color: verdict === 'borrow' ? 'var(--accent-green)' : verdict === 'borrow_less' ? 'var(--accent-amber)' : 'var(--accent-rose)' }}>
            VERDICT: {verdict === 'borrow' ? 'PROCEED TO BORROW' : verdict === 'borrow_less' ? 'BORROW LESS / CAP LIMIT' : 'REFINANCE FIRST / DO NOT BORROW AT HIGH RATES'}
          </h3>
        </div>
        <p style={{ fontSize: '0.9rem', color: 'var(--text-primary)', margin: 0, fontWeight: '500' }}>
          {verdictWhy}
        </p>
      </div>

      {/* 4 Core Outputs Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem', marginBottom: '1.5rem' }}>
        
        {/* Output 2: Amount Comparison */}
        <div style={{ background: 'var(--bg-surface-elevated)', padding: '1.1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
          <span style={{ fontSize: '0.72rem', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase' }}>O2 • Amount Ceilings</span>
          <div style={{ marginTop: '0.5rem' }}>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Lender Will Sanction:</div>
            <div className="mono-number" style={{ fontSize: '1.3rem', color: 'var(--text-muted)' }}>
              ₹{lenderSanctionLimit.toLocaleString('en-IN')}
            </div>

            <div style={{ borderTop: '1px dashed var(--border-color)', marginTop: '0.6rem', paddingTop: '0.6rem' }}>
              <div style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--accent-green)' }}>Borrower Safe Carry:</div>
              <div className="mono-number" style={{ fontSize: '1.4rem', color: 'var(--accent-green)', fontWeight: '800' }}>
                ₹{safeBorrowerLimit.toLocaleString('en-IN')}
              </div>
            </div>
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--accent-amber)', marginTop: '0.5rem' }}>
            💡 Use ₹{evaluation.recommendedUseLimit.toLocaleString('en-IN')} to prevent living stress.
          </div>
        </div>

        {/* Output 3: Fair Rate & All-in APR */}
        <div style={{ background: 'var(--bg-surface-elevated)', padding: '1.1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
          <span style={{ fontSize: '0.72rem', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase' }}>O3 • Fair Interest Rate Band</span>
          <div style={{ marginTop: '0.5rem' }}>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Target Rate Band:</div>
            <div className="mono-number" style={{ fontSize: '1.4rem', color: 'var(--accent-cyan)', fontWeight: '800' }}>
              {fairRateBand.min}% - {fairRateBand.max}%
            </div>

            <div style={{ borderTop: '1px dashed var(--border-color)', marginTop: '0.6rem', paddingTop: '0.6rem' }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>All-in APR (Fees Included):</div>
              <div className="mono-number" style={{ fontSize: '1.1rem', color: 'var(--accent-purple)' }}>
                {allInAPR.min}% - {allInAPR.max}%
              </div>
            </div>
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
            Max processing fee cap: {allInAPR.processingFeePct}% + GST.
          </div>
        </div>

        {/* Output 4: Safe EMI Ceiling */}
        <div style={{ background: 'var(--bg-surface-elevated)', padding: '1.1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
          <span style={{ fontSize: '0.72rem', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase' }}>O4 • Safe EMI Ceiling</span>
          <div style={{ marginTop: '0.5rem' }}>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Max Monthly EMI Limit:</div>
            <div className="mono-number" style={{ fontSize: '1.4rem', color: 'var(--accent-amber)', fontWeight: '800' }}>
              ₹{safeEMICeiling.toLocaleString('en-IN')}/mo
            </div>

            <div style={{ borderTop: '1px dashed var(--border-color)', marginTop: '0.6rem', paddingTop: '0.6rem' }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Requested EMI Outflow:</div>
              <div className="mono-number" style={{ fontSize: '1.1rem', color: requestedEMI <= safeEMICeiling ? 'var(--accent-green)' : 'var(--accent-rose)' }}>
                ₹{requestedEMI.toLocaleString('en-IN')}/mo
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Borrower Leverage Talking Points */}
      <div style={{ background: 'var(--bg-surface-elevated)', padding: '1.1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', marginBottom: '1.5rem' }}>
        <h4 style={{ fontSize: '0.9rem', fontWeight: '800', color: 'var(--accent-cyan)', textTransform: 'uppercase', marginBottom: '0.6rem' }}>
          Negotiation Leverage Points (Present to Bank Manager)
        </h4>
        <ul style={{ paddingLeft: '1.2rem', fontSize: '0.85rem', color: 'var(--text-primary)' }}>
          {talkingPoints.map((tp, idx) => (
            <li key={idx} style={{ marginBottom: '0.4rem' }}>{tp}</li>
          ))}
        </ul>
      </div>

      {/* Interactive Counter-Offer Evaluator */}
      <div className="no-print">
        <CounterOfferSimulator evaluation={evaluation} />
        <BranchScriptGenerator evaluation={evaluation} />
      </div>

    </div>
  );
}
