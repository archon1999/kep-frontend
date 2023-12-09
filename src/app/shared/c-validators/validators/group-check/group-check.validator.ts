import { FormControl, ValidatorFn } from '@angular/forms';
import { GroupCheckConfig } from './group-check.config';
import { isPresent } from '../../utils';
import { getControlName } from '../../utils/form-control-name';


export function groupCheckValidator(config?: GroupCheckConfig): ValidatorFn {
  return (control: FormControl) => {
    const formGroup = control.parent;
    if (!isPresent(formGroup)) {
      return null;
    }
    const values = formGroup.value;
    values[getControlName(control)] = control.value;
    if (config.fn(values)) {
      return {
        ...formGroup.value,
      };
    } else {
      return null;
    }
  };
}
