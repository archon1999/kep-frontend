import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Renderer2, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HorizontalLayoutComponent } from '@layout/horizontal/horizontal-layout.component';
import { VerticalLayoutComponent } from '@layout/vertical/vertical-layout.component';
import { CoreConfigService } from '@core/services/config.service';
import { CoreConfig } from '@core/types';
import { ScriptService } from '@shared/services/script.service';
import { ChangeDetection } from '@angular/cli/lib/config/workspace-schema';

const SCRIPT_PATH = 'assets/plugins/snowf/snowf.min.js';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [CommonModule, HorizontalLayoutComponent, VerticalLayoutComponent],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class LayoutComponent {
  public coreConfig: CoreConfig;

  constructor(
    public coreConfigService: CoreConfigService,
    private renderer: Renderer2,
    private scriptService: ScriptService,
    public changeDetection: ChangeDetectorRef,
  ) {
    coreConfigService.getConfig().subscribe(
      (config) => {
        this.coreConfig = config;
        this.changeDetection.markForCheck();
      }
    );

    const scriptElement = this.scriptService.loadJsScript(this.renderer, SCRIPT_PATH);
      scriptElement.onload = (e) => {
      window['snowf'].init({
        size: 5,
        amount: 50,
      });
      window.onresize = function() {
        window['snowf'].resize();
      };
    };
  }
}
