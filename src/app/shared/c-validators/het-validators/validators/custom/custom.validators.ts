import { FormControl, ValidatorFn } from "@angular/forms";
import { CustomConfig } from "@shared/helpers/het-validators/validators/custom/custom.config";


export function customValidator(config?: CustomConfig): ValidatorFn {
  return (control: FormControl) => {
    if (config.fn(control)) {
      return {
        controlValue: control.value,
      }
    } else {
      return null;
    }
  }
}
