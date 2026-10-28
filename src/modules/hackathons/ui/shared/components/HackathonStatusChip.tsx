import { useTranslation } from 'react-i18next';
import { Chip, ChipProps } from '@mui/material';
import { type Hackathon, HackathonStatus } from 'modules/hackathons/domain';
import IconifyIcon from 'shared/components/base/IconifyIcon';
import { isAfterNow, isBeforeNow } from 'shared/lib/dateTime';

interface HackathonStatusChipProps {
  hackathon: Hackathon;
  variant?: ChipProps['variant'];
}

const HackathonStatusChip = ({ hackathon, variant = 'status' }: HackathonStatusChipProps) => {
  const { t } = useTranslation();
  const finished =
    hackathon.status === HackathonStatus.FINISHED ||
    (hackathon.status === undefined && isBeforeNow(hackathon.finishTime));
  const upcoming =
    hackathon.status === HackathonStatus.NOT_STARTED ||
    (hackathon.status === undefined && isAfterNow(hackathon.startTime));

  return (
    <Chip
      size="small"
      variant={variant}
      color={finished ? 'neutral' : upcoming ? 'info' : 'success'}
      icon={
        variant === 'status' ? (
          <IconifyIcon
            icon={
              finished
                ? 'mdi:check-circle-outline'
                : upcoming
                  ? 'mdi:clock-outline'
                  : 'mdi:access-point'
            }
          />
        ) : undefined
      }
      label={t(
        finished ? 'hackathons.finished' : upcoming ? 'hackathons.upcoming' : 'hackathons.active',
      )}
      sx={{ fontWeight: 500, flexShrink: 0, alignSelf: 'flex-start', width: 'fit-content' }}
    />
  );
};

export default HackathonStatusChip;
