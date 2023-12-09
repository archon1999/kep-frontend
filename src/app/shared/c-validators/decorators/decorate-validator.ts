import { BaseConfig } from '../basic/base-config';
import { FormControl } from '@angular/forms';

import { map } from 'rxjs/operators';
import { isPresent } from '../utils';

export function decorateValidator(validatorFn: Function, defaultConfig: BaseConfig) {
  return (config?: BaseConfig) => {
    return (control: FormControl): object => {
      const validatorResult = validatorFn(config)(control);
      if (!isPresent(validatorResult)) {
        return;
      }

      config = {
        ...defaultConfig,
        ...config,
      };

      const translateParams = {
        errorTranslateMessage: config.errorTranslateMessage,
        ...config.translateParams,
        ...validatorResult,
      };

      return {
        [config.errorName]: translateParams
      };
    };
  };
}


export function decorateAsyncValidator(asyncValidatorFn: Function) {
  return (config?: BaseConfig) => {
    return (control: FormControl) => {
      return asyncValidatorFn(config)(control).pipe(
        map((validatorResult: any) => {
          if (!isPresent(validatorResult)) {
            return null;
          }

          const translateParams = {
            errorTranslateMessage: config.errorTranslateMessage,
            ...config.translateParams,
            ...validatorResult,
          };

          return {
            [config.errorName]: translateParams
          };
        })
      );
    };
  };
}
