import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { Contest, ContestProblem } from '@contests/contests.models';
import { ContestsService } from '@contests/contests.service';
import { Problem } from '@problems/models/problems.models';
import { BaseComponent } from '@shared/components/classes/base.component';

@Component({
  selector: 'contest-problem-card',
  templateUrl: './contest-problem-card.component.html',
  styleUrls: ['./contest-problem-card.component.scss']
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

  onProblemFocus(symbol: string) {
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
