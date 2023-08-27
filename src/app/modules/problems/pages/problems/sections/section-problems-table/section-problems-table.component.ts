import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { CoreConfigService } from '@core/services/config.service';
import { CoreConfig } from '@core/types';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Problem, ProblemsFilter } from '../../../../models/problems.models';
import { fadeInOnEnterAnimation } from 'angular-animations';
import { User } from 'app/auth/models';
import { AuthenticationService } from 'app/auth/service';
import { LocalStorageService } from 'app/shared/storages/local-storage.service';
import { ProblemsFilterService } from '../../../../services/problems-filter.service';

@Component({
  selector: 'section-problems-table',
  templateUrl: './section-problems-table.component.html',
  styleUrls: ['./section-problems-table.component.scss'],
  animations: [fadeInOnEnterAnimation({ duration: 1000 })]
})
export class SectionProblemsTableComponent implements OnInit, OnDestroy {

  @Input() problems: Array<Problem>;

  public isDarkSkin = false;
  public currentUser: User | null;

  public filter: ProblemsFilter;
  public ordering: string;

  private _unsubscribeAll = new Subject();

  constructor(
    public coreConfigService: CoreConfigService,
    public authService: AuthenticationService,
    public localStorageService: LocalStorageService,
    public filterService: ProblemsFilterService,
  ) { }

  ngOnInit(): void {
    this.coreConfigService.getConfig().pipe(takeUntil(this._unsubscribeAll)).subscribe(
      (config: CoreConfig) => {
        this.isDarkSkin = config.layout.skin === 'dark';
      }
    )

    this.authService.currentUser.pipe(takeUntil(this._unsubscribeAll)).subscribe(
      (user: User | null) => {
        this.currentUser = user;
      }
    )

    this.filterService.getFilter().pipe(takeUntil(this._unsubscribeAll)).subscribe(
      (filter: ProblemsFilter) => {
        this.filter = filter;
        this.ordering = filter.ordering;
      }
    )
  }

  changeOrdering(ordering: string){
    this.ordering = ordering;
    this.filterService.updateFilter({ ordering: ordering });
  }

  tagOnClick(tagId: number) {
    let tags = this.filter.tags;
    var index = this.filter.tags.indexOf(tagId);
    if (index == -1) {
      tags.push(tagId);
    } else {
      tags.splice(index, 1);
    }
    this.filterService.updateFilter({ tags: tags });
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }

}
