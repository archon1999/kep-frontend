import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HackAttemptVerdictColorPipe } from './hack-attempt-verdict-color.pipe';
import { AttemptVerdictHTMLPipe } from './attempt-verdict-html.pipe';
import { ProblemDifficultyColorPipe } from './problem-difficulty-color.pipe';

@NgModule({
  declarations: [
    HackAttemptVerdictColorPipe,
    AttemptVerdictHTMLPipe,
    ProblemDifficultyColorPipe,
  ],
  imports: [
    CommonModule
  ],
  exports: [
    HackAttemptVerdictColorPipe,
    AttemptVerdictHTMLPipe,
    ProblemDifficultyColorPipe,
  ]
})
export class ProblemsPipesModule { }
