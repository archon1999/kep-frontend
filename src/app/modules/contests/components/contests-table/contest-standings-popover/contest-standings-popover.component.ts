import { Component, Input, OnInit } from '@angular/core';
import { ApiService } from '../../../../../shared/services/api.service';
import { Contest } from '../../../contests.models';

@Component({
  selector: 'contest-standings-popover',
  templateUrl: './contest-standings-popover.component.html',
  styleUrls: ['./contest-standings-popover.component.scss']
})
export class ContestStandingsPopoverComponent implements OnInit {

  @Input() contest: Contest;

  public contestants = [];

  constructor(
    public api: ApiService,
  ) { }

  ngOnInit(): void {
  }

  loadContestants(){
    this.api.get(`contests/${this.contest.id}/top10-contestants`).subscribe((result: any) => {
      this.contestants = result;
    })

  }

}
