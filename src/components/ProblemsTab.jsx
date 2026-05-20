import React from 'react';
import HeaderImage from './HeaderImage'
export default function ProblemsTab({ t }) {
  return (
    
    <div className="panel-card">
      <h2> {t('intro_title')}</h2>
      <p style={{ marginBottom: '20px' }}>{t('intro_text')}</p>
      <div style={{ borderRight: '4px solid var(--clr-ai)', borderLeft: document.body.style.direction === 'ltr' ? '4px solid var(--clr-ai)' : 'none', backgroundColor: 'rgba(99, 102, 241, 0.03)', padding: '12px', borderRadius: '6px', marginBottom: '30px' }}>
        <div style={{ color: 'var(--clr-ai)', fontWeight: '700', fontSize: '14px', marginBottom: '4px' }}>{t('research_question_title')}</div>
        <p style={{ fontSize: '13px', margin: 0 }}>{t('research_question_text')}</p>
      </div>
      
      <h3 style={{ marginBottom: '12px', fontSize: '15px', fontWeight: '700' }}>{t('crisis_title')}</h3>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '30px' }}>
        <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-subtle)', padding: '12px', borderRadius: '8px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
            <span style={{ fontSize: '13.5px', fontWeight: '700' }}>{t('case_eliza_title')}</span>
            <span style={{ fontSize: '11px', backgroundColor: 'rgba(244, 63, 94, 0.1)', color: 'var(--clr-harm)', padding: '2px 6px', borderRadius: '4px', fontWeight: '700' }}>{t('case_eliza_tag')}</span>
          </div>
          <p style={{ fontSize: '12.5px', color: 'var(--text-secondary)', marginBottom: '8px' }}>{t('case_eliza_text')}</p>
          <a href={t('case_eliza_url')} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--clr-ai)', textDecoration: 'none', fontSize: '12px', fontWeight: '700' }}>
            {t('case_eliza_link')}
          </a>
        </div>
        
        <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-subtle)', padding: '12px', borderRadius: '8px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
            <span style={{ fontSize: '13.5px', fontWeight: '700' }}>{t('case_char_title')}</span>
            <span style={{ fontSize: '11px', backgroundColor: 'rgba(244, 63, 94, 0.1)', color: 'var(--clr-harm)', padding: '2px 6px', borderRadius: '4px', fontWeight: '700' }}>{t('case_char_tag')}</span>
          </div>
          <p style={{ fontSize: '12.5px', color: 'var(--text-secondary)', marginBottom: '8px' }}>{t('case_char_text')}</p>
          <a href={t('case_char_url')} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--clr-ai)', textDecoration: 'none', fontSize: '12px', fontWeight: '700' }}>
            {t('case_char_link')}
          </a>
        </div>
      </div>
      
      <a 
        href="https://osimhistoria.com/podcast/%D7%A9%D7%92%D7%A2%D7%95%D7%9F-%D7%91%D7%A9%D7%A0%D7%99%D7%99%D7%9D-%D7%A4%D7%A1%D7%99%D7%9B%D7%95%D7%96%D7%94-%D7%98%D7%9B%D7%A0%D7%95%D7%9C%D7%95%D7%92%D7%99%D7%AA-%D7%A2%D7%95%D7%A9%D7%99%D7%9D/"
        target="_blank" 
        rel="noopener noreferrer"
        style={{ display: 'block', backgroundColor: 'rgba(16, 185, 129, 0.05)', border: '1px dashed var(--clr-safe)', padding: '12px', borderRadius: '8px', color: 'var(--clr-safe)', textDecoration: 'none', fontSize: '13px', fontWeight: '700', textAlign: 'center', transition: 'all 0.2s' }}
      >
        {t('podcast_cta')}
      </a>
    </div>
  );
}