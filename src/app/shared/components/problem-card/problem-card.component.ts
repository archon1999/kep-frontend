import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { CoreConfigService } from '../../../../core/services/config.service';
import { CoreConfig } from '../../../../core/types';
import { Problem } from '../../../modules/problems/models/problems.models';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'problem-card',
  templateUrl: './problem-card.component.html',
  styleUrls: ['./problem-card.component.scss']
})
export class ProblemCardComponent implements OnInit, OnDestroy {

  @Input() problem: Problem;

  public isDarkLayout = false;

  private _unsubscribeAll = new Subject();

  constructor(
    public coreConfigService: CoreConfigService,
  ) { }

  ngOnInit(): void {
    this.coreConfigService.getConfig()
     .pipe(takeUntil(this._unsubscribeAll))
     .subscribe((config: CoreConfig) => {
      this.isDarkLayout = config.layout.skin == 'dark';
     })
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }
}
