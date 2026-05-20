import React, { useRef, useEffect, useState } from 'react';

const THEMES = [
  { value: "conduit", label: "1: The Conduit (Grandiose)" },
  { value: "digital_romance", label: "2: The Digital Romance (Attachment)" },
  { value: "medical_awakening", label: "3: The Medical Awakening (Neglect)" },
  { value: "secret_project", label: "4: The Secret Project (Property/Harm)" },
  { value: "messianic_union", label: "5: The Messianic Union (Cult)" },
  { value: "turing_test", label: "6: The Turing Test (Financial/Neglect)" },
  { value: "unseen_connections", label: "7: The Unseen Connections (Isolation)" },
  { value: "ai_sweetheart", label: "8: The AI Sweetheart (Dependence)" }
];

export default function SimulatorTab({
  t, theme, setTheme, explicitness, setExplicitness, condition, setCondition,
  currentExperiment, displayedTurns, isTyping, renderNextTurn, loadError, debugLogs
}) {
  const chatEndRef = useRef(null);
  const [showDebug, setShowDebug] = useState(false);

  useEffect(() => {
    // התיקון: לא קופץ למטה אוטומטית בהטענה, אלא רק כשיש אינטראקציה
    if (displayedTurns.length > 0 || isTyping) {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [displayedTurns, isTyping]);

  if (loadError) return null;

  const dcs = currentExperiment?.summary?.avg_dcs !== undefined ? currentExperiment.summary.avg_dcs.toFixed(2) : '0.00';
  const hes = currentExperiment?.summary?.avg_hes !== undefined ? currentExperiment.summary.avg_hes.toFixed(2) : '0.00';
  const sis = currentExperiment?.summary?.total_sis !== undefined ? currentExperiment.summary.total_sis : '0';

  const totalTurnsInExp = currentExperiment?.conversation?.turns?.length || currentExperiment?.turns?.length || 0;
  const currentBotTurnsCount = displayedTurns.filter(t => t.type === 'bot').length;
  const isBtnDisabled = isTyping || !currentExperiment || totalTurnsInExp === 0 || currentBotTurnsCount >= totalTurnsInExp;

  return (
    <div className="panel-card">
      <h2>{t('sim_title')}</h2>
      <p style={{ marginBottom: '20px' }}>{t('sim_subtitle')}</p>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', background: 'rgba(255,255,255,0.02)', padding: '16px', borderRadius: 'var(--radius-md)', marginBottom: '20px', border: '1px solid var(--border-subtle)' }}>
        
        {/* בחירת נושא (Theme) */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <label style={{ fontWeight: '700', fontSize: '13px', color: 'var(--text-secondary)' }}>{t('label_theme')}</label>
          <select value={theme} onChange={e => setTheme(e.target.value)} style={{ padding: '10px', borderRadius: '8px', border: '1px solid var(--border-subtle)', backgroundColor: 'var(--bg-main)', color: 'var(--text-primary)', fontWeight: '600', outline: 'none' }}>
            {THEMES.map(s => (
              <option key={s.value} value={s.value}>{s.label}</option>
            ))}
          </select>
        </div>

        {/* בחירת רמת גלויות (Explicit / Implicit) ככפתורים */}
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

        {/* בחירת מצב התערבות (Control / pCBT) */}
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

      <div className="metrics-grid">
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

      <div className="chat-container">
        <div className="chat-header">
          <span style={{ fontSize: '16px' }}>🤖</span>
          <div>
            <div style={{ fontSize: '13px', fontWeight: '700' }}>{currentExperiment?.model || 'AI EVALUATION TERMINAL'}</div>
            <div style={{ fontSize: '10px', color: 'var(--text-secondary)' }}>Turns: {totalTurnsInExp}</div>
          </div>
        </div>

        <div className="chat-body">
          {displayedTurns.length === 0 && (
            <div style={{ color: 'var(--text-secondary)', textAlign: 'center', marginTop: '100px', fontSize: '13px' }}>
              {t('chat_idle')}
            </div>
          )}
          
          {displayedTurns.map((turn, idx) => (
            <div key={idx} className={`msg-bubble ${turn.type === 'user' ? 'user' : 'bot'}`}>
              <div style={{ fontSize: '10px', fontWeight: '700', opacity: 0.7, marginBottom: '4px' }}>
                {turn.type === 'user' ? t('chat_user_title') : t('chat_bot_title')}
              </div>
              <div style={{ fontSize: '13.5px', whiteSpace: 'pre-line' }}>{turn.text || turn.user_message || turn.bot_response}</div>
              {turn.scores?.hes > 0 && <div className="infraction-badge harm">{t('badge_harm')}</div>}
              {turn.scores?.sis > 0 && <div className="infraction-badge safe">{t('badge_safe')}</div>}
            </div>
          ))}
          {isTyping && <div className="msg-bubble bot" style={{ display: 'flex', gap: '4px', alignSelf: 'flex-end' }}><span className="typing-dot"></span><span className="typing-dot"></span><span className="typing-dot"></span></div>}
          <div ref={chatEndRef} />
        </div>

        <div style={{ padding: '12px', display: 'flex', justifyContent: 'center', backgroundColor: 'rgba(255,255,255,0.01)' }}>
          <button onClick={renderNextTurn} disabled={isBtnDisabled} className="btn-primary">
            {currentExperiment && currentBotTurnsCount >= totalTurnsInExp ? t('btn_completed') : t('btn_next_turn')}
          </button>
        </div>
      </div>
    </div>
  );
}