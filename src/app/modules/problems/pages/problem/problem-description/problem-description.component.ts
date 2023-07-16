import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { User } from 'app/auth/models';
import { AuthenticationService } from 'app/auth/service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AvailableLanguage, Problem } from '../../../problems.models';
import { ProblemsService } from '../../../problems.service';

@Component({
  selector: 'problem-description',
  templateUrl: './problem-description.component.html',
  styleUrls: ['./problem-description.component.scss']
})
export class ProblemDescriptionComponent implements OnInit, OnDestroy {

  @Input() problem: Problem;

  public selectedLang: string;
  public availableLang: AvailableLanguage;

  public currentUser: User;

  public problemSolution: any;

  public tags = [];
  public selectedTag: number;

  private _unsubscribeAll = new Subject();

  constructor(
    public authService: AuthenticationService,
    public service: ProblemsService,
    public modalService: NgbModal
  ) { }

  ngOnInit(): void {
    this.changeLang(localStorage.getItem('problems-selected-lang')||'py');
    window.onbeforeunload = () => this.ngOnDestroy();

    this.authService.currentUser
     .pipe(takeUntil(this._unsubscribeAll))
     .subscribe((user: any) => {
      this.currentUser = user;
      if(this.currentUser && this.currentUser.permissions.canChangeProblemTags){
        this.service.getTags().subscribe((tags: any) => this.tags = tags);
      }
    });
  }

  changeLang(lang: string){
    this.selectedLang = lang;
    for(let availableLang of this.problem.availableLanguages){
      if(availableLang.lang == this.selectedLang){
        this.availableLang = availableLang;
      }
    }
    if(!this.availableLang){
      this.availableLang = this.problem.availableLanguages[0];
      this.selectedLang = this.availableLang.lang;
    }
    localStorage.setItem('problems-selected-lang', this.selectedLang);
  }

  onPurchaseSolution(){
    this.problem.canViewSolution = true;
  }

  openSolutionModal(content){
    this.service.getProblemSolution(this.problem.id).subscribe((result: any) => {
      this.problemSolution = result;
      this.modalService.open(content, {
        scrollable: true,
      });
    })
  }

  removeTag(tag){
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
