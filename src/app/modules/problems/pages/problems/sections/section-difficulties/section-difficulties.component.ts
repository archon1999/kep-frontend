import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnChanges, OnDestroy, SimpleChanges, inject } from '@angular/core';
import { finalize, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { ProblemsApiService } from '@problems/services/problems-api.service';
import {
  Difficulties,
  WidgetDifficultiesComponent
} from '@problems/pages/user-statistics/widgets/widget-difficulties/widget-difficulties.component';
import { SpinnerComponent } from '@shared/components/spinner/spinner.component';
import { KepCardComponent } from '@shared/components/kep-card/kep-card.component';

@Component({
  selector: 'section-difficulties',
  standalone: true,
  imports: [CommonModule, WidgetDifficultiesComponent, SpinnerComponent, KepCardComponent],
  templateUrl: './section-difficulties.component.html',
  styleUrls: ['./section-difficulties.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SectionDifficultiesComponent implements OnChanges, OnDestroy {
  @Input() username: string | null = null;

  difficulties: Difficulties | null = null;
  loading = false;
  readonly fallbackDifficulties = this.createDefaultDifficulties();

  private readonly problemsApi = inject(ProblemsApiService);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly destroy$ = new Subject<void>();

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['username']) {
      this.loadDifficulties();
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadDifficulties(): void {
    if (!this.username) {
      this.difficulties = this.createDefaultDifficulties();
      this.cdr.markForCheck();
      return;
    }

    this.loading = true;
    this.cdr.markForCheck();
    this.problemsApi.getUserProblemsRating(this.username)
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => {
          this.loading = false;
          this.cdr.markForCheck();
        }),
      )
      .subscribe({
        next: response => {
          this.difficulties = this.mapResponseToDifficulties(response);
          this.cdr.markForCheck();
        },
        error: () => {
          this.difficulties = this.createDefaultDifficulties();
          this.cdr.markForCheck();
        },
      });
  }

  private mapResponseToDifficulties(response: any): Difficulties {
    const totalSolved = Number(response?.solved ?? 0);
    const totals = {
      allBeginner: Number(response?.allBeginner ?? 0),
      allBasic: Number(response?.allBasic ?? 0),
      allNormal: Number(response?.allNormal ?? 0),
      allMedium: Number(response?.allMedium ?? 0),
      allAdvanced: Number(response?.allAdvanced ?? 0),
      allHard: Number(response?.allHard ?? 0),
      allExtremal: Number(response?.allExtremal ?? 0),
    };

    const totalProblems = Object.values(totals).reduce((sum, value) => sum + value, 0);

    return {
      beginner: Number(response?.beginner ?? 0),
      allBeginner: totals.allBeginner,
      basic: Number(response?.basic ?? 0),
      allBasic: totals.allBasic,
      normal: Number(response?.normal ?? 0),
      allNormal: totals.allNormal,
      medium: Number(response?.medium ?? 0),
      allMedium: totals.allMedium,
      advanced: Number(response?.advanced ?? 0),
      allAdvanced: totals.allAdvanced,
      hard: Number(response?.hard ?? 0),
      allHard: totals.allHard,
      extremal: Number(response?.extremal ?? 0),
      allExtremal: totals.allExtremal,
      totalSolved,
      totalProblems,
    };
  }

  private createDefaultDifficulties(): Difficulties {
    return {
      beginner: 0,
      allBeginner: 0,
      basic: 0,
      allBasic: 0,
      normal: 0,
      allNormal: 0,
      medium: 0,
      allMedium: 0,
      advanced: 0,
      allAdvanced: 0,
      hard: 0,
      allHard: 0,
      extremal: 0,
      allExtremal: 0,
      totalSolved: 0,
      totalProblems: 0,
    };
  }
}
