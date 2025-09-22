import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CoreCommonModule } from '@core/common.module';
import { CoreDirectivesModule } from '@shared/directives/directives.module';
import { SpendType } from '../../enums';
import { Resources } from '@app/resources';
import { ResourceByIdPipe } from '@shared/pipes/resource-by-id.pipe';

@Component({
  selector: 'kepcoin-spends-list',
  standalone: true,
  imports: [CoreCommonModule, RouterLink, CoreDirectivesModule, ResourceByIdPipe],
  templateUrl: './spends-list.component.html'
})
export class SpendsListComponent {
  @Input() spends: any[] = [];
  SpendType = SpendType;
  protected readonly Resources = Resources;
}
