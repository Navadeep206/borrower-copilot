import React from 'react';
import { QUESTION_SCHEMA } from '../engine/questions.js';
import { ChevronRight, AlertCircle } from 'lucide-react';
import SpotlightCard from './bits/SpotlightCard.jsx';
import ShinyText from './bits/ShinyText.jsx';

export default function DynamicQuestionnaire({ answers, setAnswers }) {
  const handleChange = (fieldId, value) => {
    setAnswers(prev => ({ ...prev, [fieldId]: value }));
  };

  const renderField = (q) => {
    const rawVal = answers[q.id];

    if (q.type === 'radio') {
      return (
        <div className="radio-grid">
          {q.options.map(opt => {
            const isSelected = String(rawVal) === String(opt.value);
            return (
              <div
                key={opt.value}
                className={`radio-option ${isSelected ? 'selected' : ''}`}
                onClick={() => handleChange(q.id, opt.value)}
              >
                {opt.label}
              </div>
            );
          })}
        </div>
      );
    }

    if (q.type === 'select') {
      return (
        <select
          className="form-select"
          value={rawVal !== undefined ? rawVal : ''}
          onChange={(e) => {
            const val = e.target.value;
            const numVal = Number(val);
            handleChange(q.id, !isNaN(numVal) && val !== '' ? numVal : val);
          }}
        >
          <option value="">— Select —</option>
          {q.options.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      );
    }

    if (q.type === 'currency' || q.type === 'number') {
      return (
        <div style={{ position: 'relative' }}>
          {q.type === 'currency' && (
            <span style={{
              position: 'absolute', left: '0.7rem', top: '50%', transform: 'translateY(-50%)',
              color: 'var(--gold)', fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: '0.9rem',
              pointerEvents: 'none'
            }}>₹</span>
          )}
          <input
            type="number"
            className="form-input"
            placeholder={q.placeholder}
            min={q.min || 0}
            max={q.max}
            value={rawVal !== undefined ? rawVal : ''}
            onChange={(e) => {
              const val = e.target.value;
              handleChange(q.id, val === '' ? '' : Number(val));
            }}
            style={q.type === 'currency' ? { paddingLeft: '1.6rem' } : {}}
          />
        </div>
      );
    }

    return (
      <input
        type="text"
        className="form-input"
        placeholder={q.placeholder}
        value={rawVal || ''}
        onChange={(e) => handleChange(q.id, e.target.value)}
      />
    );
  };

  const applicableTier2 = QUESTION_SCHEMA.tier2.filter(q =>
    !q.condition || q.condition(answers)
  );

  const tier1Answered = QUESTION_SCHEMA.tier1.filter(q => answers[q.id] !== undefined && answers[q.id] !== '').length;
  const tier1Total = QUESTION_SCHEMA.tier1.length;
  const completionPct = Math.round((tier1Answered / tier1Total) * 100);

  return (
    <SpotlightCard
      spotlightColor="rgba(245, 197, 24, 0.08)"
      borderColor="rgba(245, 197, 24, 0.25)"
      style={{
        background: 'var(--dark-2)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-lg)',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Gold left edge */}
      <div style={{
        position: 'absolute', top: 0, left: 0, bottom: 0, width: '2px',
        background: 'linear-gradient(180deg, var(--gold) 0%, var(--gold-dark) 40%, transparent 100%)',
        zIndex: 4
      }} />

      {/* Header */}
      <div style={{ padding: '1.1rem 1.25rem 0.9rem', borderBottom: '1px solid var(--border-dim)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.6rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <ChevronRight size={18} color="var(--gold)" />
            <span style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-primary)' }}>
              <ShinyText color="var(--text-primary)" shineColor="var(--gold)" speed={3}>
                Borrower Profile Intake
              </ShinyText>
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.78rem', color: completionPct === 100 ? 'var(--jade)' : 'var(--gold)', fontWeight: 700 }}>
              {completionPct}%
            </span>
            <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', fontFamily: 'var(--font-display)', textTransform: 'uppercase', letterSpacing: '0.07em' }}>
              complete
            </span>
          </div>
        </div>

        {/* Progress bar */}
        <div style={{ height: '3px', background: 'var(--dark-5)', borderRadius: '9999px', overflow: 'hidden' }}>
          <div style={{
            height: '100%',
            width: `${completionPct}%`,
            background: 'linear-gradient(90deg, var(--gold) 0%, var(--gold-bright) 100%)',
            borderRadius: '9999px',
            boxShadow: '0 0 6px var(--gold-glow)',
            transition: 'width 0.4s cubic-bezier(0.16,1,0.3,1)'
          }} />
        </div>
      </div>

      {/* Form body */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '1.1rem 1.25rem', paddingLeft: '1.4rem' }}>

        {/* Tier 1 */}
        <div style={{ marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.9rem' }}>
            <span style={{ fontFamily: 'var(--font-display)', fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--gold)' }}>
              TIER 1 — Core Parameters
            </span>
            <div style={{ flex: 1, height: '1px', background: 'linear-gradient(90deg, var(--gold-dark), transparent)' }} />
          </div>

          {QUESTION_SCHEMA.tier1.map(q => (
            <div key={q.id} className="form-group">
              <label className="form-label">
                {q.label}
                {q.required && <span style={{ color: 'var(--gold)', marginLeft: '0.25rem' }}>*</span>}
              </label>
              {renderField(q)}
            </div>
          ))}
        </div>

        {/* Tier 2 */}
        {applicableTier2.length > 0 && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.9rem' }}>
              <span style={{ fontFamily: 'var(--font-display)', fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--text-muted)' }}>
                TIER 2 — Adaptive Intelligence
              </span>
              <div style={{ flex: 1, height: '1px', background: 'linear-gradient(90deg, var(--border), transparent)' }} />
            </div>

            <div style={{ padding: '0.6rem 0.8rem', borderRadius: 'var(--radius-sm)', background: 'var(--gold-bg)', border: '1px solid var(--border-gold)', marginBottom: '0.9rem', display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              <AlertCircle size={13} color="var(--gold)" style={{ flexShrink: 0 }} />
              <span style={{ fontSize: '0.73rem', color: 'var(--gold)', fontFamily: 'var(--font-display)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                These questions tighten your rate band precision
              </span>
            </div>

            {applicableTier2.map(q => (
              <div key={q.id} className="form-group">
                <label className="form-label">{q.label}</label>
                {renderField(q)}
              </div>
            ))}
          </div>
        )}
      </div>
    </SpotlightCard>
  );
}
