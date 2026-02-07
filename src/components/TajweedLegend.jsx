import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Info } from 'lucide-react';

const TAJWEED_RULES = [
  { type: 'hamza-wasl', label: 'Hamzat ul Wasl / Silent', color: '#AAAAAA', css: 'ham_wasl' },
  { type: 'laam-shamsiyah', label: 'Lam Shamsiyyah', color: '#AAAAAA', css: 'slnt' }, // Using slnt as proxy if l is mapped to slnt
  { type: 'madda-normal', label: 'Normal Prolongation (2)', color: '#537FFF', css: 'madda_normal' },
  { type: 'madda-permissible', label: 'Permissible Prolongation (2,4,6)', color: '#4050FF', css: 'madda_permissible' },
  { type: 'madda-obligatory', label: 'Obligatory Prolongation (4-5)', color: '#2144C1', css: 'madda_pbligatory' },
  { type: 'madda-necessary', label: 'Necessary Prolongation (6)', color: '#000EBC', css: 'madda_necessary' },
  { type: 'qalaqah', label: 'Qalaqah (Echo)', color: '#DD0008', css: 'qlq' },
  { type: 'ikhafa-shafawi', label: 'Ikhafa\' Shafawi (Meem)', color: '#D500B7', css: 'ikhf_shfw' },
  { type: 'ikhafa', label: 'Ikhafa\'', color: '#9400A8', css: 'ikhf' },
  { type: 'idgham-shafawi', label: 'Idgham Shafawi (Meem)', color: '#58B800', css: 'idghm_shfw' },
  { type: 'iqlab', label: 'Iqlab', color: '#26BFFD', css: 'iqlb' },
  { type: 'idgham-ghunnah', label: 'Idgham (With Ghunnah)', color: '#169777', css: 'idgh_ghn' },
  { type: 'idgham-no-ghunnah', label: 'Idgham (No Ghunnah)', color: '#169200', css: 'idgh_w_ghn' },
  { type: 'idgham-mutajanisayn', label: 'Idgham Mutajanisayn', color: '#A1A1A1', css: 'idgh_mus' },
  { type: 'ghunnah', label: 'Ghunnah (2)', color: '#FF7E1E', css: 'ghn' },
];

const TajweedLegend = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="tajweed-legend" style={{
      backgroundColor: 'var(--color-bg-card)',
      border: '1px solid var(--color-border)',
      borderRadius: '0.5rem',
      marginBottom: '1.5rem',
      overflow: 'hidden'
    }}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          width: '100%',
          padding: '0.75rem 1rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          color: 'var(--color-text-main)',
          fontWeight: 600,
          fontSize: '0.9rem'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Info size={18} color="var(--color-primary)" />
          Tajweed Color Guide
        </div>
        {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
      </button>

      {isOpen && (
        <div style={{
          padding: '1rem',
          borderTop: '1px solid var(--color-border)',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
          gap: '0.75rem'
        }}>
          {TAJWEED_RULES.map((rule) => (
            <div key={rule.type} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{
                width: '16px',
                height: '16px',
                borderRadius: '4px',
                backgroundColor: rule.color,
                border: '1px solid rgba(0,0,0,0.1)'
              }}></span>
              <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                {rule.label}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TajweedLegend;
