import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { ContestsService } from '@contests/contests.service';
import { Problem } from '@problems/models/problems.models';
import { BaseComponent } from '@app/common/classes/base.component';
import { CoreCommonModule } from '@core/common.module';
import { ContestClassesPipe } from '@contests/pipes/contest-classes.pipe';
import { MathjaxModule } from '@shared/third-part-modules/mathjax/mathjax.module';
import { ContestProblem } from '@contests/models/contest-problem';
import { Contest } from '@contests/models/contest';
import { AttemptLanguageComponent } from '@shared/components/attempt-language/attempt-language.component';
import { KepCardComponent } from "@shared/components/kep-card/kep-card.component";

@Component({
  selector: 'contest-problem-card',
  templateUrl: './contest-problem-card.component.html',
  styleUrls: ['./contest-problem-card.component.scss'],
  standalone: true,
  imports: [CoreCommonModule, ContestClassesPipe, MathjaxModule, AttemptLanguageComponent, KepCardComponent]
})
export class ContestProblemCardComponent extends BaseComponent {
  @Input() contest: Contest;
  @Input() contestProblem: ContestProblem;

  @ViewChild('contestLogo') contestLogoRef: ElementRef<HTMLImageElement>;

  public problem: Problem;
  public logoWidth: number;
  public logoHeight: number;

  constructor(
    public service: ContestsService,
  ) {
    super();
  }

  onProblemFocus() {
    this.service.getContestProblem(this.contest.id, this.contestProblem.symbol).subscribe(
      (result: any) => {
        this.problem = result.problem;
      }
    );
  }

  removeProblem() {
    this.problem = null;
  }

  onLoad(event: any) {
    this.logoHeight = this.contestLogoRef.nativeElement.naturalHeight;
    this.logoWidth = this.contestLogoRef.nativeElement.naturalWidth;
  }
}
