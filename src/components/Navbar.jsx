import React from 'react';
import { Sliders, FileText, Sun, Moon } from 'lucide-react';
import Aurora from './bits/Aurora.jsx';
import MagnetButton from './bits/MagnetButton.jsx';

export default function Navbar({ theme, setTheme, onOpenRules, onOpenSandbox }) {
  return (
    <header className="no-print" style={{ marginBottom: '1.5rem' }}>
      <Aurora
        colorStops={theme === 'dark' ? ['#0284C7', '#7C3AED', '#06B6D4'] : ['#93C5FD', '#C4B5FD', '#67E8F9']}
        amplitude={0.7}
        speed={0.6}
        style={{
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--border-color)',
          boxShadow: 'var(--shadow-subtle)',
          background: 'var(--bg-surface)'
        }}
      >
        <div style={{ padding: '1rem 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          {/* Brand / Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{
              width: '42px',
              height: '42px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #0284C7, #7E22CE)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontWeight: '800',
              fontSize: '1.3rem',
              boxShadow: '0 4px 16px rgba(2, 132, 199, 0.45)',
              flexShrink: 0
            }}>
              BC
            </div>
            <div>
              <h1 style={{ fontSize: '1.25rem', fontWeight: '800', margin: 0, lineHeight: 1.1 }}>
                Borrower <span style={{ color: 'var(--accent-cyan)' }}>Copilot</span>
              </h1>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: 0 }}>
                Indian Credit Self-Assessment & Lender Negotiation Assistant
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
            <MagnetButton
              className="btn btn-secondary"
              onClick={onOpenSandbox}
              title="Live Rule Sandbox"
              style={{ fontSize: '0.85rem', padding: '0.5rem 0.9rem' }}
            >
              <Sliders size={16} color="var(--accent-amber)" />
              <span>Rule Sandbox</span>
            </MagnetButton>

            <MagnetButton
              className="btn btn-secondary"
              onClick={onOpenRules}
              title="Inspect Financial Rules (RULES.md)"
              style={{ fontSize: '0.85rem', padding: '0.5rem 0.9rem' }}
            >
              <FileText size={16} color="var(--accent-cyan)" />
              <span>RULES.md</span>
            </MagnetButton>

            <MagnetButton
              className="btn btn-secondary"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              title="Toggle Theme"
              style={{ padding: '0.5rem 0.7rem' }}
            >
              {theme === 'dark' ? <Sun size={18} color="var(--accent-amber)" /> : <Moon size={18} color="var(--accent-purple)" />}
            </MagnetButton>
          </div>
        </div>
      </Aurora>
    </header>
  );
}
