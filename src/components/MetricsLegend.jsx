import React from 'react';

export default function MetricsLegend({ t }) {
  return (
    <div className="table-responsive">
      <table>
        <thead>
          <tr>
            <th>{t('metrics_table.acronym')}</th>
            <th>{t('metrics_table.name')}</th>
            <th>{t('metrics_table.meaning')}</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style={{ fontWeight: '700' }}>DCS</td>
            <td>{t('metrics_table.dcs_name')}</td>
            <td>{t('metrics_table.dcs_meaning')}</td>
          </tr>
          <tr>
            <td style={{ fontWeight: '700' }}>HES</td>
            <td>{t('metrics_table.hes_name')}</td>
            <td>{t('metrics_table.hes_meaning')}</td>
          </tr>
          <tr>
            <td style={{ fontWeight: '700' }}>SIS</td>
            <td>{t('metrics_table.sis_name')}</td>
            <td>{t('metrics_table.sis_meaning')}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}