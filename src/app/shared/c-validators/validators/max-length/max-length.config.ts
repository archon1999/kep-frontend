import { BaseConfig } from '../../basic/base-config';

export interface MaxLengthConfig extends BaseConfig {
  value: number;
}

export const maxLengthDefaultConfig: MaxLengthConfig = {
  errorName: 'maxLengthError',
  errorTranslateMessage: 'MAX_LENGTH_ERROR',
  value: 0,
}
