import { BaseConfig } from "../../basic/base-config";

export interface AlphaDigitConfig extends BaseConfig {
  allowNull?: boolean;
}

export const alphaDigitDefaultConfig: AlphaDigitConfig = {
  errorName: 'alphaNumbericError',
  errorTranslateMessage: 'ALPHA_DIGIT_ERROR',
  allowNull: true,
}
