import { Component, Input } from '@angular/core';

import { KepIconComponent } from '@shared/components/kep-icon/kep-icon.component';

@Component({
  selector: 'kep-delta',
  standalone: true,
  imports: [KepIconComponent],
  templateUrl: './kep-delta.component.html',
  styleUrl: './kep-delta.component.scss'
})
export class KepDeltaComponent {
  @Input() value: number;
}
