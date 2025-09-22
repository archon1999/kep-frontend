import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CoreCommonModule } from '@core/common.module';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { Facts } from '../../../models/statistics.models';
import { KepCardComponent } from '@shared/components/kep-card/kep-card.component';
import { KepIconComponent } from '@shared/components/kep-icon/kep-icon.component';

interface FactEntry {
  key: string;
  icon: string;
  problemTitle?: string;
  datetime?: string;
  attempts?: number;
  meta?: string;
}

@Component({
  selector: 'section-facts',
  templateUrl: './section-facts.component.html',
  styleUrls: ['./section-facts.component.scss'],
  standalone: true,
  imports: [CoreCommonModule, NgbTooltipModule, KepCardComponent, KepIconComponent],
})
export class SectionFactsComponent implements OnChanges {

  @Input() facts: Facts | null = null;

  public factEntries: FactEntry[] = [];

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['facts']) {
      this.buildFacts();
    }
  }

  private buildFacts() {
    const factEntries: FactEntry[] = [];
    if (!this.facts) {
      this.factEntries = [];
      return;
    }

    if (this.facts.firstAttempt) {
      factEntries.push({
        key: 'FirstAttempt',
        icon: 'flag',
        problemTitle: this.facts.firstAttempt.problemTitle,
        datetime: this.facts.firstAttempt.datetime,
      });
    }

    if (this.facts.firstAccepted) {
      factEntries.push({
        key: 'FirstAccepted',
        icon: 'award',
        problemTitle: this.facts.firstAccepted.problemTitle,
        datetime: this.facts.firstAccepted.datetime,
      });
    }

    if (this.facts.lastAttempt) {
      factEntries.push({
        key: 'LastAttempt',
        icon: 'clock',
        problemTitle: this.facts.lastAttempt.problemTitle,
        datetime: this.facts.lastAttempt.datetime,
      });
    }

    if (this.facts.lastAccepted) {
      factEntries.push({
        key: 'LastAccepted',
        icon: 'check-circle',
        problemTitle: this.facts.lastAccepted.problemTitle,
        datetime: this.facts.lastAccepted.datetime,
      });
    }

    if (this.facts.mostAttemptedProblem) {
      factEntries.push({
        key: 'MostAttemptedProblem',
        icon: 'target',
        problemTitle: this.facts.mostAttemptedProblem.problemTitle,
        attempts: this.facts.mostAttemptedProblem.attemptsCount,
      });
    }

    if (this.facts.mostAttemptedForSolveProblem) {
      factEntries.push({
        key: 'MostAttemptedForSolveProblem',
        icon: 'activity',
        problemTitle: this.facts.mostAttemptedForSolveProblem.problemTitle,
        attempts: this.facts.mostAttemptedForSolveProblem.attemptsCount,
      });
    }

    factEntries.push({
      key: 'SolvedWithSingleAttempt',
      icon: 'zap',
      meta: `${this.facts.solvedWithSingleAttempt} (${this.facts.solvedWithSingleAttemptPercentage}%)`,
    });

    this.factEntries = factEntries;
  }
}
