import React, { useRef, useEffect, useState } from 'react';
import { Activity, AlertTriangle, ShieldCheck, Gavel, Play, Square, RotateCcw, ChevronDown } from 'lucide-react';
import { AVAILABLE_THEMES } from '../data/conversationData.js';

// CSS מוזרק (נשאר בתוך הקומפוננטה בלבד): סרגל גלילה דק, אנימציית נקודת "שידור חי",
// ופריסה רספונסיבית מעודכנת.
const SIM_CSS = `
.sim-breakout { width: 100%; max-width: 1200px; margin: 0 auto; }
.sim-layout { display: flex; flex-direction: column; gap: 16px; }

/* Desktop */
@media (min-width: 1025px) {
  .sim-layout { flex-direction: row !important; align-items: stretch; }
  .sim-chat { flex: 0 0 60%; max-width: 60%; }
  .sim-side { flex: 0 0 40%; max-width: 40%; }
}

/* Tablet */
@media (max-width: 1024px) and (min-width: 768px) {
  .panel-card { padding: 16px !important; }
}

/* Mobile */
@media (max-width: 767px) {
  .panel-card { padding: 16px !important; }
  .phase-bar { display: grid !important; grid-template-columns: 1fr 1fr; }
  .judge-card-chips { flex-direction: column !important; align-items: flex-start; gap: 8px; }
  h2 { font-size: 18px !important; }
  .chat-body { font-size: 14px; }
}

.phase-bar { display: flex; flex-wrap: nowrap; overflow: hidden; border-bottom: 1px solid var(--border-subtle); background: rgba(255,255,255,0.01); }
.phase-block { flex: 1 1 0; min-width: 0; }
.sim-chat { min-width: 0; display: flex; position: relative; }
.demo-button { position: absolute; top: 12px; right: 12px; z-index: 10; }
.sim-side { min-width: 0; display: flex; flex-direction: column; gap: 12px; }
.sim-scroll { scrollbar-width: thin; scrollbar-color: var(--border-subtle) transparent; }
.sim-scroll::-webkit-scrollbar { width: 4px; }
.sim-scroll::-webkit-scrollbar-thumb { background: var(--border-subtle); border-radius: 2px; }
.sim-scroll::-webkit-scrollbar-track { background: transparent; }
@keyframes liveDotPulse { 0%, 100% { opacity: 1; transform: scale(1); } 50% { opacity: 0.3; transform: scale(0.6); } }
`;

function TypewriterText({ text, onDone }) {
  const [count, setCount] = useState(0);
  const tokens = (text || '').split(/(\s+)/);
  const doneRef = useRef(false);

  useEffect(() => {
    if (count >= tokens.length) {
      if (!doneRef.current) {
        doneRef.current = true;
        onDone?.();
      }
      return;
    }
    const id = setTimeout(() => setCount(c => c + 1), 28);
    return () => clearTimeout(id);
  }, [count, tokens.length]);

  return <span>{tokens.slice(0, count).join('')}</span>;
}

