import { useTranslation } from 'react-i18next';
import { Chip } from '@mui/material';
import { ContestStatus } from 'modules/contests/domain/entities/contest-status';
import IconifyIcon from 'shared/components/base/IconifyIcon';

const contestStatusPresentation = {
  [ContestStatus.Already]: {
    label: 'contests.statusShort.live',
    color: 'success',
    icon: 'mdi:access-point',
  },
  [ContestStatus.NotStarted]: {
    label: 'contests.statusShort.upcoming',
    color: 'warning',
    icon: 'mdi:clock-outline',
  },
  [ContestStatus.Finished]: {
    label: 'contests.statusShort.finished',
    color: 'neutral',
    icon: 'mdi:check-circle-outline',
  },
} as const;

const ContestStatusChip = ({ status }: { status?: ContestStatus }) => {
  const { t } = useTranslation();
  if (status === undefined) return null;
  const { label, color, icon } = contestStatusPresentation[status];

  return (
    <Chip
      component="span"
      size="small"
      variant="status"
      color={color}
      icon={<IconifyIcon icon={icon} />}
      label={t(label)}
    />
  );
};

export default ContestStatusChip;
