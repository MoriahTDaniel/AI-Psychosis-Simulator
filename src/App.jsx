import React, { useState, useEffect } from 'react';
import ProblemTab from './components/ProblemsTab.jsx';
import SimulatorTab from './components/SimulatorTab.jsx';
import ResultsTab from './components/ResultsTab.jsx';

export default function App() {
  const [activeTab, setActiveTab] = useState('problem');
  const [rawDataset, setRawDataset] = useState(null);
  const [currentExperiment, setCurrentExperiment] = useState(null);
  const [currentTurnIndex, setCurrentTurnIndex] = useState(0);
  const [displayedTurns, setDisplayedTurns] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [scenario, setScenario] = useState('digital_romance_explicit');
  const [condition, setCondition] = useState('control');
  const [loadError, setLoadError] = useState(false);
  const [debugLogs, setDebugLogs] = useState([]);

  // פונקציית עזר להדפסת לוגים חיים למסך
  const logDebug = (msg) => {
    setDebugLogs(prev => [`[${new Date().toLocaleTimeString()}] ${msg}`, ...prev.slice(0, 15)]);
  };

  // קריאת הנתונים מתיקיית data הציבורית
  useEffect(() => {
    logDebug("📡 מנסה לטעון את קובץ הנתונים מ-public/data/results.json...");
    fetch('/data/results.json')
      .then(res => {
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        return res.json();
      })
      .then(data => {
        setRawDataset(data);
        setLoadError(false);
        logDebug(`✅ קובץ ה-JSON נטען בהצלחה! נמצאו ${data.experiments?.length || 0} תאי ניסוי.`);
      })
      .catch(err => {
        console.error(err);
        setLoadError(true);
        logDebug(`❌ שגיאת טעינה: ודאי שהקובץ results.json נמצא במיקום הנכון.`);
      });
  }, []);

  // מנגנון סינון חכם המותאם למבנה ההיררכי של ה-JSON המעבדתי שלך
  useEffect(() => {
    if (!rawDataset || !rawDataset.experiments || rawDataset.experiments.length === 0) return;

    logDebug(`🔍 מפעיל פילטר מחדש: ${scenario} | תנאי: ${condition}`);

    const experiment = rawDataset.experiments.find(exp => {
      const expId = (exp.test_case?.id || '').toLowerCase();
      const targetScenario = scenario.toLowerCase();
      const expCond = (exp.summary?.condition_name || exp.condition || '').toLowerCase();
      const targetCond = condition.toLowerCase();

      const idMatch = expId === targetScenario || 
                      expId.includes(targetScenario) ||
                      targetScenario.includes(expId) ||
                      (targetScenario.includes('explicit') && exp.test_case?.name?.includes('EXPLICIT')) ||
                      (targetScenario.includes('implicit') && exp.test_case?.name?.includes('IMPLICIT'));

      return idMatch && expCond === targetCond;
    });

    if (experiment) {
      // חילוץ תורות השיחה מתוך המבנה הפנימי האמיתי: conversation.turns
      const extractedTurns = experiment.conversation?.turns || experiment.turns || [];
      
      setCurrentExperiment(experiment);
      setCurrentTurnIndex(0);
      setDisplayedTurns([]);
      logDebug(`✨ נמצא ניסוי תואם! מודל: ${experiment.model}. נמצאו ${extractedTurns.length} תורות שיחה להזרמה.`);
    } else {
      logDebug(`⚠️ לא נמצא תא תואם מדויק. טוען ניסוי גיבוי אוטומטי מהקובץ.`);
      const backupExp = rawDataset.experiments[0];
      setCurrentExperiment(backupExp);
      setCurrentTurnIndex(0);
      setDisplayedTurns([]);
    }
  }, [rawDataset, scenario, condition]);

  const renderNextTurn = () => {
    // שליפה בטוחה של מערך התורות מתוך תת-השדה conversation.turns
    const turnsArray = currentExperiment?.conversation?.turns || currentExperiment?.turns || [];
    
    if (currentTurnIndex >= turnsArray.length) {
      logDebug("🏁 סוף השיחה הניסויית - אין תורות נוספים להצגה.");
      return;
    }

    const nextTurn = turnsArray[currentTurnIndex];
    logDebug(`🎯 מזרים תור מספר ${currentTurnIndex + 1} מתוך ${turnsArray.length}`);
    
    // 1. הזרקה מיידית של הודעת המשתמש
    setDisplayedTurns(prev => [...prev, { type: 'user', text: nextTurn.user_message }]);
    setCurrentTurnIndex(prev => prev + 1);
    setIsTyping(true);

    // 2. השהיית הקלדה ריאליסטית של הבוט
    setTimeout(() => {
      setIsTyping(false);
      setDisplayedTurns(prev => [...prev, { 
        type: 'bot', 
        text: nextTurn.bot_response,
        scores: nextTurn.scores || {}
      }]);
      logDebug(`🤖 מענה המודל לתור ${currentTurnIndex} התקבל ורונדר.`);
    }, 1100);
  };

  return (
    <div style={{ direction: 'rtl', fontFamily: 'Segoe UI, system-ui, sans-serif', backgroundColor: '#f8fafc', minHeight: '100vh', paddingBottom: '50px' }}>
      
      <style>{`
        .tab-btn { background: none; border: none; padding: 18px 32px; font-size: 15px; font-weight: 700; color: #64748b; cursor: pointer; transition: all 0.2s; border-bottom: 3px solid transparent; }
        .tab-btn:hover { color: #2563eb; background-color: #f1f5f9; }
        .tab-btn.active { color: #2563eb; border-bottom: 3px solid #2563eb; }
        .typing-dot { width: 7px; height: 7px; background-color: #3b82f6; border-radius: 50%; animation: bounce 1.3s infinite both; }
        .typing-dot:nth-child(2) { animation-delay: 0.2s; }
        .typing-dot:nth-child(3) { animation-delay: 0.4s; }
        @keyframes bounce { 0%, 80%, 100% { transform: scale(0); } 40% { transform: scale(1); } }
      `}</style>

      <header style={{ background: 'linear-gradient(135deg, #0f172a, #1e293b)', color: 'white', padding: '35px 20px', textAlign: 'center', borderBottom: '4px solid #2563eb', boxShadow: '0 4px 20px rgba(15, 23, 42, 0.15)' }}>
        <h1 style={{ fontSize: '26px', fontWeight: '800', letterSpacing: '0.5px' }}>הערכת בטיחות קלינית של מודלי שפה</h1>
        <p style={{ fontSize: '14.5px', marginTop: '8px', color: '#94a3b8', fontWeight: '500' }}>
          פורטל מחקר רשמי: אינטראקציה פקטוריאלית בין מניפולציית התערבות (pCBT vs Control) לרמת גלויות התסמינים
        </p>
      </header>

      <nav style={{ display: 'flex', justifyContent: 'center', backgroundColor: '#ffffff', position: 'sticky', top: 0, zIndex: 100, borderBottom: '1px solid #e2e8f0', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
        <button className={`tab-btn ${activeTab === 'problem' ? 'active' : ''}`} onClick={() => setActiveTab('problem')}>1. מבוא והיפותזת המחקר</button>
        <button className={`tab-btn ${activeTab === 'simulator' ? 'active' : ''}`} onClick={() => setActiveTab('simulator')}>2. סימולטור מעבדה אינטראקטיבי</button>
        <button className={`tab-btn ${activeTab === 'results' ? 'active' : ''}`} onClick={() => setActiveTab('results')}>3. ממצאים ומסקנות אמפיריות</button>
      </nav>

      <div style={{ maxWidth: '1050px', margin: '35px auto', padding: '0 20px' }}>
        {activeTab === 'problem' && <ProblemTab />}
        {activeTab === 'simulator' && (
          <SimulatorTab 
            scenario={scenario} setScenario={setScenario}
            condition={condition} setCondition={setCondition}
            currentExperiment={currentExperiment}
            displayedTurns={displayedTurns}
            isTyping={isTyping}
            renderNextTurn={renderNextTurn}
            loadError={loadError}
            debugLogs={debugLogs}
          />
        )}
        {activeTab === 'results' && <ResultsTab />}
      </div>
    </div>
  );
}