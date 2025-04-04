import { Pipe, PipeTransform } from '@angular/core';
import { Contest, ContestProblemInfo } from '@contests/models';

@Pipe({
  name: 'problemInfoGetHtml',
  standalone: true,
})
export class ProblemInfoGetHtmlPipe implements PipeTransform {

  transform(problemInfo: ContestProblemInfo, contest: Contest) {
    return problemInfo.getHTML(contest);
  }

}
