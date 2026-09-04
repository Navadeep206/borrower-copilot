import React from 'react';
import { PERSONAS } from '../engine/personas.js';
import { UserCheck, Zap, RotateCcw } from 'lucide-react';

const verdictColor = {
  borrow: 'var(--jade)',
  borrow_less: 'var(--amber)',
  refinance: 'var(--amber)',
  "don't_borrow": 'var(--crimson)',
};

export default function PersonaSelector({ activePersonaId, onSelectPersona, onResetCustom }) {
  return (
    <div style={{
      background: 'var(--dark-1)',
      border: '1px solid var(--border)',
      borderRadius: 'var(--radius-lg)',
      padding: '1rem 1.25rem',
      marginBottom: '1.1rem',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Gold bottom edge */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0, height: '1px',
        background: 'linear-gradient(90deg, transparent, var(--gold-dark), transparent)'
      }} />

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.85rem', flexWrap: 'wrap', gap: '0.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Zap size={16} color="var(--gold)" />
          <span style={{ fontFamily: 'var(--font-display)', fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--gold)' }}>
            Quick Test Profiles
          </span>
          <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontFamily: 'var(--font-display)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
            — Select to auto-fill questionnaire
          </span>
        </div>
        <button
          className="btn btn-outline"
          onClick={onResetCustom}
          style={{ fontSize: '0.72rem', padding: '0.3rem 0.65rem' }}
        >
          <RotateCcw size={12} />
          Reset
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '0.7rem' }}>
        {PERSONAS.map((p) => {
          const isSelected = activePersonaId === p.id;
          return (
            <div
              key={p.id}
              className={`persona-card ${isSelected ? 'active' : ''}`}
              onClick={() => onSelectPersona(p)}
            >
              {/* Selected indicator */}
              {isSelected && (
                <div style={{
                  position: 'absolute', top: 0, left: 0, right: 0, height: '2px',
                  background: 'linear-gradient(90deg, transparent, var(--gold), transparent)'
                }} />
              )}

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.4rem', position: 'relative' }}>
                <div style={{
                  width: '38px', height: '38px', borderRadius: '10px', flexShrink: 0,
                  background: isSelected ? 'var(--gold-bg)' : 'var(--dark-4)',
                  border: `1px solid ${isSelected ? 'var(--border-gold)' : 'var(--border)'}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '1.3rem'
                }}>
                  {p.avatar}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <h4 style={{ fontSize: '0.92rem', fontWeight: 700, margin: 0, color: isSelected ? 'var(--gold)' : 'var(--text-primary)', fontFamily: 'var(--font-display)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                      {p.name}, {p.age}
                    </h4>
                    {isSelected && <UserCheck size={15} color="var(--gold)" />}
                  </div>
                  <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', fontFamily: 'var(--font-display)', textTransform: 'uppercase', letterSpacing: '0.07em' }}>
                    {p.location} · {p.tag}
                  </div>
                </div>
              </div>

              <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.4, position: 'relative' }}>
                {p.story}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
