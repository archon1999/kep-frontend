import { FormControl, ValidatorFn } from "@angular/forms";
import { isPresent } from "@shared/helpers/utils/is-present/isPresent";
import { GroupCheckConfig } from "@shared/helpers/het-validators/validators/group-check/group-check.config";
import { getControlName } from "@shared/helpers/het-validators/utils/form-control-name";


export function groupCheckValidator(config?: GroupCheckConfig): ValidatorFn {
  return (control: FormControl) => {
    let formGroup = control.parent;
    if (!isPresent(formGroup)) return null;
    let values = formGroup.value;
    values[getControlName(control)] = control.value;
    if (config.fn(values)){
      return {
        ...formGroup.value,
      }
    } else {
      return null;
    }
  }
}
