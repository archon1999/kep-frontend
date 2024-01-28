import { Component } from '@angular/core';
import { CoreCommonModule } from '@core/common.module';
import { coreConfig } from '@app/app.config';
import { menu } from '@layout/components/menu/menu';

@Component({
  selector: 'section-footer',
  standalone: true,
  imports: [CoreCommonModule],
  templateUrl: './section-footer.component.html',
  styleUrl: './section-footer.component.scss'
})
export class SectionFooterComponent {

  protected readonly defaultCoreConfig = coreConfig;
  protected readonly menu = menu;

}
