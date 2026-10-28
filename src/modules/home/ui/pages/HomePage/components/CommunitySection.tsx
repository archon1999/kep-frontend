import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';
import { Alert, Avatar, Button, Skeleton } from '@mui/material';
import { getResourceById, resources } from 'app/routes/resources';
import { useHomeNews, useHomePromos } from 'modules/home/application/queries';
import UserPopover from 'modules/users/ui/shared/components/UserPopover';
import IconifyIcon from 'shared/components/base/IconifyIcon';
import EmptyState from 'shared/components/common/EmptyState';
import MixedText from 'shared/components/common/MixedText';
import { PointerSpotlight, ScrollReveal } from 'shared/components/motion/InteractionEffects';
import { formatDateTime } from 'shared/lib/dateTime';
import { createSafeHtml } from 'shared/lib/safeHtml';
import BirthdaysSection from './BirthdaysSection';
import { DashboardPanel, DashboardPattern } from './DashboardPattern';
import { SectionAction, SectionHeading } from './HomePrimitives';
import UpdatesSection from './UpdatesSection';

export const EventsSection = ({
  compact = false,
  hideWhenEmpty = false,
}: {
  compact?: boolean;
  hideWhenEmpty?: boolean;
}) => {
  const { t } = useTranslation();
  const { data, isLoading, error, mutate } = useHomePromos();
  if (hideWhenEmpty && !isLoading && !error && !data?.length) return null;
  if (compact && !isLoading && !error && !data?.length) {
    return (
      <PointerSpotlight
        element="section"
        className="kep-dashboard-calendar"
        aria-label={t('homePage.dashboard.events')}
      >
        <IconifyIcon
          icon="material-symbols:calendar-month-outline-rounded"
          fontSize={24}
          aria-hidden="true"
        />
        <p>{t('homePage.dashboard.calendarHint')}</p>
        <DashboardPattern kind="competitions" inline />
        <Link className="kep-text-link" to={resources.Calendar}>
          {t('homePage.dashboard.calendar')} <span aria-hidden="true">↗</span>
        </Link>
      </PointerSpotlight>
    );
  }
  return (
    <section
      className={compact ? 'kep-dashboard-panel kep-dashboard-events' : 'kep-section'}
      id="events"
    >
      {compact ? (
        <div className="kep-dashboard-panel-heading">
          <h2>
            <MixedText>{t('homePage.dashboard.events')}</MixedText>
          </h2>
          <DashboardPattern kind="competitions" inline />
        </div>
      ) : (
        <SectionHeading
          eyebrow={t('homePage.landing.events.eyebrow')}
          title={t('homePage.landing.events.title')}
          description={t('homePage.landing.events.description')}
        />
      )}
      <div className="kep-event-grid">
        {isLoading ? (
          <Skeleton height={compact ? 120 : 260} />
        ) : error ? (
          <Alert
            severity="error"
            action={<Button onClick={() => void mutate()}>{t('homePage.landing.retry')}</Button>}
          >
            {t('homePage.landing.loadError')}
          </Alert>
        ) : data?.length ? (
          data.map((promo) => (
            <PointerSpotlight className="kep-event-card" key={promo.id}>
              <span className="kep-eyebrow">
                <span className="kep-live-dot" aria-hidden="true" />
                {promo.typeLabel}
              </span>
              <h3>{promo.title}</h3>
              <p>{promo.subtitle}</p>
              {promo.startTime && (
                <time dateTime={promo.startTime}>
                  {formatDateTime(promo.startTime, 'compactDateTime')}
                </time>
              )}
              <div className="kep-event-metrics">
                {promo.metrics.slice(0, 3).map((metric) => (
                  <span key={metric.label}>
                    <strong>{metric.value}</strong>
                    <small>{metric.label}</small>
                  </span>
                ))}
              </div>
              <SectionAction to={promo.href}>{promo.ctaLabel}</SectionAction>
            </PointerSpotlight>
          ))
        ) : (
          <EmptyState
            compact
            title={t('homePage.dashboard.events')}
            description={t('homePage.landing.events.empty')}
            action={
              <SectionAction to={resources.Contests}>
                {t('homePage.contests.viewAll')}
              </SectionAction>
            }
            sx={{ gridColumn: '1 / -1' }}
          />
        )}
      </div>
    </section>
  );
};

