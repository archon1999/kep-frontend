import { CurrentProblemsRating } from '@problems/models/rating.models';

export interface PeriodRating {
  period: 'today' | 'week' | 'month';
  color: string;
  data: Array<CurrentProblemsRating>;
}
