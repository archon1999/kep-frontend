import { Component, inject, Input, ViewEncapsulation } from '@angular/core';
import { Arena } from '@arena/arena.models';
import { TranslateModule } from '@ngx-translate/core';
import { KepIconComponent } from '@shared/components/kep-icon/kep-icon.component';
import { DatePipe } from '@angular/common';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { ArenaService } from '@arena/arena.service';

@Component({
  selector: 'arena-card',
  standalone: true,
  imports: [
    TranslateModule,
    KepIconComponent,
    DatePipe,
    NgbTooltipModule
  ],
  templateUrl: './arena-card.component.html',
  styleUrl: './arena-card.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class ArenaCardComponent {
  @Input() arena: Arena;

  private service = inject(ArenaService);

  register() {
    this.service.arenaRegistration(this.arena.id).subscribe(() => {
      this.arena.isRegistrated = true;
      this.arena.pause = true;
    });
  }

}
