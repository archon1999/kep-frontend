import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CoreCommonModule } from '@core/common.module';
import { ContestantViewModule } from '@contests/components/contestant-view/contestant-view.module';
import { NgSelectModule } from '@shared/third-part-modules/ng-select/ng-select.module';
import { KepCardComponent } from "@shared/components/kep-card/kep-card.component";
import { ProblemTopAttempts } from '../problem-statistics.model';

@Component({
  selector: 'problem-sidebar-top-attempts',
  templateUrl: './problem-sidebar-top-attempts.component.html',
  styleUrls: ['./problem-sidebar-top-attempts.component.scss'],
  standalone: true,
  imports: [CoreCommonModule, ContestantViewModule, NgSelectModule, KepCardComponent],
})
export class ProblemSidebarTopAttemptsComponent implements OnChanges {

  @Input() topAttempts: ProblemTopAttempts | null = null;

  public topAttemptsOrdering: keyof ProblemTopAttempts = 'sourceCodeSize';
  public topAttemptsList: Array<any> = [];

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['topAttempts']) {
      this.updateTopAttemptsList();
    }
  }

  changeOrdering(ordering: keyof ProblemTopAttempts) {
    this.topAttemptsOrdering = ordering;
    this.updateTopAttemptsList();
  }

  private updateTopAttemptsList(): void {
    if (!this.topAttempts) {
      this.topAttemptsList = [];
      return;
    }

    const list = this.topAttempts[this.topAttemptsOrdering];
    this.topAttemptsList = Array.isArray(list) ? list : [];
  }
}
