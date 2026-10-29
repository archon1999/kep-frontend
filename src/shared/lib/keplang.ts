import type { Monaco } from '@monaco-editor/react';

export const registerKEPLang = (monaco: Monaco) => {
  if (monaco.languages.getLanguages().some(({ id }: { id: string }) => id === 'keplang')) return;
  monaco.languages.register({ id: 'keplang', extensions: ['.kep'], aliases: ['KEPLang'] });
  monaco.languages.setLanguageConfiguration('keplang', {
    comments: { lineComment: '//' },
    brackets: [
      ['{', '}'],
      ['[', ']'],
      ['(', ')'],
    ],
    autoClosingPairs: [
      { open: '{', close: '}' },
      { open: '[', close: ']' },
      { open: '(', close: ')' },
      { open: '"', close: '"' },
    ],
  });
  monaco.languages.setMonarchTokensProvider('keplang', {
    keywords: [
      'agar',
      'bosa',
      'bomasa',
      'to',
      'toki',
      'bolincha',
      'aylan',
      'shundat',
      'qaytar',
      'toxta',
      'davom',
      'at',
    ],
    types: ['son', 'matn', 'mantiq', 'lugat', 'toplam'],
    builtins: [
      'uqi',
      'al',
      'al_soz',
      'al_satr',
      'chiqar',
      'uzunligi',
      'sarala',
      'qosh',
      'bomi',
      'uchir',
      'qiymat',
    ],
    tokenizer: {
      root: [
        [/\/\/.*$/, 'comment'],
        [/"(?:[^"\\]|\\.)*"/, 'string'],
        [/\b(?:rast|yalgan)\b/, 'keyword'],
        [
          /[a-zA-Z_]\w*/,
          {
            cases: {
              '@keywords': 'keyword',
              '@types': 'type',
              '@builtins': 'predefined',
              '@default': 'identifier',
            },
          },
        ],
        [/\d+/, 'number'],
        [/[{}()[\]]/, '@brackets'],
        [/[+\-*/%=!<>|&.]+/, 'operator'],
      ],
    },
  });
};
