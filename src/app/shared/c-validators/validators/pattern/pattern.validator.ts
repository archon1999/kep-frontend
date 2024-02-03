import { FormControl, ValidatorFn } from '@angular/forms';
import { PatternConfig } from './pattern.config';

export function patternValidator(config: PatternConfig): ValidatorFn {
  return (control: FormControl) => {
    if (control.value === null) return;

    if (!config.regex.test(control.value)) return {
      controlValue: control.value,
      regex: config.regex,
    }
  }
}
