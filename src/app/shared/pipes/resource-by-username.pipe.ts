import { Pipe, PipeTransform } from '@angular/core';
import { getResourceByUsername, Resources } from '@app/resources';

@Pipe({
  name: 'resourceByUsername',
  standalone: true
})
export class ResourceByUsernamePipe implements PipeTransform {
  transform(resource: Resources, username: string): string {
    return getResourceByUsername(resource, username);
  }
}
