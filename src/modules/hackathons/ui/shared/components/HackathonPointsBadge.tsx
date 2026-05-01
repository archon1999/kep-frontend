import { Chip, ChipProps } from '@mui/material';
import { useTranslation } from 'react-i18next';
import IconifyIcon from 'shared/components/base/IconifyIcon';

interface HackathonPointsBadgeProps extends Omit<ChipProps, 'label'> {
  value?: number | string | null;
}

const HackathonPointsBadge = ({ value = 0, ...chipProps }: HackathonPointsBadgeProps) => {
  const { t } = useTranslation();

  return (
    <Chip
      {...chipProps}
      icon={<IconifyIcon icon="mdi:star-circle-outline" />}
      label={`${value} ${t('hackathons.pointsUnit')}`}
    />
  );
};

export default HackathonPointsBadge;
