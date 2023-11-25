import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { CoreConfigService } from '../../../../../../core/services/config.service';
import { CoreConfig } from '../../../../../../core/types';
import { Contest } from '../../../contests.models';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'contest-card-small',
  templateUrl: './contest-card-small.component.html',
  styleUrls: ['./contest-card-small.component.scss']
})
export class ContestCardSmallComponent implements OnInit, OnDestroy {

  @Input() contest: Contest;

  coreConfig: CoreConfig;

  routerLink = "";

  _unsubscribeAll = new Subject();

  constructor(
    public coreConfigService: CoreConfigService,
  ) { }

  ngOnInit(): void {
    this.coreConfigService.getConfig()
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((config: any) => {
        this.coreConfig = config;
      })

    if(this.contest.status == 1){
      this.routerLink = `/competitions/contests/contest/${this.contest.id}/standings`
    } else {
      this.routerLink = `/competitions/contests/contest/${this.contest.id}`
    }
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }

}
