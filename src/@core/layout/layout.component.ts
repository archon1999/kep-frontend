import { ChangeDetectorRef, Component, ViewEncapsulation } from '@angular/core';

import { HorizontalLayoutComponent } from '@layout/horizontal/horizontal-layout.component';
import { VerticalLayoutComponent } from '@layout/vertical/vertical-layout.component';
import { CoreConfigService } from '@core/services/config.service';
import { CoreConfig } from '@core/types';


@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [HorizontalLayoutComponent, VerticalLayoutComponent],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class LayoutComponent {
  public coreConfig: CoreConfig;

  constructor(
    public coreConfigService: CoreConfigService,
    public changeDetection: ChangeDetectorRef,
  ) {
    coreConfigService.getConfig().subscribe(
      (config) => {
        this.coreConfig = config;
        this.changeDetection.markForCheck();
      }
    );
  }
}
