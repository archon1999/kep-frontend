import { useTranslation } from 'react-i18next';
import { Box, Chip, chipClasses } from '@mui/material';
import { visuallyHidden } from '@mui/utils';
import { ContestStatus } from 'modules/contests/domain/entities/contest-status';
import { useFeaturedContestPromo } from 'modules/home/application/hooks/useFeaturedContestPromo';
import IconifyIcon from 'shared/components/base/IconifyIcon';

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
      <Box
        component="span"
        id={id}
        title={label}
        sx={{
          display: 'inline-grid',
          placeItems: 'center',
          width: 20,
          height: 20,
          flexShrink: 0,
          ml: 0.75,
          borderRadius: '50%',
          color: `${color}.dark`,
          bgcolor: (theme) =>
            `color-mix(in srgb, ${theme.vars.palette[color].main} 15%, transparent)`,
          fontSize: 14,
        }}
      >
        <IconifyIcon icon={live ? 'mdi:access-point' : 'mdi:clock-outline'} aria-hidden="true" />
        <Box component="span" sx={visuallyHidden}>
          {label}
        </Box>
      </Box>
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
