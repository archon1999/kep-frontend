import { Component, Input, ViewEncapsulation } from '@angular/core';
import { CoreCommonModule } from '@core/common.module';
import { NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { Hackathon } from '@hackathons/domain';
import { Resources } from '@app/resources';
import { ResourceByIdPipe } from '@shared/pipes/resource-by-id.pipe';

@Component({
  selector: 'hackathon-tab',
  templateUrl: './hackathon-tab.component.html',
  styleUrls: ['./hackathon-tab.component.scss'],
  standalone: true,
  imports: [CoreCommonModule, NgbNavModule, ResourceByIdPipe],
  encapsulation: ViewEncapsulation.None
})
export class HackathonTabComponent {
  @Input() hackathon: Hackathon;
  public activeId = 1;
  protected readonly Resources = Resources;
}
