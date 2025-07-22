import { Component } from '@angular/core';
import { CoreCommonModule } from '@core/common.module';
import { KepcoinViewModule } from '@shared/components/kepcoin-view/kepcoin-view.module';
import { KepCardComponent } from '@shared/components/kep-card/kep-card.component';

@Component({
  selector: 'how-to-earn-kepcoin',
  standalone: true,
  imports: [CoreCommonModule, KepcoinViewModule, KepCardComponent],
  templateUrl: './how-to-earn-kepcoin.component.html'
})
export class HowToEarnKepcoinComponent {}
