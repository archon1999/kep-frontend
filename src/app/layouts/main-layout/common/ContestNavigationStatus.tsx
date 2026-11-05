import { useTranslation } from 'react-i18next';
import { Chip, chipClasses } from '@mui/material';
import { ContestStatus } from 'modules/contests/domain/entities/contest-status';
import { useFeaturedContestPromo } from 'modules/home/application/hooks/useFeaturedContestPromo';

const ContestNavigationStatus = ({
  id,
  indicator = false,
}: {
  id?: string;
  indicator?: boolean;
}) => {
  const { t } = useTranslation();
  const { status } = useFeaturedContestPromo();
  if (status === undefined) return null;

  const live = status === ContestStatus.Already;
  const color = live ? 'success' : 'warning';
  const label = t(live ? 'contests.statusShort.live' : 'contests.statusShort.upcoming');

  if (indicator) {
    return (
      <Chip
        id={id}
        component="span"
        size="small"
        variant="soft"
        color={color}
        label={t(live ? 'menu.contestBadge.live' : 'menu.contestBadge.new')}
        title={label}
        sx={{
          height: 18,
          flexShrink: 0,
          ml: 0.75,
          borderRadius: '4px',
          [`& .${chipClasses.label}`]: {
            px: 0.625,
            fontSize: 9,
            fontWeight: 700,
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
          },
        }}
      />
    );
  }

  return (
    <Chip
      id={id}
      component="span"
      size="small"
      variant="soft"
      color={color}
      icon={<span aria-hidden="true" />}
      label={label}
      sx={{
        height: 20,
        borderRadius: 999,
        [`& .${chipClasses.icon}`]: {
          width: 5,
          height: 5,
          borderRadius: '50%',
          bgcolor: 'currentColor',
          color: 'inherit',
          ml: 1,
          mr: 0,
        },
        [`& .${chipClasses.label}`]: { pl: 0.625, pr: 1, fontSize: 10, fontWeight: 600 },
      }}
    />
  );
};

export default ContestNavigationStatus;
