import { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { Link as RouterLink } from 'react-router';
import { Box, Card, CardActionArea, Chip, Divider, LinearProgress, Stack, Typography } from '@mui/material';
import { getResourceById, resources } from 'app/routes/resources';
import { useContestTopContestants } from 'modules/contests/application/queries';
import { ContestListItem } from 'modules/contests/domain/entities/contest.entity';
import { getContestTypeTitle } from 'modules/contests/ui/shared/utils/contestType';
import KepIcon from 'shared/components/base/KepIcon';
import { KepIconName } from 'shared/config/icons';
import {
  DateTimeInput,
  diffDateTime,
  formatDateTime,
  isAfterNow,
  isBeforeNow,
} from 'shared/lib/dateTime';
import { cssVarRgba } from 'shared/lib/utils';
import ContestTopContestants from './ContestTopContestants';

interface ContestCardProps {
  contest: ContestListItem;
}

interface ContestCardMeta {
  startDate: DateTimeInput;
  finishDate: DateTimeInput;
  isFinished: boolean;
  isUpcoming: boolean;
  isOngoing: boolean;
  progress: number;
  typeTitle: string;
  borderColor: 'primary.main' | 'success.main' | 'warning.main';
}

const clamp = (value: number) => Math.min(100, Math.max(0, value));

const DescriptionBlock = ({ contest }: { contest: ContestListItem }) => {
  const { t } = useTranslation();

  return (
    <Typography
      component="div"
      dangerouslySetInnerHTML={{ __html: contest.description || t('contests.noDescription') }}
      variant="body2"
      color="text.secondary"
      sx={{ '& p': { m: 0 } }}
    />
  );
};

const StatPill = ({
  icon,
  label,
  strong = false,
}: {
  icon: KepIconName;
  label: ReactNode;
  strong?: boolean;
}) => (
  <Stack direction="row" spacing={1} alignItems="center" minWidth={0}>
    <KepIcon name={icon} fontSize={18} />
    <Typography
      variant="body2"
      color={strong ? 'text.primary' : 'text.secondary'}
      fontWeight={strong ? 700 : 500}
    >
      {label}
    </Typography>
  </Stack>
);

const RatedChip = ({ contest }: { contest: ContestListItem }) => {
  const { t } = useTranslation();

  return (
    <Chip
      label={t(contest.isRated ? 'contests.rated' : 'contests.unrated')}
      size="small"
      color={contest.isRated ? 'success' : 'error'}
      variant={contest.isRated ? 'filled' : 'soft'}
      sx={{ fontWeight: 700 }}
    />
  );
};

const DateLine = ({ icon, label }: { icon: KepIconName; label: ReactNode }) => (
  <Stack direction="row" spacing={1} alignItems="center" minWidth={0}>
    <KepIcon name={icon} fontSize={18} />
    <Typography variant="body2" color="text.secondary" noWrap>
      {label}
    </Typography>
  </Stack>
);

const ContestStats = ({ contest, meta }: { contest: ContestListItem; meta: ContestCardMeta }) => {
  const { t } = useTranslation();

  return (
    <Stack direction="row" spacing={2.5} flexWrap="wrap" useFlexGap>
      <StatPill
        icon="problems"
        label={t('contests.problems', { count: contest.problemsCount })}
        strong
      />
      <StatPill
        icon="rating"
        label={t('contests.registrantsLabel', { count: contest.registrantsCount })}
        strong
      />
      {!meta.isUpcoming ? (
        <StatPill
          icon="users"
          label={t('contests.contestants', { count: contest.contestantsCount })}
          strong
        />
      ) : null}
    </Stack>
  );
};

const ContestDurationProgress = ({ meta }: { meta: ContestCardMeta }) => {
  if (!meta.isOngoing || !meta.startDate || !meta.finishDate) {
    return null;
  }

  return (
    <Stack direction="column" spacing={1}>
      <LinearProgress
        variant="determinate"
        color="success"
        value={meta.progress}
        sx={{
          height: 8,
          borderRadius: 999,
          bgcolor: 'background.neutral',
        }}
      />
      <Stack direction="row" justifyContent="space-between" spacing={2}>
        <Typography variant="caption" color="text.secondary" fontWeight={700}>
          {formatDateTime(meta.startDate, 'compactDateTime')}
        </Typography>
        <Typography variant="caption" color="text.secondary" fontWeight={700}>
          {formatDateTime(meta.finishDate, 'compactDateTime')}
        </Typography>
      </Stack>
    </Stack>
  );
};

const ContestCard = ({ contest }: ContestCardProps) => {
  const { t } = useTranslation();

  const startDate = contest.startTime;
  const finishDate = contest.finishTime;

  const isFinished = finishDate ? isBeforeNow(finishDate) : false;
  const isUpcoming = startDate ? isAfterNow(startDate) : false;
  const isOngoing = !isFinished && !isUpcoming;

  const { data: topContestants, isLoading: isTopContestantsLoading } = useContestTopContestants(
    contest.id,
    isFinished,
  );

  const progress =
    startDate && finishDate
      ? clamp((diffDateTime(Date.now(), startDate) / Math.max(diffDateTime(finishDate, startDate), 1)) * 100)
      : 0;

  const meta: ContestCardMeta = {
    startDate,
    finishDate,
    isFinished,
    isUpcoming,
    isOngoing,
    progress,
    typeTitle: getContestTypeTitle(contest.type, contest.typeInfo),
    borderColor: isFinished ? 'primary.main' : isUpcoming ? 'warning.main' : 'success.main',
  };

  return (
    <Card
      sx={(theme) => ({
        borderRadius: 3,
        position: 'relative',
        overflow: 'hidden',
        border: '1px solid',
        borderColor: cssVarRgba(theme.vars.palette.primary.mainChannel, 0.12),
        borderLeft: '6px solid',
        borderLeftColor: meta.borderColor,
        background: `linear-gradient(135deg, ${cssVarRgba(theme.vars.palette.primary.lightChannel, 0.12)}, ${cssVarRgba(theme.vars.palette.primary.mainChannel, 0.08)} 58%, ${cssVarRgba(theme.vars.palette.primary.mainChannel, 0.04)})`,
      })}
    >
      <Box
        sx={(theme) => ({
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          background: `radial-gradient(circle at 14% 18%, ${cssVarRgba(theme.vars.palette.primary.lightChannel, 0.16)}, transparent 34%), radial-gradient(circle at 85% 14%, ${cssVarRgba(theme.vars.palette.primary.mainChannel, 0.12)}, transparent 28%)`,
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
        })}
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
              </Stack>

              <Typography variant="h6" fontWeight={800} sx={{ wordBreak: 'break-word' }}>
                {contest.title}
              </Typography>
            </Stack>

            <RatedChip contest={contest} />
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
              <DescriptionBlock contest={contest} />
            </Box>

            {meta.isFinished ? (
              <ContestTopContestants
                contestants={topContestants}
                isLoading={isTopContestantsLoading}
              />
            ) : null}
          </Stack>

          <ContestDurationProgress meta={meta} />

          <Stack direction="column" spacing={1.5}>
            <Stack direction="row" spacing={2} flexWrap="wrap" useFlexGap>
              <DateLine icon="competition" label={t('contests.type', { type: meta.typeTitle })} />
              <DateLine
                icon="challenge-time"
                label={
                  meta.startDate
                    ? t('contests.startsLabel', {
                        date: formatDateTime(meta.startDate, 'compactDateTime'),
                      })
                    : t('contests.startsUnknown')
                }
              />
              {meta.finishDate ? (
                <DateLine
                  icon="challenge-time"
                  label={t('contests.endsLabel', {
                    date: formatDateTime(meta.finishDate, 'compactDateTime'),
                  })}
                />
              ) : null}
            </Stack>

            <Divider sx={{ borderStyle: 'dashed', opacity: 0.6 }} />
            <ContestStats contest={contest} meta={meta} />
          </Stack>
        </Stack>
      </CardActionArea>
    </Card>
  );
};

export default ContestCard;
