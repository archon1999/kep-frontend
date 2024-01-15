import { Pipe, PipeTransform } from '@angular/core';

import { Contest } from '@contests/models/contest';

@Pipe({
  name: 'contestClasses',
  standalone: true
})
export class ContestClassesPipe implements PipeTransform {
  transform(contest: Contest): string {
    return ` contests-colors contest-${ contest.id } ${ contest.title } contest-type-${ contest.type }`;
  }
}
