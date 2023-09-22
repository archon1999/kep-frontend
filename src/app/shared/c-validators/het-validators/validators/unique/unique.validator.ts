import { FormControl, ValidatorFn } from "@angular/forms";
import { UniqueConfig, uniqueDefaultConfig } from "./unique.config";
import { getControlName } from "@shared/helpers/het-validators/utils/form-control-name";


export function uniqueValidator(config: UniqueConfig = uniqueDefaultConfig): ValidatorFn {
  return (control: FormControl) => {
    const formGroup = control.parent;
    if (!formGroup) return;
    if (!config.allowNull && control.value === null) return;

    const formArray = formGroup.parent;
    const controlName = getControlName(control);

    for (let otherFormGroup of (formArray.controls as Iterable<any>)) {
      if (formGroup == otherFormGroup) continue;
      if (otherFormGroup.get(controlName).value == control.value) {
        return {}
      }
    }
  }
}
