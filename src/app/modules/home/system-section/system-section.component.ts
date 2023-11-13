import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CorePipesModule } from '../../../../core/pipes/pipes.module';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'system-section',
  standalone: true,
  imports: [CommonModule, CorePipesModule, TranslateModule],
  templateUrl: './system-section.component.html',
  styleUrl: './system-section.component.scss'
})
export class SystemSectionComponent {
  public today: number = Date.now();
  public days = Math.trunc((Date.now() - new Date('2021-07-07').valueOf()) / 1000 / 60 / 60 / 24);
}
