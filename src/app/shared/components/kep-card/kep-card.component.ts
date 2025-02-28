import { Component, Input } from '@angular/core';

@Component({
  selector: 'kep-card',
  standalone: true,
  imports: [],
  templateUrl: './kep-card.component.html',
  styleUrl: './kep-card.component.scss'
})
export class KepCardComponent {
  @Input() customClass: string | object;
  @Input() cardHeight: string;
}
