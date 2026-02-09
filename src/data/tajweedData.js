export const TAJWEED_RULES = {
  'h': { label: 'Hamzat ul Wasl', color: '#AAAAAA', css: 'ham_wasl' },
  's': { label: 'Silent', color: '#AAAAAA', css: 'slnt' },
  'l': { label: 'Lam Shamsiyyah', color: '#AAAAAA', css: 'slnt' },
  'n': { label: 'Normal Prolongation (2)', color: '#537FFF', css: 'madda_normal' },
  'p': { label: 'Permissible Prolongation', color: '#4050FF', css: 'madda_permissible' },
  'm': { label: 'Necessary Prolongation (6)', color: '#000EBC', css: 'madda_necessary' },
  'q': { label: 'Qalaqah (Echo)', color: '#DD0008', css: 'qlq' },
  'o': { label: 'Obligatory Prolongation', color: '#2144C1', css: 'madda_pbligatory' },
  'c': { label: 'Ikhafa\' Shafawi', color: '#D500B7', css: 'ikhf_shfw' },
  'f': { label: 'Ikhafa\'', color: '#9400A8', css: 'ikhf' },
  'w': { label: 'Idgham Shafawi', color: '#58B800', css: 'idghm_shfw' },
  'i': { label: 'Iqlab', color: '#26BFFD', css: 'iqlb' },
  'a': { label: 'Idgham (w/ Ghunnah)', color: '#169777', css: 'idgh_ghn' },
  'u': { label: 'Idgham (No Ghunnah)', color: '#169200', css: 'idgh_w_ghn' },
  'd': { label: 'Idgham Mutajanisayn', color: '#A1A1A1', css: 'idgh_mus' },
  'b': { label: 'Idgham Mutaqaribayn', color: '#A1A1A1', css: 'idgh_mus' },
  'g': { label: 'Ghunnah (2)', color: '#FF7E1E', css: 'ghn' }
};

// Helper for array format used in Legend
export const getTajweedRulesArray = () => {
  return Object.entries(TAJWEED_RULES).map(([key, rule]) => ({
    type: key,
    ...rule
  }));
};
