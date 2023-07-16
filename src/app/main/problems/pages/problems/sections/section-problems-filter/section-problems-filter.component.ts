import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { User } from 'app/auth/models';
import { AuthenticationService } from 'app/auth/service';
import { ProblemFilter, Tag } from 'app/main/problems/problems.models';
import { ProblemsService } from 'app/main/problems/problems.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

interface Difficulty {
  id: number;
  name: string;
}

@Component({
  selector: 'section-problems-filter',
  templateUrl: './section-problems-filter.component.html',
  styleUrls: ['./section-problems-filter.component.scss']
})
export class SectionProblemsFilterComponent implements OnInit, OnDestroy {

  @Output() filterChange = new EventEmitter<ProblemFilter>();

  public filter: ProblemFilter;

  public tags: Array<Tag> = [];
  public difficulties: Array<Difficulty> = [];

  public currentUser: User;

  private _unsubscribeAll = new Subject();

  constructor(
    public service: ProblemsService,
    public authService: AuthenticationService,
  ) { }

  ngOnInit(): void {
    this.authService.currentUser.pipe(takeUntil(this._unsubscribeAll)).subscribe(
      (user: User | null) => {
        this.currentUser = user;
      }
    )

    let problemsFilter = localStorage.getItem('problemsFilter');
    if(problemsFilter){
      this.filter = JSON.parse(problemsFilter);
      this.reload();
    } else {
      this.resetFilter();
    }

    this.service.getTags().subscribe(
      (tags: any) => {
        this.tags = tags;
      }
    );

    this.service.getDifficulties().subscribe(
      (difficulties: any) => {
        this.difficulties = difficulties;
      }
    );
  }

  reload() {
    setTimeout(() => {    
      this.filterChange.emit(this.filter);
      localStorage.setItem('problemsFilter', JSON.stringify(this.filter));
    }, 100);
  }

  resetFilter() {
    this.filter = {
      title: '',
      tags: [],
      difficulty: null,
      status: null,
    };
    this.reload();
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }

}
