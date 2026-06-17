import React, { useState, useEffect } from 'react';
import ProblemTab from './components/ProblemsTab.jsx';
import SimulatorTab from './components/SimulatorTab.jsx';
import ResultsTab from './components/ResultsTab.jsx';
import { getConversation } from './data/conversationData.js';

export default function App() {
  const [lang, setLang] = useState('he');
  const [translations, setTranslations] = useState(null);
  const [activeTab, setActiveTab] = useState('simulator');
  const [currentExperiment, setCurrentExperiment] = useState(null);
  const [currentTurnIndex, setCurrentTurnIndex] = useState(0);
  const [displayedTurns, setDisplayedTurns] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  
  // פוצל לשני משתנים נפרדים: נושא מול רמת גלויות
  const [theme, setTheme] = useState('digital_romance');
  const [explicitness, setExplicitness] = useState('explicit');
  const [condition, setCondition] = useState('control');
  
  const [loadError, setLoadError] = useState(false);
  const [debugLogs, setDebugLogs] = useState([]);

  const t = (key) => {
    if (translations && translations[key] && translations[key][lang]) {
      return translations[key][lang];
    }
    return key; 
  };

  useEffect(() => {
    document.body.style.direction = lang === 'he' ? 'rtl' : 'ltr';
  }, [lang]);

  const logDebug = (msg) => {
    setDebugLogs(prev => [`[${new Date().toLocaleTimeString()}] ${msg}`, ...prev.slice(0, 15)]);
  };

  useEffect(() => {
    fetch('/data/translation.json')
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch translations');
        return res.json();
      })
      .then((translationData) => {
        setTranslations(translationData);
        setLoadError(false);
      })
      .catch((err) => {
        console.error(err);
        setLoadError(true);
      });
  }, []);

  // איתור השיחה האמיתית התואמת לתא הפקטוריאלי (Theme × Explicitness × Condition)
  useEffect(() => {
    const experiment = getConversation(theme, explicitness, condition);
    setCurrentExperiment(experiment);
    setCurrentTurnIndex(0);
    setDisplayedTurns([]);
  }, [theme, explicitness, condition]);

  const renderNextTurn = () => {
    const turnsArray = currentExperiment?.conversation?.turns || currentExperiment?.turns || [];
    if (currentTurnIndex >= turnsArray.length || isTyping) return;

    const nextTurn = turnsArray[currentTurnIndex];
    setDisplayedTurns(prev => [...prev, { type: 'user', text: nextTurn.user_message }]);
    setCurrentTurnIndex(prev => prev + 1);
    setIsTyping(true);

    // "השהיית חשיבה" קצרה (נקודות ההקלדה) לפני שתגובת המודל מוזרמת תו-תו בבועה.
    setTimeout(() => {
      setIsTyping(false);
      setDisplayedTurns(prev => [...prev, {
        type: 'bot',
        text: nextTurn.bot_response,
        scores: nextTurn.scores || {}
      }]);
    }, 900);
  };

  if (loadError) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100vh', color: 'var(--clr-harm)', textAlign: 'center', padding: '20px' }}>
        <span style={{ fontSize: '48px', marginBottom: '10px' }}>⚠️</span>
        <h2 style={{ marginBottom: '8px' }}>שגיאה בטעינת נתוני המעבדה</h2>
        <p style={{ color: 'var(--text-secondary)' }}>נראה שיש בעיית תחביר (Syntax Error) באחד מקבצי ה-JSON.</p>
      </div>
    );
  }

  if (!translations) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100vh', color: 'var(--text-secondary)' }}>
        <span className="typing-dot" style={{ marginBottom: '15px', transform: 'scale(1.5)' }}></span>
        <div>טוען נתוני מעבדה ופאנל שפות...</div>
      </div>
    );
  }

  return (
    <div style={{ position: 'relative' }}>
      <div style={{ display: 'flex', justifyContent: lang === 'he' ? 'flex-end' : 'flex-end', padding: '15px', marginBottom: '10px' }}>
        <button onClick={() => setLang(lang === 'he' ? 'en' : 'he')} style={{ background: 'var(--bg-surface)', color: 'var(--clr-ai)', border: '1px solid var(--border-subtle)', padding: '6px 16px', borderRadius: '20px', fontSize: '13px', fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 4px 10px rgba(0,0,0,0.2)' }}>
          {lang === 'he' ? 'English 🌐' : '🌐 עברית'}
        </button>
      </div>

      <header style={{ textAlign: 'center', padding: '0 15px 24px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: '800', marginBottom: '8px' }}>{t('title')}</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>{t('subtitle')}</p>
      </header>

      <nav>
        <button className={`tab-btn ${activeTab === 'problem' ? 'active' : ''}`} onClick={() => setActiveTab('problem')}>{t('nav_intro')}</button>
        <button className={`tab-btn ${activeTab === 'simulator' ? 'active' : ''}`} onClick={() => setActiveTab('simulator')}>{t('nav_simulator')}</button>
        <button className={`tab-btn ${activeTab === 'results' ? 'active' : ''}`} onClick={() => setActiveTab('results')}>{t('nav_results')}</button>
      </nav>

      <main>
        {activeTab === 'problem' && <ProblemTab t={t} />}
        {activeTab === 'simulator' && (
          <SimulatorTab 
            t={t}
            theme={theme} setTheme={setTheme}
            explicitness={explicitness} setExplicitness={setExplicitness}
            condition={condition} setCondition={setCondition}
            currentExperiment={currentExperiment}
            displayedTurns={displayedTurns}
            isTyping={isTyping}
            renderNextTurn={renderNextTurn}
            loadError={loadError}
            debugLogs={debugLogs}
          />
        )}
        {activeTab === 'results' && <ResultsTab t={t} />}
      </main>
    </div>
  );
}