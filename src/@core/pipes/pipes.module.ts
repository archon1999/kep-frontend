import { NgModule } from '@angular/core';

import { SafePipe } from '@core/pipes/safe.pipe';
import { StripHtmlPipe } from './strip-html.pipe';

import { IconNamePipe } from './icons.pipe';
import { ContestsRatingImgPipe } from './contests-rating-img.pipe';
import { FilterPipe } from './filter.pipe';
import { ContestsRatingColorPipe } from './contests-rating-color.pipe';
import { ChallengesRankColorPipe } from './challenges-rank-color.pipe';
import { LocalizedDatePipe } from './localized-date.pipe';
import { ErrorMessagePipe } from './error-message.pipe';

@NgModule({
  declarations: [
    FilterPipe,
    StripHtmlPipe,
    SafePipe,
    IconNamePipe,
    ContestsRatingImgPipe,
    ContestsRatingColorPipe,
    ChallengesRankColorPipe,
    LocalizedDatePipe,
    ErrorMessagePipe
  ],
  imports: [],
  exports: [
    FilterPipe,
    StripHtmlPipe,
    SafePipe,
    IconNamePipe,
    ContestsRatingImgPipe,
    ContestsRatingColorPipe,
    ChallengesRankColorPipe,
    LocalizedDatePipe,
    ErrorMessagePipe,
  ]
})
export class CorePipesModule {
}
