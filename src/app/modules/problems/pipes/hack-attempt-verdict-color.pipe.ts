import { Pipe, PipeTransform } from '@angular/core';
import { HackAttempt } from '../models/hack-attempt.models';
import { HackAttemptVerdicts } from '../constants';

@Pipe({
  name: 'hackAttemptVerdictColor',
  standalone: true,
})
export class HackAttemptVerdictColorPipe implements PipeTransform {

  transform(hackAttempt: HackAttempt, ...args: unknown[]): unknown {
    return {
      [HackAttemptVerdicts.InQueue]: 'primary',
      [HackAttemptVerdicts.Testing]: 'blue',
      [HackAttemptVerdicts.SuccessfulHack]: 'success',
      [HackAttemptVerdicts.UnsuccessfulHack]: 'danger',
      [HackAttemptVerdicts.GeneratorIncompialable]: 'dark',
      [HackAttemptVerdicts.InvalidInput]: 'warning',
    }[hackAttempt.verdict];
  }

}
