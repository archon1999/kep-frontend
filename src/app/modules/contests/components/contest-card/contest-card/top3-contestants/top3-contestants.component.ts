import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';

import { ContestantViewModule } from '@contests/components/contestant-view/contestant-view.module';
import { fadeInOnEnterAnimation } from 'angular-animations';
import { ContestsService } from '@contests/contests.service';
import { SpinnerComponent } from '@shared/components/spinner/spinner.component';
import { Contest } from '@contests/models/contest';

@Component({
  selector: 'top3-contestants',
  standalone: true,
  imports: [ContestantViewModule, SpinnerComponent],
  templateUrl: './top3-contestants.component.html',
  styleUrl: './top3-contestants.component.scss',
  animations: [fadeInOnEnterAnimation({ duration: 1000 })],
  encapsulation: ViewEncapsulation.None,
})
export class Top3ContestantsComponent implements OnInit {

  @Input() contest: Contest;
  public top3Contestants: Array<any> = [];

  constructor(public service: ContestsService) {}

  ngOnInit() {
    this.service.getTop3Contestants(this.contest.id).subscribe(
      (result: any) => {
        this.top3Contestants = result;
      }
    );
  }

}
