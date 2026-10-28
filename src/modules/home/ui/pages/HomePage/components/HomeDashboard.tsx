import { lazy } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';
import { Alert, Button } from '@mui/material';
import { getResourceByUsername, resources } from 'app/routes/resources';
import type { AuthUser } from 'modules/authentication/domain';
import { useUserActivityHistory } from 'modules/home/application/queries';
import KepIcon from 'shared/components/base/KepIcon';
import MixedText from 'shared/components/common/MixedText';
import PatternArtwork from 'shared/components/common/PatternArtwork';
import DeferredContent from 'shared/components/loading/DeferredContent';
import { PointerSpotlight, ScrambleText } from 'shared/components/motion/InteractionEffects';
import FramedPage from 'shared/components/sections/common/FramedPage';
import { formatDateTime } from 'shared/lib/dateTime';
import BirthdaysSection from './BirthdaysSection';
import { CommunitySection, EventsSection, LeadersSection } from './CommunitySection';
import ContestsSection from './ContestsSection';
import { DashboardPanel, DashboardPattern } from './DashboardPattern';
import DashboardRatings from './DashboardRatings';
import HomeActivityHistory from './HomeActivityHistory';
import { SectionAction } from './HomePrimitives';
import { PlatformStatistics } from './LandingHero';
import UpdatesSection from './UpdatesSection';
import UserActivitySkeleton from './UserActivitySkeleton';

const UserActivitySection = lazy(() => import('./UserActivitySection'));

const shortcuts = [
  {
    key: 'recommend',
    to: `${resources.Problems}?recommend=1`,
    icon: 'practice',
    pattern: 'search',
  },
  { key: 'challenges', to: resources.Challenges, icon: 'challenge', pattern: 'battles' },
  { key: 'projects', to: resources.Projects, icon: 'project', pattern: 'hackathon' },
] as const;

const HomeDashboard = ({ user }: { user: AuthUser }) => {
  const { t } = useTranslation();
  const history = useUserActivityHistory(user.username, 20);
  const name = user.firstName?.trim() || user.username;
  return (
    <FramedPage>
      <div className="kep-dashboard">
        <header className="kep-dashboard-header">
          <div className="kep-dashboard-welcome">
            <span className="kep-eyebrow">
              <span aria-hidden="true">✣</span>
              <time dateTime={new Date().toISOString()}>
                {formatDateTime(new Date(), 'weekdayFullDate')}
              </time>
            </span>
            <h1>
              <MixedText>{t('homePage.dashboard.welcome', { name })}</MixedText>
            </h1>
            <p>{t('homePage.dashboard.description')}</p>
          </div>
          <PatternArtwork
            kind="daily-tasks"
            sx={{ width: 164, display: { xs: 'none', lg: 'block' } }}
          />
          <div className="kep-dashboard-actions">
            <SectionAction to={resources.Problems}>
              {t('homePage.landing.startSolving')}
            </SectionAction>
            <Link
              className="kep-text-link"
              to={getResourceByUsername(resources.AttemptsByUser, user.username)}
            >
              {t('homePage.dashboard.myAttempts')} <span aria-hidden="true">↗</span>
            </Link>
          </div>
        </header>
        <DashboardRatings username={user.username} />
        <nav className="kep-dashboard-shortcuts" aria-label={t('homePage.dashboard.shortcuts')}>
          {shortcuts.map(({ key, to, icon, pattern }) => (
            <PointerSpotlight key={key} className="kep-dashboard-shortcut">
              <DashboardPattern kind={pattern} />
              <Link to={to}>
                <span className="kep-dashboard-shortcut-icon" aria-hidden="true">
                  <KepIcon name={icon} fontSize={24} />
                </span>
                <span className="kep-dashboard-shortcut-copy">
                  <strong>
                    <ScrambleText>{t(`homePage.dashboard.shortcutsTitle.${key}`)}</ScrambleText>
                  </strong>
                  <small>{t(`homePage.dashboard.shortcutsDescription.${key}`)}</small>
                </span>
                <span aria-hidden="true">↗</span>
              </Link>
            </PointerSpotlight>
          ))}
        </nav>
        <div className="kep-dashboard-grid">
          <div className="kep-dashboard-main">
            <div className="kep-dashboard-section">
              <ContestsSection />
            </div>
            <EventsSection compact />
          </div>
          <aside className="kep-dashboard-aside" aria-label={t('homePage.dashboard.personal')}>
            <DashboardPanel className="kep-dashboard-history">
              <div className="kep-dashboard-panel-heading">
                <h2>
                  <MixedText>{t('homePage.activityHistory.title')}</MixedText>
                </h2>
                <DashboardPattern kind="daily-tasks" inline />
                <Link
                  to={getResourceByUsername(resources.UserProfileActivityHistory, user.username)}
                >
                  {t('homePage.dashboard.allActivity')} <span aria-hidden="true">↗</span>
                </Link>
              </div>
              {history.error ? (
                <Alert
                  severity="error"
                  action={
                    <Button onClick={() => void history.mutate()}>
                      {t('homePage.landing.retry')}
                    </Button>
                  }
                >
                  {t('homePage.landing.loadError')}
                </Alert>
              ) : (
                <HomeActivityHistory
                  username={user.username}
                  history={history.data}
                  isLoading={history.isLoading}
                  showTitle={false}
                  compact
                  maxHeight="none"
                  visibleItems={5}
                />
              )}
            </DashboardPanel>
          </aside>
        </div>
        <div className="kep-dashboard-grid">
          <CommunitySection compact />
          <LeadersSection compact />
        </div>
        <div className="kep-dashboard-grid">
          <section
            className="kep-dashboard-updates kep-dashboard-section"
            aria-label={t('homePage.landing.footer.updates')}
          >
            <UpdatesSection compact />
          </section>
          <div className="kep-dashboard-section kep-dashboard-birthdays">
            <BirthdaysSection />
          </div>
        </div>
        <section
          className="kep-dashboard-community kep-dashboard-section"
          aria-label={t('homePage.dashboard.community')}
        >
          <DeferredContent fallback={<UserActivitySkeleton />}>
            <UserActivitySection />
          </DeferredContent>
        </section>
        <section className="kep-dashboard-totals" aria-label={t('homePage.statistics.title')}>
          <PlatformStatistics />
        </section>
      </div>
    </FramedPage>
  );
};
export default HomeDashboard;
