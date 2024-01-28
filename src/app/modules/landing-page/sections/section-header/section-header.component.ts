import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CoreCommonModule } from '@core/common.module';
import { BaseComponent } from '@shared/components/classes/base.component';

@Component({
  selector: 'section-header',
  standalone: true,
  imports: [CoreCommonModule],
  templateUrl: './section-header.component.html',
  styleUrl: './section-header.component.scss'
})
export class SectionHeaderComponent extends BaseComponent {

}
