import { FormControl, ValidatorFn } from '@angular/forms';
import { AlphaDigitConfig } from './alpha-digit.config';
import { isAlphaDigit } from '../../utils';


export function alphaDigitValidator(config?: AlphaDigitConfig): ValidatorFn {
  return (control: FormControl) => {
    if ((control.value !== null && isAlphaDigit(control.value.toString())) ||
      (!config.allowNull && control.value === null)) {
      return {
        controlValue: control.value,
      };
    }
  };
}
