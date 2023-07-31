import { Pipe, PipeTransform } from '@angular/core';
import { Attempt, Verdicts } from '../../app/modules/problems/models/attempts.models';


@Pipe({
  name: 'attemptVerdictHTML'
})
export class AttemptVerdictHTMLPipe implements PipeTransform {

  transform(attempt: Attempt): string {
    var badgeType = 'danger';
    if(attempt.verdict == Verdicts.Accepted || attempt.verdict == Verdicts.FakeAccepted){
      badgeType = 'success';
    } else if(attempt.verdict == Verdicts.JudgementFailed ||
              attempt.verdict == Verdicts.CheckerNotFound){
      badgeType = 'dark';
    } else if(attempt.verdict == Verdicts.InQueue){
      badgeType = 'primary';
    } else if(attempt.verdict == Verdicts.Running){
      badgeType = 'blue';
    } else if(attempt.verdict == Verdicts.PartialSolution){
      badgeType = 'warning';
    }
    var verdicts = [Verdicts.Accepted,
                    Verdicts.InQueue,
                    Verdicts.Rejected,
                    Verdicts.JudgementFailed,
                    Verdicts.CheckerNotFound,
                    Verdicts.PartialSolution];
    var verdictInfo = attempt.verdictTitle;
    if(verdicts.indexOf(attempt.verdict) == -1 && attempt.testCaseNumber){
      verdictInfo += ` #${attempt.testCaseNumber}`;
    }
    if(attempt.verdict == Verdicts.PartialSolution){
      verdictInfo += ': ' + attempt.balls + ' ball';
    }
    var html = `<span class="badge badge-glow badge-${badgeType}">${verdictInfo}</span>`;
    return html;
  }

}
