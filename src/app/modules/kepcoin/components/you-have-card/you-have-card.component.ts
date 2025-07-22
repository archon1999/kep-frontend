import { Component, EventEmitter, Output, Input } from '@angular/core';
import { CoreCommonModule } from '@core/common.module';
import { KepcoinSpendSwalModule } from '@shared/components/kepcoin-spend-swal/kepcoin-spend-swal.module';

@Component({
  selector: 'you-have-card',
  standalone: true,
  imports: [CoreCommonModule, KepcoinSpendSwalModule],
  templateUrl: './you-have-card.component.html'
})
export class YouHaveCardComponent {
  @Input() streak = 0;
  @Input() streakFreeze = 0;
  @Output() buy = new EventEmitter<void>();
}
