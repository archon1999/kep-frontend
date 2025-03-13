import { Pipe, PipeTransform } from '@angular/core';
import { NgxCountriesService } from './ngx-countries.service';
import { TranslateService } from '@ngx-translate/core';
import { AppStateService } from '@core/services/app-state.service';

@Pipe({
  name: 'countryName',
  standalone: false,
})
export class CountryNamePipe implements PipeTransform {
  constructor(private countries: NgxCountriesService, public appStateService: AppStateService) {}

  transform(value: string, lang?: string): string {
    return this.countries.getNames(this.appStateService.getCurrentValue().language)[value.toUpperCase()];
  }
}
