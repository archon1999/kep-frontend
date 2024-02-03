import { BaseConfig } from '../../basic/base-config';

export interface MinLengthConfig extends BaseConfig {
  value: number;
  allowNull?: boolean;
}

export const minLengthDefaultConfig: MinLengthConfig = {
  errorName: 'minLengthError',
  errorTranslateMessage: 'MIN_LENGTH_ERROR',
  value: 0,
  allowNull: true,
}
