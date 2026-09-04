import React from 'react';
import CounterOfferSimulator from './CounterOfferSimulator.jsx';
import BranchScriptGenerator from './BranchScriptGenerator.jsx';
import MagnetButton from './bits/MagnetButton.jsx';
import BlurReveal from './bits/BlurReveal.jsx';
import SpotlightCard from './bits/SpotlightCard.jsx';
import ShinyText from './bits/ShinyText.jsx';
import DecryptedText from './bits/DecryptedText.jsx';
import { Printer, ShieldCheck, ArrowRight, AlertTriangle, Coins, FileCheck2, ShieldAlert } from 'lucide-react';

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

  const isApproved = verdict === 'borrow';
  const isRefinance = verdict === 'refinance';
  const isBorrowLess = verdict === 'borrow_less';

  const verdictColor = isApproved ? 'var(--jade)' : isRefinance || isBorrowLess ? 'var(--amber)' : 'var(--crimson)';
  const verdictBg = isApproved ? 'var(--jade-bg)' : isRefinance || isBorrowLess ? 'var(--amber-bg)' : 'var(--crimson-bg)';

  return (
    <BlurReveal delay={200} duration={700}>
      <SpotlightCard
        className="glass-card print-card"
        spotlightColor="rgba(245, 197, 24, 0.1)"
        borderColor="rgba(245, 197, 24, 0.3)"
        style={{
          marginTop: '1.5rem',
          background: 'var(--dark-1)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-lg)',
          padding: '1.5rem'
        }}
      >
        {/* Header Bar */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border)', paddingBottom: '1rem', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <span style={{ fontSize: '0.72rem', fontWeight: '800', color: 'var(--gold)', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
                <DecryptedText text="BATCAVE TACTICAL DOSSIER • LENDER NEGOTIATION" speed={25} maxIterations={12} animateOn="both" />
              </span>
            </div>
            <h2 className="title-medium" style={{ margin: '0.2rem 0 0', fontFamily: 'var(--font-display)', letterSpacing: '0.04em' }}>
              <ShinyText color="var(--text-primary)" shineColor="var(--gold)" speed={4}>
                Borrower Assessment & Counter-Offer Strategy
              </ShinyText>
            </h2>
          </div>

          <MagnetButton
            className="btn btn-primary no-print"
            onClick={handlePrint}
            style={{ fontSize: '0.82rem', background: 'linear-gradient(135deg, var(--gold-dark), var(--gold))', color: 'var(--void)' }}
            strength={0.35}
          >
            <Printer size={15} />
            <span>Print Official Dossier</span>
          </MagnetButton>
        </div>

        {/* Profile Overview Pill */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'var(--dark-3)',
          padding: '0.85rem 1.25rem',
          borderRadius: 'var(--radius-sm)',
          border: '1px solid var(--border-dim)',
          marginBottom: '1.25rem',
          flexWrap: 'wrap',
          gap: '0.75rem'
        }}>
          <div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Loan Request: </span>
            <strong className="mono-number" style={{ fontSize: '1rem', color: 'var(--gold)' }}>
              ₹{requestedAmount.toLocaleString('en-IN')}
            </strong>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}> ({evaluation.tenureMonths} mo tenure)</span>
          </div>

          <div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Credit Profile: </span>
            <strong style={{ color: 'var(--text-primary)' }}>{creditLabel}</strong>
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
          background: verdictBg,
          borderLeft: `4px solid ${verdictColor}`,
          borderTop: '1px solid var(--border-dim)',
          borderRight: '1px solid var(--border-dim)',
          borderBottom: '1px solid var(--border-dim)',
          padding: '1.1rem 1.3rem',
          borderRadius: 'var(--radius-sm)',
          marginBottom: '1.5rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
            <ShieldCheck size={20} color={verdictColor} />
            <h3 style={{ fontSize: '1.05rem', fontWeight: '800', margin: 0, textTransform: 'uppercase', color: verdictColor, letterSpacing: '0.04em', fontFamily: 'var(--font-display)' }}>
              VERDICT: {isApproved ? 'PROCEED TO BORROW' : isRefinance ? 'REFINANCE HIGH-COST DEBT FIRST' : isBorrowLess ? 'BORROW LESS / CAP LIMIT' : 'DO NOT BORROW — ELEVATED DEFAULT RISK'}
            </h3>
          </div>
          <p style={{ fontSize: '0.88rem', color: 'var(--text-primary)', margin: 0, fontWeight: '500', lineHeight: 1.5 }}>
            {verdictWhy}
          </p>
        </div>

        {/* 4 Core Outputs Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>

          {/* Output 2: Amount Comparison */}
          <div style={{ background: 'var(--dark-3)', padding: '1.1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-dim)' }}>
            <span style={{ fontSize: '0.72rem', fontWeight: '800', color: 'var(--gold)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>O2 • Amount Ceilings</span>
            <div style={{ marginTop: '0.5rem' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Lender Will Sanction:</div>
              <div className="mono-number" style={{ fontSize: '1.3rem', color: 'var(--text-secondary)' }}>
                ₹{lenderSanctionLimit.toLocaleString('en-IN')}
              </div>

              <div style={{ borderTop: '1px dashed var(--border)', marginTop: '0.6rem', paddingTop: '0.6rem' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--gold)' }}>Borrower Safe Carry:</div>
                <div className="mono-number" style={{ fontSize: '1.35rem', color: 'var(--gold)', fontWeight: '800' }}>
                  ₹{safeBorrowerLimit.toLocaleString('en-IN')}
                </div>
              </div>
            </div>
            <div style={{ fontSize: '0.73rem', color: 'var(--amber)', marginTop: '0.5rem' }}>
              💡 Use ₹{evaluation.recommendedUseLimit.toLocaleString('en-IN')} to prevent living stress.
            </div>
          </div>

          {/* Output 3: Fair Rate & All-in APR */}
          <div style={{ background: 'var(--dark-3)', padding: '1.1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-dim)' }}>
            <span style={{ fontSize: '0.72rem', fontWeight: '800', color: 'var(--gold)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>O3 • Fair Interest Rate Band</span>
            <div style={{ marginTop: '0.5rem' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Target Rate Band:</div>
              <div className="mono-number" style={{ fontSize: '1.35rem', color: 'var(--gold-bright)', fontWeight: '800' }}>
                {fairRateBand.min}% – {fairRateBand.max}%
              </div>

              <div style={{ borderTop: '1px dashed var(--border)', marginTop: '0.6rem', paddingTop: '0.6rem' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>All-in APR (Fees Included):</div>
                <div className="mono-number" style={{ fontSize: '1.1rem', color: 'var(--text-primary)' }}>
                  {allInAPR.min}% – {allInAPR.max}%
                </div>
              </div>
            </div>
            <div style={{ fontSize: '0.73rem', color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
              Max processing fee cap: {allInAPR.processingFeePct}% + GST.
            </div>
          </div>

          {/* Output 4: Safe EMI Ceiling */}
          <div style={{ background: 'var(--dark-3)', padding: '1.1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-dim)' }}>
            <span style={{ fontSize: '0.72rem', fontWeight: '800', color: 'var(--gold)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>O4 • Safe EMI Ceiling</span>
            <div style={{ marginTop: '0.5rem' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Max Monthly EMI Limit:</div>
              <div className="mono-number" style={{ fontSize: '1.35rem', color: 'var(--gold)', fontWeight: '800' }}>
                ₹{safeEMICeiling.toLocaleString('en-IN')}/mo
              </div>

              <div style={{ borderTop: '1px dashed var(--border)', marginTop: '0.6rem', paddingTop: '0.6rem' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Requested EMI Outflow:</div>
                <div className="mono-number" style={{ fontSize: '1.1rem', color: requestedEMI <= safeEMICeiling ? 'var(--jade)' : 'var(--crimson)' }}>
                  ₹{requestedEMI.toLocaleString('en-IN')}/mo
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Borrower Leverage Talking Points */}
        <div style={{ background: 'var(--dark-3)', padding: '1.15rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-dim)', marginBottom: '1.5rem' }}>
          <h4 style={{ fontSize: '0.85rem', fontWeight: '800', color: 'var(--gold)', textTransform: 'uppercase', marginBottom: '0.65rem', letterSpacing: '0.08em', fontFamily: 'var(--font-display)' }}>
            Negotiation Leverage Points (Present to Branch Manager)
          </h4>
          <ul style={{ paddingLeft: '1.2rem', fontSize: '0.85rem', color: 'var(--text-primary)', margin: 0 }}>
            {talkingPoints.map((tp, idx) => (
              <li key={idx} style={{ marginBottom: '0.45rem', lineHeight: 1.45 }}>{tp}</li>
            ))}
          </ul>
        </div>

        {/* Interactive Counter-Offer Evaluator */}
        <div className="no-print">
          <CounterOfferSimulator evaluation={evaluation} />
          <BranchScriptGenerator evaluation={evaluation} />
        </div>

      </SpotlightCard>
    </BlurReveal>
  );
}
