import { DatePipe } from '@angular/common';
import { Pipe, PipeTransform } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { AppStateService } from "@core/services/app-state.service";

@Pipe({
  name: 'localizedDate',
  pure: false,
  standalone: true,
})
export class LocalizedDatePipe implements PipeTransform {
  constructor(private appStateService: AppStateService) {}

  transform(value: any, pattern: string = 'mediumDate'): any {
    const datePipe: DatePipe = new DatePipe(this.appStateService.getCurrentValue().language || 'en');
    return datePipe.transform(value, pattern);
  }
}
