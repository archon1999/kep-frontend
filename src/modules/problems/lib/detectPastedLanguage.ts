import { AttemptLangs, ProblemAvailableLanguage } from '../domain/entities/problem.entity';

const NON_DETECTABLE_LANGUAGES = new Set([AttemptLangs.KEP, AttemptLangs.TEXT]);

const addScore = (
  scores: Map<string, number>,
  availableLanguages: Set<string>,
  lang: string,
  amount: number,
  condition: boolean,
) => {
  if (!condition || !availableLanguages.has(lang)) return;
  scores.set(lang, (scores.get(lang) ?? 0) + amount);
};

const countMatches = (source: string, pattern: RegExp) => {
  const matches = source.match(pattern);
  return matches?.length ?? 0;
};

export const detectPastedLanguage = (
  source: string,
  availableLanguages?: ProblemAvailableLanguage[],
  currentLang?: string | null,
) => {
  const normalizedSource = source.trim();
  if (!normalizedSource || !availableLanguages?.length) return null;

  const sourceLower = normalizedSource.toLowerCase();
  const availableSet = new Set(
    availableLanguages
      .map((language) => language.lang)
      .filter((language) => !NON_DETECTABLE_LANGUAGES.has(language as AttemptLangs)),
  );

  if (!availableSet.size) return null;

  const scores = new Map<string, number>();

  addScore(scores, availableSet, AttemptLangs.CPP, 2, /#include/.test(normalizedSource));
  addScore(scores, availableSet, AttemptLangs.CPP, 3, /std::/.test(normalizedSource));
  addScore(
    scores,
    availableSet,
    AttemptLangs.CPP,
    3,
    /using\s+namespace\s+std\s*;/.test(normalizedSource),
  );
  addScore(
    scores,
    availableSet,
    AttemptLangs.CPP,
    3,
    /\bcout\s*<<|\bcin\s*>>/.test(normalizedSource),
  );
  addScore(scores, availableSet, AttemptLangs.CPP, 2, /\bvector\s*</.test(normalizedSource));

  addScore(scores, availableSet, AttemptLangs.C, 3, /#include\s*<stdio\.h>/.test(normalizedSource));
  addScore(
    scores,
    availableSet,
    AttemptLangs.C,
    2,
    /\bprintf\s*\(|\bscanf\s*\(/.test(normalizedSource),
  );
  addScore(
    scores,
    availableSet,
    AttemptLangs.C,
    1,
    /\bmalloc\s*\(|\bfree\s*\(/.test(normalizedSource),
  );

  addScore(
    scores,
    availableSet,
    AttemptLangs.PYTHON,
    2,
    /(^|\n)\s*def\s+\w+\s*\(/m.test(normalizedSource),
  );
  addScore(
    scores,
    availableSet,
    AttemptLangs.PYTHON,
    1,
    /(^|\n)\s*import\s+[a-zA-Z0-9_.]+/m.test(normalizedSource),
  );
  addScore(scores, availableSet, AttemptLangs.PYTHON, 1, /\bprint\s*\(/.test(normalizedSource));
  addScore(
    scores,
    availableSet,
    AttemptLangs.PYTHON,
    3,
    /if\s+__name__\s*==\s*['"]__main__['"]\s*:/.test(normalizedSource),
  );

  addScore(
    scores,
    availableSet,
    AttemptLangs.JAVA,
    3,
    /\bpublic\s+class\s+\w+/.test(normalizedSource),
  );
  addScore(
    scores,
    availableSet,
    AttemptLangs.JAVA,
    3,
    /\bstatic\s+void\s+main\s*\(/.test(normalizedSource),
  );
  addScore(scores, availableSet, AttemptLangs.JAVA, 2, /\bSystem\.out\./.test(normalizedSource));
  addScore(scores, availableSet, AttemptLangs.JAVA, 1, /\bScanner\b/.test(normalizedSource));

  addScore(
    scores,
    availableSet,
    AttemptLangs.CSHARP,
    3,
    /(^|\n)\s*using\s+System\s*;/m.test(normalizedSource),
  );
  addScore(
    scores,
    availableSet,
    AttemptLangs.CSHARP,
    2,
    /\bnamespace\s+[A-Za-z_][A-Za-z0-9_.]*/.test(normalizedSource),
  );
  addScore(
    scores,
    availableSet,
    AttemptLangs.CSHARP,
    2,
    /\bConsole\.WriteLine\s*\(/.test(normalizedSource),
  );
  addScore(
    scores,
    availableSet,
    AttemptLangs.CSHARP,
    1,
    /\bclass\s+Program\b/.test(normalizedSource),
  );

  addScore(
    scores,
    availableSet,
    AttemptLangs.KOTLIN,
    3,
    /\bfun\s+main\s*\(/.test(normalizedSource),
  );
  addScore(scores, availableSet, AttemptLangs.KOTLIN, 2, /\bprintln\s*\(/.test(normalizedSource));
  addScore(
    scores,
    availableSet,
    AttemptLangs.KOTLIN,
    1,
    /\bval\s+\w+|\bvar\s+\w+/.test(normalizedSource),
  );
  addScore(
    scores,
    availableSet,
    AttemptLangs.KOTLIN,
    2,
    /(^|\n)\s*import\s+kotlin\./m.test(normalizedSource),
  );

  addScore(scores, availableSet, AttemptLangs.JS, 2, /\bconsole\.log\s*\(/.test(normalizedSource));
  addScore(
    scores,
    availableSet,
    AttemptLangs.JS,
    1,
    /\bfunction\s+\w*\s*\(/.test(normalizedSource),
  );
  addScore(scores, availableSet, AttemptLangs.JS, 1, /=>/.test(normalizedSource));
  addScore(
    scores,
    availableSet,
    AttemptLangs.JS,
    1,
    /\bconst\s+\w+|\blet\s+\w+/.test(normalizedSource),
  );

  addScore(scores, availableSet, AttemptLangs.TS, 1, /\bconsole\.log\s*\(/.test(normalizedSource));
  addScore(
    scores,
    availableSet,
    AttemptLangs.TS,
    1,
    /\bfunction\s+\w*\s*\(/.test(normalizedSource),
  );
  addScore(scores, availableSet, AttemptLangs.TS, 1, /=>/.test(normalizedSource));
  addScore(
    scores,
    availableSet,
    AttemptLangs.TS,
    1,
    /\bconst\s+\w+|\blet\s+\w+/.test(normalizedSource),
  );
  addScore(scores, availableSet, AttemptLangs.TS, 2, /\binterface\s+\w+/.test(normalizedSource));
  addScore(scores, availableSet, AttemptLangs.TS, 2, /\btype\s+\w+\s*=/.test(normalizedSource));
  addScore(scores, availableSet, AttemptLangs.TS, 2, /\bimplements\s+\w+/.test(normalizedSource));
  addScore(scores, availableSet, AttemptLangs.TS, 2, /\bas\s+const\b/.test(normalizedSource));
  addScore(
    scores,
    availableSet,
    AttemptLangs.TS,
    2,
    /:\s*(string|number|boolean|any|unknown|never|void|Record<|Array<)/.test(normalizedSource),
  );

  addScore(scores, availableSet, AttemptLangs.RUST, 3, /\bfn\s+main\s*\(/.test(normalizedSource));
  addScore(scores, availableSet, AttemptLangs.RUST, 2, /\bprintln!\s*\(/.test(normalizedSource));
  addScore(scores, availableSet, AttemptLangs.RUST, 2, /\blet\s+mut\b/.test(normalizedSource));
  addScore(scores, availableSet, AttemptLangs.RUST, 2, /\buse\s+std::/.test(normalizedSource));

  addScore(scores, availableSet, AttemptLangs.PHP, 4, /^<\?php\b/i.test(normalizedSource));
  addScore(scores, availableSet, AttemptLangs.PHP, 2, /\$[A-Za-z_]\w*/.test(normalizedSource));
  addScore(scores, availableSet, AttemptLangs.PHP, 1, /\becho\b/.test(normalizedSource));

  addScore(
    scores,
    availableSet,
    AttemptLangs.SQL,
    3,
    /^(select|insert|update|delete|create\s+table)\b/i.test(normalizedSource),
  );
  addScore(scores, availableSet, AttemptLangs.SQL, 1, /\bfrom\b/i.test(normalizedSource));
  addScore(scores, availableSet, AttemptLangs.SQL, 1, /\bwhere\b/i.test(normalizedSource));

  addScore(
    scores,
    availableSet,
    AttemptLangs.BASH,
    3,
    /^#!.*\b(?:ba)?sh\b/i.test(normalizedSource),
  );
  addScore(scores, availableSet, AttemptLangs.BASH, 1, /\becho\b/.test(normalizedSource));
  addScore(scores, availableSet, AttemptLangs.BASH, 1, /\bfi\b/.test(sourceLower));
  addScore(scores, availableSet, AttemptLangs.BASH, 1, /\bthen\b/.test(sourceLower));

  addScore(scores, availableSet, AttemptLangs.HTML, 4, /<!doctype\s+html>/i.test(normalizedSource));
  addScore(scores, availableSet, AttemptLangs.HTML, 2, /<html[\s>]/i.test(normalizedSource));
  addScore(scores, availableSet, AttemptLangs.HTML, 2, /<body[\s>]/i.test(normalizedSource));
  addScore(
    scores,
    availableSet,
    AttemptLangs.HTML,
    1,
    countMatches(normalizedSource, /<\/?(div|span|p|script|head|section|main|article)[\s>]/gi) >= 2,
  );

  addScore(scores, availableSet, AttemptLangs.R, 2, /\b\w+\s*<-\s*/.test(normalizedSource));
  addScore(scores, availableSet, AttemptLangs.R, 2, /\blibrary\s*\(/.test(normalizedSource));
  addScore(scores, availableSet, AttemptLangs.R, 1, /\bcat\s*\(/.test(normalizedSource));

  addScore(
    scores,
    availableSet,
    AttemptLangs.HASKELL,
    3,
    /(^|\n)\s*main\s*=/.test(normalizedSource),
  );
  addScore(scores, availableSet, AttemptLangs.HASKELL, 2, /\bputStrLn\b/.test(normalizedSource));
  addScore(scores, availableSet, AttemptLangs.HASKELL, 1, /::/.test(normalizedSource));
  addScore(scores, availableSet, AttemptLangs.HASKELL, 1, /\bwhere\b/.test(sourceLower));

  const ranked = [...scores.entries()]
    .filter(([, score]) => score > 0)
    .sort((left, right) => right[1] - left[1]);

  if (!ranked.length) return null;

  const [topLang, topScore] = ranked[0];
  const secondScore = ranked[1]?.[1] ?? -1;

  if (topScore === secondScore) {
    return currentLang || null;
  }

  return topLang;
};
