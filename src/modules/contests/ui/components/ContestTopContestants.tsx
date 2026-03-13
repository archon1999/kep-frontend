import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Avatar, Box, Skeleton, Stack, Typography } from '@mui/material';
import UserPopover from 'modules/users/ui/components/UserPopover';
import ContestsRatingChip from 'shared/components/rating/ContestsRatingChip';
import { ContestTopContestant } from '../../domain/entities/contest.entity';

interface ContestTopContestantsProps {
  contestants?: ContestTopContestant[];
  isLoading?: boolean;
}

const medals = ['🥇', '🥈', '🥉'];

const ContestTopContestants = ({ contestants = [], isLoading }: ContestTopContestantsProps) => {
  const { t } = useTranslation();

  const visibleContestants = useMemo(
    () => contestants.filter((contestant) => contestant.username || contestant.teamName).slice(0, 3),
    [contestants],
  );

  const renderSkeleton = () => (
    <Stack direction="column" spacing={1.5}>
      {Array.from({ length: 3 }).map((_, index) => (
        <Stack key={index} direction="row" spacing={1.5} alignItems="center">
          <Skeleton variant="circular" width={40} height={40} />
          <Stack direction="row" spacing={0.5} flex={1}>
            <Skeleton variant="text" width="70%" />
            <Skeleton variant="text" width="50%" />
          </Stack>
        </Stack>
      ))}
    </Stack>
  );

  const renderTeam = (contestant: ContestTopContestant) => (
    <Stack direction="column" spacing={0.5} minWidth={0}>
      <Typography variant="subtitle2" fontWeight={700} noWrap>
        {contestant.teamName}
      </Typography>
      {contestant.teamMembers && contestant.teamMembers.length > 0 ? (
        <Typography variant="body2" color="text.secondary" noWrap>
          {contestant.teamMembers.map((member) => member.username).join(', ')}
        </Typography>
      ) : null}
    </Stack>
  );

  const renderUser = (contestant: ContestTopContestant) => (
    <Stack direction="row" spacing={1} alignItems="center" minWidth={0}>
      {contestant.ratingTitle ? <ContestsRatingChip title={contestant.ratingTitle} imgSize={24} /> : null}
      <UserPopover username={contestant.username} fullName={contestant.fullName} countryCode={contestant.country}>
        <Typography variant="subtitle2" fontWeight={700} noWrap>
          {contestant.username}
        </Typography>
      </UserPopover>
    </Stack>
  );

  const renderContestants = () => {
    if (visibleContestants.length === 0) {
      return (
        <Typography variant="body2" color="text.secondary">
          {t('contests.topContestants.empty')}
        </Typography>
      );
    }

    return (
      <Stack direction="column" spacing={1.25}>
        {visibleContestants.map((contestant, index) => (
          <Stack
            key={`${contestant.username}-${contestant.teamName ?? 'solo'}-${index}`}
            direction="row"
            spacing={1.5}
            alignItems="center"
          >
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
              {medals[index] ?? medals[medals.length - 1]}
            </Avatar>

            {contestant.teamName ? renderTeam(contestant) : renderUser(contestant)}
          </Stack>
        ))}
      </Stack>
    );
  };

  return (
    <Box
      sx={{
        p: 2.5,
        borderRadius: 2.5,
        bgcolor: 'background.neutral',
        minWidth: { md: 260 },
        flexShrink: 0,
      }}
    >
      <Stack direction="column" spacing={1.5}>
        <Typography variant="subtitle2" fontWeight={800} textTransform="uppercase">
          {t('contests.topContestants.title')}
        </Typography>

        {isLoading ? renderSkeleton() : renderContestants()}
      </Stack>
    </Box>
  );
};

export default ContestTopContestants;
