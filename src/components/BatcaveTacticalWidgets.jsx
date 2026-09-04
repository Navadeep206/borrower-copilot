import React, { useState } from 'react';
import SpotlightCard from './bits/SpotlightCard.jsx';
import ShinyText from './bits/ShinyText.jsx';
import DecryptedText from './bits/DecryptedText.jsx';
import MagnetButton from './bits/MagnetButton.jsx';
import BlurReveal from './bits/BlurReveal.jsx';
import {
  ShieldAlert, CheckCircle2, AlertTriangle, Scale,
  BookOpen, Lock, FileCheck, CheckSquare, Square,
  Zap, ArrowRight, ShieldCheck, Flame
} from 'lucide-react';

export default function BatcaveTacticalWidgets({ evaluation, answers }) {
  const [checkedItems, setCheckedItems] = useState({
    bankStatement: true,
    kfsRequested: true,
    insuranceOptOut: false,
    foreclosureNorms: true,
    directDisbursal: false
  });

  const toggleItem = (id) => {
    setCheckedItems(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const checklistItems = [
    {
      id: 'bankStatement',
      label: '6-Month Bank Statement Clean',
      desc: 'Verify regular salary / business cashflows with no inward cheque bounce penalties.',
    },
    {
      id: 'kfsRequested',
      label: 'Request Key Fact Statement (KFS)',
      desc: 'Mandatory RBI one-page document showing true all-in APR including processing fee & GST.',
    },
    {
      id: 'insuranceOptOut',
      label: 'Opt-Out of Bundled Insurance',
      desc: 'Lenders cannot force credit life insurance or add-ons as a mandatory pre-condition.',
    },
    {
      id: 'foreclosureNorms',
      label: 'Zero Pre-Payment Penalty Check',
      desc: 'RBI mandates 0% foreclosure charges on floating-rate individual retail loans.',
    },
    {
      id: 'directDisbursal',
      label: 'Direct Bank Disbursal Verification',
      desc: 'Funds must route directly from regulated entity (bank/NBFC) to your account.',
    },
  ];

  const completedCount = Object.values(checkedItems).filter(Boolean).length;
  const totalCount = checklistItems.length;
  const readyPct = Math.round((completedCount / totalCount) * 100);

  // Dynamic threat analysis
  const hasAppLoans = Number(answers.highCostAppLoanAmount || answers.outstandingAppLoans || 0) > 0;
  const hasBounces = answers.recentBounces === 'yes' || answers.recentChequeBounce === 'yes';
  const isHighFOIR = evaluation && evaluation.netIncome > 0
    ? ((evaluation.existingEMIs + evaluation.requestedEMI) / evaluation.netIncome) > 0.50
    : false;

  const threats = [];
  if (hasAppLoans) {
    threats.push({
      level: 'CRITICAL',
      title: 'High-Cost App Debt Compounding',
      desc: '30%+ APR digital loans detected. Threat of compounding penalties and aggressive collections.',
      color: 'var(--crimson)'
    });
  }
  if (hasBounces) {
    threats.push({
      level: 'ELEVATED',
      title: 'Recent Bounce Penalty Trap',
      desc: 'Past 6-month repayment bounce triggers 200–350 bps subprime surcharge from mainstream banks.',
      color: 'var(--amber)'
    });
  }
  if (isHighFOIR) {
    threats.push({
      level: 'MODERATE',
      title: 'Severe Cashflow Squeeze (>50% FOIR)',
      desc: 'Fixed monthly obligations consume over half of net earnings, leaving zero emergency cushion.',
      color: 'var(--amber)'
    });
  }
  if (threats.length === 0) {
    threats.push({
      level: 'SECURE',
      title: 'Perimeter Clean: Low Predatory Risk',
      desc: 'No predatory app loans, clean payment history, and sustainable cashflow headroom verified.',
      color: 'var(--jade)'
    });
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '0.2rem' }}>

      {/* ═══ WIDGET 1: PRE-FLIGHT BORROWER CHECKLIST ═══════════════════ */}
      <BlurReveal delay={150}>
        <SpotlightCard
          spotlightColor="rgba(245, 197, 24, 0.1)"
          borderColor="rgba(245, 197, 24, 0.25)"
          style={{
            background: 'var(--dark-2)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-lg)',
            padding: '1.2rem',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          {/* Top header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div style={{
                width: '28px', height: '28px', borderRadius: '7px', background: 'var(--gold-bg)',
                border: '1px solid var(--border-gold)', display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}>
                <CheckSquare size={15} color="var(--gold)" />
              </div>
              <div>
                <h4 style={{ margin: 0, fontSize: '0.88rem', fontWeight: 700, fontFamily: 'var(--font-display)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                  <ShinyText color="var(--text-primary)" shineColor="var(--gold)" speed={3.2}>
                    Pre-Flight Borrower Checklist
                  </ShinyText>
                </h4>
                <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                  Batcave Due Diligence Protocol
                </span>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.25rem' }}>
              <span className="mono-number" style={{ fontSize: '0.95rem', fontWeight: 800, color: readyPct === 100 ? 'var(--jade)' : 'var(--gold)' }}>
                {completedCount}/{totalCount}
              </span>
              <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>Ready</span>
            </div>
          </div>

          {/* Progress bar */}
          <div style={{ height: '3px', background: 'var(--dark-4)', borderRadius: '9999px', overflow: 'hidden', marginBottom: '0.9rem' }}>
            <div style={{
              height: '100%',
              width: `${readyPct}%`,
              background: readyPct === 100 ? 'var(--jade)' : 'linear-gradient(90deg, var(--gold-dark), var(--gold))',
              transition: 'width 0.3s ease',
              boxShadow: '0 0 8px var(--gold-glow)'
            }} />
          </div>

          {/* Checklist items */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
            {checklistItems.map(item => {
              const isChecked = !!checkedItems[item.id];
              return (
                <div
                  key={item.id}
                  onClick={() => toggleItem(item.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '0.65rem',
                    padding: '0.6rem 0.75rem',
                    borderRadius: 'var(--radius-sm)',
                    background: isChecked ? 'rgba(245, 197, 24, 0.04)' : 'var(--dark-3)',
                    border: `1px solid ${isChecked ? 'var(--border-gold)' : 'var(--border-dim)'}`,
                    cursor: 'pointer',
                    transition: 'all 0.18s ease',
                  }}
                >
                  <div style={{ marginTop: '0.15rem', flexShrink: 0 }}>
                    {isChecked
                      ? <CheckSquare size={16} color="var(--gold)" />
                      : <Square size={16} color="var(--text-muted)" />}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{
                      fontSize: '0.78rem',
                      fontWeight: 600,
                      color: isChecked ? 'var(--gold)' : 'var(--text-primary)',
                      lineHeight: 1.25,
                      textDecoration: isChecked ? 'none' : 'none'
                    }}>
                      {item.label}
                    </div>
                    <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', marginTop: '0.2rem', lineHeight: 1.35 }}>
                      {item.desc}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </SpotlightCard>
      </BlurReveal>

      {/* ═══ WIDGET 2: RBI REGULATORY RADAR & FAIR PRACTICES ═══════════ */}
      <BlurReveal delay={200}>
        <SpotlightCard
          spotlightColor="rgba(245, 197, 24, 0.1)"
          borderColor="rgba(245, 197, 24, 0.25)"
          style={{
            background: 'var(--dark-2)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-lg)',
            padding: '1.2rem',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
            <div style={{
              width: '28px', height: '28px', borderRadius: '7px', background: 'rgba(74, 158, 255, 0.1)',
              border: '1px solid rgba(74, 158, 255, 0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              <Scale size={15} color="var(--steel-blue)" />
            </div>
            <div>
              <h4 style={{ margin: 0, fontSize: '0.88rem', fontWeight: 700, fontFamily: 'var(--font-display)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                <ShinyText color="var(--text-primary)" shineColor="var(--steel-blue)" speed={3.5}>
                  RBI Regulatory Shield
                </ShinyText>
              </h4>
              <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                Statutory Rights Every Indian Borrower Has
              </span>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '0.6rem' }}>
            {[
              {
                title: 'Mandatory KFS APR Disclosure',
                rule: 'RBI Master Direction 2024',
                detail: 'Every lender MUST provide a 1-page Key Fact Statement stating total cost of borrowing before loan execution.',
                tag: 'MANDATORY'
              },
              {
                title: 'Zero Pre-Closure Penalty',
                rule: 'RBI Circular DPSS.CO.OD.490',
                detail: 'No foreclosure or prepayment penalty permitted on floating-rate term loans to individual borrowers.',
                tag: '0% FEE'
              },
              {
                title: 'Fair Recovery Practices Code',
                rule: 'Fair Practices Code',
                detail: 'Recovery agents cannot call before 8 AM or after 7 PM, nor threaten contacts or visit workplaces unannounced.',
                tag: 'PROTECTED'
              }
            ].map((reg, i) => (
              <div
                key={i}
                style={{
                  padding: '0.65rem 0.8rem',
                  borderRadius: 'var(--radius-sm)',
                  background: 'var(--dark-3)',
                  border: '1px solid var(--border-dim)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.2rem' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-primary)' }}>{reg.title}</span>
                  <span style={{
                    fontSize: '0.6rem', fontWeight: 800, padding: '0.15rem 0.4rem', borderRadius: '4px',
                    background: 'var(--gold-bg)', color: 'var(--gold)', border: '1px solid var(--border-gold)',
                    fontFamily: 'var(--font-mono)'
                  }}>
                    {reg.tag}
                  </span>
                </div>
                <div style={{ fontSize: '0.65rem', color: 'var(--steel-blue)', fontFamily: 'var(--font-mono)', marginBottom: '0.25rem' }}>
                  {reg.rule}
                </div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', lineHeight: 1.35 }}>
                  {reg.detail}
                </div>
              </div>
            ))}
          </div>
        </SpotlightCard>
      </BlurReveal>

      {/* ═══ WIDGET 3: DEBT TRAP & DEFAULT THREAT MONITOR ═════════════ */}
      <BlurReveal delay={250}>
        <SpotlightCard
          spotlightColor="rgba(245, 197, 24, 0.1)"
          borderColor="rgba(245, 197, 24, 0.25)"
          style={{
            background: 'var(--dark-2)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-lg)',
            padding: '1.2rem',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div style={{
                width: '28px', height: '28px', borderRadius: '7px', background: 'var(--crimson-bg)',
                border: '1px solid rgba(229, 62, 62, 0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}>
                <ShieldAlert size={15} color="var(--crimson)" />
              </div>
              <div>
                <h4 style={{ margin: 0, fontSize: '0.88rem', fontWeight: 700, fontFamily: 'var(--font-display)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                  <ShinyText color="var(--text-primary)" shineColor="var(--crimson)" speed={3}>
                    Debt Trap Hazard Radar
                  </ShinyText>
                </h4>
                <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                  Real-Time Vulnerability Analysis
                </span>
              </div>
            </div>

            <span style={{
              fontSize: '0.65rem', fontWeight: 800, padding: '0.15rem 0.45rem', borderRadius: '4px',
              background: threats[0]?.color === 'var(--jade)' ? 'var(--jade-bg)' : threats[0]?.color === 'var(--amber)' ? 'var(--amber-bg)' : 'var(--crimson-bg)',
              color: threats[0]?.color || 'var(--text-primary)',
              fontFamily: 'var(--font-mono)'
            }}>
              {threats[0]?.level || 'NORMAL'}
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
            {threats.map((threat, idx) => (
              <div
                key={idx}
                style={{
                  padding: '0.75rem 0.85rem',
                  borderRadius: 'var(--radius-sm)',
                  background: 'var(--dark-3)',
                  borderLeft: `3px solid ${threat.color}`,
                  borderTop: '1px solid var(--border-dim)',
                  borderRight: '1px solid var(--border-dim)',
                  borderBottom: '1px solid var(--border-dim)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.2rem' }}>
                  <AlertTriangle size={13} color={threat.color} />
                  <span style={{ fontSize: '0.78rem', fontWeight: 700, color: threat.color, fontFamily: 'var(--font-display)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    {threat.title}
                  </span>
                </div>
                <p style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.4 }}>
                  {threat.desc}
                </p>
              </div>
            ))}
          </div>
        </SpotlightCard>
      </BlurReveal>

    </div>
  );
}
