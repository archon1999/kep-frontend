import { useTranslation } from 'react-i18next';
import { Box, Skeleton, Stack, Typography } from '@mui/material';
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
        p: 3,
        borderTop: 1,
        borderColor: 'divider',
        minWidth: 0,
      }}
    >
      <Stack direction="column" spacing={1.5}>
        <Typography component="h3" variant="label">
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
                  <Typography
                    variant="metric"
                    sx={{
                      width: 36,
                      flexShrink: 0,
                      color:
                        rank === 1
                          ? 'var(--kep-gold)'
                          : rank === 2
                            ? 'var(--kep-silver)'
                            : 'var(--kep-bronze)',
                    }}
                  >
                    {String(rank).padStart(2, '0')}
                  </Typography>
                  <Stack direction="column" spacing={0.25} minWidth={0} sx={{ flex: 1 }}>
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