export { default as LeadersSection } from './LeadersSection';

export const CommunitySection = ({
  compact = false,
  title,
}: {
  compact?: boolean;
  title?: string;
}) => {
  const { t } = useTranslation();
  const [index, setIndex] = useState(0);
  const { data, isLoading, error, mutate } = useHomeNews(6);
  const news = (data?.data ?? []).filter((item) => typeof item.blog.id === 'number');
  const post = news.length ? news[index % news.length].blog : undefined;
  const postHref =
    post?.id === undefined ? resources.Blog : getResourceById(resources.BlogPost, post.id);
  const StoryContainer = compact ? 'div' : ScrollReveal;
  return (
    <DashboardPanel className={compact ? 'kep-dashboard-news' : 'kep-section'} id="community">
      {compact ? (
        <div className="kep-dashboard-panel-heading">
          <h2>
            <MixedText>{title ?? t('homePage.dashboard.news')}</MixedText>
          </h2>
          <DashboardPattern kind="blog" inline />
          <Link to={resources.Blog}>{t('homePage.landing.footer.blog')} ↗</Link>
        </div>
      ) : (
        <SectionHeading
          eyebrow={t('homePage.landing.community.eyebrow')}
          title={t('homePage.landing.community.title')}
          description={t('homePage.landing.community.description')}
        />
      )}
      <StoryContainer className="kep-story">
        {isLoading ? (
          <Skeleton height={compact ? 180 : 260} />
        ) : error ? (
          <Alert
            severity="error"
            action={<Button onClick={() => void mutate()}>{t('homePage.landing.retry')}</Button>}
          >
            {t('homePage.landing.loadError')}
          </Alert>
        ) : post ? (
          <div className="kep-story-content" key={post.id}>
            <span className="kep-story-mark" aria-hidden="true">
              ✣
            </span>
            <div>
              <h3>
                <Link to={postHref}>
                  <MixedText>{post.title}</MixedText>
                </Link>
              </h3>
              {post.bodyShort && (
                <div
                  className="kep-story-excerpt"
                  dangerouslySetInnerHTML={createSafeHtml(post.bodyShort)}
                />
              )}
              <div className="kep-story-meta">
                <UserPopover
                  username={post.author.username}
                  avatar={post.author.avatar ?? undefined}
                  sx={{ gap: 1.25 }}
                >
                  <Avatar
                    src={post.author.avatar ?? undefined}
                    alt=""
                    sx={{ width: 32, height: 32 }}
                  />
                  {post.author.username}
                </UserPopover>
                {!compact && (
                  <Link className="kep-text-link" to={postHref}>
                    {t('homePage.landing.read')} ↗
                  </Link>
                )}
              </div>
            </div>
          </div>
        ) : (
          <p>{t('homePage.landing.empty')}</p>
        )}
        {post && (
          <div className={compact ? 'kep-story-footer' : undefined}>
            {compact && (
              <Link className="kep-text-link" to={postHref}>
                {t('homePage.landing.read')} <span aria-hidden="true">↗</span>
              </Link>
            )}
            {news.length > 1 && (
              <div className="kep-story-controls">
                <span aria-live="polite">
                  {(index % news.length) + 1} / {news.length}
                </span>
                <Button
                  onClick={() => setIndex((current) => (current + news.length - 1) % news.length)}
                  aria-label={t('homePage.landing.previous')}
                >
                  ←
                </Button>
                <Button
                  onClick={() => setIndex((current) => (current + 1) % news.length)}
                  aria-label={t('homePage.landing.next')}
                >
                  →
                </Button>
              </div>
            )}
          </div>
        )}
      </StoryContainer>
      {!compact && (
        <div className="kep-community-panels">
          <UpdatesSection />
          <BirthdaysSection />
        </div>
      )}
    </DashboardPanel>
  );
};
