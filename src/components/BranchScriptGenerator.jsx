import React, { useState } from 'react';
import { MessageSquare, Copy, Check } from 'lucide-react';
import MagnetButton from './bits/MagnetButton.jsx';

export default function BranchScriptGenerator({ evaluation }) {
  const [copied, setCopied] = useState(false);

  // FIX: Use normalized creditScoreInput from evaluation, not rawAnswers.creditScore
  // rawAnswers.creditScore could be string "780" or number 780 depending on select handling
  const { targetProduct, fairRateBand, talkingPoints, rawAnswers, creditScoreInput } = evaluation;

  const purposeLabels = {
    personal: 'personal use',
    wedding: 'a wedding',
    business: 'business working capital',
    vehicle: 'a delivery scooter / vehicle',
    scooter: 'an electric delivery scooter',
    debt_consolidation: 'debt refinancing / consolidation'
  };

  const generateScript = () => {
    const scriptLines = [];
    const purposeText = purposeLabels[rawAnswers.loanPurpose] || rawAnswers.loanPurpose || 'my financial requirement';

    scriptLines.push(`"Hello Manager, I am looking for a ₹${(evaluation.requestedAmount || 0).toLocaleString('en-IN')} loan for ${purposeText}.`);

    // FIX: Use creditScoreInput (number or 'unknown') from evaluation — pre-normalized
    if (typeof creditScoreInput === 'number' && creditScoreInput >= 750) {
      scriptLines.push(`I have a verified CIBIL score of ${creditScoreInput}. According to RBI lending benchmarks, prime profiles qualify for ${fairRateBand.min}% - ${fairRateBand.max}%.`);
    } else if (typeof creditScoreInput === 'number' && creditScoreInput >= 700) {
      scriptLines.push(`My CIBIL score of ${creditScoreInput} qualifies me for near-prime pricing. I expect rates in the ${fairRateBand.min}% - ${fairRateBand.max}% range.`);
    } else if (creditScoreInput === 'unknown') {
      scriptLines.push(`I am New-to-Credit (NTC), but I have stable income. Please evaluate me under your NTC program pricing without subprime rate penalties.`);
    }

    if (targetProduct === 'lap' && Number(rawAnswers.collateralValue) > 0) {
      const colVal = Number(rawAnswers.collateralValue);
      const ltvPct = (((evaluation.requestedAmount || 0) / colVal) * 100).toFixed(0);
      scriptLines.push(`I am offering unencumbered property worth ₹${(colVal / 100000).toFixed(1)}L as collateral. At ${ltvPct}% LTV, this loan is fully secured — I expect standard LAP pricing (${fairRateBand.min}%).`);
    }

    if (evaluation.isProductiveAsset && evaluation.productiveAssetROI.expectedIncomeGain > 0) {
      scriptLines.push(`This loan directly generates ₹${evaluation.productiveAssetROI.expectedIncomeGain.toLocaleString('en-IN')}/mo in new income, ensuring 100% EMI coverage with positive surplus.`);
    }

    scriptLines.push(`My safe monthly EMI ceiling is ₹${evaluation.safeEMICeiling.toLocaleString('en-IN')}. Please confirm your all-in APR including processing fee."`); 

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
          <MessageSquare size={18} color="var(--gold)" />
          <h4 style={{ fontSize: '0.95rem', fontWeight: '700', margin: 0, color: 'var(--text-primary)', fontFamily: 'var(--font-display)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            💬 Branch Dialogue Script Generator
          </h4>
        </div>
        <MagnetButton
          className="btn btn-outline"
          onClick={handleCopy}
          style={{ fontSize: '0.75rem', padding: '0.25rem 0.6rem' }}
          strength={0.3}
        >
          {copied ? <Check size={14} color="var(--jade)" /> : <Copy size={14} color="var(--gold)" />}
          <span>{copied ? 'Copied' : 'Copy Script'}</span>
        </MagnetButton>
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
