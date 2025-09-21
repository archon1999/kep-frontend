import { Component, ViewChild, inject } from '@angular/core';
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
import { BaseLoadComponent } from '@core/common';
import { takeUntil } from 'rxjs/operators';
import { PageResult } from '@core/common/classes/page-result';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { AttemptLangs } from '@problems/constants';
import { LanguageService } from '@problems/services/language.service';
import { findAvailableLang } from '@problems/utils';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@shared/third-part-modules/ng-select/ng-select.module';
import { AttemptLanguageComponent } from '@shared/components/attempt-language/attempt-language.component';
import { CodeEditorModalComponent } from '@shared/components/code-editor/code-editor-modal/code-editor-modal.component';

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
    NgxSkeletonLoaderModule,
    FormsModule,
    NgSelectModule,
    AttemptLanguageComponent
  ]
})
export class DuelComponent extends BaseLoadComponent<Duel> {
  public duelProblem: DuelProblem;
  public attempts: Array<Attempt>;
  public selectedLang: AttemptLangs;

  protected duelsService = inject(DuelsService);
  protected langService = inject(LanguageService);

  @ViewChild(CodeEditorModalComponent)
  private codeEditorModal: CodeEditorModalComponent;

  get duel() {
    return this.data;
  }

  getData(): Observable<Duel> {
    return this.duelsService.getDuel(this.route.snapshot.params.id);
  }

  override ngOnInit() {
    super.ngOnInit();

    this.langService.getLanguage()
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((lang: AttemptLangs) => {
        this.selectedLang = lang;
        this.updateSelectedAvailableLang();
      });

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
    }
    if (this.duelProblem) {
      this.reloadAttempts();
    }
  }

  changeProblem(duelProblem: DuelProblem) {
    this.duelProblem = duelProblem;
    this.updateSelectedAvailableLang(true);
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

  langChange(lang: AttemptLangs) {
    this.langService.setLanguage(lang);
  }

  runCode() {
    if (!this.canUseCodeEditor()) {
      return;
    }
    this.openEditorSidebar(() => this.codeEditorModal?.run());
  }

  submitCode() {
    if (!this.canUseCodeEditor()) {
      return;
    }
    this.openEditorSidebar(() => this.codeEditorModal?.submit());
  }

  private canUseCodeEditor() {
    return this.isAuthenticated && this.duel?.status === 0 && this.duel?.isPlayer && !!this.duelProblem;
  }

  private openEditorSidebar(callback?: () => void) {
    if (!this.codeEditorModal) {
      return;
    }

    const execute = () => {
      if (callback) {
        callback();
      }
    };

    if (!this.codeEditorModal.sidebarIsOpened) {
      this.codeEditorModal.openSidebar();
      setTimeout(() => execute());
    } else {
      execute();
    }
  }

  private updateSelectedAvailableLang(resetIfMissing = false) {
    const availableLanguages = this.duelProblem?.problem?.availableLanguages || [];
    if (!availableLanguages.length) {
      return;
    }

    const selected = findAvailableLang(availableLanguages, this.selectedLang);
    if (selected) {
      return;
    }

    if (!resetIfMissing) {
      return;
    }

    const fallback = availableLanguages[0];
    if (fallback?.lang) {
      this.langService.setLanguage(fallback.lang as AttemptLangs);
    }
  }
}
