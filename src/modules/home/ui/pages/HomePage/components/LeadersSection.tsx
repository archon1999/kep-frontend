import { useEffect, useId, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';
import { Alert, Avatar, Button, Skeleton, Tab, Tabs, useMediaQuery } from '@mui/material';
import { resources } from 'app/routes/resources';
import { getRankColor } from 'app/theme/colors/medals';
import { useUsersList } from 'modules/users/application/queries';
import UserPopover from 'modules/users/ui/shared/components/UserPopover';
import CountryFlagIcon from 'shared/components/common/CountryFlagIcon';
import MixedText from 'shared/components/common/MixedText';
import { PointerSpotlight } from 'shared/components/motion/InteractionEffects';
import { createNumberFormatter } from 'shared/lib/numberFormat';
import { DashboardPanel, DashboardPattern } from './DashboardPattern';
import { SectionHeading } from './HomePrimitives';
import LeaderboardValue from './LeaderboardValue';

const leaderboards = [
  { key: 'contests', ordering: '-contests_rating__rating', field: 'contestsRating' },
  { key: 'skills', ordering: '-skills_rating', field: 'skillsRating' },
  { key: 'activity', ordering: '-activity_rating', field: 'activityRating' },
  { key: 'challenges', ordering: '-challenges_rating__rating', field: 'challengesRating' },
  { key: 'streak', ordering: '-streak', field: 'streak' },
  { key: 'kepcoin', ordering: '-kepcoin', field: 'kepcoin' },
] as const;

const LeadersSection = ({ compact = false }: { compact?: boolean }) => {
  const { t, i18n } = useTranslation();
  const id = useId();
  const [tab, setTab] = useState(0);
  const [interacting, setInteracting] = useState(false);
  const [visible, setVisible] = useState(!document.hidden);
  const reducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');
  const selected = leaderboards[tab];
  const { data, isLoading, error, mutate } = useUsersList({
    page: 1,
    pageSize: 3,
    ordering: selected.ordering,
  });
  const formatter = useMemo(
    () => createNumberFormatter({ maximumFractionDigits: 1 }),
    [i18n.resolvedLanguage],
  );

  useEffect(() => {
    const updateVisibility = () => setVisible(!document.hidden);
    document.addEventListener('visibilitychange', updateVisibility);
    return () => document.removeEventListener('visibilitychange', updateVisibility);
  }, []);
  useEffect(() => {
    if (interacting || !visible || reducedMotion || isLoading || error) return;
    const timer = window.setTimeout(
      () => setTab((value) => (value + 1) % leaderboards.length),
      5000,
    );
    return () => window.clearTimeout(timer);
  }, [tab, interacting, visible, reducedMotion, isLoading, error]);

  return (
    <DashboardPanel
      className={compact ? 'kep-dashboard-leaders' : 'kep-section kep-dashboard-leaders'}
      onPointerEnter={() => setInteracting(true)}
      onPointerLeave={(event) =>
        setInteracting(event.currentTarget.contains(document.activeElement))
      }
      onFocusCapture={() => setInteracting(true)}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setInteracting(false);
      }}
    >
      {compact ? (
        <div className="kep-dashboard-panel-heading">
          <h2>
            <MixedText>{t('homePage.topUsers.title')}</MixedText>
          </h2>
          <DashboardPattern kind="competitions" inline />
        </div>
      ) : (
        <SectionHeading
          eyebrow={t('homePage.landing.leaders.eyebrow')}
          title={t('homePage.landing.leaders.title')}
          description={t('homePage.landing.leaders.description')}
        />
      )}
      <Tabs
        value={tab}
        onChange={(_, value: number) => setTab(value)}
        variant="scrollable"
        scrollButtons="auto"
        allowScrollButtonsMobile
        className="kep-segmented-tabs"
        aria-label={t('homePage.topUsers.title')}
      >
        {leaderboards.map((board, index) => (
          <Tab
            key={board.key}
            value={index}
            label={
              <span>
                <MixedText>{t(`homePage.topUsers.tabs.${board.key}`)}</MixedText>
              </span>
            }
            id={`${id}-${board.key}`}
            aria-controls={`${id}-results`}
          />
        ))}
      </Tabs>
      <div
        className="kep-three-grid"
        id={`${id}-results`}
        role="tabpanel"
        aria-labelledby={`${id}-${selected.key}`}
        aria-busy={isLoading}
      >
        {error ? (
          <Alert
            severity="error"
            action={<Button onClick={() => void mutate()}>{t('common.retry')}</Button>}
          >
            {t('common.loadFailed')}
          </Alert>
        ) : (
          <>
            {isLoading
              ? [0, 1, 2].map((index) => (
                  <PointerSpotlight key={index} className="kep-leader-card">
                    <div className="kep-leader-loading-row" aria-hidden="true">
                      <span className="kep-leader-rank">
                        <Skeleton width={18} height={18} />
                      </span>
                      <Skeleton
                        variant="circular"
                        width={compact ? 32 : 56}
                        height={compact ? 32 : 56}
                      />
                      <div className="kep-leader-identity">
                        <Skeleton width="85%" height={20} />
                        <Skeleton width="65%" height={15} />
                      </div>
                      <Skeleton width={68} height={compact ? 24 : 34} />
                    </div>
                  </PointerSpotlight>
                ))
              : data?.data.map((user, index) => {
                  const metric = user[selected.field];
                  const value = typeof metric === 'object' ? metric?.value : metric;
                  const number = value == null ? undefined : Number(value);
                  return (
                    <PointerSpotlight
                      key={`${selected.key}-${user.username}`}
                      className="kep-leader-card"
                    >
                      <UserPopover
                        username={user.username}
                        avatar={user.avatar}
                        fullName={[user.firstName, user.lastName].filter(Boolean).join(' ')}
                        countryCode={user.country}
                        streak={user.streak}
                        sx={{ width: '100%' }}
                      >
                        <span
                          className="kep-leader-rank"
                          style={{ color: getRankColor(index + 1, 'var(--kep-muted)') }}
                        >
                          {String(index + 1).padStart(2, '0')}
                        </span>
                        <Avatar
                          src={user.avatar ?? undefined}
                          alt=""
                          sx={{ width: 56, height: 56 }}
                        >
                          {user.username[0]}
                        </Avatar>
                        <span className="kep-leader-identity">
                          <span className="kep-leader-username">
                            <span>{user.username}</span>
                            {user.country && <CountryFlagIcon code={user.country} size={14} />}
                          </span>
                          {(user.firstName || user.lastName) && (
                            <span className="kep-leader-name">
                              {[user.firstName, user.lastName].filter(Boolean).join(' ')}
                            </span>
                          )}
                        </span>
                        <LeaderboardValue
                          kind={selected.key}
                          user={user}
                          value={
                            number !== undefined && Number.isFinite(number)
                              ? formatter.format(number)
                              : '—'
                          }
                        />
                      </UserPopover>
                    </PointerSpotlight>
                  );
                })}
            {!isLoading && !data?.data.length && (
              <p className="kep-empty">{t('homePage.landing.empty')}</p>
            )}
          </>
        )}
      </div>
      <Link
        to={`${resources.Users}?ordering=${encodeURIComponent(selected.ordering)}`}
        className="kep-text-link kep-centered-link"
      >
        {t('homePage.topUsers.viewAll')} <span aria-hidden="true">↗</span>
      </Link>
    </DashboardPanel>
  );
};

export default LeadersSection;
