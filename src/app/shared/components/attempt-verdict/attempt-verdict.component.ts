import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Verdicts } from '@problems/constants';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';

const testCaseHideVerdicts = [
  Verdicts.Accepted,
  Verdicts.InQueue,
  Verdicts.Rejected,
  Verdicts.JudgementFailed,
  Verdicts.CheckerNotFound,
  Verdicts.PartialSolution,
  Verdicts.Hacked,
];

function getVerdictColor(verdict: Verdicts) {
  const verdictColors = {
    [Verdicts.Accepted]: 'success',
    [Verdicts.FakeAccepted]: 'success',
    [Verdicts.JudgementFailed]: 'dark',
    [Verdicts.CheckerNotFound]: 'dark',
    [Verdicts.InQueue]: 'primary',
    [Verdicts.Running]: 'blue',
    [Verdicts.PartialSolution]: 'warning',
  };
  return verdictColors[verdict] || 'danger';
}


function getShortTitle(verdict: Verdicts) {
  return {
    [Verdicts.InQueue]: '',
    [Verdicts.Running]: '',
    [Verdicts.JudgementFailed]: 'JF',
    [Verdicts.Accepted]: 'AC',
    [Verdicts.WrongAnswer]: 'WA',
    [Verdicts.RuntimeError]: 'RE',
    [Verdicts.TimeLimitExceeded]: 'TL',
    [Verdicts.OutputFormatError]: 'PE',
    [Verdicts.MemoryLimitExceeded]: 'ML',
    [Verdicts.Rejected]: 'RJ',
    [Verdicts.CompilationError]: 'CE',
    [Verdicts.CommandExecutingError]: 'CEE',
    [Verdicts.IdlenessLimitExceeded]: 'IL',
    [Verdicts.SyntaxError]: 'SE',
    [Verdicts.CheckerNotFound]: '',
    [Verdicts.OnlyPython]: '',
    [Verdicts.ObjectNotFound]: '',
    [Verdicts.FakeAccepted]: 'AC',
    [Verdicts.PartialSolution]: '',
    [Verdicts.NotAvailableLanguage]: '',
    [Verdicts.Hacked]: '',
  }[verdict];
}


@Component({
  selector: 'attempt-verdict',
  standalone: true,
  imports: [
    NgbTooltipModule
  ],
  templateUrl: './attempt-verdict.component.html',
  styleUrl: './attempt-verdict.component.scss'
})
export class AttemptVerdictComponent implements OnChanges {
  @Input({ required: true }) verdict: Verdicts;
  @Input() title: string;
  @Input() testCaseNumber: number;
  @Input() balls: number;

  public showTestCaseNumber = true;
  public showBall = true;
  public verdictColor: string;
  public shortTitle: string;

  ngOnChanges(changes: SimpleChanges) {
    this.showTestCaseNumber = (this.testCaseNumber > 0 && testCaseHideVerdicts.indexOf(this.verdict) === -1);
    this.showBall = (this.verdict === Verdicts.PartialSolution);
    this.verdictColor = getVerdictColor(this.verdict);
    this.shortTitle = getShortTitle(this.verdict);
  }
}
