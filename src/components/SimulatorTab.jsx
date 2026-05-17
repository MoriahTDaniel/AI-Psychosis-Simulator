import React, { useRef, useEffect } from 'react';

export default function SimulatorTab({
  scenario, setScenario,
  condition, setCondition,
  currentExperiment,
  displayedTurns,
  isTyping,
  renderNextTurn,
  loadError,
  debugLogs
}) {
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [displayedTurns, isTyping]);

  if (loadError) {
    return (
      <div style={{ color: '#ef4444', textAlign: 'center', padding: '30px', fontWeight: 'bold', background: '#fef2f2', borderRadius: '8px', border: '1px dashed #f87171' }}>
        ⚠️ שגיאה בתקשורת עם קובץ הנתונים. ודאי שקובץ results.json נמצא בנתיב הציבורי: public/data/results.json
      </div>
    );
  }

  const dcs = currentExperiment?.summary?.avg_dcs !== undefined ? currentExperiment.summary.avg_dcs.toFixed(2) : '0.00';
  const hes = currentExperiment?.summary?.avg_hes !== undefined ? currentExperiment.summary.avg_hes.toFixed(2) : '0.00';
  const sis = currentExperiment?.summary?.total_sis !== undefined ? currentExperiment.summary.total_sis : '0';

  // חישוב בטוח ומדויק של אורך התורות מתוך תת-השדה הפנימי
  const totalTurnsInExp = currentExperiment?.conversation?.turns?.length || currentExperiment?.turns?.length || 0;
  const currentBotTurnsCount = displayedTurns.filter(t => t.type === 'bot').length;
  const isBtnDisabled = isTyping || !currentExperiment || totalTurnsInExp === 0 || currentBotTurnsCount >= totalTurnsInExp;

  return (
    <div style={{ background: 'white', padding: '35px', borderRadius: '12px', boxShadow: '0 4px 20px rgba(15, 23, 42, 0.05)', border: '1px solid #e2e8f0' }}>
      <h2 style={{ color: '#0f172a', marginBottom: '15px', fontSize: '22px', fontWeight: '700' }}>סביבת הרצה וסימולציה קלינית</h2>
      <p style={{ color: '#64748b', marginBottom: '25px', fontSize: '15px' }}>בחרי את תנאי המטריצה הפקטוריאלית כדי לבחון בזמן אמת את תגובות המודל והערכות השופט האוטומטי:</p>
      
      {/* פילטרים פקטוריאליים */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px', background: '#f8fafc', padding: '25px', borderRadius: '10px', marginBottom: '30px', border: '1px solid #e2e8f0' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <label style={{ fontWeight: '700', fontSize: '14px', color: '#1e293b' }}>📐 סוג הצגת האשליה (Scenario Cell):</label>
          <select value={scenario} onChange={e => setScenario(e.target.value)} style={{ padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', backgroundColor: '#ffffff', color: '#0f172a', fontWeight: '600', outline: 'none' }}>
            <option value="digital_romance_explicit">The Digital Romance [EXPLICIT]</option>
            <option value="digital_romance_implicit">The Digital Romance [IMPLICIT]</option>
          </select>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <label style={{ fontWeight: '700', fontSize: '14px', color: '#1e293b' }}>🛡️ מצב התערבות פסיכולוגית:</label>
          <select value={condition} onChange={e => setCondition(e.target.value)} style={{ padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', backgroundColor: '#ffffff', color: '#0f172a', fontWeight: '600', outline: 'none' }}>
            <option value="control">קבוצת ביקורת [CONTROL]</option>
            <option value="pcbt">פרומפט טיפולי [pCBT Intervention]</option>
          </select>
        </div>
      </div>

      {/* דאשבורד מדדים */}
      <div style={{ display: 'flex', gap: '20px', marginBottom: '35px', justifyContent: 'space-between' }}>
        <div style={{ background: '#f1f5f9', borderTop: '4px solid #3b82f6', padding: '20px', borderRadius: '8px', flex: 1, textAlign: 'center' }}>
          <div style={{ fontSize: '12px', color: '#64748b', fontWeight: 'bold', marginBottom: '5px' }}>AVG DCS (אישור אשליה)</div>
          <div style={{ fontSize: '28px', fontWeight: '800', color: '#0f172a' }}>{dcs}</div>
        </div>
        <div style={{ background: '#f1f5f9', borderTop: '4px solid #ef4444', padding: '20px', borderRadius: '8px', flex: 1, textAlign: 'center' }}>
          <div style={{ fontSize: '12px', color: '#64748b', fontWeight: 'bold', marginBottom: '5px' }}>AVG HES (אפשור נזק)</div>
          <div style={{ fontSize: '28px', fontWeight: '800', color: '#0f172a' }}>{hes}</div>
        </div>
        <div style={{ background: '#f1f5f9', borderTop: '4px solid #10b981', padding: '20px', borderRadius: '8px', flex: 1, textAlign: 'center' }}>
          <div style={{ fontSize: '12px', color: '#64748b', fontWeight: 'bold', marginBottom: '5px' }}>TOTAL SIS (הפניות בטיחות)</div>
          <div style={{ fontSize: '28px', fontWeight: '800', color: '#0f172a' }}>{sis}</div>
        </div>
      </div>

      {/* קונסולת הצא'ט המרכזית */}
      <div style={{ border: '1px solid #cbd5e1', borderRadius: '12px', overflow: 'hidden', backgroundColor: '#f8fafc', maxWidth: '680px', margin: '0 auto', boxShadow: '0 12px 40px rgba(15, 23, 42, 0.08)', marginBottom: '35px' }}>
        <div style={{ backgroundColor: '#0f172a', color: 'white', padding: '18px 20px', display: 'flex', alignItems: 'center', gap: '14px', borderBottom: '2px solid #2563eb' }}>
          <div style={{ width: '38px', height: '38px', backgroundColor: '#1e293b', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', border: '1px solid #3b82f6' }}>🤖</div>
          <div>
            <div style={{ fontSize: '15px', fontWeight: '700' }}>{currentExperiment?.model || 'AI EVALUATION TERMINAL'}</div>
            <div style={{ fontSize: '11px', color: '#3b82f6', fontWeight: '600', marginTop: '2px' }}>📊 AVAILABLE TURNS: {totalTurnsInExp}</div>
          </div>
        </div>

        <div style={{ height: '400px', overflowY: 'auto', padding: '25px', display: 'flex', flexDirection: 'column', gap: '20px', backgroundColor: '#ffffff' }}>
          {displayedTurns.length === 0 && (
            <div style={{ color: '#94a3b8', textAlign: 'center', marginTop: '140px', fontSize: '15px', fontWeight: '500' }}>
              🎯 הקליקי על הכפתור למטה כדי להזרים את תורות השיחה הניסויית בזמן אמת
            </div>
          )}
          
          {displayedTurns.map((turn, idx) => (
            <div key={idx} className="msg-bubble" style={{
              alignSelf: turn.type === 'user' ? 'flex-start' : 'flex-end',
              backgroundColor: turn.type === 'user' ? '#f8fafc' : '#f0fdfa',
              border: turn.type === 'user' ? '1px solid #e2e8f0' : '1px solid #99f6e4',
              borderRadius: '8px', padding: '14px 18px', maxWidth: '88%', color: '#0f172a'
            }}>
              <div style={{ fontSize: '11px', fontWeight: '700', color: turn.type === 'user' ? '#64748b' : '#0d9488', marginBottom: '6px' }}>
                {turn.type === 'user' ? '👤 EVALUATION PROMPT (קלט משתמש)' : '🤖 MODEL RESPONSE (תגובת בינה מלאכותית)'}
              </div>
              <div style={{ fontSize: '14.5px', lineHeight: '1.6', whiteSpace: 'pre-line' }}>{turn.text}</div>
              
              {turn.scores?.hes > 0 && (
                <div style={{ backgroundColor: '#fdf2f2', border: '1px solid #ef4444', color: '#991b1b', padding: '10px', borderRadius: '6px', marginTop: '12px', fontWeight: '700', fontSize: '12.5px' }}>
                  ⚠️ כשל בטיחות קליני [קבוצת ביקורת]: המודל מאשר נזק ומעודד אובדנות (HES = {turn.scores.hes})
                </div>
              )}
              {turn.scores?.sis > 0 && (
                <div style={{ backgroundColor: '#f0fdf4', border: '1px solid #10b981', color: '#166534', padding: '10px', borderRadius: '6px', marginTop: '12px', fontWeight: '700', fontSize: '12.5px' }}>
                  🛡️ התערבות אקטיבית מוצלחת [pCBT]: המודל הפעיל פרוטוקול בלימה, סירב לתקף את האשליה והפנה אקטיבית לקווי תמיכה חרום.
                </div>
              )}
            </div>
          ))}

          {isTyping && (
            <div className="msg-bubble" style={{ alignSelf: 'flex-end', backgroundColor: '#f8fafc', padding: '14px 18px', border: '1px solid #e2e8f0', borderRadius: '8px' }}>
              <div style={{ display: 'flex', gap: '5px' }}>
                <span className="typing-dot"></span>
                <span className="typing-dot"></span>
                <span className="typing-dot"></span>
              </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        <div style={{ backgroundColor: '#f8fafc', padding: '18px', display: 'flex', justifyContent: 'center', borderTop: '1px solid #e2e8f0' }}>
          <button 
            onClick={renderNextTurn} 
            disabled={isBtnDisabled} 
            style={{ 
              backgroundColor: isBtnDisabled ? '#e2e8f0' : '#2563eb', 
              color: isBtnDisabled ? '#94a3b8' : 'white', 
              border: 'none', 
              padding: '14px 32px', 
              borderRadius: '30px', 
              fontWeight: '700', 
              cursor: isBtnDisabled ? 'not-allowed' : 'pointer', 
              fontSize: '14px', 
              boxShadow: isBtnDisabled ? 'none' : '0 4px 10px rgba(37, 99, 235, 0.2)', 
              transition: 'all 0.2s' 
            }}
          >
            {currentExperiment && currentBotTurnsCount >= totalTurnsInExp ? '🏁 תהליך הסימולציה הושלם' : 'הזרם תור הבא במחקר ➔'}
          </button>
        </div>
      </div>

      {/* ✨ פאנל דאשבורד "דיבאג ומעקב קליני" חי למסך (Sleek Real-time Debug Logger) */}
      <div style={{ background: '#1e293b', color: '#38bdf8', padding: '20px', borderRadius: '10px', fontFamily: 'Courier New, monospace', fontSize: '13px', border: '1px solid #334155', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
        <div style={{ color: '#94a3b8', fontWeight: 'bold', marginBottom: '8px', borderBottom: '1px solid #334155', paddingBottom: '5px' }}>
          🖥️ מערכת מעקב ומדבג מעבדה חי (Live Projector Monitor Console)
        </div>
        <div style={{ height: '110px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '4px', direction: 'ltr', textAlign: 'left' }}>
          {debugLogs.length === 0 ? (
            <div style={{ color: '#64748b' }}>[System Idle] Waiting for user interaction...</div>
          ) : (
            debugLogs.map((log, i) => <div key={i}>{log}</div>)
          )}
        </div>
      </div>

    </div>
  );
}