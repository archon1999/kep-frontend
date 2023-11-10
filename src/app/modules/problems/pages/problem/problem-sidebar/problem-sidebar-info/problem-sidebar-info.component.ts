import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { User } from 'app/auth/models';
import { AuthenticationService } from 'app/auth/service';
import { AttemptLangs } from 'app/modules/problems/constants';
import { AvailableLanguage, Problem } from 'app/modules/problems/models/problems.models';
import { LanguageService } from 'app/modules/problems/services/language.service';
import { ProblemsService } from 'app/modules/problems/services/problems.service';
import { findAvailableLang } from 'app/modules/problems/utils';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'problem-sidebar-info',
  templateUrl: './problem-sidebar-info.component.html',
  styleUrls: ['./problem-sidebar-info.component.scss']
})
export class ProblemSidebarInfoComponent implements OnInit, OnDestroy {

  @Input() problem: Problem;

  public selectedLang: string;
  public selectedAvailableLang: AvailableLanguage;

  public currentUser: User;

  private _unsubscribeAll = new Subject();

  constructor(
    public authService: AuthenticationService,
    public service: ProblemsService,
    public langService: LanguageService,
  ) { }

  ngOnInit(): void {
    this.langService.getLanguage().pipe(takeUntil(this._unsubscribeAll)).subscribe(
      (lang: AttemptLangs) => {
        this.selectedAvailableLang = findAvailableLang(this.problem.availableLanguages, lang);
        this.selectedLang = lang;
        if(!this.selectedAvailableLang){
          this.langService.setLanguage(this.problem.availableLanguages[0].lang);
        }
      }
    )

    this.authService.currentUser.pipe(takeUntil(this._unsubscribeAll)).subscribe(
      (user: User | null) => {
        this.currentUser = user;
      }
    )
  }

  like(){
    this.service.problemLike(this.problem.id).subscribe(
      (result: any) => {
        this.problem.userInfo.voteType = 1;
        this.problem.likesCount = result.likesCount;
        this.problem.dislikesCount = result.dislikesCount;
      }
    )
  }

  dislike(){
    this.service.problemDislike(this.problem.id).subscribe(
      (result: any) => {
        this.problem.userInfo.voteType = 0;
        this.problem.likesCount = result.likesCount;
        this.problem.dislikesCount = result.dislikesCount;
      }
    )
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }

}
