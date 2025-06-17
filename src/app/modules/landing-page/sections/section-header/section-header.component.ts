import { Component } from '@angular/core';
import { CoreCommonModule } from '@core/common.module';
import { LogoComponent } from "@shared/components/logo/logo.component";

@Component({
  selector: 'section-header',
  standalone: true,
  imports: [CoreCommonModule, LogoComponent],
  templateUrl: './section-header.component.html',
  styleUrl: './section-header.component.scss'
})
export class SectionHeaderComponent {}
