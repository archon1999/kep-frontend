export interface StatisticCard {
  key: string;
  label: string;
  icon: string;
  value: string;
  subtitle?: string;
}

export interface HighlightCard {
  key: string;
  label: string;
  icon: string;
  contestTitle?: string;
  contestLink?: string;
  meta?: string;
  valueLabel?: string;
}

export interface ContestCard {
  key: string;
  label: string;
  icon: string;
  contestTitle?: string;
  contestLink?: string;
  value?: string;
  subtitle?: string;
}
