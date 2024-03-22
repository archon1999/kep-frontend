import { Component, Input } from '@angular/core';
import { Arena } from '@arena/arena.models';
import { TranslateModule } from '@ngx-translate/core';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { KepIconComponent } from '@shared/components/kep-icon/kep-icon.component';

@Component({
  selector: 'arena-chapters',
  standalone: true,
  imports: [
    TranslateModule,
    NgbTooltipModule,
    KepIconComponent
  ],
  templateUrl: './arena-chapters.component.html',
  styleUrl: './arena-chapters.component.scss'
})
export class ArenaChaptersComponent {
  @Input() arena: Arena;
}
