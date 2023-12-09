import { FormControl, ValidatorFn } from '@angular/forms';
import { AlphaConfig } from './alpha.config';
import { isAlpha } from '../../utils';

export function alphaValidator(config?: AlphaConfig): ValidatorFn {
  return (control: FormControl) => {
    if ((control.value !== null && isAlpha(control.value.toString(), config.allowCrl)) ||
      (!config.allowNull && control.value === null)) {
      return {
        controlValue: control.value,
      };
    }
  };
}
