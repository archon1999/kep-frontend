import { useTranslation } from 'react-i18next';
import { Chip } from '@mui/material';
import { type Hackathon, HackathonStatus } from 'modules/hackathons/domain';
import { isAfterNow, isBeforeNow } from 'shared/lib/dateTime';

interface HackathonStatusChipProps {
  hackathon: Hackathon;
}

const HackathonStatusChip = ({ hackathon }: HackathonStatusChipProps) => {
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
      variant="soft"
      color={finished ? 'neutral' : upcoming ? 'info' : 'success'}
      label={t(
        finished ? 'hackathons.finished' : upcoming ? 'hackathons.upcoming' : 'hackathons.active',
      )}
      sx={{ fontWeight: 500, flexShrink: 0, alignSelf: 'flex-start', width: 'fit-content' }}
    />
  );
};

export default HackathonStatusChip;
