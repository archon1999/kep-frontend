import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { AttemptLangs } from 'app/modules/problems/constants';
import { Problem } from 'app/modules/problems/models/problems.models';
import { LanguageService } from 'app/modules/problems/services/language.service';
import { ProblemsApiService } from '@problems/services/problems-api.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { CoreCommonModule } from '@core/common.module';
import { ContestantViewModule } from '@contests/components/contestant-view/contestant-view.module';
import { NgSelectModule } from '@shared/third-part-modules/ng-select/ng-select.module';
import { KepCardComponent } from "@shared/components/kep-card/kep-card.component";

@Component({
  selector: 'problem-sidebar-top-attempts',
  templateUrl: './problem-sidebar-top-attempts.component.html',
  styleUrls: ['./problem-sidebar-top-attempts.component.scss'],
  standalone: true,
  imports: [CoreCommonModule, ContestantViewModule, NgSelectModule, KepCardComponent],
})
export class ProblemSidebarTopAttemptsComponent implements OnInit, OnDestroy {

  @Input() problem: Problem;

  public selectedLang: string;
  public topAttemptsOrdering = 'source_code_size';
  public topAttempts: Array<any> = [];

  private _unsubscribeAll = new Subject();

  constructor(
    public langService: LanguageService,
    public service: ProblemsApiService,
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
