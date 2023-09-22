import { set } from "lodash";
import { BaseConfig } from "../basic/base-config";
import { FormControl } from "@angular/forms";

import { map } from 'rxjs/operators';
import { isPresent } from "@shared/helpers/utils/is-present/isPresent";

export function decorateValidator(validatorFn: Function, defaultConfig: BaseConfig) {
  return (config?: BaseConfig) => {
    return (control: FormControl): object => {
      let validatorResult = validatorFn(config)(control);
      if (!isPresent(validatorResult)) return;

      config = {
        ...defaultConfig,
        ...config,
      }

      let translateParams = {
        errorTranslateMessage: config.errorTranslateMessage,
        ...config.translateParams,
        ...validatorResult,
      }

      let validatorFnResult = {};
      set(validatorFnResult, config.errorName, translateParams);
      return validatorFnResult;
    }
  }
}


export function decorateAsyncValidator(asyncValidatorFn: Function) {
  return (config?: BaseConfig) => {
    return (control: FormControl) => {
      return asyncValidatorFn(config)(control).pipe(
        map((validatorResult: any) => {
          console.log(validatorResult, isPresent(validatorResult));
        
          if (!isPresent(validatorResult)) return null;
          
          let translateParams = {
            errorTranslateMessage: config.errorTranslateMessage,
            ...config.translateParams,
            ...validatorResult,
          }
          
          console.log(translateParams, validatorResult);

          let validatorFnResult = {};
          set(validatorFnResult, config.errorName, translateParams);
          return validatorFnResult;    
        })
      )
    }
  }
}
