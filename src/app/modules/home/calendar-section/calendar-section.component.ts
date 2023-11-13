import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { CalendarOptions } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import interactionPlugin from '@fullcalendar/interaction';
import { FullCalendarComponent, FullCalendarModule } from '@fullcalendar/angular';

import uzLocale from '@fullcalendar/core/locales/uz';
import ruLocale from '@fullcalendar/core/locales/ru';
import enLocale from '@fullcalendar/core/locales/es-us';
import { TranslateService } from '@ngx-translate/core';
import { HomeService } from '../home.service';
import { LocalStorageService } from '@shared/storages/local-storage.service';
import { CommonModule } from '@angular/common';

enum CalendarEventType {
  CONTEST = 1,
  ARENA = 2,
  TOURNAMENT = 3,
  HOLIDAY = 4,
}

@Component({
  selector: 'calendar-section',
  templateUrl: './calendar-section.component.html',
  styleUrls: ['./calendar-section.component.scss'],
  encapsulation: ViewEncapsulation.None,
  standalone: true,
  imports: [CommonModule, FullCalendarModule],
})
export class CalendarSectionComponent implements OnInit {

  public calendarRef = [
    {
      id: 1,
      checked: true,
      filter: this.translateService.instant('Contests'),
      color: 'primary',
    },
    {
      id: 2,
      checked: true,
      filter: this.translateService.instant('Arena'),
      color: 'warning',
    },
    {
      id: 3,
      checked: true,
      filter: this.translateService.instant('Tournaments'),
      color: 'dark',
    },
    {
      id: 4,
      checked: true,
      filter: this.translateService.instant('Holidays'),
      color: 'success',
    },
  ];

  @ViewChild('calendar') calendarComponent: FullCalendarComponent;

  calendarOptions: CalendarOptions = {
    plugins: [dayGridPlugin, timeGridPlugin, listPlugin, interactionPlugin],
    headerToolbar: {
      start: 'sidebarToggle, prev,next, title',
      end: 'dayGridMonth,timeGridWeek,timeGridDay,listMonth'
    },
    locale: this.translateService.currentLang,
    locales: [uzLocale, ruLocale, enLocale],
    initialView: this.localStorageService.get('calendarViewType') || 'listMonth',
    weekends: true,
    editable: false,
    eventResizableFromStart: true,
    selectable: false,
    selectMirror: true,
    dayMaxEvents: 2,
    navLinks: true,
    datesSet: (dateInfo) => {
      this.localStorageService.set('calendarViewType', dateInfo.view.type);
    }
  };

  constructor(
    public translateService: TranslateService,
    public service: HomeService,
    public localStorageService: LocalStorageService
  ) {}

  ngOnInit(): void {
    this.service.getCalendarEvents().subscribe(
      (events: Array<any>) => {
        this.calendarOptions.events = events.map((event) => {
          event.start = new Date(event.startTime);
          event.end = new Date(event.finishTime);
          switch(event.type) {
            case CalendarEventType.CONTEST:
              event.url = `/competitions/contests/contest/${ event.uid }`;
              event.className = 'bg-light-primary';
              break;
            case CalendarEventType.ARENA:
              event.url = `/competitions/arena/tournament/${ event.uid }`;
              event.className = 'bg-light-warning';
              break;
            case CalendarEventType.TOURNAMENT:
              event.url = `/competitions/tournaments/tournament/${ event.uid }`;
              event.className = 'bg-light-dark';
              break;
            case CalendarEventType.HOLIDAY:
              event.className = 'bg-light-success';
              break;
          }
          return event;
        });
      }
    );
  }

}
