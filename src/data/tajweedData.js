export const TAJWEED_RULES = {
  'h': {
    label: 'Hamzat ul Wasl',
    color: '#AAAAAA',
    css: 'ham_wasl',
    description: 'The connecting Hamzah. It is dropped (silent) when continuing from the previous word.',
    example: '[h[ٱ]لْحَمْدُ'
  },
  's': {
    label: 'Silent',
    color: '#AAAAAA',
    css: 'slnt',
    description: 'Letters that are written but not pronounced.',
    example: 'أُولَ[s[ـٰ]ئِكَ'
  },
  'l': {
    label: 'Lam Shamsiyyah',
    color: '#AAAAAA',
    css: 'slnt',
    description: 'The Lam of "Al" is silent when followed by a Sun letter. The Sun letter is emphasized.',
    example: 'وَ[l[ٱ]لشَّمْسِ'
  },
  'n': {
    label: 'Normal Prolongation (2)',
    color: '#537FFF',
    css: 'madda_normal',
    description: 'Natural extension of the vowel sound for 2 counts (Al-Madd Al-Tabi\'i).',
    example: 'قَا[n[ا]لَ'
  },
  'p': {
    label: 'Permissible Prolongation',
    color: '#4050FF',
    css: 'madda_permissible',
    description: 'Extension that can be 2, 4, or 5 counts (Madd Jaiz Munfasil). Occurs when a Madd letter is followed by Hamzah in the next word.',
    example: 'وَمَ[p[ا] أَنزَلَ'
  },
  'm': {
    label: 'Necessary Prolongation (6)',
    color: '#000EBC',
    css: 'madda_necessary',
    description: 'Must be extended for 6 counts (Madd Lazim). Occurs when a Madd letter is followed by a non-voweled letter (Sukoon/Shaddah).',
    example: 'ٱلْحَ[m[آ]قَّةُ'
  },
  'q': {
    label: 'Qalaqah (Echo)',
    color: '#DD0008',
    css: 'qlq',
    description: 'Echoing or bouncing sound produced when Qaf, Taa, Ba, Jeem, or Dal has a Sukoon.',
    example: 'ٱلْفَلَ[q[قِ]'
  },
  'o': {
    label: 'Obligatory Prolongation',
    color: '#2144C1',
    css: 'madda_pbligatory', // typo in original code preserved for compatibility
    description: 'Must be extended for 4 or 5 counts (Madd Wajib Muttasil). Occurs when a Madd letter and Hamzah are in the same word.',
    example: 'السَّمَ[o[آ]ءِ'
  },
  'c': {
    label: 'Ikhafa\' Shafawi',
    color: '#D500B7',
    css: 'ikhf_shfw',
    description: 'Hiding the Meem Saakin when followed by Ba, with Ghunnah.',
    example: 'تَرْمِيهِم [c[بِ]حِجَارَةٍ'
  },
  'f': {
    label: 'Ikhafa\'',
    color: '#9400A8',
    css: 'ikhf',
    description: 'Hiding the Noon Saakin or Tanween when followed by any of the 15 Ikhafa letters, with Ghunnah.',
    example: 'مِ[f[ن] شَرِّ'
  },
  'w': {
    label: 'Idgham Shafawi',
    color: '#58B800',
    css: 'idghm_shfw',
    description: 'Merging Meem Saakin into a following Meem, with Ghunnah.',
    example: 'لَهُم [w[مَّ]ا'
  },
  'i': {
    label: 'Iqlab',
    color: '#26BFFD',
    css: 'iqlb',
    description: 'Changing Noon Saakin or Tanween into a Meem when followed by Ba, with Ghunnah.',
    example: 'مِ[i[ن]ۢ بَعْدِ'
  },
  'a': {
    label: 'Idgham (w/ Ghunnah)',
    color: '#169777',
    css: 'idgh_ghn',
    description: 'Merging Noon Saakin or Tanween into Ya, Noon, Meem, or Waw, with nasal sound (Ghunnah).',
    example: 'مَ[a[ن] يَقُولُ'
  },
  'u': {
    label: 'Idgham (No Ghunnah)',
    color: '#169200',
    css: 'idgh_w_ghn',
    description: 'Merging Noon Saakin or Tanween into Lam or Ra, without nasal sound.',
    example: 'مِّ[u[ن] رَّبِّهِمْ'
  },
  'd': {
    label: 'Idgham Mutajanisayn',
    color: '#A1A1A1',
    css: 'idgh_mus',
    description: 'Merging two letters that share the same point of articulation but have different attributes.',
    example: 'أَثْقَلَ[d[ت] دَّعَوَا'
  },
  'b': {
    label: 'Idgham Mutaqaribayn',
    color: '#A1A1A1',
    css: 'idgh_mus',
    description: 'Merging two letters that are close in point of articulation and attributes.',
    example: 'قُ[b[ل] رَّبِّ'
  },
  'g': {
    label: 'Ghunnah (2)',
    color: '#FF7E1E',
    css: 'ghn',
    description: 'Nasal sound for 2 counts on Noon or Meem that has a Shaddah.',
    example: 'إِ[g[نَّ]'
  }
};

// Helper for array format used in Legend
export const getTajweedRulesArray = () => {
  return Object.entries(TAJWEED_RULES).map(([key, rule]) => ({
    type: key,
    ...rule
  }));
};
