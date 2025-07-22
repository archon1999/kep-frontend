import { Component, EventEmitter, Output, Input } from '@angular/core';
import { CoreCommonModule } from '@core/common.module';
import { KepcoinSpendSwalModule } from '@shared/components/kepcoin-spend-swal/kepcoin-spend-swal.module';
import { KepCardComponent } from "@shared/components/kep-card/kep-card.component";
import { KepStreakComponent } from "@shared/components/kep-streak/kep-streak.component";

@Component({
  selector: 'you-have-card',
  standalone: true,
  imports: [CoreCommonModule, KepcoinSpendSwalModule, KepCardComponent, KepStreakComponent],
  templateUrl: './you-have-card.component.html'
})
export class YouHaveCardComponent {
  @Input() streak = 0;
  @Input() streakFreeze = 0;
  @Output() buy = new EventEmitter<void>();
}
