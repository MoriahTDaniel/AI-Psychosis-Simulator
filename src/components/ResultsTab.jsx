import React from 'react';

// ייבוא סטטי של כל תמונות הגרפים מ-src/assets/graphs (Vite glob — ללא ספריות חיצוניות).
const graphModules = import.meta.glob('../assets/graphs/*.{png,jpg,jpeg,svg,webp,gif}', { eager: true, import: 'default' });
const GRAPHS = Object.entries(graphModules)
  .sort(([a], [b]) => a.localeCompare(b))
  .map(([path, src]) => ({ src, name: path.split('/').pop().replace(/\.[^.]+$/, '') }));

// כיתובים דו-לשוניים לפי שם הקובץ (ללא סיומת). ברירת מחדל: שם הקובץ מנוקה.
const GRAPH_CAPTIONS = {
  'fig1-DCS-pCBT': {
    he: 'אינטראקציה: אישור מחשבות שווא (DCS) — לאחר תיקון בונפרוני. pCBT מפחית משמעותית אישור דלוזיות בתרחיש מפורש ומרומז.',
    en: 'Interaction effect on Delusional Conviction Score (DCS), Bonferroni-corrected. pCBT significantly reduces delusional validation across both explicit and implicit conditions.'
  },
  'fig1-HES-pCBT': {
    he: 'אינטראקציה: מניעת נזק (HES) — לאחר תיקון בונפרוני. pCBT מבטל כמעט לחלוטין תגובות מזיקות בתרחיש המפורש.',
    en: 'Interaction effect on Harm Evaluation Score (HES), Bonferroni-corrected. pCBT near-eliminates harmful responses in explicit psychotic scenarios.'
  },
  'fig1-SIS-pCBT': {
    he: 'אינטראקציה: התערבויות בטיחותיות (SIS) — לאחר תיקון בונפרוני. pCBT מגביר באופן עקבי התערבויות טיפוליות בכל התרחישים.',
    en: 'Interaction effect on Safety Intervention Score (SIS), Bonferroni-corrected. pCBT consistently increases therapeutic safety interventions across all themes.'
  },
  'fig2-effect_size': {
    he: 'גודל האפקט (Partial η²) לכל הגורמים והאינטראקציות. Prompt_Type מסביר את השונות הגדולה ביותר בכל שלושת המדדים.',
    en: 'Effect sizes (Partial η²) for all factors and interactions. Prompt_Type accounts for the largest variance across all three clinical metrics.'
  }
};
const captionFor = (name) => {
  const c = GRAPH_CAPTIONS[name];
  if (!c) return name.replace(/[_-]+/g, ' ');
  if (typeof c === 'string') return c;
  return document.body.style.direction === 'rtl' ? c.he : c.en;
};

