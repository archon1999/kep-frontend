import { FormControl, ValidatorFn } from '@angular/forms';
import { MinNumberConfig } from './min-number.config';

export function minNumberValidator(config: MinNumberConfig): ValidatorFn {
  return (control: FormControl) => {
    if (control.value === null) return null;

    if (control.value < config.value) return {
      controlValue: control.value,
      value: config.value
    };

    return null;
  }
}
