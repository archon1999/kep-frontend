import KepIcon from 'shared/components/base/KepIcon';
import StatisticsMetric from 'shared/components/statistics/StatisticsMetric';
import type { KepIconName } from 'shared/config/icons';

export interface ContestsUserStatisticsPageStatCardProps {
  icon: KepIconName;
  label: string;
  value?: string;
  subtitle?: string;
  highlight?: boolean;
  valueColor?: string;
}

const ContestsUserStatisticsPageStatCard = ({
  icon,
  label,
  value,
  subtitle,
  valueColor,
}: ContestsUserStatisticsPageStatCardProps) => (
  <StatisticsMetric
    label={label}
    value={value}
    subtitle={subtitle}
    valueColor={valueColor}
    icon={<KepIcon name={icon} fontSize={20} />}
  />
);

export default ContestsUserStatisticsPageStatCard;
