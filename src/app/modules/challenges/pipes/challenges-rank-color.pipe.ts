import { Pipe, PipeTransform } from '@angular/core';

const ranks = {
  'SGM': 'dark',
  'GM': 'danger',
  'IM': 'warning',
  'M': 'yellow',
  'CM': 'indigo',
  'R1': 'blue',
  'R2': 'info',
  'R3': 'success',
  'R4': 'secondary',
};

@Pipe({
  name: 'challengesRankColor',
  standalone: true,
})
export class ChallengesRankColorPipe implements PipeTransform {
  transform(rankTitle: string): string {
    return ranks[rankTitle];
  }
}
