import React, { useRef } from 'react';
import StressTestSlider from './StressTestSlider.jsx';
import NegotiationCard from './NegotiationCard.jsx';
import CountUp from './bits/CountUp.jsx';
import BlurReveal from './bits/BlurReveal.jsx';
import SpotlightCard from './bits/SpotlightCard.jsx';
import DecryptedText from './bits/DecryptedText.jsx';
import ShinyText from './bits/ShinyText.jsx';
import StarBorder from './bits/StarBorder.jsx';
import {
  ShieldCheck, TrendingUp, DollarSign, Percent, Sparkles,
  AlertTriangle, CheckCircle2, XCircle, RotateCcw, ArrowUpRight,
  ArrowDownRight, Activity, Zap, Lock, ShieldAlert, Cpu
} from 'lucide-react';

/* ─── helpers ──────────────────────────────────────────────────── */
function verdictMeta(verdict) {
  switch (verdict) {
    case 'borrow':
      return {
        icon: CheckCircle2,
        label: 'APPROVED TO BORROW',
        color: 'var(--jade)',
        bg: 'var(--dark-2)',
        border: 'rgba(34,201,132,0.3)',
        glow: 'var(--shadow-jade)',
        beamColor: 'var(--jade)',
        spotlight: 'rgba(34,201,132,0.12)',
        cls: 'green',
        dot: 'green'
      };
    case 'borrow_less':
      return {
        icon: AlertTriangle,
        label: 'BORROW LESS / CAP EXPOSURE',
        color: 'var(--amber)',
        bg: 'var(--dark-2)',
        border: 'rgba(246,166,35,0.3)',
        glow: 'var(--shadow-amber)',
        beamColor: 'var(--amber)',
        spotlight: 'rgba(246,166,35,0.12)',
        cls: 'amber',
        dot: 'amber'
      };
    case 'refinance':
      return {
        icon: RotateCcw,
        label: 'REFINANCE HIGH-COST DEBT FIRST',
        color: 'var(--amber)',
        bg: 'var(--dark-2)',
        border: 'rgba(246,166,35,0.3)',
        glow: 'var(--shadow-amber)',
        beamColor: 'var(--amber)',
        spotlight: 'rgba(246,166,35,0.12)',
        cls: 'amber',
        dot: 'amber'
      };
    default:
      return {
        icon: XCircle,
        label: 'DO NOT BORROW — HIGH DEFAULT RISK',
        color: 'var(--crimson)',
        bg: 'var(--dark-2)',
        border: 'rgba(229,62,62,0.35)',
        glow: 'var(--shadow-crimson)',
        beamColor: 'var(--crimson)',
        spotlight: 'rgba(229,62,62,0.15)',
        cls: 'rose',
        dot: 'rose'
      };
  }
}

function ScoreRing({ pct, color, size = 80, strokeW = 7 }) {
  const r = (size - strokeW * 2) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ * (1 - Math.min(1, pct));
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ transform: 'rotate(-90deg)' }}>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={strokeW} />
      <circle
        cx={size/2} cy={size/2} r={r}
        fill="none" stroke={color} strokeWidth={strokeW}
        strokeLinecap="round"
        strokeDasharray={circ}
        strokeDashoffset={offset}
        style={{ transition: 'stroke-dashoffset 1.2s cubic-bezier(0.16,1,0.3,1)' }}
      />
    </svg>
  );
}

function MiniBar({ value, max, color }) {
  const pct = max > 0 ? Math.min(100, (value / max) * 100) : 0;
  return (
    <div className="compare-bar-track" style={{ marginTop: '0.35rem' }}>
      <div
        className="compare-bar-fill"
        style={{ width: `${pct}%`, background: color }}
      />
    </div>
  );
}

