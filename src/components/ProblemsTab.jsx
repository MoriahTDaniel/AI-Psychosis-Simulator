import React from 'react';
import HeaderImage from './HeaderImage';
import nytImage from '../assets/chatbot-delusional-spiral.png'; 
import rollingImage from '../assets/kenrick-mills-rH5zlDunoFQ-unsplash.jpg'; 

export default function ProblemsTab({ t }) {
  return (
    <div className="panel-card" style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
      
      {/* 1. Scientific Background - Qualitative */}
      <section>
        <h2 style={{ marginBottom: '16px', fontSize: '20px', fontWeight: '700', letterSpacing: '-0.5px' }}>
          {t('intro_title')}
        </h2>
        <p style={{ lineHeight: '1.7', color: 'var(--text-primary)', fontSize: '15px' }}>
          {t('intro_text')}
        </p>
      </section>

      {/* 2. Crisis Cases */}

      {/* נחליף את המיכל הקודם במבנה של Dropdown */}
<details style={{ marginBottom: '40px', cursor: 'pointer' }}>
  <summary style={{ fontWeight: '700', fontSize: '18px', color: 'var(--clr-harm)', marginBottom: '12px' }}>
    {t('crisis_title')} (לחץ להצגת מקרים)
  </summary>
  
  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px'}}>
    {/* כאן יכנסו ה-Cards של אלן ברוקס ושל קאט */}
    {/* ... (הקוד של הכרטיסיות שכתבנו קודם) ... */}
          
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
          
          {/* Case 1: NYT */}
          <div style={{ background: 'var(--bg-secondary, rgba(255,255,255,0.03))', border: '1px solid var(--border-subtle, #333)', borderRadius: '12px', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
            <div style={{ width: '100%', height: '160px', backgroundColor: '#222', backgroundImage: `url(${nytImage})`, backgroundSize: 'cover', backgroundPosition: 'center', borderBottom: '1px solid var(--border-subtle, #333)' }}></div>
            <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
              <span style={{ fontSize: '16px', fontWeight: '700', marginBottom: '12px' }}>{t('case_1_title')}</span>
              <p style={{ fontSize: '14.5px', color: 'var(--text-secondary)', marginBottom: '20px', lineHeight: '1.6', flexGrow: 1 }}>
                {t('case_1_text')}
              </p>
              <a href={t('case_1_url')} target="_blank" rel="noopener noreferrer" style={{ color: '#3b82f6', textDecoration: 'none', fontSize: '13px', fontWeight: '500', display: 'inline-flex', alignItems: 'center' }}>
                {t('case_1_link')}
              </a>
            </div>
          </div>

          {/* Case 2: Rolling Stone */}
          <div style={{ background: 'var(--bg-secondary, rgba(255,255,255,0.03))', border: '1px solid var(--border-subtle, #333)', borderRadius: '12px', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
            <div style={{ width: '100%', height: '160px', backgroundColor: '#222', backgroundImage: `url(${rollingImage})`, backgroundSize: 'cover', backgroundPosition: 'center', borderBottom: '1px solid var(--border-subtle, #333)' }}></div>
            <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
              <span style={{ fontSize: '16px', fontWeight: '700', marginBottom: '12px' }}>{t('case_2_title')}</span>
              <p style={{ fontSize: '14.5px', color: 'var(--text-secondary)', marginBottom: '20px', lineHeight: '1.6', flexGrow: 1 }}>
                {t('case_2_text')}
              </p>
              <a href={t('case_2_url')} target="_blank" rel="noopener noreferrer" style={{ color: '#3b82f6', textDecoration: 'none', fontSize: '13px', fontWeight: '500', display: 'inline-flex', alignItems: 'center' }}>
                {t('case_2_link')}
              </a>
            </div>
          </div>

        </div>

      </div>
</details>

      {/* 3. Scientific Background - Quantitative Evidence */}
      <section style={{ marginBottom: '16px' }}>
        <h3 style={{ marginBottom: '12px', fontSize: '18px', fontWeight: '700' }}>
          {t('evidence_title')}
        </h3>
        <p style={{ lineHeight: '1.7', color: 'var(--text-primary)', fontSize: '15px', margin: 0 }}>
          {t('evidence_text')}
        </p>
      </section>

      {/* 4 & 5. Research Question & Solution (The Blue Box) */}
      <section style={{ 
          borderRight: document.body.style.direction === 'rtl' ? '4px solid var(--clr-ai)' : 'none', 
          borderLeft: document.body.style.direction === 'ltr' ? '4px solid var(--clr-ai)' : 'none', 
          backgroundColor: 'rgba(99, 102, 241, 0.04)', 
          padding: '24px', 
          borderRadius: '8px'
        }}>
        <div style={{ color: 'var(--clr-ai)', fontWeight: '700', fontSize: '16px', marginBottom: '8px' }}>
          {t('research_question_title')}
        </div>
        <p style={{ fontSize: '15px', margin: '0 0 24px 0', lineHeight: '1.6' }}>
          {t('research_question_text')}
        </p>
        {/*  Solution (The Blue Box) 
        <div style={{ color: 'var(--clr-safe)', fontWeight: '700', fontSize: '16px', marginBottom: '8px' }}>
          {t('solution_title')}
        </div>
        <p style={{ fontSize: '15px', margin: 0, lineHeight: '1.6' }}>
          {t('solution_text')}
        </p>*/}
      </section>
      

<section style={{ textAlign: 'center' }}>
  <button 
    onClick={() => window.location.href = '/simulator'} // או שימוש ב-history/Link של React Router
    style={{
      backgroundColor: 'var(--clr-ai)',
      color: '#fff',
      padding: '16px 32px',
      borderRadius: '30px',
      border: 'none',
      fontSize: '16px',
      fontWeight: '700',
      cursor: 'pointer',
      boxShadow: '0 4px 12px rgba(99, 102, 241, 0.3)',
      transition: 'transform 0.2s'
    }}
    onMouseOver={(e) => e.target.style.transform = 'scale(1.05)'}
    onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
  >
    {t('btn_go_to_simulator')}
  </button>
</section>


      {/* 7. Academic References */}
      <section style={{ borderTop: '1px solid var(--border-subtle, #333)', paddingTop: '24px' }}>
        <h3 style={{ marginBottom: '16px', fontSize: '16px', fontWeight: '700', color: 'var(--text-secondary)' }}>
          {t('references_title')}
        </h3>
        <ul style={{ paddingInlineStart: '20px', margin: 0, color: 'var(--text-secondary)', fontSize: '13px', lineHeight: '2' }}>
          <li>{t('references_text_1')}</li>
          <li>{t('references_text_2')}</li>
          <li>{t('references_text_3')}</li>
          <li>{t('references_text_4')}</li>
          <li>{t('references_text_5')}</li>
        </ul>
      </section>

   {/* 6. Podcast CTA */}
      <section>
        <a 
          href="https://osimhistoria.com/podcast/%D7%A9%D7%92%D7%A2%D7%95%D7%9F-%D7%91%D7%A9%D7%A0%D7%99%D7%99%D7%9D-%D7%A4%D7%A1%D7%99%D7%9B%D7%95%D7%96%D7%94-%D7%98%D7%9B%D7%A0%D7%95%D7%9C%D7%95%D7%92%D7%99%D7%AA-%D7%A2%D7%95%D7%A9%D7%99%D7%9D/"
          target="_blank" 
          rel="noopener noreferrer"
          style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(16, 185, 129, 0.05)', border: '1px dashed var(--clr-safe)', padding: '16px', borderRadius: '12px', color: 'var(--clr-safe)', textDecoration: 'none', fontSize: '14px', fontWeight: '500', transition: 'all 0.2s' }}
        >
          {t('podcast_cta')}
        </a>
      </section>
    </div>
  );
}