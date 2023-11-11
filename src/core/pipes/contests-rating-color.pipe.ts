import { Pipe, PipeTransform } from '@angular/core';

let cache = {};

function getRatingColor(rating: number){
    if(rating >= 2000){
        return 'dark';
    }

    if(rating >= 1800){
        return 'warning';
    }

    if(rating >= 1600){
        return 'primary';
    }

    if(rating >= 1200){
        return 'success';
    }

    return 'secondary';
}

@Pipe({
  name: 'contestsRatingColor'
})
export class ContestsRatingColorPipe implements PipeTransform {

  transform(rating: number): string {
    if(!cache[rating]){
      cache[rating] = getRatingColor(rating);
    }
    return cache[rating];
  }

}
