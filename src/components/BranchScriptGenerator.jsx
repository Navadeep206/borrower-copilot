import React, { useState } from 'react';
import { MessageSquare, Copy, Check } from 'lucide-react';

export default function BranchScriptGenerator({ evaluation }) {
  const [copied, setCopied] = useState(false);

  const { targetProduct, fairRateBand, talkingPoints, rawAnswers } = evaluation;

  const generateScript = () => {
    let scriptLines = [];

    scriptLines.push(`"Hello Manager, I am looking for a ₹${(evaluation.requestedAmount || 0).toLocaleString('en-IN')} loan for ${evaluation.rawAnswers.loanPurpose || 'my financial requirement'}.`);

    if (rawAnswers.creditScore && rawAnswers.creditScore >= 750) {
      scriptLines.push(`I have a verified CIBIL score of ${rawAnswers.creditScore}. According to RBI lending benchmarks, prime profiles qualify for ${fairRateBand.min}% - ${fairRateBand.max}%.`);
    } else if (rawAnswers.creditScore === 'unknown') {
      scriptLines.push(`I am New-to-Credit (NTC), but I have stable income. Please evaluate me under your NTC program pricing without subprime rate penalties.`);
    }

    if (targetProduct === 'lap' && rawAnswers.collateralValue > 0) {
      const ltvPct = (((evaluation.requestedAmount || 0) / rawAnswers.collateralValue) * 100).toFixed(0);
      scriptLines.push(`I am offering unencumbered property worth ₹${(rawAnswers.collateralValue / 100000).toFixed(1)}L as collateral. At ${ltvPct}% LTV, this loan is fully secured, so I expect standard LAP pricing (${fairRateBand.min}%).`);
    }

    if (evaluation.isProductiveAsset && evaluation.productiveAssetROI.expectedIncomeGain > 0) {
      scriptLines.push(`This loan directly generates ₹${evaluation.productiveAssetROI.expectedIncomeGain.toLocaleString('en-IN')}/mo in new income, ensuring 100% EMI coverage surplus.`);
    }

    scriptLines.push(`My target monthly EMI ceiling is ₹${evaluation.safeEMICeiling.toLocaleString('en-IN')}. Please confirm your all-in APR including processing fee."`);

    return scriptLines.join('\n\n');
  };

  const scriptText = generateScript();

  const handleCopy = () => {
    navigator.clipboard.writeText(scriptText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div style={{ background: 'var(--bg-surface-elevated)', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', marginTop: '1.25rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <MessageSquare size={18} color="var(--accent-purple)" />
          <h4 style={{ fontSize: '0.95rem', fontWeight: '700', margin: 0 }}>
            💬 Branch Dialogue Script Generator
          </h4>
        </div>
        <button
          className="btn btn-outline"
          onClick={handleCopy}
          style={{ fontSize: '0.75rem', padding: '0.25rem 0.6rem' }}
        >
          {copied ? <Check size={14} /> : <Copy size={14} />}
          <span>{copied ? 'Copied' : 'Copy Script'}</span>
        </button>
      </div>

      <div style={{
        background: 'var(--bg-surface)',
        padding: '0.9rem',
        borderRadius: 'var(--radius-sm)',
        fontSize: '0.82rem',
        fontFamily: 'var(--font-sans)',
        color: 'var(--text-primary)',
        whiteSpace: 'pre-line',
        borderLeft: '3px solid var(--accent-purple)',
        lineHeight: '1.5'
      }}>
        {scriptText}
      </div>
    </div>
  );
}
