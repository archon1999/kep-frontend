import { FormControl, ValidatorFn } from '@angular/forms';
import { MaxDateConfig } from './max-date.config';

export function maxDateValidator(config: MaxDateConfig): ValidatorFn {
  return (control: FormControl) => {
    if (control.value === null) return;

    if (new Date(control.value) > new Date(config.value)) return {
      controlValue: control.value,
      value: config.value
    };
  }
}
