import { AttemptLangs } from '../constants';

export function getEditorLang(lang: string) {
  return {
    [AttemptLangs.PYTHON]: 'python',
    [AttemptLangs.HASKELL]: 'haskel',
    [AttemptLangs.KOTLIN]: 'kotlin',
    [AttemptLangs.CSHARP]: 'csharp',
    [AttemptLangs.JS]: 'javascript',
  }[lang] || lang;
}
