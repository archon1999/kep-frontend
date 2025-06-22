import { Pipe, PipeTransform } from '@angular/core';

const cache = {};

function getRatingColor(rating: number) {
  if (rating >= 2000) {
    return 'primary';
  }

  if (rating >= 1800) {
    return 'blue';
  }

  if (rating >= 1600) {
    return 'info';
  }

  if (rating >= 1200) {
    return 'success';
  }

  return 'light';
}

@Pipe({
  name: 'contestsRatingColor',
  standalone: true,
})
export class ContestsRatingColorPipe implements PipeTransform {
  transform(rating: number): string {
    if (!cache[rating]) {
      cache[rating] = getRatingColor(rating);
    }
    return cache[rating];
  }
}
