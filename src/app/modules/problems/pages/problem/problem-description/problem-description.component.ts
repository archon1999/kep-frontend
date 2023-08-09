import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { User } from 'app/auth/models';
import { AuthenticationService } from 'app/auth/service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AvailableLanguage, Problem, Tag } from '../../../models/problems.models';
import { ProblemsService } from 'app/modules/problems/services/problems.service';
import { LocalStorageService } from 'app/shared/storages/local-storage.service';
import { LanguageService } from 'app/modules/problems/services/language.service';
import { findAvailableLang } from 'app/modules/problems/utils';
import { AttemptLangs } from 'app/modules/problems/enums';

@Component({
  selector: 'problem-description',
  templateUrl: './problem-description.component.html',
  styleUrls: ['./problem-description.component.scss']
})
export class ProblemDescriptionComponent implements OnInit, OnDestroy {

  @Input() problem: Problem;

  public selectedLang: string;
  public selectedAvailableLang: AvailableLanguage;
  
  public problemSolution: any;
  public tags: Array<Tag> = [];
  public selectedTag: number;
  
  public currentUser: User;
  private _unsubscribeAll = new Subject();

  constructor(
    public authService: AuthenticationService,
    public service: ProblemsService,
    public modalService: NgbModal,
    public localStorageService: LocalStorageService,
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
        if(this.currentUser?.permissions.canChangeProblemTags){
          this.service.getTags().subscribe((tags: Array<Tag>) => this.tags = tags);
        }
      }
    );
  }

  onPurchaseSolution(){
    this.problem.canViewSolution = true;
  }

  openSolutionModal(content){
    this.service.getProblemSolution(this.problem.id).subscribe(
      (solution: any) => {
        this.problemSolution = solution;
        this.modalService.open(content, {
          scrollable: true,
        }
      );
    })
  }

  removeTag(tag: Tag){
    let index = this.problem.tags.findIndex((value) => value.id == tag.id);
    let tagId = this.problem.tags[index].id;
    this.service.removeTag(this.problem.id, tagId).subscribe((result: any) => {
      if(result.success){
        this.problem.tags.splice(index, 1);
      }
    })
  }

  addTag(){
    if(this.selectedTag){
      let tag = this.getTag(this.selectedTag);
      this.service.addTag(this.problem.id, tag.id).subscribe((result: any) => {
        if(result.success){
          this.problem.tags.push(tag);
        }
      })
    }
  }

  getTag(tagId: number){
    return this.tags.find((value) => tagId == value.id);
  }

  like(){
    this.service.problemLike(this.problem.id).subscribe(
      (result: any) => {
        this.problem.voteType = 1;
        this.problem.likesCount = result.likesCount;
        this.problem.dislikesCount = result.dislikesCount;
      }
    )
  }

  dislike(){
    this.service.problemDislike(this.problem.id).subscribe(
      (result: any) => {
        this.problem.voteType = 0;
        this.problem.likesCount = result.likesCount;
        this.problem.dislikesCount = result.dislikesCount;
      }
    )
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }

}
