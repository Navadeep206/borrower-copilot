import React from 'react';
import { QUESTION_SCHEMA } from '../engine/questions.js';
import { HelpCircle, ChevronRight, CheckCircle2 } from 'lucide-react';

export default function DynamicQuestionnaire({ answers, setAnswers }) {
  const handleChange = (fieldId, value) => {
    setAnswers(prev => ({
      ...prev,
      [fieldId]: value
    }));
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
            // Convert numeric values if applicable
            const numVal = Number(val);
            handleChange(q.id, !isNaN(numVal) && val !== '' ? numVal : val);
          }}
        >
          <option value="">-- Select Option --</option>
          {q.options.map(opt => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      );
    }

    if (q.type === 'currency' || q.type === 'number') {
      return (
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
        />
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

  // Filter applicable Tier 2 questions
  const applicableTier2 = QUESTION_SCHEMA.tier2.filter(q => {
    if (!q.condition) return true;
    return q.condition(answers);
  });

  return (
    <div className="glass-card no-print" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem', marginBottom: '1.25rem' }}>
        <h2 className="title-medium" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <ChevronRight size={22} color="var(--accent-cyan)" />
          Borrower Questionnaire
        </h2>
        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0 }}>
          Answers adapt dynamically based on employment & collateral details.
        </p>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', paddingRight: '0.25rem' }}>
        {/* Tier 1 Must Questions */}
        <div style={{ marginBottom: '1.5rem' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--accent-cyan)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
            Tier 1: Core Financial Parameters
          </span>
          <div style={{ marginTop: '0.75rem' }}>
            {QUESTION_SCHEMA.tier1.map(q => (
              <div key={q.id} className="form-group">
                <label className="form-label">
                  {q.label} {q.required && <span style={{ color: 'var(--accent-rose)' }}>*</span>}
                </label>
                {renderField(q)}
              </div>
            ))}
          </div>
        </div>

        {/* Tier 2 Additional Questions */}
        {applicableTier2.length > 0 && (
          <div style={{ borderTop: '1px dashed var(--border-color)', paddingTop: '1.25rem', marginTop: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.75rem' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--accent-purple)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                Tier 2: Adaptive Questions (Tightens Rate Band)
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
    </div>
  );
}
