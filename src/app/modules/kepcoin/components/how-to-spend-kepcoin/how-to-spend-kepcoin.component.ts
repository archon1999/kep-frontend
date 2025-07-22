import { Component } from '@angular/core';
import { CoreCommonModule } from '@core/common.module';
import { KepcoinViewModule } from '@shared/components/kepcoin-view/kepcoin-view.module';
import { KepCardComponent } from '@shared/components/kep-card/kep-card.component';

@Component({
  selector: 'how-to-spend-kepcoin',
  standalone: true,
  imports: [CoreCommonModule, KepcoinViewModule, KepCardComponent],
  templateUrl: './how-to-spend-kepcoin.component.html'
})
export class HowToSpendKepcoinComponent {}
