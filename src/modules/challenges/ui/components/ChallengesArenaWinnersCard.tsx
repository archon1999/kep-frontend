import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';
import { Button, Card, CardContent, Skeleton, Stack, Typography } from '@mui/material';
import { getResourceById, resources } from 'app/routes/resources';
import { Arena } from 'modules/arena/domain/entities/arena.entity.ts';
import { PageResult } from 'modules/arena/domain/ports/arena.repository.ts';
import KepIcon from 'shared/components/base/KepIcon';
import ChallengesRatingChip from 'shared/components/rating/ChallengesRatingChip.tsx';

type ChallengesArenaWinnersCardProps = {
  arenas?: PageResult<Arena>;
  isLoading: boolean;
};

const ChallengesArenaWinnersCard = ({ arenas, isLoading }: ChallengesArenaWinnersCardProps) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <Card variant="outlined" sx={{ borderRadius: 3, height: '100%' }}>
      <CardContent>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={2}>
          <Stack spacing={0.25}>
            <Typography variant="h6">{t('challenges.arenaWinners')}</Typography>
            <Typography variant="body2" color="text.secondary">
              {t('challenges.arenaWinnersSubtitle')}
            </Typography>
          </Stack>

          <Button variant="text" onClick={() => navigate(resources.Arena)}>
            {t('challenges.viewArena')}
          </Button>
        </Stack>

        <Stack spacing={1.25} direction="column" sx={{ mt: 2 }}>
          {isLoading
            ? Array.from({ length: 4 }).map((_, index) => (
                <Skeleton key={index} variant="rectangular" height={64} sx={{ borderRadius: 2 }} />
              ))
            : (arenas?.data ?? []).map((arena) => {
                const winner: any = arena.winner ?? {};
                return (
                  <Card background={0}>
                    <Stack
                      paddingX={2}
                      paddingY={1.5}
                      spacing={1}
                      direction="row"
                      alignItems="center"
                      justifyContent="space-between"
                    >
                      <Stack spacing={0.25} direction="column">
                        <Stack direction="row" spacing={0.75} alignItems="center">
                          <KepIcon name="arena" fontSize={20} color="primary.main" />
                          <Typography variant="subtitle2">{arena.title}</Typography>
                        </Stack>
                        {winner?.username ? (
                          <Stack direction="row" spacing={0.75} alignItems="center">
                            <Stack spacing={1} direction="row">
                              <ChallengesRatingChip
                                title={winner.rankTitle ?? winner.rank_title}
                                size="small"
                              />
                              <Typography variant="body2">{winner.username}</Typography>
                            </Stack>
                          </Stack>
                        ) : null}
                      </Stack>
                      <Button
                        variant="outlined"
                        size="small"
                        onClick={() =>
                          navigate(getResourceById(resources.ArenaTournament, arena.id))
                        }
                      >
                        {t('challenges.viewArena')}
                      </Button>
                    </Stack>
                  </Card>
                );
              })}
          {!isLoading && !arenas?.data?.length && (
            <Typography variant="body2" color="text.secondary">
              {t('challenges.noArenas')}
            </Typography>
          )}
        </Stack>
      </CardContent>
    </Card>
  );
};
export default ChallengesArenaWinnersCard;
