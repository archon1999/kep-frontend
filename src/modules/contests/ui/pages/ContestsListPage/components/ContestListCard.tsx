import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';
import { Button, Chip, LinearProgress, Paper, Skeleton, Typography } from '@mui/material';
import { getResourceById, resources } from 'app/routes/resources';
import { useContestTopContestants } from 'modules/contests/application/queries';
import { ContestListItem } from 'modules/contests/domain/entities/contest.entity';
import { getContestTypeTitle } from 'modules/contests/ui/shared/utils/contestType';
import UserPopover from 'modules/users/ui/shared/components/UserPopover';
import IconifyIcon from 'shared/components/base/IconifyIcon';
import { PointerSpotlight, ScrambleText } from 'shared/components/motion/InteractionEffects';
import { diffDateTime, formatDateTime, isAfterNow, isBeforeNow } from 'shared/lib/dateTime';
import { createSafeHtml } from 'shared/lib/safeHtml';

const ContestListCard = ({ contest }: { contest: ContestListItem }) => {
  const { t } = useTranslation();
  const [expanded, setExpanded] = useState(false);
  const finished = Boolean(contest.finishTime && isBeforeNow(contest.finishTime));
  const upcoming = Boolean(contest.startTime && isAfterNow(contest.startTime));
  const live = !finished && !upcoming;
  const status = finished ? 'finished' : upcoming ? 'notStarted' : 'live';
  const { data: leaders, isLoading, error } = useContestTopContestants(contest.id, finished);
  const visibleLeaders = (leaders ?? []).filter((row) => row.username || row.teamName).slice(0, 3);
  const href = getResourceById(resources.Contest, contest.id);
  const progress =
    contest.startTime && contest.finishTime
      ? Math.max(
          0,
          Math.min(
            100,
            (diffDateTime(Date.now(), contest.startTime) /
              Math.max(1, diffDateTime(contest.finishTime, contest.startTime))) *
              100,
          ),
        )
      : 0;

  return (
    <Paper
      variant="panel"
      className={`contest-editorial-card contest-editorial-card--${status}`}
      data-expanded={expanded}
      sx={{ borderInline: 0, borderTop: 0 }}
    >
      <article aria-labelledby={`contest-title-${contest.id}`}>
        <PointerSpotlight className="contest-card-masthead">
          <header>
            <div className="contest-card-heading">
              <div className="contest-card-identity">
                <Chip
                  variant="category"
                  icon={<span className="kep-pixel-cross" aria-hidden="true" />}
                  label={contest.categoryTitle.replace(/([a-z])([A-Z])/g, '$1 $2')}
                />
                <span className="contest-card-id">/{String(contest.id).padStart(3, '0')}</span>
              </div>
              <div className="contest-card-badges">
                <Chip
                  variant="status"
                  color={live ? 'success' : upcoming ? 'warning' : 'default'}
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
                  label={t(`contests.statusShort.${status}`)}
                />
                <Chip
                  variant="status"
                  color={contest.isRated ? 'secondary' : 'default'}
                  icon={
                    <IconifyIcon
                      icon={
                        contest.isRated
                          ? 'mdi:star-four-points-outline'
                          : 'mdi:minus-circle-outline'
                      }
                    />
                  }
                  label={t(contest.isRated ? 'contests.rated' : 'contests.unrated')}
                />
              </div>
            </div>
            <h2 id={`contest-title-${contest.id}`}>
              <Link to={href}>
                <ScrambleText className="contest-title-text" mixed>
                  {contest.title}
                </ScrambleText>
                <span className="contest-title-arrow" aria-hidden="true">
                  <IconifyIcon icon="mdi:arrow-top-right" />
                </span>
              </Link>
            </h2>
          </header>
        </PointerSpotlight>
        <div className="contest-card-rule" aria-hidden="true" />
        <div className={`contest-card-main ${finished ? '' : 'contest-card-main--solo'}`}>
          <div className="contest-announcement">
            <div
              id={`contest-description-${contest.id}`}
              className={`contest-announcement-copy ${expanded ? 'is-expanded' : ''}`}
              dangerouslySetInnerHTML={createSafeHtml(
                contest.description || t('contests.noDescription'),
              )}
            />
            {contest.description && (
              <button
                type="button"
                className="contest-text-action"
                aria-expanded={expanded}
                aria-controls={`contest-description-${contest.id}`}
                onClick={() => setExpanded(!expanded)}
              >
                {t(expanded ? 'contests.card.showLess' : 'contests.card.readMore')}
                <span
                  className={`contest-disclosure-mark ${expanded ? 'is-expanded' : 'kep-pixel-cross'}`}
                  aria-hidden="true"
                />
              </button>
            )}
          </div>
          {finished && (
            <aside className="contest-card-leaders" aria-label={t('contests.topContestants.title')}>
              <Typography component="h3" variant="label">
                {t('contests.topContestants.title')}
              </Typography>
              {isLoading ? (
                Array.from({ length: 3 }, (_, index) => <Skeleton key={index} height={30} />)
              ) : error ? (
                <p role="alert">{t('contests.card.leadersError')}</p>
              ) : visibleLeaders.length ? (
                <ol>
                  {visibleLeaders.map((leader, index) => (
                    <li key={`${leader.username}-${index}`}>
                      <span className="contest-podium-place">
                        {String(index + 1).padStart(2, '0')}
                      </span>
                      {leader.teamName ? (
                        <span
                          className="contest-team-name"
                          title={leader.teamMembers?.map((m) => m.username).join(', ')}
                        >
                          {leader.teamName}
                        </span>
                      ) : (
                        <UserPopover
                          username={leader.username}
                          fullName={leader.fullName}
                          countryCode={leader.country}
                        >
                          <button
                            className="contest-user-button"
                            type="button"
                            title={leader.username}
                          >
                            <span className="contest-user-name">{leader.username}</span>
                          </button>
                        </UserPopover>
                      )}
                    </li>
                  ))}
                </ol>
              ) : (
                <p>{t('contests.topContestants.empty')}</p>
              )}
            </aside>
          )}
        </div>
        {live && (
          <LinearProgress
            className="contest-card-progress"
            variant="determinate"
            value={progress}
            aria-label={t('contests.statusShort.live')}
          />
        )}
        <dl className="contest-card-dates">
          <div>
            <Typography component="dt" variant="label">
              <IconifyIcon icon="mdi:code-braces" aria-hidden="true" />
              {t('contests.typeLabel')}
            </Typography>
            <dd>
              <span className="contest-format-value">
                {getContestTypeTitle(contest.type, contest.typeInfo)}
              </span>
            </dd>
          </div>
          <div>
            <Typography component="dt" variant="label">
              <IconifyIcon icon="mdi:calendar-outline" aria-hidden="true" />
              {t('contests.card.starts')}
            </Typography>
            <dd>
              {contest.startTime ? (
                <time dateTime={contest.startTime}>
                  <span className="contest-schedule-time">
                    {formatDateTime(contest.startTime, 'time')}
                  </span>
                  <span className="contest-schedule-date">
                    {formatDateTime(contest.startTime, 'compactDate')}
                  </span>
                </time>
              ) : (
                t('contests.startsUnknown')
              )}
            </dd>
          </div>
          <div>
            <Typography component="dt" variant="label">
              <IconifyIcon icon="mdi:clock-outline" aria-hidden="true" />
              {t('contests.card.ends')}
            </Typography>
            <dd>
              {contest.finishTime ? (
                <time dateTime={contest.finishTime}>
                  <span className="contest-schedule-time">
                    {formatDateTime(contest.finishTime, 'time')}
                  </span>
                  <span className="contest-schedule-date">
                    {formatDateTime(contest.finishTime, 'compactDate')}
                  </span>
                </time>
              ) : (
                '—'
              )}
            </dd>
          </div>
        </dl>
        <div className="contest-card-bottom">
          <dl className="contest-card-counts">
            <div>
              <Typography component="dt" variant="label">
                <IconifyIcon icon="mdi:code-tags" aria-hidden="true" />
                {t('contests.card.problems')}
              </Typography>
              <Typography component="dd" variant="metric">
                {contest.problemsCount}
              </Typography>
            </div>
            <div>
              <Typography component="dt" variant="label">
                <IconifyIcon icon="mdi:account-check-outline" aria-hidden="true" />
                {t('contests.card.registrations')}
              </Typography>
              <Typography component="dd" variant="metric">
                {contest.registrantsCount}
              </Typography>
            </div>
            {!upcoming && (
              <div>
                <Typography component="dt" variant="label">
                  <IconifyIcon icon="mdi:account-group-outline" aria-hidden="true" />
                  {t('contests.card.contestants')}
                </Typography>
                <Typography component="dd" variant="metric">
                  {contest.contestantsCount}
                </Typography>
              </div>
            )}
          </dl>
          <Button
            component={Link}
            className="contest-open-link"
            to={href}
            variant="contained"
            endIcon={<IconifyIcon icon="mdi:arrow-right" />}
          >
            <ScrambleText>{t('contests.card.open')}</ScrambleText>
          </Button>
        </div>
      </article>
    </Paper>
  );
};
export default ContestListCard;
