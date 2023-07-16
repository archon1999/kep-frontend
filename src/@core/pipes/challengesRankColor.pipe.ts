import { Pipe, PipeTransform } from '@angular/core';

let cache = {};

function getRankColor(rankTitle: string) {
  return {
    'SGM': 'dark',
    'GM': 'danger',
    'IM': 'warning',
    'M': 'yellow',
    'CM': 'primary',
    'R1': 'blue',
    'R2': 'info',
    'R3': 'success',
    'R4': 'secondary',
  }[rankTitle]
}

@Pipe({
  name: 'challengesRankColor'
})
export class ChallengesRankColorPipe implements PipeTransform {

  transform(rankTitle: string): string {
    if (!cache[rankTitle]) {
      cache[rankTitle] = getRankColor(rankTitle);
    }
    return cache[rankTitle];
  }

}