function SectionLabel({ children, accent = 'var(--gold)' }) {
  return (
    <div className="section-label" style={{ marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
      <span className="label-caps" style={{ color: accent, whiteSpace: 'nowrap', letterSpacing: '0.12em' }}>{children}</span>
      <div style={{ flex: 1, height: '1px', background: 'linear-gradient(90deg, var(--border-gold), transparent)' }} />
    </div>
  );
}

/* ─── main component ─────────────────────────────────────────── */
export default function OutputDashboard({ evaluation }) {
  if (!evaluation) return null;

  const {
    verdict, verdictWhy,
    lenderSanctionLimit, safeBorrowerLimit, recommendedUseLimit, limitDifference,
    fairRateBand, allInAPR,
    requestedEMI, safeEMICeiling, safeAvailableForEMI, foirCap,
    productiveAssetROI, confidenceLevel, confidenceReason,
    targetProduct, creditLabel, creditScoreInput,
    netIncome, existingEMIs, livingExpenses, requestedAmount,
    stressCases, talkingPoints, isProductiveAsset
  } = evaluation;

  const vm = verdictMeta(verdict);
  const VerdictIcon = vm.icon;

  // Derived for visuals
  const foirPct = netIncome > 0 ? Math.round(((existingEMIs + requestedEMI) / netIncome) * 100) : 0;
  const foirCapPct = Math.round(foirCap * 100);
  const surplusPct = safeAvailableForEMI > 0 ? Math.min(100, Math.round((requestedEMI / safeAvailableForEMI) * 100)) : 0;
  const rateSpread = (fairRateBand.max - fairRateBand.min).toFixed(1);
  const confidenceColor = confidenceLevel === 'High' ? 'var(--jade)' : confidenceLevel === 'Medium' ? 'var(--gold)' : 'var(--crimson)';
  const confidencePct = confidenceLevel === 'High' ? 0.85 : confidenceLevel === 'Medium' ? 0.55 : 0.28;

  const productMap = {
    personal: 'Personal Loan', lap: 'Loan Against Property', two_wheeler: 'Two-Wheeler / EV Loan',
    business_unsecured: 'Unsecured Business Loan', app_loan: 'App Loan (High-Cost)',
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>

      {/* ═══ ROW 1: VERDICT HERO WITH REACT BITS STARBORDER & SPOTLIGHT ══════ */}
      <BlurReveal delay={0}>
        <StarBorder color={vm.beamColor} speed="3.5s" style={{ borderRadius: 'var(--radius-lg)' }}>
          <SpotlightCard
            spotlightColor={vm.spotlight}
            borderColor={vm.border}
            style={{
              background: vm.bg,
              border: `1px solid ${vm.border}`,
              borderRadius: 'var(--radius-lg)',
              padding: '1.4rem 1.6rem',
              boxShadow: vm.glow,
            }}
          >
            {/* Ambient Batcave scanline / glow effect */}
            <div style={{
              position: 'absolute', top: '-40px', right: '-40px', width: '220px', height: '220px',
              borderRadius: '50%', background: vm.color, filter: 'blur(90px)', opacity: 0.12, pointerEvents: 'none'
            }} />

            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap', position: 'relative' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.9rem' }}>
                <div style={{
                  width: '52px', height: '52px', borderRadius: '12px', background: 'var(--dark-1)',
                  border: `1.5px solid ${vm.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center',
                  boxShadow: `0 0 16px ${vm.spotlight}`, flexShrink: 0
                }}>
                  <VerdictIcon size={28} color={vm.color} />
                </div>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                    <span className="pulse-dot" style={{ background: vm.color, color: vm.color }} />
                    <span style={{ fontSize: '0.72rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--gold)' }}>
                      BATCOMPUTER INTEL • O1 VERDICT
                    </span>
                  </div>
                  <h2 style={{ fontSize: '1.65rem', fontWeight: 900, margin: 0, color: vm.color, letterSpacing: '-0.02em', lineHeight: 1.15, fontFamily: 'var(--font-display)' }}>
                    <DecryptedText
                      text={vm.label}
                      speed={30}
                      maxIterations={16}
                      characters="0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ#$!*%"
                      encryptedClassName="encrypted-text"
                      animateOn="both"
                    />
                  </h2>
                </div>
              </div>

              {/* Confidence ring */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.25rem', flexShrink: 0 }}>
                <div style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
                  <ScoreRing pct={confidencePct} color={confidenceColor} size={68} strokeW={6} />
                  <div style={{ position: 'absolute', textAlign: 'center' }}>
                    <div style={{ fontSize: '0.85rem', fontWeight: 800, fontFamily: 'var(--font-mono)', color: confidenceColor }}>
                      {confidenceLevel === 'High' ? '85%' : confidenceLevel === 'Medium' ? '55%' : '28%'}
                    </div>
                  </div>
                </div>
                <span style={{ fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-secondary)' }}>
                  {confidenceLevel} Confidence
                </span>
              </div>
            </div>

            <p style={{ fontSize: '0.92rem', fontWeight: 600, color: 'var(--text-primary)', margin: '1rem 0 0', lineHeight: 1.55, position: 'relative' }}>
              {verdictWhy}
            </p>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem', position: 'relative' }}>
              <Cpu size={13} color="var(--gold)" />
              <span>{confidenceReason}</span>
            </div>
          </SpotlightCard>
        </StarBorder>
      </BlurReveal>

      {/* ═══ ROW 2: PRODUCT + KEY STATS WITH SPOTLIGHT CARDS ═══════ */}
      <BlurReveal delay={80}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.8rem' }}>

          {/* FOIR Utilization */}
          <SpotlightCard
            className="metric-card"
            spotlightColor="rgba(245, 197, 24, 0.08)"
            borderColor="rgba(245, 197, 24, 0.25)"
          >
            <div className="label-caps" style={{ marginBottom: '0.5rem', color: 'var(--gold)' }}>FOIR Utilization</div>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: '0.4rem', marginBottom: '0.4rem' }}>
              <span className="stat-value md mono-number" style={{ color: foirPct > foirCapPct ? 'var(--crimson)' : foirPct > foirCapPct * 0.85 ? 'var(--amber)' : 'var(--gold)' }}>
                {foirPct}%
              </span>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.2rem' }}>
                / {foirCapPct}% cap
              </span>
            </div>
            <MiniBar
              value={foirPct}
              max={foirCapPct * 1.2}
              color={foirPct > foirCapPct ? 'var(--crimson)' : foirPct > foirCapPct * 0.85 ? 'var(--amber)' : 'linear-gradient(90deg, var(--gold-dark), var(--gold))'}
            />
            <div style={{ fontSize: '0.73rem', color: 'var(--text-secondary)', marginTop: '0.45rem' }}>
              Fixed obligation to income ratio
            </div>
          </SpotlightCard>

          {/* EMI vs Surplus */}
          <SpotlightCard
            className="metric-card"
            spotlightColor="rgba(245, 197, 24, 0.08)"
            borderColor="rgba(245, 197, 24, 0.25)"
          >
            <div className="label-caps" style={{ marginBottom: '0.5rem', color: 'var(--gold)' }}>EMI vs Surplus</div>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: '0.4rem', marginBottom: '0.4rem' }}>
              <span className="stat-value md mono-number" style={{ color: surplusPct > 100 ? 'var(--crimson)' : surplusPct > 80 ? 'var(--amber)' : 'var(--jade)' }}>
                {surplusPct}%
              </span>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.2rem' }}>
                of safe surplus
              </span>
            </div>
            <MiniBar
              value={surplusPct}
              max={130}
              color={surplusPct > 100 ? 'var(--crimson)' : surplusPct > 80 ? 'var(--amber)' : 'linear-gradient(90deg, var(--jade), var(--gold))'}
            />
            <div style={{ fontSize: '0.73rem', color: 'var(--text-secondary)', marginTop: '0.45rem' }}>
              Requested EMI as % of monthly surplus
            </div>
          </SpotlightCard>

          {/* Product Route */}
          <SpotlightCard
            className="metric-card"
            spotlightColor="rgba(245, 197, 24, 0.08)"
            borderColor="rgba(245, 197, 24, 0.25)"
          >
            <div className="label-caps" style={{ marginBottom: '0.5rem', color: 'var(--gold)' }}>Product Route</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', marginBottom: '0.35rem' }}>
              {targetProduct === 'lap' ? <Lock size={16} color="var(--gold)" /> : <Activity size={16} color="var(--gold)" />}
              <span style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1.2 }}>
                {productMap[targetProduct] || targetProduct}
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <span className={`badge badge-${vm.dot}`}>{creditLabel}</span>
            </div>
            <div style={{ fontSize: '0.73rem', color: 'var(--text-secondary)', marginTop: '0.45rem' }}>
              Collateral, profile & risk classification
            </div>
          </SpotlightCard>
        </div>
      </BlurReveal>

      {/* ═══ ROW 3: O2 + O3 + O4 PRIMARY METRICS WITH BATMAN SPOTLIGHT ═══ */}
      <BlurReveal delay={120}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '0.8rem' }}>

          {/* O2: Loan Capacity */}
          <SpotlightCard
            className="metric-card"
            spotlightColor="rgba(245, 197, 24, 0.12)"
            borderColor="rgba(245, 197, 24, 0.35)"
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
              <div className="label-caps" style={{ color: 'var(--gold)' }}>O2 • Loan Capacity</div>
              <DollarSign size={16} color="var(--gold)" />
            </div>

            <div style={{ marginBottom: '0.75rem' }}>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginBottom: '0.15rem' }}>Lender Will Sanction</div>
              <div className="stat-value sm mono-number" style={{ color: 'var(--text-secondary)' }}>
                ₹<CountUp to={lenderSanctionLimit} separator="," duration={900} delay={200} />
              </div>
            </div>

            <div className="divider-gradient" />

            <div style={{ marginBottom: '0.6rem' }}>
              <div style={{ fontSize: '0.72rem', color: 'var(--gold)', fontWeight: 700, marginBottom: '0.15rem' }}>Your Safe Carry Ceiling</div>
              <div className="stat-value lg mono-number">
                <ShinyText color="var(--gold)" shineColor="#FFFFFF" speed={3}>
                  ₹<CountUp to={safeBorrowerLimit} separator="," duration={1100} delay={300} />
                </ShinyText>
              </div>
            </div>

            <MiniBar
              value={safeBorrowerLimit}
              max={lenderSanctionLimit > 0 ? lenderSanctionLimit : safeBorrowerLimit}
              color="linear-gradient(90deg, var(--gold-dark), var(--gold))"
            />

            {limitDifference > 0 && (
              <div style={{ marginTop: '0.5rem', fontSize: '0.73rem', color: 'var(--amber)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                <AlertTriangle size={12} />
                <span>₹{limitDifference.toLocaleString('en-IN')} excess lender offer</span>
              </div>
            )}
          </SpotlightCard>

          {/* O3: Rate Band */}
          <SpotlightCard
            className="metric-card"
            spotlightColor="rgba(245, 197, 24, 0.12)"
            borderColor="rgba(245, 197, 24, 0.35)"
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
              <div className="label-caps" style={{ color: 'var(--gold)' }}>O3 • Fair Rate Band</div>
              <Percent size={16} color="var(--gold)" />
            </div>

            <div style={{ textAlign: 'center', padding: '0.5rem 0', marginBottom: '0.5rem' }}>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>Target Nominal Rate</div>
              <div className="stat-value xl mono-number">
                <ShinyText color="var(--gold)" shineColor="#FFFFFF" speed={3.2}>
                  {fairRateBand.min}–{fairRateBand.max}%
                </ShinyText>
              </div>
              <div style={{ fontSize: '0.73rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
                Midpoint: <span style={{ color: 'var(--gold)', fontWeight: 700 }}>{fairRateBand.midpoint}%</span>
              </div>
            </div>

            <div className="divider" />

            <div className="stat-row">
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>All-in APR (w/ fees)</span>
              <span className="mono-number" style={{ fontSize: '0.88rem', color: 'var(--gold-bright)', fontWeight: 700 }}>
                {allInAPR.min}–{allInAPR.max}%
              </span>
            </div>
            <div className="stat-row">
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Processing Fee Cap</span>
              <span className="mono-number" style={{ fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
                {allInAPR.processingFeePct}% + GST
              </span>
            </div>
            <div className="stat-row">
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Rate Spread</span>
              <span className="mono-number" style={{ fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
                {rateSpread}%
              </span>
            </div>
          </SpotlightCard>

          {/* O4: EMI Ceiling */}
          <SpotlightCard
            className="metric-card"
            spotlightColor="rgba(245, 197, 24, 0.12)"
            borderColor="rgba(245, 197, 24, 0.35)"
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
              <div className="label-caps" style={{ color: 'var(--gold)' }}>O4 • EMI Ceiling</div>
              <TrendingUp size={16} color="var(--gold)" />
            </div>

            <div style={{ marginBottom: '0.5rem' }}>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginBottom: '0.15rem' }}>Safe Monthly EMI Limit</div>
              <div className="stat-value lg mono-number" style={{ color: 'var(--gold)' }}>
                <ShinyText color="var(--gold)" shineColor="#FFFFFF" speed={2.8}>
                  ₹<CountUp to={safeEMICeiling} separator="," duration={1000} delay={200} /><span style={{ fontSize: '1rem', fontWeight: 600 }}>/mo</span>
                </ShinyText>
              </div>
            </div>

            <div className="divider" />

            <div className="stat-row">
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Requested EMI</span>
              <span className="mono-number" style={{
                fontSize: '0.95rem', fontWeight: 700,
                color: requestedEMI <= safeEMICeiling ? 'var(--jade)' : 'var(--crimson)'
              }}>
                ₹<CountUp to={requestedEMI} separator="," duration={900} delay={250} />/mo
              </span>
            </div>
            <div className="stat-row">
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Safe Monthly Surplus</span>
              <span className="mono-number" style={{ fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
                ₹{safeAvailableForEMI.toLocaleString('en-IN')}
              </span>
            </div>

            <MiniBar
              value={requestedEMI}
              max={safeEMICeiling > 0 ? safeEMICeiling * 1.4 : requestedEMI * 1.4}
              color={requestedEMI <= safeEMICeiling
                ? 'linear-gradient(90deg, var(--jade), var(--gold))'
                : 'linear-gradient(90deg, var(--amber), var(--crimson))'}
            />

            <div style={{
              marginTop: '0.5rem', fontSize: '0.73rem',
              color: requestedEMI <= safeEMICeiling ? 'var(--jade)' : 'var(--crimson)',
              display: 'flex', alignItems: 'center', gap: '0.3rem'
            }}>
              {requestedEMI <= safeEMICeiling
                ? <><CheckCircle2 size={12} /> EMI within safe ceiling ✓</>
                : <><XCircle size={12} /> EMI exceeds safe ceiling ✗</>}
            </div>
          </SpotlightCard>
        </div>
      </BlurReveal>

      {/* ═══ ROW 4: CASHFLOW ANALYSIS WITH SPOTLIGHT TILES ═══════════ */}
      <BlurReveal delay={160}>
        <SpotlightCard
          className="glass-card"
          spotlightColor="rgba(245, 197, 24, 0.08)"
          borderColor="rgba(245, 197, 24, 0.2)"
          style={{ padding: '1.3rem' }}
        >
          <SectionLabel accent="var(--gold)">BATCAVE CASHFLOW INTELLIGENCE</SectionLabel>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '0.8rem' }}>
            {[
              { label: 'Net Monthly Income', value: netIncome, color: 'var(--jade)', icon: ArrowUpRight, bar: 100 },
              { label: 'Living Expenses', value: livingExpenses, color: 'var(--crimson)', icon: ArrowDownRight, bar: netIncome > 0 ? (livingExpenses / netIncome) * 100 : 0 },
              { label: 'Existing EMIs', value: existingEMIs, color: 'var(--amber)', icon: ArrowDownRight, bar: netIncome > 0 ? (existingEMIs / netIncome) * 100 : 0 },
              { label: 'Safe EMI Surplus', value: safeAvailableForEMI, color: 'var(--gold)', icon: Activity, bar: netIncome > 0 ? (safeAvailableForEMI / netIncome) * 100 : 0 },
            ].map((item, i) => {
              const Icon = item.icon;
              return (
                <div key={i} style={{
                  padding: '0.85rem',
                  background: 'var(--dark-3)',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--border-dim)',
                  transition: 'border-color 0.2s',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                    <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em' }}>{item.label}</span>
                    <Icon size={14} color={item.color} />
                  </div>
                  <div className="mono-number" style={{ fontSize: '1.1rem', fontWeight: 700, color: item.color, marginBottom: '0.45rem' }}>
                    ₹{item.value.toLocaleString('en-IN')}
                  </div>
                  <MiniBar value={item.bar} max={100} color={item.color} />
                </div>
              );
            })}
          </div>
        </SpotlightCard>
      </BlurReveal>

      {/* ═══ ROW 5: PRODUCTIVE ASSET ROI (conditional) ══════════════ */}
      {productiveAssetROI.expectedIncomeGain > 0 && (
        <BlurReveal delay={180}>
          <SpotlightCard
            spotlightColor="rgba(245, 197, 24, 0.12)"
            borderColor="rgba(245, 197, 24, 0.35)"
            style={{
              background: 'linear-gradient(135deg, rgba(245,197,24,0.06) 0%, rgba(34,201,132,0.04) 100%)',
              border: '1px solid var(--border-gold)',
              borderRadius: 'var(--radius-lg)',
              padding: '1.3rem',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.9rem' }}>
              <div style={{
                width: '36px', height: '36px', borderRadius: '10px', background: 'var(--gold-bg)',
                border: '1px solid var(--border-gold)', display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}>
                <Sparkles size={18} color="var(--gold)" />
              </div>
              <div>
                <div className="label-caps" style={{ color: 'var(--gold)' }}>Productive Asset ROI Analysis</div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>Income-generating loan — net cashflow yield</div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: '0.75rem' }}>
              {[
                { label: 'Monthly Income Gain', value: productiveAssetROI.expectedIncomeGain, color: 'var(--jade)', prefix: '+₹', suffix: '/mo' },
                { label: 'Monthly EMI Cost', value: productiveAssetROI.requestedEMI, color: 'var(--crimson)', prefix: '-₹', suffix: '/mo' },
                {
                  label: 'Net Surplus Cashflow',
                  value: Math.abs(productiveAssetROI.netCashflowDelta ?? 0),
                  color: productiveAssetROI.isCashflowPositive ? 'var(--jade)' : 'var(--crimson)',
                  prefix: productiveAssetROI.isCashflowPositive ? '+₹' : '-₹',
                  suffix: '/mo'
                }
              ].map((item, i) => (
                <div key={i} style={{ textAlign: 'center', padding: '0.85rem', background: 'var(--dark-3)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)' }}>
                  <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.35rem' }}>{item.label}</div>
                  <div className="stat-value md mono-number" style={{ color: item.color }}>
                    {item.prefix}<CountUp to={item.value} separator="," duration={1000} delay={200 + i * 100} />{item.suffix}
                  </div>
                </div>
              ))}
            </div>
          </SpotlightCard>
        </BlurReveal>
      )}

      {/* ═══ ROW 6: STRESS TEST ══════════════════════════════════════ */}
      <BlurReveal delay={200}>
        <StressTestSlider evaluation={evaluation} />
      </BlurReveal>

      {/* ═══ ROW 7: FULL NEGOTIATION CARD ══════════════════════════ */}
      <NegotiationCard evaluation={evaluation} />
    </div>
  );
}
