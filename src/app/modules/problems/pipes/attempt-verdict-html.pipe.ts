import { Pipe, PipeTransform } from '@angular/core';
import { Attempt } from '../models/attempts.models';
import { Verdicts } from '../constants';

@Pipe({
  name: 'attemptVerdictHTML',
  standalone: true,
})
export class AttemptVerdictHTMLPipe implements PipeTransform {

  transform(attempt: Attempt): string {
    let badgeColor = 'danger';
    if (attempt.verdict === Verdicts.Accepted || attempt.verdict === Verdicts.FakeAccepted) {
      badgeColor = 'success';
    } else if (attempt.verdict === Verdicts.JudgementFailed || attempt.verdict === Verdicts.CheckerNotFound) {
      badgeColor = 'dark';
    } else if (attempt.verdict === Verdicts.InQueue) {
      badgeColor = 'primary';
    } else if (attempt.verdict === Verdicts.Running) {
      badgeColor = 'blue';
    } else if (attempt.verdict === Verdicts.PartialSolution) {
      badgeColor = 'warning';
    }
    const verdicts = [
      Verdicts.Accepted,
      Verdicts.InQueue,
      Verdicts.Rejected,
      Verdicts.JudgementFailed,
      Verdicts.CheckerNotFound,
      Verdicts.PartialSolution,
      Verdicts.Hacked,
    ];
    let verdictInfo = attempt.verdictTitle;
    if (attempt.testCaseNumber > 0 && verdicts.indexOf(attempt.verdict) == -1) {
      verdictInfo += ` #${attempt.testCaseNumber}`;
    }
    if (attempt.verdict === Verdicts.PartialSolution) {
      verdictInfo += ': ' + attempt.balls + ' ball';
    }
    const html = `<span class="badge badge-${badgeColor}">${verdictInfo}</span>`;
    return html;
  }

}
