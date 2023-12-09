import { FormControl, ValidatorFn } from "@angular/forms";
import { MaxNumberConfig } from "./max-number.config";

export function maxNumberValidator(config: MaxNumberConfig): ValidatorFn {
  return (control: FormControl) => {
    if (control.value === null) return;

    if (control.value > config.value) return {
      controlValue: control.value,
      value: config.value
    };
  }
}
