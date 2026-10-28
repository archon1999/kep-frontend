import KepIcon from 'shared/components/base/KepIcon';
import StatisticsMetric from 'shared/components/statistics/StatisticsMetric';
import type { KepIconName } from 'shared/config/icons';

interface ProblemsUserStatisticsPageOverviewCardProps {
  icon: string;
  label: string;
  value: string;
  subtitle?: string;
}

const ProblemsUserStatisticsPageOverviewCard = ({
  icon,
  label,
  value,
  subtitle,
}: ProblemsUserStatisticsPageOverviewCardProps) => (
  <StatisticsMetric
    label={label}
    value={value}
    subtitle={subtitle}
    icon={<KepIcon name={icon as KepIconName} fontSize={20} />}
  />
);

export default ProblemsUserStatisticsPageOverviewCard;
