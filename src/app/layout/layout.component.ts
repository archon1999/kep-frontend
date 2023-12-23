import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HorizontalLayoutComponent } from '@layout/horizontal/horizontal-layout.component';
import { VerticalLayoutComponent } from '@layout/vertical/vertical-layout.component';
import { CoreConfigService } from '@core/services/config.service';
import { CoreConfig } from '@core/types';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [CommonModule, HorizontalLayoutComponent, VerticalLayoutComponent],
  templateUrl: './layout.component.html',
})
export class LayoutComponent {
  public coreConfig: CoreConfig;

  constructor(public coreConfigService: CoreConfigService) {
    coreConfigService.getConfig().subscribe(
      (config) => {
        this.coreConfig = config;
      }
    );
  }
}
