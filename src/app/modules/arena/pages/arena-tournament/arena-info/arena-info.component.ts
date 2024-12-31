import { Component, inject, Input } from '@angular/core';
import { Arena, ArenaStatus } from '@arena/arena.models';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { CoreCommonModule } from '@core/common.module';
import { ArenaService } from '@arena/arena.service';

@Component({
  selector: 'arena-info',
  standalone: true,
  imports: [
    NgbTooltipModule,
    CoreCommonModule
  ],
  templateUrl: './arena-info.component.html',
  styleUrl: './arena-info.component.scss'
})
export class ArenaInfoComponent {
  @Input() arena: Arena;

  protected readonly ArenaStatus = ArenaStatus;

  private service = inject(ArenaService);

  register() {
    this.service.arenaRegistration(this.arena.id).subscribe(() => {
      this.arena.isRegistrated = true;
      this.arena.pause = true;
    });
  }
}
