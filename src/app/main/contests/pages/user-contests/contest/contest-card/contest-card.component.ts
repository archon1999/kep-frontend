import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { CoreConfigService } from '@core/services/config.service';
import { CoreConfig } from '@core/types';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { bounceAnimation } from 'angular-animations';
import { ApiService } from 'app/api.service';
import { Contest } from 'app/main/contests/contests.models';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'contest-card',
  templateUrl: './contest-card.component.html',
  styleUrls: ['./contest-card.component.scss'],
  animations: [
    bounceAnimation({ delay: 500 })
  ]
})
export class ContestCardComponent implements OnInit, OnDestroy {
  @Input() contest: Contest;

  coreConfig: CoreConfig;
  routerLink = "";
  textColor = "";

  private _unsubscribeAll = new Subject();

  constructor(
    public api: ApiService,
    public coreConfigService: CoreConfigService,
    public modalService: NgbModal,
  ) {}

  ngOnInit(): void {
    if(this.contest.status == 1){
      this.routerLink = `/competitions/contests/contest/${this.contest.id}/standings`
    } else {
      this.routerLink = `/competitions/contests/contest/${this.contest.id}`
    }

    this.contest = Contest.fromJSON(this.contest);

    this.coreConfigService.getConfig().pipe(takeUntil(this._unsubscribeAll)).subscribe((config: any) => {
      this.coreConfig = config;
      if(this.coreConfig.layout.skin != 'dark'){
        this.textColor = '#19115e';
      } else {
        this.textColor = '#ffffff';
      }
    });
  }

  openRegistrationModal(content){
    this.api.post(`user-contests/${this.contest.id}/registration/`).subscribe((result: any) => {
      if(result.success){
        this.contest.isRegistered = true;
      }
    })
  }

  cancelRegistration(){
    this.api.get(`contests/${this.contest.id}/cancel-registration/`).subscribe((result: any) => {
      if(result.success){
        this.contest.isRegistered = false;
      }
    })
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }
}
