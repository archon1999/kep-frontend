import { FormControl, ValidatorFn } from "@angular/forms";
import { MaxLengthConfig } from "./max-length.config";

export function maxLengthValidator(config: MaxLengthConfig): ValidatorFn {
  return (control: FormControl) => {
    if (control.value === null) return;

    if (control.value.toString().length > config.value) return {
      controlValue: control.value,
      value: config.value
    };
  }
}
