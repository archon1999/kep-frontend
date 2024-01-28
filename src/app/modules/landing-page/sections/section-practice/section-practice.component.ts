import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CoreCommonModule } from '@core/common.module';
import { BaseComponent } from '@shared/components/classes/base.component';
import { menu } from '@layout/components/menu/menu';

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
