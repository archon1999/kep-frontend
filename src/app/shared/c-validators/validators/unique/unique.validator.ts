import { FormArray, FormControl, ValidatorFn } from '@angular/forms';
import { UniqueConfig, uniqueDefaultConfig } from './unique.config';
import { getControlName } from '../../utils/form-control-name';


export function uniqueValidator(config: UniqueConfig = uniqueDefaultConfig): ValidatorFn {
  return (control: FormControl) => {
    const formGroup = control.parent;
    if (!formGroup) {
      return null;
    }
    if (!config.allowNull && control.value === null) {
      return null;
    }

    const formArray = formGroup.parent as FormArray;
    const controlName = getControlName(control);

    for (const otherFormGroup of formArray.controls) {
      if (formGroup === otherFormGroup) {
        continue;
      }
      if (otherFormGroup.get(controlName).value === control.value) {
        return {};
      }
    }

    return null;
  };
}
