import React from 'react';
import { Sliders, X, RefreshCw, Check } from 'lucide-react';
import { DEFAULT_RULES } from '../engine/rules.js';

export default function RuleSandbox({ isOpen, onClose, rules, setRules }) {
  if (!isOpen) return null;

  const handleFOIRChange = (empType, key, val) => {
    setRules(prev => ({
      ...prev,
      foirCeilings: {
        ...prev.foirCeilings,
        [empType]: {
          ...prev.foirCeilings[empType],
          [key]: Number(val)
        }
      }
    }));
  };

  const handleProductRateChange = (prodKey, rateKey, val) => {
    setRules(prev => ({
      ...prev,
      productBands: {
        ...prev.productBands,
        [prodKey]: {
          ...prev.productBands[prodKey],
          [rateKey]: Number(val)
        }
      }
    }));
  };

  const handleReset = () => {
    setRules(DEFAULT_RULES);
  };

  return (
    <div className="modal-overlay no-print" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Sliders size={22} color="var(--accent-amber)" />
            <h2 className="title-medium" style={{ margin: 0 }}>
              Live Rule Sandbox (Follow-up Interview Mode)
            </h2>
          </div>
          <button className="btn btn-secondary" onClick={onClose} style={{ padding: '0.4rem 0.6rem' }}>
            <X size={18} />
          </button>
        </div>

        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>
          Modify financial thresholds and product rate bands in real-time. The UI recalculates immediately.
        </p>

        {/* Section 1: FOIR Ceilings */}
        <div style={{ marginBottom: '1.5rem' }}>
          <h4 style={{ fontSize: '0.9rem', fontWeight: '800', color: 'var(--accent-cyan)', textTransform: 'uppercase', marginBottom: '0.75rem' }}>
            1. FOIR (Fixed Obligation to Income Ratio) Limits
          </h4>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: '600' }}>
                Salaried Base FOIR ({(rules.foirCeilings.salaried.base * 100).toFixed(0)}%)
              </label>
              <input
                type="range"
                min="0.30"
                max="0.65"
                step="0.05"
                value={rules.foirCeilings.salaried.base}
                onChange={(e) => handleFOIRChange('salaried', 'base', e.target.value)}
                style={{ width: '100%', accentColor: 'var(--accent-cyan)' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: '600' }}>
                Self-Employed Base FOIR ({(rules.foirCeilings.self_employed.base * 100).toFixed(0)}%)
              </label>
              <input
                type="range"
                min="0.25"
                max="0.55"
                step="0.05"
                value={rules.foirCeilings.self_employed.base}
                onChange={(e) => handleFOIRChange('self_employed', 'base', e.target.value)}
                style={{ width: '100%', accentColor: 'var(--accent-purple)' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: '600' }}>
                Informal Base FOIR ({(rules.foirCeilings.informal.base * 100).toFixed(0)}%)
              </label>
              <input
                type="range"
                min="0.20"
                max="0.50"
                step="0.05"
                value={rules.foirCeilings.informal.base}
                onChange={(e) => handleFOIRChange('informal', 'base', e.target.value)}
                style={{ width: '100%', accentColor: 'var(--accent-amber)' }}
              />
            </div>
          </div>
        </div>

        {/* Section 2: Product Rate Bands */}
        <div style={{ marginBottom: '1.5rem' }}>
          <h4 style={{ fontSize: '0.9rem', fontWeight: '800', color: 'var(--accent-cyan)', textTransform: 'uppercase', marginBottom: '0.75rem' }}>
            2. Product Interest Rate Bands (%)
          </h4>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: '600' }}>
                Personal Loan Min Rate ({rules.productBands.personal.minRate}%)
              </label>
              <input
                type="number"
                className="form-input"
                step="0.5"
                value={rules.productBands.personal.minRate}
                onChange={(e) => handleProductRateChange('personal', 'minRate', e.target.value)}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: '600' }}>
                LAP Min Rate ({rules.productBands.lap.minRate}%)
              </label>
              <input
                type="number"
                className="form-input"
                step="0.5"
                value={rules.productBands.lap.minRate}
                onChange={(e) => handleProductRateChange('lap', 'minRate', e.target.value)}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: '600' }}>
                Two-Wheeler / EV Scooter Min Rate ({rules.productBands.two_wheeler.minRate}%)
              </label>
              <input
                type="number"
                className="form-input"
                step="0.5"
                value={rules.productBands.two_wheeler.minRate}
                onChange={(e) => handleProductRateChange('two_wheeler', 'minRate', e.target.value)}
              />
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--border-color)', paddingTop: '1rem' }}>
          <button className="btn btn-secondary" onClick={handleReset}>
            <RefreshCw size={16} />
            <span>Reset Rules to Default</span>
          </button>
          <button className="btn btn-primary" onClick={onClose}>
            <Check size={16} />
            <span>Apply & Close</span>
          </button>
        </div>

      </div>
    </div>
  );
}
