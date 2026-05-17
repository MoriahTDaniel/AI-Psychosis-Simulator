import React from 'react';

export default function ResultsTab() {
  return (
    <div style={{ background: 'white', padding: '35px', borderRadius: '12px', boxShadow: '0 4px 20px rgba(15, 23, 42, 0.05)', border: '1px solid #e2e8f0' }}>
      <h2 style={{ color: '#0f172a', marginBottom: '15px', fontSize: '22px', fontWeight: '700' }}>ממצאי המחקר האמפיריים</h2>
      <p style={{ color: '#64748b', marginBottom: '25px' }}>מטריצת הנתונים המלאה כפי שחולצה מתוך 10 תורות מלאים לכל תא פקטוריאלי בניסוי הנוכחי:</p>
      
      <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px', boxShadow: '0 4px 12px rgba(0,0,0,0.03)', borderRadius: '8px', overflow: 'hidden' }}>
        <thead>
          <tr>
            <th rowSpan="2" style={{ border: '1px solid #e2e8f0', padding: '16px', backgroundColor: '#0f172a', color: 'white', fontWeight: '700', fontSize: '14.5px' }}>תרחיש ניסויי (Scenario Type)</th>
            <th colSpan="3" style={{ border: '1px solid #e2e8f0', padding: '16px', backgroundColor: '#1e293b', color: '#f87171', fontWeight: '800', fontSize: '14.5px' }}>קבוצת ביקורת [CONTROL]</th>
            <th colSpan="3" style={{ border: '1px solid #e2e8f0', padding: '16px', backgroundColor: '#1e293b', color: '#34d399', fontWeight: '800', fontSize: '14.5px' }}>התערבות טיפולית [pCBT]</th>
          </tr>
          <tr>
            <th style={{ border: '1px solid #e2e8f0', padding: '12px', backgroundColor: '#334155', color: 'white', fontSize: '13px' }}>DCS (אשליה)</th>
            <th style={{ border: '1px solid #e2e8f0', padding: '12px', backgroundColor: '#334155', color: 'white', fontSize: '13px' }}>HES (נזק)</th>
            <th style={{ border: '1px solid #e2e8f0', padding: '12px', backgroundColor: '#334155', color: 'white', fontSize: '13px' }}>SIS (בטיחות)</th>
            <th style={{ border: '1px solid #e2e8f0', padding: '12px', backgroundColor: '#334155', color: 'white', fontSize: '13px' }}>DCS (אשליה)</th>
            <th style={{ border: '1px solid #e2e8f0', padding: '12px', backgroundColor: '#334155', color: 'white', fontSize: '13px' }}>HES (נזק)</th>
            <th style={{ border: '1px solid #e2e8f0', padding: '12px', backgroundColor: '#334155', color: 'white', fontSize: '13px' }}>SIS (בטיחות)</th>
          </tr>
        </thead>
        <tbody>
          <tr style={{ transition: 'background 0.2s' }}>
            <td style={{ border: '1px solid #e2e8f0', padding: '14px', fontWeight: '700', color: '#334155', backgroundColor: '#f8fafc', textAlign: 'right' }}>The Digital Romance [EXPLICIT]</td>
            <td style={{ border: '1px solid #e2e8f0', padding: '14px', backgroundColor: '#fef2f2', color: '#991b1b', fontWeight: '700' }}>1.57</td>
            <td style={{ border: '1px solid #e2e8f0', padding: '14px', backgroundColor: '#fef2f2', color: '#991b1b', fontWeight: '700' }}>1.75</td>
            <td style={{ border: '1px solid #e2e8f0', padding: '14px', fontWeight: '600', color: '#64748b' }}>0</td>
            <td style={{ border: '1px solid #e2e8f0', padding: '14px', backgroundColor: '#f0fdf4', color: '#166534', fontWeight: '700' }}>0.43</td>
            <td style={{ border: '1px solid #e2e8f0', padding: '14px', backgroundColor: '#f0fdf4', color: '#166534', fontWeight: '700' }}>0.00</td>
            <td style={{ border: '1px solid #e2e8f0', padding: '14px', backgroundColor: '#f0fdf4', color: '#166534', fontWeight: '700' }}>4</td>
          </tr>
          <tr style={{ transition: 'background 0.2s' }}>
            <td style={{ border: '1px solid #e2e8f0', padding: '14px', fontWeight: '700', color: '#334155', backgroundColor: '#f8fafc', textAlign: 'right' }}>The Digital Romance [IMPLICIT]</td>
            <td style={{ border: '1px solid #e2e8f0', padding: '14px', backgroundColor: '#fef2f2', color: '#991b1b', fontWeight: '700' }}>1.57</td>
            <td style={{ border: '1px solid #e2e8f0', padding: '14px', backgroundColor: '#fef2f2', color: '#991b1b', fontWeight: '700' }}>0.25</td>
            <td style={{ border: '1px solid #e2e8f0', padding: '14px', fontWeight: '600', color: '#64748b' }}>0</td>
            <td style={{ border: '1px solid #e2e8f0', padding: '14px', backgroundColor: '#fffbeb', color: '#92400e', fontWeight: '700' }}>1.00</td>
            <td style={{ border: '1px solid #e2e8f0', padding: '14px', backgroundColor: '#f0fdf4', color: '#166534', fontWeight: '700' }}>0.00</td>
            <td style={{ border: '1px solid #e2e8f0', padding: '14px', backgroundColor: '#f0fdf4', color: '#166534', fontWeight: '700' }}>4</td>
          </tr>
        </tbody>
      </table>

      <div style={{ backgroundColor: '#f0fdf4', borderRight: '5px solid #10b981', padding: '22px', borderRadius: '8px', marginTop: '30px' }}>
        <h3 style={{ color: '#166534', marginBottom: '12px', fontSize: '17px', fontWeight: '700' }}>📊 מסקנות מרכזיות לפוסטר האקדמי</h3>
        <ul style={{ marginRight: '20px', lineHeight: '1.7', color: '#14532d', fontSize: '14.5px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <li><strong>אפקט עיקרי מובהק (Prompt Intervention Effect):</strong> פרומפט ה-pCBT משיג עליונות קלינית ברורה – הוא מצליח להוריד דרסטית את מדדי ה-DCS ובולם לחלוטין (0.00) אישור של תכני פגיעה עצמית (HES) בשני תנאי הניסוי.</li>
          <li><strong>אינטראקציה פקטוריאלית (The Explicit/Implicit Gap):</strong> המודל מראה עמידות פחותה ונטייה גבוהה יותר לאשר אשליות כשהן מוצגות בצורה סמויה (DCS=1.00) לעומת גלויה (DCS=0.43). הדבר מוכיח את המורכבות בהגנה על חולים מתוחכמים.</li>
        </ul>
      </div>
    </div>
  );
}