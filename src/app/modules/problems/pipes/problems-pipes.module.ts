import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HackAttemptVerdictColorPipe } from './hack-attempt-verdict-color.pipe';
import { AttemptVerdictHTMLPipe } from './attempt-verdict-html.pipe';
import { ProblemDifficultyColorPipe } from './problem-difficulty-color.pipe';
import { VerdictShortTitlePipe } from '@problems/pipes/verdict-short-title.pipe';

@NgModule({
  imports: [
    CommonModule,
    VerdictShortTitlePipe,
    HackAttemptVerdictColorPipe,
    AttemptVerdictHTMLPipe,
    ProblemDifficultyColorPipe,
  ],
  exports: [
    HackAttemptVerdictColorPipe,
    AttemptVerdictHTMLPipe,
    ProblemDifficultyColorPipe,
    VerdictShortTitlePipe,
  ]
})
export class ProblemsPipesModule { }
