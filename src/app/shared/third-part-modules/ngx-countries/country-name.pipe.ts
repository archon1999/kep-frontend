import { Pipe, PipeTransform } from '@angular/core';
import { NgxCountriesService } from './ngx-countries.service';

@Pipe({
  name: 'countryName'
})
export class CountryNamePipe implements PipeTransform {
  constructor(private countries: NgxCountriesService) {}

  transform(value: string, lang?: string): string {
    return this.countries.getName(value, lang);
  }
}
