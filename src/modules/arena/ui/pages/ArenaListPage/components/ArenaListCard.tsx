import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Chip, Typography } from '@mui/material';
import { getResourceById, resources } from 'app/routes/resources';
import { Arena, ArenaStatus } from 'modules/arena/domain/entities/arena.entity';
import IconifyIcon from 'shared/components/base/IconifyIcon';
import { ChapterLogos } from 'shared/components/common/ChapterLogo';
import EventListCard, { EventDate } from 'shared/components/sections/common/EventListCard';
import { diffDateTime, formatCountdownClock } from 'shared/lib/dateTime';

const ArenaListCard = ({ arena }: { arena: Arena }) => {
  const { t } = useTranslation();
  const [now, setNow] = useState(() => Date.now());
  const isLive = arena.status === ArenaStatus.Already;
  const isUpcoming = arena.status === ArenaStatus.NotStarted;
  useEffect(() => {
    if (!isUpcoming && !isLive) return;
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, [isLive, isUpcoming]);
  const statusLabel = t(
    isLive ? 'arena.status.live' : isUpcoming ? 'arena.status.upcoming' : 'arena.status.finished',
  );
  const countdown = (isLive || isUpcoming) && {
    label: t(isUpcoming ? 'arena.countdown.untilStart' : 'arena.countdown.untilFinish'),
    icon: 'mdi:timer-outline',
    value: (
      <Typography
        variant="metric"
        sx={{ fontSize: 24, color: isLive ? 'success.main' : 'secondary.main' }}
      >
        {formatCountdownClock(
          diffDateTime(isUpcoming ? arena.startTime : arena.finishTime, now, 'millisecond'),
        )}
      </Typography>
    ),
  };
  return (
    <EventListCard
      id={arena.id}
      title={arena.title}
      href={getResourceById(resources.ArenaTournament, arena.id)}
      category={t('arena.title')}
      icon="mdi:sword-cross"
      badges={
        <Chip
          variant="status"
          color={isLive ? 'success' : isUpcoming ? 'warning' : 'default'}
          icon={
            <IconifyIcon
              icon={
                isLive
                  ? 'mdi:access-point'
                  : isUpcoming
                    ? 'mdi:clock-outline'
                    : 'mdi:check-circle-outline'
              }
            />
          }
          label={statusLabel}
        />
      }
      details={[
        {
          label: t('arena.timeline.start'),
          icon: 'mdi:calendar-outline',
          value: <EventDate value={arena.startTime} />,
        },
        {
          label: t('arena.timeline.finish'),
          icon: 'mdi:clock-outline',
          value: <EventDate value={arena.finishTime} />,
        },
        ...(countdown ? [countdown] : []),
      ]}
      metrics={[
        { label: t('arena.questions'), icon: 'mdi:code-tags', value: arena.questionsCount },
        {
          label: t('arena.duration'),
          icon: 'mdi:timer-outline',
          value: t('arena.secondsShort', { count: arena.timeSeconds }),
        },
      ]}
      actionLabel={t('arena.viewArena')}
    >
      {arena.chapters?.length > 0 && (
        <ChapterLogos chapters={arena.chapters} label={t('arena.chaptersLabel')} />
      )}
    </EventListCard>
  );
};
export default ArenaListCard;
