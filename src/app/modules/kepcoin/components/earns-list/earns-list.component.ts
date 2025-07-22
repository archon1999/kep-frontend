import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CoreCommonModule } from '@core/common.module';
import { CoreDirectivesModule } from '@shared/directives/directives.module';
import { EarnType } from '../../enums';

@Component({
  selector: 'kepcoin-earns-list',
  standalone: true,
  imports: [CoreCommonModule, RouterLink, CoreDirectivesModule],
  templateUrl: './earns-list.component.html'
})
export class EarnsListComponent {
  @Input() earns: any[] = [];
  EarnType = EarnType;
}
