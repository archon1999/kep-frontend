import { Component } from '@angular/core';
import { KeenIconComponent } from '@shared/components/keen-icon/keen-icon.component';
import { NgbTooltip } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'view-action',
  imports: [
    KeenIconComponent,
    NgbTooltip
  ],
  templateUrl: './view-action.component.html',
  standalone: true,
  styleUrl: './view-action.component.scss'
})
export class ViewActionComponent {}
