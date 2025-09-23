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

type FactKey =
  | 'firstAttempt'
  | 'firstAccepted'
  | 'lastAttempt'
  | 'lastAccepted'
  | 'mostAttemptedProblem'
  | 'mostAttemptedForSolveProblem'
  | 'solvedWithSingleAttempt';

type FactType = 'attempt' | 'accepted' | 'attemptCount' | 'singleAttempt';

interface FactItem {
  key: FactKey;
  translationKey: string;
  icon: {
    type: 'feather' | 'kep';
    name: string;
    classes: string;
  };
  type: FactType;
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

  protected readonly factItems: FactItem[] = [
    {
      key: 'firstAttempt',
      translationKey: 'FirstAttempt',
      icon: {
        type: 'feather',
        name: 'attempt',
        classes: 'bg-primary-subtle text-primary',
      },
      type: 'attempt',
    },
    {
      key: 'firstAccepted',
      translationKey: 'FirstSolvedProblem',
      icon: {
        type: 'feather',
        name: 'problem',
        classes: 'bg-success-subtle text-success',
      },
      type: 'accepted',
    },
    {
      key: 'lastAttempt',
      translationKey: 'LastAttempt',
      icon: {
        type: 'feather',
        name: 'attempt',
        classes: 'bg-warning-subtle text-warning',
      },
      type: 'attempt',
    },
    {
      key: 'lastAccepted',
      translationKey: 'LastSolvedProblem',
      icon: {
        type: 'feather',
        name: 'problem',
        classes: 'bg-info-subtle text-info',
      },
      type: 'accepted',
    },
    {
      key: 'mostAttemptedProblem',
      translationKey: 'MostAttemptedProblem',
      icon: {
        type: 'feather',
        name: 'attempt',
        classes: 'bg-danger-subtle text-danger',
      },
      type: 'attemptCount',
    },
    {
      key: 'mostAttemptedForSolveProblem',
      translationKey: 'MostAttemptedForSolveProblem',
      icon: {
        type: 'feather',
        name: 'problem',
        classes: 'bg-secondary-subtle text-secondary',
      },
      type: 'attemptCount',
    },
    {
      key: 'solvedWithSingleAttempt',
      translationKey: 'SolvedWithSingleAttempt',
      icon: {
        type: 'kep',
        name: 'check-circle',
        classes: 'bg-primary-subtle text-primary',
      },
      type: 'singleAttempt',
    },
  ];
}
