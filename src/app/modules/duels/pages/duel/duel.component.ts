import { Component, inject } from '@angular/core';
import { Attempt } from '@problems/models/attempts.models';
import { interval, Observable } from 'rxjs';
import { Duel, DuelProblem } from '../../duels.interfaces';
import { DuelsService } from '../../duels.service';
import { KepCardComponent } from '@shared/components/kep-card/kep-card.component';
import { CoreCommonModule } from '@core/common.module';
import { NgbTooltip } from '@ng-bootstrap/ng-bootstrap';
import { ContestantViewModule } from '@contests/components/contestant-view/contestant-view.module';
import { ProblemBodyComponent } from '@problems/components/problem-body/problem-body.component';
import { CodeEditorModule } from '@shared/components/code-editor/code-editor.module';
import { AttemptsTableModule } from '@problems/components/attempts-table/attempts-table.module';
import { DuelCountdownComponent } from '@app/modules/duels/components/duel-countdown/duel-countdown.component';
import { ProblemInfoCardComponent } from '@problems/components/problem-info-card/problem-info-card.component';
import { ProblemListCardComponent } from '@app/modules/duels/components/problem-list-card/problem-list-card.component';
import { BaseLoadComponent } from '@app/common';
import { takeUntil } from 'rxjs/operators';
import { PageResult } from '@app/common/classes/page-result';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';

@Component({
  templateUrl: './duel.component.html',
  styleUrls: ['./duel.component.scss'],
  standalone: true,
  imports: [
    KepCardComponent,
    CoreCommonModule,
    NgbTooltip,
    ContestantViewModule,
    ProblemBodyComponent,
    CodeEditorModule,
    AttemptsTableModule,
    DuelCountdownComponent,
    ProblemInfoCardComponent,
    ProblemListCardComponent,
    NgxSkeletonLoaderModule
  ]
})
export class DuelComponent extends BaseLoadComponent<Duel> {
  public duelProblem: DuelProblem;
  public attempts: Array<Attempt>;

  protected duelsService = inject(DuelsService);

  get duel() {
    return this.data;
  }

  getData(): Observable<Duel> {
    return this.duelsService.getDuel(this.route.snapshot.params.id);
  }

  override ngOnInit() {
    super.ngOnInit();

    interval(5000).pipe(takeUntil(this._unsubscribeAll)).subscribe(
      () => {
        if (this.duel?.status == 0) {
          this.loadData();
          this.reloadResults();
        }
      }
    );
  }

  afterLoadData(duel: Duel) {
    this.titleService.updateTitle(this.route, {
      playerFirstUsername: duel.playerFirst.username,
      playerSecondUsername: duel.playerSecond.username,
    });

    if (duel.problems) {
      if (!this.duelProblem) {
        this.changeProblem(duel.problems[0]);
      }
    } else if (duel.isPlayer) {
      this.reloadAttempts();
    }
  }

  changeProblem(duelProblem: DuelProblem) {
    this.duelProblem = duelProblem;
    if (this.currentUser && this.duel.isPlayer) {
      this.reloadAttempts();
    }
  }

  reloadAttempts() {
    this.duelsService.getProblemAttempts(this.duel.id, this.duelProblem.symbol).subscribe(
      (pageResult: PageResult<Attempt>) => {
        this.attempts = pageResult.data;
      }
    );
  }

  reloadResults() {
    this.duelsService.getDuelResults(this.duel.id).subscribe(
      (results: any) => {
        let playerFirstBalls = 0;
        let playerSecondBalls = 0;
        for (let i = 0; i < this.duel.problems.length; i++) {
          this.duel.problems[i].playerFirstBall = results.playerFirst[i];
          this.duel.problems[i].playerSecondBall = results.playerSecond[i];
          playerFirstBalls += results.playerFirst[i];
          playerSecondBalls += results.playerSecond[i];
        }
        this.duel.playerFirst.balls = playerFirstBalls;
        this.duel.playerSecond.balls = playerSecondBalls;
      }
    );
  }
}
