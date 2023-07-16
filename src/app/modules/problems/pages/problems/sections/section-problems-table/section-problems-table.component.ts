import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { CoreConfigService } from '@core/services/config.service';
import { CoreConfig } from '@core/types';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Problem } from '../../../../models/problems.models';
import { fadeInOnEnterAnimation } from 'angular-animations';

@Component({
  selector: 'section-problems-table',
  templateUrl: './section-problems-table.component.html',
  styleUrls: ['./section-problems-table.component.scss'],
  animations: [fadeInOnEnterAnimation({ duration: 1000 })]
})
export class SectionProblemsTableComponent implements OnInit, OnDestroy {

  @Input() problems: Array<Problem>;
  @Output() tagClick = new EventEmitter<number>();

  public isDarkSkin = false;

  private _unsubscribeAll = new Subject();

  constructor(
    public coreConfigService: CoreConfigService,
  ) { }

  ngOnInit(): void {
    this.coreConfigService.getConfig().pipe(takeUntil(this._unsubscribeAll)).subscribe(
      (config: CoreConfig) => {
        this.isDarkSkin = config.layout.skin == 'dark';
      }
    )
  }

  tagOnClick(tagId: number) {
    this.tagClick.emit(tagId);
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }

}
