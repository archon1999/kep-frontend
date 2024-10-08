import { Pipe, PipeTransform } from '@angular/core';
import { Difficulties } from '../constants';

const colors = new Map<Number, string>()
  .set(Difficulties.Beginner, 'success')
  .set(Difficulties.Basic, 'info')
  .set(Difficulties.Normal, 'blue')
  .set(Difficulties.Medium, 'primary')
  .set(Difficulties.Advanced, 'warning')
  .set(Difficulties.Hard, 'danger')
  .set(Difficulties.Extremal, 'dark');

@Pipe({
  name: 'problemDifficultyColor',
  standalone: true,
})
export class ProblemDifficultyColorPipe implements PipeTransform {

  transform(problemDifficulty: number): string {
    return colors.get(problemDifficulty);
  }

}
