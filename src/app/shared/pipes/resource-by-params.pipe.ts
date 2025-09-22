import { Pipe, PipeTransform } from '@angular/core';
import { getResourceByParams, Resources } from '@app/resources';

@Pipe({
  name: 'resourceByParams',
  standalone: true
})
export class ResourceByParamsPipe implements PipeTransform {
  transform(resource: Resources, params: Record<string, string | number>): string {
    return getResourceByParams(resource, params);
  }
}
