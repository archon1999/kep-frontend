import { ChangeDetectorRef, Component, inject, Input } from '@angular/core';
import { Arena, ArenaStatus } from '@arena/arena.models';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { CoreCommonModule } from '@core/common.module';
import { KepCardComponent } from '@shared/components/kep-card/kep-card.component';
import { ArenaService } from '@arena/arena.service';

@Component({
  selector: 'arena-info',
  standalone: true,
  imports: [
    NgbTooltipModule,
    CoreCommonModule,
    KepCardComponent
  ],
  templateUrl: './arena-info.component.html',
  styleUrl: './arena-info.component.scss'
})
export class ArenaInfoComponent {
  @Input() arena: Arena;

  protected readonly ArenaStatus = ArenaStatus;

  private service = inject(ArenaService);
  private cdr = inject(ChangeDetectorRef);

  register() {
    this.service.arenaRegistration(this.arena.id).subscribe(() => {
      this.arena.isRegistrated = true;
      this.arena.pause = true;
      this.cdr.markForCheck();
      this.cdr.detectChanges();
    });
  }
}
