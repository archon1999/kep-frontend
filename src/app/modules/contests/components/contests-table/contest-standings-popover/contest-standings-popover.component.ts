import { Component, Input, OnInit } from '@angular/core';
import { ApiService } from '@core/data-access/api.service';

import { Contest } from '@contests/models/contest';
import { Resources } from '@app/resources';

@Component({
  selector: 'contest-standings-popover',
  templateUrl: './contest-standings-popover.component.html',
  styleUrls: ['./contest-standings-popover.component.scss'],
  standalone: false,
})
export class ContestStandingsPopoverComponent implements OnInit {

  @Input() contest: Contest;

  public contestants = [];

  constructor(
    public api: ApiService,
  ) { }

  ngOnInit(): void {
  }

  protected readonly Resources = Resources;

  loadContestants() {
    this.api.get(`contests/${this.contest.id}/top10-contestants`).subscribe((result: any) => {
      this.contestants = result;
    })

  }

}
