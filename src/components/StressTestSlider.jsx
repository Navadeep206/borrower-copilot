import React, { useState } from 'react';
import { AlertTriangle, TrendingDown, ArrowUpRight } from 'lucide-react';

export default function StressTestSlider({ evaluation }) {
  const [incomeDropPct, setIncomeDropPct] = useState(20);
  const [rateHikeBps, setRateHikeBps] = useState(200);

  const { netIncome, livingExpenses, existingEMIs, requestedEMI, midpointRate, safetyBufferPct: _unused } = evaluation;
  // midpointRate is now correctly exported from the calculator engine
  const safetyBufferPct = evaluation.foirCap ? (evaluation.foirCap < 0.38 ? 0.25 : evaluation.foirCap < 0.43 ? 0.20 : 0.15) : 0.15;

  // Recalculate stress scenario based on slider state
  const stressedIncome = netIncome * (1 - (incomeDropPct / 100));
  const stressedSafetyBuffer = stressedIncome * safetyBufferPct;
  const stressedSafeAvailable = Math.max(0, stressedIncome - livingExpenses - stressedSafetyBuffer - existingEMIs);

  const stressedRate = midpointRate + (rateHikeBps / 100);
  const r = stressedRate / 12 / 100;
  const n = evaluation.tenureMonths || 36;
  const P = evaluation.requestedAmount || 100000;
  const dynamicStressedEMI = Math.round((P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1));

  const isIncomeDropViable = requestedEMI <= stressedSafeAvailable;
  const rateEMIIncrease = dynamicStressedEMI - requestedEMI;

  return (
    <div style={{ background: 'var(--bg-surface-elevated)', padding: '1.2rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', marginTop: '1rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
        <AlertTriangle size={18} color="var(--accent-amber)" />
        <h4 style={{ fontSize: '0.95rem', fontWeight: '700', margin: 0 }}>
          Interactive Stress Test Simulator (O4)
        </h4>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem', marginBottom: '1rem' }}>
        {/* Slider 1: Income Drop */}
        <div>
          <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '0.3rem' }}>
            Scenario A: Income Drop ({incomeDropPct}%)
          </label>
          <input
            type="range"
            min="0"
            max="40"
            step="5"
            value={incomeDropPct}
            onChange={(e) => setIncomeDropPct(Number(e.target.value))}
            style={{ width: '100%', accentColor: 'var(--accent-amber)' }}
          />
          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
            Stressed Income: <span className="mono-number">₹{Math.round(stressedIncome).toLocaleString('en-IN')}</span>/mo
          </div>
        </div>

        {/* Slider 2: Rate Hike */}
        <div>
          <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '0.3rem' }}>
            Scenario B: Interest Rate Hike (+{rateHikeBps / 100}%)
          </label>
          <input
            type="range"
            min="0"
            max="500"
            step="50"
            value={rateHikeBps}
            onChange={(e) => setRateHikeBps(Number(e.target.value))}
            style={{ width: '100%', accentColor: 'var(--accent-rose)' }}
          />
          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
            Stressed Rate: <span className="mono-number">{stressedRate.toFixed(1)}%</span>
          </div>
        </div>
      </div>

      {/* Stress Test Results Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', fontSize: '0.85rem' }}>
        <div style={{
          padding: '0.75rem',
          borderRadius: 'var(--radius-sm)',
          background: isIncomeDropViable ? 'var(--accent-green-bg)' : 'var(--accent-rose-bg)',
          color: isIncomeDropViable ? 'var(--accent-green)' : 'var(--accent-rose)'
        }}>
          <div style={{ fontWeight: '700', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            <TrendingDown size={15} />
            {isIncomeDropViable ? 'Income Drop Survivable' : 'Risk of Default on Income Drop'}
          </div>
          <div style={{ fontSize: '0.78rem', marginTop: '0.2rem' }}>
            Safe EMI ceiling drops to ₹{Math.round(stressedSafeAvailable).toLocaleString('en-IN')}/mo vs requested EMI of ₹{requestedEMI.toLocaleString('en-IN')}.
          </div>
        </div>

        <div style={{
          padding: '0.75rem',
          borderRadius: 'var(--radius-sm)',
          background: 'var(--accent-amber-bg)',
          color: 'var(--accent-amber)'
        }}>
          <div style={{ fontWeight: '700', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            <ArrowUpRight size={15} />
            EMI Increases by +₹{rateEMIIncrease.toLocaleString('en-IN')}/mo
          </div>
          <div style={{ fontSize: '0.78rem', marginTop: '0.2rem' }}>
            Monthly EMI rises from ₹{requestedEMI.toLocaleString('en-IN')} to ₹{dynamicStressedEMI.toLocaleString('en-IN')} at {stressedRate.toFixed(1)}%.
          </div>
        </div>
      </div>
    </div>
  );
}
