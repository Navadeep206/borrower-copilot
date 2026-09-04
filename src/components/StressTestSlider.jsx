import React, { useState } from 'react';
import { AlertTriangle, TrendingDown, ArrowUpRight, Zap, ShieldAlert } from 'lucide-react';

export default function StressTestSlider({ evaluation }) {
  const [incomeDropPct, setIncomeDropPct] = useState(20);
  const [rateHikeBps, setRateHikeBps] = useState(200);

  const { netIncome, livingExpenses, existingEMIs, requestedEMI, midpointRate } = evaluation;
  const safetyBufferPct = evaluation.foirCap
    ? (evaluation.foirCap < 0.38 ? 0.25 : evaluation.foirCap < 0.43 ? 0.20 : 0.15)
    : 0.15;

  const stressedIncome = netIncome * (1 - (incomeDropPct / 100));
  const stressedSafetyBuffer = stressedIncome * safetyBufferPct;
  const stressedSafeAvailable = Math.max(0, stressedIncome - livingExpenses - stressedSafetyBuffer - existingEMIs);

  const stressedRate = midpointRate + (rateHikeBps / 100);
  const r = stressedRate / 12 / 100;
  const n = evaluation.tenureMonths || 36;
  const P = evaluation.requestedAmount || 0;
  const dynamicStressedEMI = P > 0 ? Math.round((P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1)) : 0;

  const isIncomeDropViable = requestedEMI <= stressedSafeAvailable;
  const rateEMIIncrease = dynamicStressedEMI - requestedEMI;
  const incomeSurvivalPct = stressedSafeAvailable > 0 ? Math.min(100, Math.round((requestedEMI / stressedSafeAvailable) * 100)) : 999;

  return (
    <div style={{
      background: 'var(--dark-2)',
      borderRadius: 'var(--radius-lg)',
      border: '1px solid var(--border)',
      overflow: 'hidden',
      position: 'relative'
    }}>
      {/* Header */}
      <div style={{
        padding: '0.85rem 1.25rem',
        borderBottom: '1px solid var(--border-dim)',
        background: 'var(--dark-3)',
        display: 'flex', alignItems: 'center', gap: '0.6rem'
      }}>
        <div style={{
          width: '28px', height: '28px', borderRadius: '7px',
          background: 'var(--amber-bg)', border: '1px solid rgba(246,166,35,0.2)',
          display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
          <Zap size={14} color="var(--amber)" />
        </div>
        <div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-primary)' }}>
            Stress Test Simulator
          </div>
          <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontFamily: 'var(--font-display)', letterSpacing: '0.07em', textTransform: 'uppercase' }}>
            O4 · Worst-case scenario analysis
          </div>
        </div>
      </div>

      <div style={{ padding: '1rem 1.25rem' }}>
        {/* Sliders */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem', marginBottom: '1rem' }}>
          {/* Slider A */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
              <label style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', fontFamily: 'var(--font-display)' }}>
                Income Drop
              </label>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.9rem', fontWeight: 700, color: 'var(--amber)' }}>
                -{incomeDropPct}%
              </span>
            </div>
            <input
              type="range" min="0" max="40" step="5"
              value={incomeDropPct}
              onChange={(e) => setIncomeDropPct(Number(e.target.value))}
              style={{ width: '100%', accentColor: 'var(--gold)' }}
            />
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.3rem', fontFamily: 'var(--font-mono)' }}>
              Stressed income: <span style={{ color: 'var(--text-secondary)' }}>₹{Math.round(stressedIncome).toLocaleString('en-IN')}/mo</span>
            </div>
          </div>

          {/* Slider B */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
              <label style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', fontFamily: 'var(--font-display)' }}>
                Rate Hike
              </label>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.9rem', fontWeight: 700, color: 'var(--crimson)' }}>
                +{(rateHikeBps / 100).toFixed(1)}%
              </span>
            </div>
            <input
              type="range" min="0" max="500" step="50"
              value={rateHikeBps}
              onChange={(e) => setRateHikeBps(Number(e.target.value))}
              style={{ width: '100%', accentColor: 'var(--crimson)' }}
            />
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.3rem', fontFamily: 'var(--font-mono)' }}>
              Stressed rate: <span style={{ color: 'var(--text-secondary)' }}>{stressedRate.toFixed(1)}%</span>
            </div>
          </div>
        </div>

        {/* Result Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.7rem' }}>
          {/* Income Stress Result */}
          <div style={{
            padding: '0.85rem 1rem',
            borderRadius: 'var(--radius-md)',
            background: isIncomeDropViable ? 'var(--jade-bg)' : 'var(--crimson-bg)',
            border: `1px solid ${isIncomeDropViable ? 'rgba(34,201,132,0.2)' : 'rgba(229,62,62,0.2)'}`,
            position: 'relative', overflow: 'hidden'
          }}>
            <div style={{
              position: 'absolute', top: '-10px', right: '-10px', width: '60px', height: '60px',
              borderRadius: '50%',
              background: isIncomeDropViable ? 'var(--jade)' : 'var(--crimson)',
              filter: 'blur(20px)', opacity: 0.15
            }} />
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.3rem' }}>
              <TrendingDown size={14} color={isIncomeDropViable ? 'var(--jade)' : 'var(--crimson)'} />
              <span style={{
                fontFamily: 'var(--font-display)', fontSize: '0.72rem', fontWeight: 700,
                textTransform: 'uppercase', letterSpacing: '0.08em',
                color: isIncomeDropViable ? 'var(--jade)' : 'var(--crimson)'
              }}>
                {isIncomeDropViable ? 'Survivable' : 'Default Risk'}
              </span>
            </div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.2rem' }}>
              Safe EMI drops to ₹{Math.round(stressedSafeAvailable).toLocaleString('en-IN')}/mo
            </div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
              vs requested ₹{requestedEMI.toLocaleString('en-IN')}/mo
            </div>
          </div>

          {/* Rate Stress Result */}
          <div style={{
            padding: '0.85rem 1rem',
            borderRadius: 'var(--radius-md)',
            background: 'var(--amber-bg)',
            border: '1px solid rgba(246,166,35,0.2)',
            position: 'relative', overflow: 'hidden'
          }}>
            <div style={{
              position: 'absolute', top: '-10px', right: '-10px', width: '60px', height: '60px',
              borderRadius: '50%', background: 'var(--amber)', filter: 'blur(20px)', opacity: 0.12
            }} />
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.3rem' }}>
              <ArrowUpRight size={14} color="var(--amber)" />
              <span style={{ fontFamily: 'var(--font-display)', fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--amber)' }}>
                EMI Impact
              </span>
            </div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.2rem' }}>
              +₹{Math.max(0, rateEMIIncrease).toLocaleString('en-IN')}/mo extra
            </div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
              EMI rises to ₹{dynamicStressedEMI.toLocaleString('en-IN')} at {stressedRate.toFixed(1)}%
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
