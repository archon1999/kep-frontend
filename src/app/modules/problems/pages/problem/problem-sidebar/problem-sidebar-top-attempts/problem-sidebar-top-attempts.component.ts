import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { AttemptLangs } from 'app/modules/problems/constants';
import { Problem } from 'app/modules/problems/models/problems.models';
import { LanguageService } from 'app/modules/problems/services/language.service';
import { ProblemsService } from 'app/modules/problems/services/problems.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { CoreCommonModule } from '@core/common.module';
import { NgbButtonsModule } from '@ng-bootstrap/ng-bootstrap';
import { ContestantViewModule } from '@shared/components/contestant-view/contestant-view.module';

@Component({
  selector: 'problem-sidebar-top-attempts',
  templateUrl: './problem-sidebar-top-attempts.component.html',
  styleUrls: ['./problem-sidebar-top-attempts.component.scss'],
  standalone: true,
  imports: [CoreCommonModule, NgbButtonsModule, ContestantViewModule],
})
export class ProblemSidebarTopAttemptsComponent implements OnInit, OnDestroy {

  @Input() problem: Problem;

  public selectedLang: string;
  public topAttemptsOrdering = 'source_code_size';
  public topAttempts: Array<any> = [];

  private _unsubscribeAll = new Subject();

  constructor(
    public langService: LanguageService,
    public service: ProblemsService,
  ) {}

  ngOnInit(): void {
    this.langService.getLanguage().pipe(takeUntil(this._unsubscribeAll)).subscribe(
      (lang: AttemptLangs) => {
        this.selectedLang = lang;
        this.topAttemptsLoad(this.topAttemptsOrdering);
      }
    );
  }

  topAttemptsLoad(ordering: string) {
    this.topAttemptsOrdering = ordering;
    this.service.getProblemTopAttempts(this.problem.id, ordering, this.selectedLang).subscribe(
      (result: any) => {
        this.topAttempts = result;
      }
    );
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }

}
