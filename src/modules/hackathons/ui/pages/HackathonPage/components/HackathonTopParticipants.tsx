import { useTranslation } from 'react-i18next';
import { Avatar, Box, Skeleton, Stack, Typography } from '@mui/material';
import { type HackathonStanding } from 'modules/hackathons/domain';
import UserPopover from 'modules/users/ui/shared/components/UserPopover';

interface HackathonTopParticipantsProps {
  standings?: HackathonStanding[];
  isLoading: boolean;
  error?: unknown;
}

const HackathonTopParticipants = ({
  standings,
  isLoading,
  error,
}: HackathonTopParticipantsProps) => {
  const { t } = useTranslation();
  const leaders = [...(standings ?? [])].sort((a, b) => b.points - a.points).slice(0, 3);
  let rank = 1;

  return (
    <Box
      sx={{
        p: 2.5,
        borderRadius: 2.5,
        bgcolor: 'background.neutral',
        minWidth: { lg: 260 },
        flexShrink: 0,
      }}
    >
      <Stack direction="column" spacing={1.5}>
        <Typography component="h3" variant="subtitle2" fontWeight={800} textTransform="uppercase">
          {t('contests.topContestants.title')}
        </Typography>
        {isLoading ? (
          <Stack direction="column" spacing={1.5}>
            {[0, 1, 2].map((index) => (
              <Stack key={index} direction="row" spacing={1.5} alignItems="center">
                <Skeleton variant="circular" width={40} height={40} />
                <Skeleton width={140} />
              </Stack>
            ))}
          </Stack>
        ) : error ? (
          <Typography variant="body2" color="text.secondary">
            {t('hackathons.loadError')}
          </Typography>
        ) : !leaders.length ? (
          <Typography variant="body2" color="text.secondary">
            {t('hackathons.standingsEmptyTitle')}
          </Typography>
        ) : (
          <Stack direction="column" spacing={1.25}>
            {leaders.map((participant, index) => {
              if (index > 0 && participant.points !== leaders[index - 1].points) rank = index + 1;
              return (
                <Stack key={participant.username} direction="row" spacing={1.5} alignItems="center">
                  <Avatar
                    sx={{
                      bgcolor: 'background.paper',
                      border: '2px solid',
                      borderColor: 'divider',
                      width: 40,
                      height: 40,
                      fontSize: 20,
                    }}
                  >
                    {['🥇', '🥈', '🥉'][rank - 1]}
                  </Avatar>
                  <Stack direction="column" spacing={0.25} minWidth={0}>
                    <UserPopover
                      username={participant.username}
                      fullName={participant.userFullName}
                    >
                      <Typography variant="subtitle2" fontWeight={700} noWrap>
                        {participant.username}
                      </Typography>
                    </UserPopover>
                    <Typography variant="caption" color="text.secondary">
                      {participant.points} {t('hackathons.pointsUnit')}
                    </Typography>
                  </Stack>
                </Stack>
              );
            })}
          </Stack>
        )}
      </Stack>
    </Box>
  );
};

export default HackathonTopParticipants;
