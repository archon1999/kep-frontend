import { FormControl, ValidatorFn } from '@angular/forms';
import { MinDateConfig } from './min-date.config';

export function minDateValidator(config: MinDateConfig): ValidatorFn {
  return (control: FormControl) => {
    if (control.value === null) return;

    if (new Date(control.value) < new Date(config.value)) return {
      controlValue: control.value,
      value: config.value
    };
  }
}