function JudgeCard({ scores = {}, justifications = {}, t }) {
  const [open, setOpen] = useState({});
  const metrics = [
    { key: 'dcs', label: 'DCS', Icon: Activity, color: 'var(--clr-ai)' },
    { key: 'hes', label: 'HES', Icon: AlertTriangle, color: 'var(--clr-harm)' },
    { key: 'sis', label: 'SIS', Icon: ShieldCheck, color: 'var(--clr-safe)' },
  ];

  const hasScore = (key) => scores?.[key] !== undefined && scores?.[key] !== null;
  const hasReason = (key) => {
    const r = justifications?.[key];
    return typeof r === 'string' && r.trim() !== '';
  };

  const shownMetrics = metrics.filter(m => hasScore(m.key));
  const reasonMetrics = shownMetrics.filter(m => hasReason(m.key));

  if (shownMetrics.length === 0 && reasonMetrics.length === 0) return null;

  const toggle = (key) => setOpen(o => ({ ...o, [key]: !o[key] }));

  return (
    <div className="judge-card">
      <div className="judge-card-title">
        <Gavel size={13} />
        <span>{t('judge_title')}</span>
      </div>

      {shownMetrics.length > 0 && (
        <div className="judge-card-chips">
          {shownMetrics.map(({ key, label, Icon, color }) => {
            const reason = hasReason(key);
            const isOpen = !!open[key];
            return (
              <div className="judge-chip" key={key}>
                <Icon size={14} style={{ color }} />
                <span className="judge-chip-label">{label}</span>
                <span className="judge-chip-value" style={{ color }}>{scores[key]}</span>
                {reason && (
                  <button
                    onClick={() => toggle(key)}
                    title={isOpen ? 'הסתר נימוק' : 'הצג נימוק'}
                    style={{ display: 'flex', alignItems: 'center', background: 'transparent', border: 'none', padding: 0, cursor: 'pointer', color: 'var(--text-secondary)' }}
                  >
                    <ChevronDown size={14} style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.25s ease' }} />
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}

      {reasonMetrics.length > 0 && (
        <div style={{ marginTop: '6px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {reasonMetrics.map(({ key, label, color }) => {
            const isOpen = !!open[key];
            return (
              <div key={key} style={{ maxHeight: isOpen ? '500px' : '0', overflow: 'hidden', transition: 'max-height 0.3s ease' }}>
                <div style={{ fontSize: '11px', lineHeight: '1.5', color: 'var(--text-secondary)', paddingTop: '2px' }}>
                  <span style={{ fontWeight: '700', color }}>{label}: </span>
                  {justifications[key]}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default function SimulatorTab({
  t, theme, setTheme, explicitness, setExplicitness, condition, setCondition,
  currentExperiment, displayedTurns, isTyping, renderNextTurn, loadError, debugLogs
}) {
  const chatBodyRef = useRef(null);
  const [activePhase, setActivePhase] = useState(1);
  const [typedDone, setTypedDone] = useState(() => new Set());
  const [auto, setAuto] = useState({ active: false, target: 0, paused: false });

  const PHASE_SIZE = 3;
  const TURN_DELAY = 3000; 

  const convKey = `${theme}_${explicitness}_${condition}`;
  const [prevConvKey, setPrevConvKey] = useState(convKey);
  if (convKey !== prevConvKey) {
    setPrevConvKey(convKey);
    setTypedDone(new Set());
    setAuto({ active: false, target: 0, paused: false });
    setActivePhase(1);
  }

  useEffect(() => {
    if (!auto.active || auto.paused) return;
    const botCount = displayedTurns.filter(x => x.type === 'bot').length;
    if (botCount >= auto.target) return;

    const lastIdx = displayedTurns.length - 1;
    const lastIsBot = lastIdx >= 0 && displayedTurns[lastIdx].type === 'bot';
    const lastTyped = lastIsBot ? typedDone.has(lastIdx) : false;
    const inFlight = isTyping || (displayedTurns.length > 0 && !lastTyped);
    if (inFlight) return;

    const delay = displayedTurns.length === 0 ? 300 : TURN_DELAY;
    const id = setTimeout(() => renderNextTurn(), delay);
    return () => clearTimeout(id);
  }, [auto, displayedTurns, isTyping, typedDone, renderNextTurn]);

  useEffect(() => {
    const body = chatBodyRef.current;
    if (!body) return;
    const markers = Array.from(body.querySelectorAll('[data-phase]'));
    if (markers.length === 0) return;
    const obs = new IntersectionObserver(() => {
      const bodyTop = body.getBoundingClientRect().top;
      const band = body.clientHeight * 0.25;
      let cur = null;
      markers.forEach(el => {
        if (el.getBoundingClientRect().top - bodyTop <= band) cur = Number(el.dataset.phase);
      });
      if (cur != null) setActivePhase(cur);
    }, { root: body, threshold: [0, 0.25, 0.5, 0.75, 1] });
    markers.forEach(el => obs.observe(el));
    return () => obs.disconnect();
  }, [displayedTurns]);

  if (loadError) return null;

  const dcs = currentExperiment?.summary?.avg_dcs !== undefined ? currentExperiment.summary.avg_dcs.toFixed(2) : '0.00';
  const hes = currentExperiment?.summary?.avg_hes !== undefined ? currentExperiment.summary.avg_hes.toFixed(2) : '0.00';
  const sis = currentExperiment?.summary?.total_sis !== undefined ? currentExperiment.summary.total_sis : '0';
  const totalTurnsInExp = currentExperiment?.conversation?.turns?.length || currentExperiment?.turns?.length || 0;
  const currentBotTurnsCount = displayedTurns.filter(t => t.type === 'bot').length;

  const totalPhases = Math.max(1, Math.ceil(totalTurnsInExp / PHASE_SIZE));
  const isAutoActive = auto.active && currentBotTurnsCount < auto.target;
  const isPlaying = isAutoActive && !auto.paused;
  const isStopped = isAutoActive && auto.paused;

  const _lastIdx = displayedTurns.length - 1;
  const _lastIsBot = _lastIdx >= 0 && displayedTurns[_lastIdx].type === 'bot';
  const turnInFlight = isTyping || (displayedTurns.length > 0 && !(_lastIsBot && typedDone.has(_lastIdx)));
  const liveTurn = currentBotTurnsCount + (turnInFlight ? 1 : 0);

  const focusedPhase = (isPlaying || isStopped)
    ? Math.min(totalPhases, Math.max(1, Math.ceil((liveTurn || 1) / PHASE_SIZE)))
    : activePhase;

  // כפתור התור מעודכן להיות זמין גם בעצירה (isStopped)
  const isBtnDisabled = isTyping || (isAutoActive && !auto.paused) || !currentExperiment || totalTurnsInExp === 0 || currentBotTurnsCount >= totalTurnsInExp;

  const splitColon = (s) => {
    const i = (s || '').indexOf(':');
    return i >= 0 ? [s.slice(0, i).trim(), s.slice(i + 1).trim()] : [s || '', ''];
  };

  const scrollToPhase = (p) => {
    const body = chatBodyRef.current;
    if (!body) return;
    const el = body.querySelector(`[data-phase="${p}"]`);
    if (!el) return;
    const top = el.getBoundingClientRect().top - body.getBoundingClientRect().top + body.scrollTop;
    body.scrollTo({ top, behavior: 'smooth' });
  };

  const beginPlay = () => setAuto({ active: true, target: totalTurnsInExp, paused: false });
  const resetAndPlay = () => {
    const cur = explicitness;
    const other = cur === 'explicit' ? 'implicit' : 'explicit';
    setExplicitness(other);
    setTimeout(() => {
      setExplicitness(cur);
      setTimeout(() => setAuto({ active: true, target: totalTurnsInExp, paused: false }), 60);
    }, 0);
  };
  const play = () => { 
    if (!currentExperiment || totalTurnsInExp === 0) return;
    if (displayedTurns.length === 0) beginPlay();
    else resetAndPlay();
  };
  const stopPlayback = () => setAuto(a => ({ ...a, paused: true }));   
  const resumePlayback = () => setAuto(a => ({ ...a, paused: false })); 
  const resetPlayback = () => { if (currentExperiment) resetAndPlay(); }; 
  
  // פונקציה להזרמת שלב שלם
  const playNextPhase = () => {
    if (!currentExperiment) return;
    const currentPhaseIndex = Math.floor(currentBotTurnsCount / PHASE_SIZE);
    const nextPhaseTarget = Math.min(totalTurnsInExp, (currentPhaseIndex + 1) * PHASE_SIZE);
    setAuto({ active: true, target: nextPhaseTarget, paused: false });
  };

  const ctrlBtn = {
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    width: '24px', height: '24px', borderRadius: '50%', padding: 0,
    border: '1px solid var(--clr-safe)', background: 'transparent',
    color: 'var(--clr-safe)', cursor: 'pointer',
  };
  const liveDotStyle = {
    width: '8px', height: '8px', borderRadius: '50%', background: 'var(--clr-safe)',
    display: 'inline-block', animation: 'liveDotPulse 1s ease-in-out infinite',
  };

  return (
    <div className="simulator-tab sim-breakout" style={{ display: 'flex', flexDirection: 'column' }}>
      <style>{SIM_CSS}</style>

      <div className="panel-card">
        <h2>{t('sim_title')}</h2>
        <p style={{ marginBottom: '20px' }}>{t('sim_subtitle')}</p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', background: 'rgba(255,255,255,0.02)', padding: '16px', borderRadius: 'var(--radius-md)', marginBottom: '20px', border: '1px solid var(--border-subtle)' }}>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontWeight: '700', fontSize: '13px', color: 'var(--text-secondary)' }}>{t('label_theme')}</label>
            <select value={theme} onChange={e => setTheme(e.target.value)} style={{ padding: '10px', borderRadius: '8px', border: '1px solid var(--border-subtle)', backgroundColor: 'var(--bg-main)', color: 'var(--text-primary)', fontWeight: '600', outline: 'none' }}>
              {AVAILABLE_THEMES.map(s => (
                <option key={s.value} value={s.value}>{s.label}</option>
              ))}
            </select>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontWeight: '700', fontSize: '13px', color: 'var(--text-secondary)' }}>{t('label_explicitness')}</label>
            <div style={{ display: 'flex', background: 'var(--bg-main)', padding: '4px', borderRadius: '8px', gap: '4px', border: '1px solid var(--border-subtle)' }}>
              <button onClick={() => setExplicitness('explicit')} className="tab-btn" style={{ backgroundColor: explicitness === 'explicit' ? '#4f46e5' : 'transparent', color: explicitness === 'explicit' ? 'white' : 'var(--text-secondary)' }}>
                {t('btn_explicit')}
              </button>
              <button onClick={() => setExplicitness('implicit')} className="tab-btn" style={{ backgroundColor: explicitness === 'implicit' ? '#4f46e5' : 'transparent', color: explicitness === 'implicit' ? 'white' : 'var(--text-secondary)' }}>
                {t('btn_implicit')}
              </button>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontWeight: '700', fontSize: '13px', color: 'var(--text-secondary)' }}>{t('label_condition')}</label>
            <div style={{ display: 'flex', background: 'var(--bg-main)', padding: '4px', borderRadius: '8px', gap: '4px', border: '1px solid var(--border-subtle)' }}>
              <button onClick={() => setCondition('control')} className="tab-btn" style={{ backgroundColor: condition === 'control' ? 'var(--clr-harm)' : 'transparent', color: condition === 'control' ? 'white' : 'var(--text-secondary)' }}>
                {t('btn_control')}
              </button>
              <button onClick={() => setCondition('pcbt')} className="tab-btn" style={{ backgroundColor: condition === 'pcbt' ? 'var(--clr-safe)' : 'transparent', color: condition === 'pcbt' ? 'white' : 'var(--text-secondary)' }}>
                {t('btn_pcbt')}
              </button>
            </div>
          </div>
        </div>

        <div className="sim-layout">

          <div className="sim-chat">
            {/* מבנה מיכל הצ'אט עודכן כך שהתווית ID לעולם לא תיעלם */}
            <div className="chat-container" style={{ width: '100%', marginBottom: 0, display: 'flex', flexDirection: 'column', height: '100%' }}>
              <div className="chat-header" style={{ direction: 'ltr' }}>
                <span style={{ fontSize: '16px' }}>🤖</span>
                <div>
                  <div style={{ fontSize: '13px', fontWeight: '700' }}>{currentExperiment?.model || 'AI EVALUATION TERMINAL'}</div>
                  <div style={{ fontSize: '10px', color: 'var(--text-secondary)' }}>Turns: {totalTurnsInExp}</div>
                </div>
              </div>

              <div className="phase-bar">
                {Array.from({ length: totalPhases }, (_, i) => i + 1).map(p => {
                  const [head, name] = splitColon(t(`phase_${p}_name`));
                  const range = splitColon(t(`phase_${p}_desc`))[0];
                  const active = focusedPhase === p;
                  return (
                    <div
                      key={p}
                      onClick={() => scrollToPhase(p)}
                      title={name}
                      className="phase-block"
                      style={{
                        display: 'flex', flexDirection: 'column', gap: '2px',
                        alignItems: 'center', textAlign: 'center', padding: '8px 6px', cursor: 'pointer',
                        background: active ? 'var(--bg-surface)' : 'transparent',
                        color: active ? 'var(--text-primary)' : 'var(--text-secondary)',
                        borderLeft: active ? '3px solid var(--clr-safe)' : '3px solid transparent',
                        borderRight: p < totalPhases ? '1px solid var(--border-subtle)' : 'none',
                        transition: 'all 0.2s ease',
                      }}
                    >
                      <span style={{ fontSize: '11px', fontWeight: '700' }}>{head}</span>
                      <span style={{ fontSize: '10px', fontWeight: '600', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '100%' }}>{name}</span>
                      <span style={{ fontSize: '10px', opacity: 0.75 }}>{range}</span>

                      {active && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '4px' }} onClick={e => e.stopPropagation()}>
                          {isPlaying ? (
                            <>
                              <span style={liveDotStyle} title="משדר" />
                              <button onClick={stopPlayback} title="Stop" style={ctrlBtn}><Square size={12} fill="currentColor" /></button>
                            </>
                          ) : isStopped ? (
                            <>
                              <button onClick={resumePlayback} title="Resume" style={ctrlBtn}><Play size={12} fill="currentColor" /></button>
                              <button onClick={resetPlayback} title="Reset" style={ctrlBtn}><RotateCcw size={12} /></button>
                            </>
                          ) : (
                            <button onClick={play} disabled={!currentExperiment} title="Play" style={{ ...ctrlBtn, opacity: !currentExperiment ? 0.45 : 1, cursor: !currentExperiment ? 'not-allowed' : 'pointer' }}>
                              <Play size={12} fill="currentColor" />
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              <div className="chat-body sim-scroll" ref={chatBodyRef} style={{ flex: 1, overflowY: 'auto' }}>
                {displayedTurns.length === 0 && (
                  <div style={{ color: 'var(--text-secondary)', textAlign: 'center', marginTop: '100px', fontSize: '13px' }}>
                    {t('chat_idle')}
                  </div>
                )}

                {displayedTurns.map((turn, idx) => {
                  const text = turn.text || turn.user_message || turn.bot_response || '';
                  const isBot = turn.type === 'bot';
                  const isLast = idx === displayedTurns.length - 1;
                  const animating = isBot && isLast && !typedDone.has(idx);
                  const botIndex = isBot
                    ? displayedTurns.slice(0, idx + 1).filter(x => x.type === 'bot').length - 1
                    : -1;
                  const justifications = currentExperiment?.conversation?.turns?.[botIndex]?.judge_justifications;

                  const userTurnNum = isBot ? 0 : displayedTurns.slice(0, idx + 1).filter(x => x.type === 'user').length;
                  const phaseStart = !isBot && (userTurnNum - 1) % PHASE_SIZE === 0 ? Math.ceil(userTurnNum / PHASE_SIZE) : 0;

                  return (
                    <React.Fragment key={idx}>
                      {phaseStart > 0 && (
                        <div data-phase={phaseStart} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '10px', margin: '4px 0', color: 'var(--text-secondary)', fontSize: '11px' }}>
                          <span style={{ flex: 1, height: '1px', background: 'var(--border-subtle)' }} />
                          <span style={{ whiteSpace: 'nowrap' }}>{t(`phase_${phaseStart}_name`)}</span>
                          <span style={{ flex: 1, height: '1px', background: 'var(--border-subtle)' }} />
                        </div>
                      )}
                      <div className={`msg-bubble ${isBot ? 'bot' : 'user'}`}>
                        <div style={{ fontSize: '10px', fontWeight: '700', opacity: 0.7, marginBottom: '4px' }}>
                          {isBot ? t('chat_bot_title') : t('chat_user_title')}
                        </div>
                        <div style={{ fontSize: '13.5px', whiteSpace: 'pre-line' }}>
                          {animating ? (
                            <TypewriterText
                              text={text}
                              onDone={() => setTypedDone(prev => new Set(prev).add(idx))}
                            />
                          ) : (
                            text
                          )}
                        </div>
                      </div>
                      {isBot && !animating && <JudgeCard scores={turn.scores} justifications={justifications} t={t} />}
                    </React.Fragment>
                  );
                })}
                {isTyping && <div className="msg-bubble bot" style={{ display: 'flex', gap: '4px', alignSelf: 'flex-end' }}><span className="typing-dot"></span><span className="typing-dot"></span><span className="typing-dot"></span></div>}
              </div>

              <div style={{ padding: '12px', display: 'flex', justifyContent: 'center', backgroundColor: 'rgba(255,255,255,0.01)' }}>
                <button 
                  onClick={isStopped ? playNextPhase : renderNextTurn} 
                  disabled={isBtnDisabled} 
                  className="btn-primary"
                >
                  {isStopped ? "הזרם שלב הבא" : (currentExperiment && currentBotTurnsCount >= totalTurnsInExp ? t('btn_completed') : t('btn_next_turn'))}
                </button>
              </div>

              {currentExperiment?.test_case?.id && (
                <div className="conv-id-label" style={{ padding: '8px 12px', textAlign: 'center', fontSize: '11px', color: 'var(--text-secondary)', borderTop: '1px solid var(--border-subtle)' }}>
                  ID: {currentExperiment.test_case.id}{currentExperiment.taskId ? ` · ${currentExperiment.taskId}` : ''}
                </div>
              )}
            </div>
          </div>

          <div className="sim-side">
            <div style={{
              padding: '10px', backgroundColor: 'rgba(255, 255, 255, 0.05)', borderRadius: '8px',
              fontSize: '12px', color: 'var(--text-secondary)', textAlign: 'center',
              whiteSpace: 'pre-line', border: '1px dashed var(--border-subtle)',
            }}>
              {t('metrics_explanation')}
            </div>
            <div className="metrics-grid" style={{ margin: 0 }}>
              <div className="metric-box dcs">
                <div className="metric-label">{t('metric_dcs')}</div>
                <div className="metric-value" style={{ color: 'var(--clr-ai)' }}>{dcs}</div>
              </div>
              <div className="metric-box hes">
                <div className="metric-label">{t('metric_hes')}</div>
                <div className="metric-value" style={{ color: 'var(--clr-harm)' }}>{hes}</div>
              </div>
              <div className="metric-box sis">
                <div className="metric-label">{t('metric_sis')}</div>
                <div className="metric-value" style={{ color: 'var(--clr-safe)' }}>{sis}</div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}