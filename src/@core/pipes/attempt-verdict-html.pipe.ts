import { Pipe, PipeTransform } from '@angular/core';
import { Attempt } from '../../app/modules/problems/models/attempts.models';
import { Verdicts } from 'app/modules/problems/enums';

@Pipe({
  name: 'attemptVerdictHTML'
})
export class AttemptVerdictHTMLPipe implements PipeTransform {

  transform(attempt: Attempt): string {
    var badgeColor = 'danger';
    if(attempt.verdict == Verdicts.Accepted || attempt.verdict == Verdicts.FakeAccepted){
      badgeColor = 'success';
    } else if(attempt.verdict == Verdicts.JudgementFailed || attempt.verdict == Verdicts.CheckerNotFound){
      badgeColor = 'dark';      
    } else if(attempt.verdict == Verdicts.InQueue){
      badgeColor = 'primary';
    } else if(attempt.verdict == Verdicts.Running){
      badgeColor = 'blue';
    } else if(attempt.verdict == Verdicts.PartialSolution){
      badgeColor = 'warning';
    }
    var verdictInfo = attempt.verdictTitle;
    if(attempt.testCaseNumber > 0 && attempt.verdict != Verdicts.Accepted){
      verdictInfo += ` #${attempt.testCaseNumber}`;
    }
    if(attempt.verdict == Verdicts.PartialSolution){
      verdictInfo += ': ' + attempt.balls + ' ball';
    }
    var html = `<span class="badge badge-glow badge-${badgeColor}">${verdictInfo}</span>`;
    return html;
  }

}
