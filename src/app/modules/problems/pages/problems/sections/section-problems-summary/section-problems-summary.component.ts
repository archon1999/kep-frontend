import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ProblemsApiService } from '@problems/services/problems-api.service';
import { BaseComponent } from '@core/common/classes/base.component';
import { ProblemsRating } from '@problems/models/rating.models';
import { takeUntil } from 'rxjs/operators';
import { NgIf, NgForOf } from '@angular/common';
import { KepCardComponent } from '@shared/components/kep-card/kep-card.component';
import { TranslatePipe } from '@ngx-translate/core';
import { KepIconComponent } from '@shared/components/kep-icon/kep-icon.component';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';

interface DifficultySummary {
  key: keyof ProblemsRating;
  label: string;
  color: string;
}

type ProblemsRatingSummary = Partial<ProblemsRating> & {
  user?: {
    username?: string;
    ratingTitle?: string;
  };
};

@Component({
  selector: 'section-problems-summary',
  standalone: true,
  imports: [
    NgIf,
    NgForOf,
    KepCardComponent,
    TranslatePipe,
    KepIconComponent,
    NgxSkeletonLoaderModule
  ],
  templateUrl: './section-problems-summary.component.html',
  styleUrls: ['./section-problems-summary.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SectionProblemsSummaryComponent extends BaseComponent {
  public summary: ProblemsRatingSummary | null = null;
  public isLoading = false;

  public difficultySummary: DifficultySummary[] = [
    {key: 'beginner', label: 'Beginner', color: 'success'},
    {key: 'basic', label: 'Basic', color: 'info'},
    {key: 'normal', label: 'Normal', color: 'primary'},
    {key: 'medium', label: 'Medium', color: 'warning'},
    {key: 'advanced', label: 'Advanced', color: 'danger'},
    {key: 'hard', label: 'Hard', color: 'dark'},
    {key: 'extremal', label: 'Extremal', color: 'secondary'}
  ];

  constructor(private problemsApiService: ProblemsApiService) {
    super();
  }

  override ngOnInit(): void {
    super.ngOnInit();
    if (this.isAuthenticated) {
      this.loadSummary();
    }
  }

  override afterChangeCurrentUser(): void {
    if (this.isAuthenticated) {
      this.loadSummary();
    } else {
      this.summary = null;
    }
  }

  private loadSummary(): void {
    this.isLoading = true;
    this.problemsApiService.getCurrentUserProblemsSummary()
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe({
        next: (summary: ProblemsRatingSummary) => {
          this.summary = summary;
          this.isLoading = false;
          this.cdr.markForCheck();
        },
        error: () => {
          this.isLoading = false;
          this.cdr.markForCheck();
        }
      });
  }
}
