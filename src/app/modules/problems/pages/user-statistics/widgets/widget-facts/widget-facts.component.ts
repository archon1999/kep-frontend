import { Component, Input } from '@angular/core';
import { CoreCommonModule } from '@core/common.module';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { Resources } from '@app/resources';
import { ResourceByIdPipe } from '@shared/pipes/resource-by-id.pipe';
import { KepCardComponent } from '@shared/components/kep-card/kep-card.component';
import { TranslateModule } from '@ngx-translate/core';
import { AttemptVerdictHTMLPipe } from "@problems/pipes/attempt-verdict-html.pipe";

export interface Facts {
  firstAttempt: any;
  lastAttempt: any;
  firstAccepted: any;
  lastAccepted: any;
  mostAttemptedProblem: any;
  mostAttemptedForSolveProblem: any;
  solvedWithSingleAttempt: number;
  solvedWithSingleAttemptPercentage: number;
}

@Component({
  selector: 'widget-facts',
  templateUrl: './widget-facts.component.html',
  standalone: true,
  imports: [CoreCommonModule, NgbTooltipModule, ResourceByIdPipe, KepCardComponent, TranslateModule, AttemptVerdictHTMLPipe],
})
export class WidgetFactsComponent {

  @Input() facts: Facts;
  protected readonly Resources = Resources;
}
