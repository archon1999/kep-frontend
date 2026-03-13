import type { ReactNode } from 'react';

export interface AccountSettingsTab {
  id: number;
  value: string;
  label: string;
  icon: string;
  panelIcon?: string;
  description?: string;
  render: ReactNode;
}
