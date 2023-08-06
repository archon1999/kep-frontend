import { AttemptLangs } from "../enums/attempt-lang.enum";

export function getEditorLang(lang: string) {
    if (lang == AttemptLangs.CPP) {
      return 'cpp';
    } else if (lang == AttemptLangs.PYTHON) {
      return 'python';
    } else if (lang == AttemptLangs.HASKELL) {
      return 'haskell';
    } else if (lang == AttemptLangs.KOTLIN) {
      return 'kotlin';
    } else if (lang == AttemptLangs.CSHARP) {
      return 'csharp';
    }
    return lang;
  }