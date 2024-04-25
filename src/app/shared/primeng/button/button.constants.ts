export type ButtonIconPosition = 'left' | 'right' | 'top' | 'bottom';

export const INTERNAL_BUTTON_CLASSES = {
  button: 'p-button',
  component: 'p-component',
  iconOnly: 'p-button-icon-only',
  disabled: 'p-disabled',
  loading: 'p-button-loading',
  labelOnly: 'p-button-loading-label-only'
} as const;
