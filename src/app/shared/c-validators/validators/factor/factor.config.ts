import { BaseConfig } from '../../basic/base-config';

export interface FactorConfig extends BaseConfig {
  dividend: number;
}

export const factorDefaultConfig: FactorConfig = {
  errorName: 'factorError',
  errorTranslateMessage: 'FACTOR_ERROR',
  dividend: 1,
}
