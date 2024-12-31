import { Component } from '@angular/core';
import { CoreCommonModule } from '@core/common.module';
import { menu } from '@layout/components/menu/menu';
import { BaseComponent } from '@app/common';

@Component({
  selector: 'section-practice',
  standalone: true,
  imports: [CoreCommonModule],
  templateUrl: './section-practice.component.html',
  styleUrl: './section-practice.component.scss'
})
export class SectionPracticeComponent extends BaseComponent {
  protected readonly menu = menu;
}
