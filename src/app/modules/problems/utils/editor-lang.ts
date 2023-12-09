import { AttemptLangs } from '../constants';

export function getEditorLang(lang: string) {
  return {
    [AttemptLangs.PYTHON]: 'python',
    [AttemptLangs.KOTLIN]: 'kotlin',
    [AttemptLangs.CSHARP]: 'csharp',
    [AttemptLangs.JS]: 'javascript',
    [AttemptLangs.RUST]: 'rust',
  }[lang] || lang;
}
