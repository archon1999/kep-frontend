import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Contest } from '@contests/models/contest';
import { Attempt } from '../../../models/attempts.models';
import { AttemptLangs, Verdicts } from '../../../constants';
import { ProblemsApiService } from '../../../services/problems-api.service';

@Component({
  selector: 'app-attempt-detail-modal',
  templateUrl: './attempt-detail-modal.component.html',
  styleUrls: ['./attempt-detail-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
})
export class AttemptDetailModalComponent {
  @Input() attempt: Attempt;
  @Input() contest: Contest;
  @Input() hideSourceCodeSize = false;
  @Input() hackEnabled = false;

  @Output() hackSubmitted = new EventEmitter<void>();

  public readonly AttemptLangs = AttemptLangs;
  public readonly Verdicts = Verdicts;

  public hackForm = new FormGroup({
    input: new FormControl(''),
    generatorSource: new FormControl(''),
    generatorLang: new FormControl(AttemptLangs.PYTHON),
  });

  public hackAvailableLanguages = [
    AttemptLangs.PYTHON,
    AttemptLangs.CPP,
    AttemptLangs.C,
    AttemptLangs.JAVA,
    AttemptLangs.JS,
    AttemptLangs.KOTLIN,
    AttemptLangs.RUST,
    AttemptLangs.HASKELL,
    AttemptLangs.R,
  ];

  constructor(
    private problemsService: ProblemsApiService,
    public activeModal: NgbActiveModal,
  ) {}

  get shouldDisplayErrorMessage(): boolean {
    if (!this.attempt) {
      return false;
    }

    return (
      !!this.errorMessage &&
      (this.attempt.verdict === Verdicts.CompilationError ||
        this.attempt.verdict === Verdicts.SyntaxError)
    );
  }

  get errorMessage(): string {
    return this.attempt?.errorMessage?.trim();
  }

  onHackSubmit() {
    if (!this.attempt) {
      return;
    }

    this.problemsService.hackSubmit(this.attempt.id, this.hackForm.value).subscribe(() => {
      this.hackSubmitted.emit();
      this.activeModal.close();
    });
  }
}
