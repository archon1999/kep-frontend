import { featherIcons } from '@app/icons';
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
