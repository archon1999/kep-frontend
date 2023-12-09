import { FormControl, ValidatorFn } from "@angular/forms";
import { LengthConfig } from "./length.config";

export function lengthValidator(config: LengthConfig): ValidatorFn {
  return (control: FormControl) => {
    if (control.value?.toString().length != config.value || (config.allowNull && control.value === null)) return {
      controlValue: control.value,
      value: config.value
    };
  }
}
