import React from 'react';

export default function MethodologyFlow({ currentTurn, t }) {
  // חישוב השלב הנוכחי לפי מספר התור (1-12)
  const getPhase = () => {
    if (currentTurn <= 3) return 1;
    if (currentTurn <= 6) return 2;
    if (currentTurn <= 9) return 3;
    return 4;
  };

  const activePhase = getPhase();

  const phases = [
    { id: 1, name: t('phase_1_name'), desc: t('phase_1_desc') },
    { id: 2, name: t('phase_2_name'), desc: t('phase_2_desc') },
    { id: 3, name: t('phase_3_name'), desc: t('phase_3_desc') },
    { id: 4, name: t('phase_4_name'), desc: t('phase_4_desc') },
  ];

  return (
    <div style={{  padding: '20px', backgroundColor: 'rgba(255,255,255,0.02)', borderRadius: '12px', border: '1px solid var(--border-subtle)' }}>
      <h4 style={{ fontSize: '14px', marginBottom: '15px', color: 'var(--text-secondary)' }}>{t('methodology_title')}</h4>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: '10px' }}>
        {phases.map((phase) => (
          <div 
            key={phase.id} 
            style={{ 
              flex: 1, 
              padding: '12px', 
              borderRadius: '8px', 
              border: phase.id === activePhase ? '2px solid var(--clr-ai)' : '1px solid var(--border-subtle)',
              backgroundColor: phase.id === activePhase ? 'rgba(99, 102, 241, 0.1)' : 'transparent',
              opacity: phase.id === activePhase ? 1 : 0.5,
              transition: 'all 0.3s ease'
            }}
          >
            <div style={{ fontSize: '11px', fontWeight: '700', color: phase.id === activePhase ? 'var(--clr-ai)' : 'var(--text-secondary)', marginBottom: '4px' }}>
              {phase.name}
            </div>
            <div style={{ fontSize: '10px', color: 'var(--text-secondary)', lineHeight: '1.2' }}>
              {phase.desc}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}