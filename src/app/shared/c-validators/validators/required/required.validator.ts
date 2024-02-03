import { FormControl, ValidatorFn } from '@angular/forms';
import { RequiredConfig } from './required.config';

export function requiredValidator(config?: RequiredConfig): ValidatorFn {
  return (control: FormControl) => {
    if(control.value === null) return {}
  }
}
