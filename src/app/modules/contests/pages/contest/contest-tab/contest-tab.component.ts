import { Component, Input } from '@angular/core';
import { CoreCommonModule } from '@core/common.module';
import { NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { Contest } from '@contests/models/contest';
import { ContestClassesPipe } from '@contests/pipes/contest-classes.pipe';
import { Resources } from '@app/resources';
import { ResourceByIdPipe } from '@shared/pipes/resource-by-id.pipe';
import { ContestStatus } from '@contests/constants';

@Component({
  selector: 'contest-tab',
  templateUrl: './contest-tab.component.html',
  styleUrls: ['./contest-tab.component.scss'],
  standalone: true,
  imports: [CoreCommonModule, NgbNavModule, ContestClassesPipe, ResourceByIdPipe]
})
export class ContestTabComponent {
  @Input() contest: Contest;
  public activeId = 1;
  protected readonly Resources = Resources;
  protected readonly ContestStatus = ContestStatus;
}
