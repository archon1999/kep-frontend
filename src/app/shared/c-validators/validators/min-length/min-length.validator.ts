import { FormControl, ValidatorFn } from '@angular/forms';
import { MinLengthConfig } from './min-length.config';

export function minLengthValidator(config: MinLengthConfig): ValidatorFn {
  return (control: FormControl) => {
    if (control.value?.toString().length < config.value || (config.allowNull && control.value === null)) return {
      controlValue: control.value,
      value: config.value
    };
  }
}
