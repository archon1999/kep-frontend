import { BaseConfig } from "../../basic/base-config";

export interface AlphaConfig extends BaseConfig {
  allowNull?: boolean;
  allowCrl?: boolean;
}

export const alphaDefaultConfig: AlphaConfig = {
  errorName: 'alphaError',
  errorTranslateMessage: 'ALPHA_ERROR',
  allowNull: true,
  allowCrl: true,
}
