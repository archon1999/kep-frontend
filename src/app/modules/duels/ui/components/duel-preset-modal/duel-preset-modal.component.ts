import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { SpinnerComponent } from '@shared/components/spinner/spinner.component';
import { FlatpickrDirective } from 'angularx-flatpickr';
import { DuelPreset, DuelReadyPlayer } from '@duels/domain';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'duel-preset-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, TranslateModule, SpinnerComponent, FlatpickrDirective],
  templateUrl: './duel-preset-modal.component.html',
  styleUrls: ['./duel-preset-modal.component.scss'],
})
export class DuelPresetModalComponent {
  @Input() opponent: DuelReadyPlayer | null = null;
  @Input() presets: DuelPreset[] = [];
  @Input() loading = false;
  @Input() minDate: string | Date | null = null;
  @Output() create = new EventEmitter<void>();

  constructor(private readonly activeModal: NgbActiveModal) {
  }

  private _form: FormGroup | null = null;

  get form(): FormGroup | null {
    return this._form;
  }

  @Input()
  set form(value: FormGroup | null) {
    this._form = value;
  }

  get presetControl() {
    return this.form?.get('presetId');
  }

  get startTimeControl() {
    return this.form?.get('startTime');
  }

  isSelected(presetId: number): boolean {
    return this.presetControl?.value === presetId;
  }

  selectPreset(presetId: number): void {
    if (!this.presetControl) {
      return;
    }
    this.presetControl.setValue(presetId);
    this.presetControl.markAsTouched();
    this.presetControl.markAsDirty();
  }

  onPresetKeydown(event: KeyboardEvent, presetId: number): void {
    event.preventDefault();
    this.selectPreset(presetId);
  }

  onSubmit(): void {
    if (!this.form) {
      return;
    }
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.create.emit();
  }

  onCancel(): void {
    this.activeModal.dismiss();
  }
}