export default function ResultsTab({ t }) {
  const isRtl = document.body.style.direction === 'rtl';

  // תוויות קצרות כדי לחסוך מקום יקר בטבלה
  const labelControl = isRtl ? 'ביקורת' : 'Control';
  const labelPcbt = 'pCBT';
  const labelExplicit = isRtl ? 'גלוי' : 'Explicit';
  const labelImplicit = isRtl ? 'סמוי' : 'Implicit';

  return (
    <div className="panel-card">
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
        <h2 style={{ margin: 0 }}> {t('results_title')}</h2>
      </div>
      <p style={{ marginBottom: '15px', color: 'var(--text-secondary)', fontSize: '14px' }}>
        {t('results_subtitle')}
      </p>


      {/* הקונטיינר שאחראי על הגלילה. רוחב 100% וגלילה עצמאית */}
      <div style={{ 
        width: '100%', 
        maxWidth: '100%',
        borderRadius: '8px', 
        border: '1px solid var(--border-subtle)', 
        marginBottom: '30px',
        overflowX: 'auto', 
        WebkitOverflowScrolling: 'touch' 
      }}>
        {/* הטבלה עצמה: minWidth מבטיח שהגלילה תעבוד אם המסך קטן מ-340px */}
        <table style={{ 
          width: '100%', 
          minWidth: '340px', 
          borderCollapse: 'collapse', 
          fontSize: '12.5px', 
          textAlign: 'center'
        }}>
          <thead>
            <tr>
              <th style={{ padding: '8px 4px', backgroundColor: 'var(--bg-surface)', borderBottom: '2px solid var(--border-subtle)', borderInlineEnd: '1px solid var(--border-subtle)', textAlign: isRtl ? 'right' : 'left', width: '38%' }}>
                מדד וקבוצה
              </th>
              <th style={{ padding: '8px 4px', backgroundColor: 'var(--bg-surface)', borderBottom: '2px solid var(--border-subtle)', borderInlineEnd: '1px solid var(--border-subtle)', width: '31%', color: 'var(--text-primary)', whiteSpace: 'nowrap' }}>
                {labelExplicit}
              </th>
              <th style={{ padding: '8px 4px', backgroundColor: 'var(--bg-surface)', borderBottom: '2px solid var(--border-subtle)', width: '31%', color: 'var(--text-primary)', whiteSpace: 'nowrap' }}>
                {labelImplicit}
              </th>
            </tr>
          </thead>
          <tbody>
            
            {/* -------------------- DCS -------------------- */}
            <tr>
              <td colSpan="3" style={{ padding: '6px 8px', backgroundColor: 'rgba(99, 102, 241, 0.1)', color: 'var(--clr-ai)', fontWeight: 'bold', textAlign: isRtl ? 'right' : 'left', borderBottom: '1px solid var(--border-subtle)' }}>
                {t('metric_dcs')}
              </td>
            </tr>
            <tr style={{ backgroundColor: 'rgba(255,255,255,0.01)' }}>
              <td style={{ padding: '10px 6px', fontWeight: 'bold', borderInlineEnd: '1px solid var(--border-subtle)', textAlign: isRtl ? 'right' : 'left' }}>
                {labelControl}
              </td>
              <td style={{ padding: '10px 4px', color: 'var(--clr-harm)', fontWeight: 'bold', borderInlineEnd: '1px solid var(--border-subtle)' }}>1.50</td>
              <td style={{ padding: '10px 4px', color: 'var(--clr-harm)', fontWeight: 'bold' }}>1.27</td>
            </tr>
            <tr style={{ borderBottom: '1px solid var(--border-subtle)', backgroundColor: 'rgba(255,255,255,0.01)' }}>
              <td style={{ padding: '10px 6px', fontWeight: 'bold', borderInlineEnd: '1px solid var(--border-subtle)', textAlign: isRtl ? 'right' : 'left' }}>
                {labelPcbt}
              </td>
              <td style={{ padding: '10px 4px', color: 'var(--clr-safe)', fontWeight: 'bold', borderInlineEnd: '1px solid var(--border-subtle)' }}>0.37</td>
              <td style={{ padding: '10px 4px', color: '#f59e0b', fontWeight: 'bold' }}>0.82</td>
            </tr>

            {/* -------------------- HES -------------------- */}
            <tr>
              <td colSpan="3" style={{ padding: '6px 8px', backgroundColor: 'rgba(244, 63, 94, 0.1)', color: 'var(--clr-harm)', fontWeight: 'bold', textAlign: isRtl ? 'right' : 'left', borderBottom: '1px solid var(--border-subtle)' }}>
                {t('metric_hes')}
              </td>
            </tr>
            <tr style={{ backgroundColor: 'rgba(255,255,255,0.01)' }}>
              <td style={{ padding: '10px 6px', fontWeight: 'bold', borderInlineEnd: '1px solid var(--border-subtle)', textAlign: isRtl ? 'right' : 'left' }}>
                {labelControl}
              </td>
              <td style={{ padding: '10px 4px', color: 'var(--clr-harm)', fontWeight: 'bold', borderInlineEnd: '1px solid var(--border-subtle)' }}>1.25</td>
              <td style={{ padding: '10px 4px', color: 'var(--clr-harm)', fontWeight: 'bold' }}>1.15</td>
            </tr>
            <tr style={{ borderBottom: '1px solid var(--border-subtle)', backgroundColor: 'rgba(255,255,255,0.01)' }}>
              <td style={{ padding: '10px 6px', fontWeight: 'bold', borderInlineEnd: '1px solid var(--border-subtle)', textAlign: isRtl ? 'right' : 'left' }}>
                {labelPcbt}
              </td>
              <td style={{ padding: '10px 4px', color: 'var(--clr-safe)', fontWeight: 'bold', borderInlineEnd: '1px solid var(--border-subtle)' }}>0.24</td>
              <td style={{ padding: '10px 4px', color: '#f59e0b', fontWeight: 'bold' }}>0.65</td>
            </tr>

            {/* -------------------- SIS -------------------- */}
            <tr>
              <td colSpan="3" style={{ padding: '6px 8px', backgroundColor: 'rgba(16, 185, 129, 0.1)', color: 'var(--clr-safe)', fontWeight: 'bold', textAlign: isRtl ? 'right' : 'left', borderBottom: '1px solid var(--border-subtle)' }}>
                {t('metric_sis')}
              </td>
            </tr>
            <tr style={{ backgroundColor: 'rgba(255,255,255,0.01)' }}>
              <td style={{ padding: '10px 6px', fontWeight: 'bold', borderInlineEnd: '1px solid var(--border-subtle)', textAlign: isRtl ? 'right' : 'left' }}>
                {labelControl}
              </td>
              <td style={{ padding: '10px 4px', color: 'var(--text-secondary)', fontWeight: 'bold', borderInlineEnd: '1px solid var(--border-subtle)' }}>0.56</td>
              <td style={{ padding: '10px 4px', color: 'var(--text-secondary)', fontWeight: 'bold' }}>0.04</td>
            </tr>
            <tr style={{ backgroundColor: 'rgba(255,255,255,0.01)' }}>
              <td style={{ padding: '10px 6px', fontWeight: 'bold', borderInlineEnd: '1px solid var(--border-subtle)', textAlign: isRtl ? 'right' : 'left' }}>
                {labelPcbt}
              </td>
              <td style={{ padding: '10px 4px', color: 'var(--clr-safe)', fontWeight: 'bold', borderInlineEnd: '1px solid var(--border-subtle)' }}>1.81</td>
              <td style={{ padding: '10px 4px', color: '#f59e0b', fontWeight: 'bold' }}>0.69</td>
            </tr>

          </tbody>
        </table>
      </div>

      <h3 style={{ fontSize: '16px', fontWeight: '700', margin: '20px 0 12px', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '8px' }}>
        {t('insight_title')}
      </h3>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <div style={{ background: 'rgba(16, 185, 129, 0.05)', borderInlineStart: '4px solid var(--clr-safe)', padding: '12px', borderRadius: '6px' }}>
          <div style={{ fontWeight: '700', color: 'var(--clr-safe)', fontSize: '14px', marginBottom: '4px' }}>{t('insight_1_title')}</div>
          <div style={{ color: 'var(--text-primary)', fontSize: '13px', lineHeight: '1.4' }}>{t('insight_1_text')}</div>
        </div>

        <div style={{ background: 'rgba(245, 158, 11, 0.05)', borderInlineStart: '4px solid #f59e0b', padding: '12px', borderRadius: '6px' }}>
          <div style={{ fontWeight: '700', color: '#f59e0b', fontSize: '14px', marginBottom: '4px' }}>{t('insight_2_title')}</div>
          <div style={{ color: 'var(--text-primary)', fontSize: '13px', lineHeight: '1.4' }}>{t('insight_2_text')}</div>
        </div>
      </div>

      {/* ===== סקשן תרשימים סטטיסטיים (תמונות PNG) ===== */}
      {GRAPHS.length > 0 && (
        <>
          <h3 style={{ fontSize: '16px', fontWeight: '700', margin: '24px 0 12px', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '8px' }}>
            {isRtl ? '📊 תרשימים סטטיסטיים' : '📊 Statistical Graphs'}
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px' }}>
            {GRAPHS.map(({ src, name }) => (
              <figure
                key={name}
                style={{
                  margin: 0,
                  background: 'var(--bg-surface)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-md)',
                  overflow: 'hidden',
                }}
              >
                <img src={src} alt={captionFor(name)} style={{ display: 'block', width: '100%', height: 'auto' }} />
                <figcaption style={{ padding: '8px 10px', fontSize: '12px', color: 'var(--text-secondary)', textAlign: 'center', lineHeight: '1.4' }}>
                  {captionFor(name)}
                </figcaption>
              </figure>
            ))}
          </div>
        </>
      )}
      {/* Footer Bar - Open Science & Collaboration */}
      <div style={{
        marginTop: '60px',
        padding: '30px 20px',
        background: 'var(--bg-surface)',
        borderTop: '3px solid var(--clr-safe)',
        textAlign: 'center',
        boxShadow: '0 -4px 20px rgba(0,0,0,0.03)'
      }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <div style={{ fontWeight: '700', fontSize: '16px', color: 'var(--text-primary)', marginBottom: '8px' }}>
            {t('footer_open_science')}
          </div>
          <div style={{ fontSize: '15px', color: 'var(--text-secondary)', marginBottom: '24px' }}>
            {t('footer_collab')}
          </div>
          
          <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', flexWrap: 'wrap' }}>
            {/* Email Button */}
            <a 
              href="mailto:moriahtova@mail.huji.ac.il,david.reichenberg@mail.huji.ac.il?subject=AI-Psychosis Research Project" 
              style={{ 
                backgroundColor: '#4f46e5', /* כחול-אינדיגו אקדמי ומרשים */
                color: 'white', 
                textDecoration: 'none', 
                display: 'flex', 
                alignItems: 'center', 
                gap: '8px', 
                padding: '12px 24px', 
                borderRadius: '8px', 
                fontWeight: '600',
                transition: 'transform 0.2s ease',
                boxShadow: '0 4px 12px rgba(79, 70, 229, 0.3)'
              }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
              {t('footer_email')}
            </a>

            {/* GitHub Button */}
            <a 
              href="https://github.com/MoriahTDaniel/AI-Psychosis-Baseline" 
              target="_blank" 
              rel="noopener noreferrer"
              style={{ 
                backgroundColor: '#24292e', 
                color: 'white', 
                textDecoration: 'none', 
                display: 'flex', 
                alignItems: 'center', 
                gap: '8px', 
                padding: '12px 24px', 
                borderRadius: '8px', 
                fontWeight: '600',
                transition: 'transform 0.2s ease',
                boxShadow: '0 4px 12px rgba(36, 41, 46, 0.3)'
              }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.03c3.15-.38 6.5-1.4 6.5-7.1a5.8 5.8 0 0 0-1.5-3.8 5.4 5.4 0 0 0-.1-3.7s-1.2-.4-3.9 1.4a13.3 13.3 0 0 0-7 0c-2.7-1.8-3.9-1.4-3.9-1.4a5.4 5.4 0 0 0-.1 3.7 5.8 5.8 0 0 0-1.5 3.8c0 5.7 3.3 6.7 6.5 7.1a4.8 4.8 0 0 0-1 3.03V22"></path><path d="M9 20c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>
              {t('footer_github')}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}