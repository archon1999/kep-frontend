import { Component, Input } from '@angular/core';
import { Contest } from '@contests/contests.models';
import { CoreCommonModule } from '@core/common.module';
import { NgbNavModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'contest-tab',
  templateUrl: './contest-tab.component.html',
  styleUrls: ['./contest-tab.component.scss'],
  standalone: true,
  imports: [CoreCommonModule, NgbNavModule]
})
export class ContestTabComponent {
  @Input() contest: Contest;
  public activeId = 1;
}
