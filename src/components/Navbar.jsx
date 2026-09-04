import React from 'react';
import { Sliders, FileText, Sun, Moon, Shield } from 'lucide-react';
import MagnetButton from './bits/MagnetButton.jsx';
import ShinyText from './bits/ShinyText.jsx';
import DecryptedText from './bits/DecryptedText.jsx';

export default function Navbar({ theme, setTheme, onOpenRules, onOpenSandbox }) {
  return (
    <header className="no-print" style={{ marginBottom: '1.1rem' }}>
      {/* Gotham Header — dark with gold accent line */}
      <div style={{
        background: 'var(--dark-1)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-lg)',
        padding: '0.9rem 1.5rem',
        position: 'relative',
        overflow: 'hidden',
        boxShadow: '0 4px 24px rgba(0,0,0,0.7), 0 0 0 1px rgba(245,197,24,0.05)'
      }}>
        {/* Gold top edge */}
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, height: '2px',
          background: 'linear-gradient(90deg, transparent 0%, var(--gold) 30%, var(--gold-bright) 50%, var(--gold) 70%, transparent 100%)',
          opacity: 0.7
        }} />

        {/* Ambient glow behind logo */}
        <div style={{
          position: 'absolute', top: '-30px', left: '-30px', width: '200px', height: '120px',
          background: 'radial-gradient(ellipse, rgba(245,197,24,0.06) 0%, transparent 70%)',
          pointerEvents: 'none'
        }} />

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem', position: 'relative' }}>

          {/* Brand */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
            <div style={{
              width: '44px', height: '44px', borderRadius: '10px',
              background: 'linear-gradient(135deg, var(--gold-dark) 0%, var(--gold) 100%)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 4px 16px var(--gold-glow), 0 1px 0 rgba(255,255,255,0.1) inset',
              flexShrink: 0, position: 'relative'
            }}>
              <Shield size={22} color="var(--void)" strokeWidth={2.5} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.4rem' }}>
                <h1 style={{
                  fontFamily: 'var(--font-hero)',
                  fontSize: '1.7rem', fontWeight: 400, margin: 0, lineHeight: 1,
                  letterSpacing: '0.08em',
                }}>
                  <ShinyText color="var(--gold)" shineColor="#FFFFFF" speed={3.5}>
                    BORROWER
                  </ShinyText>
                </h1>
                <h1 style={{
                  fontFamily: 'var(--font-hero)',
                  fontSize: '1.7rem', fontWeight: 400, margin: 0, lineHeight: 1,
                  color: 'var(--text-primary)', letterSpacing: '0.08em'
                }}>
                  COPILOT
                </h1>
              </div>
              <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', margin: 0, letterSpacing: '0.1em', textTransform: 'uppercase', fontFamily: 'var(--font-display)' }}>
                <DecryptedText
                  text="Indian Credit Intelligence & Lender Negotiation System"
                  speed={28}
                  maxIterations={14}
                  animateOn="both"
                />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
            <MagnetButton
              className="btn btn-secondary"
              onClick={onOpenSandbox}
              title="Live Rule Sandbox"
              style={{ fontSize: '0.78rem', padding: '0.45rem 0.85rem', letterSpacing: '0.06em' }}
            >
              <Sliders size={14} color="var(--gold)" />
              <span>Rule Sandbox</span>
            </MagnetButton>

            <MagnetButton
              className="btn btn-secondary"
              onClick={onOpenRules}
              title="Financial Rules"
              style={{ fontSize: '0.78rem', padding: '0.45rem 0.85rem', letterSpacing: '0.06em' }}
            >
              <FileText size={14} color="var(--gold)" />
              <span>RULES.md</span>
            </MagnetButton>

            <MagnetButton
              className="btn btn-secondary"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              title="Toggle Theme"
              style={{ padding: '0.45rem 0.65rem' }}
            >
              {theme === 'dark'
                ? <Sun size={16} color="var(--gold)" />
                : <Moon size={16} color="var(--gold)" />}
            </MagnetButton>
          </div>
        </div>
      </div>
    </header>
  );
}
