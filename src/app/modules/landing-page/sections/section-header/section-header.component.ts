import { Component } from '@angular/core';
import { CoreCommonModule } from '@core/common.module';

@Component({
  selector: 'section-header',
  standalone: true,
  imports: [CoreCommonModule],
  templateUrl: './section-header.component.html',
  styleUrl: './section-header.component.scss'
})
export class SectionHeaderComponent {}
