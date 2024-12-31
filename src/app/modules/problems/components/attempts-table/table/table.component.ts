import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  ViewEncapsulation
} from '@angular/core';
import { bounceAnimation, fadeInOnEnterAnimation, shakeAnimation } from 'angular-animations';
import { ProblemsApiService } from '@problems/services/problems-api.service';
import { Attempt } from '../../../models/attempts.models';
import { Contest } from '@contests/models/contest';
import { BaseComponent } from '@app/common';

@Component({
  selector: 'base-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
  animations: [
    bounceAnimation({ duration: 2000 }),
    shakeAnimation({ duration: 2000 }),
    fadeInOnEnterAnimation(),
  ],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TableComponent extends BaseComponent implements OnChanges {
  @Input() contest: Contest;
  @Input() hideSourceCodeSize = false;
  @Input() attempts: Array<Attempt> = [];
  @Input() trigger = true;
  @Output() clicked = new EventEmitter<number>();

  constructor(
    public service: ProblemsApiService,
  ) {
    super();
  }

  ngOnChanges(changes: SimpleChanges) {
    if ('attempts' in changes) {
      this.attempts.forEach(
        (attempt) => {
          attempt.isOwner = this.isOwner(attempt);
        }
      );
      this.cdr.markForCheck();
      this.cdr.detectChanges();
    }
    if ('trigger' in changes) {
      this.cdr.detectChanges();
    }
  }

  rerun(attemptId: number) {
    this.service.attemptRerun(attemptId).subscribe(() => {});
  }

  onPurchaseSuccess(attempt: Attempt) {
    attempt.canView = true;
    this.cdr.detectChanges();
  }

  onPurchaseTestSuccess(attempt: Attempt) {
    attempt.canTestView = true;
    this.cdr.detectChanges();
  }

  isOwner(attempt: Attempt) {
    if (attempt?.user?.username === this.currentUser?.username) {
      return true;
    }
    if (attempt.team && attempt.team.members.filter(member => member.username === this.currentUser?.username).length) {
      return true;
    }
    return false;
  }
}
