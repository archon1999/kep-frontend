import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { CoreConfigService } from '@core/services/config.service';
import { CoreConfig } from '@core/types';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Problem } from '../../../../models/problems.models';
import { fadeInOnEnterAnimation } from 'angular-animations';
import { User } from 'app/auth/models';
import { AuthenticationService } from 'app/auth/service';
import { LocalStorageService } from 'app/shared/storages/local-storage.service';

@Component({
  selector: 'section-problems-table',
  templateUrl: './section-problems-table.component.html',
  styleUrls: ['./section-problems-table.component.scss'],
  animations: [fadeInOnEnterAnimation({ duration: 1000 })]
})
export class SectionProblemsTableComponent implements OnInit, OnDestroy {

  @Input() problems: Array<Problem>;
  @Output() tagClick = new EventEmitter<number>();
  @Output() changeOrdering = new EventEmitter<string>();

  public isDarkSkin = false;
  public currentUser: User | null;

  public ordering: string;

  private _unsubscribeAll = new Subject();

  constructor(
    public coreConfigService: CoreConfigService,
    public authService: AuthenticationService,
    public localStorageService: LocalStorageService,
  ) { }

  ngOnInit(): void {
    this.setOrdering(this.localStorageService.get('problemsOrdering') || 'id');

    this.coreConfigService.getConfig().pipe(takeUntil(this._unsubscribeAll)).subscribe(
      (config: CoreConfig) => {
        this.isDarkSkin = config.layout.skin == 'dark';
      }
    )

    this.authService.currentUser.pipe(takeUntil(this._unsubscribeAll)).subscribe(
      (user: User | null) => {
        this.currentUser = user;
      }
    )
  }

  setOrdering(ordering: string){
    if(this.ordering == ordering){
      ordering = '-' + ordering;
    }
    this.localStorageService.set('problemsOrdering', ordering);
    this.ordering = ordering;
    this.changeOrdering.emit(ordering);
  }

  tagOnClick(tagId: number) {
    this.tagClick.emit(tagId);
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }

}
