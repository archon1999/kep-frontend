import { NgModule } from '@angular/core';
import { SafePipe } from '@shared/pipes/safe.pipe';
import { IconNamePipe } from './feather-icons.pipe';
import { ContestsRatingImgPipe } from '@contests/pipes/contests-rating-img.pipe';
import { FilterPipe } from './filter.pipe';
import { ContestsRatingColorPipe } from '@contests/pipes/contests-rating-color.pipe';
import { ChallengesRankColorPipe } from '@challenges/pipes/challenges-rank-color.pipe';
import { LocalizedDatePipe } from './localized-date.pipe';
import { ErrorMessagePipe } from './error-message.pipe';

@NgModule({
  imports: [
    FilterPipe,
    SafePipe,
    IconNamePipe,
    ContestsRatingImgPipe,
    ContestsRatingColorPipe,
    ChallengesRankColorPipe,
    LocalizedDatePipe,
    ErrorMessagePipe
  ],
  exports: [
    FilterPipe,
    SafePipe,
    IconNamePipe,
    ContestsRatingImgPipe,
    ContestsRatingColorPipe,
    ChallengesRankColorPipe,
    LocalizedDatePipe,
    ErrorMessagePipe
  ],
})
export class CorePipesModule {}
