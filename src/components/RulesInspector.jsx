import React from 'react';
import { FileText, X } from 'lucide-react';
import { DEFAULT_RULES } from '../engine/rules.js';

export default function RulesInspector({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay no-print" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '900px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <FileText size={22} color="var(--accent-cyan)" />
            <h2 className="title-medium" style={{ margin: 0 }}>
              RULES.md • Financial Rules & Assumptions Registry
            </h2>
          </div>
          <button className="btn btn-secondary" onClick={onClose} style={{ padding: '0.4rem 0.6rem' }}>
            <X size={18} />
          </button>
        </div>

        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>
          Every threshold, formula, band, and assumption used in Borrower Copilot.
        </p>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid var(--border-color)', background: 'var(--bg-surface-elevated)' }}>
                <th style={{ padding: '0.6rem' }}>Rule / Parameter</th>
                <th style={{ padding: '0.6rem' }}>Value</th>
                <th style={{ padding: '0.6rem' }}>Why it matters</th>
                <th style={{ padding: '0.6rem' }}>Source / Basis</th>
              </tr>
            </thead>
            <tbody>
              <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                <td style={{ padding: '0.6rem', fontWeight: '700', color: 'var(--accent-cyan)' }}>FOIR (Salaried)</td>
                <td style={{ padding: '0.6rem' }}>40% - 55%</td>
                <td style={{ padding: '0.6rem' }}>Limits total debt obligations relative to net monthly income.</td>
                <td style={{ padding: '0.6rem' }}>Indian Banking Standard (SBI/HDFC)</td>
              </tr>
              <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                <td style={{ padding: '0.6rem', fontWeight: '700', color: 'var(--accent-cyan)' }}>FOIR (Self-Employed)</td>
                <td style={{ padding: '0.6rem' }}>35% - 45%</td>
                <td style={{ padding: '0.6rem' }}>Buffers against business income volatility.</td>
                <td style={{ padding: '0.6rem' }}>NBFC Policy Standards</td>
              </tr>
              <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                <td style={{ padding: '0.6rem', fontWeight: '700', color: 'var(--accent-cyan)' }}>FOIR (Informal)</td>
                <td style={{ padding: '0.6rem' }}>30% - 40%</td>
                <td style={{ padding: '0.6rem' }}>Strict ceiling for unverified cashflows.</td>
                <td style={{ padding: '0.6rem' }}>MFI / Micro-lending Guidelines</td>
              </tr>
              <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                <td style={{ padding: '0.6rem', fontWeight: '700', color: 'var(--accent-purple)' }}>LAP Max LTV</td>
                <td style={{ padding: '0.6rem' }}>60%</td>
                <td style={{ padding: '0.6rem' }}>Caps Loan Against Property at 60% market value of collateral.</td>
                <td style={{ padding: '0.6rem' }}>RBI Housing & LAP Norms</td>
              </tr>
              <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                <td style={{ padding: '0.6rem', fontWeight: '700', color: 'var(--accent-purple)' }}>Gold Loan LTV</td>
                <td style={{ padding: '0.6rem' }}>75%</td>
                <td style={{ padding: '0.6rem' }}>Statutory LTV cap on gold pledged loans.</td>
                <td style={{ padding: '0.6rem' }}>RBI Master Direction</td>
              </tr>
              <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                <td style={{ padding: '0.6rem', fontWeight: '700', color: 'var(--accent-amber)' }}>Personal Loan Band</td>
                <td style={{ padding: '0.6rem' }}>10.5% - 24.0%</td>
                <td style={{ padding: '0.6rem' }}>Unsecured prime to subprime rate band.</td>
                <td style={{ padding: '0.6rem' }}>Market Rate Benchmarks 2026</td>
              </tr>
              <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                <td style={{ padding: '0.6rem', fontWeight: '700', color: 'var(--accent-amber)' }}>LAP Rate Band</td>
                <td style={{ padding: '0.6rem' }}>9.0% - 14.0%</td>
                <td style={{ padding: '0.6rem' }}>Secured loan rate band.</td>
                <td style={{ padding: '0.6rem' }}>Market Rate Benchmarks 2026</td>
              </tr>
              <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                <td style={{ padding: '0.6rem', fontWeight: '700', color: 'var(--accent-rose)' }}>Unknown Credit Score</td>
                <td style={{ padding: '0.6rem' }}>Modeled as NTC (+3% risk)</td>
                <td style={{ padding: '0.6rem' }}>Unknown is never 300. Avoids unfair default penalty.</td>
                <td style={{ padding: '0.6rem' }}>My Judgement (Domain Rule)</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div style={{ marginTop: '1.25rem', textAlign: 'right' }}>
          <button className="btn btn-primary" onClick={onClose}>
            Close Inspector
          </button>
        </div>
      </div>
    </div>
  );
}
