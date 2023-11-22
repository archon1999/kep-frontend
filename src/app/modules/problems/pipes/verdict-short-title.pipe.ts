import { Pipe, PipeTransform } from '@angular/core';
import { Verdicts } from '@problems/constants';

@Pipe({
  name: 'verdictShortTitle',
  standalone: true
})
export class VerdictShortTitlePipe implements PipeTransform {

  transform(verdict: Verdicts): unknown {
    return {
      [Verdicts.Accepted]: 'OK',
      [Verdicts.WrongAnswer]: 'WA',
      [Verdicts.RuntimeError]: 'RE',
      [Verdicts.CompilationError]: 'CE',
      [Verdicts.SyntaxError]: 'SE',
      [Verdicts.TimeLimitExceeded]: 'TL',
      [Verdicts.MemoryLimitExceeded]: 'ML',
      [Verdicts.OutputFormatError]: 'OFE',
      [Verdicts.CheckerNotFound]: 'CNF',
      [Verdicts.ObjectNotFound]: 'ONF',
      [Verdicts.Rejected]: 'RJ',
    }[verdict] || 'Unknown';
  }

}
