import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CoreCommonModule } from '@core/common.module';

@Component({
  selector: 'section-filter',
  standalone: true,
  imports: [CoreCommonModule],
  templateUrl: './section-filter.component.html',
  styleUrl: './section-filter.component.scss'
})
export class SectionFilterComponent {

}
