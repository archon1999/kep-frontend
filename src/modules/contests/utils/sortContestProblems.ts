import { ContestProblemEntity } from '../domain/entities/contest-problem.entity';

export const sortContestProblems = (problems: ContestProblemEntity[]) => {
  return [...problems].sort((a, b) => {
    const symbolA = a.symbol ?? '';
    const symbolB = b.symbol ?? '';

    const splitSymbol = (symbol: string) => {
      let letters = '';
      let numbers = 0;

      for (const ch of symbol) {
        if (ch >= '0' && ch <= '9') {
          numbers = numbers * 10 + Number(ch);
        } else {
          letters += ch;
        }
      }

      return { letters, numbers };
    };

    const aParts = splitSymbol(symbolA);
    const bParts = splitSymbol(symbolB);

    if (aParts.letters < bParts.letters) return -1;
    if (aParts.letters > bParts.letters) return 1;
    return aParts.numbers - bParts.numbers;
  });
};
