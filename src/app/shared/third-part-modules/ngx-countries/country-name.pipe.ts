import { Pipe, PipeTransform } from '@angular/core';
import { NgxCountriesService } from './ngx-countries.service';
import { TranslateService } from '@ngx-translate/core';

@Pipe({
  name: 'countryName',
  standalone: false,
})
export class CountryNamePipe implements PipeTransform {
  constructor(private countries: NgxCountriesService, public translateService: TranslateService) {}

  transform(value: string, lang?: string): string {
    return this.countries.getNames(this.translateService.currentLang)[value.toUpperCase()];
    // return this.countries.getName(value.toUpperCase(), lang);
  }
}
