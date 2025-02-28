import { Component } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { CoreCommonModule } from '@core/common.module';
import { KepIconComponent } from '@shared/components/kep-icon/kep-icon.component';
import { KepCardComponent } from "@shared/components/kep-card/kep-card.component";

@Component({
  selector: 'system-section',
  standalone: true,
  imports: [CoreCommonModule, TranslateModule, KepIconComponent, KepCardComponent],
  templateUrl: './system-section.component.html',
  styleUrl: './system-section.component.scss'
})
export class SystemSectionComponent {
  public today: number = Date.now();
  public days = Math.trunc((Date.now() - new Date('2021-07-07').valueOf()) / 1000 / 60 / 60 / 24);
}
