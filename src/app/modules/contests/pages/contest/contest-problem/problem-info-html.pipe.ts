import { Pipe, PipeTransform } from '@angular/core';
import { Contest, ContestProblemInfo } from '@contests/models';

@Pipe({
  name: 'problemInfoHTML',
  standalone: true,
})
export class ProblemInfoHtmlPipe implements PipeTransform {
  transform(problemInfo: ContestProblemInfo, contest: Contest): string {
    return problemInfo && problemInfo.getHTML(contest)
  }
}
