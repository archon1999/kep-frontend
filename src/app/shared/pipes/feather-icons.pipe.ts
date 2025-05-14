import { featherIcons } from '@core/config/icons';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'iconName',
  standalone: true,
})

export class IconNamePipe implements PipeTransform {
  transform(name: string): string {
    return featherIcons[name];
  }
}
