import { FormControl, ValidatorFn } from "@angular/forms";
import { FactorConfig } from "./factor.config";


export function factorValidator(config?: FactorConfig): ValidatorFn {
  return (control: FormControl) => {
    if(control.value === null) return;
    if(parseInt(control.value) % config.dividend != 0) return {
      controlValue: control.value,
      dividend: config.dividend,
    }
  }
}
