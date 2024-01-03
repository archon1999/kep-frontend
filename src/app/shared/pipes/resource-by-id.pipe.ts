import { Pipe, PipeTransform } from '@angular/core';
import { getResourceById, Resources } from '@app/resources';

@Pipe({
  name: 'resourceById',
  standalone: true
})
export class ResourceByIdPipe implements PipeTransform {
  transform(resource: Resources, id: number | string): string {
    return getResourceById(resource, id);
  }
}
