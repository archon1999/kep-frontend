import { ContestProblem } from '@contests/models/contest-problem';

export function sortContestProblems(problems: Array<ContestProblem>) {
  return problems.sort(function (a, b) {
    let s1 = a.symbol;
    let s2 = b.symbol;
    let a1 = '', a2 = '';
    let x1 = 0, x2 = 0;
    for (let c of s1) {
      if (c >= '0' && c <= '9') {
        x1 = x1 * 10 + +c;
      } else {
        a1 += c;
      }
    }
    for (let c of s2) {
      if (c >= '0' && c <= '9') {
        x2 = x2 * 10 + +c;
      } else {
        a2 += c;
      }
    }

    if (a1 < a2 || (a1 === a2 && x1 < x2)) {
      return -1;
    } else {
      return 1;
    }
  });
}
