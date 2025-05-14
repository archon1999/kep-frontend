import { Component } from '@angular/core';
import { CoreCommonModule } from '@core/common.module';
import { BaseComponent } from '@app/common';
import { MENU } from "@core/config/menu";
import { KepCardComponent } from "@shared/components/kep-card/kep-card.component";

@Component({
  selector: 'section-practice',
  standalone: true,
  imports: [CoreCommonModule, KepCardComponent],
  templateUrl: './section-practice.component.html',
  styleUrl: './section-practice.component.scss'
})
export class SectionPracticeComponent extends BaseComponent {
  protected readonly menu = MENU;

  colors = ['primary', 'info', 'warning', 'primary']
}
