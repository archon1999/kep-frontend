import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Link as RouterLink } from 'react-router';
import { Alert, Box, Button, Chip, Stack, Typography } from '@mui/material';
import { getResourceById, resources } from 'app/routes/resources';
import { useContestsList } from 'modules/contests/application/queries';
import { ContestListItem } from 'modules/contests/domain/entities/contest.entity';
import { getContestTypeTitle } from 'modules/contests/ui/shared/utils/contestType';
import IconifyIcon from 'shared/components/base/IconifyIcon';
import EmptyState from 'shared/components/common/EmptyState';
import MixedText from 'shared/components/common/MixedText';
import PatternArtwork from 'shared/components/common/PatternArtwork';
import EventListCard, {
  EventDate,
  EventListCardSkeleton,
} from 'shared/components/sections/common/EventListCard';
import { isAfterNow, isBeforeNow } from 'shared/lib/dateTime';
import { createSafeHtml } from 'shared/lib/safeHtml';

const HomeContestCard = ({ contest }: { contest: ContestListItem }) => {
  const { t } = useTranslation();
  const finished = Boolean(contest.finishTime && isBeforeNow(contest.finishTime));
  const upcoming = Boolean(contest.startTime && isAfterNow(contest.startTime));
  const status = finished ? 'finished' : upcoming ? 'notStarted' : 'live';
  return (
    <EventListCard
      id={contest.id}
      title={contest.title}
      titleComponent="h3"
      href={getResourceById(resources.Contest, contest.id)}
      category={contest.categoryTitle.replace(/([a-z])([A-Z])/g, '$1 $2')}
      icon="mdi:code-tags"
      actionLabel={t('contests.card.open')}
      media={
        <PatternArtwork
          kind="competitions"
          sx={{ width: 100, opacity: 0.65, display: { xs: 'none', sm: 'block' } }}
        />
      }
      badges={
        <>
          <Chip
            size="small"
            variant="status"
            color={finished ? 'neutral' : upcoming ? 'warning' : 'success'}
            icon={
              <IconifyIcon
                icon={
                  finished
                    ? 'mdi:check-circle-outline'
                    : upcoming
                      ? 'mdi:clock-outline'
                      : 'mdi:access-point'
                }
              />
            }
            label={t('contests.statusShort.' + status)}
          />
          <Chip
            size="small"
            variant="status"
            color={contest.isRated ? 'secondary' : 'default'}
            icon={<IconifyIcon icon="mdi:star-four-points-outline" />}
            label={t(contest.isRated ? 'contests.rated' : 'contests.unrated')}
          />
        </>
      }
      details={[
        {
          label: t('contests.typeLabel'),
          icon: 'mdi:code-braces',
          value: (
            <Typography variant="body2" fontWeight={600}>
              {getContestTypeTitle(contest.type, contest.typeInfo)}
            </Typography>
          ),
        },
        {
          label: t('contests.card.starts'),
          icon: 'mdi:calendar-outline',
          value: <EventDate value={contest.startTime} fallback={t('contests.startsUnknown')} />,
        },
        {
          label: t('contests.card.ends'),
          icon: 'mdi:clock-outline',
          value: <EventDate value={contest.finishTime} />,
        },
      ]}
      metrics={[
        { label: t('contests.card.problems'), icon: 'mdi:code-tags', value: contest.problemsCount },
        {
          label: t('contests.card.registrations'),
          icon: 'mdi:account-check-outline',
          value: contest.registrantsCount,
        },
        ...(!upcoming
          ? [
              {
                label: t('contests.card.contestants'),
                icon: 'mdi:account-group-outline',
                value: contest.contestantsCount,
              },
            ]
          : []),
      ]}
    >
      {contest.description && (
        <Typography
          component="div"
          variant="body2"
          color="text.secondary"
          className="kep-dashboard-contest-description"
          dangerouslySetInnerHTML={createSafeHtml(contest.description)}
        />
      )}
    </EventListCard>
  );
};

const ContestsSection = () => {
  const { t } = useTranslation();
  const params = useMemo(() => ({ page: 1, pageSize: 1, status: '1' }), []);
  const { data, isLoading, error, mutate } = useContestsList(params);
  const contest = data?.data?.[0];
  return (
    <section className="kep-dashboard-contest">
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        gap={1}
        flexWrap="wrap"
        sx={{ p: 'var(--kep-content-inset)', pb: 2, borderBottom: 1, borderColor: 'divider' }}
      >
        <Typography component="h2" variant="h5">
          <MixedText>{t('homePage.contests.title')}</MixedText>
        </Typography>
        <Button component={RouterLink} to={resources.Contests} variant="text">
          {t('homePage.contests.viewAll')}
        </Button>
      </Stack>
      {isLoading ? (
        <EventListCardSkeleton description media />
      ) : error ? (
        <Alert
          severity="error"
          action={<Button onClick={() => void mutate()}>{t('common.retry')}</Button>}
        >
          {t('common.loadFailed')}
        </Alert>
      ) : contest ? (
        <HomeContestCard contest={contest} />
      ) : (
        <Box sx={{ p: 3 }}>
          <EmptyState compact title={t('homePage.contests.empty')} />
        </Box>
      )}
    </section>
  );
};
export default ContestsSection;
