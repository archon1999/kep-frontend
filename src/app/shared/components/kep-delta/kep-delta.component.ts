import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { KepIconComponent } from '@shared/components/kep-icon/kep-icon.component';

@Component({
  selector: 'kep-delta',
  standalone: true,
  imports: [CommonModule, KepIconComponent],
  templateUrl: './kep-delta.component.html',
  styleUrl: './kep-delta.component.scss'
})
export class KepDeltaComponent {
  @Input() value: number;
}
