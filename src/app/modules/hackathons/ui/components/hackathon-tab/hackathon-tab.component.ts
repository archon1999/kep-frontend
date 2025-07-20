import { Component, Input, ViewEncapsulation } from '@angular/core';
import { CoreCommonModule } from '@core/common.module';
import { NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { Hackathon } from '@hackathons/domain';

@Component({
  selector: 'hackathon-tab',
  templateUrl: './hackathon-tab.component.html',
  styleUrls: ['./hackathon-tab.component.scss'],
  standalone: true,
  imports: [CoreCommonModule, NgbNavModule],
  encapsulation: ViewEncapsulation.None
})
export class HackathonTabComponent {
  @Input() hackathon: Hackathon;
  public activeId = 1;
}
