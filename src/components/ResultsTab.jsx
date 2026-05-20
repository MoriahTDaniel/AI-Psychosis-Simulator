import React from 'react';

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
        <h2 style={{ margin: 0 }}>📊 {t('results_title')}</h2>
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
              <td style={{ padding: '10px 4px', color: 'var(--clr-harm)', fontWeight: 'bold', borderInlineEnd: '1px solid var(--border-subtle)' }}>1.57</td>
              <td style={{ padding: '10px 4px', color: 'var(--clr-harm)', fontWeight: 'bold' }}>1.57</td>
            </tr>
            <tr style={{ borderBottom: '1px solid var(--border-subtle)', backgroundColor: 'rgba(255,255,255,0.01)' }}>
              <td style={{ padding: '10px 6px', fontWeight: 'bold', borderInlineEnd: '1px solid var(--border-subtle)', textAlign: isRtl ? 'right' : 'left' }}>
                {labelPcbt}
              </td>
              <td style={{ padding: '10px 4px', color: 'var(--clr-safe)', fontWeight: 'bold', borderInlineEnd: '1px solid var(--border-subtle)' }}>0.43</td>
              <td style={{ padding: '10px 4px', color: '#f59e0b', fontWeight: 'bold' }}>1.00</td>
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
              <td style={{ padding: '10px 4px', color: 'var(--clr-harm)', fontWeight: 'bold', borderInlineEnd: '1px solid var(--border-subtle)' }}>1.75</td>
              <td style={{ padding: '10px 4px', color: 'var(--clr-harm)', fontWeight: 'bold' }}>0.25</td>
            </tr>
            <tr style={{ borderBottom: '1px solid var(--border-subtle)', backgroundColor: 'rgba(255,255,255,0.01)' }}>
              <td style={{ padding: '10px 6px', fontWeight: 'bold', borderInlineEnd: '1px solid var(--border-subtle)', textAlign: isRtl ? 'right' : 'left' }}>
                {labelPcbt}
              </td>
              <td style={{ padding: '10px 4px', color: 'var(--clr-safe)', fontWeight: 'bold', borderInlineEnd: '1px solid var(--border-subtle)' }}>0.00</td>
              <td style={{ padding: '10px 4px', color: 'var(--clr-safe)', fontWeight: 'bold' }}>0.00</td>
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
              <td style={{ padding: '10px 4px', color: 'var(--text-secondary)', fontWeight: 'bold', borderInlineEnd: '1px solid var(--border-subtle)' }}>0</td>
              <td style={{ padding: '10px 4px', color: 'var(--text-secondary)', fontWeight: 'bold' }}>0</td>
            </tr>
            <tr style={{ backgroundColor: 'rgba(255,255,255,0.01)' }}>
              <td style={{ padding: '10px 6px', fontWeight: 'bold', borderInlineEnd: '1px solid var(--border-subtle)', textAlign: isRtl ? 'right' : 'left' }}>
                {labelPcbt}
              </td>
              <td style={{ padding: '10px 4px', color: 'var(--clr-safe)', fontWeight: 'bold', borderInlineEnd: '1px solid var(--border-subtle)' }}>4</td>
              <td style={{ padding: '10px 4px', color: 'var(--clr-safe)', fontWeight: 'bold' }}>4</td>
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
    </div>
  );
}