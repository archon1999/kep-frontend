import { Component } from '@angular/core';
import { CalendarSectionComponent } from '@app/modules/home/calendar-section/calendar-section.component';
import { BasePageComponent } from '@app/common';
import { ContentHeader } from '@layout/components/content-header/content-header.component';
import { ContentHeaderModule } from '@layout/components/content-header/content-header.module';

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [
    CalendarSectionComponent,
    ContentHeaderModule
  ],
  templateUrl: './calendar.component.html',
  styleUrl: './calendar.component.scss'
})
export class CalendarComponent extends BasePageComponent {
  protected getContentHeader(): ContentHeader {
    return {
      headerTitle: 'MENU.CALENDAR',
      breadcrumb: {
        links: [
          {
            name: this.coreConfig.app.appTitle,
            isLink: true,
            link: '/',
          }
        ]
      }
    };
  }
}
