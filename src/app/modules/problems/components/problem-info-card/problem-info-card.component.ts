import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { AvailableLanguage, Problem } from '@problems/models/problems.models';
import { CoreCommonModule } from '@core/common.module';
import { ProblemsPipesModule } from '@problems/pipes/problems-pipes.module';
import { UserPopoverModule } from '@shared/components/user-popover/user-popover.module';
import { AuthService, AuthUser } from '@auth';
import { Subject } from 'rxjs';
import { ProblemsApiService } from '@problems/services/problems-api.service';
import { LanguageService } from '@problems/services/language.service';
import { takeUntil } from 'rxjs/operators';
import { AttemptLangs } from '@problems/constants';
import { findAvailableLang } from '@problems/utils';
import { KepIconComponent } from '@shared/components/kep-icon/kep-icon.component';

interface IVoteResult {
  likesCount: number;
  dislikesCount: number;
}

@Component({
  selector: 'problem-info-card',
  standalone: true,
  imports: [
    CoreCommonModule,
    ProblemsPipesModule,
    UserPopoverModule,
    KepIconComponent,
  ],
  templateUrl: './problem-info-card.component.html',
  styleUrl: './problem-info-card.component.scss'
})
export class ProblemInfoCardComponent implements OnInit, OnDestroy, OnChanges {

  @Input() problem: Problem;
  @Input() hideLikes = false;
  @Input() hideAuthorAndDifficulty = false;
  @Input() hideCodeGolf = true;

  public selectedLang: string;
  public selectedAvailableLang: AvailableLanguage;

  public currentUser: AuthUser;

  private _unsubscribeAll = new Subject();

  constructor(
    public authService: AuthService,
    public service: ProblemsApiService,
    public langService: LanguageService,
  ) {
  }

  ngOnInit(): void {
    this.langService.getLanguage().pipe(takeUntil(this._unsubscribeAll)).subscribe(
      (lang: AttemptLangs) => {
        this.selectedAvailableLang = findAvailableLang(this.problem.availableLanguages, lang);
        this.selectedLang = lang;
        if (!this.selectedAvailableLang) {
          this.langService.setLanguage(this.problem.availableLanguages[0].lang);
        }
      }
    );

    this.authService.currentUser.pipe(takeUntil(this._unsubscribeAll)).subscribe(
      (user: AuthUser | null) => {
        this.currentUser = user;
      }
    );
  }

  ngOnChanges(changes: SimpleChanges) {
    if ('problem' in changes) {
      this.langService.setLanguage(this.langService.getLanguageValue());
    }
  }

  like() {
    this.service.problemLike(this.problem.id).subscribe(
      (result: IVoteResult) => {
        this.problem.userInfo.voteType = 1;
        this.problem.likesCount = result.likesCount;
        this.problem.dislikesCount = result.dislikesCount;
      }
    );
  }

  dislike() {
    this.service.problemDislike(this.problem.id).subscribe(
      (result: IVoteResult) => {
        this.problem.userInfo.voteType = 0;
        this.problem.likesCount = result.likesCount;
        this.problem.dislikesCount = result.dislikesCount;
      }
    );
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }

}
