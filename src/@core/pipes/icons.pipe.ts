import { icons } from 'app/feather-icons';
import { Pipe, PipeTransform } from '@angular/core';
@Pipe({
  name: 'iconName'
})

export class IconNamePipe implements PipeTransform {
  transform(name: string): string {
    return icons[name];
  }
}
