import React from 'react';
import StressTestSlider from './StressTestSlider.jsx';
import NegotiationCard from './NegotiationCard.jsx';
import { ShieldCheck, TrendingUp, DollarSign, Percent, AlertCircle, Sparkles } from 'lucide-react';

export default function OutputDashboard({ evaluation }) {
  if (!evaluation) return null;

  const {
    verdict,
    verdictWhy,
    lenderSanctionLimit,
    safeBorrowerLimit,
    recommendedUseLimit,
    fairRateBand,
    allInAPR,
    requestedEMI,
    safeEMICeiling,
    productiveAssetROI,
    confidenceLevel,
    confidenceReason,
    targetProduct
  } = evaluation;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      
      {/* O1 Verdict Banner */}
      <div className="glass-card" style={{
        background: verdict === 'borrow' ? 'var(--accent-green-bg)' : verdict === 'refinance' ? 'var(--accent-amber-bg)' : verdict === 'borrow_less' ? 'var(--accent-amber-bg)' : 'var(--accent-rose-bg)',
        borderLeft: `6px solid ${verdict === 'borrow' ? 'var(--accent-green)' : verdict === 'refinance' ? 'var(--accent-amber)' : verdict === 'borrow_less' ? 'var(--accent-amber)' : 'var(--accent-rose)'}`
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.4rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <ShieldCheck size={26} color={verdict === 'borrow' ? 'var(--accent-green)' : verdict === 'refinance' ? 'var(--accent-amber)' : verdict === 'borrow_less' ? 'var(--accent-amber)' : 'var(--accent-rose)'} />
            <h2 className="title-medium" style={{ margin: 0, color: verdict === 'borrow' ? 'var(--accent-green)' : verdict === 'refinance' ? 'var(--accent-amber)' : verdict === 'borrow_less' ? 'var(--accent-amber)' : 'var(--accent-rose)' }}>
              O1: {verdict === 'borrow' ? 'RECOMMENDED TO BORROW' : verdict === 'refinance' ? 'REFINANCE HIGH-COST DEBT FIRST' : verdict === 'borrow_less' ? 'BORROW LESS / REDUCE LIMIT' : 'DO NOT BORROW'}
            </h2>
          </div>
          <span className={`badge ${confidenceLevel === 'High' ? 'badge-green' : confidenceLevel === 'Medium' ? 'badge-cyan' : 'badge-amber'}`}>
            {confidenceLevel} Confidence
          </span>
        </div>
        
        <p style={{ fontSize: '0.98rem', fontWeight: '600', color: 'var(--text-primary)', margin: 0 }}>
          {verdictWhy}
        </p>
        
        <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.4rem' }}>
          ℹ️ {confidenceReason}
        </div>
      </div>

      {/* Productive Asset ROI Callout (If applicable for Ravi/Anita) */}
      {productiveAssetROI.expectedIncomeGain > 0 && (
        <div className="glass-card" style={{ borderLeft: '4px solid var(--accent-purple)', background: 'var(--accent-purple-bg)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.3rem' }}>
            <Sparkles size={20} color="var(--accent-purple)" />
            <h3 style={{ fontSize: '1.05rem', fontWeight: '700', margin: 0, color: 'var(--accent-purple)' }}>
              Productive Asset ROI: Smart Revenue Generator
            </h3>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.75rem', marginTop: '0.6rem' }}>
            <div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>New Income Generated:</span>
              <div className="mono-number" style={{ fontSize: '1.2rem', color: 'var(--accent-green)' }}>
                +₹{productiveAssetROI.expectedIncomeGain.toLocaleString('en-IN')}/mo
              </div>
            </div>

            <div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Monthly EMI Cost:</span>
              <div className="mono-number" style={{ fontSize: '1.2rem', color: 'var(--text-primary)' }}>
                -₹{requestedEMI.toLocaleString('en-IN')}/mo
              </div>
            </div>

            <div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Net Surplus Cashflow:</span>
              <div className="mono-number" style={{ fontSize: '1.2rem', color: productiveAssetROI.isCashflowPositive ? 'var(--accent-green)' : 'var(--accent-rose)', fontWeight: 800 }}>
                {productiveAssetROI.netCashflowDelta >= 0 ? '+' : ''}₹{productiveAssetROI.netCashflowDelta?.toLocaleString('en-IN')}/mo
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Core Outputs Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.25rem' }}>
        
        {/* O2: Maximum Amount */}
        <div className="glass-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
            <DollarSign size={20} color="var(--accent-cyan)" />
            <h3 style={{ fontSize: '1.05rem', fontWeight: '700', margin: 0 }}>
              O2: Maximum Amount
            </h3>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <div style={{ background: 'var(--bg-surface-elevated)', padding: '0.75rem', borderRadius: 'var(--radius-sm)' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Lender Will Likely Sanction:</span>
              <div className="mono-number" style={{ fontSize: '1.3rem', color: 'var(--text-secondary)' }}>
                ₹{lenderSanctionLimit.toLocaleString('en-IN')}
              </div>
            </div>

            <div style={{ background: 'var(--bg-surface-elevated)', padding: '0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--accent-green)' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--accent-green)' }}>Borrower Safe Carry Ceiling:</span>
              <div className="mono-number" style={{ fontSize: '1.4rem', color: 'var(--accent-green)', fontWeight: 800 }}>
                ₹{safeBorrowerLimit.toLocaleString('en-IN')}
              </div>
            </div>
          </div>

          <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.75rem', margin: 0 }}>
            {lenderSanctionLimit !== safeBorrowerLimit ? (
              <>⚠️ Lenders will offer up to ₹{lenderSanctionLimit.toLocaleString('en-IN')}, but cap yourself at <strong>₹{recommendedUseLimit.toLocaleString('en-IN')}</strong> to protect living expenses.</>
            ) : (
              <>Both limits align cleanly for your current financial profile.</>
            )}
          </p>
        </div>

        {/* O3: Fair Rate & All-in APR */}
        <div className="glass-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
            <Percent size={20} color="var(--accent-purple)" />
            <h3 style={{ fontSize: '1.05rem', fontWeight: '700', margin: 0 }}>
              O3: Fair Interest Rate & APR
            </h3>
          </div>

          <div style={{ background: 'var(--bg-surface-elevated)', padding: '0.75rem', borderRadius: 'var(--radius-sm)', marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Target Fair Interest Rate Band:</span>
            <div className="mono-number" style={{ fontSize: '1.4rem', color: 'var(--accent-cyan)', fontWeight: 800 }}>
              {fairRateBand.min}% - {fairRateBand.max}%
            </div>
          </div>

          <div style={{ background: 'var(--bg-surface-elevated)', padding: '0.75rem', borderRadius: 'var(--radius-sm)' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>All-in APR (Fees Included):</span>
            <div className="mono-number" style={{ fontSize: '1.2rem', color: 'var(--accent-purple)' }}>
              {allInAPR.min}% - {allInAPR.max}%
            </div>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
              Includes {allInAPR.processingFeePct}% max processing fee.
            </span>
          </div>
        </div>

        {/* O4: EMI Outflow Ceiling */}
        <div className="glass-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
            <TrendingUp size={20} color="var(--accent-amber)" />
            <h3 style={{ fontSize: '1.05rem', fontWeight: '700', margin: 0 }}>
              O4: EMI Outflow Ceiling
            </h3>
          </div>

          <div style={{ background: 'var(--bg-surface-elevated)', padding: '0.75rem', borderRadius: 'var(--radius-sm)', marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Safe Monthly EMI Ceiling:</span>
            <div className="mono-number" style={{ fontSize: '1.4rem', color: 'var(--accent-amber)', fontWeight: 800 }}>
              ₹{safeEMICeiling.toLocaleString('en-IN')}/mo
            </div>
          </div>

          <div style={{ background: 'var(--bg-surface-elevated)', padding: '0.75rem', borderRadius: 'var(--radius-sm)' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Requested Loan EMI Outflow:</span>
            <div className="mono-number" style={{ fontSize: '1.2rem', color: requestedEMI <= safeEMICeiling ? 'var(--accent-green)' : 'var(--accent-rose)' }}>
              ₹{requestedEMI.toLocaleString('en-IN')}/mo
            </div>
          </div>
        </div>

      </div>

      {/* Stress Testing Simulator */}
      <StressTestSlider evaluation={evaluation} />

      {/* Full Negotiation Card */}
      <NegotiationCard evaluation={evaluation} />

    </div>
  );
}
