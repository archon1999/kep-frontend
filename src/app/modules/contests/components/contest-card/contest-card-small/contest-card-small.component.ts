import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { Contest } from '@contests/models/contest';

@Component({
  selector: 'contest-card-small',
  templateUrl: './contest-card-small.component.html',
  styleUrls: ['./contest-card-small.component.scss'],
  standalone: false,
})
export class ContestCardSmallComponent implements OnInit, OnDestroy {

  @Input() contest: Contest;

  routerLink = "";

  _unsubscribeAll = new Subject();

  ngOnInit(): void {
    if (this.contest.status == 1) {
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
