import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { NgFor, NgIf } from '@angular/common';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { DuelPreset } from '@duels/domain';

@Component({
  selector: 'duel-preset-info-modal',
  standalone: true,
  templateUrl: './duel-preset-info-modal.component.html',
  styleUrls: ['./duel-preset-info-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TranslateModule, NgIf, NgFor],
})
export class DuelPresetInfoModalComponent {
  @Input({ required: true }) preset!: DuelPreset;

  constructor(public readonly activeModal: NgbActiveModal) {}
}
