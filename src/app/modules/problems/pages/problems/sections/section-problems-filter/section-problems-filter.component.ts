import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { User } from 'app/auth/models';
import { AuthenticationService } from 'app/auth/service';
import { ProblemsFilter, Tag } from '../../../../models/problems.models';
import { ProblemsService } from 'app/modules/problems/services/problems.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { LocalStorageService } from 'app/shared/storages/local-storage.service';
import { ProblemsFilterService } from 'app/modules/problems/services/problems-filter.service';

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

  public filter: ProblemsFilter;

  public tags: Array<Tag> = [];
  public difficulties: Array<Difficulty> = [];

  public currentUser: User;

  private _unsubscribeAll = new Subject();

  constructor(
    public service: ProblemsService,
    public authService: AuthenticationService,
    public problemsFilterService: ProblemsFilterService,
  ) { }

  ngOnInit(): void {
    this.authService.currentUser.pipe(takeUntil(this._unsubscribeAll)).subscribe(
      (user: User | null) => {
        this.currentUser = user;
      }
    )

    this.problemsFilterService.getFilter().subscribe(
      (filter: ProblemsFilter) => {
        this.filter = filter;
      }
    )

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
      this.problemsFilterService.updateFilter(this.filter);
    }, 100);
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }

}
