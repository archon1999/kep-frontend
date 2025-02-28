import { Pipe, PipeTransform } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { BaseConfig } from '../c-validators/basic/base-config';

@Pipe({
  name: 'errorMessage',
  standalone: true,
})
export class ErrorMessagePipe implements PipeTransform {
  constructor(public translateService: TranslateService) {}

  transform(errors: { [index: string]: BaseConfig }): unknown {
    const translations = this.translateService.translations;
    let errorMessage = '';
    for (const errorName of Object.keys(Object(errors))) {
      const errorTranslateMessage = errors[errorName].errorTranslateMessage;
      errorMessage += this.translateService.instant('Errors.' + errorTranslateMessage, errors[errorName]);
    }
    return errorMessage;
  }
}
