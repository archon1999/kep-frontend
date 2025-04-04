import { Pipe, PipeTransform } from '@angular/core';
import { ContestProblemInfo } from '@contests/models';

@Pipe({
  name: 'problemInfoBySymbol',
  standalone: true,
})
export class ProblemInfoBySymbolPipe implements PipeTransform {
  transform(problemsInfo: ContestProblemInfo[], problemSymbol): unknown {
    return problemsInfo.find(problemInfo => problemInfo.problemSymbol === problemSymbol);
  }
}
