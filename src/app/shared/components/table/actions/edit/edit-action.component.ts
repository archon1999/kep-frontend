import { Component } from '@angular/core';
import { KeenIconComponent } from '@shared/components/keen-icon/keen-icon.component';
import { NgbTooltip } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'edit-action',
  imports: [
    KeenIconComponent,
    NgbTooltip
  ],
  templateUrl: './edit-action.component.html',
  standalone: true,
  styleUrl: './edit-action.component.scss'
})
export class EditActionComponent {}
