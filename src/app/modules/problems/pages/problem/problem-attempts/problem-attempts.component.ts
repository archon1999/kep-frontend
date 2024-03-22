import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Observable } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Attempt } from '@problems/models/attempts.models';
import { Problem } from '@problems/models/problems.models';
import { ProblemsApiService } from '@problems/services/problems-api.service';
import { CoreCommonModule } from '@core/common.module';
import { AttemptsTableModule } from '@problems/components/attempts-table/attempts-table.module';
import { KepPaginationComponent } from '@shared/components/kep-pagination/kep-pagination.component';
import { BaseTablePageComponent } from '@app/common';
import { EmptyResultComponent } from '@shared/components/empty-result/empty-result.component';

@Component({
  selector: 'problem-attempts',
  templateUrl: './problem-attempts.component.html',
  styleUrls: ['./problem-attempts.component.scss'],
  standalone: true,
  imports: [CoreCommonModule, AttemptsTableModule, KepPaginationComponent, EmptyResultComponent],
})
export class ProblemAttemptsComponent extends BaseTablePageComponent<Attempt> implements OnInit {

  @Input() problem: Problem;
  @Input() submitEvent: Observable<void>;

  @Output() hackSubmitted = new EventEmitter<null>;

  override defaultPageSize = 10;
  override maxSize = 5;

  public myAttempts = true;

  constructor(
    public service: ProblemsApiService,
  ) {
    super();
  }

  get attempts() {
    return this.pageResult?.data || [];
  }

  ngOnInit() {
    super.ngOnInit();
    this.submitEvent.pipe(takeUntil(this._unsubscribeAll)).subscribe(
      () => {
        this.reloadPage();
      }
    );
  }

  getPage() {
    if (this.myAttempts && this.currentUser) {
      return this.service.getUserProblemAttempts(this.currentUser.username, this.problem.id, this.pageNumber, this.pageSize);
    } else {
      return this.service.getProblemAttempts(this.problem.id, this.pageNumber, this.pageSize);
    }
  }

}
