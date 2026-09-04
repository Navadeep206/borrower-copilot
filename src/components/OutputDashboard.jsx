import React, { useRef } from 'react';
import StressTestSlider from './StressTestSlider.jsx';
import NegotiationCard from './NegotiationCard.jsx';
import CountUp from './bits/CountUp.jsx';
import BlurReveal from './bits/BlurReveal.jsx';
import {
  ShieldCheck, TrendingUp, DollarSign, Percent, Sparkles,
  AlertTriangle, CheckCircle2, XCircle, RotateCcw, ArrowUpRight,
  ArrowDownRight, Activity, Zap, Lock
} from 'lucide-react';

/* ─── helpers ──────────────────────────────────────────────────── */
function verdictMeta(verdict) {
  switch (verdict) {
    case 'borrow':       return { icon: CheckCircle2, label: 'APPROVED TO BORROW', color: 'var(--emerald-soft)', bg: 'var(--emerald-bg)', border: 'rgba(16,245,148,0.25)', glow: 'var(--shadow-emerald)', cls: 'green', dot: 'green' };
    case 'borrow_less':  return { icon: AlertTriangle,  label: 'BORROW LESS',         color: 'var(--amber-bright)', bg: 'var(--amber-bg)',   border: 'rgba(245,158,11,0.25)',  glow: 'var(--shadow-amber)',   cls: 'amber', dot: 'amber' };
    case 'refinance':    return { icon: RotateCcw,      label: 'REFINANCE FIRST',     color: 'var(--amber-bright)', bg: 'var(--amber-bg)',   border: 'rgba(245,158,11,0.25)',  glow: 'var(--shadow-amber)',   cls: 'amber', dot: 'amber' };
    default:             return { icon: XCircle,        label: 'DO NOT BORROW',        color: 'var(--rose-soft)',    bg: 'var(--rose-bg)',    border: 'rgba(244,63,94,0.25)',   glow: 'var(--shadow-amber)',   cls: 'rose',  dot: 'rose' };
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

function SectionLabel({ children, accent }) {
  return (
    <div className="section-label">
      <span className="label-caps" style={{ color: accent, whiteSpace: 'nowrap' }}>{children}</span>
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
  const confidenceColor = confidenceLevel === 'High' ? 'var(--emerald-soft)' : confidenceLevel === 'Medium' ? 'var(--cyan)' : 'var(--amber-bright)';
  const confidencePct = confidenceLevel === 'High' ? 0.85 : confidenceLevel === 'Medium' ? 0.55 : 0.28;

  const productMap = {
    personal: 'Personal Loan', lap: 'Loan Against Property', two_wheeler: 'Two-Wheeler / EV Loan',
    business_unsecured: 'Unsecured Business Loan', app_loan: 'App Loan (High-Cost)',
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>

      {/* ═══ ROW 1: VERDICT HERO ═══════════════════════════════════ */}
      <BlurReveal delay={0}>
        <div style={{
          background: vm.bg,
          border: `1px solid ${vm.border}`,
          borderRadius: 'var(--radius-lg)',
          padding: '1.25rem 1.5rem',
          position: 'relative',
          overflow: 'hidden',
          boxShadow: vm.glow
        }}>
          {/* background orb */}
          <div style={{ position:'absolute', top:'-40px', right:'-40px', width:'200px', height:'200px',
            borderRadius:'50%', background: vm.color, filter:'blur(80px)', opacity: 0.12, pointerEvents:'none' }} />

          <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', gap:'1rem', flexWrap:'wrap', position:'relative' }}>
            <div style={{ display:'flex', alignItems:'center', gap:'0.75rem' }}>
              <div style={{ width:'48px', height:'48px', borderRadius:'14px', background: vm.bg,
                border:`1.5px solid ${vm.border}`, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                <VerdictIcon size={24} color={vm.color} />
              </div>
              <div>
                <div style={{ display:'flex', alignItems:'center', gap:'0.5rem', marginBottom:'0.25rem' }}>
                  <span className="pulse-dot" style={{ background: vm.color, color: vm.color }} />
                  <span style={{ fontSize:'0.72rem', fontWeight:800, textTransform:'uppercase', letterSpacing:'0.1em', color: vm.color }}>
                    O1 VERDICT
                  </span>
                </div>
                <h2 style={{ fontSize:'1.5rem', fontWeight:900, margin:0, color: vm.color, letterSpacing:'-0.03em', lineHeight:1 }}>
                  {vm.label}
                </h2>
              </div>
            </div>

            {/* Confidence ring */}
            <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:'0.25rem', flexShrink:0 }}>
              <div style={{ position:'relative', display:'inline-flex', alignItems:'center', justifyContent:'center' }}>
                <ScoreRing pct={confidencePct} color={confidenceColor} size={68} strokeW={6} />
                <div style={{ position:'absolute', textAlign:'center' }}>
                  <div style={{ fontSize:'0.8rem', fontWeight:800, fontFamily:'var(--font-mono)', color: confidenceColor }}>
                    {confidenceLevel === 'High' ? '85%' : confidenceLevel === 'Medium' ? '55%' : '28%'}
                  </div>
                </div>
              </div>
              <span style={{ fontSize:'0.65rem', fontWeight:700, textTransform:'uppercase', letterSpacing:'0.06em', color:'var(--text-muted)' }}>
                {confidenceLevel} Confidence
              </span>
            </div>
          </div>

          <p style={{ fontSize:'0.9rem', fontWeight:600, color:'var(--text-primary)', margin:'0.85rem 0 0', lineHeight:1.5, position:'relative' }}>
            {verdictWhy}
          </p>
          <div style={{ fontSize:'0.75rem', color:'var(--text-muted)', marginTop:'0.4rem', display:'flex', alignItems:'center', gap:'0.4rem', position:'relative' }}>
            <Zap size={12} color='var(--text-muted)' />
            {confidenceReason}
          </div>
        </div>
      </BlurReveal>

      {/* ═══ ROW 2: PRODUCT + KEY STATS ═══════════════════════════ */}
      <BlurReveal delay={80}>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:'0.8rem' }}>

          {/* FOIR Utilization */}
          <div className="metric-card">
            <div className="label-caps" style={{ marginBottom:'0.5rem' }}>FOIR Utilization</div>
            <div style={{ display:'flex', alignItems:'flex-end', gap:'0.4rem', marginBottom:'0.4rem' }}>
              <span className="stat-value md" style={{ color: foirPct > foirCapPct ? 'var(--rose-soft)' : foirPct > foirCapPct * 0.85 ? 'var(--amber-bright)' : 'var(--text-primary)' }}>
                {foirPct}%
              </span>
              <span style={{ fontSize:'0.75rem', color:'var(--text-muted)', marginBottom:'0.2rem' }}>
                / {foirCapPct}% cap
              </span>
            </div>
            <MiniBar
              value={foirPct}
              max={foirCapPct * 1.2}
              color={foirPct > foirCapPct ? 'var(--rose-soft)' : foirPct > foirCapPct * 0.85 ? 'var(--amber)' : 'linear-gradient(90deg,var(--cyan),var(--violet))'}
            />
            <div style={{ fontSize:'0.73rem', color:'var(--text-muted)', marginTop:'0.4rem' }}>
              Fixed obligation to income ratio
            </div>
          </div>

          {/* EMI vs Surplus */}
          <div className="metric-card">
            <div className="label-caps" style={{ marginBottom:'0.5rem' }}>EMI vs Surplus</div>
            <div style={{ display:'flex', alignItems:'flex-end', gap:'0.4rem', marginBottom:'0.4rem' }}>
              <span className="stat-value md" style={{ color: surplusPct > 100 ? 'var(--rose-soft)' : surplusPct > 80 ? 'var(--amber-bright)' : 'var(--emerald-soft)' }}>
                {surplusPct}%
              </span>
              <span style={{ fontSize:'0.75rem', color:'var(--text-muted)', marginBottom:'0.2rem' }}>
                of safe surplus
              </span>
            </div>
            <MiniBar
              value={surplusPct}
              max={130}
              color={surplusPct > 100 ? 'var(--rose-soft)' : surplusPct > 80 ? 'var(--amber)' : 'linear-gradient(90deg,var(--emerald),var(--cyan))'}
            />
            <div style={{ fontSize:'0.73rem', color:'var(--text-muted)', marginTop:'0.4rem' }}>
              Requested EMI as % of monthly surplus
            </div>
          </div>

          {/* Product Route */}
          <div className="metric-card">
            <div className="label-caps" style={{ marginBottom:'0.5rem' }}>Product Route</div>
            <div style={{ display:'flex', alignItems:'center', gap:'0.4rem', marginBottom:'0.35rem' }}>
              {targetProduct === 'lap' ? <Lock size={16} color="var(--cyan)" /> : <Activity size={16} color="var(--violet-soft)" />}
              <span style={{ fontSize:'0.88rem', fontWeight:700, color:'var(--text-primary)', lineHeight:1.2 }}>
                {productMap[targetProduct] || targetProduct}
              </span>
            </div>
            <div style={{ display:'flex', alignItems:'center', gap:'0.4rem' }}>
              <span className={`badge badge-${vm.dot}`}>{creditLabel}</span>
            </div>
            <div style={{ fontSize:'0.73rem', color:'var(--text-muted)', marginTop:'0.45rem' }}>
              Based on purpose, collateral & income type
            </div>
          </div>
        </div>
      </BlurReveal>

      {/* ═══ ROW 3: O2 + O3 + O4 PRIMARY METRICS ═══════════════════ */}
      <BlurReveal delay={120}>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:'0.8rem' }}>

          {/* O2: Loan Capacity */}
          <div className="metric-card" style={{ gridColumn: '1 / 2' }}>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'0.75rem' }}>
              <div className="label-caps">O2 • Loan Capacity</div>
              <DollarSign size={16} color="var(--cyan)" />
            </div>

            <div style={{ marginBottom:'0.75rem' }}>
              <div style={{ fontSize:'0.72rem', color:'var(--text-muted)', marginBottom:'0.15rem' }}>Lender Will Sanction</div>
              <div className="stat-value sm mono-number" style={{ color:'var(--text-secondary)' }}>
                ₹<CountUp to={lenderSanctionLimit} separator="," duration={900} delay={200} />
              </div>
            </div>

            <div className="divider-gradient" />

            <div style={{ marginBottom:'0.6rem' }}>
              <div style={{ fontSize:'0.72rem', color:'var(--emerald-soft)', fontWeight:700, marginBottom:'0.15rem' }}>Your Safe Carry Ceiling</div>
              <div className="stat-value lg mono-number" style={{ color:'var(--emerald-soft)' }}>
                ₹<CountUp to={safeBorrowerLimit} separator="," duration={1100} delay={300} />
              </div>
            </div>

            <MiniBar
              value={safeBorrowerLimit}
              max={lenderSanctionLimit > 0 ? lenderSanctionLimit : safeBorrowerLimit}
              color="linear-gradient(90deg, var(--emerald), var(--cyan))"
            />

            {limitDifference > 0 && (
              <div style={{ marginTop:'0.5rem', fontSize:'0.73rem', color:'var(--amber-bright)', display:'flex', alignItems:'center', gap:'0.3rem' }}>
                <AlertTriangle size={11} />
                ₹{limitDifference.toLocaleString('en-IN')} gap vs lender offer
              </div>
            )}
          </div>

          {/* O3: Rate Band */}
          <div className="metric-card">
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'0.75rem' }}>
              <div className="label-caps">O3 • Fair Rate Band</div>
              <Percent size={16} color="var(--violet-soft)" />
            </div>

            <div style={{ textAlign:'center', padding:'0.5rem 0', marginBottom:'0.5rem' }}>
              <div style={{ fontSize:'0.72rem', color:'var(--text-muted)', marginBottom:'0.25rem' }}>Target Nominal Rate</div>
              <div className="stat-value xl mono-number gradient-text-cyan">
                {fairRateBand.min}–{fairRateBand.max}<span style={{ fontSize:'1.2rem', fontWeight:600 }}>%</span>
              </div>
              <div style={{ fontSize:'0.73rem', color:'var(--text-muted)', marginTop:'0.2rem' }}>
                Midpoint: <span style={{ color:'var(--cyan)', fontWeight:700 }}>{fairRateBand.midpoint}%</span>
              </div>
            </div>

            <div className="divider" />

            <div className="stat-row">
              <span style={{ fontSize:'0.75rem', color:'var(--text-muted)' }}>All-in APR (w/ fees)</span>
              <span className="mono-number" style={{ fontSize:'0.88rem', color:'var(--violet-soft)', fontWeight:700 }}>
                {allInAPR.min}–{allInAPR.max}%
              </span>
            </div>
            <div className="stat-row">
              <span style={{ fontSize:'0.75rem', color:'var(--text-muted)' }}>Processing Fee Cap</span>
              <span className="mono-number" style={{ fontSize:'0.88rem', color:'var(--text-secondary)' }}>
                {allInAPR.processingFeePct}% + GST
              </span>
            </div>
            <div className="stat-row">
              <span style={{ fontSize:'0.75rem', color:'var(--text-muted)' }}>Rate Spread</span>
              <span className="mono-number" style={{ fontSize:'0.88rem', color:'var(--text-secondary)' }}>
                {rateSpread}%
              </span>
            </div>
          </div>

          {/* O4: EMI Ceiling */}
          <div className="metric-card">
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'0.75rem' }}>
              <div className="label-caps">O4 • EMI Ceiling</div>
              <TrendingUp size={16} color="var(--amber)" />
            </div>

            <div style={{ marginBottom:'0.5rem' }}>
              <div style={{ fontSize:'0.72rem', color:'var(--text-muted)', marginBottom:'0.15rem' }}>Safe Monthly EMI Limit</div>
              <div className="stat-value lg mono-number" style={{ color:'var(--amber-bright)' }}>
                ₹<CountUp to={safeEMICeiling} separator="," duration={1000} delay={200} /><span style={{ fontSize:'1rem', fontWeight:600 }}>/mo</span>
              </div>
            </div>

            <div className="divider" />

            <div className="stat-row">
              <span style={{ fontSize:'0.75rem', color:'var(--text-muted)' }}>Requested EMI</span>
              <span className="mono-number" style={{ fontSize:'0.95rem', fontWeight:700,
                color: requestedEMI <= safeEMICeiling ? 'var(--emerald-soft)' : 'var(--rose-soft)' }}>
                ₹<CountUp to={requestedEMI} separator="," duration={900} delay={250} />/mo
              </span>
            </div>
            <div className="stat-row">
              <span style={{ fontSize:'0.75rem', color:'var(--text-muted)' }}>Safe Monthly Surplus</span>
              <span className="mono-number" style={{ fontSize:'0.88rem', color:'var(--text-secondary)' }}>
                ₹{safeAvailableForEMI.toLocaleString('en-IN')}
              </span>
            </div>

            <MiniBar
              value={requestedEMI}
              max={safeEMICeiling > 0 ? safeEMICeiling * 1.4 : requestedEMI * 1.4}
              color={requestedEMI <= safeEMICeiling
                ? 'linear-gradient(90deg, var(--emerald), var(--cyan))'
                : 'linear-gradient(90deg, var(--amber), var(--rose))'}
            />

            <div style={{ marginTop:'0.5rem', fontSize:'0.73rem',
              color: requestedEMI <= safeEMICeiling ? 'var(--emerald-soft)' : 'var(--rose-soft)',
              display:'flex', alignItems:'center', gap:'0.3rem' }}>
              {requestedEMI <= safeEMICeiling
                ? <><CheckCircle2 size={11} /> EMI is within safe ceiling ✓</>
                : <><XCircle size={11} /> EMI exceeds safe ceiling ✗</>}
            </div>
          </div>
        </div>
      </BlurReveal>

      {/* ═══ ROW 4: CASHFLOW ANALYSIS (always shown) ════════════════ */}
      <BlurReveal delay={160}>
        <div className="glass-card" style={{ padding:'1.25rem' }}>
          <SectionLabel accent="var(--violet-soft)">Cashflow Breakdown</SectionLabel>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(160px, 1fr))', gap:'0.8rem' }}>
            {[
              { label: 'Net Monthly Income', value: netIncome, color: 'var(--emerald-soft)', icon: ArrowUpRight, bar: 100 },
              { label: 'Living Expenses',    value: livingExpenses, color: 'var(--rose-soft)', icon: ArrowDownRight, bar: netIncome > 0 ? (livingExpenses/netIncome)*100 : 0 },
              { label: 'Existing EMIs',      value: existingEMIs, color: 'var(--amber-bright)', icon: ArrowDownRight, bar: netIncome > 0 ? (existingEMIs/netIncome)*100 : 0 },
              { label: 'Safe EMI Surplus',   value: safeAvailableForEMI, color: 'var(--cyan)', icon: Activity, bar: netIncome > 0 ? (safeAvailableForEMI/netIncome)*100 : 0 },
            ].map((item, i) => {
              const Icon = item.icon;
              return (
                <div key={i} style={{ padding:'0.75rem', background:'var(--bg-surface-3)', borderRadius:'var(--radius-sm)', border:'1px solid var(--border-dim)' }}>
                  <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'0.3rem' }}>
                    <span style={{ fontSize:'0.7rem', color:'var(--text-muted)', fontWeight:600, textTransform:'uppercase', letterSpacing:'0.06em' }}>{item.label}</span>
                    <Icon size={13} color={item.color} />
                  </div>
                  <div className="mono-number" style={{ fontSize:'1.05rem', fontWeight:700, color: item.color, marginBottom:'0.4rem' }}>
                    ₹{item.value.toLocaleString('en-IN')}
                  </div>
                  <MiniBar value={item.bar} max={100} color={item.color} />
                </div>
              );
            })}
          </div>
        </div>
      </BlurReveal>

      {/* ═══ ROW 5: PRODUCTIVE ASSET ROI (conditional) ══════════════ */}
      {productiveAssetROI.expectedIncomeGain > 0 && (
        <BlurReveal delay={180}>
          <div style={{
            background: 'linear-gradient(135deg, rgba(168,85,247,0.08) 0%, rgba(0,212,255,0.05) 100%)',
            border: '1px solid rgba(168,85,247,0.2)',
            borderRadius: 'var(--radius-lg)',
            padding: '1.25rem',
            position: 'relative',
            overflow: 'hidden'
          }}>
            <div style={{ position:'absolute', top:'-20px', right:'-20px', width:'140px', height:'140px',
              borderRadius:'50%', background:'var(--violet)', filter:'blur(60px)', opacity:0.08, pointerEvents:'none' }} />

            <div style={{ display:'flex', alignItems:'center', gap:'0.6rem', marginBottom:'0.85rem' }}>
              <div style={{ width:'34px', height:'34px', borderRadius:'10px', background:'var(--violet-bg)',
                border:'1px solid rgba(168,85,247,0.3)', display:'flex', alignItems:'center', justifyContent:'center' }}>
                <Sparkles size={17} color="var(--violet-soft)" />
              </div>
              <div>
                <div className="label-caps" style={{ color:'var(--violet-soft)' }}>Productive Asset ROI Analysis</div>
                <div style={{ fontSize:'0.78rem', color:'var(--text-muted)' }}>Income-generating loan — net cashflow calculation</div>
              </div>
            </div>

            <div style={{ display:'grid', gridTemplateColumns:'repeat(3, 1fr)', gap:'0.75rem' }}>
              {[
                { label: 'Monthly Income Gain', value: productiveAssetROI.expectedIncomeGain, color: 'var(--emerald-soft)', prefix: '+₹', suffix: '/mo' },
                { label: 'Monthly EMI Cost',    value: productiveAssetROI.requestedEMI,       color: 'var(--rose-soft)',    prefix: '-₹', suffix: '/mo' },
                {
                  label: 'Net Surplus Cashflow',
                  value: Math.abs(productiveAssetROI.netCashflowDelta ?? 0),
                  color: productiveAssetROI.isCashflowPositive ? 'var(--emerald-soft)' : 'var(--rose-soft)',
                  prefix: productiveAssetROI.isCashflowPositive ? '+₹' : '-₹',
                  suffix: '/mo'
                }
              ].map((item, i) => (
                <div key={i} style={{ textAlign:'center', padding:'0.75rem', background:'rgba(255,255,255,0.03)', borderRadius:'var(--radius-sm)', border:'1px solid rgba(255,255,255,0.06)' }}>
                  <div style={{ fontSize:'0.7rem', color:'var(--text-muted)', fontWeight:600, textTransform:'uppercase', letterSpacing:'0.06em', marginBottom:'0.3rem' }}>{item.label}</div>
                  <div className="stat-value md mono-number" style={{ color: item.color }}>
                    {item.prefix}<CountUp to={item.value} separator="," duration={1000} delay={200 + i * 100} />{item.suffix}
                  </div>
                </div>
              ))}
            </div>
          </div>
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
