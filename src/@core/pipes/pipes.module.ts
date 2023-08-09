import { NgModule } from '@angular/core';

import { SafePipe } from '@core/pipes/safe.pipe';
import { StripHtmlPipe } from '@core/pipes/stripHtml.pipe';

import { IconNamePipe } from './icons.pipe';
import { ContestsRatingImgPipe } from './contestsRatingImg.pipe';
import { AttemptVerdictHTMLPipe } from './attempt-verdict-html.pipe';
import { ProblemDifficultyColorPipe } from './problemDifficultyColor.pipe';
import { FilterPipe } from './filter.pipe';
import { ContestsRatingColorPipe } from './contestsRatingColor.pipe';
import { ChallengesRankColorPipe } from './challengesRankColor.pipe';
import { LocalizedDatePipe } from './localized-date.pipe';

@NgModule({
  declarations: [
    FilterPipe,
    StripHtmlPipe,
    SafePipe,
    IconNamePipe,
    ContestsRatingImgPipe,
    AttemptVerdictHTMLPipe,
    ProblemDifficultyColorPipe,
    ContestsRatingColorPipe,
    ChallengesRankColorPipe,
    LocalizedDatePipe
  ],
  imports: [],
  exports: [
    FilterPipe,
    StripHtmlPipe,
    SafePipe,
    IconNamePipe,
    ContestsRatingImgPipe,
    AttemptVerdictHTMLPipe,
    ProblemDifficultyColorPipe,
    ContestsRatingColorPipe,
    ChallengesRankColorPipe,
    LocalizedDatePipe,
  ]
})
export class CorePipesModule { }
