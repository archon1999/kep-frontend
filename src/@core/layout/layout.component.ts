import { ChangeDetectorRef, Component, HostListener, Renderer2, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HorizontalLayoutComponent } from '@layout/horizontal/horizontal-layout.component';
import { VerticalLayoutComponent } from '@layout/vertical/vertical-layout.component';
import { CoreConfigService } from '@core/services/config.service';
import { CoreConfig } from '@core/types';
import { ScriptService } from '@shared/services/script.service';
import { randomInt } from '@shared/utils';
import { LocalStorageService } from '@shared/services/storages/local-storage.service';
import { FooterModule } from '@layout/components/footer/footer.module';

const SCRIPT_PATH = 'assets/plugins/snowf/snowf.min.js';
let snowf: any;

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [CommonModule, HorizontalLayoutComponent, VerticalLayoutComponent, FooterModule],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class LayoutComponent {
  public coreConfig: CoreConfig;
  public lightsCount = 0;

  constructor(
    public coreConfigService: CoreConfigService,
    private renderer: Renderer2,
    private scriptService: ScriptService,
    public changeDetection: ChangeDetectorRef,
    public localStorageService: LocalStorageService,
  ) {
    this.lightsCount = Math.trunc(window.innerHeight / 30);

    coreConfigService.getConfig().subscribe(
      (config) => {
        this.coreConfig = config;
        this.changeDetection.markForCheck();
      }
    );
  }

  @HostListener('window:resize')
  onResize() {
    this.lightsCount = Math.trunc(window.innerHeight / 30);
  }
}
