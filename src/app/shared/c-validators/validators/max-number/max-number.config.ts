import { BaseConfig } from '../../basic/base-config';

export interface MaxNumberConfig extends BaseConfig {
  value: number;
}

export const maxNumberDefaultConfig: MaxNumberConfig = {
  errorName: 'maxNumberError',
  errorTranslateMessage: 'MAX_NUMBER_ERROR',
  value: 0,
}
