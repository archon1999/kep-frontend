import { Component, Input } from '@angular/core';
import { AttemptLangs } from '@problems/constants';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'attempt-language',
  standalone: true,
  imports: [
    NgbTooltipModule
  ],
  templateUrl: './attempt-language.component.html',
  styleUrl: './attempt-language.component.scss'
})
export class AttemptLanguageComponent {
  @Input({ required: true }) lang: AttemptLangs;
  @Input() langFull: string;
  @Input() size = 36;
  @Input() clickable = false;
}
