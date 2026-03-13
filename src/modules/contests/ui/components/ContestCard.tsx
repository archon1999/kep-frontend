import { useTranslation } from 'react-i18next';
import { Link as RouterLink } from 'react-router';
import { Box, Card, CardActionArea, Chip, Divider, Stack, Typography } from '@mui/material';
import { getResourceById, resources } from 'app/routes/resources';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import KepIcon from 'shared/components/base/KepIcon';
import ContestTopContestants from './ContestTopContestants';
import { useContestTopContestants } from '../../application/queries';
import { ContestListItem } from '../../domain/entities/contest.entity';

dayjs.extend(duration);

interface ContestCardProps {
  contest: ContestListItem;
}

const ContestCard = ({ contest }: ContestCardProps) => {
  const { t } = useTranslation();

  const startDate = contest.startTime ? dayjs(contest.startTime) : null;
  const finishDate = contest.finishTime ? dayjs(contest.finishTime) : null;
  const now = dayjs();

  const isFinished = finishDate ? now.isAfter(finishDate) : false;
  const isUpcoming = startDate ? now.isBefore(startDate) : false;

  const { data: topContestants, isLoading: isTopContestantsLoading } = useContestTopContestants(
    contest.id,
    isFinished,
  );

  const statusLabel = isFinished
    ? t('contests.statusShort.finished')
    : isUpcoming
      ? t('contests.statusShort.notStarted')
      : t('contests.statusShort.live');

  const statusColor: 'success' | 'warning' | 'default' = isFinished
    ? 'default'
    : isUpcoming
      ? 'warning'
      : 'success';

  return (
    <Card
      sx={{
        borderRadius: 3,
        position: 'relative',
        overflow: 'hidden',
        background: 'linear-gradient(135deg, rgba(0, 255, 190, 0.05), rgba(86, 112, 255, 0.06))',
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(circle at 15% 20%, rgba(0, 255, 190, 0.12), transparent 35%)',
          '&::after': contest.logo
            ? {
                content: '""',
                position: 'absolute',
                inset: 0,
                backgroundImage: `url(${contest.logo})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                opacity: 0.08,
                filter: 'saturate(0.6)',
              }
            : undefined,
        }}
      />

      <CardActionArea
        component={RouterLink}
        to={getResourceById(resources.Contest, contest.id)}
        sx={{ position: 'relative', zIndex: 1, p: 3, display: 'block' }}
      >
        <Stack direction="column" spacing={2}>
          <Stack direction="row" spacing={2} alignItems="flex-start" justifyContent="space-between">
            <Stack direction="column" spacing={1} flex={1} minWidth={0}>
              <Stack direction="row" spacing={1} alignItems="center">
                <KepIcon name="contest" fontSize={20} />
                <Typography
                  variant="overline"
                  color="text.secondary"
                  fontWeight={700}
                  textTransform="uppercase"
                >
                  {contest.categoryTitle}
                </Typography>
                <Chip
                  label={t(contest.isRated ? 'contests.rated' : 'contests.unrated')}
                  size="small"
                  color={contest.isRated ? 'secondary' : 'neutral'}
                  variant={contest.isRated ? 'filled' : 'soft'}
                />
              </Stack>

              <Typography variant="h6" fontWeight={800} sx={{ wordBreak: 'break-word' }}>
                {contest.title}
              </Typography>
            </Stack>

            <Chip
              label={statusLabel}
              color={statusColor}
              variant="filled"
              sx={{ fontWeight: 700 }}
            />
          </Stack>

          <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} alignItems="stretch">
            <Box
              sx={{
                flex: 1,
                borderRadius: 2,
                bgcolor: 'background.neutral',
                p: 2,
                minWidth: 0,
              }}
            >
              <Typography
                component="div"
                dangerouslySetInnerHTML={{ __html: contest.description ?? '' }}
                variant="body2"
                color="text.secondary"
                sx={{
                  '& p': { m: 0 },
                }}
              />
            </Box>

            {isFinished ? (
              <ContestTopContestants
                contestants={topContestants}
                isLoading={isTopContestantsLoading}
              />
            ) : null}
          </Stack>

          <Stack direction="column" spacing={1.5}>
            <Stack direction="row" spacing={2} flexWrap="wrap" useFlexGap>
              <Stack direction="row" spacing={1} alignItems="center">
                <KepIcon name="competition" fontSize={18} />
                <Typography variant="body2" color="text.secondary">
                  {t('contests.type', { type: contest.type })}
                </Typography>
              </Stack>

              <Stack direction="row" spacing={1} alignItems="center">
                <KepIcon name="challenge-time" fontSize={18} />
                <Typography variant="body2" color="text.secondary">
                  {startDate
                    ? t('contests.startsLabel', { date: startDate.format('DD MMM, HH:mm') })
                    : t('contests.startsUnknown')}
                </Typography>
              </Stack>

              {finishDate ? (
                <Stack direction="row" spacing={1} alignItems="center">
                  <KepIcon name="challenge-time" fontSize={18} />
                  <Typography variant="body2" color="text.secondary">
                    {t('contests.endsLabel', { date: finishDate.format('DD MMM, HH:mm') })}
                  </Typography>
                </Stack>
              ) : null}
            </Stack>

            <Divider sx={{ borderStyle: 'dashed', opacity: 0.6 }} />

            <Stack direction="row" spacing={3} flexWrap="wrap" useFlexGap>
              <Stack direction="row" spacing={1} alignItems="center">
                <KepIcon name="problems" fontSize={18} />
                <Typography variant="body2" color="text.primary" fontWeight={700}>
                  {t('contests.problems', { count: contest.problemsCount })}
                </Typography>
              </Stack>

              <Stack direction="row" spacing={1} alignItems="center">
                <KepIcon name="rating" fontSize={18} />
                <Typography variant="body2" color="text.primary" fontWeight={700}>
                  {t('contests.registrantsLabel', { count: contest.registrantsCount })}
                </Typography>
              </Stack>

              <Stack direction="row" spacing={1} alignItems="center">
                <KepIcon name="users" fontSize={18} />
                <Typography variant="body2" color="text.primary" fontWeight={700}>
                  {t('contests.contestants', { count: contest.contestantsCount })}
                </Typography>
              </Stack>
            </Stack>
          </Stack>
        </Stack>
      </CardActionArea>
    </Card>
  );
};

export default ContestCard;
