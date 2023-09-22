import { FormControl, ValidatorFn } from "@angular/forms";
import {
  ArrayFieldListConfig
} from "@shared/helpers/het-validators/validators/array-field-list/array-field-list.config";
import { isPresent } from "@shared/helpers/utils/is-present/isPresent";
import { getControlName } from "@shared/helpers/het-validators/utils/form-control-name";


export function arrayFieldListValidator(config?: ArrayFieldListConfig): ValidatorFn {
  return (control: FormControl) => {
    let formGroup = control.parent;
    if(!isPresent(formGroup)) return null;
    let formArray = formGroup.parent;
    if(!isPresent(formArray)) return null;

    let formControlName = getControlName(control);
    let fieldsValueList = [];
    for(let formGroupName of Object.keys(formArray.controls)){
      let formGroup = formArray.get(formGroupName);
      let formControl = formGroup.get(formControlName);
      fieldsValueList.push(formControl.value);
      if(formControl != control){
        formControl.setErrors(control.errors);
      }
    }

    if(!config.fn(control.value, fieldsValueList)){
      return {
        controlValue: control.value,
      }
    }
  }
}
