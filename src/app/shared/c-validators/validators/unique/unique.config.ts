import { BaseConfig } from '../../basic/base-config';

export interface UniqueConfig extends BaseConfig {
  allowNull?: boolean;
}

export const uniqueDefaultConfig: UniqueConfig = {
  errorTranslateMessage: 'UNIQUE_ERROR',
  errorName: 'uniqueError',
  allowNull: false
};
