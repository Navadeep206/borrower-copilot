import React from 'react';
import { ShieldAlert, Sliders, FileText, Sun, Moon, HelpCircle } from 'lucide-react';

export default function Navbar({ theme, setTheme, onOpenRules, onOpenSandbox }) {
  return (
    <header className="glass-card no-print" style={{ padding: '1rem 1.5rem', marginBottom: '1.5rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
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
            fontSize: '1.3rem'
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

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
          <button 
            className="btn btn-secondary" 
            onClick={onOpenSandbox}
            title="Live Rule Sandbox (Built for Follow-up Interview)"
            style={{ fontSize: '0.85rem', padding: '0.5rem 0.9rem' }}
          >
            <Sliders size={16} color="var(--accent-amber)" />
            <span>Rule Sandbox</span>
          </button>

          <button 
            className="btn btn-secondary" 
            onClick={onOpenRules}
            title="Inspect Financial Rules & Baselines (RULES.md)"
            style={{ fontSize: '0.85rem', padding: '0.5rem 0.9rem' }}
          >
            <FileText size={16} color="var(--accent-cyan)" />
            <span>RULES.md</span>
          </button>

          <button 
            className="btn btn-secondary" 
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            title="Toggle Light/Dark Theme"
            style={{ padding: '0.5rem 0.7rem' }}
          >
            {theme === 'dark' ? <Sun size={18} color="var(--accent-amber)" /> : <Moon size={18} color="var(--accent-purple)" />}
          </button>
        </div>
      </div>
    </header>
  );
}
