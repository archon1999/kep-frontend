import { FormControl, ValidatorFn } from '@angular/forms';
import { getControlName, isPresent } from '../../utils';
import { ArrayFieldListConfig } from './array-field-list.config';


export function arrayFieldListValidator(config?: ArrayFieldListConfig): ValidatorFn {
  return (control: FormControl) => {
    const formGroup = control.parent;
    if (!isPresent(formGroup)) {
      return null;
    }
    const formArray = formGroup.parent;
    if (!isPresent(formArray)) {
      return null;
    }

    const formControlName = getControlName(control);
    const fieldsValueList = [];
    for (const formGroupName of Object.keys(formArray.controls)) {
      // tslint:disable-next-line:no-shadowed-variable
      const formGroup = formArray.get(formGroupName);
      const formControl = formGroup.get(formControlName);
      fieldsValueList.push(formControl.value);
      if (formControl !== control) {
        formControl.setErrors(control.errors);
      }
    }

    if (!config.fn(control.value, fieldsValueList)) {
      return {
        controlValue: control.value,
      };
    }
  };
}
