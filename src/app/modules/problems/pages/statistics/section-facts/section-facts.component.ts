import { Component, Input } from '@angular/core';
import { CoreCommonModule } from '@core/common.module';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { Resources } from '@app/resources';
import { ResourceByIdPipe } from '@shared/pipes/resource-by-id.pipe';
import { ProblemsFacts } from '@problems/models/statistics.models';

@Component({
  selector: 'section-facts',
  templateUrl: './section-facts.component.html',
  styleUrls: ['./section-facts.component.scss'],
  standalone: true,
  imports: [CoreCommonModule, NgbTooltipModule, ResourceByIdPipe],
})
export class SectionFactsComponent {

  @Input() facts: ProblemsFacts;
  protected readonly Resources = Resources;
}
