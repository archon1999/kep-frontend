import { Pipe, PipeTransform } from '@angular/core';

const cache = {};

function getRatingTitle(ratingTitle: string) {
  return `<img title="${ratingTitle}" src="assets/images/contests/ratings/${ratingTitle.toLowerCase()}.png"
       height="32" width="32" class="rounded mb-1 rating-title-img" ngbTooltip="${ratingTitle}">`;
}

@Pipe({
  name: 'contestsRatingImg',
  standalone: true,
})
export class ContestsRatingImgPipe implements PipeTransform {
  transform(ratingTitle: string): string {
    if (!cache[ratingTitle]) {
      cache[ratingTitle] = getRatingTitle(ratingTitle);
    }
    return cache[ratingTitle];
  }
}
