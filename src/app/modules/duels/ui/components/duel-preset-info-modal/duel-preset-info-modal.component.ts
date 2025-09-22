import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { DuelPreset, DuelPresetProblem } from '@duels/domain';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'duel-preset-info-modal',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './duel-preset-info-modal.component.html',
  styleUrls: ['./duel-preset-info-modal.component.scss'],
})
export class DuelPresetInfoModalComponent {
  @Input() preset: DuelPreset | null = null;

  constructor(private readonly activeModal: NgbActiveModal) {}

  close(): void {
    this.activeModal.dismiss();
  }

  trackProblem(_: number, problem: DuelPresetProblem): number {
    return problem.id;
  }
}
