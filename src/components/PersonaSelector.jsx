import React from 'react';
import { PERSONAS } from '../engine/personas.js';
import { UserCheck, Sparkles } from 'lucide-react';

export default function PersonaSelector({ activePersonaId, onSelectPersona, onResetCustom }) {
  return (
    <div className="glass-card no-print" style={{ marginBottom: '1.5rem', background: 'var(--bg-surface-elevated)' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Sparkles size={20} color="var(--accent-amber)" />
          <h3 style={{ fontSize: '1.05rem', fontWeight: '700', margin: 0 }}>
            Test Personas (1-Click Run-Throughs)
          </h3>
        </div>
        <button 
          className="btn btn-outline" 
          onClick={onResetCustom}
          style={{ fontSize: '0.8rem', padding: '0.3rem 0.75rem' }}
        >
          Reset to Blank Form
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem' }}>
        {PERSONAS.map((p) => {
          const isSelected = activePersonaId === p.id;
          return (
            <div
              key={p.id}
              onClick={() => onSelectPersona(p)}
              style={{
                border: isSelected ? '2px solid var(--accent-cyan)' : '1px solid var(--border-color)',
                borderRadius: 'var(--radius-md)',
                padding: '1rem',
                cursor: 'pointer',
                background: isSelected ? 'var(--accent-cyan-bg)' : 'var(--bg-surface)',
                transition: 'all 0.2s ease',
                position: 'relative'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.4rem' }}>
                <span style={{ fontSize: '1.5rem' }}>{p.avatar}</span>
                <div>
                  <h4 style={{ fontSize: '1rem', fontWeight: '700', margin: 0, lineHeight: 1.2 }}>
                    {p.name}, {p.age}
                  </h4>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    {p.location} • {p.tag}
                  </span>
                </div>
                {isSelected && (
                  <span style={{ marginLeft: 'auto' }}>
                    <UserCheck size={18} color="var(--accent-cyan)" />
                  </span>
                )}
              </div>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.35 }}>
                {p.story}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
