import { Component } from '@angular/core';
import { KeenIconComponent } from '@shared/components/keen-icon/keen-icon.component';
import { NgbTooltip } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'delete-action',
  imports: [
    KeenIconComponent,
    NgbTooltip
  ],
  templateUrl: './delete-action.component.html',
  standalone: true,
  styleUrl: './delete-action.component.scss'
})
export class DeleteActionComponent {}
